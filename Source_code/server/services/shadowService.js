import Expense from '../models/expenseModel.js';
import Transaction from '../models/transactionModel.js';
import Budgets from '../models/budgetsModel.js';
import Account from '../models/bankModel.js';
import { GoogleGenerativeAI } from '@google/generative-ai';

// ─── Helpers ────────────────────────────────────────────────────────────────

const mean = (arr) => arr.reduce((s, v) => s + v, 0) / (arr.length || 1);

const stdDev = (arr) => {
  const m = mean(arr);
  return Math.sqrt(arr.reduce((s, v) => s + (v - m) ** 2, 0) / (arr.length || 1));
};

const addDays = (date, n) => {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
};

const dateKey = (d) => new Date(d).toISOString().split('T')[0];

// ─── 1. Analyse Spending Patterns ────────────────────────────────────────────

/**
 * Returns an array of category pattern objects sorted by volatility (desc).
 * Each object: { category, avgMonthly, volatility, monthlyAmounts, isRecurring }
 */
export async function analyzeSpendingPatterns(userId) {
  const since = new Date();
  since.setDate(since.getDate() - 90); // last 90 days

  const expenses = await Expense.find({
    user: userId,
    date: { $gte: since },
  }).sort({ date: 1 });

  // Group by category → monthly buckets
  const catMap = {};
  for (const exp of expenses) {
    const cat = exp.category || 'Uncategorized';
    const monthKey = `${new Date(exp.date).getFullYear()}-${new Date(exp.date).getMonth()}`;
    if (!catMap[cat]) catMap[cat] = {};
    catMap[cat][monthKey] = (catMap[cat][monthKey] || 0) + exp.amount;
  }

  const patterns = Object.entries(catMap).map(([category, monthly]) => {
    const amounts = Object.values(monthly);
    const avgMonthly = mean(amounts);
    const vol = stdDev(amounts);
    return {
      category,
      avgMonthly: Math.round(avgMonthly * 100) / 100,
      volatility: Math.round(vol * 100) / 100,
      monthlyAmounts: amounts,
      isRecurring: vol < avgMonthly * 0.15 && amounts.length >= 2, // stable = recurring
    };
  });

  // Sort by volatility descending (sneakiest first)
  return patterns.sort((a, b) => b.volatility - a.volatility);
}

// ─── 2. Predict Next Bills ────────────────────────────────────────────────────

/**
 * Returns an array of predicted bill events within the next 14 days.
 * { date, label, estimatedAmount }
 */
export async function predictNextBills(userId) {
  const budgets = await Budgets.find({ user: userId });

  // Also mine transactions for recurring merchant patterns
  const since = new Date();
  since.setDate(since.getDate() - 60);
  const transactions = await Transaction.find({
    userId,
    date: { $gte: since },
    amount: { $gt: 50 }, // only meaningful charges
  });

  const bills = [];
  const today = new Date();

  // Budget-derived monthly bills — assume they fall near start of month
  for (const budget of budgets) {
    if (budget.period === 'monthly') {
      // Try to predict day-of-month from past transactions for that category
      const catTxns = transactions.filter((t) =>
        t.category?.some((c) => c.toLowerCase().includes(budget.category.toLowerCase()))
      );
      let dayOfMonth = 1; // fallback to 1st
      if (catTxns.length > 0) {
        const days = catTxns.map((t) => new Date(t.date).getDate());
        dayOfMonth = Math.round(mean(days));
      }

      // Build target date in current or next month
      let target = new Date(today.getFullYear(), today.getMonth(), dayOfMonth);
      if (target < today) {
        target = new Date(today.getFullYear(), today.getMonth() + 1, dayOfMonth);
      }
      const daysAhead = Math.round((target - today) / 86400000);
      if (daysAhead >= 0 && daysAhead <= 14) {
        bills.push({
          date: dateKey(target),
          label: `${budget.category} budget`,
          estimatedAmount: budget.amount,
          type: 'budget',
        });
      }
    }

    if (budget.period === 'weekly') {
      // One hit per week within 14 days
      for (let w = 0; w <= 2; w++) {
        const target = addDays(today, w * 7);
        const daysAhead = Math.round((target - today) / 86400000);
        if (daysAhead <= 14) {
          bills.push({
            date: dateKey(target),
            label: `Weekly: ${budget.category}`,
            estimatedAmount: budget.amount,
            type: 'budget',
          });
        }
      }
    }
  }

  // Transaction-derived recurring merchants (appear in same ±3 day window each month)
  const merchantMap = {};
  for (const txn of transactions) {
    const key = txn.merchantName || txn.name;
    if (!key) continue;
    if (!merchantMap[key]) merchantMap[key] = [];
    merchantMap[key].push({ day: new Date(txn.date).getDate(), amount: txn.amount });
  }

  for (const [merchant, hits] of Object.entries(merchantMap)) {
    if (hits.length < 2) continue; // need at least 2 occurrences
    const days = hits.map((h) => h.day);
    const avgDay = Math.round(mean(days));
    const dayVol = stdDev(days);
    if (dayVol <= 3) {
      // Appears reliably on the same day
      let target = new Date(today.getFullYear(), today.getMonth(), avgDay);
      if (target < today) {
        target = new Date(today.getFullYear(), today.getMonth() + 1, avgDay);
      }
      const daysAhead = Math.round((target - today) / 86400000);
      if (daysAhead >= 0 && daysAhead <= 14) {
        const avgAmt = mean(hits.map((h) => h.amount));
        bills.push({
          date: dateKey(target),
          label: merchant,
          estimatedAmount: Math.round(avgAmt * 100) / 100,
          type: 'recurring_merchant',
        });
      }
    }
  }

  return bills;
}

