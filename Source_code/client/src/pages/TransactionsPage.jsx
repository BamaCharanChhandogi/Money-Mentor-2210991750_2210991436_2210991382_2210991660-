import React, { useState, useEffect } from 'react';
import {
  Wallet,
  TrendingUp,
  BarChart,
  PieChart,
  Download,
  Plus,
  X,
  Calendar,
  DollarSign,
  Tag,
  Filter,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import axios from 'axios';
import { BASE_URL } from '../api';
import TransactionsList from './TransactionsList';
import CategoryInsights from './CategoryInsights';

const StatCard = ({ icon: Icon, title, value, subtext, trend, gradient }) => (
  <div className={`stat-card-gradient bg-gradient-to-br ${gradient} p-6 rounded-2xl`}>
    <div className="flex justify-between items-center mb-4">
      <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
        <Icon className="text-white h-6 w-6" />
      </div>
      <div className="text-xs font-semibold text-white/90 bg-white/20 px-2 py-1 rounded-lg">
        {trend}
      </div>
    </div>
    <div className="space-y-1">
      <span className="text-sm font-medium text-white/80">{title}</span>
      <div className="text-3xl font-bold text-white">{value}</div>
      <div className="text-xs text-white/70">{subtext}</div>
    </div>
  </div>
);

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl scale-in overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h2 className="text-xl font-display font-bold text-slate-900">{title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

const TransactionsPage = () => {
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isAddTransactionModalOpen, setIsAddTransactionModalOpen] = useState(false);
  const [exportOptions, setExportOptions] = useState({
    startDate: '',
    endDate: '',
    format: 'csv'
  });
  const [newTransaction, setNewTransaction] = useState({
    date: '',
    amount: '',
    name: '',
    category: ''
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleExport = async () => {
  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    const config = {
      params: exportOptions,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      responseType: "blob",
    };

    const { data } = await axios.get(
      `${BASE_URL}/transactions/export`,
      config
    );

    const blob = new Blob([data]);
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    const fileDate = new Date().toISOString().split("T")[0];
    const filename = `transactions_${fileDate}.${exportOptions.format}`;

    link.href = url;
    link.setAttribute("download", filename);

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setIsExportModalOpen(false);
  } catch (err) {
    console.error("Export error:", err);
  }
};

  const handleAddTransaction = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${BASE_URL}/transactions`, newTransaction, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setIsAddTransactionModalOpen(false);
      // Ideally refresh data here
    } catch (error) {
      console.error('Add transaction error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-mesh py-8">
      <div className="container mx-auto px-4 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 fade-in-up">
          <div>
            <h1 className="text-4xl font-display font-bold text-slate-900">Transactions</h1>
            <p className="text-slate-600 mt-1">Manage and track your financial journey</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setIsExportModalOpen(true)}
              className="btn-outline flex items-center space-x-2 bg-white"
            >
              <Download className="h-5 w-5" />
              <span>Export</span>
            </button>
            <button
              onClick={() => setIsAddTransactionModalOpen(true)}
              className="btn-primary flex items-center space-x-2 shadow-primary-500/25"
            >
              <Plus className="h-5 w-5" />
              <span>Add Transaction</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 fade-in-up" style={{ animationDelay: '0.1s' }}>
          <StatCard
            icon={Wallet}
            title="Total Spending"
            value="$4,523.67"
            subtext="This month"
            trend="+12%"
            gradient="from-primary-500 to-primary-700"
          />
          <StatCard
            icon={TrendingUp}
            title="Income"
            value="$6,234.22"
            subtext="Monthly Income"
            trend="+30%"
            gradient="from-success-500 to-success-700"
          />
          <StatCard
            icon={BarChart}
            title="Expenses"
            value="$3,245.45"
            subtext="Monthly Expenses"
            trend="-5%"
            gradient="from-warning-500 to-warning-700"
          />
          <StatCard
            icon={PieChart}
            title="Budget Utilization"
            value="85%"
            subtext="On track"
            trend="Stable"
            gradient="from-accent-500 to-accent-700"
          />
        </div>

        {/* Content Area */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main List */}
          <div className="lg:col-span-2 space-y-6 fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="glass-card p-6 shadow-xl backdrop-blur-xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-900 flex items-center">
                  <Filter className="h-5 w-5 mr-2 text-primary-500" />
                  Recent Activity
                </h2>
                <select className="bg-slate-50 border-none rounded-lg text-sm font-medium text-slate-600 focus:ring-0 cursor-pointer hover:bg-slate-100 transition-colors px-3 py-2">
                  <option>All Time</option>
                  <option>This Month</option>
                  <option>Last Month</option>
                </select>
              </div>
              <TransactionsList />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6 fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="glass-card p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Category Insights</h2>
              <CategoryInsights />
            </div>
          </div>
        </div>
      </div>

      {/* Export Modal */}
      <Modal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        title="Export Transactions"
      >
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Date Range</label>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <input
                  type="date"
                  value={exportOptions.startDate}
                  onChange={(e) => setExportOptions(prev => ({ ...prev, startDate: e.target.value }))}
                  className="w-full pl-10 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none"
                />
              </div>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <input
                  type="date"
                  value={exportOptions.endDate}
                  onChange={(e) => setExportOptions(prev => ({ ...prev, endDate: e.target.value }))}
                  className="w-full pl-10 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Format</label>
            <select
              value={exportOptions.format}
              onChange={(e) => setExportOptions(prev => ({ ...prev, format: e.target.value }))}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none"
            >
              <option value="csv">CSV (Spreadsheet)</option>
              <option value="json">JSON (Data)</option>
            </select>
          </div>

          <div className="pt-2">
            <button
              onClick={handleExport}
              className="btn-primary w-full"
            >
              Download Report
            </button>
          </div>
        </div>
      </Modal>

      {/* Add Transaction Modal */}
      <Modal
        isOpen={isAddTransactionModalOpen}
        onClose={() => setIsAddTransactionModalOpen(false)}
        title="New Transaction"
      >
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Transaction Details</label>
            <div className="space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Tag className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  placeholder="Transaction Name (e.g. Grocery Shopping)"
                  value={newTransaction.name}
                  onChange={(e) => setNewTransaction(prev => ({ ...prev, name: e.target.value }))}
                  className="input-primary pl-10"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="number"
                    placeholder="Amount"
                    value={newTransaction.amount}
                    onChange={(e) => setNewTransaction(prev => ({ ...prev, amount: e.target.value }))}
                    className="input-primary pl-10"
                  />
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="date"
                    value={newTransaction.date}
                    onChange={(e) => setNewTransaction(prev => ({ ...prev, date: e.target.value }))}
                    className="input-primary pl-10"
                  />
                </div>
              </div>

              <div>
                <select
                  value={newTransaction.category}
                  onChange={(e) => setNewTransaction(prev => ({ ...prev, category: e.target.value }))}
                  className="input-primary"
                >
                  <option value="">Select Category</option>
                  <option value="Food">Food & Dining</option>
                  <option value="Transport">Transportation</option>
                  <option value="Utilities">Bills & Utilities</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Health">Health & Fitness</option>
                  <option value="Shopping">Shopping</option>
                </select>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={handleAddTransaction}
              className="btn-success w-full"
            >
              Save Transaction
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TransactionsPage;