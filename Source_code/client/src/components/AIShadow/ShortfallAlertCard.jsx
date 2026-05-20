import React, { useState } from 'react';
import { AlertTriangle, AlertOctagon, CheckCircle, X, Lightbulb, Calendar, Zap, TrendingDown, List } from 'lucide-react';

const severityConfig = {
  critical: {
    cardBg: '#F4F0D8', border: '#E0D5C8', headerBg: '#F8F3CE',
    accent: '#B8745C',
    badgeBg: '#F8F3CE', badgeColor: '#B8745C', badgeText: 'CRITICAL',
    icon: AlertOctagon, iconColor: '#B8745C',
    balanceColor: '#B8745C', balanceBg: '#F4F0D8',
    recBg: '#F8F3CE', recBorder: '#E0D5C8', recTitle: '#2A2925', recText: '#57564F',
  },
  warning: {
    cardBg: '#F4F0D8', border: '#E0D5C8', headerBg: '#F8F3CE',
    accent: '#9B7D6B',
    badgeBg: '#F8F3CE', badgeColor: '#9B7D6B', badgeText: 'WARNING',
    icon: AlertTriangle, iconColor: '#9B7D6B',
    balanceColor: '#9B7D6B', balanceBg: '#F4F0D8',
    recBg: '#F8F3CE', recBorder: '#E0D5C8', recTitle: '#2A2925', recText: '#57564F',
  },
};

