import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { UserCircle, Menu, X, Wallet, TrendingUp, Home, Info, Briefcase, Mail, Bot, Shield } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: "/", label: "Home", icon: Home },
    { path: "/about", label: "About", icon: Info },
    { path: "/service", label: "Services", icon: Briefcase },
    { path: "/ai-tools", label: "AI Tools", icon: Bot },
    { path: "/contact", label: "Contact", icon: Mail },
    { path: "/ai-shadow", label: "AI Shadow", icon: Shield },
  ];

  return (
    <nav className="fixed w-full top-0 lg:top-4 z-50 lg:px-6 transition-all duration-300">
      {/* Premium Floating Island Background */}
      <div className="bg-white/80 backdrop-blur-xl border-b lg:border border-slate-200/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] lg:rounded-full mx-auto max-w-7xl transition-all duration-300">
        <div className="px-4 lg:px-6">
          <div className="flex justify-between items-center h-20 lg:h-16">
            
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center space-x-3 group pl-2"
            >
              <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 bg-primary-500 rounded-xl blur-md opacity-30 group-hover:opacity-60 transition-opacity duration-300"></div>
                <div className="relative bg-gradient-to-br from-primary-500 to-primary-700 p-2 rounded-xl shadow-lg transform group-hover:scale-105 transition-transform duration-300">
                  <Wallet className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-xl font-display font-bold text-slate-900 group-hover:text-primary-600 transition-colors tracking-tight">
                  Money Mentor
                </span>
                <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold -mt-1 hidden sm:block">
                  Smart Finance
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center justify-center space-x-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`
                      flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-semibold
                      transition-all duration-300 group relative overflow-hidden
                      ${active
                        ? 'text-primary-700 bg-primary-50 shadow-sm border border-primary-100/50'
                        : 'text-slate-600 hover:text-primary-600 hover:bg-slate-50 border border-transparent'
                      }
                    `}
                  >
                    <Icon className={`h-4 w-4 ${active ? 'text-primary-600' : 'text-slate-400 group-hover:text-primary-500 transition-colors'}`} />
                    <span className="relative z-10">{link.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Right Side Actions (Desktop) */}
            <div className="hidden md:flex items-center space-x-3 pr-2">
              {isAuthenticated ? (
                <Link
                  to="/profile"
                  className="flex items-center justify-center h-10 w-10 rounded-full bg-slate-100 text-slate-600 hover:bg-primary-50 hover:text-primary-600 hover:shadow-md transition-all duration-300 border border-slate-200"
                >
                  <UserCircle className="h-6 w-6" />
                </Link>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link
                    to="/login"
                    className="text-sm font-semibold text-slate-600 hover:text-primary-600 transition-colors px-2"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/register"
                    className="btn-primary flex items-center space-x-2 px-5 py-2 text-sm shadow-primary-500/20 group relative overflow-hidden rounded-full font-bold"
                  >
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
                    <TrendingUp className="h-4 w-4 relative z-10 group-hover:rotate-12 transition-transform" />
                    <span className="relative z-10">Get Started</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-all duration-300 focus:outline-none"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Mobile Menu Dropdown */}
          <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100 pb-6' : 'max-h-0 opacity-0'}`}>
            <div className="flex flex-col space-y-2 pt-2 border-t border-slate-100">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`
                      flex items-center space-x-3 px-4 py-3 rounded-xl font-medium
                      transition-all duration-200
                      ${active
                        ? 'bg-primary-50 text-primary-700 border border-primary-100'
                        : 'text-slate-600 hover:bg-slate-50 border border-transparent hover:text-slate-900'
                      }
                    `}
                  >
                    <Icon className={`h-5 w-5 ${active ? 'text-primary-600' : 'text-slate-400'}`} />
                    <span>{link.label}</span>
                  </Link>
                );
              })}

              <div className="pt-2 mt-2 border-t border-slate-100">
                {isAuthenticated ? (
                  <Link
                    to="/profile"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center space-x-2 px-4 py-3 rounded-xl font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                  >
                    <UserCircle className="h-5 w-5" />
                    <span>View Profile</span>
                  </Link>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <Link
                      to="/login"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-center px-4 py-3 rounded-xl font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                    >
                      Log In
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsOpen(false)}
                      className="btn-primary flex items-center justify-center space-x-2 py-3 rounded-xl px-4"
                    >
                      <TrendingUp className="h-5 w-5" />
                      <span>Get Started</span>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;