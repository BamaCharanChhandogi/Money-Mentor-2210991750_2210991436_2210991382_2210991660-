import { Link } from 'react-router-dom';
import {
  Zap, Brain, Wallet, PieChart, TrendingUp, Users, Target,
  Building2, ArrowRight, Sparkles, CheckCircle2, Bot, Shield,
  MessageSquare, ChevronRight, Code2, Globe
} from 'lucide-react';

const tools = [
  {
    category: '📂 Expense Management',
    gradient: 'from-blue-500 to-blue-700',
    bgLight: 'bg-blue-50',
    borderLight: 'border-blue-100',
    textColor: 'text-blue-700',
    icon: Wallet,
    items: [
      { name: 'add_expense', desc: 'Swiftly log cash or card spending by just saying it.' },
      { name: 'update_expense', desc: 'Correct past entries using plain English.' },
      { name: 'delete_expense', desc: 'Remove transactions with a confirmation loop.' },
    ]
  },
  {
    category: '💰 Smart Budgeting',
    gradient: 'from-emerald-500 to-emerald-700',
    bgLight: 'bg-emerald-50',
    borderLight: 'border-emerald-100',
    textColor: 'text-emerald-700',
    icon: PieChart,
    items: [
      { name: 'create_budget', desc: 'Set monthly limits for Groceries, Fuel, or Fun.' },
      { name: 'update_budget', desc: 'Adjust budget limits on the fly.' },
      { name: 'get_budget_status', desc: 'AI calculates exactly how much room you have left.' },
    ]
  },
  {
    category: '🏦 Bank Intelligence',
    gradient: 'from-purple-500 to-purple-700',
    bgLight: 'bg-purple-50',
    borderLight: 'border-purple-100',
    textColor: 'text-purple-700',
    icon: Building2,
    items: [
      { name: 'get_bank_balances', desc: 'Instantly fetch live Plaid linked bank totals.' },
      { name: 'get_recent_bank_transactions', desc: 'Sync digital spending history into your analysis.' },
    ]
  },
  {
    category: '👨‍👩‍👧 Family Finance',
    gradient: 'from-indigo-500 to-indigo-700',
    bgLight: 'bg-indigo-50',
    borderLight: 'border-indigo-100',
    textColor: 'text-indigo-700',
    icon: Users,
    items: [
      { name: 'split_family_expense', desc: 'Automatically divide a bill among group members.' },
      { name: 'get_family_dues', desc: 'AI remembers who still hasn\'t paid you back.' },
      { name: 'settle_shared_expense', desc: 'Update balances when someone pays their share.' },
    ]
  },
  {
    category: '📈 Investment Tracker',
    gradient: 'from-rose-500 to-rose-700',
    bgLight: 'bg-rose-50',
    borderLight: 'border-rose-100',
    textColor: 'text-rose-700',
    icon: TrendingUp,
    items: [
      { name: 'add_investment', desc: 'Track stocks, crypto, or mutual funds.' },
      { name: 'update_investment', desc: 'Update share counts after buying or selling.' },
      { name: 'delete_investment', desc: 'Prune your portfolio with confirmation.' },
      { name: 'get_portfolio', desc: 'AI summarizes your total net worth & performance.' },
    ]
  },
  {
    category: '🎯 Financial Goals',
    gradient: 'from-amber-500 to-amber-700',
    bgLight: 'bg-amber-50',
    borderLight: 'border-amber-100',
    textColor: 'text-amber-700',
    icon: Target,
    items: [
      { name: 'create_goal', desc: 'Start a new saving target (e.g., Car Downpayment).' },
      { name: 'add_goal_contribution', desc: 'Log money saved toward a specific dream.' },
      { name: 'simulate_goal_impact', desc: 'Crystal Ball: simulate how spending affects your deadline.' },
    ]
  }
];

const examples = [
  { emoji: '💸', text: '"I spent $45 on groceries today"', action: 'Logs expense instantly' },
  { emoji: '📊', text: '"How much is left in my food budget?"', action: 'Shows remaining budget' },
  { emoji: '🏦', text: '"What\'s my bank balance right now?"', action: 'Fetches live Plaid data' },
  { emoji: '🎯', text: '"Add $200 to my vacation savings"', action: 'Updates goal progress' },
  { emoji: '👨‍👩‍👧', text: '"Split the $120 dinner with my family"', action: 'Divides & records dues' },
  { emoji: '📈', text: '"Show me my investment portfolio"', action: 'Full P&L breakdown' },
];

