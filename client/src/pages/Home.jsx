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
  LogIn,
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
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          axios.get(`${BASE_URL}/expenses`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          axios.get(`${BASE_URL}/investments`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          axios.get(`${BASE_URL}/transactions`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);
        setFinancialData({
          totalBalance:
            balanceResponse.data.reduce((acc, current) => acc + (current.balance?.current || 0), 0) || 0,
          monthlyExpenses:
            expensesResponse.data
              .map((expense) => expense.amount)
              .reduce((a, b) => a + b, 0) || 0,
          investments:
            investmentsResponse.data
              .map((investment) => (investment.quantity * investment.currentPrice))
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
          <p className="text-xl font-semibold text-slate-700">Loading your financial dashboard...</p>
        </div>
      </section>
    );
  }

  if (isUnauthenticated) {
    return (
      <section style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f0e8 0%, #ede5d0 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Inter', sans-serif",
      }}>
        <div style={{
          background: '#2c2a20',
          borderRadius: 20,
          padding: '2.8rem 2.5rem',
          width: '100%',
          maxWidth: 380,
          textAlign: 'center',
          boxShadow: '0 24px 60px rgba(0,0,0,0.25)',
          border: '1px solid rgba(201,168,76,0.2)',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* ambient glow */}
          <div style={{ position: 'absolute', top: -60, left: '50%', transform: 'translateX(-50%)', width: 240, height: 160, background: 'radial-gradient(ellipse, rgba(201,168,76,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />

          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', marginBottom: '1.6rem', position: 'relative' }}>
            <div style={{ width: 36, height: 36, borderRadius: 9, background: '#3a3828', border: '1px solid rgba(201,168,76,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" />
              </svg>
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ color: '#e8dfc0', fontWeight: 700, fontSize: '0.95rem', fontFamily: "'Outfit', sans-serif", lineHeight: 1.1 }}>Money Mentor</div>
              <div style={{ color: '#6a6248', fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Smart Finance</div>
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: 'rgba(201,168,76,0.12)', marginBottom: '1.6rem' }} />

          <h2 style={{ color: '#e8dfc0', fontWeight: 800, fontSize: '1.45rem', fontFamily: "'Outfit', sans-serif", lineHeight: 1.15, marginBottom: '0.7rem' }}>
            Welcome to Money-Mentor
          </h2>
          <p style={{ color: '#7a7258', fontSize: '0.88rem', lineHeight: 1.65, marginBottom: '1.8rem' }}>
            Please log in to access your financial dashboard.
          </p>

          <button
            onClick={() => navigate("/login")}
            style={{
              width: '100%',
              background: '#c9a84c',
              color: '#1a1810',
              border: 'none',
              borderRadius: 11,
              padding: '0.85rem 1.5rem',
              fontSize: '0.92rem',
              fontWeight: 700,
              cursor: 'pointer',
              letterSpacing: '0.02em',
              transition: 'background 0.2s, transform 0.15s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#d4b558'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#c9a84c'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            <LogIn size={16} />
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

  // Add calculated fields to financialData object for the Score component
  const enrichedFinancialData = {
    ...financialData,
    netWorth
  };

  return (
    <section className="min-h-screen bg-mesh py-12">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="mb-12 fade-in-up">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div>
              <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-2">
                Financial Dashboard
              </h1>
              <p className="text-slate-600 text-lg">
                Welcome back! Here's your financial overview
              </p>
            </div>
            <div className="flex space-x-3">
              <Link to="/transactions" className="btn-outline flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>View All</span>
              </Link>
              <button className="btn-primary flex items-center space-x-2">
                <Plus className="h-5 w-5" />
                <span>Add Transaction</span>
              </button>
            </div>
          </div>
        </div>

        {/* Financial Health Score - NEW FEATURE */}
        <div className="mb-12 fade-in-up" style={{ animationDelay: '0.1s' }}>
          <FinancialHealthScore financialData={enrichedFinancialData} />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Total Balance Card */}
          <div className="stat-card-gradient bg-gradient-to-br from-primary-500 to-primary-700 fade-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-start justify-between mb-4">
              <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                <Wallet className="h-6 w-6 text-white" />
              </div>
              <button
                onClick={() => setShowBalance(!showBalance)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                {showBalance ? (
                  <Eye className="h-5 w-5 text-white/80" />
                ) : (
                  <EyeOff className="h-5 w-5 text-white/80" />
                )}
              </button>
            </div>
            <h3 className="text-white/80 text-sm font-medium mb-2">Total Balance</h3>
            <p className="text-3xl font-bold text-white mb-3">
              {showBalance ? formatCurrency(totalBalance) : "••••••"}
            </p>
            <div className="flex items-center space-x-2 text-white/90">
              <span className="text-sm font-medium">Real-time Balance</span>
            </div>
          </div>

          {/* Monthly Expenses Card */}
          <div className="stat-card-gradient bg-gradient-to-br from-red-500 to-red-700 fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-start justify-between mb-4">
              <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                <TrendingDown className="h-6 w-6 text-white" />
              </div>
              <div className="bg-white/20 px-3 py-1 rounded-full">
                <span className="text-xs font-semibold text-white">This Month</span>
              </div>
            </div>
            <h3 className="text-white/80 text-sm font-medium mb-2">Total Expenses</h3>
            <p className="text-3xl font-bold text-white mb-3">
              {formatCurrency(financialData.monthlyExpenses)}
            </p>
            <div className="flex items-center space-x-2 text-white/90">
              <span className="text-sm font-medium">Accumulated This Month</span>
            </div>
          </div>

          {/* Investments Card */}
          <div className="stat-card-gradient bg-gradient-to-br from-emerald-500 to-emerald-700 fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-start justify-between mb-4">
              <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div className="bg-white/20 px-3 py-1 rounded-full">
                <span className="text-xs font-semibold text-white">Growing</span>
              </div>
            </div>
            <h3 className="text-white/80 text-sm font-medium mb-2">Investments</h3>
            <p className="text-3xl font-bold text-white mb-3">
              {formatCurrency(financialData.investments)}
            </p>
            <div className="flex items-center space-x-2 text-white/90">
              <span className="text-sm font-medium">Current Portfolio Value</span>
            </div>
          </div>

          {/* Net Worth Card */}
          <div className="stat-card-gradient bg-gradient-to-br from-purple-500 to-purple-700 fade-in-up" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-start justify-between mb-4">
              <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div className="bg-white/20 px-3 py-1 rounded-full">
                <span className="text-xs font-semibold text-white">Net</span>
              </div>
            </div>
            <h3 className="text-white/80 text-sm font-medium mb-2">Net Worth</h3>
            <p className="text-3xl font-bold text-white mb-3">
              {formatCurrency(netWorth)}
            </p>
            <div className="flex items-center space-x-2 text-white/90">
              <span className="text-sm font-medium">Total Assets (Cash + Investments)</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          <Link to="/services/expenses" className="glass-card p-6 hover:shadow-2xl transition-all duration-300 hover:scale-105 group fade-in-up">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-4 rounded-2xl shadow-lg group-hover:shadow-orange-500/50 transition-shadow">
                <PieChart className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 text-lg">Track Expenses</h3>
                <p className="text-slate-600 text-sm">Manage your spending</p>
              </div>
            </div>
          </Link>

          <Link to="/services/budgets" className="glass-card p-6 hover:shadow-2xl transition-all duration-300 hover:scale-105 group fade-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-2xl shadow-lg group-hover:shadow-blue-500/50 transition-shadow">
                <DollarSign className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 text-lg">Budget Planning</h3>
                <p className="text-slate-600 text-sm">Set financial goals</p>
              </div>
            </div>
          </Link>

          <Link to="/services/investments" className="glass-card p-6 hover:shadow-2xl transition-all duration-300 hover:scale-105 group fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-green-500 to-green-600 p-4 rounded-2xl shadow-lg group-hover:shadow-green-500/50 transition-shadow">
                <BarChart3 className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 text-lg">Investments</h3>
                <p className="text-slate-600 text-sm">Grow your wealth</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Recent Transactions */}
        <div className="glass-card p-8 fade-in-up">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-primary-500 to-primary-600 p-2.5 rounded-xl">
                <CreditCard className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl font-display font-bold text-slate-900">
                Recent Transactions
              </h2>
            </div>
            <Link to="/transactions" className="text-primary-600 hover:text-primary-700 font-semibold flex items-center space-x-1 group">
              <span>View All</span>
              <ArrowUpRight className="h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Link>
          </div>

          {financialData.transactions.length > 0 ? (
            <div className="space-y-3">
              {financialData.transactions.map((transaction, index) => (
                <div
                  key={transaction._id || index}
                  className="flex items-center justify-between p-4 rounded-xl bg-white/60 hover:bg-white/80 hover:shadow-md transition-all duration-300 group"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-xl ${transaction.amount > 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                      {transaction.amount > 0 ? (
                        <ArrowUpRight className="h-5 w-5 text-green-600" />
                      ) : (
                        <ArrowDownRight className="h-5 w-5 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">
                        {transaction.merchantName || "Unknown Merchant"}
                      </p>
                      <p className="text-sm text-slate-500">
                        {new Date(transaction.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-lg font-bold ${transaction.amount > 0 ? "text-green-600" : "text-red-600"
                        }`}
                    >
                      {transaction.amount > 0 ? "+" : ""}
                      {formatCurrency(Math.abs(transaction.amount))}
                    </p>
                    <p className="text-xs text-slate-500 capitalize">
                      {transaction.category || "General"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="bg-slate-100 rounded-full p-6 w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                <CreditCard className="h-12 w-12 text-slate-400" />
              </div>
              <p className="text-slate-600 text-lg mb-4">No transactions yet</p>
              <button className="btn-primary">
                Add Your First Transaction
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default Home;
