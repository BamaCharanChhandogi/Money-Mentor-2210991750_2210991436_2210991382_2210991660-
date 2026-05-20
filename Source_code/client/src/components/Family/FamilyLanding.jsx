import React from 'react';
import { Link } from 'react-router-dom';
import { Users, CreditCard, UserPlus, Home, ArrowRight, Shield, TrendingUp } from 'lucide-react';

const FamilyLanding = () => {
  const features = [
    {
      icon: UserPlus,
      title: "Create Family",
      description: "Start a new family group and invite members to collaborate",
      link: "/family/create",
      gradient: "from-blue-500 to-blue-700"
    },
    {
      icon: Users,
      title: "Manage Family",
      description: "View and manage your family members and their permissions",
      link: "/family/manage",
      gradient: "from-purple-500 to-purple-700"
    },
    {
      icon: CreditCard,
      title: "Shared Expenses",
      description: "Track and split family expenses effortlessly",
      link: "/family/manage",
      gradient: "from-emerald-500 to-emerald-700"
    }
  ];

  const benefits = [
    { icon: Shield, title: "Secure & Private", desc: "Your family data is encrypted and secure" },
    { icon: TrendingUp, title: "Real-time Sync", desc: "All members see updates instantly" },
    { icon: Users, title: "Easy Collaboration", desc: "Work together on financial goals" }
  ];

  return (
    <div className="min-h-screen py-12" style={{ backgroundColor: '#F4F0D8' }}>
      <style>{`
        body { background-color: #F4F0D8; }
        .serif-title { font-family: Georgia, 'Times New Roman', serif; }
      `}</style>
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl mb-6" style={{ backgroundColor: '#F8F3CE' }}>
            <Home className="h-8 w-8" style={{ color: '#2A2925' }} />
          </div>
          <h1 className="serif-title text-5xl md:text-6xl font-bold mb-6" style={{ color: '#2A2925' }}>
            Family Finance Management
          </h1>
          <p className="text-xl max-w-3xl mx-auto leading-relaxed" style={{ color: '#57564F' }}>
            Manage your family's finances together, efficiently and transparently. Collaborate on budgets, track shared expenses, and achieve financial goals as a team.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const cardColors = [
              { bg: '#A0654D', icon: '#FFFFFF' },
              { bg: '#7B9BA1', icon: '#FFFFFF' },
              { bg: '#8B7355', icon: '#FFFFFF' }
            ];
            const colors = cardColors[index];
            return (
              <Link
                key={index}
                to={feature.link}
                className="p-8 rounded-2xl hover:shadow-lg transition-all duration-300"
                style={{ backgroundColor: colors.bg, color: '#FFFFFF' }}
              >
                <div className="p-3 rounded-xl mb-6" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
                  <Icon className="h-8 w-8" style={{ color: '#FFFFFF' }} />
                </div>
                <h2 className="text-2xl font-bold mb-3">
                  {feature.title}
                </h2>
                <p className="mb-6 leading-relaxed opacity-95">
                  {feature.description}
                </p>
                <div className="flex items-center font-semibold opacity-90">
                  <span>Get Started</span>
                  <ArrowRight className="h-4 w-4 ml-2" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Benefits Section */}
        <div className="p-8 rounded-2xl" style={{ backgroundColor: '#FFFFFF' }}>
          <h3 className="serif-title text-2xl font-bold mb-8 text-center" style={{ color: '#2A2925' }}>Why Choose Family Finance?</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {benefits.map((benefit, idx) => {
              const Icon = benefit.icon;
              return (
                <div key={idx} className="flex items-start space-x-4">
                  <div className="flex-shrink-0 p-3 rounded-xl" style={{ backgroundColor: '#F8F3CE' }}>
                    <Icon className="h-6 w-6" style={{ color: '#2A2925' }} />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1" style={{ color: '#2A2925' }}>{benefit.title}</h4>
                    <p className="text-sm" style={{ color: '#7A7A73' }}>{benefit.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FamilyLanding;