import { useState, useEffect } from 'react';
import { verifyOTP } from '../api';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../store/authSlice';
import { ShieldCheck, ArrowRight, Mail, Key } from 'lucide-react';

const Verify = () => {
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    }
  }, [location]);

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await verifyOTP({ email, otp });
      dispatch(loginSuccess({ token: response.token, user: response.user }));

      const returnUrl = localStorage.getItem('returnUrl');
      if (returnUrl) {
        localStorage.removeItem('returnUrl');
        navigate(returnUrl);
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.msg || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F4F0D8] px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#e8e4cc] scale-in">
          <div className="bg-[#2A2925] p-8 text-center relative overflow-hidden">
             {/* Decorative element */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#C9A24A]/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
            
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#C9A24A]/20 rounded-2xl mb-4 relative z-10">
              <ShieldCheck className="w-8 h-8 text-[#C9A24A]" />
            </div>
            <h2 className="text-3xl font-display font-bold text-white relative z-10">Verify Identity</h2>
            <p className="text-[#94918A] mt-2 relative z-10">We've sent a 6-digit code to your email</p>
          </div>

          <div className="p-8">
            {error && (
              <div className="bg-[#B8745C]/10 border-l-4 border-[#B8745C] text-[#B8745C] p-4 rounded-r-xl mb-6 text-sm font-medium animate-shake">
                {error}
              </div>
            )}

            <form onSubmit={handleVerify} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-[#2A2925] uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-[#94918A]" />
                  </div>
                  <input
                    type="email"
                    className="w-full pl-11 pr-4 py-3.5 bg-[#F4F0D8]/30 border border-[#e8e4cc] rounded-xl focus:ring-4 focus:ring-[#C9A24A]/10 focus:border-[#C9A24A] focus:bg-white transition-all duration-300 text-[#2A2925] font-medium"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-[#2A2925] uppercase tracking-wider">Verification Code</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Key className="h-5 w-5 text-[#94918A]" />
                  </div>
                  <input
                    type="text"
                    className="w-full pl-11 pr-4 py-3.5 bg-[#F4F0D8]/30 border border-[#e8e4cc] rounded-xl focus:ring-4 focus:ring-[#C9A24A]/10 focus:border-[#C9A24A] focus:bg-white transition-all duration-300 text-[#2A2925] font-bold tracking-[0.5em] text-center"
                    placeholder="000000"
                    maxLength="6"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-4 flex items-center justify-center space-x-2 group"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                ) : (
                  <>
                    <span>Verify Account</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              <div className="text-center pt-4">
                <p className="text-sm text-[#94918A]">
                  Didn't receive the code?{' '}
                  <button type="button" className="font-bold text-[#2A2925] hover:text-[#C9A24A] transition-colors underline decoration-[#C9A24A]/30">
                    Resend Code
                  </button>
                </p>
                <Link to="/register" className="block mt-4 text-xs font-bold text-[#94918A] uppercase tracking-widest hover:text-[#2A2925] transition-colors">
                  ← Back to Register
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Verify;