// ─── 3. 14-Day Balance Simulation ────────────────────────────────────────────

/**
 * Returns array of 14 day objects:
 * { date, projectedBalance, events: [{ label, amount }], isWarning }
 */
export async function simulate14DayBalance(userId) {
  // Get current balance — prefer Plaid linked accounts
  const accounts = await Account.find({ userId });
  let startingBalance = 0;
  if (accounts.length > 0) {
    startingBalance = accounts.reduce((sum, acc) => {
      const bal = acc.balance?.available ?? acc.balance?.current ?? 0;
      return sum + bal;
    }, 0);
  } else {
    // Fallback: use monthly income minus total monthly expenses so far this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    const monthExpenses = await Expense.find({
      user: userId,
      date: { $gte: startOfMonth },
    });
    const spent = monthExpenses.reduce((s, e) => s + e.amount, 0);
    // We don't have income stored, so use a conservative 2000 default minus spent
    startingBalance = Math.max(2000 - spent, 0);
  }

  // Average daily discretionary spend (from last 30 days expenses)
  const since30 = new Date();
  since30.setDate(since30.getDate() - 30);
  const recentExpenses = await Expense.find({ user: userId, date: { $gte: since30 } });
  const total30 = recentExpenses.reduce((s, e) => s + e.amount, 0);
  const avgDailySpend = total30 / 30;

  const bills = await predictNextBills(userId);

  // Index bills by date
  const billsByDate = {};
  for (const bill of bills) {
    if (!billsByDate[bill.date]) billsByDate[bill.date] = [];
    billsByDate[bill.date].push(bill);
  }

  // Run simulation
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const simulation = [];
  let balance = startingBalance;

  for (let i = 0; i < 14; i++) {
    const day = addDays(today, i);
    const key = dateKey(day);
    const events = billsByDate[key] || [];

    // Subtract predicted bills
    const billDrain = events.reduce((s, b) => s + b.estimatedAmount, 0);
    // Subtract daily discretionary (less on days we have fixed bill — already conservative)
    balance -= avgDailySpend + billDrain;
    balance = Math.round(balance * 100) / 100;

    simulation.push({
      date: key,
      projectedBalance: balance,
      events: events.map((b) => ({ label: b.label, amount: b.estimatedAmount })),
      isWarning: balance < 100,
    });
  }

  return { simulation, startingBalance: Math.round(startingBalance), avgDailySpend: Math.round(avgDailySpend * 100) / 100 };
}

// ─── 4. Detect Shortfalls ────────────────────────────────────────────────────

/**
 * Groups all at-risk days into contiguous "shortfall windows" and returns
 * ONE comprehensive alert per window — not one per day.
 *
 * A window breaks when a safe day (balance >= 100) appears after a danger day.
 *
 * Each alert: {
 *   id, startDate, endDate, durationDays,
 *   worstDate, worstBalance, severity,
 *   allTriggers: [{ label, amount }],
 *   totalBillExposure,
 *   recommendation: null   ← filled by Gemini
 * }
 */
