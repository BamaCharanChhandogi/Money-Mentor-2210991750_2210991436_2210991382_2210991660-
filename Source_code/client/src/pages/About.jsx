import { Target, Lightbulb, Shield, Users, Heart, Zap, Award, Globe, Rocket, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

function About() {
  const values = [
    {
      icon: Shield,
      title: "Integrity First",
      description: "We believe in doing the right thing, always. Security and trust are the foundations of Money Mentor.",
      gradient: "from-blue-500 to-indigo-600"
    },
    {
      icon: Lightbulb,
      title: "Constant Innovation",
      description: "We are always exploring new ways to simplify finance using the latest in AI and tech.",
      gradient: "from-purple-500 to-pink-600"
    },
    {
      icon: Globe,
      title: "Radical Transparency",
      description: "Honest, clear, and open communication is our guiding light in every user interaction.",
      gradient: "from-emerald-500 to-teal-600"
    },
    {
      icon: Heart,
      title: "User Obsession",
      description: "Our users are the heartbeat of our platform. We build for you, with you.",
      gradient: "from-rose-500 to-orange-600"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Hero Section */}
      <div className="relative overflow-hidden pt-24 pb-16 bg-mesh">
        <div className="container mx-auto px-4 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white/60 backdrop-blur-md rounded-full border border-white/40 shadow-sm mb-8 animate-fade-in">
            <Rocket className="h-4 w-4 text-primary-600" />
            <span className="text-sm font-bold text-primary-900">Our Journey to Financial Freedom</span>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-display font-bold mb-8 tracking-tight">
            Empowering Your <br />
            <span className="gradient-text-ocean">Financial Future</span>
          </h1>
          
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed mb-10 fade-in-up">
            At Money Mentor, we're on a mission to make personal finance simple, smart, and accessible for everyone.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 fade-in-up" style={{ animationDelay: '0.2s' }}>
            <Link to="/services" className="btn-primary px-8 py-4 text-lg">
              Explore Services
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <div className="flex -space-x-3 overflow-hidden p-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="inline-block h-10 w-10 rounded-full ring-4 ring-white bg-slate-200 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-400">
                  U{i}
                </div>
              ))}
              <div className="flex items-center justify-center h-10 px-4 rounded-full bg-primary-50 text-primary-700 text-xs font-bold ring-4 ring-white">
                10K+ Happy Users
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 -mt-8 relative z-20">
        {/* Mission Card */}
        <div className="glass-card overflow-hidden border-none shadow-2xl fade-in-up">
          <div className="grid lg:grid-cols-2 gap-0">
            <div className="p-12 lg:p-16 flex flex-col justify-center">
              <div className="inline-flex p-4 rounded-2xl bg-primary-100 text-primary-600 mb-8 w-fit shadow-inner">
                <Target className="h-10 w-10" />
              </div>
              <h2 className="text-4xl font-display font-bold text-slate-900 mb-6">Our Mission & Purpose</h2>
              <p className="text-lg text-slate-600 leading-relaxed mb-8">
                We believe that everyone deserves the peace of mind that comes with financial security. 
                Our platform combines cutting-edge AI technology with a human-centric design to transform how you track, 
                save, and invest your hard-earned money.
              </p>
              <div className="space-y-4">
                {["Democratize financial wellness", "Inclusive design for all levels", "Security at every step"].map((item, i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    <span className="font-semibold text-slate-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative min-h-[400px] bg-gradient-to-br from-primary-600 to-indigo-700 p-16 flex items-center justify-center overflow-hidden">
               {/* Decorative circles */}
               <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
               <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-400/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>
               
               <div className="relative text-center">
                 <div className="text-8xl font-display font-black text-white/20 mb-4 animate-pulse">2026</div>
                 <div className="text-2xl font-bold text-white mb-2 uppercase tracking-widest">Founded</div>
                 <div className="h-1 w-12 bg-white/40 mx-auto rounded-full"></div>
                 <p className="mt-8 text-white/80 max-w-xs mx-auto italic">
                   "Building the future of finance, one transaction at a time."
                 </p>
               </div>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="py-24">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-display font-bold text-slate-900 mb-4">Core Values</h2>
            <p className="text-lg text-slate-600">The pillars that uphold our vision and drive our everyday commitment to you.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div
                  key={index}
                  className="group relative bg-white p-8 rounded-3xl border border-slate-100 hover:border-primary-200 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${value.gradient} text-white mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-primary-600 transition-colors">{value.title}</h3>
                  <p className="text-slate-600 leading-relaxed text-sm">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="pb-24 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { icon: Users, value: "10K+", label: "Active Users", color: "text-blue-600" },
            { icon: Zap, value: "50K+", label: "Smart Trades", color: "text-amber-600" },
            { icon: Award, value: "98%", label: "Satisfaction", color: "text-emerald-600" },
            { icon: Globe, value: "15+", label: "Global Presence", color: "text-purple-600" }
          ].map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="bg-white/40 backdrop-blur-sm border border-white/60 p-8 rounded-3xl text-center shadow-lg hover:shadow-xl transition-all duration-300 group">
                <div className={`inline-flex p-3 bg-white rounded-2xl mb-4 shadow-sm group-hover:scale-110 transition-transform ${stat.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div className="text-4xl font-display font-black text-slate-900 mb-1">{stat.value}</div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default About;