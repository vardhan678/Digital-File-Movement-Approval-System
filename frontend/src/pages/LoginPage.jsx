/**
 * LoginPage.jsx
 *
 * Changes from original:
 *  ✅ Removed react-hook-form and zodResolver
 *  ✅ Removed Zod schema
 *  ✅ Plain useState form + plain JS validateLogin() from utils/validators.js
 *  ✅ useLoginMutation from RTK Query (replaces loginThunk dispatch)
 *  ✅ Errors displayed inline below each field
 */
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLoginMutation } from '../features/auth/authApi';
import { validateLogin } from '../utils/validators';
import {
  FiEye, FiEyeOff, FiMail, FiLock, FiShield, FiArrowRight, FiUsers, FiInfo,
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import dmsIllustration from '../assets/dms_illustration.png';

const LoginPage = () => {
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();

  // ── Form state ────────────────────────────────────────
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showPwd, setShowPwd] = useState(false);

  // ── Handlers ─────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear the field error as user types
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ── Plain JS Validation ───────────────────────────
    const validationErrors = validateLogin(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const result = await login({ email: form.email, password: form.password }).unwrap();
      // result.data = { _id, name, email, role, department }
      // authApi.onQueryStarted has already dispatched setCredentials(result.data)
      toast.success(`Welcome back, ${result.data?.name || 'User'}!`);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err?.data?.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-50 dark:bg-dark-300">

      {/* Left: Illustration Panel */}
      <div className="hidden lg:flex w-[55%] bg-[#081a3d] justify-center items-center p-12 select-none relative overflow-hidden min-h-screen">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <img
          src={dmsIllustration}
          alt="Document Management System"
          className="w-full max-w-2xl object-contain z-10 drop-shadow-[0_20px_50px_rgba(8,112,184,0.18)] animate-fade-in"
        />
      </div>

      {/* Right: Login Form */}
      <div className="w-full lg:w-[45%] flex flex-col justify-center items-center p-8 sm:p-12 dark:bg-[#0b0f19] bg-white min-h-screen relative">
        <div className="w-full max-w-md flex flex-col">

          <div className="self-start inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30 mb-4">
            <FiShield className="w-3.5 h-3.5" />
            Secure Access Portal
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-none">
            Welcome Back
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-3 mb-8 leading-relaxed">
            Sign in to access your dashboard and track file requests.
          </p>

          <form onSubmit={handleSubmit} noValidate className="space-y-5">

            {/* ── Email Field ─────────────────────────────── */}
            <div>
              <label
                htmlFor="login-email"
                className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  id="login-email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="name@email.com"
                  className={`w-full pl-12 pr-4 py-3.5 border rounded-xl bg-slate-50/50 dark:bg-slate-900/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all text-sm ${
                    errors.email ? 'border-red-400 dark:border-red-500' : 'border-slate-200 dark:border-slate-800'
                  }`}
                />
              </div>
              {/* ── Inline validation error ─────────────── */}
              {errors.email && (
                <p className="mt-1.5 text-xs text-red-500 font-medium animate-fade-in flex items-center gap-1">
                  {errors.email}
                </p>
              )}
            </div>

            {/* ── Password Field ──────────────────────────── */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label
                  htmlFor="login-password"
                  className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest"
                >
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => toast.success('Password reset feature coming soon!')}
                  className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer select-none"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  id="login-password"
                  name="password"
                  type={showPwd ? 'text' : 'password'}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className={`w-full pl-12 pr-12 py-3.5 border rounded-xl bg-slate-50/50 dark:bg-slate-900/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all text-sm ${
                    errors.password ? 'border-red-400 dark:border-red-500' : 'border-slate-200 dark:border-slate-800'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPwd ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                </button>
              </div>
              {/* ── Inline validation error ─────────────── */}
              {errors.password && (
                <p className="mt-1.5 text-xs text-red-500 font-medium animate-fade-in">
                  {errors.password}
                </p>
              )}
            </div>

            {/* ── Submit Button ───────────────────────────── */}
            <button
              id="login-submit-btn"
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#0a1f54] hover:bg-[#0f2d77] active:scale-[0.98] text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-blue-900/10 hover:shadow-xl hover:shadow-blue-900/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:pointer-events-none"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing In...
                </>
              ) : (
                <>
                  Sign In to Portal
                  <FiArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Security Banner */}
          <div className="flex items-center justify-center gap-2 mt-6 text-xs text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/20 py-2.5 px-4 rounded-full border border-emerald-500/15">
            <FiShield className="w-3.5 h-3.5 flex-shrink-0" />
            JWT Secured · Session Tracked · Rate Limited
          </div>

          {/* Register link */}
          <p className="text-center mt-8 text-sm text-slate-500 dark:text-slate-400">
            New to the portal?{' '}
            <Link to="/register" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline inline-flex items-center gap-1 group">
              Create your account
              <FiArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </p>



        </div>
      </div>
    </div>
  );
};

export default LoginPage;
