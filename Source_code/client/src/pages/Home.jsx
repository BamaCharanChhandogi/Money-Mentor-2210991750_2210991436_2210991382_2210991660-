import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Wallet,
  TrendingDown,
  TrendingUp,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  PieChart,
  BarChart3,
  Plus,
  Eye,
  EyeOff,
  Sparkles,
  Activity,
  Target,
  ChevronRight,
  Clock,
} from "lucide-react";
import { BASE_URL } from "../api";
import { Link, useNavigate } from "react-router-dom";
import FinancialHealthScore from "../components/FinancialHealthScore";

function Home() {
  const navigate = useNavigate();
  const [financialData, setFinancialData] = useState({
    totalBalance: 0,
    monthlyExpenses: 0,
    investments: 0,
    transactions: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUnauthenticated, setIsUnauthenticated] = useState(false);
  const [showBalance, setShowBalance] = useState(true);

  useEffect(() => {
    const fetchFinancialData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsUnauthenticated(true);
        setLoading(false);
        return;
      }

      try {
        const [
          balanceResponse,
          expensesResponse,
          investmentsResponse,
          transactionsResponse,
        ] = await Promise.all([
          axios.get(`${BASE_URL}/bank-accounts`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${BASE_URL}/expenses`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${BASE_URL}/investments`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${BASE_URL}/transactions`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setFinancialData({
          totalBalance:
            balanceResponse.data.reduce(
              (acc, current) => acc + (current.balance?.current || 0),
              0
            ) || 0,
          monthlyExpenses:
            expensesResponse.data
              .map((expense) => expense.amount)
              .reduce((a, b) => a + b, 0) || 0,
          investments:
            investmentsResponse.data
              .map((investment) => investment.quantity * investment.currentPrice)
              .reduce((a, b) => a + b, 0) || 0,
          transactions: transactionsResponse.data.slice(0, 10),
        });
        setLoading(false);
      } catch (err) {
        console.error("Error fetching financial data:", err);
        if (err.response?.status === 401) {
          setIsUnauthenticated(true);
        } else {
          setError("Failed to load financial data");
        }
        setLoading(false);
      }
    };

    fetchFinancialData();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  if (loading) {
    return (
      <section className="min-h-screen bg-mesh flex items-center justify-center">
        <div className="glass-card p-12 text-center scale-in">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-xl font-semibold text-slate-700">
            Loading your financial dashboard...
          </p>
        </div>
      </section>
    );
  }

  if (isUnauthenticated) {
    return (
      <section className="min-h-screen bg-mesh flex items-center justify-center">
        <div className="glass-card p-12 text-center max-w-sm scale-in shadow-xl border border-white/20">
          <div className="bg-gradient-to-br from-primary-500 to-purple-600 p-4 rounded-2xl w-16 h-16 mx-auto mb-6 flex items-center justify-center shadow-lg">
            <Wallet className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-display font-bold text-slate-900 mb-2">
            Welcome to Money-Mentor
          </h2>
          <p className="text-slate-600 mb-6">
            Please log in to access your financial dashboard.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="btn-primary w-full py-3 font-semibold shadow-lg shadow-primary-500/20 hover:shadow-primary-500/40 transition-all duration-300"
          >
            Log In
          </button>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="min-h-screen bg-mesh flex items-center justify-center">
        <div className="glass-card p-12 text-center max-w-md scale-in">
          <div className="bg-red-100 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
            <TrendingDown className="h-10 w-10 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Oops!</h2>
          <p className="text-slate-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary mt-6"
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  const totalBalance = financialData.totalBalance;
  const netWorth = totalBalance + financialData.investments;
  const enrichedFinancialData = { ...financialData, netWorth };

  const savingsRate =
    netWorth > 0
      ? Math.min(
          100,
          Math.round(
            ((netWorth - financialData.monthlyExpenses) / netWorth) * 100
          )
        )
      : 0;

  return (
    <section className="min-h-screen bg-mesh py-10">
      <div className="container mx-auto px-4 lg:px-8 max-w-7xl">

        {/* ── Hero Header ── */}
        <div className="relative mb-10 fade-in-up overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 via-primary-700 to-purple-700 p-8 md:p-10 shadow-2xl">
          {/* decorative circles */}
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-purple-400/20 rounded-full blur-2xl pointer-events-none" />

          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-white/20 text-white/90 text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-sm flex items-center gap-1">
                  <Activity className="h-3 w-3" /> Live Dashboard
                </span>
              </div>
              <h1 className="text-3xl md:text-5xl font-display font-bold text-white mb-2 leading-tight">
                Financial Overview
              </h1>
              <p className="text-primary-200 text-base md:text-lg">
                Track, manage, and grow your wealth — all in one place.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/transactions"
                className="flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white px-5 py-2.5 rounded-xl font-semibold text-sm backdrop-blur-sm transition-all duration-300 border border-white/20"
              >
                <BarChart3 className="h-4 w-4" />
                View All
              </Link>
              <button className="flex items-center gap-2 bg-white text-primary-700 hover:bg-primary-50 px-5 py-2.5 rounded-xl font-semibold text-sm shadow-lg transition-all duration-300 hover:scale-105">
                <Plus className="h-4 w-4" />
                Add Transaction
              </button>
            </div>
          </div>
        </div>

        {/* ── Financial Health Score ── */}
        <div className="mb-10 fade-in-up" style={{ animationDelay: "0.05s" }}>
          <FinancialHealthScore financialData={enrichedFinancialData} />
        </div>

        {/* ── Stat Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-10">
          {/* Total Balance */}
          <div
            className="stat-card-gradient bg-gradient-to-br from-primary-500 to-primary-700 fade-in-up"
            style={{ animationDelay: "0.1s" }}
          >
            <div className="flex items-start justify-between mb-5">
              <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                <Wallet className="h-5 w-5 text-white" />
              </div>
              <button
                onClick={() => setShowBalance(!showBalance)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                {showBalance ? (
                  <Eye className="h-4 w-4 text-white/80" />
                ) : (
                  <EyeOff className="h-4 w-4 text-white/80" />
                )}
              </button>
            </div>
            <p className="text-white/70 text-xs font-medium uppercase tracking-widest mb-1">
              Total Balance
            </p>
            <p className="text-3xl font-bold text-white mb-4">
              {showBalance ? formatCurrency(totalBalance) : "••••••"}
            </p>
            <div className="w-full bg-white/20 rounded-full h-1.5">
              <div
                className="bg-white rounded-full h-1.5 transition-all duration-700"
                style={{ width: "72%" }}
              />
            </div>
            <p className="text-white/60 text-xs mt-2">Real-time balance</p>
          </div>

          {/* Monthly Expenses */}
          <div
            className="stat-card-gradient bg-gradient-to-br from-rose-500 to-red-700 fade-in-up"
            style={{ animationDelay: "0.15s" }}
          >
            <div className="flex items-start justify-between mb-5">
              <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                <TrendingDown className="h-5 w-5 text-white" />
              </div>
              <span className="bg-white/20 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                This Month
              </span>
            </div>
            <p className="text-white/70 text-xs font-medium uppercase tracking-widest mb-1">
              Total Expenses
            </p>
            <p className="text-3xl font-bold text-white mb-4">
              {formatCurrency(financialData.monthlyExpenses)}
            </p>
            <div className="w-full bg-white/20 rounded-full h-1.5">
              <div
                className="bg-white rounded-full h-1.5 transition-all duration-700"
                style={{ width: "58%" }}
              />
            </div>
            <p className="text-white/60 text-xs mt-2">Accumulated expenses</p>
          </div>

          {/* Investments */}
          <div
            className="stat-card-gradient bg-gradient-to-br from-emerald-500 to-emerald-700 fade-in-up"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="flex items-start justify-between mb-5">
              <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <span className="bg-white/20 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                Growing
              </span>
            </div>
            <p className="text-white/70 text-xs font-medium uppercase tracking-widest mb-1">
              Investments
            </p>
            <p className="text-3xl font-bold text-white mb-4">
              {formatCurrency(financialData.investments)}
            </p>
            <div className="w-full bg-white/20 rounded-full h-1.5">
              <div
                className="bg-white rounded-full h-1.5 transition-all duration-700"
                style={{ width: "45%" }}
              />
            </div>
            <p className="text-white/60 text-xs mt-2">Portfolio value</p>
          </div>

          {/* Net Worth */}
          <div
            className="stat-card-gradient bg-gradient-to-br from-violet-500 to-purple-700 fade-in-up"
            style={{ animationDelay: "0.25s" }}
          >
            <div className="flex items-start justify-between mb-5">
              <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="bg-white/20 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                Net
              </span>
            </div>
            <p className="text-white/70 text-xs font-medium uppercase tracking-widest mb-1">
              Net Worth
            </p>
            <p className="text-3xl font-bold text-white mb-4">
              {formatCurrency(netWorth)}
            </p>
            <div className="w-full bg-white/20 rounded-full h-1.5">
              <div
                className="bg-white rounded-full h-1.5 transition-all duration-700"
                style={{ width: `${Math.min(savingsRate, 100)}%` }}
              />
            </div>
            <p className="text-white/60 text-xs mt-2">Cash + Investments</p>
          </div>
        </div>

        {/* ── Main Content Row ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">

          {/* Quick Actions (1/3 width) */}
          <div className="fade-in-up" style={{ animationDelay: "0.3s" }}>
            <h2 className="text-lg font-display font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Target className="h-5 w-5 text-primary-500" />
              Quick Actions
            </h2>
            <div className="flex flex-col gap-4">
              <Link
                to="/services/expenses"
                className="glass-card p-5 flex items-center gap-4 hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 group"
              >
                <div className="bg-gradient-to-br from-orange-400 to-orange-600 p-3.5 rounded-2xl shadow-md group-hover:shadow-orange-400/40 transition-shadow shrink-0">
                  <PieChart className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 text-sm">Track Expenses</p>
                  <p className="text-slate-500 text-xs">Manage your spending</p>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-primary-500 group-hover:translate-x-1 transition-all" />
              </Link>

              <Link
                to="/services/budgets"
                className="glass-card p-5 flex items-center gap-4 hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 group"
              >
                <div className="bg-gradient-to-br from-blue-400 to-blue-600 p-3.5 rounded-2xl shadow-md group-hover:shadow-blue-400/40 transition-shadow shrink-0">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 text-sm">Budget Planning</p>
                  <p className="text-slate-500 text-xs">Set financial goals</p>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-primary-500 group-hover:translate-x-1 transition-all" />
              </Link>

              <Link
                to="/services/investments"
                className="glass-card p-5 flex items-center gap-4 hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 group"
              >
                <div className="bg-gradient-to-br from-emerald-400 to-emerald-600 p-3.5 rounded-2xl shadow-md group-hover:shadow-emerald-400/40 transition-shadow shrink-0">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 text-sm">Investments</p>
                  <p className="text-slate-500 text-xs">Grow your wealth</p>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-primary-500 group-hover:translate-x-1 transition-all" />
              </Link>
            </div>

            {/* Savings Rate Widget */}
            <div className="mt-4 glass-card p-5 fade-in-up" style={{ animationDelay: "0.35s" }}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-slate-700">Savings Rate</p>
                <span className="text-primary-600 font-bold text-sm">{savingsRate}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5">
                <div
                  className="bg-gradient-to-r from-primary-500 to-emerald-500 h-2.5 rounded-full transition-all duration-700"
                  style={{ width: `${Math.max(0, savingsRate)}%` }}
                />
              </div>
              <p className="text-slate-400 text-xs mt-2">
                {savingsRate >= 20
                  ? "Great savings discipline!"
                  : "Try to save at least 20%"}
              </p>
            </div>
          </div>

          {/* Recent Transactions (2/3 width) */}
          <div className="lg:col-span-2 fade-in-up" style={{ animationDelay: "0.3s" }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-display font-bold text-slate-800 flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary-500" />
                Recent Transactions
              </h2>
              <Link
                to="/transactions"
                className="text-primary-600 hover:text-primary-700 font-semibold text-sm flex items-center gap-1 group"
              >
                View All
                <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>

            <div className="glass-card overflow-hidden">
              {financialData.transactions.length > 0 ? (
                <div className="divide-y divide-slate-100/60">
                  {financialData.transactions.map((transaction, index) => (
                    <div
                      key={transaction._id || index}
                      className="flex items-center justify-between px-5 py-4 hover:bg-white/60 transition-colors duration-200 group"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`p-2.5 rounded-xl shrink-0 ${
                            transaction.amount > 0
                              ? "bg-emerald-50 border border-emerald-100"
                              : "bg-red-50 border border-red-100"
                          }`}
                        >
                          {transaction.amount > 0 ? (
                            <ArrowUpRight className="h-4 w-4 text-emerald-600" />
                          ) : (
                            <ArrowDownRight className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800 text-sm">
                            {transaction.merchantName || "Unknown Merchant"}
                          </p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <Clock className="h-3 w-3 text-slate-400" />
                            <p className="text-xs text-slate-400">
                              {new Date(transaction.date).toLocaleDateString(
                                "en-US",
                                { month: "short", day: "numeric", year: "numeric" }
                              )}
                            </p>
                            {transaction.category && (
                              <>
                                <span className="text-slate-300">·</span>
                                <span className="text-xs text-slate-400 capitalize">
                                  {transaction.category}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <p
                        className={`text-sm font-bold tabular-nums ${
                          transaction.amount > 0
                            ? "text-emerald-600"
                            : "text-red-500"
                        }`}
                      >
                        {transaction.amount > 0 ? "+" : ""}
                        {formatCurrency(Math.abs(transaction.amount))}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 px-8">
                  <div className="bg-slate-100 rounded-full p-6 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                    <CreditCard className="h-10 w-10 text-slate-400" />
                  </div>
                  <p className="text-slate-600 font-semibold mb-1">
                    No transactions yet
                  </p>
                  <p className="text-slate-400 text-sm mb-5">
                    Add your first transaction to get started
                  </p>
                  <button className="btn-primary text-sm px-5 py-2.5">
                    <Plus className="h-4 w-4 inline mr-1.5" />
                    Add Transaction
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Home;