import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Plus, TrendingUp, Wallet, Calendar, Edit, Trash2, X, Sparkles } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { BASE_URL } from '../../api';

const ExpenseModal = ({
  isModalOpen,
  setIsModalOpen,
  editingExpense,
  setEditingExpense,
  newExpense,
  setNewExpense,
  error,
  setError,
  isSuggested,
  setIsSuggested,
  handleEditExpense,
  handleAddExpense,
  handleDescriptionChange
}) => {
  if (!isModalOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm"
        onClick={() => {
          setIsModalOpen(false);
          setEditingExpense(null);
          setError('');
        }}
      ></div>
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl scale-in overflow-hidden">
        <div className="sticky top-0 px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white">
          <h2 className="text-xl font-display font-bold text-slate-900">
            {editingExpense ? 'Edit Expense' : 'Add New Expense'}
          </h2>
          <button
            onClick={() => {
              setIsModalOpen(false);
              setEditingExpense(null);
              setError('');
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
          <form onSubmit={editingExpense ? handleEditExpense : handleAddExpense} className="space-y-4">
            <div>
              <label className="block mb-2 text-sm font-semibold text-slate-700">Description</label>
              <input
                type="text"
                placeholder="e.g., Starbucks Coffee"
                className="input-primary"
                value={editingExpense ? editingExpense.description : newExpense.description}
                onChange={(e) => handleDescriptionChange(e.target.value, !!editingExpense)}
                required
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-semibold text-slate-700">Category</label>
                {isSuggested && !editingExpense && (
                  <span className="text-[10px] font-bold uppercase tracking-wider text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full border border-primary-100 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Suggested
                  </span>
                )}
              </div>
              <select
                className="input-primary"
                value={editingExpense ? editingExpense.category : newExpense.category}
                onChange={(e) => {
                  if (editingExpense) {
                    setEditingExpense({ ...editingExpense, category: e.target.value });
                  } else {
                    setNewExpense({ ...newExpense, category: e.target.value });
                    setIsSuggested(false);
                  }
                }}
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
                value={editingExpense ? editingExpense.amount : newExpense.amount}
                onChange={(e) =>
                  editingExpense
                    ? setEditingExpense({ ...editingExpense, amount: e.target.value })
                    : setNewExpense({ ...newExpense, amount: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-semibold text-slate-700">Date</label>
              <input
                type="date"
                className="input-primary"
                value={editingExpense ? editingExpense.date : newExpense.date}
                onChange={(e) =>
                  editingExpense
                    ? setEditingExpense({ ...editingExpense, date: e.target.value })
                    : setNewExpense({ ...newExpense, date: e.target.value })
                }
                required
              />
            </div>
            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingExpense(null);
                  setError('');
                }}
                className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 btn-success py-3 font-semibold"
              >
                {editingExpense ? 'Update' : 'Add Expense'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>,
    document.body
  );
};

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

const categoryMap = {
  'Dining Out': ['starbucks', 'mcdonalds', 'restaurant', 'pizza', 'burger', 'cafe', 'coffee', 'delivery', 'ubereats', 'doordash', 'kfc', 'subway'],
  'Groceries': ['walmart', 'grocery', 'supermarket', 'target', 'whole foods', 'kroger', 'tesco', 'aldi', 'lidl'],
  'Transport': ['uber', 'lyft', 'gas', 'petrol', 'train', 'bus', 'parking', 'shell', 'exxon', 'chevron'],
  'Entertainment': ['netflix', 'spotify', 'movie', 'cinema', 'game', 'hulu', 'disney+', 'steam', 'playstation', 'xbox'],
  'Utilities': ['electric', 'water', 'internet', 'phone', 'bill', 'gas bill', 'insurance'],
  'Shopping': ['amazon', 'ebay', 'cloth', 'shoe', 'mall', 'walmart', 'zara', 'h&m'],
  'Housing': ['rent', 'mortgage', 'maintenance', 'repairs'],
};

const ExpenseDashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [newExpense, setNewExpense] = useState({
    category: '',
    amount: '',
    description: '',
    date: new Date().toLocaleDateString('en-CA'),
  });
  const [isSuggested, setIsSuggested] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState('');

  const handleDescriptionChange = (desc, isEdit = false) => {
    if (isEdit) {
      setEditingExpense({ ...editingExpense, description: desc });
      return;
    }

    setNewExpense(prev => ({ ...prev, description: desc }));

    const lowercaseDesc = desc.toLowerCase();
    let suggestedCategory = '';

    for (const [category, keywords] of Object.entries(categoryMap)) {
      if (keywords.some(keyword => lowercaseDesc.includes(keyword))) {
        suggestedCategory = category;
        break;
      }
    }

    if (suggestedCategory && !newExpense.category) {
      setNewExpense(prev => ({ ...prev, category: suggestedCategory }));
      setIsSuggested(true);
      toast.success(`Suggested category: ${suggestedCategory}`, { icon: '💡' });
    }
  };

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
    const fetchExpenses = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${BASE_URL}/expenses`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) throw new Error('Failed to fetch expenses');
        const data = await response.json();
        setExpenses(data.map(exp => ({ ...exp, amount: Number(exp.amount) })).sort((a, b) => new Date(a.date) - new Date(b.date)));
        setIsLoading(false);
      } catch (error) {
        setFetchError(error.message);
        setIsLoading(false);
      }
    };
    fetchExpenses();
  }, []);

  const handleAddExpense = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BASE_URL}/expenses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ ...newExpense, amount: Number(newExpense.amount) }),
      });
      if (!response.ok) throw new Error('Failed to add expense');
      const added = await response.json();
      setExpenses([...expenses, { ...added, amount: Number(added.amount) }].sort((a, b) => new Date(b.date) - new Date(a.date)));
      setIsModalOpen(false);
      setNewExpense({ category: '', amount: '', description: '', date: new Date().toISOString().split('T')[0] });
      setIsSuggested(false);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleEditExpense = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BASE_URL}/expenses/${editingExpense._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ category: editingExpense.category, amount: Number(editingExpense.amount), description: editingExpense.description, date: editingExpense.date }),
      });
      if (!response.ok) throw new Error('Failed to update expense');
      const updated = await response.json();
      setExpenses(expenses.map(exp => exp._id === updated._id ? { ...updated, amount: Number(updated.amount) } : exp).sort((a, b) => new Date(b.date) - new Date(a.date)));
      setIsModalOpen(false);
      setEditingExpense(null);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDeleteExpense = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BASE_URL}/expenses/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
      if (!response.ok) throw new Error('Failed to delete expense');
      setExpenses(expenses.filter(exp => exp._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const totalExpenses = expenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);

  if (isLoading) return <div className="min-h-screen bg-mesh flex items-center justify-center"><div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-500 border-t-transparent"></div></div>;
  if (fetchError) return <div className="min-h-screen bg-mesh flex items-center justify-center"><p className="text-red-600">Error: {fetchError}</p></div>;

  return (
    <div className="min-h-screen bg-mesh py-8">
      <div className="container mx-auto px-4 lg:px-8 space-y-8">
        <div className="glass-card p-6 shadow-xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-success-500 to-success-700 rounded-2xl shadow-lg">
                <Wallet className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-display font-bold text-slate-900">Expense Tracker</h1>
                <p className="text-slate-600">Monitor your spending patterns</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center bg-success-100 px-6 py-3 rounded-xl">
                <span className="text-sm font-medium text-success-700 mr-2">Total:</span>
                <span className="text-xl font-bold text-success-900">${totalExpenses.toFixed(2)}</span>
              </div>
              <button onClick={() => {
                setEditingExpense(null);
                setNewExpense({
                  category: '',
                  amount: '',
                  description: '',
                  date: new Date().toISOString().split('T')[0]
                });
                setIsSuggested(false);
                setIsModalOpen(true);
              }} className="btn-primary flex items-center space-x-2">
                <Plus className="w-5 h-5" />
                <span>Add Expense</span>
              </button>
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={expenses}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 12 }} />
              <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
              <Tooltip contentStyle={{ backgroundColor: 'white', border: '2px solid #10B981', borderRadius: '12px' }} />
              <Line type="monotone" dataKey="amount" stroke="#C9A24A" strokeWidth={3} dot={{ fill: '#C9A24A', r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Recent Expenses</h2>
          <div className="space-y-3">
            {expenses.map((expense) => (
              <div key={expense._id} className="flex justify-between items-center p-4 bg-slate-50 rounded-xl hover:bg-slate-100">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-success-100 rounded-lg">
                    <Wallet className="h-5 w-5 text-success-600" />
                  </div>
                  <div>
                    <span className="font-semibold text-slate-900 block">{expense.category}</span>
                    <span className="text-xs text-slate-400 block mb-1">{expense.description}</span>
                    <span className="text-sm text-slate-500">{new Date(expense.date).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-lg font-bold text-slate-900">${expense.amount.toFixed(2)}</span>
                  <div className="flex items-center space-x-2">
                    <button onClick={() => {
                      const formattedDate = new Date(expense.date).toISOString().split('T')[0];
                      setEditingExpense({ ...expense, date: formattedDate });
                      setIsModalOpen(true);
                    }} className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg"><Edit size={18} /></button>
                    <button onClick={() => handleDeleteExpense(expense._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ExpenseModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        editingExpense={editingExpense}
        setEditingExpense={setEditingExpense}
        newExpense={newExpense}
        setNewExpense={setNewExpense}
        error={error}
        setError={setError}
        isSuggested={isSuggested}
        setIsSuggested={setIsSuggested}
        handleEditExpense={handleEditExpense}
        handleAddExpense={handleAddExpense}
        handleDescriptionChange={handleDescriptionChange}
      />
    </div>
  );
};

export default ExpenseDashboard;