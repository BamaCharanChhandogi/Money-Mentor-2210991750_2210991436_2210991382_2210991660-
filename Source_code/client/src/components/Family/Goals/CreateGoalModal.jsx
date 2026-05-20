import React, { useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../../api';
import { toast } from 'react-hot-toast';
import { Target, Calendar, DollarSign, X, Loader2 } from 'lucide-react';

const CreateGoalModal = ({ familyId, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        name: '',
        targetAmount: '',
        deadline: ''
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            await axios.post(`${BASE_URL}/goals`,
                { ...formData, familyGroupId: familyId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success('Goal created successfully!');
            onSuccess();
            onClose();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error creating goal');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-in">

                {/* Header */}
                <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-6 flex justify-between items-center text-white">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                            <Target className="w-6 h-6" />
                        </div>
                        <h2 className="text-xl font-bold">New Financial Goal</h2>
                    </div>
                    <button onClick={onClose} className="hover:bg-white/20 p-1 rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Goal Name</label>
                        <input
                            type="text"
                            required
                            placeholder="e.g. New Car, Vacation"
                            className="input-primary w-full"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Target Amount</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                <DollarSign className="w-4 h-4" />
                            </div>
                            <input
                                type="number"
                                required
                                placeholder="0.00"
                                className="input-primary w-full pl-9"
                                min="0"
                                step="0.01"
                                value={formData.targetAmount}
                                onChange={e => setFormData({ ...formData, targetAmount: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Target Date (Optional)</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                <Calendar className="w-4 h-4" />
                            </div>
                            <input
                                type="date"
                                className="input-primary w-full pl-9"
                                value={formData.deadline}
                                onChange={e => setFormData({ ...formData, deadline: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-2.5 rounded-xl bg-primary-600 text-white font-semibold shadow-lg hover:bg-primary-700 transition-colors flex justify-center items-center"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Goal'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateGoalModal;
