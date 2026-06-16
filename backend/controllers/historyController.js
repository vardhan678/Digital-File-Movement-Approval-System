const asyncHandler = require('express-async-handler');
const FileStatusHistory = require('../models/FileStatusHistory');
const UserSession = require('../models/UserSession');
const User = require('../models/User');

// @desc    Get complete file status history (audit trail)
// @route   GET /api/history/:fileId
// @access  Private/Admin
const getFileHistory = asyncHandler(async (req, res) => {
  const { fileId } = req.params;

  const history = await FileStatusHistory.find({ fileId })
    .populate('performedBy', 'name email role')
    .sort({ timestamp: 1 }); // chronological order

  if (!history.length) {
    return res.json({
      success: true,
      message: 'No history found for this file',
      data: [],
    });
  }

  res.json({
    success: true,
    count: history.length,
    data: history,
  });
});

// @desc    Get all user sessions (login/logout history)
// @route   GET /api/sessions
// @access  Private/Admin
const getSessions = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    userId,
    startDate,
    endDate,
  } = req.query;

  let query = {};
  if (userId) query.userId = userId;
  if (startDate || endDate) {
    query.loginTime = {};
    if (startDate) query.loginTime.$gte = new Date(startDate);
    if (endDate) query.loginTime.$lte = new Date(endDate);
  }

  const skip = (Number(page) - 1) * Number(limit);

  const [sessions, total] = await Promise.all([
    UserSession.find(query)
      .populate('userId', 'name email role department')
      .sort({ loginTime: -1 })
      .skip(skip)
      .limit(Number(limit)),
    UserSession.countDocuments(query),
  ]);

  res.json({
    success: true,
    data: sessions,
    pagination: {
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      limit: Number(limit),
    },
  });
});

module.exports = { getFileHistory, getSessions };
