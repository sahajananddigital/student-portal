import React, { useState } from "react";
import logo from "../assets/Logo/logo.png";
import { Lock, Mail, Eye, EyeOff, ArrowRight, AlertCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function SignIn() {
  const BACKEND_PORT = import.meta.env.VITE_LOCAL_BACKEND_PORT;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const brandColor = "#054676";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };
  const validate = () => {
    let newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email) newErrors.email = "Email is required";
    else if (!emailRegex.test(formData.email))
      newErrors.email = "Invalid email format";

    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");

    if (!validate()) return;

    setIsLoading(true);

    try {
      const response = await fetch(`${BACKEND_PORT}?action=login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        navigate("/home");
      } else {
        setApiError(data.message || "Invalid credentials. Please try again.");
      }
    } catch (err) {
      console.log("eror", err);
      setApiError("Server connection failed. Please check your internet.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col justify-center items-center p-6">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-10">
          <img src={logo} alt="Logo" className="h-24" />
        </div>

        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 p-8">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-slate-800">
              Student Sign In
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Enter your credentials to access your portal
            </p>
          </div>

          {/* API Error Alert */}
          {apiError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl flex items-center gap-3 text-sm animate-shake">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                Student Email / ID
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#054676] transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  name="email"
                  type="text"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="alex.rivera@university.edu"
                  className={`w-full pl-11 pr-4 py-4 bg-slate-50 border ${
                    errors.email ? "border-red-300" : "border-slate-100"
                  } rounded-2xl focus:bg-white focus:ring-2 focus:ring-slate-100 transition-all outline-none text-sm font-medium`}
                  style={
                    !errors.email
                      ? { "--tw-ring-color": `${brandColor}20` }
                      : {}
                  }
                />
              </div>
              {errors.email && (
                <p className="text-[10px] text-red-500 font-bold ml-1 uppercase">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Password
                </label>
                <a
                  href="#"
                  className="text-xs font-bold hover:opacity-80 transition-opacity"
                  style={{ color: brandColor }}
                >
                  Forgot?
                </a>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#054676] transition-colors">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`w-full pl-11 pr-12 py-4 bg-slate-50 border ${
                    errors.password ? "border-red-300" : "border-slate-100"
                  } rounded-2xl focus:bg-white focus:ring-2 focus:ring-slate-100 transition-all outline-none text-sm font-medium`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-[10px] text-red-500 font-bold ml-1 uppercase">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full text-white font-bold py-4 rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2 group disabled:opacity-70 active:scale-[0.98]"
              style={{
                backgroundColor: brandColor,
                boxShadow: `0 10px 15px -3px ${brandColor}40`,
              }}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center mt-8 text-sm text-slate-400 font-medium">
          New student?{" "}
          <Link
            to={"/signup"}
            className="font-bold hover:underline"
            style={{ color: brandColor }}
          >
            Contact Administration
          </Link>
        </p>
      </div>
    </div>
  );
}
