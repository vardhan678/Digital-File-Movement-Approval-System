import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiFolder, FiEye, FiEyeOff } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { loginUser } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import InputField from '../components/InputField';
import logoImg from '../assets/logo.png';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.email) e.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Invalid email format';
    if (!form.password) e.password = 'Password is required';
    return e;
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      const res = await loginUser(form);
      login(res.data, res.data.token);
      toast.success(`Welcome back, ${res.data.name}!`);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-900 via-primary-800 to-indigo-900 p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8 animate-fade-in">
          <img src={logoImg} alt="Logo" className="w-16 h-16 object-contain rounded-2xl mx-auto mb-4 shadow-lg" />
          <h1 className="text-2xl font-bold text-white">Digital File System</h1>
          <p className="text-primary-200 mt-1 text-sm">Sign in to your account</p>
        </div>

        <div className="bg-white dark:bg-dark-card rounded-2xl shadow-2xl p-8 animate-slide-in">
          <form onSubmit={handleSubmit} noValidate>
            <InputField
              label="Email Address"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              error={errors.email}
              required
            />

            <div className="mb-4">
              <label className="label">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPwd ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className={`input-field pr-10 ${errors.password ? 'border-red-400 focus:ring-red-400' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPwd ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-500">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full mt-2 py-3 text-base"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing In...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <p className="text-center mt-6 text-sm text-gray-500 dark:text-gray-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-600 font-semibold hover:underline">
              Register here
            </Link>
          </p>

          {/* Demo credentials */}
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
            <p className="text-xs font-semibold text-blue-700 dark:text-blue-400 mb-1">
              Demo Credentials (after seeding)
            </p>
            <p className="text-xs text-blue-600 dark:text-blue-400">
              Admin: admin@digitalfile.com / Admin@123
            </p>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-0.5">
              Employee: ravi@digitalfile.com / Employee@123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
