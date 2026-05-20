import React, { useState, useEffect, useCallback } from 'react';
import {
  Shield, ShieldAlert, ShieldCheck, RefreshCw, Eye, EyeOff,
  TrendingDown, DollarSign, Activity, Clock, WifiOff
} from 'lucide-react';
import { fetchShadowReport, dismissShadowAlert } from '../../api/shadow.js';
import ForecastTimeline from './ForecastTimeline.jsx';
import ShortfallAlertCard from './ShortfallAlertCard.jsx';
import SpendingPatternCard from './SpendingPatternCard.jsx';

// ── Local storage helpers ─────────────────────────────────────────────────────
const DISMISSED_KEY = 'shadow_dismissed_alerts';
const getDismissed = () => JSON.parse(localStorage.getItem(DISMISSED_KEY) || '[]');
const saveDismissed = (ids) => localStorage.setItem(DISMISSED_KEY, JSON.stringify(ids));

// ── Animated counter ──────────────────────────────────────────────────────────
function AnimatedNumber({ value, prefix = '', suffix = '', decimals = 0 }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = Number(value) || 0;
    const step = end / (1200 / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setDisplay(end); clearInterval(timer); }
      else setDisplay(start);
    }, 16);
    return () => clearInterval(timer);
  }, [value]);
  return <span>{prefix}{display.toFixed(decimals)}{suffix}</span>;
}

// ── Pulsing dot ───────────────────────────────────────────────────────────────
function StatusDot({ active, color }) {
  return (
    <span style={{ position: 'relative', display: 'inline-flex', width: 10, height: 10 }}>
      {active && (
        <span style={{
          position: 'absolute', inset: 0, borderRadius: '50%',
          background: color, opacity: 0.5,
          animation: 'pingDot 1.4s cubic-bezier(0,0,0.2,1) infinite'
        }} />
      )}
      <span style={{ width: 10, height: 10, borderRadius: '50%', background: color, display: 'block' }} />
    </span>
  );
}

// ── Light card wrapper ────────────────────────────────────────────────────────
function Card({ children, style = {} }) {
  return (
    <div style={{
      background: '#FFFFFF',
      border: '1px solid #E0D5C8',
      borderRadius: 20,
      ...style,
    }}>
      {children}
    </div>
  );
}

