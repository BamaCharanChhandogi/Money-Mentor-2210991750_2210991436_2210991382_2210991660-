import Expense from '../models/expenseModel.js';
import Budget from '../models/budgetsModel.js';
import { GoogleGenerativeAI } from "@google/generative-ai";


export async function analyzeExpenses(userId) {
    const expenses = await Expense.find({ user: userId }).sort('-date');
    const totalExpense = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const categorySums = {};
    
    expenses.forEach(expense => {
        if (categorySums[expense.category]) {
            categorySums[expense.category] += expense.amount;
        } else {
            categorySums[expense.category] = expense.amount;
        }
    });

    const topExpenseCategories = Object.entries(categorySums)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3);

    return {
        totalExpense,
        topExpenseCategories
    };
}

export async function analyzeBudgetAdherence(userId) {
    const budgets = await Budget.find({ user: userId });
    const adherenceResults = [];

    for (const budget of budgets) {
        const expenses = await Expense.find({
            user: userId,
            category: budget.category,
            date: { $gte: budget.startDate }
        });

        const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
        const adherencePercentage = (totalSpent / budget.amount) * 100;

        adherenceResults.push({
            category: budget.category,
            budgetAmount: budget.amount,
            spent: totalSpent,
            adherencePercentage
        });
    }

    return adherenceResults;
}

export async function getFinancialAdvice(financialData) {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite-preview" });

    const prompt = `
As a financial advisor, provide personalized advice based on the following financial data:

${JSON.stringify(financialData, null, 2)}

Please provide advice on:
1. Budgeting
2. Savings strategies
3. Investment recommendations
4. Debt management (if applicable)
5. Long-term financial planning

Give specific, actionable advice tailored to this individual's financial situation.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error in getFinancialAdvice:", error);
    if (error.status === 429) {
      return "The AI service is currently reaching its free-tier limits (Quota Exceeded). Please try again in a few minutes.";
    }
    return "I'm sorry, I couldn't generate advice at this time. Please check your connection or try again later.";
  }
}