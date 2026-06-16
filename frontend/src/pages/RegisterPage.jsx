/**
 * RegisterPage.jsx
 *
 * Changes from original:
 *  ✅ Removed react-hook-form and zodResolver
 *  ✅ Removed Zod schema (registerSchema)
 *  ✅ Plain useState form + plain JS validateRegister() from utils/validators.js
 *  ✅ useRegisterMutation from RTK Query (replaces direct registerUser service call)
 *  ✅ useLoginMutation for auto-login after registration
 *  ✅ Show/hide password toggles
 *  ✅ Errors displayed inline below each field
 */
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRegisterMutation, useLoginMutation } from '../features/auth/authApi';
import { validateRegister } from '../utils/validators';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import toast from 'react-hot-toast';
import logoImg from '../assets/logo.png';

const DEPARTMENTS = [
  'HR', 'Finance', 'IT', 'Operations', 'Legal',
  'Procurement', 'Administration', 'Engineering', 'General',
];

const RegisterPage = () => {
  const navigate = useNavigate();
  const [register, { isLoading: isRegistering }] = useRegisterMutation();
  const [login, { isLoading: isLoggingIn }] = useLoginMutation();

  const isLoading = isRegistering || isLoggingIn;

  // ── Form state ────────────────────────────────────────
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    department: '',
  });
  const [errors, setErrors] = useState({});
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);

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
    const validationErrors = validateRegister(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      // Step 1: Register the user
      await register({
        name: form.name,
        email: form.email,
        password: form.password,
        confirmPassword: form.confirmPassword,
        department: form.department || 'General',
        // ⛔ No role field — backend always forces 'employee'
      }).unwrap();

      // Step 2: Auto-login after successful registration
      const loginResult = await login({
        email: form.email,
        password: form.password,
      }).unwrap();

      toast.success(`Account created! Welcome, ${loginResult.data?.name || 'User'} 🎉`);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-900 via-primary-800 to-indigo-900 p-4">
      <div className="w-full max-w-lg">

        {/* Logo */}
        <div className="text-center mb-8 animate-fade-in">
          <img src={logoImg} alt="Logo" className="w-16 h-16 object-contain rounded-2xl mx-auto mb-4 shadow-lg" />
          <h1 className="text-2xl font-bold text-white">Create Employee Account</h1>
          <p className="text-primary-200 mt-1 text-sm">Register to access the Digital File System</p>
        </div>

        <div className="bg-white dark:bg-dark-card rounded-2xl shadow-2xl p-8 animate-slide-in">
          <form onSubmit={handleSubmit} noValidate>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">

              {/* ── Full Name ──────────────────────────────── */}
              <div className="mb-4">
                <label htmlFor="reg-name" className="label">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="reg-name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className={`input-field ${errors.name ? 'border-red-400' : ''}`}
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-red-500 animate-fade-in">{errors.name}</p>
                )}
              </div>

              {/* ── Email ──────────────────────────────────── */}
              <div className="mb-4">
                <label htmlFor="reg-email" className="label">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  id="reg-email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className={`input-field ${errors.email ? 'border-red-400' : ''}`}
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-500 animate-fade-in">{errors.email}</p>
                )}
              </div>

              {/* ── Password ───────────────────────────────── */}
              <div className="mb-4">
                <label htmlFor="reg-password" className="label">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="reg-password"
                    name="password"
                    type={showPwd ? 'text' : 'password'}
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Min 8 chars, 1 uppercase, 1 number"
                    className={`input-field pr-10 ${errors.password ? 'border-red-400' : ''}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd(!showPwd)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPwd ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-xs text-red-500 animate-fade-in">{errors.password}</p>
                )}
              </div>

              {/* ── Confirm Password ───────────────────────── */}
              <div className="mb-4">
                <label htmlFor="reg-confirm-password" className="label">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="reg-confirm-password"
                    name="confirmPassword"
                    type={showConfirmPwd ? 'text' : 'password'}
                    value={form.confirmPassword}
                    onChange={handleChange}
                    placeholder="Repeat password"
                    className={`input-field pr-10 ${errors.confirmPassword ? 'border-red-400' : ''}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPwd(!showConfirmPwd)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPwd ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-xs text-red-500 animate-fade-in">{errors.confirmPassword}</p>
                )}
              </div>
            </div>

            {/* ── Department ─────────────────────────────── */}
            <div className="mb-4">
              <label htmlFor="reg-department" className="label">Department</label>
              <select
                id="reg-department"
                name="department"
                value={form.department}
                onChange={handleChange}
                className="input-field cursor-pointer"
              >
                <option value="">Select Department (optional)</option>
                {DEPARTMENTS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* Role notice */}
            <div className="mb-4 px-3 py-2 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 rounded-lg">
              <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                🔒 All new registrations are created as <strong>Employee</strong> accounts.
                Admin accounts are provisioned separately by the system administrator.
              </p>
            </div>

            {/* ── Submit ─────────────────────────────────── */}
            <button
              id="register-submit-btn"
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full py-3 text-base mt-2"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating Account...
                </span>
              ) : (
                'Create Employee Account'
              )}
            </button>
          </form>

          <p className="text-center mt-6 text-sm text-gray-500 dark:text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 font-semibold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
