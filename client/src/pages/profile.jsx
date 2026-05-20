import { useEffect, useState } from "react";
import { fetchUser, editUser, deleteUser } from "../api";
import { logoutSuccess } from "../store/authSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  UserCircle2,
  Edit2,
  LogOut,
  Save,
  X,
  Trash2,
  Mail,
  Phone,
  Calendar,
  Briefcase,
  DollarSign,
  Users,
  Home as HomeIcon,
  Car,
  AlertCircle,
  ArrowLeft,
  Shield,
  TrendingUp,
  Star,
} from "lucide-react";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const getUserData = async () => {
      try {
        const userData = await fetchUser();
        setUser(userData.user);
        setFormData(userData.user);
      } catch (err) {
        navigate("/login");
        setError("Failed to load user data");
      } finally {
        setLoading(false);
      }
    };
    getUserData();
  }, [navigate]);

  const handleLogout = () => {
    dispatch(logoutSuccess());
    localStorage.removeItem("token");
    navigate("/login");
    window.location.reload();
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSaveLoading(true);
    try {
      await editUser(formData);
      setUser(formData);
      setIsEditing(false);
    } catch (err) {
      setError("Failed to update user data");
    } finally {
      setSaveLoading(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );
    if (confirmed) {
      try {
        await deleteUser();
        dispatch(logoutSuccess());
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      } catch (err) {
        setError("Failed to delete user data");
      }
    }
  };

  /* ── LOADING ─────────────────────────────────── */
  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f5f0e8", fontFamily: "'Inter', sans-serif" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: 48, height: 48, border: "3px solid rgba(201,168,76,0.25)",
            borderTopColor: "#c9a84c", borderRadius: "50%",
            animation: "profile-spin 0.7s linear infinite", margin: "0 auto 1rem",
          }} />
          <p style={{ color: "#8a7f60", fontSize: "0.9rem", fontWeight: 500 }}>Loading your profile…</p>
        </div>
        <style>{`@keyframes profile-spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  /* ── ERROR ───────────────────────────────────── */
  if (error && !user) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f5f0e8", fontFamily: "'Inter', sans-serif" }}>
        <div style={{ background: "#fff", border: "1px solid #fca5a5", borderRadius: 16, padding: "2rem 2.5rem", textAlign: "center", maxWidth: 380 }}>
          <AlertCircle style={{ color: "#dc2626", width: 40, height: 40, marginBottom: "0.75rem" }} />
          <p style={{ color: "#dc2626", fontWeight: 600 }}>{error}</p>
        </div>
      </div>
    );
  }

  const highlights = [
    { icon: <TrendingUp size={17} />, title: "Your Financial Hub", desc: "All your goals, budgets, and AI insights in one place." },
    { icon: <Shield size={17} />, title: "Data You Control", desc: "Edit or delete your profile anytime. Your data, your rules." },
    { icon: <Star size={17} />, title: "Personalised Advice", desc: "The more you share, the smarter your AI mentor becomes." },
  ];

  const inputStyle = {
    width: "100%",
    paddingLeft: "2.5rem",
    paddingRight: "1rem",
    paddingTop: "0.7rem",
    paddingBottom: "0.7rem",
    borderRadius: 10,
    border: "1.5px solid #d8d0b8",
    background: "#faf7f0",
    color: "#1a1810",
    fontSize: "0.88rem",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s, box-shadow 0.2s",
    fontFamily: "'Inter', sans-serif",
  };

  const labelStyle = {
    display: "block",
    fontSize: "0.7rem",
    fontWeight: 700,
    color: "#5a5034",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    marginBottom: "0.45rem",
  };

  const infoRowStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0.7rem 1rem",
    background: "rgba(255,255,255,0.55)",
    border: "1px solid rgba(201,168,76,0.12)",
    borderRadius: 10,
    marginBottom: "0.5rem",
  };

  const sectionHeadStyle = {
    fontSize: "0.72rem",
    fontWeight: 700,
    color: "#5a5034",
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    marginBottom: "0.9rem",
    paddingBottom: "0.6rem",
    borderBottom: "1px solid #e4dcca",
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", fontFamily: "'Inter', sans-serif" }}>

      {/* ── LEFT PANEL ─────────────────────────────── */}
      <div
        className="profile-left-panel"
        style={{
          width: "42%",
          background: "#2c2a20",
          display: "flex",
          flexDirection: "column",
          padding: "2.5rem 3rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Texture overlay */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage:
            "radial-gradient(ellipse at 20% 80%, rgba(212,175,55,0.06) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(212,175,55,0.04) 0%, transparent 60%)",
          pointerEvents: "none",
        }} />

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "3rem", position: "relative" }}>
          <div style={{
            width: 36, height: 36, borderRadius: 8,
            background: "#3a3828", border: "1px solid rgba(212,175,55,0.3)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" />
            </svg>
          </div>
          <div>
            <div style={{ color: "#e8dfc0", fontWeight: 700, fontSize: "0.95rem", letterSpacing: "0.02em" }}>Money Mentor</div>
            <div style={{ color: "#8a8060", fontSize: "0.65rem", letterSpacing: "0.12em", textTransform: "uppercase" }}>Smart Finance</div>
          </div>
        </div>

        {/* Headline */}
        <div style={{ flex: 1, position: "relative" }}>
          <p style={{ color: "#c9a84c", fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "1.2rem" }}>
            ✦ Your Account
          </p>
          <h1 style={{
            fontSize: "clamp(2.2rem, 3.5vw, 3rem)",
            fontWeight: 800,
            lineHeight: 1.1,
            color: "#e8dfc0",
            marginBottom: "1rem",
            fontFamily: "'Outfit', sans-serif",
          }}>
            Your{" "}
            <span style={{ fontStyle: "italic", color: "#c9a84c", fontWeight: 700 }}>
              financial<br />profile,
            </span>{" "}
            your rules.
          </h1>
          <p style={{ color: "#9a9070", fontSize: "0.92rem", lineHeight: 1.7, maxWidth: "340px", marginBottom: "2.8rem" }}>
            Manage your personal details and financial profile to get the most accurate AI-powered insights.
          </p>

          {/* Highlight cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {highlights.map((h, i) => (
              <div
                key={i}
                className="profile-feature-card"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: 12,
                  padding: "0.85rem 1.1rem",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "0.9rem",
                  transition: "background 0.2s",
                }}
              >
                <div style={{
                  width: 32, height: 32, borderRadius: 8,
                  background: "rgba(201,168,76,0.12)", color: "#c9a84c",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0, marginTop: 1,
                }}>
                  {h.icon}
                </div>
                <div>
                  <div style={{ color: "#e0d8b8", fontWeight: 600, fontSize: "0.88rem", marginBottom: "0.2rem" }}>{h.title}</div>
                  <div style={{ color: "#7a7258", fontSize: "0.77rem", lineHeight: 1.5 }}>{h.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ────────────────────────────── */}
      <div style={{
        flex: 1,
        background: "#f5f0e8",
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
      }}>
        {/* Top bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1.4rem 2.5rem", flexShrink: 0 }}>
          <button
            onClick={() => navigate("/")}
            style={{
              display: "flex", alignItems: "center", gap: "0.4rem",
              background: "none", border: "none", cursor: "pointer",
              color: "#6b6448", fontSize: "0.85rem", fontWeight: 500,
              transition: "color 0.2s",
            }}
          >
            <ArrowLeft size={15} />
            Back home
          </button>

          {/* Action buttons */}
          <div style={{ display: "flex", gap: "0.6rem" }}>
            <button
              onClick={() => { setIsEditing(!isEditing); setError(""); }}
              style={{
                display: "flex", alignItems: "center", gap: "0.4rem",
                padding: "0.5rem 1rem",
                borderRadius: 10,
                border: isEditing ? "1.5px solid #d8d0b8" : "1.5px solid #2c2a20",
                background: isEditing ? "transparent" : "#2c2a20",
                color: isEditing ? "#6b6448" : "#e8dfc0",
                fontSize: "0.82rem", fontWeight: 600, cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={e => { if (!isEditing) e.currentTarget.style.background = "#3e3c28"; }}
              onMouseLeave={e => { if (!isEditing) e.currentTarget.style.background = "#2c2a20"; }}
            >
              {isEditing ? <><X size={14} /> Cancel</> : <><Edit2 size={14} /> Edit Profile</>}
            </button>
            <button
              onClick={handleLogout}
              style={{
                display: "flex", alignItems: "center", gap: "0.4rem",
                padding: "0.5rem 1rem",
                borderRadius: 10,
                border: "1.5px solid #d8d0b8",
                background: "transparent",
                color: "#6b6448",
                fontSize: "0.82rem", fontWeight: 600, cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#c9a84c"; e.currentTarget.style.color = "#5a5034"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#d8d0b8"; e.currentTarget.style.color = "#6b6448"; }}
            >
              <LogOut size={14} /> Logout
            </button>
          </div>
        </div>

        {/* Main content */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "0.5rem 2.5rem 2.5rem" }}>

          {/* Profile badge + heading */}
          <div style={{ marginBottom: "1.8rem" }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "0.5rem",
              background: "#e8e0cc", borderRadius: 20,
              padding: "0.3rem 0.9rem", marginBottom: "1.2rem",
            }}>
              <UserCircle2 size={14} style={{ color: "#6b6448" }} />
              <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "#5a5034" }}>My Profile</span>
            </div>

            <h2 style={{
              fontSize: "2rem", fontWeight: 800, color: "#1a1810",
              marginBottom: "0.4rem", lineHeight: 1.15,
              fontFamily: "'Outfit', sans-serif",
            }}>
              {isEditing ? <>Edit your <em style={{ fontStyle: "italic", fontWeight: 400 }}>details.</em></> : <>Hello, <em style={{ fontStyle: "italic", fontWeight: 400 }}>{user?.name?.split(" ")[0]}.</em></>}
            </h2>
            <p style={{ color: "#8a7f60", fontSize: "0.83rem", lineHeight: 1.6 }}>
              {isEditing ? "Update your personal and financial information below." : "Here's an overview of your personal and financial profile."}
            </p>
          </div>

          {/* Error banner */}
          {error && (
            <div style={{
              background: "#fef2f2", border: "1px solid #fca5a5",
              borderRadius: 10, padding: "0.65rem 1rem",
              color: "#dc2626", fontSize: "0.83rem", marginBottom: "1.2rem",
              display: "flex", alignItems: "center", gap: "0.5rem",
            }}>
              <AlertCircle size={15} />
              {error}
            </div>
          )}

          {isEditing ? (
            /* ── EDIT FORM ── */
            <form onSubmit={handleFormSubmit}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.2rem" }} className="profile-grid">

                {/* Personal Details */}
                <div style={{ background: "rgba(255,255,255,0.6)", border: "1px solid rgba(201,168,76,0.15)", borderRadius: 16, padding: "1.4rem" }}>
                  <div style={sectionHeadStyle}>Personal Details</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
                    {[
                      { label: "Full Name", name: "name", type: "text", Icon: UserCircle2 },
                      { label: "Email Address", name: "email", type: "email", Icon: Mail },
                      { label: "Phone Number", name: "phone", type: "tel", Icon: Phone },
                      { label: "Date of Birth", name: "dateOfBirth", type: "date", Icon: Calendar },
                    ].map(({ label, name, type, Icon }) => (
                      <div key={name}>
                        <label style={labelStyle}>{label}</label>
                        <div style={{ position: "relative" }}>
                          <Icon size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9a9070" }} />
                          <input
                            type={type}
                            name={name}
                            value={formData[name] || ""}
                            onChange={handleInputChange}
                            style={inputStyle}
                            onFocus={e => { e.target.style.borderColor = "#c9a84c"; e.target.style.boxShadow = "0 0 0 3px rgba(201,168,76,0.15)"; }}
                            onBlur={e => { e.target.style.borderColor = "#d8d0b8"; e.target.style.boxShadow = "none"; }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Financial Profile */}
                <div style={{ background: "rgba(255,255,255,0.6)", border: "1px solid rgba(201,168,76,0.15)", borderRadius: 16, padding: "1.4rem" }}>
                  <div style={sectionHeadStyle}>Financial Profile</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
                    {[
                      { label: "Occupation", name: "occupation", type: "text", Icon: Briefcase },
                      { label: "Annual Income", name: "annualIncome", type: "number", Icon: DollarSign },
                      { label: "Marital Status", name: "maritalStatus", type: "text", Icon: Users },
                      { label: "Dependents", name: "dependents", type: "number", Icon: Users },
                    ].map(({ label, name, type, Icon }) => (
                      <div key={name}>
                        <label style={labelStyle}>{label}</label>
                        <div style={{ position: "relative" }}>
                          <Icon size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9a9070" }} />
                          <input
                            type={type}
                            name={name}
                            value={formData[name] || ""}
                            onChange={handleInputChange}
                            style={inputStyle}
                            onFocus={e => { e.target.style.borderColor = "#c9a84c"; e.target.style.boxShadow = "0 0 0 3px rgba(201,168,76,0.15)"; }}
                            onBlur={e => { e.target.style.borderColor = "#d8d0b8"; e.target.style.boxShadow = "none"; }}
                          />
                        </div>
                      </div>
                    ))}

                    {/* Checkboxes */}
                    {[
                      { name: "ownHome", label: "Own Home", Icon: HomeIcon },
                      { name: "ownCar", label: "Own Car", Icon: Car },
                    ].map(({ name, label, Icon }) => (
                      <div key={name} style={{
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        padding: "0.65rem 0.9rem",
                        background: "#faf7f0", border: "1.5px solid #d8d0b8",
                        borderRadius: 10,
                      }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <Icon size={15} style={{ color: "#9a9070" }} />
                          <span style={{ fontSize: "0.85rem", color: "#5a5034", fontWeight: 500 }}>{label}</span>
                        </div>
                        <input
                          type="checkbox"
                          name={name}
                          checked={formData[name] || false}
                          onChange={handleInputChange}
                          style={{ accentColor: "#2c2a20", width: 16, height: 16, cursor: "pointer" }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Save button */}
              <div style={{ display: "flex", justifyContent: "center", marginTop: "1.5rem" }}>
                <button
                  type="submit"
                  disabled={saveLoading}
                  style={{
                    background: saveLoading ? "#4a4838" : "#2c2a20",
                    color: "#e8dfc0",
                    border: "none",
                    borderRadius: 12,
                    padding: "0.85rem 2.5rem",
                    fontSize: "0.93rem",
                    fontWeight: 700,
                    cursor: saveLoading ? "not-allowed" : "pointer",
                    display: "flex", alignItems: "center", gap: "0.5rem",
                    transition: "background 0.2s",
                    letterSpacing: "0.02em",
                  }}
                  onMouseEnter={e => { if (!saveLoading) e.currentTarget.style.background = "#3e3c28"; }}
                  onMouseLeave={e => { if (!saveLoading) e.currentTarget.style.background = "#2c2a20"; }}
                >
                  {saveLoading ? (
                    <>
                      <div style={{
                        width: 16, height: 16, border: "2px solid rgba(232,223,192,0.3)",
                        borderTopColor: "#e8dfc0", borderRadius: "50%",
                        animation: "profile-spin 0.7s linear infinite",
                      }} />
                      Saving…
                    </>
                  ) : (
                    <><Save size={16} /> Save Changes</>
                  )}
                </button>
              </div>
            </form>
          ) : (
            /* ── VIEW MODE ── */
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.2rem" }} className="profile-grid">

              {/* Personal Details */}
              <div style={{ background: "rgba(255,255,255,0.6)", border: "1px solid rgba(201,168,76,0.15)", borderRadius: 16, padding: "1.4rem" }}>
                <div style={sectionHeadStyle}>Personal Details</div>
                {[
                  { label: "Name", value: user.name, Icon: UserCircle2 },
                  { label: "Email", value: user.email, Icon: Mail },
                  { label: "Phone", value: user.phone || "Not provided", Icon: Phone },
                  {
                    label: "Date of Birth",
                    value: user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : "Not provided",
                    Icon: Calendar,
                  },
                ].map(({ label, value, Icon }) => (
                  <div key={label} style={infoRowStyle}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.55rem" }}>
                      <Icon size={15} style={{ color: "#9a9070" }} />
                      <span style={{ fontSize: "0.83rem", color: "#6b6448", fontWeight: 500 }}>{label}</span>
                    </div>
                    <span style={{ fontSize: "0.85rem", color: "#1a1810", fontWeight: 600 }}>{value}</span>
                  </div>
                ))}
              </div>

              {/* Financial Profile */}
              <div style={{ background: "rgba(255,255,255,0.6)", border: "1px solid rgba(201,168,76,0.15)", borderRadius: 16, padding: "1.4rem" }}>
                <div style={sectionHeadStyle}>Financial Profile</div>
                {[
                  { label: "Occupation", value: user.occupation || "Not provided", Icon: Briefcase },
                  {
                    label: "Annual Income",
                    value: user.annualIncome ? `$${Number(user.annualIncome).toLocaleString()}` : "Not provided",
                    Icon: DollarSign,
                  },
                  { label: "Marital Status", value: user.maritalStatus || "Not provided", Icon: Users },
                  { label: "Dependents", value: user.dependents ?? "0", Icon: Users },
                  { label: "Own Home", value: user.ownHome ? "Yes" : "No", Icon: HomeIcon },
                  { label: "Own Car", value: user.ownCar ? "Yes" : "No", Icon: Car },
                ].map(({ label, value, Icon }) => (
                  <div key={label} style={infoRowStyle}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.55rem" }}>
                      <Icon size={15} style={{ color: "#9a9070" }} />
                      <span style={{ fontSize: "0.83rem", color: "#6b6448", fontWeight: 500 }}>{label}</span>
                    </div>
                    <span style={{ fontSize: "0.85rem", color: "#1a1810", fontWeight: 600 }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Delete account */}
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1.6rem" }}>
            <button
              onClick={handleDelete}
              style={{
                display: "flex", alignItems: "center", gap: "0.4rem",
                padding: "0.55rem 1.1rem",
                borderRadius: 10,
                border: "1.5px solid #fca5a5",
                background: "transparent",
                color: "#dc2626",
                fontSize: "0.82rem", fontWeight: 600, cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "#fef2f2"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
            >
              <Trash2 size={14} /> Close My Account
            </button>
          </div>
        </div>
      </div>

      {/* Styles */}
      <style>{`
        @keyframes profile-spin {
          to { transform: rotate(360deg); }
        }
        .profile-feature-card:hover {
          background: rgba(255,255,255,0.07) !important;
        }
        @media (max-width: 900px) {
          .profile-left-panel {
            display: none !important;
          }
          .profile-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Profile;