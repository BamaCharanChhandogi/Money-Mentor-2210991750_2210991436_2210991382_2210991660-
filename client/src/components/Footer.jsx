import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram, Heart } from "lucide-react";

const Footer = () => {

  const GOLD  = "#c9a84c";
  const CREAM = "#d4c89a";
  const MUTED = "#7a7258";
  const DIM   = "#4a4838";
  const BG    = "#242218";

  const FooterLink = ({ to, children, highlight = false }) => (
    <li style={{ listStyle: "none" }}>
      <Link
        to={to}
        style={{
          color: highlight ? GOLD : MUTED,
          textDecoration: "none",
          fontSize: "0.875rem",
          lineHeight: "2.1",
          display: "block",
          transition: "color 0.18s",
        }}
        onMouseEnter={e => e.currentTarget.style.color = CREAM}
        onMouseLeave={e => e.currentTarget.style.color = highlight ? GOLD : MUTED}
      >
        {children}
      </Link>
    </li>
  );

  const ColHeading = ({ children }) => (
    <p style={{
      color: CREAM,
      fontWeight: 700,
      fontSize: "0.71rem",
      letterSpacing: "0.14em",
      textTransform: "uppercase",
      margin: "0 0 1.15rem 0",
    }}>
      {children}
    </p>
  );

  const SocialBtn = ({ href, children }) => (
    <a
      href={href}
      style={{
        width: 32, height: 32, borderRadius: 6,
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(201,168,76,0.2)",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: MUTED, textDecoration: "none",
        transition: "all 0.2s",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = "rgba(201,168,76,0.12)";
        e.currentTarget.style.color = GOLD;
        e.currentTarget.style.borderColor = "rgba(201,168,76,0.4)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = "rgba(255,255,255,0.04)";
        e.currentTarget.style.color = MUTED;
        e.currentTarget.style.borderColor = "rgba(201,168,76,0.2)";
      }}
    >
      {children}
    </a>
  );

  return (
    <footer style={{
      background: BG,
      fontFamily: "'Inter', sans-serif",
      position: "relative",
      overflow: "hidden",
      borderTop: "1px solid rgba(201,168,76,0.1)",
    }}>

      {/* Subtle ambient glows */}
      <div style={{ position: "absolute", top: -60, left: -60, width: 240, height: 240, borderRadius: "50%", background: "radial-gradient(circle, rgba(201,168,76,0.05) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: -40, right: -40, width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(201,168,76,0.04) 0%, transparent 70%)", pointerEvents: "none" }} />

      {/* ════ MAIN GRID ════ */}
      <div style={{ maxWidth: 1160, margin: "0 auto", padding: "3rem 2rem 0", position: "relative" }}>
        <div
          className="footer-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1.8fr 1fr 1.1fr 1.5fr",
            gap: "2.5rem",
            paddingBottom: "2.5rem",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}
        >

          {/* ── Column 1: Brand ── */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1rem" }}>
              <div style={{
                width: 34, height: 34, borderRadius: 8,
                background: "#32301e",
                border: "1px solid rgba(201,168,76,0.28)",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="5" width="20" height="14" rx="2" />
                  <line x1="2" y1="10" x2="22" y2="10" />
                </svg>
              </div>
              <div>
                <div style={{ color: CREAM, fontWeight: 700, fontSize: "0.96rem", fontFamily: "'Outfit', sans-serif", lineHeight: 1.15 }}>
                  Money Mentor
                </div>
                <div style={{ color: DIM, fontSize: "0.57rem", letterSpacing: "0.14em", textTransform: "uppercase" }}>
                  Smart Finance Management
                </div>
              </div>
            </div>

            <p style={{ color: MUTED, fontSize: "0.855rem", lineHeight: 1.75, maxWidth: 255, margin: "0 0 1.4rem 0" }}>
              Your trusted partner in achieving financial freedom. Manage, track, and grow your wealth with intelligent insights.
            </p>

            <div style={{ display: "flex", gap: "0.45rem" }}>
              <SocialBtn href="#"><Facebook size={13} /></SocialBtn>
              <SocialBtn href="#"><Twitter size={13} /></SocialBtn>
              <SocialBtn href="#"><Linkedin size={13} /></SocialBtn>
              <SocialBtn href="#"><Instagram size={13} /></SocialBtn>
            </div>
          </div>

          {/* ── Column 2: Quick Links ── */}
          <div>
            <ColHeading>Quick Links</ColHeading>
            <ul style={{ padding: 0, margin: 0 }}>
              <FooterLink to="/">Home</FooterLink>
              <FooterLink to="/about">About Us</FooterLink>
              <FooterLink to="/service">Services</FooterLink>
              <FooterLink to="/contact">Contact</FooterLink>
              <FooterLink to="/ai-dashboard">AI Dashboard</FooterLink>
            </ul>
          </div>

          {/* ── Column 3: Our Services ── */}
          <div>
            <ColHeading>Our Services</ColHeading>
            <ul style={{ padding: 0, margin: 0 }}>
              <FooterLink to="/services/expenses" highlight>Expense Tracking</FooterLink>
              <FooterLink to="/services/budgets">Budget Planning</FooterLink>
              <FooterLink to="/services/investments">Investment Tracker</FooterLink>
              <FooterLink to="/services/bank-accounts">Bank Integration</FooterLink>
              <FooterLink to="/family">Family Finance</FooterLink>
            </ul>
          </div>

          {/* ── Column 4: Get in Touch ── */}
          <div>
            <ColHeading>Get in Touch</ColHeading>
            <ul style={{ padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.9rem" }}>
              <li style={{ display: "flex", alignItems: "flex-start", gap: "0.6rem" }}>
                <MapPin size={14} style={{ color: GOLD, marginTop: 3, flexShrink: 0 }} />
                <span style={{ color: MUTED, fontSize: "0.855rem", lineHeight: 1.65 }}>
                  123 Finance Street, Business District, NY 10001
                </span>
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <Mail size={14} style={{ color: GOLD, flexShrink: 0 }} />
                <a
                  href="mailto:support@moneymentor.com"
                  style={{ color: MUTED, fontSize: "0.855rem", textDecoration: "none", transition: "color 0.18s" }}
                  onMouseEnter={e => e.currentTarget.style.color = CREAM}
                  onMouseLeave={e => e.currentTarget.style.color = MUTED}
                >
                  support@moneymentor.com
                </a>
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <Phone size={14} style={{ color: GOLD, flexShrink: 0 }} />
                <a
                  href="tel:+1234567890"
                  style={{ color: MUTED, fontSize: "0.855rem", textDecoration: "none", transition: "color 0.18s" }}
                  onMouseEnter={e => e.currentTarget.style.color = CREAM}
                  onMouseLeave={e => e.currentTarget.style.color = MUTED}
                >
                  +1 (234) 567-890
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* ════ BOTTOM BAR ════ */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexWrap: "wrap", gap: "0.6rem",
          padding: "1.2rem 0 1.5rem",
        }}>
          <p style={{ color: DIM, fontSize: "0.78rem", margin: 0 }}>
            © 2028 Money Mentor. All rights reserved.
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", color: DIM, fontSize: "0.78rem" }}>
            <span>Made with</span>
            <Heart size={11} style={{ color: "#993333", fill: "#993333" }} />
            <span>for better financial futures</span>
          </div>
          <div style={{ display: "flex", gap: "1.4rem" }}>
            <a
              href="#"
              style={{ color: DIM, fontSize: "0.78rem", textDecoration: "none", transition: "color 0.18s" }}
              onMouseEnter={e => e.currentTarget.style.color = GOLD}
              onMouseLeave={e => e.currentTarget.style.color = DIM}
            >
              Privacy Policy
            </a>
            <a
              href="#"
              style={{ color: DIM, fontSize: "0.78rem", textDecoration: "none", transition: "color 0.18s" }}
              onMouseEnter={e => e.currentTarget.style.color = GOLD}
              onMouseLeave={e => e.currentTarget.style.color = DIM}
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; gap: 2rem !important; }
        }
        @media (max-width: 520px) {
          .footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
