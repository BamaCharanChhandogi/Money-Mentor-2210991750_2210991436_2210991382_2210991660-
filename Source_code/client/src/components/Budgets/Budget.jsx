import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Plus, PieChart, Wallet, Calendar, Edit, Trash2, X, Target } from 'lucide-react';
import { BASE_URL } from '../../api';

const CATEGORIES = [
  'Groceries',
  'Dining Out',
  'Transport',
  'Entertainment',
  'Utilities',
  'Shopping',
  'Healthcare',
  'Housing',
  'Education',
  'Other'
];

const BudgetModal = ({
  isModalOpen,
  setIsModalOpen,
  editingBudget,
  setEditingBudget,
  newBudget,
  setNewBudget,
  error,
  setError,
  handleUpdateBudget,
  handleAddBudget
}) => {
  if (!isModalOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm"
        onClick={() => {
          setIsModalOpen(false);
          setEditingBudget(null);
          setNewBudget({ category: '', amount: '', period: 'monthly' });
        }}
      ></div>
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl scale-in overflow-hidden">
        <div className="sticky top-0 px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white">
          <h2 className="text-xl font-display font-bold text-slate-900">
            {editingBudget ? 'Edit Budget' : 'Add New Budget'}
          </h2>
          <button
            onClick={() => {
              setIsModalOpen(false);
              setEditingBudget(null);
              setNewBudget({ category: '', amount: '', period: 'monthly' });
            }}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>
        <div className="p-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-4">
              {error}
            </div>
          )}
          <form
            onSubmit={editingBudget ? handleUpdateBudget : handleAddBudget}
            className="space-y-4"
          >
            <div>
              <label className="block mb-2 text-sm font-semibold text-slate-700">Category</label>
              <select
                className="input-primary"
                value={newBudget.category}
                onChange={(e) => setNewBudget({ ...newBudget, category: e.target.value })}
                required
              >
                <option value="" disabled>Select a category</option>
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-2 text-sm font-semibold text-slate-700">Amount</label>
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                className="input-primary"
                value={newBudget.amount}
                onChange={(e) => setNewBudget({ ...newBudget, amount: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-semibold text-slate-700">Period</label>
              <select
                className="input-primary"
                value={newBudget.period}
                onChange={(e) => setNewBudget({ ...newBudget, period: e.target.value })}
              >
                <option value="monthly">Monthly</option>
                <option value="weekly">Weekly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingBudget(null);
                  setNewBudget({ category: '', amount: '', period: 'monthly' });
                }}
                className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 btn-primary py-3"
              >
                {editingBudget ? 'Update' : 'Add Budget'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>,
    document.body
  );
};

