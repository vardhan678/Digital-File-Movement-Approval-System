const mongoose = require('mongoose');

/**
 * user_sessions collection
 * Tracks every login and logout event with device & IP info
 */
const userSessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    sessionToken: {
      type: String,
      required: true, // stores JWT (or unique identifier) so we can match on logout
    },
    loginTime: {
      type: Date,
      default: Date.now,
    },
    logoutTime: {
      type: Date,
      default: null,
    },
    ipAddress: {
      type: String,
      default: 'unknown',
    },
    deviceInfo: {
      type: String,
      default: 'unknown',
    },
    sessionDuration: {
      type: String,
      default: null, // e.g. "2 Hours 30 Minutes", set on logout
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    collection: 'user_sessions',
  }
);

// Indexes for performance
userSessionSchema.index({ userId: 1 });
userSessionSchema.index({ loginTime: -1 });
userSessionSchema.index({ sessionToken: 1 });
userSessionSchema.index({ isActive: 1 });

module.exports = mongoose.model('UserSession', userSessionSchema);
