import { useState } from 'react';
import { login } from '../api';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { loginSuccess } from '../store/authSlice';
import { TrendingUp, Shield, Trash2, Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft, LogIn } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
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

  const features = [
    {
      icon: <TrendingUp size={18} />,
      title: 'Smart Analytics',
      desc: 'AI-powered financial insights, in plain English.',
    },
    {
      icon: <Shield size={18} />,
      title: 'Secure & Private',
      desc: "Read-only access, encrypted at rest. We can't move a dollar.",
    },
    {
      icon: <Trash2 size={18} />,
      title: 'Intelligent Budgeting',
      desc: 'Automated expense tracking that bends to your rhythm.',
    },
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: "'Inter', sans-serif" }}>
      {/* ── LEFT PANEL ─────────────────────────────── */}
      <div
        className="login-left-panel"
        style={{
          width: '52%',
          background: '#2c2a20',
          display: 'flex',
          flexDirection: 'column',
          padding: '2.5rem 3rem',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Subtle texture overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(ellipse at 20% 80%, rgba(212,175,55,0.06) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(212,175,55,0.04) 0%, transparent 60%)',
          pointerEvents: 'none',
        }} />

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '3rem', position: 'relative' }}>
          <div style={{
            width: 36, height: 36, borderRadius: 8,
            background: '#3a3828',
            border: '1px solid rgba(212,175,55,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
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
          <p style={{ color: '#c9a84c', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1.2rem' }}>
            ✦ Welcome back
          </p>
          <h1 style={{
            fontSize: 'clamp(2.4rem, 4vw, 3.4rem)',
            fontWeight: 800,
            lineHeight: 1.08,
            color: '#e8dfc0',
            marginBottom: '1rem',
            fontFamily: "'Outfit', sans-serif",
          }}>
            Your journey to{' '}
            <span style={{
              fontStyle: 'italic',
              color: '#c9a84c',
              fontWeight: 700,
            }}>
              financial<br />freedom
            </span>{' '}
            starts here.
          </h1>
          <p style={{ color: '#9a9070', fontSize: '0.95rem', lineHeight: 1.7, maxWidth: '360px', marginBottom: '2.8rem' }}>
            Sign in to pick up where you left off — your goals, budgets and AI mentor are right where you parked them.
          </p>

          {/* Feature cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {features.map((f, i) => (
              <div
                key={i}
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: 12,
                  padding: '0.9rem 1.1rem',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.9rem',
                  transition: 'background 0.2s',
                }}
                className="login-feature-card"
              >
                <div style={{
                  width: 32, height: 32, borderRadius: 8,
                  background: 'rgba(201,168,76,0.12)',
                  color: '#c9a84c',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, marginTop: 1,
                }}>
                  {f.icon}
                </div>
                <div>
                  <div style={{ color: '#e0d8b8', fontWeight: 600, fontSize: '0.88rem', marginBottom: '0.2rem' }}>{f.title}</div>
                  <div style={{ color: '#7a7258', fontSize: '0.77rem', lineHeight: 1.5 }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ────────────────────────────── */}
      <div style={{
        flex: 1,
        background: '#f5f0e8',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}>
        {/* Top bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.4rem 2.5rem' }}>
          <button
            onClick={() => navigate('/')}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#6b6448', fontSize: '0.85rem', fontWeight: 500,
              transition: 'color 0.2s',
            }}
          >
            <ArrowLeft size={15} />
            Back home
          </button>
          <p style={{ color: '#8a7f60', fontSize: '0.82rem' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#2c2a20', fontWeight: 700, textDecoration: 'none' }}>
              Create one
            </Link>
          </p>
        </div>

        {/* Form container */}
        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem 3rem 3rem',
        }}>
          <div style={{ width: '100%', maxWidth: 420 }}>
            {/* Sign In badge */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              background: '#e8e0cc', borderRadius: 20,
              padding: '0.3rem 0.9rem', marginBottom: '1.5rem',
            }}>
              <LogIn size={14} style={{ color: '#6b6448' }} />
              <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#5a5034' }}>Sign In</span>
            </div>

            {/* Heading */}
            <h2 style={{
              fontSize: '2.1rem', fontWeight: 800, color: '#1a1810',
              marginBottom: '0.5rem', lineHeight: 1.1,
              fontFamily: "'Outfit', sans-serif",
            }}>
              Welcome <em style={{ fontStyle: 'italic', fontWeight: 400 }}>back.</em>
            </h2>
            <p style={{ color: '#8a7f60', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '2rem' }}>
              Sign in to continue to your dashboard. Same calm interface,<br />same place you left it.
            </p>

            {/* Error */}
            {error && (
              <div style={{
                background: '#fef2f2', border: '1px solid #fca5a5',
                borderRadius: 10, padding: '0.7rem 1rem',
                color: '#dc2626', fontSize: '0.83rem', marginBottom: '1.2rem',
                display: 'flex', alignItems: 'center', gap: '0.5rem',
              }}>
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              {/* Email */}
              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#5a5034', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                  Email Address
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#9a9070' }} />
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{
                      width: '100%', paddingLeft: '2.5rem', paddingRight: '1rem',
                      paddingTop: '0.75rem', paddingBottom: '0.75rem',
                      borderRadius: 10, border: '1.5px solid #d8d0b8',
                      background: '#faf7f0', color: '#1a1810', fontSize: '0.9rem',
                      outline: 'none', boxSizing: 'border-box',
                      transition: 'border-color 0.2s, box-shadow 0.2s',
                    }}
                    onFocus={e => { e.target.style.borderColor = '#c9a84c'; e.target.style.boxShadow = '0 0 0 3px rgba(201,168,76,0.15)'; }}
                    onBlur={e => { e.target.style.borderColor = '#d8d0b8'; e.target.style.boxShadow = 'none'; }}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#5a5034', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    Password
                  </label>
                  <a href="#" style={{ fontSize: '0.78rem', color: '#6b6448', fontWeight: 500, textDecoration: 'none' }}>
                    Forgot password?
                  </a>
                </div>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#9a9070' }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{
                      width: '100%', paddingLeft: '2.5rem', paddingRight: '2.8rem',
                      paddingTop: '0.75rem', paddingBottom: '0.75rem',
                      borderRadius: 10, border: '1.5px solid #d8d0b8',
                      background: '#faf7f0', color: '#1a1810', fontSize: '0.9rem',
                      outline: 'none', boxSizing: 'border-box',
                      transition: 'border-color 0.2s, box-shadow 0.2s',
                    }}
                    onFocus={e => { e.target.style.borderColor = '#c9a84c'; e.target.style.boxShadow = '0 0 0 3px rgba(201,168,76,0.15)'; }}
                    onBlur={e => { e.target.style.borderColor = '#d8d0b8'; e.target.style.boxShadow = 'none'; }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                      background: 'none', border: 'none', cursor: 'pointer', color: '#9a9070', padding: 2,
                    }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Remember me + Contact */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={e => setRememberMe(e.target.checked)}
                    style={{ accentColor: '#2c2a20', width: 14, height: 14 }}
                  />
                  <span style={{ fontSize: '0.82rem', color: '#6b6448' }}>Remember me</span>
                </label>
                <a href="#" style={{ fontSize: '0.82rem', color: '#6b6448', textDecoration: 'none' }}>
                  Need help? <strong style={{ color: '#2c2a20' }}>Contact us</strong>
                </a>
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
                  transition: 'background 0.2s, transform 0.15s',
                  letterSpacing: '0.02em',
                }}
                onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#3e3c28'; }}
                onMouseLeave={e => { if (!loading) e.currentTarget.style.background = '#2c2a20'; }}
              >
                {loading ? (
                  <>
                    <div style={{
                      width: 18, height: 18, border: '2px solid rgba(232,223,192,0.3)',
                      borderTopColor: '#e8dfc0', borderRadius: '50%',
                      animation: 'login-spin 0.7s linear infinite',
                    }} />
                    Signing In...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight size={17} />
                  </>
                )}
              </button>
            </form>



            {/* Register link */}
            <p style={{ textAlign: 'center', marginTop: '1.8rem', fontSize: '0.85rem', color: '#8a7f60' }}>
              Don't have an account?{' '}
              <Link to="/register" style={{ color: '#2c2a20', fontWeight: 700, textDecoration: 'none' }}>
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Spinner keyframes */}
      <style>{`
        @keyframes login-spin {
          to { transform: rotate(360deg); }
        }
        .login-feature-card:hover {
          background: rgba(255,255,255,0.07) !important;
        }
        @media (max-width: 768px) {
          .login-left-panel {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Login;