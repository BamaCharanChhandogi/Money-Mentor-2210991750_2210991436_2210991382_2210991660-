import { useState } from 'react';
import { register } from '../api';
import { useNavigate, Link } from 'react-router-dom';
import {
  User, Mail, Lock, Calendar, Briefcase, DollarSign,
  Users, Home, Car, Shield, CheckCircle,
  ArrowLeft, ArrowRight, UserPlus
} from 'lucide-react';

/* ─────────────────────────────────────────────────────────────
   InputField — defined OUTSIDE the component so React never
   treats it as a new component type on re-render, which would
   unmount the <input> and lose cursor focus on every keystroke.
───────────────────────────────────────────────────────────── */
const inputBaseStyle = {
  width: '100%',
  paddingLeft: '2.4rem',
  paddingRight: '0.9rem',
  paddingTop: '0.65rem',
  paddingBottom: '0.65rem',
  borderRadius: 9,
  border: '1.5px solid #d8d0b8',
  background: '#faf7f0',
  color: '#1a1810',
  fontSize: '0.875rem',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.2s, box-shadow 0.2s',
  fontFamily: "'Inter', sans-serif",
};

const handleFocusIn  = e => { e.target.style.borderColor = '#c9a84c'; e.target.style.boxShadow = '0 0 0 3px rgba(201,168,76,0.15)'; };
const handleFocusOut = e => { e.target.style.borderColor = '#d8d0b8'; e.target.style.boxShadow = 'none'; };

