import { Link } from 'react-router-dom';
import {
  Wallet,
  PieChart,
  Building2,
  TrendingUp,
  Brain,
  Shield,
  Users,
  ArrowRight,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

function Services() {
  const services = [
    {
      icon: Wallet,
      gradient: "from-blue-500 to-blue-700",
      title: "Expense Tracking",
      description: "Track your expenses seamlessly with intelligent categorization. Get real-time insights into your spending habits and identify areas for improvement.",
      link: "/services/expenses",
      linkText: "Manage Expenses",
      features: ["Auto-categorization", "Real-time sync", "Smart insights"]
    },
    {
      icon: PieChart,
      gradient: "from-emerald-500 to-emerald-700",
      title: "Smart Budgeting",
      description: "Create and manage budgets that adapt to your lifestyle. Set goals, monitor progress, and receive alerts when you're approaching limits.",
      link: "/services/budgets",
      linkText: "Create Budget",
      features: ["Goal setting", "Progress tracking", "Smart alerts"]
    },
    {
      icon: Building2,
      gradient: "from-purple-500 to-purple-700",
      title: "Bank Integration",
      description: "Securely connect your bank accounts for automatic transaction import. Powered by Plaid for bank-level security and reliability.",
      link: "/services/bank-accounts",
      linkText: "Connect Account",
      features: ["Secure connection", "Auto-import", "Multi-bank support"]
    },
    {
      icon: TrendingUp,
      gradient: "from-rose-500 to-rose-700",
      title: "Investment Tracking",
      description: "Monitor your investment portfolio across stocks, bonds, crypto, and more. Get detailed performance analytics and insights.",
      link: "/services/investments",
      linkText: "Track Investments",
      features: ["Portfolio analytics", "Performance metrics", "Asset allocation"]
    },
    {
      icon: Brain,
      gradient: "from-amber-500 to-amber-700",
      title: "AI Financial Advisor",
      description: "Get personalized financial advice powered by advanced AI. Receive tailored recommendations for savings, investments, and debt management.",
      link: "/ai-dashboard",
      linkText: "Get AI Advice",
      features: ["Personalized tips", "Smart predictions", "Goal optimization"]
    },
    {
      icon: Users,
      gradient: "from-indigo-500 to-indigo-700",
      title: "Family Finance",
      description: "Manage shared expenses and budgets with family members. Track contributions, split bills, and maintain financial transparency.",
      link: "/family",
      linkText: "Manage Family",
      features: ["Shared budgets", "Expense splitting", "Family insights"]
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 overflow-hidden">
      
      {/* Premium Hero Section */}
      <div className="relative pt-32 pb-24 lg:pt-40 lg:pb-32 overflow-hidden bg-slate-900 border-b border-slate-800/50">
        {/* Animated Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary-600/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-accent-600/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1.5s' }} />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-10">
            <div className="w-full h-full" style={{ backgroundImage: 'radial-gradient(circle at center, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
          </div>
        </div>

        <div className="container mx-auto px-4 lg:px-8 relative z-10 text-center fade-in-up">
          <div className="inline-flex items-center justify-center p-3 bg-white/5 border border-white/10 rounded-2xl mb-8 backdrop-blur-md shadow-2xl">
            <Sparkles className="h-6 w-6 text-primary-400 mr-3" />
            <span className="text-primary-300 font-semibold tracking-wide uppercase text-sm">Premium Features</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 text-white tracking-tight">
            Elevate Your <span className="gradient-text-ocean inline-block">Financial Hub</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Empowering your journey with cutting-edge technology, AI insights, and personalized wealth management solutions.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 -mt-16 relative z-20 pb-24">
        {/* Services Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-24">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <Link
                key={index}
                to={service.link}
                className="group relative bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-3xl p-8 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] transition-all duration-500 hover:-translate-y-2 fade-in-up overflow-hidden"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Hover Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-slate-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Content Container */}
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-8">
                    <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${service.gradient} shadow-lg shadow-${service.gradient.split('-')[1]}-500/30 group-hover:scale-110 transition-transform duration-500`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors group-hover:rotate-45">
                      <ArrowRight className="h-5 w-5" />
                    </div>
                  </div>

                  <h2 className="text-2xl font-display font-bold text-slate-900 mb-4 group-hover:text-primary-600 transition-colors">
                    {service.title}
                  </h2>

                  <p className="text-slate-600 mb-8 leading-relaxed line-clamp-3">
                    {service.description}
                  </p>

                  <div className="space-y-3">
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center text-sm font-medium text-slate-700 bg-slate-50 px-3 py-2 rounded-lg border border-slate-100 group-hover:border-primary-100 group-hover:bg-primary-50/50 transition-colors">
                        <CheckCircle2 className="h-4 w-4 text-primary-500 mr-2 flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Dynamic CTA Section */}
        <div className="fade-in-up" style={{ animationDelay: '0.6s' }}>
          <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 p-12 lg:p-16 shadow-2xl group">
            {/* Dynamic Background */}
            <div className="absolute inset-0 opacity-80 transition-opacity duration-700 group-hover:opacity-100">
              <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-primary-600 to-primary-900 rounded-full blur-[80px] mix-blend-screen" />
              <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-accent-600 to-accent-900 rounded-full blur-[80px] mix-blend-screen" />
            </div>

            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
              <div className="lg:w-1/2 text-center lg:text-left space-y-6">
                <div className="inline-flex items-center justify-center p-4 bg-white/10 rounded-2xl backdrop-blur-md border border-white/20 shadow-xl group-hover:scale-105 transition-transform duration-500">
                  <Users className="h-8 w-8 text-primary-300" />
                </div>
                <h3 className="text-4xl md:text-5xl font-display font-bold text-white leading-tight">
                  Manage Family Finances Together
                </h3>
                <p className="text-lg text-slate-300 max-w-xl mx-auto lg:mx-0">
                  Collaborate securely with your family. Share budgets, track joint expenses, and build a unified financial legacy seamlessly.
                </p>
              </div>

              <div className="lg:w-auto flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <Link
                  to="/family"
                  className="inline-flex items-center justify-center space-x-2 px-8 py-4 bg-white text-slate-900 rounded-xl font-bold hover:bg-primary-50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1 w-full sm:w-auto"
                >
                  <span>Get Started Now</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link
                  to="/about"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white/10 backdrop-blur-md text-white rounded-xl font-bold hover:bg-white/20 transition-all duration-300 border border-white/30 w-full sm:w-auto"
                >
                  <span>Learn More</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-24 grid grid-cols-2 lg:grid-cols-4 gap-6 fade-in-up" style={{ animationDelay: '0.8s' }}>
          {[
            { icon: Shield, label: "Bank-Level Security", value: "256-bit SSL" },
            { icon: Users, label: "Active Investors", value: "10,000+" },
            { icon: TrendingUp, label: "Avg. ROI Tracked", value: "14.2%" },
            { icon: Brain, label: "AI Insights Generated", value: "1M+" }
          ].map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex items-center space-x-5">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary-50 flex items-center justify-center">
                  <Icon className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <div className="text-2xl font-display font-bold text-slate-900">{stat.value}</div>
                  <div className="text-sm font-medium text-slate-500">{stat.label}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Services;