const BudgetDashboard = () => {
  const [budgets, setBudgets] = useState([]);
  const [newBudget, setNewBudget] = useState({
    category: '',
    amount: '',
    period: 'monthly'
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState('');
  const [editingBudget, setEditingBudget] = useState(null);
  const [spentMap, setSpentMap] = useState({});
  const [rolloverMap, setRolloverMap] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

  useEffect(() => {
    fetchBudgets();
  }, [editingBudget === null]); // Only re-fetch after modal closes or after an update

  const fetchBudgets = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const [budgetsRes, expensesRes] = await Promise.all([
        axios.get(`${BASE_URL}/budgets`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${BASE_URL}/expenses`, { headers: { Authorization: `Bearer ${token}` } })
      ]);

      const budgetsData = budgetsRes.data;
      const expensesData = expensesRes.data;
      const now = new Date();

      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      // Calculate start of current week (Monday)
      const startOfWeek = new Date(now);
      const day = startOfWeek.getDay();
      const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
      startOfWeek.setDate(diff);
      startOfWeek.setHours(0, 0, 0, 0);

      const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

      const spentCounts = {}; // { category: { weekly: 0, monthly: 0, yearly: 0, lastMonth: 0 } }

      expensesData.forEach(exp => {
        const expDate = new Date(exp.date);
        const expMonth = expDate.getMonth();
        const expYear = expDate.getFullYear();
        const cat = exp.category.toLowerCase();

        if (!spentCounts[cat]) {
          spentCounts[cat] = { weekly: 0, monthly: 0, yearly: 0, lastMonth: 0 };
        }

        // Yearly
        if (expYear === currentYear) {
          spentCounts[cat].yearly += exp.amount;
        }

        // Monthly
        if (expMonth === currentMonth && expYear === currentYear) {
          spentCounts[cat].monthly += exp.amount;
        }

        // Weekly
        if (expDate >= startOfWeek && expDate <= now) {
          spentCounts[cat].weekly += exp.amount;
        }

        // Last Month (for Rollover)
        if (expMonth === lastMonth && expYear === lastMonthYear) {
          spentCounts[cat].lastMonth += exp.amount;
        }
      });

      const rollovers = {};
      const calculatedSpent = {};

      budgetsData.forEach(budget => {
        const cat = budget.category.toLowerCase();
        const stats = spentCounts[cat] || { weekly: 0, monthly: 0, yearly: 0, lastMonth: 0 };

        if (budget.period === 'monthly') {
          calculatedSpent[cat] = stats.monthly;
          // Only apply rollover if we actually have expense data for last month
          // to avoid "doubling" the budget for new users/months
          const hasLastMonthData = expensesData.some(exp => {
            const expDate = new Date(exp.date);
            return expDate.getMonth() === lastMonth && expDate.getFullYear() === lastMonthYear;
          });

          if (hasLastMonthData) {
            const remainingLast = budget.amount - stats.lastMonth;
            if (remainingLast > 0) rollovers[cat] = remainingLast;
          }
        } else if (budget.period === 'weekly') {
          calculatedSpent[cat] = stats.weekly;
        } else if (budget.period === 'yearly') {
          calculatedSpent[cat] = stats.yearly;
        }
      });

      setBudgets(budgetsData);
      setSpentMap(calculatedSpent);
      setRolloverMap(rollovers);
    } catch (error) {
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddBudget = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${BASE_URL}/budgets`, newBudget, { headers: { Authorization: `Bearer ${token}` } });
      setBudgets([...budgets, response.data]);
      setNewBudget({ category: '', amount: '', period: 'monthly' });
      setIsModalOpen(false);
      setError('');
    } catch (error) {
      setError('Failed to add budget');
    }
  };

  const handleUpdateBudget = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.patch(`${BASE_URL}/budgets/${editingBudget._id}`, newBudget, { headers: { Authorization: `Bearer ${token}` } });
      setBudgets(budgets.map(b => b._id === editingBudget._id ? response.data : b));
      setEditingBudget(null);
      setIsModalOpen(false);
      setError('');
    } catch (error) {
      setError('Failed to update budget');
    }
  };

  const handleDeleteBudget = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${BASE_URL}/budgets/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setBudgets(budgets.filter(b => b._id !== id));
    } catch (error) {
      setError('Failed to delete budget');
    }
  };

  const openEditModal = (budget) => {
    setEditingBudget(budget);
    setNewBudget({ category: budget.category, amount: budget.amount.toString(), period: budget.period });
    setIsModalOpen(true);
  };

  const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0);
  const COLORS = ['#C9A24A', '#57564F', '#6B8E5A', '#B8745C', '#8F6E2E'];

  return (
    <div className="min-h-screen bg-mesh py-8">
      <div className="container mx-auto px-4 lg:px-8 space-y-8">
        <div className="glass-card p-6 shadow-xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl shadow-lg">
                <Target className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-display font-bold text-slate-900">Budget Dashboard</h1>
                <p className="text-slate-600">Manage your financial goals • <span className="text-[10px] uppercase font-bold text-slate-400">Sync Active</span></p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center bg-primary-100 px-6 py-3 rounded-xl">
                <Wallet className="mr-2 text-primary-600 h-5 w-5" />
                <span className="text-sm font-medium text-primary-700 mr-2">Total:</span>
                <span className="text-xl font-bold text-primary-900">${totalBudget.toFixed(2)}</span>
              </div>
              <button onClick={() => { setEditingBudget(null); setNewBudget({ category: '', amount: '', period: 'monthly' }); setIsModalOpen(true); }} className="btn-primary flex items-center space-x-2">
                <Plus className="w-5 h-5" />
                <span>Add Budget</span>
              </button>
            </div>
          </div>
        </div>

        <div className="glass-card p-6 overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-900">Budget vs Spending</h2>
            <div className="flex items-center space-x-4 text-xs font-semibold uppercase tracking-wider">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-200"></div>
                <span className="text-slate-500">Total Budget</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-primary-500"></div>
                <span className="text-slate-500">Actual Spent</span>
              </div>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={350}>
            <BarChart
              data={budgets.map(b => {
                const cat = b.category.toLowerCase();
                const isMonthly = b.period === 'monthly';
                const rollover = isMonthly ? (rolloverMap[cat] || 0) : 0;
                return {
                  ...b,
                  total: b.amount + rollover,
                  spent: spentMap[cat] || 0
                };
              })}
              margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
              barGap={-32} // Overlap the bars
            >
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#E8D47D" stopOpacity={1} />
                  <stop offset="100%" stopColor="#C9A24A" stopOpacity={1} />
                </linearGradient>
                <linearGradient id="warningGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#d9be56" stopOpacity={1} />
                  <stop offset="100%" stopColor="#b08a3a" stopOpacity={1} />
                </linearGradient>
                <linearGradient id="dangerGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#d18f65" stopOpacity={1} />
                  <stop offset="100%" stopColor="#B8745C" stopOpacity={1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis
                dataKey="category"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 12 }}
              />
              <Tooltip
                cursor={{ fill: 'transparent' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    const percent = data.total > 0 ? ((data.spent / data.total) * 100).toFixed(0) : 0;
                    return (
                      <div className="glass-card !bg-white/95 !backdrop-blur-md p-4 shadow-2xl border border-slate-100 min-w-[200px]">
                        <p className="text-sm font-bold text-slate-900 mb-2">{data.category}</p>
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-500">Spent:</span>
                            <span className="font-bold text-slate-900">${data.spent.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-500">Total Budget:</span>
                            <span className="font-semibold text-slate-700">${data.total.toFixed(2)}</span>
                          </div>
                          <div className="mt-2 pt-2 border-t border-slate-100">
                            <div className="flex justify-between items-center">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Utilization</span>
                              <span className={`text-xs font-bold ${Number(percent) > 90 ? 'text-red-500' : Number(percent) > 70 ? 'text-amber-500' : 'text-primary-600'}`}>
                                {percent}%
                              </span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-100 rounded-full mt-1 overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-500 ${Number(percent) > 90 ? 'bg-red-500' : Number(percent) > 70 ? 'bg-amber-500' : 'bg-primary-500'}`}
                                style={{ width: `${Math.min(100, Number(percent))}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              {/* Background Track */}
              <Bar
                dataKey="total"
                fill="#cbd5e1"
                radius={[8, 8, 8, 8]}
                barSize={32}
                isAnimationActive={false}
              />
              {/* Actual Spent */}
              <Bar
                dataKey="spent"
                radius={[8, 8, 8, 8]}
                barSize={32}
                animationDuration={1500}
                animationEasing="ease-out"
              >
                {budgets.map((entry, index) => {
                  const cat = entry.category.toLowerCase();
                  const isMonthly = entry.period === 'monthly';
                  const rollover = isMonthly ? (rolloverMap[cat] || 0) : 0;
                  const spent = spentMap[cat] || 0;
                  const total = entry.amount + rollover;
                  const ratio = total > 0 ? spent / total : 0;
                  let gradient = "url(#barGradient)";
                  if (ratio > 0.9) gradient = "url(#dangerGradient)";
                  else if (ratio > 0.7) gradient = "url(#warningGradient)";
                  return <Cell key={`cell-${index}`} fill={gradient} />;
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Budget Categories</h2>
          <div className="space-y-3">
            {budgets.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                <div className="inline-flex p-4 bg-white rounded-full shadow-sm mb-4">
                  <Target className="w-8 h-8 text-slate-300" />
                </div>
                <p className="text-slate-500 font-medium">No budgets created yet.</p>
                <p className="text-xs text-slate-400 mt-1">Start by adding a monthly or yearly budget goal.</p>
              </div>
            ) : budgets.map((budget, index) => (
              <div key={budget._id} className="flex-1 space-y-3">
                <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all duration-300">
                  <div className="flex items-center space-x-4">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                    <div>
                      <span className="font-semibold text-slate-900 block">{budget.category}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500 capitalize">{budget.period}</span>
                        {rolloverMap[budget.category.toLowerCase()] > 0 && (
                          <span className="text-[10px] font-bold text-success-600 bg-success-50 px-1.5 py-0.5 rounded border border-success-100">
                            +${rolloverMap[budget.category.toLowerCase()].toFixed(0)} rollover
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <span className="text-lg font-bold text-slate-900 block">
                        ${(spentMap[budget.category.toLowerCase()] || 0).toLocaleString()} /
                        ${(budget.amount + (budget.period === 'monthly' ? (rolloverMap[budget.category.toLowerCase()] || 0) : 0)).toLocaleString()}
                      </span>
                      <span className="text-xs text-slate-400">
                        {((spentMap[budget.category.toLowerCase()] || 0) / (budget.amount + (budget.period === 'monthly' ? (rolloverMap[budget.category.toLowerCase()] || 0) : 0)) * 100).toFixed(0)}% used
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button onClick={() => openEditModal(budget)} className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg"><Edit size={18} /></button>
                      <button onClick={() => handleDeleteBudget(budget._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button>
                    </div>
                  </div>
                </div>
                <div className="px-4 pb-2">
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 rounded-full ${((spentMap[budget.category.toLowerCase()] || 0) / (budget.amount + (budget.period === 'monthly' ? (rolloverMap[budget.category.toLowerCase()] || 0) : 0))) > 0.9
                        ? 'bg-red-500'
                        : ((spentMap[budget.category.toLowerCase()] || 0) / (budget.amount + (budget.period === 'monthly' ? (rolloverMap[budget.category.toLowerCase()] || 0) : 0))) > 0.7
                          ? 'bg-amber-500'
                          : 'bg-primary-500'
                        }`}
                      style={{ width: `${Math.min(100, ((spentMap[budget.category.toLowerCase()] || 0) / (budget.amount + (budget.period === 'monthly' ? (rolloverMap[budget.category.toLowerCase()] || 0) : 0))) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <BudgetModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        editingBudget={editingBudget}
        setEditingBudget={setEditingBudget}
        newBudget={newBudget}
        setNewBudget={setNewBudget}
        error={error}
        setError={setError}
        handleUpdateBudget={handleUpdateBudget}
        handleAddBudget={handleAddBudget}
      />
    </div>
  );
};

export default BudgetDashboard;