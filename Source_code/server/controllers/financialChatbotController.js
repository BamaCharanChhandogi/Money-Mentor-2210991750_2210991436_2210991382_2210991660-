import User from "../models/userModel.js";
import Expense from "../models/expenseModel.js";
import Budget from "../models/budgetsModel.js";
import BankAccount from "../models/bankModel.js";
import Investment from "../models/InvestmentModel.js";
import { getFinancialAdvice } from "../services/chatGeminiService.js";

/**
 * Handles incoming chatbot queries from the user about their personal finances.
 * Compiles a comprehensive context including income, expenses, budgets, accounts,
 * and investments to provide AI-powered, context-aware financial advice.
 *
 * @param {Object} req - The Express request object containing the user's message.
 * @param {Object} res - The Express response object used to reply with AI advice.
 */
export const financialChatbot = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Gather user's financial context
    const user = await User.findById(req.user._id);
    const expenses = await Expense.find({ user: req.user._id });
    const budgets = await Budget.find({ user: req.user._id });
    const bankAccounts = await BankAccount.find({ user: req.user._id });
    const investments = await Investment.find({ user: req.user._id });

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

    const userContext = {
      monthlyIncome: user.monthlyIncome,
      totalExpenses,
      totalBudget,
      totalBankBalance,
      totalInvestmentValue,
      expenseCategories: [...new Set(expenses.map((e) => e.category))],
      investmentTypes: [...new Set(investments.map((i) => i.type))],
    };

    const advice = await getFinancialAdvice(userContext, message);
    res.json({ response: advice });
  } catch (error) {
    console.error("Error in financial chatbot:", error);
    res
      .status(500)
      .json({ error: "An error occurred while processing your request" });
  }
};
