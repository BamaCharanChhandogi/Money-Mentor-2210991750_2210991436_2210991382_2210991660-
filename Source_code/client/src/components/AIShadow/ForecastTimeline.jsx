import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ReferenceLine, ResponsiveContainer,
} from 'recharts';

// Event dot on bill days
const EventDot = (props) => {
  const { cx, cy, payload } = props;
  if (!payload?.events?.length) return null;
  return (
    <g>
      <circle cx={cx} cy={cy} r={7} fill="#C9A24A" stroke="#fff" strokeWidth={2} />
      <circle cx={cx} cy={cy} r={3} fill="#fff" />
    </g>
  );
};

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  const balance = d?.projectedBalance ?? 0;
  const isWarn = balance < 100;
  return (
    <div style={{
      background: '#FFFFFF',
      border: `1px solid #E0D5C8`,
      borderRadius: 12, padding: '12px 16px', minWidth: 170,
    }}>
      <p style={{ color: '#7A7A73', fontSize: 11, margin: '0 0 4px', fontFamily: 'Inter, sans-serif' }}>
        {d?.displayDate}
      </p>
      <p style={{ color: isWarn ? '#B8745C' : '#6B8E5A', fontSize: 20, fontWeight: 800, margin: '0 0 6px', fontFamily: 'Georgia, serif' }}>
        ${balance.toFixed(2)}
      </p>
      {d?.events?.length > 0 && (
        <div>
          <p style={{ color: '#C9A24A', fontSize: 10, fontWeight: 700, margin: '0 0 4px' }}>📅 Bill due:</p>
          {d.events.map((ev, i) => (
            <p key={i} style={{ color: '#9B7D6B', fontSize: 11, margin: '2px 0' }}>
              {ev.label} — ${ev.amount}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

export default function ForecastTimeline({ simulation }) {
  if (!simulation?.length) {
    return <div style={{ textAlign: 'center', color: '#7A7A73', padding: '2rem' }}>No simulation data.</div>;
  }

  const data = simulation.map(d => ({
    ...d,
    displayDate: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
  }));

  const minBal = Math.min(...data.map(d => d.projectedBalance));
  const maxBal = Math.max(...data.map(d => d.projectedBalance));
  const hasWarn = data.some(d => d.projectedBalance < 100);
  const lineColor = hasWarn ? '#B8745C' : '#2A2925';

  return (
    <div>
      {/* Legend */}
      <div style={{ display: 'flex', gap: '1.25rem', marginBottom: 14, flexWrap: 'wrap', fontSize: 12, color: '#7A7A73' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 12, height: 3, borderRadius: 2, background: lineColor, display: 'inline-block' }} />
          Projected Balance
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#C9A24A', display: 'inline-block' }} />
          Bill Due
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 12, height: 2, background: 'rgba(184,116,92,0.3)', display: 'inline-block' }} />
          Danger (&lt;$100)
        </span>
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={data} margin={{ top: 10, right: 16, left: 8, bottom: 0 }}>
          <defs>
            <linearGradient id="balGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={lineColor} stopOpacity={0.15} />
              <stop offset="100%" stopColor={lineColor} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#E8DCC4" vertical={false} />
          <XAxis
            dataKey="displayDate"
            tick={{ fill: '#7A7A73', fontSize: 11, fontFamily: 'Inter, sans-serif' }}
            tickLine={false} axisLine={{ stroke: '#E0D5C8' }}
            interval={1}
          />
          <YAxis
            tick={{ fill: '#7A7A73', fontSize: 11, fontFamily: 'Inter, sans-serif' }}
            tickLine={false} axisLine={false}
            tickFormatter={v => `$${v}`}
            domain={[Math.min(minBal - 50, -50), maxBal + 80]}
            width={62}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine
            y={100} stroke="rgba(184,116,92,0.3)" strokeDasharray="5 3"
            label={{ value: '$100 threshold', fill: '#B8745C', fontSize: 10, position: 'insideTopRight' }}
          />
          <ReferenceLine y={0} stroke="rgba(184,116,92,0.15)" strokeDasharray="3 2" />
          <Area
            type="monotone" dataKey="projectedBalance"
            stroke={lineColor} strokeWidth={2.5}
            fill="url(#balGrad)"
            dot={<EventDot />}
            activeDot={{ r: 5, fill: lineColor, stroke: '#fff', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}