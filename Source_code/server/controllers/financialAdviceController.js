import Expense from "../models/expenseModel.js";
import Budget from "../models/budgetsModel.js";
import BankAccount from "../models/bankModel.js";
import Investment from "../models/InvestmentModel.js";
import {
  analyzeBudgetAdherence,
  analyzeExpenses,
  getFinancialAdvice,
} from "../services/financialAdviceService.js";
export const getAdvice = async (req, res) => {
  try {
    // Gather user's financial data
    const expenses = await Expense.find({ user: req.user._id });
    const budgets = await Budget.find({ user: req.user._id });
    const bankAccounts = await BankAccount.find({ user: req.user._id });
    const investments = await Investment.find({ user: req.user._id });

    // Calculate some financial metrics
    const totalExpenses = expenses.reduce(
      (sum, expense) => sum + expense.amount,
      0,
    );
    const totalBudget = budgets.reduce((sum, budget) => sum + budget.amount, 0);
    const totalBankBalance = bankAccounts.reduce(
      (sum, account) => sum + account.balance,
      0,
    );
    const totalInvestmentValue = investments.reduce(
      (sum, investment) => sum + investment.quantity * investment.currentPrice,
      0,
    );

    const financialData = {
      monthlyIncome: req.user.monthlyIncome, // Assuming this field exists in your User model
      totalExpenses,
      totalBudget,
      totalBankBalance,
      totalInvestmentValue,
      expenseCategories: expenses.map((e) => e.category),
      investmentTypes: investments.map((i) => i.type),
    };

    // Get AI-generated advice
    const advice = await getFinancialAdvice(financialData);

    res.json({ advice });
  } catch (error) {
    console.error("Error getting financial advice:", error);
    res
      .status(500)
      .json({ error: "An error occurred while getting financial advice" });
  }
};
export const getAnalysisExpenses = async (req, res) => {
  try {
    const analysis = await analyzeExpenses(req.user._id);
    res.json(analysis);
  } catch (error) {
    console.error("Error analyzing expenses:", error);
    res
      .status(500)
      .json({ error: "An error occurred while analyzing expenses" });
  }
};
export const getBudgetAdherence = async (req, res) => {
  try {
    const adherence = await analyzeBudgetAdherence(req.user._id);
    res.json(adherence);
  } catch (error) {
    console.error("Error analyzing budget adherence:", error);
    res
      .status(500)
      .json({ error: "An error occurred while analyzing budget adherence" });
  }
};
