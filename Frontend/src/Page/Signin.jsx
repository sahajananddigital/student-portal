import React, { useState } from "react";
import logo from "../assets/Logo/logo.png";
import { Lock, Mail, Eye, EyeOff, ArrowRight, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Theme color constant
  const brandColor = "#054676";

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate login delay
    setTimeout(() => setIsLoading(false), 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col justify-center items-center p-6">
      <div className="w-full max-w-md">
        {/* Brand Logo & Header */}
        <div className="flex justify-center mb-10">
          <img src={logo} alt="" className="h-24" />
        </div>

        {/* Sign In Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 p-8">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-slate-800">
              Student Sign In
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Enter your credentials to access your portal
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                Student Email / ID
              </label>
              <div className="relative group">
                <div
                  className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:transition-colors"
                  style={{ color: "inherit" }} // Controlled by group-focus below
                >
                  <Mail className="w-5 h-5 group-focus-within:text-[#054676]" />
                </div>
                <input
                  type="text"
                  placeholder="alex.rivera@university.edu"
                  className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-slate-100 transition-all outline-none text-sm font-medium"
                  style={{
                    "--tw-ring-color": "#05467620",
                    borderColor: "inherit",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = brandColor)}
                  onBlur={(e) => (e.target.style.borderColor = "#f1f5f9")}
                  required
                />
              </div>
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
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 transition-colors">
                  <Lock className="w-5 h-5 group-focus-within:text-[#054676]" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-12 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-slate-100 transition-all outline-none text-sm font-medium"
                  onFocus={(e) => (e.target.style.borderColor = brandColor)}
                  onBlur={(e) => (e.target.style.borderColor = "#f1f5f9")}
                  required
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
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full text-white font-bold py-4 rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2 group disabled:opacity-70 active:scale-[0.98]"
              style={{
                backgroundColor: brandColor,
                boxShadow: `0 10px 15px -3px ${brandColor}20`,
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

        {/* Bottom Help */}
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

      {/* Footer Branding */}
      <div className="mt-auto pt-8">
        <p className="text-[10px] text-slate-300 font-bold uppercase tracking-[0.3em]">
          Secure Student Portal • © 2026
        </p>
      </div>
    </div>
  );
}
