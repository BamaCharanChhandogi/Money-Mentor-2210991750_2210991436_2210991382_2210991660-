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
    <div className="min-h-screen bg-mesh py-12">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 fade-in-up">
          <div className="inline-flex items-center justify-center p-3 bg-primary-100 rounded-2xl mb-6">
            <Home className="h-8 w-8 text-primary-600" />
          </div>
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
            <span className="gradient-text-ocean">Family Finance Management</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Manage your family's finances together, efficiently and transparently. Collaborate on budgets, track shared expenses, and achieve financial goals as a team.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Link
                key={index}
                to={feature.link}
                className="group glass-card p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${feature.gradient} mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <Icon className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-primary-600 transition-colors">
                  {feature.title}
                </h2>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  {feature.description}
                </p>
                <div className="flex items-center text-primary-600 font-semibold group-hover:text-primary-700">
                  <span>Get Started</span>
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Benefits Section */}
        <div className="glass-card p-8 fade-in-up" style={{ animationDelay: '0.4s' }}>
          <h3 className="text-2xl font-bold text-slate-900 mb-8 text-center">Why Choose Family Finance?</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {benefits.map((benefit, idx) => {
              const Icon = benefit.icon;
              return (
                <div key={idx} className="flex items-start space-x-4">
                  <div className="flex-shrink-0 p-3 bg-primary-100 rounded-xl">
                    <Icon className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">{benefit.title}</h4>
                    <p className="text-sm text-slate-600">{benefit.desc}</p>
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