import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { joinFamily } from '../api';
import { Users, CheckCircle, AlertCircle, Loader2, ArrowRight } from 'lucide-react';
import { toast } from 'react-hot-toast';

const JoinFamily = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('idle'); // idle, success, error
    const [message, setMessage] = useState('');

    const token = searchParams.get('token');
    const familyId = searchParams.get('familyId');

    useEffect(() => {
        // Check if user is logged in
        const authToken = localStorage.getItem('token');
        if (!authToken) {
            // Store current URL to redirect back after login
            localStorage.setItem('returnUrl', window.location.pathname + window.location.search);
            toast.error('Please log in to accept the invitation');
            navigate('/login');
        }
    }, [navigate]);

    const handleJoin = async () => {
        if (!token || !familyId) {
            toast.error('Invalid invitation link');
            return;
        }

        setLoading(true);
        try {
            await joinFamily({ token, familyId });
            setStatus('success');
            setMessage('Successfully joined the family!');
            toast.success('Welcome to the family!');

            // Delay navigation to let user see success message
            setTimeout(() => {
                navigate('/family/manage');
            }, 2000);

        } catch (error) {
            console.error(error);
            setStatus('error');
            setMessage(error.response?.data?.message || 'Failed to join family');
        } finally {
            setLoading(false);
        }
    };

    if (!token || !familyId) {
        return (
            <div className="min-h-screen bg-mesh flex items-center justify-center p-4">
                <div className="glass-card p-8 max-w-md w-full text-center">
                    <div className="bg-red-50 p-4 rounded-full inline-flex mb-4">
                        <AlertCircle className="w-8 h-8 text-red-500" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 mb-2">Invalid Link</h2>
                    <p className="text-slate-600 mb-6">This invitation link appears to be broken or missing information.</p>
                    <button onClick={() => navigate('/')} className="btn-primary w-full">Go Home</button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-mesh flex items-center justify-center p-4">
            <div className="glass-card p-8 max-w-md w-full text-center fade-in-up">

                {status === 'idle' && (
                    <>
                        <div className="bg-primary-50 p-6 rounded-full inline-flex mb-6 animate-pulse">
                            <Users className="w-12 h-12 text-primary-600" />
                        </div>
                        <h1 className="text-2xl font-display font-bold text-slate-900 mb-2">
                            Join Family Group
                        </h1>
                        <p className="text-slate-600 mb-8">
                            You've been invited to join a family group on Money Mentor. Collaborate on expenses and goals!
                        </p>
                        <button
                            onClick={handleJoin}
                            disabled={loading}
                            className="btn-primary w-full flex items-center justify-center py-4 text-lg shadow-xl shadow-primary-500/20"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                    Joining...
                                </>
                            ) : (
                                <>
                                    Accept Invitation
                                    <ArrowRight className="w-5 h-5 ml-2" />
                                </>
                            )}
                        </button>
                    </>
                )}

                {status === 'success' && (
                    <div className="scale-in">
                        <div className="bg-green-50 p-6 rounded-full inline-flex mb-6">
                            <CheckCircle className="w-12 h-12 text-green-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">You're In!</h2>
                        <p className="text-slate-600 mb-6">{message}</p>
                        <p className="text-sm text-slate-400">Redirecting to dashboard...</p>
                    </div>
                )}

                {status === 'error' && (
                    <div className="scale-in">
                        <div className="bg-red-50 p-6 rounded-full inline-flex mb-6">
                            <AlertCircle className="w-12 h-12 text-red-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">Invitation Failed</h2>
                        <p className="text-slate-600 mb-6">{message}</p>
                        <button onClick={() => navigate('/family/manage')} className="btn-outline w-full">
                            Go to Dashboard
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
};

export default JoinFamily;
