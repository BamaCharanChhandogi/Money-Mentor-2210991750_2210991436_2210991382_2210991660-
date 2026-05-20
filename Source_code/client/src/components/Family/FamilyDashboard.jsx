import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSocket } from '../../context/SocketContext';
import axios from 'axios';
import { BASE_URL } from '../../api';
import { toast } from 'react-hot-toast';
import {
  PlusCircle,
  DollarSign,
  Users,
  UserPlus,
  Wallet,
  Shield,
  Loader2,
  Send,
  CreditCard,
  PieChart,
  Target,
  LayoutDashboard,
  Trash2
} from 'lucide-react';

import GoalCard from './Goals/GoalCard';
import CreateGoalModal from './Goals/CreateGoalModal';

const FamilyDashboard = () => {
  const [families, setFamilies] = useState([]);
  const [selectedFamily, setSelectedFamily] = useState(null);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteLoading, setInviteLoading] = useState(false);
  const [familyMembers, setFamilyMembers] = useState([]);

  // Expenses State
  const [sharedExpenses, setSharedExpenses] = useState([]);
  const [showExpenseForm, setShowExpenseForm] = useState(false);

  // Goals State
  const [goals, setGoals] = useState([]);
  const [showGoalForm, setShowGoalForm] = useState(false);

  // UI State
  const [activeTab, setActiveTab] = useState('expenses'); // 'expenses' | 'goals'
  const [loading, setLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

  const socket = useSocket();
  const navigate = useNavigate();

  // Parse Token to get User ID
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setCurrentUserId(payload.userId);
      } catch (e) {
        console.error("Error parsing token", e);
      }
    }
  }, []);

  // Fetch family groups
  useEffect(() => {
    const fetchFamilies = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${BASE_URL}/family-groups`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const fetchedFamilies = response.data.families;
        setFamilies(fetchedFamilies);

        // Auto-select first family if none selected
        if (fetchedFamilies.length > 0 && !selectedFamily) {
          setSelectedFamily(fetchedFamilies[0]);
        }
      } catch (error) {
        toast.error('Error fetching families');
        console.error('Error fetching families:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFamilies();
  }, []);

  // Fetch Data when family is selected
  useEffect(() => {
    const fetchData = async () => {
      if (!selectedFamily) return;

      setLoading(true);
      const token = localStorage.getItem('token');

      try {
        // Parallel fetch for expenses and goals
        const [expensesRes, goalsRes] = await Promise.all([
          axios.get(`${BASE_URL}/shared-expenses/${selectedFamily._id}`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${BASE_URL}/goals/${selectedFamily._id}`, { headers: { Authorization: `Bearer ${token}` } }).catch(err => ({ data: { goals: [] } })) // Fallback if endpoint fails initially
        ]);

        if (expensesRes.data && Array.isArray(expensesRes.data.sharedExpenses)) {
          setSharedExpenses(expensesRes.data.sharedExpenses);
        }

        if (goalsRes.data && Array.isArray(goalsRes.data.goals)) {
          setGoals(goalsRes.data.goals);
        }

      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error("Error fetching dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedFamily]);

  // Socket event listeners
  useEffect(() => {
    if (!socket) return;

    const handleSharedExpenseCreated = (newExpense) => {
      if (newExpense.familyGroup === selectedFamily?._id) {
        setSharedExpenses((prev) => [...prev, newExpense]);
        toast.success("New expense added");
      }
    };

    // Goals events could be added here too if backend emits them

    socket.on('shared_expense_created', handleSharedExpenseCreated);

    return () => {
      socket.off('shared_expense_created', handleSharedExpenseCreated);
    };
  }, [socket, selectedFamily]);

  // Join family group room when selected
  useEffect(() => {
    if (selectedFamily && socket) {
      socket.emit('join_family_group', selectedFamily._id);

      const fetchFamilyMembers = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get(`${BASE_URL}/family-groups/${selectedFamily._id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setFamilyMembers(response.data.family.members);
        } catch (error) {
          toast.error('Error fetching family members');
        }
      };

      fetchFamilyMembers();
    }
  }, [selectedFamily, socket]);

  const handleInviteMember = async () => {
    if (!inviteEmail) {
      toast.error('Please enter an email address');
      return;
    }
    setInviteLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${BASE_URL}/family-groups/${selectedFamily._id}/members`,
        { email: inviteEmail },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (socket) {
        socket.emit('invite_member', {
          familyGroupId: selectedFamily._id,
          email: inviteEmail,
          inviterName: response.data.inviterName
        });
      }

      setInviteEmail('');
      toast.success(`Invitation sent to ${inviteEmail}! Check inbox or dashboard.`);

      // Refresh family details to see pending invite in list
      const detailsRes = await axios.get(`${BASE_URL}/family-groups/${selectedFamily._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSelectedFamily(detailsRes.data.family);

    } catch (error) {
      toast.error(error.response?.data?.message || 'Error inviting member');
    } finally {
      setInviteLoading(false);
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (!window.confirm('Are you sure you want to remove this member from the household?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `${BASE_URL}/family-groups/${selectedFamily._id}/members/${memberId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success('Member removed successfully');
      setFamilyMembers(prev => prev.filter(m => m.user._id !== memberId));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error removing member');
    }
  };

  const deleteFamily = async () => {
    if (!window.confirm('Are you sure you want to delete this family group? This cannot be undone.')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${BASE_URL}/family-groups/${selectedFamily._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Household deleted');
      setFamilies(prev => prev.filter(f => f._id !== selectedFamily._id));
      setSelectedFamily(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error deleting household');
    }
  };

  const handleDeleteExpense = async (expenseId) => {
    if (!window.confirm('Delete this expense?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${BASE_URL}/shared-expenses/${expenseId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Expense deleted');
      setSharedExpenses(prev => prev.filter(e => e._id !== expenseId));
    } catch (error) {
      toast.error('Error deleting expense');
    }
  }

  const refreshGoals = async () => {
    if (!selectedFamily) return;
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${BASE_URL}/goals/${selectedFamily._id}`, { headers: { Authorization: `Bearer ${token}` } });
      setGoals(res.data.goals);
    } catch (err) { console.error(err); }
  }

  const isOwner = selectedFamily && currentUserId && selectedFamily.owner === currentUserId;

  return (
    <div className="min-h-screen bg-mesh py-8">
      <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
        {/* Header Section */}
        <div className="glass-card p-8 mb-8 fade-in-up">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center space-x-4">
              <div className="p-4 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl shadow-lg">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-display font-bold text-slate-900">Household Hub</h1>
                <p className="text-slate-600 mt-1">Manage shared finances</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-end gap-6 w-full md:w-auto">
              <div className="w-full md:w-auto min-w-[200px]">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Household
                </label>
                <div className="relative">
                  <select
                    onChange={(e) => setSelectedFamily(families.find(f => f._id === e.target.value))}
                    value={selectedFamily?._id || ""}
                    className="input-primary appearance-none cursor-pointer pr-10 text-sm font-semibold py-2.5"
                  >
                    <option value="">Select Household</option>
                    {families.map(family => (
                      <option key={family._id} value={family._id}>{family.name}</option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <Users className="h-4 w-4 text-slate-400" />
                  </div>
                </div>
              </div>

              {isOwner && (
                <button
                  onClick={deleteFamily}
                  className="w-full md:w-auto px-4 py-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all border border-red-200 shadow-sm hover:shadow-md active:scale-95"
                  title="Delete Household"
                >
                  <span className="text-xs font-bold whitespace-nowrap">
                    Delete Household
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>

        {selectedFamily ? (
          <div className="grid lg:grid-cols-12 gap-8">
            {/* Left Column: Members & Invite */}
            <div className="lg:col-span-4 space-y-8 fade-in-up" style={{ animationDelay: '0.1s' }}>
              {/* Invite Card */}
              <div className="glass-card p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <h3 className="text-lg font-bold text-slate-900">Invite Member</h3>
                </div>
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="input-primary flex-1"
                    placeholder="Email address"
                  />
                  <button
                    onClick={handleInviteMember}
                    disabled={inviteLoading}
                    className="p-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors shadow-lg shadow-primary-500/25 disabled:opacity-50"
                  >
                    {inviteLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Members List */}
              <div className="glass-card p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <h3 className="text-lg font-bold text-slate-900">Members</h3>
                </div>
                <div className="space-y-3">
                  {familyMembers.map((member, index) => (
                    <div
                      key={member?.user?._id}
                      className="flex items-center justify-between p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-md bg-gradient-to-br ${index % 2 === 0 ? 'from-blue-500 to-blue-600' : 'from-purple-500 to-purple-600'
                          }`}>
                          {member?.user?.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{member?.user?.name}</p>
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary-50 text-primary-700 capitalize">
                            {member?.role}
                          </span>
                        </div>
                      </div>

                      {isOwner && member?.user?._id !== currentUserId && (
                        <button
                          onClick={() => handleRemoveMember(member?.user?._id)}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                          title="Remove Member"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Pending Invitations */}
              {familyMembers.some(m => m.user._id === currentUserId && (m.role === 'owner' || m.role === 'admin')) && selectedFamily.invitations?.length > 0 && (
                <div className="glass-card p-6 mt-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <h3 className="text-lg font-bold text-slate-900 text-amber-800">Pending Invites</h3>
                  </div>
                  <div className="space-y-3">
                    {selectedFamily.invitations.filter(i => i.status === 'pending').map((invite, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-white border border-amber-100 rounded-xl shadow-sm"
                      >
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 font-bold text-xs shrink-0">
                            {invite.email.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-slate-900 truncate text-sm">{invite.email}</p>
                            <p className="text-xs text-slate-400">Expires {new Date(invite.expiresAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
                          Pending
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Tabs Content */}
            <div className="lg:col-span-8 fade-in-up" style={{ animationDelay: '0.2s' }}>

              {/* Tabs Switcher */}
              <div className="bg-white/50 backdrop-blur-sm p-1.5 rounded-2xl flex max-w-md mb-6 border border-white/20 shadow-sm">
                <button
                  onClick={() => setActiveTab('expenses')}
                  className={`flex-1 flex items-center justify-center space-x-2 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${activeTab === 'expenses' ? 'bg-white text-primary-700 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  <DollarSign className="w-4 h-4" />
                  <span>Shared Expenses</span>
                </button>
                <button
                  onClick={() => setActiveTab('goals')}
                  className={`flex-1 flex items-center justify-center space-x-2 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${activeTab === 'goals' ? 'bg-white text-primary-700 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  <Target className="w-4 h-4" />
                  <span>Joint Goals</span>
                </button>
              </div>

              <div className="glass-card p-8 min-h-[500px]">
                {/* HEADERS & ACTIONS */}
                <div className="flex justify-between items-center mb-8">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-2xl font-bold text-slate-900">
                      {activeTab === 'expenses' ? 'Shared Expenses' : 'Financial Goals'}
                    </h3>
                  </div>

                  {activeTab === 'expenses' ? (
                    <button
                      onClick={() => setShowExpenseForm(!showExpenseForm)}
                      className={`btn-primary flex items-center gap-2 ${showExpenseForm ? 'bg-red-500 hover:bg-red-600' : ''}`}
                    >
                      {showExpenseForm ? "Cancel" : <><PlusCircle className="w-5 h-5" /> Add Expense</>}
                    </button>
                  ) : (
                    <button
                      onClick={() => setShowGoalForm(true)}
                      className="btn-primary flex items-center gap-2"
                    >
                      <PlusCircle className="w-5 h-5" /> New Goal
                    </button>
                  )}
                </div>

                {/* MODALS & FORMS */}
                {showGoalForm && (
                  <CreateGoalModal
                    familyId={selectedFamily._id}
                    onClose={() => setShowGoalForm(false)}
                    onSuccess={() => { refreshGoals(); setShowGoalForm(false); }}
                  />
                )}

                {/* CONTENT AREA */}
                {activeTab === 'expenses' ? (
                  <>
                    {showExpenseForm && (
                      <div className="mb-8 animate-fade-in-down">
                        <ExpenseForm
                          familyId={selectedFamily._id}
                          onSuccess={() => {
                            setShowExpenseForm(false);
                          }}
                        />
                      </div>
                    )}

                    {loading ? (
                      <div className="flex justify-center items-center py-12">
                        <Loader2 className="h-8 w-8 text-primary-600 animate-spin" />
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {sharedExpenses.length === 0 ? (
                          <EmptyState
                            icon={Wallet}
                            title="No shared expenses yet"
                            subtitle="Add an expense to start tracking together"
                          />
                        ) : (
                          sharedExpenses.map((expense) => (
                            <ExpenseCard
                              key={expense._id}
                              expense={expense}
                              currentUserId={currentUserId}
                              isFamilyOwner={isOwner}
                              onDelete={() => handleDeleteExpense(expense._id)}
                            />
                          ))
                        )}
                      </div>
                    )}
                  </>
                ) : (
                  // GOALS TAB CONTENT
                  <>
                    {loading ? (
                      <div className="flex justify-center items-center py-12">
                        <Loader2 className="h-8 w-8 text-primary-600 animate-spin" />
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {goals.length === 0 ? (
                          <div className="col-span-full">
                            <EmptyState
                              icon={Target}
                              title="No active goals"
                              subtitle="Create a savings goal (e.g., Vacation) to track together"
                            />
                          </div>
                        ) : (
                          goals.map(goal => (
                            <GoalCard key={goal._id} goal={goal} onUpdate={refreshGoals} />
                          ))
                        )}
                      </div>
                    )}
                  </>
                )}

              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center glass-card opacity-50">
            <div className="bg-primary-50 p-6 rounded-full mb-6">
              <Users className="w-16 h-16 text-primary-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Select a Household</h2>
            <p className="text-slate-500 max-w-md mb-8">
              Choose a family from the list above or create a new one to start managing your household.
            </p>
            <Link
              to="/family/create"
              className="btn-primary flex items-center gap-2"
            >
              <PlusCircle className="w-5 h-5" />
              Create New Household
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper Component for Empty State
const EmptyState = ({ icon: Icon, title, subtitle }) => (
  <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-100 border-dashed w-full">
    <div className="bg-slate-100 p-4 rounded-full inline-flex mb-4">
      <Icon className="w-8 h-8 text-slate-400" />
    </div>
    <p className="text-lg font-medium text-slate-900">{title}</p>
    <p className="text-slate-500">{subtitle}</p>
  </div>
);

const ExpenseCard = ({ expense, currentUserId, isFamilyOwner, onDelete }) => {
  const canDelete = isFamilyOwner || (expense.paidBy?._id === currentUserId) || (expense.paidBy === currentUserId);

  return (
    <div className="bg-white border border-slate-100 rounded-xl p-6 hover:shadow-lg transition-all duration-300 group relative">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-start space-x-4">
          <div className="p-3 bg-primary-50 rounded-xl group-hover:bg-primary-100 transition-colors">
            <CreditCard className="h-6 w-6 text-primary-600" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200 uppercase tracking-wide">
                {expense.category}
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500">
                {new Date(expense.date || Date.now()).toLocaleDateString()}
              </span>
            </div>
            <h3 className="font-bold text-lg text-slate-900">
              {expense.description}
            </h3>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xl font-bold text-slate-900 block">
            ${expense.amount.toFixed(2)}
          </span>
          <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded mt-1 inline-block">
            {expense.splitType === 'equal' ? 'Split Equally' : 'Custom Split'}
          </span>
        </div>
      </div>

      {canDelete && (
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all border border-transparent hover:border-red-100"
          title="Delete Expense"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      )}

      <div className="pt-4 border-t border-slate-100">
        <div className="flex items-center gap-2 text-slate-500 text-sm font-medium mb-3">
          <PieChart className="w-4 h-4" />
          <span>Split Details</span>
        </div>
        <div className="space-y-2">
          {expense.splits?.map((split) => (
            <div
              key={split._id}
              className="flex justify-between items-center text-sm p-2 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                  {split.user?.name?.charAt(0)}
                </div>
                <span className="text-slate-700 font-medium">{split.user?.name}</span>
              </div>
              <span
                className={`
                px-2 py-1 rounded text-xs font-bold border
                ${split.status === "pending"
                    ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                    : split.status === "paid"
                      ? "bg-green-50 text-green-700 border-green-200"
                      : "bg-red-50 text-red-700 border-red-200"
                  }
              `}
              >
                ${Number(split.amount).toFixed(2)} • {split.status.toUpperCase()}
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
      toast.success("Expense created successfully!");
    } catch (error) {
      console.error('Error creating expense:', error);
      toast.error(error.response?.data?.message || "Error creating expense");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-50 rounded-xl p-6 border border-slate-200 shadow-inner">
      <h4 className="text-lg font-bold text-slate-900 mb-4">Add New Shared Expense</h4>
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
        className="mt-6 btn-success w-full flex items-center justify-center space-x-2"
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

export default FamilyDashboard;