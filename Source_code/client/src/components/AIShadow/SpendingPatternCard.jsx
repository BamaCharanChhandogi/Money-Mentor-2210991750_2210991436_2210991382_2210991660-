import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

function Sparkline({ amounts, color }) {
  if (!amounts?.length) return null;
  const max = Math.max(...amounts);
  const min = Math.min(...amounts);
  const range = max - min || 1;
  const W = 72, H = 28;
  const pts = amounts.map((v, i) => {
    const x = (i / (amounts.length - 1)) * W;
    const y = H - ((v - min) / range) * H;
    return `${x},${y}`;
  });
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      <path d={`M${pts.join(' L')}`} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      {amounts.map((v, i) => {
        const x = (i / (amounts.length - 1)) * W;
        const y = H - ((v - min) / range) * H;
        return <circle key={i} cx={x} cy={y} r={2.5} fill={color} />;
      })}
    </svg>
  );
}

export default function SpendingPatternCard({ patterns }) {
  if (!patterns?.length) {
    return <div style={{ color: '#94a3b8', textAlign: 'center', padding: '1.5rem', fontSize: 13 }}>Not enough data to analyse patterns yet.</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {patterns.slice(0, 5).map((p, idx) => {
        const pct = p.avgMonthly > 0 ? Math.round((p.volatility / p.avgMonthly) * 100) : 0;
        const color = pct > 40 ? '#dc2626' : pct > 20 ? '#d97706' : '#059669';
        const bg = pct > 40 ? '#fff5f5' : pct > 20 ? '#fffbeb' : '#f0fdf4';
        const border = pct > 40 ? '#fecaca' : pct > 20 ? '#fde68a' : '#bbf7d0';
        const TrendIcon = pct > 40 ? TrendingUp : pct > 20 ? Minus : TrendingDown;

        return (
          <div key={idx} style={{
            background: bg, border: `1px solid ${border}`,
            borderRadius: 12, padding: '12px 14px',
            display: 'flex', alignItems: 'center', gap: 10,
            transition: 'all 0.2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 4px 14px ${border}`; e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            {/* Rank */}
            <div style={{
              width: 26, height: 26, borderRadius: '50%',
              background: '#fff', border: `1px solid ${border}`,
              color: '#64748b', fontSize: 11, fontWeight: 800,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, fontFamily: 'Outfit, sans-serif',
            }}>
              {idx + 1}
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <p style={{
                  color: '#0f172a', fontWeight: 600, fontSize: 13, margin: 0,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  fontFamily: 'Inter, sans-serif',
                }}>
                  {p.category}
                </p>
                {p.isRecurring && (
                  <span style={{
                    background: '#dbeafe', color: '#1d4ed8',
                    fontSize: 9, fontWeight: 700, padding: '2px 6px',
                    borderRadius: 20, flexShrink: 0, letterSpacing: '0.4px',
                  }}>
                    RECURRING
                  </span>
                )}
              </div>
              <p style={{ color: '#94a3b8', fontSize: 11, margin: '2px 0 0' }}>
                avg ${p.avgMonthly.toFixed(0)}/mo
              </p>
            </div>

            {/* Sparkline */}
            <Sparkline amounts={p.monthlyAmounts} color={color} />

            {/* Volatility */}
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 3, color, fontSize: 13, fontWeight: 700, justifyContent: 'flex-end', fontFamily: 'Outfit, sans-serif' }}>
                <TrendIcon size={12} />
                {pct}%
              </div>
              <p style={{ color: '#cbd5e1', fontSize: 10, margin: 0 }}>volatility</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
