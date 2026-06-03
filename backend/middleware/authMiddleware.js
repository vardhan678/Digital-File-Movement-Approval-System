const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

// Protect routes — verify JWT
const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        res.status(401);
        throw new Error('User not found — token invalid');
      }

      if (!req.user.isActive) {
        res.status(401);
        throw new Error('Account has been deactivated');
      }

      next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        res.status(401);
        throw new Error('Token expired — please login again');
      }
      res.status(401);
      throw new Error('Not authorized — invalid token');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized — no token provided');
  }
});

// Role-based authorization
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      res.status(403);
      throw new Error(
        `Role '${req.user.role}' is not authorized to access this resource`
      );
    }
    next();
  };
};

module.exports = { protect, authorizeRoles };
