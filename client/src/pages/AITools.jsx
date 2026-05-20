import { Link } from 'react-router-dom';
import { Zap, Shield, Cpu, CheckCircle, ArrowRight, ChevronRight } from 'lucide-react';

/* ── Design tokens ── */
const C = {
  bg:     '#f5f0e8',
  dark:   '#2c2a20',
  darker: '#1e1c14',
  gold:   '#c9a84c',
  goldL:  '#d4b558',
  cream:  '#e8dfc0',
  muted:  '#7a7258',
  dim:    '#4e4c38',
};

/* ─────────────────────────────────────────────
   Pillars data (Section 3)
───────────────────────────────────────────── */
const pillars = [
  {
    emoji: '💰', label: 'Expense Management', color: '#3b6cf0', bg: '#eef2ff',
    tools: [
      { name: 'add_expense',    desc: 'Swiftly log cash or card spending by just saying it.' },
      { name: 'update_expense', desc: 'Correct past entries using plain English.' },
      { name: 'delete_expense', desc: 'Remove transactions with a confirmation loop.' },
    ],
  },
  {
    emoji: '📊', label: 'Smart Budgeting', color: '#16a34a', bg: '#f0fdf4',
    tools: [
      { name: 'create_budget',     desc: 'Set monthly limits for Groceries, Fuel, or Fun.' },
      { name: 'update_budget',     desc: 'Adjust budget limits on the fly.' },
      { name: 'get_budget_status', desc: 'AI calculates exactly how much room you have left.' },
    ],
  },
  {
    emoji: '🏦', label: 'Bank Intelligence', color: '#7c3aed', bg: '#faf5ff',
    tools: [
      { name: 'get_bank_balances',           desc: 'Instantly fetch live Plaid-linked bank totals.' },
      { name: 'get_recent_bank_transactions', desc: 'Sync digital spending history into your analysis.' },
    ],
  },
  {
    emoji: '👨‍👩‍👧', label: 'Family Finance', color: '#2563eb', bg: '#eff6ff',
    tools: [
      { name: 'split_family_expense',  desc: 'Automatically divide a bill among group members.' },
      { name: 'get_family_docs',       desc: "AI remembers who still hasn't paid you back." },
      { name: 'settle_shared_expense', desc: 'Update balances when someone pays their share.' },
    ],
  },
  {
    emoji: '📈', label: 'Investment Tracker', color: '#dc2626', bg: '#fef2f2',
    tools: [
      { name: 'add_investment',    desc: 'Track stocks, crypto, or mutual funds.' },
      { name: 'update_investment', desc: 'Update share counts after buying or selling.' },
      { name: 'delete_investment', desc: 'Prune your portfolio with confirmation.' },
      { name: 'get_portfolio',     desc: 'AI summarizes your total net worth & performance.' },
    ],
  },
  {
    emoji: '🎯', label: 'Financial Goals', color: '#ea580c', bg: '#fff7ed',
    tools: [
      { name: 'create_goal',           desc: 'Start a new saving target (e.g., Car Downpayment).' },
      { name: 'add_goal_contribution', desc: 'Log money saved toward a specific dream.' },
      { name: 'simulate_goal_impact',  desc: 'Crystal Ball: simulate how spending affects your deadline.' },
    ],
  },
];

/* ─────────────────────────────────────────────
   Natural language examples (Section 2)
───────────────────────────────────────────── */
const examples = [
  { icon: '💸', quote: '"I spent $45 on groceries today"',         action: 'Logs expense instantly' },
  { icon: '📊', quote: '"How much is left in my food budget?"',    action: 'Shows remaining budget' },
  { icon: '🏦', quote: '"What\'s my bank balance right now?"',     action: 'Fetches live Plaid data' },
  { icon: '🎯', quote: '"Add $200 to my vacation savings"',        action: 'Updates goal progress' },
  { icon: '👨‍👩‍👧', quote: '"Split the $120 dinner with my family"', action: 'Divides & records dues' },
  { icon: '📈', quote: '"Show me my investment portfolio"',         action: 'Full P&L breakdown' },
];

/* ─────────────────────────────────────────────
   Speed cards (Section 4)
───────────────────────────────────────────── */
const speedCards = [
  {
    icon: <Zap size={22} />,
    title: '< 50ms',
    sub: 'Zero Cold Starts',
    desc: 'Cloudflare Workers stay warm globally. No 30-second spin-ups like legacy servers.',
  },
  {
    icon: <Shield size={22} />,
    title: 'Native Driver',
    sub: 'Direct MongoDB',
    desc: 'Native TCP connection to Atlas via nodejs_compat_v2. No deprecated Data API.',
  },
  {
    icon: <Cpu size={22} />,
    title: 'Stateless',
    sub: 'MCP Protocol',
    desc: 'Tools are called directly by Claude via JSON-RPC 2.0. No SSE, no proxies.',
  },
];

