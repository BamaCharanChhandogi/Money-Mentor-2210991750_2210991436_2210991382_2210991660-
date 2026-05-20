import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSocket } from "../../context/SocketContext";
import { toast } from "react-hot-toast";
import {
  PlusCircle,
  DollarSign,
  Users,
  CreditCard,
  PieChart,
  Wallet,
  Loader2,
  ArrowRight
} from "lucide-react";
import { BASE_URL } from '../../api';

const SharedExpenses = () => {
  const [families, setFamilies] = useState([]);
  const [selectedFamily, setSelectedFamily] = useState(null);
  const [sharedExpenses, setSharedExpenses] = useState([]);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const socket = useSocket();
  const navigate = useNavigate();
  const { familyId } = useParams();

  // Fetch families
  useEffect(() => {
    const fetchFamilies = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error('Please log in again');
          navigate('/login');
          return;
        }

        const response = await axios.get(`${BASE_URL}/family-groups`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!response.data) {
          throw new Error('No data received from server');
        }

        const familiesData = response.data.families || [];
        setFamilies(familiesData);

        if (familyId) {
          const family = familiesData.find(f => f._id === familyId);
          if (family) {
            setSelectedFamily(family);
          } else {
            toast.error('Family not found');
          }
        } else if (familiesData.length > 0) {
          // Auto-select first family if available and no ID param
          setSelectedFamily(familiesData[0]);
        }

      } catch (error) {
        console.error('Fetch error:', error);
        const errorMessage = error.response?.data?.message || 'Error fetching families';
        toast.error(errorMessage);

        if (error.response?.status === 401) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchFamilies();
  }, [familyId, navigate]);

  // Fetch shared expenses when family is selected
  useEffect(() => {
    const fetchSharedExpenses = async () => {
      if (!selectedFamily) return;

      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${BASE_URL}/shared-expenses/${selectedFamily._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data && Array.isArray(response.data.sharedExpenses)) {
          setSharedExpenses(response.data.sharedExpenses);
        } else {
          throw new Error('Invalid expenses data format');
        }
      } catch (error) {
        console.error('Error fetching expenses:', error);
        toast.error(error.response?.data?.message || "Error fetching expenses");
      } finally {
        setLoading(false);
      }
    };

    fetchSharedExpenses();
  }, [selectedFamily]);

  // Socket event listeners
  useEffect(() => {
    if (!socket || !selectedFamily) return;

    const handleNewExpense = (newExpense) => {
      if (newExpense.familyGroup === selectedFamily._id) {
        setSharedExpenses((prev) => [...prev, newExpense]);
        toast.success("New expense added");
      }
    };

    const handleExpenseUpdated = (updatedExpense) => {
      if (updatedExpense.familyGroup === selectedFamily._id) {
        setSharedExpenses((prev) =>
          prev.map((expense) =>
            expense._id === updatedExpense._id ? updatedExpense : expense
          )
        );
        toast.success("Expense updated");
      }
    };

    socket.on("shared_expense_created", handleNewExpense);
    socket.on("shared_expense_updated", handleExpenseUpdated);

    return () => {
      socket.off("shared_expense_created", handleNewExpense);
      socket.off("shared_expense_updated", handleExpenseUpdated);
    };
  }, [socket, selectedFamily]);

  const handleFamilyChange = (familyId) => {
    const family = families.find((f) => f._id === familyId);
    setSelectedFamily(family);
    navigate(`/family/expenses/${familyId}`);
  };

  return (
    <div className="min-h-screen bg-mesh py-8">
      <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
        <div className="glass-card p-8 mb-8 fade-in-up">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center space-x-4">
              <div className="p-4 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-2xl shadow-lg">
                <CreditCard className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-display font-bold text-slate-900">Shared Expenses</h1>
                <p className="text-slate-600 mt-1">Track and split costs with your family</p>
              </div>
            </div>

            <div className="w-full md:w-auto min-w-[300px]">
              {loading && families.length === 0 ? (
                <div className="h-10 bg-slate-100 rounded-xl animate-pulse"></div>
              ) : families.length > 0 ? (
                <div className="relative">
                  <select
                    onChange={(e) => handleFamilyChange(e.target.value)}
                    value={selectedFamily?._id || ""}
                    className="input-primary appearance-none cursor-pointer"
                  >
                    <option value="">Select Family</option>
                    {families.map((family) => (
                      <option key={family._id} value={family._id}>
                        {family.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <Users className="h-5 w-5 text-slate-400" />
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => navigate('/family/create')}
                  className="btn-primary w-full flex items-center justify-center space-x-2"
                >
                  <PlusCircle className="w-5 h-5" />
                  <span>Create Family</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {selectedFamily ? (
          <div className="glass-card p-8 fade-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Wallet className="h-5 w-5 text-emerald-600" />
                <span>Transactions</span>
              </h2>
              <button
                onClick={() => setShowExpenseForm(!showExpenseForm)}
                className={`btn-primary flex items-center gap-2 ${showExpenseForm ? 'bg-red-500 hover:bg-red-600 shadow-red-500/25' : 'shadow-emerald-500/25'}`}
              >
                {showExpenseForm ? "Cancel" : (
                  <>
                    <PlusCircle className="w-5 h-5" />
                    <span>Add New Expense</span>
                  </>
                )}
              </button>
            </div>

            {showExpenseForm && (
              <div className="mb-8 animate-fade-in-down">
                <ExpenseForm
                  familyId={selectedFamily._id}
                  onSuccess={() => {
                    setShowExpenseForm(false);
                    toast.success("Expense added successfully");
                  }}
                />
              </div>
            )}

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="h-48 bg-slate-50 rounded-2xl animate-pulse border border-slate-100"></div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sharedExpenses.map((expense) => (
                  <ExpenseCard key={expense._id} expense={expense} />
                ))}
              </div>
            )}

            {!loading && sharedExpenses.length === 0 && (
              <div className="text-center py-16 bg-slate-50 rounded-2xl border border-slate-100 border-dashed">
                <div className="bg-slate-100 p-4 rounded-full inline-flex mb-4">
                  <DollarSign className="w-10 h-10 text-slate-400" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">No shared expenses yet</h3>
                <p className="text-slate-500 max-w-sm mx-auto">
                  Add an expense to start tracking and splitting costs with your {selectedFamily.name} group.
                </p>
              </div>
            )}
          </div>
        ) : (
          !loading && families.length > 0 && (
            <div className="text-center py-20 glass-card">
              <div className="bg-primary-50 p-4 rounded-full inline-flex mb-4">
                <ArrowRight className="w-8 h-8 text-primary-500" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">Select a Family</h2>
              <p className="text-slate-500">Please select a family from the list above to view shared expenses.</p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

const ExpenseCard = ({ expense }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
      <div className="flex justify-between items-start mb-4">
        <div>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100 uppercase tracking-wide mb-2">
            {expense.category}
          </span>
          <h3 className="font-bold text-lg text-slate-900 line-clamp-2 leading-tight">
            {expense.description}
          </h3>
        </div>
        <div className="text-right pl-4">
          <span className="text-xl font-bold text-slate-900 block">
            ${Number(expense.amount).toFixed(2)}
          </span>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-100">
        <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-wider mb-3">
          <PieChart className="w-4 h-4" />
          <span>Split Breakdown</span>
        </div>
        <div className="space-y-2 max-h-40 overflow-y-auto pr-1 custom-scrollbar">
          {expense.splits?.map((split) => (
            <div
              key={split._id}
              className="flex justify-between items-center text-sm p-2 rounded-lg bg-slate-50 border border-slate-100"
            >
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                  {split.user?.name?.charAt(0)}
                </div>
                <span className="text-slate-700 font-medium truncate max-w-[80px]">{split.user?.name}</span>
              </div>
              <span
                className={`
                text-xs font-bold px-2 py-0.5 rounded
                ${split.status === "pending"
                    ? "text-yellow-700 bg-yellow-50"
                    : split.status === "paid"
                      ? "text-green-700 bg-green-50"
                      : "text-red-700 bg-red-50"
                  }
              `}
              >
                ${Number(split.amount).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ExpenseForm = ({ familyId, onSuccess }) => {
  const [formData, setFormData] = useState({
    amount: "",
    category: "",
    description: "",
    splitType: "equal",
  });
  const [submitting, setSubmitting] = useState(false);
  const socket = useSocket();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${BASE_URL}/shared-expenses`,
        { ...formData, familyGroupId: familyId },
        { headers: { Authorization: `Bearer ${token}` } }
      );


      onSuccess();
      setFormData({
        amount: "",
        category: "",
        description: "",
        splitType: "equal",
      });
    } catch (error) {
      console.error('Error creating expense:', error);
      toast.error(error.response?.data?.message || "Error creating expense");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-50 rounded-2xl p-6 border border-slate-200 shadow-inner">
      <h4 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
        <PlusCircle className="h-5 w-5 text-primary-600" />
        New Expense Details
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Amount
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <DollarSign className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="number"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
              className="input-primary pl-10"
              placeholder="0.00"
              required
              min="0"
              step="0.01"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Category
          </label>
          <select
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            className="input-primary"
            required
          >
            <option value="">Select Category</option>
            <option value="groceries">Groceries</option>
            <option value="utilities">Utilities</option>
            <option value="rent">Rent</option>
            <option value="entertainment">Entertainment</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Description
          </label>
          <input
            type="text"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="input-primary"
            placeholder="What was this expense for?"
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Split Type
          </label>
          <div className="relative">
            <select
              value={formData.splitType}
              onChange={(e) =>
                setFormData({ ...formData, splitType: e.target.value })
              }
              className="input-primary appearance-none"
              required
            >
              <option value="equal">Split Equally</option>
              <option value="percentage">Split by Percentage</option>
              <option value="custom">Custom Split</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <PieChart className="h-4 w-4 text-slate-400" />
            </div>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="mt-8 btn-success w-full flex items-center justify-center space-x-2 py-3"
      >
        {submitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Creating...</span>
          </>
        ) : (
          <>
            <PlusCircle className="w-5 h-5" />
            <span>Create Expense</span>
          </>
        )}
      </button>
    </form>
  );
};

export default SharedExpenses;