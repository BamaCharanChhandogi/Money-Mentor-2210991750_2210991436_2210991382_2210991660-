import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { UserPlus, Users, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

import { BASE_URL } from '../../api';

const CreateFamily = () => {
  const [familyName, setFamilyName] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${BASE_URL}/family-groups`,
        { name: familyName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Family created successfully!');
      navigate('/family/manage');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error creating family');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-mesh py-12">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-2xl mx-auto">
          {/* Back Button */}
          <Link
            to="/family"
            className="inline-flex items-center space-x-2 text-slate-600 hover:text-primary-600 mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="font-medium">Back to Family</span>
          </Link>

          {/* Main Card */}
          <div className="glass-card p-8 md:p-12 shadow-2xl fade-in-up">
            <div className="text-center mb-8">
              <div className="inline-flex p-4 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl shadow-lg mb-6">
                <UserPlus className="h-10 w-10 text-white" />
              </div>
              <h1 className="text-3xl font-display font-bold text-slate-900 mb-2">
                Create a New Family
              </h1>
              <p className="text-slate-600">
                Start managing your family's finances together
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Family Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Users className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    value={familyName}
                    onChange={(e) => setFamilyName(e.target.value)}
                    className="input-primary pl-11"
                    placeholder="e.g., Smith Family, Johnson Household"
                    required
                  />
                </div>
                <p className="mt-2 text-sm text-slate-500">
                  Choose a name that all family members will recognize
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-primary-500/25"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    <span>Creating...</span>
                  </div>
                ) : (
                  'Create Family'
                )}
              </button>
            </form>

            {/* Info Section */}
            <div className="mt-8 p-4 bg-primary-50 rounded-xl border border-primary-100">
              <h3 className="font-semibold text-slate-900 mb-2">What happens next?</h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">•</span>
                  <span>You'll be the family admin with full permissions</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">•</span>
                  <span>You can invite family members via email</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">•</span>
                  <span>Start tracking shared expenses and budgets</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateFamily;