export function detectShortfalls(simulation) {
  const windows = [];
  let current = null;

  for (const day of simulation) {
    if (day.projectedBalance < 100) {
      if (!current) {
        // Start a new window
        current = {
          days: [],
          allEvents: [],
        };
      }
      current.days.push(day);
      if (day.events && day.events.length > 0) {
        current.allEvents.push(...day.events);
      }
    } else {
      if (current) {
        windows.push(current);
        current = null;
      }
    }
  }
  // Don't forget a window that runs to end of simulation
  if (current) windows.push(current);

  // Shape each window into a single comprehensive alert object
  return windows.map((w, idx) => {
    const worstDay = w.days.reduce((a, b) =>
      b.projectedBalance < a.projectedBalance ? b : a
    );
    const startDate = w.days[0].date;
    const endDate = w.days[w.days.length - 1].date;
    const duration = w.days.length;

    // Deduplicate bill events by label
    const billMap = {};
    for (const ev of w.allEvents) {
      if (!billMap[ev.label]) billMap[ev.label] = 0;
      billMap[ev.label] += ev.amount;
    }
    const allTriggers = Object.entries(billMap).map(([label, amount]) => ({
      label,
      amount: Math.round(amount * 100) / 100,
    }));
    const totalBillExposure = allTriggers.reduce((s, t) => s + t.amount, 0);

    const hasCritical = worstDay.projectedBalance < 0;

    return {
      id: `shortfall-window-${idx}-${startDate}`,
      startDate,
      endDate,
      durationDays: duration,
      worstDate: worstDay.date,
      worstBalance: Math.round(worstDay.projectedBalance * 100) / 100,
      severity: hasCritical ? 'critical' : 'warning',
      allTriggers,
      totalBillExposure: Math.round(totalBillExposure * 100) / 100,
      recommendation: null,
    };
  });
}

// ─── 5. Gemini Narrative Generation ─────────────────────────────────────────

/**
 * Generates ONE comprehensive 3-sentence narrative per shortfall window.
 */
export async function generateShortfallNarratives(shortfalls, context) {
  if (shortfalls.length === 0) return shortfalls;

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const enriched = await Promise.all(
      shortfalls.map(async (s) => {
        const triggersText = s.allTriggers.length > 0
          ? s.allTriggers.map(t => `${t.label} ($${t.amount})`).join(', ')
          : 'accumulated daily discretionary spending';

        const periodText = s.durationDays === 1
          ? `on ${s.startDate}`
          : `from ${s.startDate} to ${s.endDate} (${s.durationDays} days)`;

        const prompt = `You are a proactive AI financial guardian called "Money Mentor Shadow".

Here is a summary of an upcoming financial risk period for a user:
- Risk window: ${periodText}
- Worst projected balance: $${s.worstBalance.toFixed(2)} on ${s.worstDate}
- Main cost drivers: ${triggersText}
- Total upcoming bill exposure in this window: $${s.totalBillExposure.toFixed(2)}
- User's current balance: $${context.startingBalance}
- Average daily spending: $${context.avgDailySpend}/day

Write exactly 3 sentences:
1. A clear, calm summary of the overall risk window and how serious it is.
2. What is causing it (reference specific bills or spending patterns).
3. One concrete, specific action the user can take RIGHT NOW to prevent or reduce the shortfall.

Do NOT use markdown. Write in a warm, knowledgeable tone like a trusted financial advisor.`;

        try {
          const result = await model.generateContent(prompt);
          return { ...s, recommendation: result.response.text().trim() };
        } catch (_) {
          return {
            ...s,
            recommendation: `Your balance is projected to drop to $${s.worstBalance.toFixed(2)} ${periodText} due to ${triggersText}. With $${s.totalBillExposure.toFixed(2)} in upcoming charges, this is a significant risk to your cash flow. Consider pausing non-essential spending or transferring funds to cover this gap before ${s.startDate}.`,
          };
        }
      })
    );

    return enriched;
  } catch (_) {
    return shortfalls.map((s) => ({
      ...s,
      recommendation: `Your balance is projected to reach $${s.worstBalance.toFixed(2)} between ${s.startDate} and ${s.endDate}. The main contributors are ${s.allTriggers.map(t => t.label).join(', ') || 'daily spending'}. Reducing discretionary purchases now can help you avoid this shortfall.`,
    }));
  }
}

// ─── 6.  Overall Shadow Report ───────────────────────────────────────────────

/**
 * Full pipeline: patterns → simulation → shortfalls → narratives
 */
export async function generateShadowReport(userId) {
  const [patterns, simResult] = await Promise.all([
    analyzeSpendingPatterns(userId),
    simulate14DayBalance(userId),
  ]);

  const { simulation, startingBalance, avgDailySpend } = simResult;
  const rawShortfalls = detectShortfalls(simulation);
  const shortfalls = await generateShortfallNarratives(rawShortfalls, {
    startingBalance,
    avgDailySpend,
  });

  return {
    generatedAt: new Date().toISOString(),
    startingBalance,
    avgDailySpend,
    simulation,
    shortfalls,
    patterns: patterns.slice(0, 5), // top 5 volatile categories
    allClear: shortfalls.length === 0,
  };
}