function AiTools() {
  return (
    <div className="min-h-screen bg-slate-50 overflow-hidden">

      {/* Hero */}
      <div className="relative pt-32 pb-24 lg:pt-40 lg:pb-32 overflow-hidden bg-slate-900 border-b border-slate-800/50">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-violet-600/20 rounded-full blur-[140px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-primary-600/20 rounded-full blur-[140px] animate-pulse" style={{ animationDelay: '1.5s' }} />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-10">
            <div className="w-full h-full" style={{ backgroundImage: 'radial-gradient(circle at center, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
          </div>
        </div>

        <div className="container mx-auto px-4 lg:px-8 relative z-10 text-center fade-in-up">
          <div className="inline-flex items-center justify-center p-3 bg-white/5 border border-white/10 rounded-2xl mb-8 backdrop-blur-md shadow-2xl">
            <Bot className="h-6 w-6 text-violet-400 mr-3" />
            <span className="text-violet-300 font-semibold tracking-wide uppercase text-sm">AI-Native Financial Engine</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 text-white tracking-tight">
            Your AI <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-primary-400">Financial Brain</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto leading-relaxed mb-10">
            18 powerful tools powered by the <strong className="text-white">Model Context Protocol</strong>, running on the Cloudflare Edge with zero cold starts.
          </p>

          {/* Stats Row */}
          <div className="flex flex-wrap justify-center gap-8 mt-10">
            {[
              { value: '18', label: 'AI Tools' },
              { value: '<50ms', label: 'Response Time' },
              { value: '6', label: 'Feature Pillars' },
              { value: '∞', label: 'Natural Language Queries' },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl font-display font-bold text-white">{s.value}</div>
                <div className="text-sm text-slate-400 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* What is MCP Banner */}
      <div className="bg-gradient-to-r from-violet-600 to-primary-600 py-6">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-center gap-4 text-center md:text-left">
          <Code2 className="h-8 w-8 text-white flex-shrink-0" />
          <p className="text-white font-medium text-lg">
            <strong>What is MCP?</strong> The Model Context Protocol lets AI assistants like Claude call your app's real functions — reading balances, logging expenses, and splitting bills — directly from a conversation.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-24">

        {/* Live Examples */}
        <div className="text-center mb-16 fade-in-up">
          <div className="inline-flex items-center gap-2 bg-violet-50 border border-violet-200 text-violet-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <MessageSquare className="h-4 w-4" />
            Natural Language Examples
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-4">
            Just Say It. <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-primary-600">Done.</span>
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            No forms, no clicks, no menus. Describe what you want in plain English and the AI handles the rest.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-24">
          {examples.map((ex, i) => (
            <div
              key={i}
              className="group bg-white border border-slate-100 rounded-2xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 fade-in-up"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div className="text-3xl mb-3">{ex.emoji}</div>
              <p className="text-slate-800 font-semibold italic mb-2">"{ex.text.replace(/^"|"$/g, '')}"</p>
              <div className="flex items-center gap-2 text-sm text-emerald-600 font-medium">
                <CheckCircle2 className="h-4 w-4" />
                {ex.action}
              </div>
            </div>
          ))}
        </div>

        {/* Tool Categories Grid */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary-50 border border-primary-200 text-primary-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <Zap className="h-4 w-4" />
            Complete Tool Reference
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-4">
            18 Tools Across <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-violet-600">6 Pillars</span>
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Every tool connects to your live MongoDB data via the Cloudflare Edge Worker — no middleware, no delays.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          {tools.map((category, i) => {
            const Icon = category.icon;
            return (
              <div
                key={i}
                className="group bg-white border border-slate-100 rounded-3xl p-8 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] transition-all duration-500 hover:-translate-y-2 fade-in-up overflow-hidden relative"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-slate-50/0 to-slate-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`inline-flex p-3 rounded-2xl bg-gradient-to-br ${category.gradient} shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-lg font-display font-bold text-slate-900">{category.category}</h3>
                  </div>

                  <div className="space-y-3">
                    {category.items.map((tool, j) => (
                      <div key={j} className={`${category.bgLight} ${category.borderLight} border rounded-xl p-4`}>
                        <div className={`font-mono text-xs font-bold ${category.textColor} mb-1`}>{tool.name}</div>
                        <div className="text-slate-600 text-sm">{tool.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Technical Architecture Banner */}
        <div className="fade-in-up mb-24">
          <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 p-12 lg:p-16 shadow-2xl group">
            <div className="absolute inset-0 opacity-80 transition-opacity duration-700 group-hover:opacity-100">
              <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-violet-600 to-violet-900 rounded-full blur-[80px] mix-blend-screen" />
              <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-primary-600 to-primary-900 rounded-full blur-[80px] mix-blend-screen" />
            </div>

            <div className="relative z-10">
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4 backdrop-blur-md">
                  <Globe className="h-4 w-4" />
                  Cloudflare Edge Architecture
                </div>
                <h3 className="text-4xl font-display font-bold text-white mb-4">
                  Built for Speed & Scale
                </h3>
                <p className="text-slate-300 text-lg max-w-2xl mx-auto">
                  The AI engine runs at the network edge, milliseconds from every user globally.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    icon: Zap,
                    title: 'Zero Cold Starts',
                    desc: 'Cloudflare Workers stay warm globally. No 30-second spin-ups like legacy servers.',
                    stat: '< 50ms'
                  },
                  {
                    icon: Shield,
                    title: 'Direct MongoDB',
                    desc: 'Native TCP connection to Atlas via nodejs_compat_v2. No deprecated Data API.',
                    stat: 'Native Driver'
                  },
                  {
                    icon: Brain,
                    title: 'MCP Protocol',
                    desc: 'Tools are called directly by Claude via JSON-RPC 2.0. No SSE, no proxies.',
                    stat: 'Stateless'
                  }
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div key={i} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-center hover:bg-white/15 transition-colors">
                      <div className="inline-flex p-3 rounded-xl bg-white/10 mb-4">
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="text-2xl font-display font-bold text-white mb-1">{item.stat}</div>
                      <div className="text-white font-semibold mb-2">{item.title}</div>
                      <div className="text-slate-400 text-sm">{item.desc}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Setup: Claude Desktop */}
        <div className="fade-in-up mb-16">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-slate-100 border border-slate-200 text-slate-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <Code2 className="h-4 w-4" />
              Quick Setup
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-4">
              Connect in <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-primary-600">60 Seconds</span>
            </h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              Add Money-Mentor to any MCP-compatible AI client with one config snippet.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Claude Desktop */}
            <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-6">
                <div className="inline-flex p-3 rounded-2xl bg-gradient-to-br from-violet-500 to-violet-700 shadow-lg">
                  <Bot className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-display font-bold text-slate-900">Claude Desktop</h3>
                  <p className="text-sm text-slate-500">Recommended — full tool support</p>
                </div>
              </div>
              <p className="text-slate-600 text-sm mb-4">
                Open <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs font-mono">%APPDATA%/Claude/claude_desktop_config.json</code> and paste:
              </p>
              <div className="bg-slate-900 rounded-2xl p-5 font-mono text-sm text-emerald-400 leading-relaxed overflow-x-auto">
                <pre>{`{
  "mcpServers": {
    "money-mentor": {
      "command": "npx",
      "args": [
        "-y",
        "mcp-remote@latest",
        "https://money-mentor-mcp.rrpb2580.workers.dev/mcp"
      ]
    }
  }
}`}</pre>
              </div>
              <div className="mt-4 flex items-start gap-2 text-sm text-slate-500 bg-slate-50 rounded-xl p-3">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                <span>Restart Claude Desktop after saving. All 18 tools will appear automatically.</span>
              </div>
            </div>

            {/* WhatsApp / Telegram via OpenClaw */}
            <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-6">
                <div className="inline-flex p-3 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-lg">
                  <MessageSquare className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-display font-bold text-slate-900">WhatsApp / Telegram</h3>
                  <p className="text-sm text-slate-500">Via OpenClaw bridge (community)</p>
                </div>
              </div>
              <p className="text-slate-600 text-sm mb-4">
                Use <strong>OpenClaw</strong> or similar MCP bridges to connect your WhatsApp/Telegram bot to the same Worker endpoint:
              </p>
              <div className="bg-slate-900 rounded-2xl p-5 font-mono text-sm text-sky-400 leading-relaxed overflow-x-auto">
                <pre>{`# OpenClaw config (config.yaml)
mcp_servers:
  - name: money-mentor
    url: https://money-mentor-mcp
        .rrpb2580.workers.dev/mcp
    transport: http`}</pre>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex items-start gap-2 text-sm text-slate-500 bg-amber-50 border border-amber-100 rounded-xl p-3">
                  <Sparkles className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Note:</strong> OpenClaw is a community project. The MCP worker URL is standard HTTP — it works with any MCP-compatible bridge.</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center fade-in-up">
          <div className="inline-flex items-center gap-2 bg-violet-50 border border-violet-200 text-violet-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <Sparkles className="h-4 w-4" />
            Start Using AI-Powered Finance
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-6">
            Ready to try it?
          </h2>
          <p className="text-lg text-slate-500 max-w-xl mx-auto mb-10">
            Connect your Claude Desktop to Money-Mentor and manage your entire financial life through natural conversation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/services"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-violet-600 to-primary-600 text-white rounded-xl font-bold hover:from-violet-700 hover:to-primary-700 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1"
            >
              <span>Explore All Features</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              to="/profile"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white border-2 border-slate-200 text-slate-800 rounded-xl font-bold hover:border-violet-300 hover:text-violet-700 transition-all duration-300"
            >
              <Brain className="h-5 w-5" />
              <span>My Dashboard</span>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

export default AiTools;
