import { useState } from 'react';
import { login } from '../api';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { loginSuccess } from '../store/authSlice';
import { Lock, Mail, LogIn, Sparkles, TrendingUp, Shield } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await login(email, password);
      dispatch(loginSuccess({ token: response.token, user: response.user }));

      const returnUrl = localStorage.getItem('returnUrl');
      if (returnUrl) {
        localStorage.removeItem('returnUrl');
        navigate(returnUrl);
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.msg || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-50">
      {/* Left Side - Immersive Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 relative items-center justify-center p-12 overflow-hidden">
        {/* Dynamic Background Effects */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-20 w-96 h-96 bg-primary-600/30 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent-600/30 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-20 outline-none">
            {/* Geometric pattern overlay */}
            <div className="w-full h-full" style={{ backgroundImage: 'radial-gradient(circle at center, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
          </div>
        </div>

        {/* Branding Content */}
        <div className="relative z-10 max-w-lg space-y-10 fade-in-up">
          <div className="space-y-4">
            <h1 className="text-5xl lg:text-6xl font-display font-bold text-white tracking-tight">
              Money Mentor
            </h1>
            <p className="text-xl text-slate-300 font-medium">
              Your Journey to Financial Freedom Starts Here.
            </p>
          </div>

          <div className="space-y-6 pt-8 border-t border-slate-700/50">
            {[
              { title: 'Smart Analytics', desc: 'AI-powered financial insights', icon: <TrendingUp className="w-6 h-6 text-primary-400" /> },
              { title: 'Secure & Private', desc: 'Your data is encrypted and safe', icon: <Shield className="w-6 h-6 text-accent-400" /> },
              { title: 'Intelligent Budgeting', desc: 'Automated expense tracking', icon: <Sparkles className="w-6 h-6 text-primary-400" /> },
            ].map((feature, idx) => (
              <div key={idx} className="flex items-start space-x-4 glass-card-dark p-5 hover:-translate-y-1 transition-transform duration-300">
                <div className="p-3 bg-slate-800/80 rounded-xl rounded-tl-none border border-slate-700">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-white text-lg">{feature.title}</h3>
                  <p className="text-sm text-slate-400 mt-1">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 bg-white relative">
        <div className="w-full max-w-md scale-in space-y-8">
          
          <div className="text-center lg:text-left space-y-2">
            <div className="lg:hidden mb-8">
               <h1 className="text-4xl font-display font-bold gradient-text-ocean inline-block">Money Mentor</h1>
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 tracking-tight">
              Welcome Back
            </h2>
            <p className="text-slate-500 text-lg">
              Sign in to continue to your dashboard
            </p>
          </div>

          {error && (
            <div className="bg-red-50/80 backdrop-blur-sm border-l-4 border-red-500 text-red-700 p-4 rounded-r-xl shadow-sm flex items-start space-x-3 fade-in-up">
              <Shield className="h-5 w-5 flex-shrink-0 text-red-500 mt-0.5" />
              <span className="font-medium text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-5">
              <div className="group">
                <label className="block text-sm font-semibold text-slate-700 mb-1.5 transition-colors group-focus-within:text-primary-600">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-primary-500">
                    <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                  </div>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 focus:bg-white transition-all duration-300 placeholder:text-slate-400 text-slate-900 font-medium"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="group">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-sm font-semibold text-slate-700 transition-colors group-focus-within:text-primary-600">
                    Password
                  </label>
                  <a href="#" className="text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors">
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                  </div>
                  <input
                    type="password"
                    placeholder="Enter your password"
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 focus:bg-white transition-all duration-300 placeholder:text-slate-400 text-slate-900 font-medium"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <label className="flex items-center cursor-pointer group w-max">
                <div className="relative flex items-center justify-center">
                  <input
                    type="checkbox"
                    className="peer sr-only"
                  />
                  <div className="w-5 h-5 border-2 border-slate-300 rounded peer-checked:bg-primary-500 peer-checked:border-primary-500 transition-all flex items-center justify-center">
                    <svg className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <span className="ml-3 text-sm font-medium text-slate-600 group-hover:text-slate-800 transition-colors">Remember me</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center space-x-2 py-4 text-base shadow-lg shadow-primary-500/25 disabled:opacity-70 disabled:cursor-not-allowed group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
              <div className="relative flex items-center space-x-2">
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    <span>Signing In...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <LogIn className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </div>
            </button>
          </form>

          <div className="pt-6 border-t border-slate-100 text-center">
            <p className="text-slate-500 text-sm">
              Don't have an account?{' '}
              <Link to="/register" className="font-bold text-slate-900 hover:text-primary-600 transition-colors">
                Create an account
              </Link>
            </p>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Login;