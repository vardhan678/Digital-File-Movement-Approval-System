const asyncHandler = require('express-async-handler');
const File = require('../models/File');
const User = require('../models/User');

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Private
const getStats = asyncHandler(async (req, res) => {
  let matchQuery = {};

  // Employees only see their own stats
  if (req.user.role === 'employee') {
    matchQuery.createdBy = req.user._id;
  }

  const [statusCounts, departmentCounts, categoryCounts, priorityCounts, recentFiles, totalUsers] =
    await Promise.all([
      // Count by status
      File.aggregate([
        { $match: matchQuery },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),

      // Count by department
      File.aggregate([
        { $match: matchQuery },
        { $group: { _id: '$department', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),

      // Count by category
      File.aggregate([
        { $match: matchQuery },
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),

      // Count by priority
      File.aggregate([
        { $match: matchQuery },
        { $group: { _id: '$priority', count: { $sum: 1 } } },
      ]),

      // Recent 5 files
      File.find(matchQuery)
        .populate('createdBy', 'name')
        .sort({ createdAt: -1 })
        .limit(5)
        .select('title status priority department createdAt'),

      // Total users (admin only)
      req.user.role === 'admin' ? User.countDocuments() : Promise.resolve(null),
    ]);

  // Build status summary object
  const statusSummary = {
    total: 0,
    submitted: 0,
    underReview: 0,
    approved: 0,
    rejected: 0,
    returned: 0,
  };

  statusCounts.forEach(({ _id, count }) => {
    statusSummary.total += count;
    if (_id === 'Submitted') statusSummary.submitted = count;
    if (_id === 'Under Review') statusSummary.underReview = count;
    if (_id === 'Approved') statusSummary.approved = count;
    if (_id === 'Rejected') statusSummary.rejected = count;
    if (_id === 'Returned') statusSummary.returned = count;
  });

  res.json({
    success: true,
    data: {
      statusSummary,
      departmentCounts,
      categoryCounts,
      priorityCounts,
      recentFiles,
      totalUsers,
    },
  });
});

module.exports = { getStats };
