import React, { useState } from 'react';
import { Target, Calendar, Plus, Trophy, CheckCircle2, Trash2, Users } from 'lucide-react';
import axios from 'axios';
import { BASE_URL } from '../../../api';
import { toast } from 'react-hot-toast';

const GoalCard = ({ goal, onUpdate }) => {
    const [addingFunds, setAddingFunds] = useState(false);
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);

    const percentage = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);

    const handleContribute = async (e) => {
        e.preventDefault();
        if (!amount || amount <= 0) return;

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            await axios.patch(`${BASE_URL}/goals/${goal._id}/contribute`,
                { amount: Number(amount) },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success('Funds added successfully!');
            setAmount('');
            setAddingFunds(false);
            onUpdate();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error adding funds');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this goal?')) return;

        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${BASE_URL}/goals/${goal._id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Goal deleted');
            onUpdate();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error deleting goal');
        }
    };

    return (
        <div className="glass-card p-6 relative overflow-hidden group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

            <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="flex items-center space-x-3">
                    <div className={`p-3 rounded-xl ${percentage >= 100 ? 'bg-green-100 text-green-600' : 'bg-primary-50 text-primary-600'}`}>
                        {percentage >= 100 ? <Trophy className="w-6 h-6" /> : <Target className="w-6 h-6" />}
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900 text-lg">{goal.name}</h3>
                        <div className="flex items-center text-xs text-slate-500 space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span>{goal.deadline ? new Date(goal.deadline).toLocaleDateString() : 'No deadline'}</span>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col items-end">
                    <button
                        onClick={handleDelete}
                        className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all mb-2"
                        title="Delete Goal"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="text-right">
                        <div className="text-sm text-slate-500">Target</div>
                        <div className="font-bold text-slate-900">${goal.targetAmount.toLocaleString()}</div>
                    </div>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4 relative z-10">
                <div className="flex justify-between text-sm mb-1">
                    <span className="font-semibold text-slate-700">${goal.currentAmount.toLocaleString()} saved</span>
                    <span className="font-semibold text-primary-600">{Math.round(percentage)}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                    <div
                        className={`h-full rounded-full transition-all duration-1000 ease-out ${percentage >= 100 ? 'bg-green-500' : 'bg-gradient-to-r from-primary-500 to-primary-600'}`}
                        style={{ width: `${percentage}%` }}
                    ></div>
                </div>
            </div>

            {/* Contributions Sub-list */}
            {goal.contributions?.length > 0 && (
                <div className="mb-6 p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
                        <Users className="w-3 h-3" />
                        <span>Contributions</span>
                    </div>
                    <div className="space-y-2 max-h-32 overflow-y-auto custom-scrollbar">
                        {goal.contributions.map((c, i) => (
                            <div key={i} className="flex justify-between items-center text-sm">
                                <span className="text-slate-600 font-medium">{c.user?.name || 'Unknown'}</span>
                                <span className="font-bold text-slate-900">${c.amount.toLocaleString()}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Actions */}
            <div className="relative z-10">
                {addingFunds ? (
                    <form onSubmit={handleContribute} className="flex gap-2 animate-fade-in-up">
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Amount"
                            className="input-primary py-2 px-3 text-sm flex-1"
                            autoFocus
                            min="0"
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-primary-600 text-white px-3 py-2 rounded-lg text-sm font-semibold shadow hover:bg-primary-700 transition-colors"
                        >
                            {loading ? '...' : 'Add'}
                        </button>
                        <button
                            type="button"
                            onClick={() => setAddingFunds(false)}
                            className="text-slate-400 hover:text-slate-600 px-2"
                        >
                            Cancel
                        </button>
                    </form>
                ) : (
                    <button
                        onClick={() => setAddingFunds(true)}
                        className={`w-full py-2.5 rounded-xl border-dashed border-2 flex items-center justify-center space-x-2 transition-all duration-300
                    ${percentage >= 100
                                ? 'border-green-200 bg-green-50 text-green-700 cursor-default'
                                : 'border-slate-200 hover:border-primary-400 hover:bg-primary-50 text-slate-600 hover:text-primary-700'}`}
                        disabled={percentage >= 100}
                    >
                        {percentage >= 100 ? (
                            <>
                                <CheckCircle2 className="w-4 h-4" />
                                <span>Goal Completed!</span>
                            </>
                        ) : (
                            <>
                                <Plus className="w-4 h-4" />
                                <span>Contribute Funds</span>
                            </>
                        )}
                    </button>
                )}
            </div>
        </div>
    );
};

export default GoalCard;
