import { Link } from "react-router-dom";
import { Wallet, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram, Heart } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative mt-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 bg-pattern opacity-10"></div>
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl"></div>

      <div className="relative container mx-auto px-4 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Branding Section */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-primary-500 to-accent-600 p-2.5 rounded-xl shadow-lg">
                <Wallet className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-display font-bold">Money Mentor</h2>
                <p className="text-xs text-slate-400">Smart Finance Management</p>
              </div>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Your trusted partner in achieving financial freedom. Manage, track, and grow your wealth with intelligent insights.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="p-2.5 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-300 hover:scale-110 hover:shadow-lg">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="p-2.5 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-300 hover:scale-110 hover:shadow-lg">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="p-2.5 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-300 hover:scale-110 hover:shadow-lg">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="p-2.5 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-300 hover:scale-110 hover:shadow-lg">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-display font-semibold mb-6 text-white">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { to: "/", label: "Home" },
                { to: "/about", label: "About Us" },
                { to: "/service", label: "Services" },
                { to: "/contact", label: "Contact" },
                { to: "/ai-dashboard", label: "AI Dashboard" },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-slate-400 hover:text-white hover:translate-x-1 inline-block transition-all duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-display font-semibold mb-6 text-white">Our Services</h3>
            <ul className="space-y-3">
              {[
                { to: "/services/expenses", label: "Expense Tracking" },
                { to: "/services/budgets", label: "Budget Planning" },
                { to: "/services/investments", label: "Investment Tracker" },
                { to: "/services/bank-accounts", label: "Bank Integration" },
                { to: "/family", label: "Family Finance" },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-slate-400 hover:text-white hover:translate-x-1 inline-block transition-all duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-display font-semibold mb-6 text-white">Get in Touch</h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3 text-slate-400">
                <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0 text-primary-400" />
                <span>123 Finance Street, Business District, NY 10001</span>
              </li>
              <li className="flex items-center space-x-3 text-slate-400">
                <Mail className="h-5 w-5 flex-shrink-0 text-primary-400" />
                <a href="mailto:support@moneymentor.com" className="hover:text-white transition-colors">
                  support@moneymentor.com
                </a>
              </li>
              <li className="flex items-center space-x-3 text-slate-400">
                <Phone className="h-5 w-5 flex-shrink-0 text-primary-400" />
                <a href="tel:+1234567890" className="hover:text-white transition-colors">
                  +1 (234) 567-890
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-slate-400 text-sm text-center md:text-left">
              © {currentYear} Money Mentor. All rights reserved.
            </p>
            <div className="flex items-center space-x-1 text-sm text-slate-400">
              <span>Made with</span>
              <Heart className="h-4 w-4 text-red-500 fill-current animate-pulse" />
              <span>for better financial futures</span>
            </div>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
