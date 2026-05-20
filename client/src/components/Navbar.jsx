import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { UserCircle, Menu, X, TrendingUp, Home, Info, Briefcase, Mail, Bot, Cpu } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { path: "/", label: "Home", icon: Home },
    { path: "/about", label: "About", icon: Info },
    { path: "/service", label: "Services", icon: Briefcase },
    { path: "/financeadvise", label: "AI Tools", icon: Bot },
    { path: "/contact", label: "Contact", icon: Mail },
    { path: "/ai-dashboard", label: "AI Shadow", icon: Cpu },
  ];

  /* ── shared styles ── */
  const NAV_BG   = scrolled ? "rgba(32,30,22,0.97)" : "#2c2a20";
  const GOLD     = "#c9a84c";
  const CREAM    = "#e8dfc0";
  const MUTED    = "#9a9070";

  const linkBase = {
    display: "inline-flex", alignItems: "center", gap: "0.35rem",
    padding: "0.4rem 0.85rem", borderRadius: 8,
    fontSize: "0.88rem", fontWeight: 500,
    textDecoration: "none", transition: "all 0.2s",
    letterSpacing: "0.01em",
  };

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
      background: NAV_BG,
      borderBottom: `1px solid rgba(201,168,76,0.12)`,
      boxShadow: scrolled ? "0 4px 24px rgba(0,0,0,0.35)" : "none",
      transition: "background 0.3s, box-shadow 0.3s",
      fontFamily: "'Inter', sans-serif",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 68 }}>

          {/* ── Logo ── */}
          <Link to="/" style={{ display: "flex", alignItems: "center", gap: "0.65rem", textDecoration: "none" }}>
            <div style={{
              width: 36, height: 36, borderRadius: 9,
              background: "#3a3828", border: "1px solid rgba(201,168,76,0.35)",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" />
              </svg>
            </div>
            <div>
              <div style={{ color: CREAM, fontWeight: 700, fontSize: "1rem", letterSpacing: "0.02em", fontFamily: "'Outfit', sans-serif", lineHeight: 1.1 }}>
                Money Mentor
              </div>
              <div style={{ color: "#6a6248", fontSize: "0.62rem", letterSpacing: "0.12em", textTransform: "uppercase" }}>
                Smart Finance
              </div>
            </div>
          </Link>

          {/* ── Desktop Nav ── */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }} className="navbar-desktop">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  style={{
                    ...linkBase,
                    color: active ? GOLD : MUTED,
                    background: active ? "rgba(201,168,76,0.1)" : "transparent",
                    borderBottom: active ? `2px solid ${GOLD}` : "2px solid transparent",
                  }}
                  onMouseEnter={e => { if (!active) { e.currentTarget.style.color = CREAM; e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}}
                  onMouseLeave={e => { if (!active) { e.currentTarget.style.color = MUTED; e.currentTarget.style.background = "transparent"; }}}
                >
                  {link.label}
                </Link>
              );
            })}

            {/* CTA Buttons */}
            {isAuthenticated ? (
              <Link
                to="/profile"
                style={{
                  ...linkBase,
                  marginLeft: "0.75rem",
                  background: "rgba(201,168,76,0.12)",
                  color: GOLD,
                  border: "1px solid rgba(201,168,76,0.3)",
                  borderRadius: 9,
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(201,168,76,0.2)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(201,168,76,0.12)"; }}
              >
                <UserCircle size={16} /> Profile
              </Link>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginLeft: "0.75rem" }}>
                {/* Log In */}
                <Link
                  to="/login"
                  style={{
                    ...linkBase,
                    color: MUTED,
                    fontWeight: 500,
                    padding: "0.4rem 0.75rem",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.color = CREAM; }}
                  onMouseLeave={e => { e.currentTarget.style.color = MUTED; }}
                >
                  Log In
                </Link>
                {/* Get Started */}
                <Link
                  to="/register"
                  style={{
                    ...linkBase,
                    background: GOLD,
                    color: "#1a1810",
                    fontWeight: 700,
                    fontSize: "0.85rem",
                    padding: "0.45rem 1.1rem",
                    borderRadius: 9,
                    letterSpacing: "0.02em",
                    gap: "0.4rem",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = "#d4b558"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = GOLD; }}
                >
                  <TrendingUp size={15} /> Get Started
                </Link>
              </div>
            )}
          </div>

          {/* ── Mobile Burger ── */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="navbar-mobile-btn"
            style={{
              background: "none", border: "none", cursor: "pointer",
              color: MUTED, padding: 6, borderRadius: 7,
              display: "none",
            }}
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* ── Mobile Menu ── */}
        {isOpen && (
          <div style={{
            paddingBottom: "1.2rem",
            display: "flex", flexDirection: "column", gap: "0.25rem",
            borderTop: "1px solid rgba(201,168,76,0.1)",
          }}>
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  style={{
                    display: "flex", alignItems: "center", gap: "0.6rem",
                    padding: "0.75rem 1rem", borderRadius: 9,
                    textDecoration: "none", fontSize: "0.9rem", fontWeight: 500,
                    color: active ? GOLD : MUTED,
                    background: active ? "rgba(201,168,76,0.1)" : "transparent",
                  }}
                >
                  <Icon size={16} /> {link.label}
                </Link>
              );
            })}
            {isAuthenticated ? (
              <Link
                to="/profile"
                onClick={() => setIsOpen(false)}
                style={{ display: "flex", alignItems: "center", gap: "0.6rem", padding: "0.75rem 1rem", borderRadius: 9, textDecoration: "none", fontSize: "0.9rem", fontWeight: 600, color: GOLD, background: "rgba(201,168,76,0.1)" }}
              >
                <UserCircle size={16} /> Profile
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 1rem", borderRadius: 9, textDecoration: "none", fontSize: "0.9rem", fontWeight: 500, color: MUTED }}
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", padding: "0.75rem 1rem", borderRadius: 9, textDecoration: "none", fontSize: "0.9rem", fontWeight: 700, color: "#1a1810", background: GOLD, marginTop: "0.25rem" }}
                >
                  <TrendingUp size={16} /> Get Started
                </Link>
              </>
            )}
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .navbar-desktop { display: none !important; }
          .navbar-mobile-btn { display: flex !important; }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;