function CardHeader({ title, subtitle, icon: Icon, iconBg, iconColor = '#2A2925', action }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '20px 24px 0',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          width: 40, height: 40, borderRadius: 12,
          background: iconBg || '#F8F3CE',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <Icon size={18} color={iconColor} />
        </div>
        <div>
          <p style={{ color: '#2A2925', fontWeight: 700, fontSize: 15, margin: 0, fontFamily: 'Georgia, serif' }}>{title}</p>
          {subtitle && <p style={{ color: '#7A7A73', fontSize: 11, margin: '2px 0 0', fontFamily: 'Inter, sans-serif' }}>{subtitle}</p>}
        </div>
      </div>
      {action}
    </div>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────────────────
function Skeleton({ style = {} }) {
  return (
    <div style={{
      background: 'linear-gradient(90deg, #F4F0D8 25%, #E8DCC4 50%, #F4F0D8 75%)',
      backgroundSize: '200% 100%',
      animation: 'skeletonShimmer 1.5s infinite',
      borderRadius: 10, ...style,
    }}>
      <style>{`@keyframes skeletonShimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 14 }}>
        {[1,2,3,4].map(i => <Skeleton key={i} style={{ height: 90 }} />)}
      </div>
      <Skeleton style={{ height: 280 }} />
      <Skeleton style={{ height: 220 }} />
      <Skeleton style={{ height: 320 }} />
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────
export default function AIShadowDashboard() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dismissedIds, setDismissedIds] = useState(getDismissed);
  const [lastRefreshed, setLastRefreshed] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [shadowVisible, setShadowVisible] = useState(true);

  const loadReport = useCallback(async (isRefresh = false) => {
    if (isRefresh) setIsRefreshing(true);
    else setLoading(true);
    setError(null);
    try {
      const data = await fetchShadowReport();
      setReport(data);
      setLastRefreshed(new Date());
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load the AI Shadow report. Please ensure you are logged in.');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => { loadReport(); }, [loadReport]);

  const handleDismiss = useCallback(async (alertId) => {
    try { await dismissShadowAlert(alertId); } catch (_) {}
    const updated = [...getDismissed(), alertId];
    saveDismissed(updated);
    setDismissedIds(updated);
  }, []);

  const activeShortfalls = report?.shortfalls?.filter(s => !dismissedIds.includes(s.id)) ?? [];
  const allClear = report?.allClear || activeShortfalls.length === 0;
  const hasData = report !== null;

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#F4F0D8',
      fontFamily: 'Inter, sans-serif',
      paddingBottom: '3rem',
    }}>

      {/* ── Hero Banner ──────────────────────────────────────────────── */}
      <div style={{
        backgroundColor: '#2A2925',
        padding: '2.5rem 2rem 2.5rem',
        position: 'relative',
        overflow: 'hidden',
        borderBottom: '1px solid #E0D5C8',
      }}>

        <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative' }}>
          {/* Top bar */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexWrap: 'wrap', gap: 12, marginBottom: '1.75rem',
          }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: '#F8F3CE', borderRadius: 30,
              border: '1px solid #E0D5C8', padding: '6px 14px',
            }}>
              <StatusDot active color="#6B8E5A" />
              <span style={{ color: '#2A2925', fontSize: 11, fontWeight: 700, letterSpacing: '1px', fontFamily: 'Georgia, serif' }}>
                AI SHADOW ACTIVE
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              {lastRefreshed && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#E8DCC4', fontSize: 11 }}>
                  <Clock size={11} />
                  {lastRefreshed.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </div>
              )}
              <button
                onClick={() => setShadowVisible(v => !v)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  background: '#3A3935', border: '1px solid #E0D5C8',
                  borderRadius: 10, padding: '7px 14px', cursor: 'pointer',
                  color: '#E8DCC4', fontSize: 12, fontWeight: 600, transition: 'all 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#4A4945'}
                onMouseLeave={e => e.currentTarget.style.background = '#3A3935'}
              >
                {shadowVisible ? <EyeOff size={13} /> : <Eye size={13} />}
                {shadowVisible ? 'Hide' : 'Show'}
              </button>
              <button
                onClick={() => loadReport(true)}
                disabled={isRefreshing}
                style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  background: '#9B7D6B', border: '1px solid #C9A24A',
                  borderRadius: 10, padding: '7px 14px', cursor: isRefreshing ? 'not-allowed' : 'pointer',
                  color: '#FFFFFF', fontSize: 12, fontWeight: 600,
                  opacity: isRefreshing ? 0.6 : 1, transition: 'all 0.2s',
                }}
              >
                <RefreshCw size={13} style={{ animation: isRefreshing ? 'spinAnim 1s linear infinite' : 'none' }} />
                {isRefreshing ? 'Refreshing…' : 'Refresh'}
              </button>
            </div>
          </div>

          {/* Title row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
            <div style={{
              width: 68, height: 68, borderRadius: 18, flexShrink: 0,
              background: '#F8F3CE',
              border: '1px solid #E0D5C8',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {loading ? <Shield size={32} color="#2A2925" /> :
               allClear ? <ShieldCheck size={32} color="#6B8E5A" /> :
               <ShieldAlert size={32} color="#B8745C" style={{ animation: 'pulseIcon 2s ease-in-out infinite' }} />}
            </div>
            <div>
              <h1 style={{
                color: '#FFFFFF', fontWeight: 800,
                fontSize: 'clamp(1.5rem, 4vw, 2.2rem)', margin: '0 0 6px',
                fontFamily: 'Georgia, serif', letterSpacing: '-0.5px',
              }}>
                AI Financial Shadow
              </h1>
              <p style={{ color: '#E8DCC4', fontSize: 13, margin: 0 }}>
                Proactive financial guardian — predicting shortfalls before they happen
              </p>
            </div>
          </div>

          {/* Status banner */}
          {!loading && hasData && (
            <div style={{
              marginTop: '1.5rem',
              padding: '14px 20px',
              borderRadius: 14,
              background: allClear
                ? '#F8F3CE'
                : '#E8DCC4',
              border: `1px solid ${allClear ? '#E0D5C8' : '#E0D5C8'}`,
              display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <StatusDot active={!allClear} color={allClear ? '#6B8E5A' : '#B8745C'} />
              <div>
                <span style={{
                  color: allClear ? '#2A2925' : '#2A2925',
                  fontWeight: 700, fontSize: 14, fontFamily: 'Georgia, serif',
                }}>
                  {allClear
                    ? '✅ All Clear — No shortfalls in the next 14 days'
                    : `⚠️ ${activeShortfalls.length} Shortfall${activeShortfalls.length > 1 ? 's' : ''} Detected — Review alerts below`}
                </span>
                <p style={{ color: '#57564F', fontSize: 12, margin: '3px 0 0' }}>
                  {allClear
                    ? 'Your projected balance stays healthy. Keep it up!'
                    : 'Your balance may dip to a risky level. Take action to prevent overdrafts.'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Body ──────────────────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '2rem 1.5rem' }}>

        {/* Loading */}
        {loading && (
          <Card>
            <div style={{ padding: '2rem', textAlign: 'center', borderBottom: '1px solid #E0D5C8' }}>
              <p style={{ color: '#2A2925', fontWeight: 700, fontSize: 15, margin: '0 0 6px', fontFamily: 'Georgia, serif' }}>
                🧠 Shadow is analysing your finances…
              </p>
              <p style={{ color: '#7A7A73', fontSize: 13, margin: 0 }}>
                Running 14-day simulation and generating AI insights. This takes a few seconds.
              </p>
            </div>
            <LoadingSkeleton />
          </Card>
        )}

        {/* Error */}
        {!loading && error && (
          <Card style={{ padding: '3rem', textAlign: 'center' }}>
            <WifiOff size={48} color="#B8745C" style={{ marginBottom: 16 }} />
            <h3 style={{ color: '#2A2925', fontFamily: 'Georgia, serif', marginBottom: 8 }}>Shadow Offline</h3>
            <p style={{ color: '#7A7A73', fontSize: 14, marginBottom: 20 }}>{error}</p>
            <button
              onClick={() => loadReport()}
              style={{
                background: '#2A2925',
                border: 'none', borderRadius: 12, padding: '11px 28px',
                color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: 14,
              }}
            >Try Again</button>
          </Card>
        )}

        {/* Main content */}
        {!loading && !error && hasData && shadowVisible && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', animation: 'fadeUp 0.5s ease-out' }}>

            {/* ── Stat cards ────────────────────────────────────── */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
              gap: '1rem',
            }}>
              {[
                { label: 'Current Balance', value: report.startingBalance, prefix: '$', decimals: 0,
                  color: '#6B8E5A', bg: '#F8F3CE', border: '#E0D5C8', iconBg: '#F8F3CE', icon: DollarSign },
                { label: 'Avg Daily Spend', value: report.avgDailySpend, prefix: '$', decimals: 2,
                  color: '#B8745C', bg: '#F4F0D8', border: '#E0D5C8', iconBg: '#F8F3CE', icon: TrendingDown },
                { label: 'Days Simulated', value: report.simulation?.length ?? 0, suffix: ' days', decimals: 0,
                  color: '#2A2925', bg: '#F4F0D8', border: '#E0D5C8', iconBg: '#F8F3CE', icon: Activity },
                { label: 'Active Alerts', value: activeShortfalls.length, decimals: 0,
                  color: activeShortfalls.length > 0 ? '#B8745C' : '#6B8E5A',
                  bg: '#F4F0D8',
                  border: '#E0D5C8',
                  iconBg: '#F8F3CE',
                  icon: activeShortfalls.length > 0 ? ShieldAlert : ShieldCheck },
              ].map((s, i) => (
                <div key={i} style={{
                  background: s.bg,
                  border: `1px solid ${s.border}`,
                  borderRadius: 16, padding: '18px 20px',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  cursor: 'default',
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = `0 8px 24px rgba(0,0,0,0.08)`; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  <div style={{
                    width: 36, height: 36, borderRadius: 10, background: s.iconBg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12,
                  }}>
                    <s.icon size={18} color={s.color} />
                  </div>
                  <p style={{ color: s.color, fontSize: 24, fontWeight: 800, margin: '0 0 4px', fontFamily: 'Georgia, serif' }}>
                    <AnimatedNumber value={s.value} prefix={s.prefix || ''} suffix={s.suffix || ''} decimals={s.decimals} />
                  </p>
                  <p style={{ color: '#7A7A73', fontSize: 11, margin: 0, fontWeight: 600, letterSpacing: '0.3px' }}>
                    {s.label}
                  </p>
                </div>
              ))}
            </div>

            {/* ── Forecast Timeline ─────────────────────────────────── */}
            <Card>
              <CardHeader
                icon={Activity} iconColor="#2A2925" iconBg="#F8F3CE"
                title="14-Day Balance Forecast"
                subtitle="Projected daily balance including predicted bills and average spending"
              />
              <div style={{ padding: '20px 24px 24px' }}>
                <ForecastTimeline simulation={report.simulation} />
              </div>
            </Card>

            {/* ── Shortfall Alerts — FULL WIDTH ─────────────────────── */}
            <Card>
              <CardHeader
                icon={ShieldAlert} iconColor="#B8745C" iconBg="#F8F3CE"
                title="Shortfall Alerts"
                subtitle={activeShortfalls.length === 0 ? 'No active alerts' : `${activeShortfalls.length} alert${activeShortfalls.length > 1 ? 's' : ''} need attention`}
                action={
                  activeShortfalls.length > 0 && (
                    <span style={{
                      background: '#F8F3CE', color: '#2A2925',
                      fontSize: 10, fontWeight: 800, padding: '4px 10px',
                      borderRadius: 20, border: '1px solid #E0D5C8', letterSpacing: '0.5px',
                    }}>
                      {activeShortfalls.length} ACTIVE
                    </span>
                  )
                }
              />
              <div style={{ padding: '16px 20px 20px' }}>
                {activeShortfalls.length === 0 ? (
                  <div style={{
                    textAlign: 'center', padding: '2rem 1rem',
                    background: '#F8F3CE', borderRadius: 14,
                    border: '1px dashed #E0D5C8',
                  }}>
                    <ShieldCheck size={36} color="#6B8E5A" style={{ marginBottom: 12 }} />
                    <p style={{ color: '#2A2925', fontWeight: 700, fontSize: 15, margin: '0 0 6px', fontFamily: 'Georgia, serif' }}>
                      All Clear!
                    </p>
                    <p style={{ color: '#7A7A73', fontSize: 13, margin: 0 }}>
                      No shortfalls projected in the next 14 days. Your finances look great!
                    </p>
                  </div>
                ) : (
                  /* ── FLEXIBLE GRID ── */
                  <div style={{
                    display: activeShortfalls.length === 1 ? 'block' : 'grid',
                    gridTemplateColumns: activeShortfalls.length === 1
                      ? 'none'
                      : 'repeat(auto-fill, minmax(300px, 1fr))',
                    gap: '20px',
                  }}>
                    {activeShortfalls.map((alert) => (
                      <ShortfallAlertCard
                        key={alert.id}
                        alert={alert}
                        onDismiss={handleDismiss}
                        isFullWidth={activeShortfalls.length === 1}
                      />
                    ))}
                  </div>
                )}

                {dismissedIds.length > 0 && (
                  <div style={{ marginTop: 12, textAlign: 'center', color: '#7A7A73', fontSize: 12 }}>
                    {dismissedIds.length} alert{dismissedIds.length > 1 ? 's' : ''} dismissed.{' '}
                    <button
                      onClick={() => { saveDismissed([]); setDismissedIds([]); }}
                      style={{ background: 'none', border: 'none', color: '#2A2925', cursor: 'pointer', fontSize: 12, textDecoration: 'underline', padding: 0 }}
                    >
                      Restore all
                    </button>
                  </div>
                )}
              </div>
            </Card>

            {/* ── Spending Volatility — FULL WIDTH ──────────────────── */}
            <Card>
              <CardHeader
                icon={TrendingDown} iconColor="#9B7D6B" iconBg="#F8F3CE"
                title="Spending Volatility"
                subtitle="Categories with most unpredictable spending (last 90 days)"
              />
              <div style={{ padding: '16px 20px 24px' }}>
                <SpendingPatternCard patterns={report.patterns} />

                {report.patterns && report.patterns.length > 0 && (
                  <div style={{
                    marginTop: 16, padding: '12px 14px',
                    background: '#F8F3CE', border: '1px solid #E0D5C8',
                    borderRadius: 12,
                  }}>
                    <p style={{ color: '#2A2925', fontSize: 12, margin: 0, lineHeight: 1.6 }}>
                      💡 <strong style={{ color: '#2A2925' }}>Shadow Tip:</strong>{' '}
                      Your most volatile category is <strong style={{ color: '#9B7D6B' }}>{report.patterns[0]?.category}</strong>.
                      A 20% reduction here could meaningfully protect your month-end balance.
                    </p>
                  </div>
                )}
              </div>
            </Card>

          </div>
        )}

        {/* Hidden state */}
        {!loading && !error && hasData && !shadowVisible && (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', animation: 'fadeUp 0.4s ease-out' }}>
            <Eye size={48} color="#7A7A73" style={{ marginBottom: 16 }} />
            <h3 style={{ color: '#57564F', fontFamily: 'Georgia, serif', marginBottom: 8 }}>Shadow is hidden</h3>
            <p style={{ color: '#7A7A73', fontSize: 14, marginBottom: 20 }}>
              The AI Shadow is monitoring in the background. Click below to view your report.
            </p>
            <button
              onClick={() => setShadowVisible(true)}
              style={{
                background: '#2A2925',
                border: 'none', borderRadius: 12, padding: '11px 28px',
                color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: 14,
              }}
            >Show Shadow</button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
        @keyframes spinAnim { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }
        @keyframes pulseIcon { 0%,100% { transform:scale(1); } 50% { transform:scale(1.1); } }
        @keyframes pingDot { 0%{transform:scale(1);opacity:.5} 100%{transform:scale(2.4);opacity:0} }
      `}</style>
    </div>
  );
}