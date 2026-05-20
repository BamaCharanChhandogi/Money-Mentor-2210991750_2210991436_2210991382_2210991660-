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
        <div className="p-6 relative overflow-hidden group hover:shadow-lg transition-all duration-300 rounded-2xl" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E0D5C8' }}>
            <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="flex items-center space-x-3">
                    <div className="p-3 rounded-xl" style={{ backgroundColor: percentage >= 100 ? '#E8F3EA' : '#F8F3CE', color: percentage >= 100 ? '#6B8E5A' : '#2A2925' }}>
                        {percentage >= 100 ? <Trophy className="w-6 h-6" /> : <Target className="w-6 h-6" />}
                    </div>
                    <div>
                        <h3 className="font-bold text-lg" style={{ color: '#2A2925' }}>{goal.name}</h3>
                        <div className="flex items-center text-xs space-x-1" style={{ color: '#7A7A73' }}>
                            <Calendar className="w-3 h-3" />
                            <span>{goal.deadline ? new Date(goal.deadline).toLocaleDateString() : 'No deadline'}</span>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col items-end">
                    <button
                        onClick={handleDelete}
                        className="p-1.5 rounded-lg transition-all mb-2"
                        style={{ color: '#B8745C' }}
                        title="Delete Goal"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="text-right">
                        <div className="text-sm" style={{ color: '#7A7A73' }}>Target</div>
                        <div className="font-bold" style={{ color: '#2A2925' }}>${goal.targetAmount.toLocaleString()}</div>
                    </div>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4 relative z-10">
                <div className="flex justify-between text-sm mb-1">
                    <span className="font-semibold" style={{ color: '#57564F' }}>${goal.currentAmount.toLocaleString()} saved</span>
                    <span className="font-semibold" style={{ color: percentage >= 100 ? '#6B8E5A' : '#2A2925' }}>{Math.round(percentage)}%</span>
                </div>
                <div className="w-full rounded-full h-3 overflow-hidden" style={{ backgroundColor: '#E8DCC4' }}>
                    <div
                        className="h-full rounded-full transition-all duration-1000 ease-out"
                        style={{
                          backgroundColor: percentage >= 100 ? '#6B8E5A' : '#2A2925',
                          width: `${percentage}%`
                        }}
                    ></div>
                </div>
            </div>

            {/* Contributions Sub-list */}
            {goal.contributions?.length > 0 && (
                <div className="mb-6 p-3 rounded-xl border" style={{ backgroundColor: '#F4F0D8', borderColor: '#E0D5C8' }}>
                    <div className="flex items-center gap-2 text-xs font-bold mb-2 uppercase tracking-wider" style={{ color: '#7A7A73' }}>
                        <Users className="w-3 h-3" />
                        <span>Contributions</span>
                    </div>
                    <div className="space-y-2 max-h-32 overflow-y-auto custom-scrollbar">
                        {goal.contributions.map((c, i) => (
                            <div key={i} className="flex justify-between items-center text-sm">
                                <span className="font-medium" style={{ color: '#57564F' }}>{c.user?.name || 'Unknown'}</span>
                                <span className="font-bold" style={{ color: '#2A2925' }}>${c.amount.toLocaleString()}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Actions */}
            <div className="relative z-10">
                {addingFunds ? (
                    <form onSubmit={handleContribute} className="flex flex-wrap items-center gap-3 animate-fade-in-up">
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Amount"
                            className="py-3 px-4 text-sm flex-1 min-w-[120px] rounded-lg focus:outline-none"
                            style={{ backgroundColor: '#F4F0D8', color: '#2A2925', border: '2px solid #2A2925' }}
                            autoFocus
                            min="0"
                        />
                        <div className="flex items-center gap-3">
                            <button
                                type="submit"
                                disabled={loading}
                                className="text-white px-6 py-2 rounded-lg text-sm font-bold shadow hover:shadow-md transition-all"
                                style={{ backgroundColor: '#2A2925' }}
                            >
                                {loading ? '...' : 'Add'}
                            </button>
                            <button
                                type="button"
                                onClick={() => setAddingFunds(false)}
                                className="text-sm transition-all whitespace-nowrap"
                                style={{ color: '#7A7A73' }}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                ) : (
                    <button
                        onClick={() => setAddingFunds(true)}
                        className="w-full py-2.5 rounded-xl border-dashed border-2 flex items-center justify-center space-x-2 transition-all duration-300"
                        style={{
                          borderColor: percentage >= 100 ? '#D4E8D8' : '#E0D5C8',
                          backgroundColor: percentage >= 100 ? '#E8F3EA' : '#FFFFFF',
                          color: percentage >= 100 ? '#6B8E5A' : '#2A2925'
                        }}
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