function fmt(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function ShortfallAlertCard({ alert, onDismiss, isFullWidth = false }) {
  const [isDismissing, setIsDismissing] = useState(false);
  const config = severityConfig[alert.severity] || severityConfig.warning;
  const Icon = config.icon;

  const startDate = alert.startDate || alert.date;
  const endDate = alert.endDate || alert.date;
  const worstBalance = alert.worstBalance ?? alert.estimatedBalance ?? 0;
  const duration = alert.durationDays || 1;
  const triggers = alert.allTriggers || [];
  const totalExposure = alert.totalBillExposure || 0;

  const periodLabel = duration === 1
    ? fmt(startDate)
    : `${fmt(startDate)} – ${fmt(endDate)}`;

  const handleDismiss = () => {
    setIsDismissing(true);
    setTimeout(() => onDismiss(alert.id), 350);
  };

  return (
    <div style={{
      background: config.cardBg,
      border: `1px solid ${config.border}`,
      borderRadius: 16,
      overflow: 'hidden',
      transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)',
      transform: isDismissing ? 'scale(0.96) translateY(-8px)' : 'scale(1)',
      opacity: isDismissing ? 0 : 1,
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
    }}>

      {/* ── Header ── */}
      <div style={{
        background: config.headerBg,
        padding: isFullWidth ? '16px 24px' : '12px 14px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: `1px solid ${config.border}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: isFullWidth ? 42 : 34, height: isFullWidth ? 42 : 34,
            borderRadius: '50%', background: '#FFFFFF',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon size={isFullWidth ? 20 : 17} color={config.iconColor} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                background: config.badgeBg, color: config.badgeColor,
                fontSize: 10, fontWeight: 800, letterSpacing: '0.8px',
                padding: '2.5px 8px', borderRadius: 20,
              }}>
                <Zap size={9} />{config.badgeText}
              </span>
              {isFullWidth && (
                <span style={{ color: '#7A7A73', fontSize: 11, fontWeight: 600 }}>
                  Potential Shortfall Detected
                </span>
              )}
            </div>
            <p style={{
              color: '#2A2925', fontWeight: 800,
              fontSize: isFullWidth ? 16 : 13,
              margin: '3px 0 0', fontFamily: 'Georgia, serif'
            }}>
              {duration > 1 ? `${duration}-Day Risk Window` : 'Balance Risk'}
            </p>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          style={{
            background: '#FFFFFF', border: '1px solid #E0D5C8',
            borderRadius: '50%', width: 32, height: 32, display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: '#7A7A73', transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#F8F3CE'; e.currentTarget.style.color = '#B8745C'; }}
          onMouseLeave={e => { e.currentTarget.style.background = '#FFFFFF'; e.currentTarget.style.color = '#7A7A73'; }}
        >
          <X size={14} />
        </button>
      </div>

      {/* ── Body ── */}
      <div style={{
        padding: isFullWidth ? '24px' : '14px',
        display: 'flex',
        flexDirection: isFullWidth ? 'row' : 'column',
        gap: isFullWidth ? 24 : 10,
        flex: 1
      }}>

        {/* LEFT / TOP SECTION: Summary & Bills */}
        <div style={{ flex: isFullWidth ? '0 0 45%' : '1', display: 'flex', flexDirection: 'column', gap: 10 }}>

          {/* Period + Worst Balance */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <div style={{ background: '#F8F3CE', border: '1px solid #E0D5C8', borderRadius: 12, padding: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#2A2925', fontSize: 10, fontWeight: 700, marginBottom: 4 }}>
                <Calendar size={11} />
                {duration > 1 ? 'PERIOD' : 'DATE'}
              </div>
              <p style={{ color: '#2A2925', fontSize: 14, fontWeight: 800, margin: 0 }}>{periodLabel}</p>
              {duration > 1 && (
                <p style={{ color: '#7A7A73', fontSize: 11, margin: '2px 0 0' }}>{duration} days at risk</p>
              )}
            </div>
            <div style={{ background: config.balanceBg, border: `1px solid ${config.border}`, borderRadius: 12, padding: '12px' }}>
              <div style={{ color: config.accent, fontSize: 10, fontWeight: 700, marginBottom: 4 }}>LOWEST BALANCE</div>
              <p style={{ color: config.accent, fontSize: 22, fontWeight: 900, margin: 0, fontFamily: 'Georgia, serif' }}>
                ${worstBalance.toFixed(0)}
              </p>
              {duration > 1 && (
                <p style={{ color: '#7A7A73', fontSize: 11, margin: '2px 0 0' }}>on {fmt(alert.worstDate || startDate)}</p>
              )}
            </div>
          </div>

          {/* Bill Triggers */}
          {triggers.length > 0 && (
            <div style={{ background: '#F8F3CE', border: '1px solid #E0D5C8', borderRadius: 12, padding: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#7A7A73', fontSize: 11, fontWeight: 700, marginBottom: 10 }}>
                <List size={11} />
                UPCOMING BILLS IN WINDOW
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {triggers.map((t, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#57564F', fontSize: 13, fontWeight: 500 }}>{t.label}</span>
                    <span style={{ color: config.accent, fontSize: 13, fontWeight: 800 }}>${t.amount.toFixed(0)}</span>
                  </div>
                ))}
                <div style={{ borderTop: '1px solid #E0D5C8', marginTop: 6, paddingTop: 6, display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#7A7A73', fontSize: 12, fontWeight: 700 }}>Total exposure</span>
                  <span style={{ color: '#2A2925', fontSize: 14, fontWeight: 900 }}>${totalExposure.toFixed(0)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Daily spend fallback */}
          {triggers.length === 0 && (
            <div style={{ background: '#F8F3CE', border: '1px solid #E0D5C8', borderRadius: 12, padding: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#7A7A73', fontSize: 11, fontWeight: 700, marginBottom: 4 }}>
                <TrendingDown size={11} /> CAUSE
              </div>
              <p style={{ color: '#57564F', fontSize: 13, margin: 0, lineHeight: 1.6 }}>
                Continuous daily discretionary spending over {duration} days without significant income buffer.
              </p>
            </div>
          )}
        </div>

        {/* RIGHT / BOTTOM SECTION: Recommendation & Action */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* AI Recommendation */}
          {alert.recommendation && (
            <div style={{
              background: '#F8F3CE', border: '1px solid #E0D5C8',
              borderRadius: 14, padding: isFullWidth ? '20px' : '14px',
              height: isFullWidth ? '100%' : 'auto',
              display: 'flex', flexDirection: 'column'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#2A2925', fontSize: 11, fontWeight: 800, marginBottom: 10 }}>
                <Lightbulb size={13} /> AI SHADOW RECOMMENDATION
              </div>
              <p style={{
                color: '#57564F',
                fontSize: isFullWidth ? 15 : 12,
                lineHeight: 1.7, margin: 0, fontStyle: 'italic',
                fontFamily: 'Georgia, serif'
              }}>
                "{alert.recommendation}"
              </p>
              {isFullWidth && (
                <div style={{ marginTop: 'auto', paddingTop: 16, borderTop: '1px solid #E0D5C8' }}>
                  <p style={{ color: '#2A2925', fontSize: 11, fontWeight: 700, margin: 0 }}>
                    💡 Proactive guidance based on your predicted cash flow.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Action button */}
          <button
            onClick={handleDismiss}
            style={{
              width: '100%',
              padding: isFullWidth ? '14px' : '10px',
              background: '#2A2925',
              border: 'none', borderRadius: 12,
              color: '#fff', fontWeight: 800,
              fontSize: isFullWidth ? 14 : 12,
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.opacity = '0.85'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            <CheckCircle size={isFullWidth ? 16 : 14} />
            I'll handle this — Dismiss Alert
          </button>
        </div>

      </div>
    </div>
  );
}