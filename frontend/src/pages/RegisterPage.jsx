import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiFolder } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { registerUser } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import InputField from '../components/InputField';
import logoImg from '../assets/logo.png';

const DEPARTMENTS = [
  'HR', 'Finance', 'IT', 'Operations', 'Legal',
  'Procurement', 'Administration', 'Engineering', 'General',
];

const RegisterPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'employee',
    department: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name || form.name.trim().length < 2)
      e.name = 'Name must be at least 2 characters';
    if (!form.email) e.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Invalid email format';
    if (!form.password || form.password.length < 6)
      e.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirmPassword)
      e.confirmPassword = 'Passwords do not match';
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
      // Send full form including confirmPassword — backend handles it gracefully
      const res = await registerUser(form);
      login(res.data, res.data.token);
      toast.success('Account created successfully! Welcome 🎉');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-900 via-primary-800 to-indigo-900 p-4">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="text-center mb-8 animate-fade-in">
          <img src={logoImg} alt="Logo" className="w-16 h-16 object-contain rounded-2xl mx-auto mb-4 shadow-lg" />
          <h1 className="text-2xl font-bold text-white">Create Account</h1>
          <p className="text-primary-200 mt-1 text-sm">Join the Digital File System</p>
        </div>

        <div className="bg-white dark:bg-dark-card rounded-2xl shadow-2xl p-8 animate-slide-in">
          <form onSubmit={handleSubmit} noValidate>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
              <InputField
                label="Full Name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="John Doe"
                error={errors.name}
                required
              />
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
              <InputField
                label="Password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Min 6 characters"
                error={errors.password}
                required
              />
              <InputField
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Repeat password"
                error={errors.confirmPassword}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
              <div className="mb-4">
                <label className="label">Role</label>
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="input-field cursor-pointer"
                >
                  <option value="employee">Employee</option>
                  <option value="admin">Admin / Officer</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="label">Department</label>
                <select
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                  className="input-field cursor-pointer"
                >
                  <option value="">Select Department</option>
                  {DEPARTMENTS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
                {errors.department && (
                  <p className="mt-1 text-xs text-red-500">{errors.department}</p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-base mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating Account...
                </span>
              ) : (
                'Create Account'
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
