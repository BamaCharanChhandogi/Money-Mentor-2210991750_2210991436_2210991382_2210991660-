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
  AlertCircle
} from "lucide-react";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
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
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      await editUser(formData);
      setUser(formData);
      setIsEditing(false);
    } catch (err) {
      setError("Failed to update user data");
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");

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

if (loading) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-mesh">
      
      <div className="text-center space-y-4">
        
        {/* Loader */}
        <div className="w-16 h-16 mx-auto border-4 rounded-full animate-spin border-primary-500 border-t-transparent" />

        {/* Message */}
        <p className="font-medium text-slate-600">
          Loading your profile...
        </p>

      </div>

    </div>
  );
}

  if (error) return (
    <div className="min-h-screen bg-mesh flex items-center justify-center">
      <div className="glass-card p-8 text-center max-w-md">
        <div className="inline-flex p-4 bg-red-100 rounded-full mb-4">
          <AlertCircle className="h-8 w-8 text-red-600" />
        </div>
        <p className="text-red-600 font-semibold text-lg">{error}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-mesh py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header Card */}
        <div className="glass-card p-8 mb-8 shadow-2xl fade-in-up">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center space-x-6">
              <div className="p-4 bg-gradient-to-br from-primary-500 to-accent-600 rounded-2xl shadow-lg">
                <UserCircle2 className="text-white w-16 h-16" />
              </div>
              <div>
                <h1 className="text-3xl font-display font-bold text-slate-900">
                  {user.name}
                </h1>
                <p className="text-slate-600 flex items-center mt-1">
                  <Mail className="h-4 w-4 mr-2" />
                  {user.email}
                </p>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`p-3 rounded-xl transition-all shadow-lg ${isEditing
                    ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    : 'bg-primary-500 text-white hover:bg-primary-600'
                  }`}
                title={isEditing ? "Cancel" : "Edit Profile"}
              >
                {isEditing ? <X className="w-6 h-6" /> : <Edit2 className="w-6 h-6" />}
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white p-3 rounded-xl hover:bg-red-600 transition-all shadow-lg"
                title="Logout"
              >
                <LogOut className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="fade-in-up" style={{ animationDelay: '0.1s' }}>
          {isEditing ? (
            <form onSubmit={handleFormSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="glass-card p-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-6 pb-3 border-b border-slate-200">
                    Personal Details
                  </h3>
                  <div className="space-y-4">
                    {[
                      { label: "Full Name", name: "name", type: "text", icon: UserCircle2 },
                      { label: "Email Address", name: "email", type: "email", icon: Mail },
                      { label: "Phone Number", name: "phone", type: "tel", icon: Phone },
                      { label: "Date of Birth", name: "dateOfBirth", type: "date", icon: Calendar }
                    ].map(({ label, name, type, icon: Icon }) => (
                      <div key={name}>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          {label}
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Icon className="h-5 w-5 text-slate-400" />
                          </div>
                          <input
                            type={type}
                            name={name}
                            value={formData[name] || ""}
                            onChange={handleInputChange}
                            className="input-primary pl-11"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Additional Details */}
                <div className="glass-card p-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-6 pb-3 border-b border-slate-200">
                    Financial Profile
                  </h3>
                  <div className="space-y-4">
                    {[
                      { label: "Occupation", name: "occupation", type: "text", icon: Briefcase },
                      { label: "Annual Income", name: "annualIncome", type: "number", icon: DollarSign },
                      { label: "Marital Status", name: "maritalStatus", type: "text", icon: Users },
                      { label: "Dependents", name: "dependents", type: "number", icon: Users }
                    ].map(({ label, name, type, icon: Icon }) => (
                      <div key={name}>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          {label}
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Icon className="h-5 w-5 text-slate-400" />
                          </div>
                          <input
                            type={type}
                            name={name}
                            value={formData[name] || ""}
                            onChange={handleInputChange}
                            className="input-primary pl-11"
                          />
                        </div>
                      </div>
                    ))}

                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <HomeIcon className="h-5 w-5 text-slate-500" />
                        <label className="text-slate-700 font-medium">Own Home</label>
                      </div>
                      <input
                        type="checkbox"
                        name="ownHome"
                        checked={formData.ownHome || false}
                        onChange={handleInputChange}
                        className="w-5 h-5 text-primary-600 border-slate-300 rounded focus:ring-primary-500"
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <Car className="h-5 w-5 text-slate-500" />
                        <label className="text-slate-700 font-medium">Own Car</label>
                      </div>
                      <input
                        type="checkbox"
                        name="ownCar"
                        checked={formData.ownCar || false}
                        onChange={handleInputChange}
                        className="w-5 h-5 text-primary-600 border-slate-300 rounded focus:ring-primary-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Save Changes Button */}
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="btn-primary px-8 py-4 text-lg flex items-center space-x-2 shadow-xl shadow-primary-500/20"
                >
                  <Save className="w-5 h-5" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {/* Personal Information Display */}
              <div className="glass-card p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-6 pb-3 border-b border-slate-200">
                  Personal Details
                </h3>
                <div className="space-y-4">
                  {[
                    { label: "Name", value: user.name, icon: UserCircle2 },
                    { label: "Email", value: user.email, icon: Mail },
                    { label: "Phone", value: user.phone || "Not provided", icon: Phone },
                    {
                      label: "Date of Birth",
                      value: user.dateOfBirth
                        ? new Date(user.dateOfBirth).toLocaleDateString()
                        : "Not provided",
                      icon: Calendar
                    }
                  ].map(({ label, value, icon: Icon }) => (
                    <div key={label} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <Icon className="h-5 w-5 text-slate-500" />
                        <span className="text-slate-600 font-medium">{label}</span>
                      </div>
                      <span className="text-slate-900 font-semibold">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Additional Details Display */}
              <div className="glass-card p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-6 pb-3 border-b border-slate-200">
                  Financial Profile
                </h3>
                <div className="space-y-4">
                  {[
                    { label: "Occupation", value: user.occupation || "Not provided", icon: Briefcase },
                    {
                      label: "Annual Income",
                      value: user.annualIncome
                        ? `$${user.annualIncome.toLocaleString()}`
                        : "Not provided",
                      icon: DollarSign
                    },
                    { label: "Marital Status", value: user.maritalStatus || "Not provided", icon: Users },
                    { label: "Dependents", value: user.dependents || "0", icon: Users },
                    { label: "Own Home", value: user.ownHome ? "Yes" : "No", icon: HomeIcon },
                    { label: "Own Car", value: user.ownCar ? "Yes" : "No", icon: Car }
                  ].map(({ label, value, icon: Icon }) => (
                    <div key={label} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <Icon className="h-5 w-5 text-slate-500" />
                        <span className="text-slate-600 font-medium">{label}</span>
                      </div>
                      <span className="text-slate-900 font-semibold">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Delete Account Button */}
          <div className="mt-8 flex justify-end">
            <button
              onClick={handleDelete}
              className="bg-red-500 text-white px-6 py-3 rounded-xl hover:bg-red-600 transition-all flex items-center space-x-2 shadow-lg hover:shadow-xl"
            >
              <Trash2 className="w-5 h-5" />
              <span>Close My Account</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;