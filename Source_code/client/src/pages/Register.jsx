import { useState } from 'react';
import { register } from '../api';
import { useNavigate, Link } from 'react-router-dom';
import {
  User, Mail, Lock, Calendar, Briefcase, DollarSign,
  Users, Home, Car, Shield, Sparkles, TrendingUp, CheckCircle
} from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    dateOfBirth: '',
    occupation: '',
    annualIncome: '',
    maritalStatus: '',
    dependents: '',
    ownHome: false,
    ownCar: false,
    healthConditions: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await register(formData);
      if (response.success) {
        navigate('/verify', { state: { email: formData.email } });
      }
    } catch (err) {
      setError(err.response?.data?.msg || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-50">
      
      {/* Left Side - Immersive Branding (40% width on large screens) */}
      <div className="hidden lg:flex lg:w-2/5 bg-slate-900 relative items-center justify-center p-12 overflow-hidden">
        {/* Dynamic Background Effects */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 right-10 w-96 h-96 bg-primary-600/20 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-accent-600/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-10 outline-none">
            <div className="w-full h-full" style={{ backgroundImage: 'radial-gradient(circle at center, #ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
          </div>
        </div>

        {/* Branding Content */}
        <div className="relative z-10 w-full max-w-md space-y-10 fade-in-up">
          <div className="space-y-4">
            <Link to="/" className="inline-block">
              <h1 className="text-4xl lg:text-5xl font-display font-bold text-white tracking-tight hover:text-primary-400 transition-colors">
                Money Mentor
              </h1>
            </Link>
            <h2 className="text-2xl text-slate-200 font-semibold leading-relaxed">
              Start Your Financial Journey Today.
            </h2>
            <p className="text-slate-400 text-lg">
              Join thousands of users who are taking control of their financial future.
            </p>
          </div>

          <div className="space-y-5 pt-8 border-t border-slate-700/50">
            {[
              "Personalized Financial Advice",
              "Smart Budget Tracking",
              "Investment Portfolio Management",
              "Family Finance Sharing"
            ].map((feature, idx) => (
              <div key={idx} className="flex items-center space-x-3 text-slate-300 font-medium hover:text-white transition-colors">
                <div className="w-6 h-6 rounded-full bg-primary-500/20 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-4 h-4 text-primary-400" />
                </div>
                <span>{feature}</span>
              </div>
            ))}
          </div>

          {/* Testimonial Card */}
          <div className="glass-card-dark p-6 mt-12 bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 relative group">
            <div className="absolute -top-3 -left-3 text-4xl text-primary-500/50 group-hover:text-primary-500 transition-colors font-serif">"</div>
            <p className="text-sm font-medium text-slate-300 italic relative z-10">
              Money Mentor has completely transformed how I manage my expenses. Highly recommended!
            </p>
            <div className="flex items-center mt-5 space-x-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-primary-500 to-accent-500 flex items-center justify-center text-sm font-bold text-white shadow-lg">JD</div>
              <div>
                <p className="text-sm font-bold text-white">John Doe</p>
                <p className="text-xs text-primary-400">Early Adopter</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Registration Form (60% width on large screens) */}
      <div className="w-full lg:w-3/5 flex flex-col justify-center p-8 sm:p-12 lg:p-16 xl:p-24 bg-white relative overflow-y-auto custom-scrollbar">
        <div className="w-full max-w-2xl mx-auto scale-in space-y-8">
          
          <div className="text-center lg:text-left space-y-2">
            <div className="lg:hidden mb-8">
               <h1 className="text-4xl font-display font-bold gradient-text-ocean inline-block">Money Mentor</h1>
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 tracking-tight">
              Create Account
            </h2>
            <p className="text-slate-500 text-lg">
              Enter your details to register
            </p>
          </div>

          {error && (
            <div className="bg-red-50/80 backdrop-blur-sm border-l-4 border-red-500 text-red-700 p-4 rounded-r-xl shadow-sm flex items-start space-x-3 fade-in-up">
              <Shield className="h-5 w-5 flex-shrink-0 text-red-500 mt-0.5" />
              <span className="font-medium text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-8">
            
            {/* Personal Info Section */}
            <div className="space-y-5">
              <h3 className="flex items-center text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">
                <span className="bg-slate-100 text-slate-500 w-6 h-6 rounded-full flex items-center justify-center mr-2 text-xs">1</span>
                Personal Information
              </h3>
              <div className="grid md:grid-cols-2 gap-5">
                <div className="group">
                  <InputField
                    icon={User}
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="group">
                  <InputField
                    icon={Mail}
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="group">
                  <InputField
                    icon={Lock}
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="group">
                   <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Calendar className="h-5 w-5 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                    </div>
                    <input
                      type="date"
                      name="dateOfBirth"
                      className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 focus:bg-white transition-all duration-300 text-slate-900 font-medium"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Financial Profile Section */}
            <div className="space-y-5 pt-8 border-t border-slate-100">
              <h3 className="flex items-center text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">
                <span className="bg-slate-100 text-slate-500 w-6 h-6 rounded-full flex items-center justify-center mr-2 text-xs">2</span>
                Financial Profile
              </h3>
              <div className="grid md:grid-cols-2 gap-5">
                <InputField
                  icon={Briefcase}
                  type="text"
                  name="occupation"
                  placeholder="Occupation"
                  value={formData.occupation}
                  onChange={handleChange}
                />
                <InputField
                  icon={DollarSign}
                  type="number"
                  name="annualIncome"
                  placeholder="Annual Income"
                  value={formData.annualIncome}
                  onChange={handleChange}
                />
                <InputField
                  icon={Users}
                  type="text"
                  name="maritalStatus"
                  placeholder="Marital Status"
                  value={formData.maritalStatus}
                  onChange={handleChange}
                />
                <InputField
                  icon={Users}
                  type="number"
                  name="dependents"
                  placeholder="Number of Dependents"
                  value={formData.dependents}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Assets & Health Section */}
            <div className="space-y-5 pt-8 border-t border-slate-100">
              <h3 className="flex items-center text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">
                <span className="bg-slate-100 text-slate-500 w-6 h-6 rounded-full flex items-center justify-center mr-2 text-xs">3</span>
                Assets & Additional Info
              </h3>
              <div className="flex flex-wrap gap-4">
                <label className="flex-1 min-w-[140px] flex items-center justify-center p-4 rounded-xl border-2 border-slate-100 hover:border-primary-200 hover:bg-primary-50/50 cursor-pointer transition-all duration-300 has-[:checked]:border-primary-500 has-[:checked]:bg-primary-50">
                  <input
                    type="checkbox"
                    name="ownHome"
                    className="w-5 h-5 text-primary-600 border-slate-300 rounded focus:ring-primary-500 hidden peer"
                    checked={formData.ownHome}
                    onChange={handleChange}
                  />
                  <div className="flex flex-col items-center space-y-2">
                     <Home className={`h-6 w-6 ${formData.ownHome ? 'text-primary-500' : 'text-slate-400'} transition-colors`} />
                     <span className={`text-sm font-bold ${formData.ownHome ? 'text-primary-700' : 'text-slate-600'} transition-colors`}>Own Home</span>
                  </div>
                </label>
                <label className="flex-1 min-w-[140px] flex items-center justify-center p-4 rounded-xl border-2 border-slate-100 hover:border-primary-200 hover:bg-primary-50/50 cursor-pointer transition-all duration-300 has-[:checked]:border-primary-500 has-[:checked]:bg-primary-50">
                  <input
                    type="checkbox"
                    name="ownCar"
                    className="w-5 h-5 text-primary-600 border-slate-300 rounded focus:ring-primary-500 hidden peer"
                    checked={formData.ownCar}
                    onChange={handleChange}
                  />
                  <div className="flex flex-col items-center space-y-2">
                     <Car className={`h-6 w-6 ${formData.ownCar ? 'text-primary-500' : 'text-slate-400'} transition-colors`} />
                     <span className={`text-sm font-bold ${formData.ownCar ? 'text-primary-700' : 'text-slate-600'} transition-colors`}>Own Car</span>
                  </div>
                </label>
              </div>

              <div className="group relative mt-5">
                <div className="absolute top-4 left-0 pl-4 pointer-events-none">
                  <Shield className="h-5 w-5 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                </div>
                <textarea
                  name="healthConditions"
                  placeholder="Health Conditions (Optional)"
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 focus:bg-white transition-all duration-300 placeholder:text-slate-400 text-slate-900 font-medium resize-none"
                  rows="3"
                  value={formData.healthConditions}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="pt-6">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center space-x-2 py-4 text-base shadow-lg shadow-primary-500/25 disabled:opacity-70 disabled:cursor-not-allowed group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
                <div className="relative flex items-center justify-center space-x-2 w-full">
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <>
                      <span>Create Account</span>
                      <Sparkles className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                    </>
                  )}
                </div>
              </button>
            </div>

            <div className="text-center pb-4">
              <p className="text-slate-500 text-sm">
                Already have an account?{' '}
                <Link to="/login" className="font-bold text-slate-900 hover:text-primary-600 transition-colors">
                  Sign In
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

const InputField = ({ icon: Icon, ...props }) => (
  <div className="relative">
    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
      <Icon className="h-5 w-5 text-slate-400" />
    </div>
    <input
      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:bg-white focus:outline-none transition-all duration-300 placeholder:text-slate-400"
      {...props}
    />
  </div>
);

export default Register;