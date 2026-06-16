const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const UserSession = require('../models/UserSession');
const generateToken = require('../utils/generateToken');
const { logInfo } = require('../utils/logger');

// ─────────────────────────────────────────────
// Helper: parse device info from user-agent
// ─────────────────────────────────────────────
const getDeviceInfo = (req) => {
  const ua = req.headers['user-agent'] || 'unknown';
  if (ua.includes('Postman')) return 'Postman Client';
  if (ua.includes('Mobile')) return 'Mobile Browser';
  if (ua.includes('Chrome')) return 'Chrome Browser';
  if (ua.includes('Firefox')) return 'Firefox Browser';
  if (ua.includes('Safari')) return 'Safari Browser';
  return ua.substring(0, 80);
};

// ─────────────────────────────────────────────
// Helper: get client IP
// ─────────────────────────────────────────────
const getClientIP = (req) => {
  return (
    req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    req.connection?.remoteAddress ||
    req.socket?.remoteAddress ||
    'unknown'
  );
};

// ─────────────────────────────────────────────
// Helper: format session duration
// ─────────────────────────────────────────────
const formatDuration = (loginTime, logoutTime) => {
  const diffMs = new Date(logoutTime) - new Date(loginTime);
  const totalMinutes = Math.floor(diffMs / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours === 0) return `${minutes} Minutes`;
  if (minutes === 0) return `${hours} Hours`;
  return `${hours} Hours ${minutes} Minutes`;
};

// ─────────────────────────────────────────────
// @desc    Register new user (Employee ONLY)
// @route   POST /api/auth/register
// @access  Public
// ─────────────────────────────────────────────
const register = asyncHandler(async (req, res) => {
  const { name, email, password, department } = req.body;
  // ⛔ SECURITY: role is ALWAYS forced to 'employee' — admin must be created in DB manually
  const role = 'employee';

  const userExists = await User.findOne({ email: email.toLowerCase() });
  if (userExists) {
    res.status(400);
    throw new Error('An account with this email already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
    role,
    department: department || 'General',
    lastLogin: new Date(),
  });

  const token = generateToken(user._id);

  // Create session record
  await UserSession.create({
    userId: user._id,
    sessionToken: token,
    loginTime: new Date(),
    ipAddress: getClientIP(req),
    deviceInfo: getDeviceInfo(req),
  });

  // ✅ Set HttpOnly cookie with secure flags
  res.cookie('authToken', token, {
    httpOnly: true,           // ⛔ Cannot be accessed by JavaScript (prevents XSS attacks)
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    sameSite: 'strict',       // ⛔ Prevents CSRF attacks
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days (match JWT_EXPIRES_IN)
    path: '/',                // Cookie available on all routes
  });

  logInfo(`New employee registered: ${email}`);

  res.status(201).json({
    success: true,
    message: 'Account created successfully',
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      // ⛔ Token NOT returned in response anymore (stored in HttpOnly cookie)
    },
  });
});

// ─────────────────────────────────────────────
// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
// ─────────────────────────────────────────────
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  if (!user.isActive) {
    res.status(401);
    throw new Error('Your account has been deactivated. Contact admin.');
  }

  const token = generateToken(user._id);

  // Update lastLogin
  await User.findByIdAndUpdate(user._id, { lastLogin: new Date() });

  // Create session record
  await UserSession.create({
    userId: user._id,
    sessionToken: token,
    loginTime: new Date(),
    ipAddress: getClientIP(req),
    deviceInfo: getDeviceInfo(req),
  });

  // ✅ Set HttpOnly cookie with secure flags
  res.cookie('authToken', token, {
    httpOnly: true,           // ⛔ Cannot be accessed by JavaScript (prevents XSS attacks)
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    sameSite: 'strict',       // ⛔ Prevents CSRF attacks
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days (match JWT_EXPIRES_IN)
    path: '/',                // Cookie available on all routes
  });

  logInfo(`User logged in: ${email} (${user.role})`);

  res.json({
    success: true,
    message: 'Login successful',
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      // ⛔ Token NOT returned in response anymore (stored in HttpOnly cookie)
    },
  });
});

// ─────────────────────────────────────────────
// @desc    Logout user — invalidate session and clear cookie
// @route   POST /api/auth/logout
// @access  Private
// ─────────────────────────────────────────────

const logout = asyncHandler(async (req, res) => {
  // Extract the token from the HttpOnly cookie
  const token = req.cookies.authToken;

  if (token) {
    const logoutTime = new Date();

    // Find and update the active session
    const session = await UserSession.findOne({
      sessionToken: token,
      isActive: true,
    });

    if (session) {
      session.logoutTime = logoutTime;
      session.isActive = false;
      session.sessionDuration = formatDuration(session.loginTime, logoutTime);
      await session.save();
    }
  }

  // ✅ Clear HttpOnly cookie by setting maxAge to 0
  res.clearCookie('authToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
  });

  logInfo(`User logged out: ${req.user?.email}`);

  res.json({
    success: true,
    message: 'Logged out successfully',
  });
});

// ─────────────────────────────────────────────
// @desc    Get current user profile (from DB — NOT from localStorage/Redux cache)
// @route   GET /api/auth/me
// @access  Private
// ─────────────────────────────────────────────
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  res.json({
    success: true,
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      isActive: user.isActive,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt,
    },
  });
});

module.exports = { register, login, logout, getMe };