/* ─────────────────────────────────────────────
   Shared sub-components
───────────────────────────────────────────── */
const Badge = ({ children }) => (
  <div style={{
    display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
    background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.28)',
    borderRadius: 20, padding: '0.3rem 0.9rem',
    color: C.gold, fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.04em',
    marginBottom: '1.2rem',
  }}>
    {children}
  </div>
);

const SectionHeading = ({ children }) => (
  <h2 style={{
    fontFamily: "'Outfit', sans-serif",
    fontSize: 'clamp(2rem, 4vw, 2.8rem)',
    fontWeight: 800, color: C.dark,
    margin: '0 0 0.75rem 0', lineHeight: 1.1,
  }}>
    {children}
  </h2>
);

const SubText = ({ children, center = true }) => (
  <p style={{
    color: C.muted, fontSize: '0.97rem', lineHeight: 1.7,
    maxWidth: 560, margin: center ? '0 auto 3rem' : '0 0 2rem',
    textAlign: center ? 'center' : 'left',
  }}>
    {children}
  </p>
);

/* ══════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════ */
const AITools = () => {
  const font = "'Inter', sans-serif";

  return (
    <div style={{ background: C.bg, fontFamily: font, minHeight: '100vh' }}>

      {/* ══ SECTION 1 — HERO ══════════════════════════ */}
      <section style={{
        background: C.dark,
        padding: '5rem 1.5rem 0',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Ambient glow */}
        <div style={{ position: 'absolute', top: -100, left: '50%', transform: 'translateX(-50%)', width: 600, height: 300, background: 'radial-gradient(ellipse, rgba(201,168,76,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 720, margin: '0 auto', position: 'relative' }}>
          <Badge>🤖 AI-NATIVE FINANCIAL ENGINE</Badge>

          <h1 style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: 'clamp(2.6rem, 6vw, 4rem)',
            fontWeight: 900, lineHeight: 1.08,
            margin: '0 0 1.2rem 0',
            color: C.cream,
          }}>
            Your AI <span style={{ color: C.gold, fontStyle: 'italic' }}>Financial Brain</span>
          </h1>

          <p style={{ color: '#9a9070', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '2.5rem' }}>
            18 powerful tools powered by the <strong style={{ color: C.cream }}>Model Context Protocol</strong>, running
            on the Cloudflare Edge with zero cold starts.
          </p>

          {/* Stats row */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '0.5rem', marginBottom: '3rem',
          }}>
            {[
              { val: '18',    label: 'AI Tools' },
              { val: '<50ms', label: 'Response Time' },
              { val: '6',     label: 'Feature Pillars' },
              { val: '∞',     label: 'Natural Language Queries' },
            ].map(s => (
              <div key={s.label} style={{ textAlign: 'center', padding: '1rem 0' }}>
                <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '2rem', fontWeight: 800, color: C.cream, lineHeight: 1 }}>{s.val}</div>
                <div style={{ color: '#6a6248', fontSize: '0.75rem', marginTop: '0.3rem', letterSpacing: '0.03em' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* MCP info bar */}
        <div style={{
          background: 'rgba(255,255,255,0.04)',
          borderTop: '1px solid rgba(201,168,76,0.12)',
          padding: '1.2rem 2rem',
          display: 'flex', alignItems: 'flex-start', gap: '1rem',
          maxWidth: 900, margin: '0 auto',
          textAlign: 'left',
        }}>
          <div style={{ width: 32, height: 32, borderRadius: 7, background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: C.gold, fontSize: '0.85rem', fontWeight: 700 }}>
            {'</>'}
          </div>
          <p style={{ color: '#9a9070', fontSize: '0.875rem', lineHeight: 1.7, margin: 0 }}>
            <strong style={{ color: C.cream }}>What is MCP?</strong> The Model Context Protocol lets AI assistants like Claude call your app's real functions — reading balances, logging expenses, and splitting bills — directly from a conversation.
          </p>
        </div>
      </section>

      {/* ══ SECTION 2 — NATURAL LANGUAGE EXAMPLES ════ */}
      <section style={{ padding: '5rem 1.5rem', textAlign: 'center', background: C.bg }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <Badge>💬 Natural Language Examples</Badge>
          <SectionHeading>
            Just Say It. <em style={{ fontStyle: 'italic', color: C.gold }}>Done.</em>
          </SectionHeading>
          <SubText>
            No forms, no clicks, no menus. Describe what you want in plain English and<br />the AI handles the rest.
          </SubText>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }} className="ai-3col">
            {examples.map((ex, i) => (
              <div key={i} style={{
                background: '#fff',
                border: '1.5px solid #e8e0cc',
                borderRadius: 14, padding: '1.3rem 1.4rem',
                textAlign: 'left', transition: 'box-shadow 0.2s, border-color 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = C.gold; e.currentTarget.style.boxShadow = `0 4px 20px rgba(201,168,76,0.12)`; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#e8e0cc'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <div style={{ fontSize: '1.6rem', marginBottom: '0.7rem' }}>{ex.icon}</div>
                <p style={{ color: C.dark, fontSize: '0.93rem', fontWeight: 600, marginBottom: '0.6rem', lineHeight: 1.4 }}>{ex.quote}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#16a34a', fontSize: '0.82rem', fontWeight: 600 }}>
                  <CheckCircle size={14} /> {ex.action}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ SECTION 3 — 18 TOOLS ACROSS 6 PILLARS ═══ */}
      <section style={{ padding: '5rem 1.5rem', background: '#fff', textAlign: 'center' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <Badge>⚡ Complete Tool Reference</Badge>
          <SectionHeading>18 Tools Across <span style={{ color: C.gold }}>6 Pillars</span></SectionHeading>
          <SubText>
            Every tool connects to your live MongoDB data via the Cloudflare Edge Worker<br />— no middleware, no delays.
          </SubText>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem', textAlign: 'left' }} className="ai-3col">
            {pillars.map((p, i) => (
              <div key={i} style={{ background: '#fafaf8', border: '1.5px solid #e8e0cc', borderRadius: 16, padding: '1.5rem', overflow: 'hidden' }}>
                {/* Pillar header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.1rem' }}>
                  <div style={{ width: 34, height: 34, borderRadius: 9, background: p.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>
                    {p.emoji}
                  </div>
                  <span style={{ color: C.dark, fontWeight: 700, fontSize: '0.93rem' }}>{p.label}</span>
                </div>

                {/* Tools */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {p.tools.map((t, j) => (
                    <div key={j} style={{ background: '#fff', border: '1px solid #ece4d0', borderRadius: 9, padding: '0.7rem 0.9rem' }}>
                      <div style={{ color: p.color, fontSize: '0.77rem', fontWeight: 700, fontFamily: 'monospace', marginBottom: '0.2rem' }}>{t.name}</div>
                      <div style={{ color: '#6a6248', fontSize: '0.8rem', lineHeight: 1.5 }}>{t.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ SECTION 4 — BUILT FOR SPEED & SCALE ══════ */}
      <section style={{ padding: '5rem 1.5rem', background: C.bg, textAlign: 'center' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{
            background: C.dark,
            borderRadius: 24, padding: '3.5rem 2.5rem',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', top: -80, right: -80, width: 280, height: 280, background: 'radial-gradient(circle, rgba(201,168,76,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: -60, left: -60, width: 220, height: 220, background: 'radial-gradient(circle, rgba(201,168,76,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />

            <Badge>☁️ Cloudflare Edge Architecture</Badge>

            <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 800, color: C.cream, margin: '0 0 0.6rem 0', lineHeight: 1.1 }}>
              Built for Speed &amp; Scale
            </h2>
            <p style={{ color: '#9a9070', fontSize: '0.95rem', lineHeight: 1.7, maxWidth: 480, margin: '0 auto 2.5rem' }}>
              The AI engine runs at the network edge, <em style={{ color: C.gold }}>milliseconds</em> from every user globally.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', textAlign: 'left' }} className="ai-3col">
              {speedCards.map((sc, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(201,168,76,0.15)', borderRadius: 14, padding: '1.5rem' }}>
                  <div style={{ color: C.gold, marginBottom: '0.8rem' }}>{sc.icon}</div>
                  <div style={{ color: C.cream, fontWeight: 800, fontSize: '1.05rem', fontFamily: "'Outfit', sans-serif" }}>{sc.title}</div>
                  <div style={{ color: C.gold, fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.6rem', letterSpacing: '0.04em' }}>{sc.sub}</div>
                  <p style={{ color: '#7a7258', fontSize: '0.82rem', lineHeight: 1.65, margin: 0 }}>{sc.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ SECTION 5 — CONNECT IN 60 SECONDS ═══════ */}
      <section style={{ padding: '5rem 1.5rem', background: '#fff', textAlign: 'center' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <Badge>⚙️ Quick Setup</Badge>
          <SectionHeading>Connect in <span style={{ color: C.gold }}>60 Seconds</span></SectionHeading>
          <SubText>Add Money-Mentor to any MCP-compatible AI client with one config snippet.</SubText>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', textAlign: 'left' }} className="ai-2col">

            {/* Claude Desktop */}
            <div style={{ background: '#fafaf8', border: '1.5px solid #e8e0cc', borderRadius: 16, padding: '1.8rem', overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', marginBottom: '0.3rem' }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: '#6b4fbb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '1rem' }}>🤖</div>
                <div>
                  <div style={{ color: C.dark, fontWeight: 700, fontSize: '0.97rem' }}>Claude Desktop</div>
                  <div style={{ color: '#16a34a', fontSize: '0.75rem', fontWeight: 600 }}>Recommended — full tool support</div>
                </div>
              </div>
              <p style={{ color: C.muted, fontSize: '0.855rem', margin: '1rem 0 0.75rem' }}>
                Open <code style={{ background: '#f0ece2', padding: '0.1rem 0.4rem', borderRadius: 4, fontSize: '0.8rem', color: C.dark }}>%APPDATA%/Claude/claude_desktop_config.json</code> and paste:
              </p>
              <pre style={{
                background: '#1a1810', color: '#c9a84c', borderRadius: 10, padding: '1.1rem',
                fontSize: '0.78rem', lineHeight: 1.65, overflow: 'auto', margin: '0 0 1rem',
                fontFamily: 'monospace',
              }}>{`{
  "mcpServers": {
    "money-mentor": {
      "command": "npx",
      "args": [
        "-y",
        "mcp-remote@latest",
        "https://money-mentor-mcp.rrpb2500.workers.dev/mcp"
      ]
    }
  }
}`}</pre>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#16a34a', fontSize: '0.8rem', fontWeight: 600 }}>
                <CheckCircle size={14} /> Restart Claude Desktop after saving. All 18 tools will appear automatically.
              </div>
            </div>

            {/* WhatsApp / Telegram */}
            <div style={{ background: '#fafaf8', border: '1.5px solid #e8e0cc', borderRadius: 16, padding: '1.8rem', overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', marginBottom: '0.3rem' }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '1rem' }}>💬</div>
                <div>
                  <div style={{ color: C.dark, fontWeight: 700, fontSize: '0.97rem' }}>WhatsApp / Telegram</div>
                  <div style={{ color: C.muted, fontSize: '0.75rem', fontWeight: 500 }}>Via OpenClaw bridge [community]</div>
                </div>
              </div>
              <p style={{ color: C.muted, fontSize: '0.855rem', margin: '1rem 0 0.75rem' }}>
                Use OpenClaw or similar MCP bridges to connect your WhatsApp/Telegram bot to the same Worker endpoint:
              </p>
              <pre style={{
                background: '#1a1810', color: '#c9a84c', borderRadius: 10, padding: '1.1rem',
                fontSize: '0.78rem', lineHeight: 1.65, overflow: 'auto', margin: '0 0 1rem',
                fontFamily: 'monospace',
              }}>{`# OpenClaw config (config.yaml)
mcp_servers:
  - name: money-mentor
    url: https://money-mentor-mcp
        .rrpb2500.workers.dev/mcp
    transport: http`}</pre>
              <div style={{ background: '#fef9ec', border: '1px solid #f0d080', borderRadius: 9, padding: '0.7rem 0.9rem', fontSize: '0.8rem', color: '#78610a', lineHeight: 1.6 }}>
                ⚠️ <strong>Note:</strong> OpenClaw is a community project. The MCP worker URL is standard HTTP — it works with any MCP-compatible bridge.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ SECTION 6 — CTA ══════════════════════════ */}
      <section style={{ padding: '5rem 1.5rem', background: C.bg, textAlign: 'center' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <Badge>🚀 Start Using AI-Powered Finance</Badge>
          <SectionHeading>Ready to try it?</SectionHeading>
          <p style={{ color: C.muted, fontSize: '0.97rem', lineHeight: 1.7, marginBottom: '2rem' }}>
            Connect your Claude Desktop to Money-Mentor and manage your entire financial life through natural conversation.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              to="/register"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.45rem',
                background: C.dark, color: C.cream,
                fontWeight: 700, fontSize: '0.93rem',
                padding: '0.82rem 1.8rem', borderRadius: 11,
                textDecoration: 'none', transition: 'background 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#3e3c28'}
              onMouseLeave={e => e.currentTarget.style.background = C.dark}
            >
              Explore All Features <ArrowRight size={16} />
            </Link>
            <Link
              to="/profile"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.45rem',
                background: 'transparent', color: C.dark,
                fontWeight: 600, fontSize: '0.93rem',
                padding: '0.82rem 1.8rem', borderRadius: 11,
                textDecoration: 'none', border: `1.5px solid ${C.dim}`,
                transition: 'border-color 0.2s, color 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = C.gold; e.currentTarget.style.color = C.gold; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.dim; e.currentTarget.style.color = C.dark; }}
            >
              🖥 My Dashboard
            </Link>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          .ai-3col { grid-template-columns: 1fr !important; }
          .ai-2col { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 1024px) and (min-width: 769px) {
          .ai-3col { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </div>
  );
};

export default AITools;