const InputField = ({ icon: Icon, type = 'text', name, placeholder, value, onChange, required }) => (
  <div style={{ position: 'relative' }}>
    <Icon size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9a9070', pointerEvents: 'none' }} />
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      style={inputBaseStyle}
      onFocus={handleFocusIn}
      onBlur={handleFocusOut}
    />
  </div>
);

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




  const sectionLabel = { fontSize: '0.67rem', fontWeight: 700, color: '#9a8c60', letterSpacing: '0.13em', textTransform: 'uppercase', marginBottom: '0.75rem', display: 'block' };
  const divider = { height: 1, background: '#e8e0cc', margin: '1.2rem 0' };

  const perks = [
    'Personalized Financial Advice',
    'Smart Budget Tracking',
    'Investment Portfolio Management',
    'Family Finance Sharing',
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: "'Inter', sans-serif" }}>

      {/* ══ LEFT PANEL ══════════════════════════════════════ */}
      <div
        className="reg-left-panel"
        style={{
          width: '42%',
          background: '#2c2a20',
          display: 'flex',
          flexDirection: 'column',
          padding: '2.5rem 2.8rem',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Ambient glow */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'radial-gradient(ellipse at 15% 85%, rgba(212,175,55,0.07) 0%, transparent 55%), radial-gradient(ellipse at 85% 15%, rgba(212,175,55,0.04) 0%, transparent 55%)',
        }} />

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '3rem', position: 'relative' }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: '#3a3828', border: '1px solid rgba(212,175,55,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" />
            </svg>
          </div>
          <div>
            <div style={{ color: '#e8dfc0', fontWeight: 700, fontSize: '0.95rem', letterSpacing: '0.02em' }}>Money Mentor</div>
            <div style={{ color: '#8a8060', fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Smart Finance</div>
          </div>
        </div>

        {/* Headline */}
        <div style={{ flex: 1, position: 'relative' }}>
          <p style={{ color: '#c9a84c', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1.1rem' }}>
            ✦ Join thousands of users
          </p>
          <h1 style={{ fontSize: 'clamp(2rem, 3.2vw, 2.8rem)', fontWeight: 800, lineHeight: 1.1, color: '#e8dfc0', marginBottom: '1rem', fontFamily: "'Outfit', sans-serif" }}>
            Start your{' '}
            <em style={{ fontStyle: 'italic', color: '#c9a84c', fontWeight: 700 }}>financial<br />journey</em>{' '}
            today.
          </h1>
          <p style={{ color: '#9a9070', fontSize: '0.9rem', lineHeight: 1.7, maxWidth: '320px', marginBottom: '2.4rem' }}>
            Join thousands of users who are taking control of their financial future.
          </p>

          {/* Perk list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem', marginBottom: '2.4rem' }}>
            {perks.map((perk, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
                <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(201,168,76,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <CheckCircle size={13} style={{ color: '#c9a84c' }} />
                </div>
                <span style={{ color: '#c8bfa0', fontSize: '0.85rem', fontWeight: 500 }}>{perk}</span>
              </div>
            ))}
          </div>

          {/* Testimonial */}
          <div style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 14, padding: '1.1rem 1.2rem',
          }}>
            <p style={{ color: '#9a9070', fontSize: '0.82rem', lineHeight: 1.65, fontStyle: 'italic', marginBottom: '0.9rem' }}>
              "Money Mentor has completely transformed how I manage my expenses. Highly recommended!"
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#3e3c28', border: '1px solid rgba(201,168,76,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700, color: '#c9a84c' }}>
                JD
              </div>
              <div>
                <div style={{ color: '#e0d8b8', fontSize: '0.8rem', fontWeight: 700 }}>John Doe</div>
                <div style={{ color: '#6a6248', fontSize: '0.72rem' }}>Early Adopter</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══ RIGHT PANEL ═════════════════════════════════════ */}
      <div style={{ flex: 1, background: '#f5f0e8', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>

        {/* Top bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.3rem 2.5rem', flexShrink: 0 }}>
          <button
            onClick={() => navigate('/')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'none', border: 'none', cursor: 'pointer', color: '#6b6448', fontSize: '0.85rem', fontWeight: 500 }}
          >
            <ArrowLeft size={15} /> Back home
          </button>
          <p style={{ color: '#8a7f60', fontSize: '0.82rem' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#2c2a20', fontWeight: 700, textDecoration: 'none' }}>Sign In</Link>
          </p>
        </div>

        {/* Form container */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', padding: '0.5rem 2.5rem 3rem' }}>
          <div style={{ width: '100%', maxWidth: 580 }}>

            {/* Badge */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#e8e0cc', borderRadius: 20, padding: '0.3rem 0.9rem', marginBottom: '1.3rem' }}>
              <UserPlus size={13} style={{ color: '#6b6448' }} />
              <span style={{ fontSize: '0.77rem', fontWeight: 600, color: '#5a5034' }}>Create Account</span>
            </div>

            {/* Heading */}
            <h2 style={{ fontSize: '1.9rem', fontWeight: 800, color: '#1a1810', marginBottom: '0.4rem', lineHeight: 1.1, fontFamily: "'Outfit', sans-serif" }}>
              Welcome to <em style={{ fontStyle: 'italic', fontWeight: 400 }}>Money Mentor.</em>
            </h2>
            <p style={{ color: '#8a7f60', fontSize: '0.84rem', lineHeight: 1.6, marginBottom: '1.6rem' }}>
              Enter your details to create your account and start your journey.
            </p>

            {/* Error */}
            {error && (
              <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 10, padding: '0.7rem 1rem', color: '#dc2626', fontSize: '0.83rem', marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Shield size={15} />
                {error}
              </div>
            )}

            <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>

              {/* ── Personal Information ── */}
              <span style={sectionLabel}>Personal Information</span>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <InputField icon={User}     type="text"     name="name"        placeholder="Full Name"       value={formData.name}        onChange={handleChange} required />
                <InputField icon={Mail}     type="email"    name="email"       placeholder="Email Address"   value={formData.email}       onChange={handleChange} required />
                <InputField icon={Lock}     type="password" name="password"    placeholder="Password"        value={formData.password}    onChange={handleChange} required />
                <InputField icon={Calendar} type="date"     name="dateOfBirth"                               value={formData.dateOfBirth} onChange={handleChange} />
              </div>

              <div style={divider} />

              {/* ── Financial Profile ── */}
              <span style={sectionLabel}>Financial Profile</span>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <InputField icon={Briefcase}  type="text"   name="occupation"    placeholder="Occupation"            value={formData.occupation}    onChange={handleChange} />
                <InputField icon={DollarSign} type="number" name="annualIncome"  placeholder="Annual Income"         value={formData.annualIncome}  onChange={handleChange} />
                <InputField icon={Users}      type="text"   name="maritalStatus" placeholder="Marital Status"        value={formData.maritalStatus} onChange={handleChange} />
                <InputField icon={Users}      type="number" name="dependents"    placeholder="Number of Dependents"  value={formData.dependents}    onChange={handleChange} />
              </div>

              <div style={divider} />

              {/* ── Assets & Additional Info ── */}
              <span style={sectionLabel}>Assets &amp; Additional Info</span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.9rem' }}>

                {/* Own Home */}
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1rem', borderRadius: 9, border: '1.5px solid #d8d0b8', background: formData.ownHome ? 'rgba(201,168,76,0.1)' : '#faf7f0', cursor: 'pointer', transition: 'all 0.2s' }}>
                  <input
                    type="checkbox"
                    name="ownHome"
                    checked={formData.ownHome}
                    onChange={handleChange}
                    style={{ accentColor: '#2c2a20', width: 15, height: 15 }}
                  />
                  <Home size={14} style={{ color: '#9a9070' }} />
                  <span style={{ fontSize: '0.83rem', fontWeight: 600, color: '#3a3828' }}>Own Home</span>
                </label>

                {/* Own Car */}
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1rem', borderRadius: 9, border: '1.5px solid #d8d0b8', background: formData.ownCar ? 'rgba(201,168,76,0.1)' : '#faf7f0', cursor: 'pointer', transition: 'all 0.2s' }}>
                  <input
                    type="checkbox"
                    name="ownCar"
                    checked={formData.ownCar}
                    onChange={handleChange}
                    style={{ accentColor: '#2c2a20', width: 15, height: 15 }}
                  />
                  <Car size={14} style={{ color: '#9a9070' }} />
                  <span style={{ fontSize: '0.83rem', fontWeight: 600, color: '#3a3828' }}>Own Car</span>
                </label>
              </div>

              {/* Health Conditions textarea */}
              <div style={{ position: 'relative', marginBottom: '1.4rem' }}>
                <Shield size={15} style={{ position: 'absolute', left: 12, top: 14, color: '#9a9070', pointerEvents: 'none' }} />
                <textarea
                  name="healthConditions"
                  placeholder="Health Conditions (Optional)"
                  rows={2}
                  value={formData.healthConditions}
                  onChange={handleChange}
                  style={{ ...inputBaseStyle, paddingTop: '0.7rem', paddingBottom: '0.7rem', resize: 'none', fontFamily: "'Inter', sans-serif" }}
                  onFocus={handleFocusIn}
                  onBlur={handleFocusOut}
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  background: loading ? '#4a4838' : '#2c2a20',
                  color: '#e8dfc0',
                  border: 'none',
                  borderRadius: 12,
                  padding: '0.9rem 1.5rem',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                  transition: 'background 0.2s',
                  letterSpacing: '0.02em',
                  marginBottom: '1.2rem',
                }}
                onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#3e3c28'; }}
                onMouseLeave={e => { if (!loading) e.currentTarget.style.background = '#2c2a20'; }}
              >
                {loading ? (
                  <>
                    <div style={{ width: 18, height: 18, border: '2px solid rgba(232,223,192,0.3)', borderTopColor: '#e8dfc0', borderRadius: '50%', animation: 'reg-spin 0.7s linear infinite' }} />
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight size={17} />
                  </>
                )}
              </button>

              {/* Sign in link */}
              <p style={{ textAlign: 'center', fontSize: '0.85rem', color: '#8a7f60' }}>
                Already have an account?{' '}
                <Link to="/login" style={{ color: '#2c2a20', fontWeight: 700, textDecoration: 'none' }}>
                  Sign In
                </Link>
              </p>

            </form>
          </div>
        </div>
      </div>

      {/* Keyframes */}
      <style>{`
        @keyframes reg-spin { to { transform: rotate(360deg); } }
        @media (max-width: 768px) { .reg-left-panel { display: none !important; } }
      `}</style>
    </div>
  );
};

export default Register;