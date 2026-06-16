const asyncHandler = require('express-async-handler');
const File = require('../models/File');
const User = require('../models/User');
const UserSession = require('../models/UserSession');

// @desc    Get comprehensive dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Private
const getStats = asyncHandler(async (req, res) => {
  const isAdmin = req.user.role === 'admin';
  let matchQuery = {};

  // Employees only see their own stats
  if (!isAdmin) {
    matchQuery.createdBy = req.user._id;
  }

  // Date range: last 6 months for trend charts
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const [
    statusCounts,
    departmentCounts,
    categoryCounts,
    priorityCounts,
    recentFiles,
    totalUsers,
    activeUsers,
    monthlyUploadTrend,
    userActivityTrend,
  ] = await Promise.all([
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
      .select('title status priority department createdAt category'),

    // Total users count (admin only)
    isAdmin ? User.countDocuments() : Promise.resolve(null),

    // Active users — logged in within last 30 days (admin only)
    isAdmin
      ? User.countDocuments({
          lastLogin: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
        })
      : Promise.resolve(null),

    // Monthly upload trend — last 6 months
    File.aggregate([
      {
        $match: {
          ...matchQuery,
          createdAt: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]),

    // User activity trend — logins per month (admin only)
    isAdmin
      ? UserSession.aggregate([
          {
            $match: {
              loginTime: { $gte: sixMonthsAgo },
            },
          },
          {
            $group: {
              _id: {
                year: { $year: '$loginTime' },
                month: { $month: '$loginTime' },
              },
              logins: { $sum: 1 },
              uniqueUsers: { $addToSet: '$userId' },
            },
          },
          {
            $project: {
              _id: 1,
              logins: 1,
              uniqueUsers: { $size: '$uniqueUsers' },
            },
          },
          { $sort: { '_id.year': 1, '_id.month': 1 } },
        ])
      : Promise.resolve([]),
  ]);

  // Build status summary
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

  // Format monthly trend data for chart consumption
  const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const formattedUploadTrend = monthlyUploadTrend.map((item) => ({
    month: `${MONTH_NAMES[item._id.month - 1]} ${item._id.year}`,
    uploads: item.count,
  }));

  const formattedActivityTrend = userActivityTrend.map((item) => ({
    month: `${MONTH_NAMES[item._id.month - 1]} ${item._id.year}`,
    logins: item.logins,
    uniqueUsers: item.uniqueUsers,
  }));

  res.json({
    success: true,
    data: {
      statusSummary,
      departmentCounts,
      categoryCounts,
      priorityCounts,
      recentFiles,
      totalUsers,
      activeUsers,
      monthlyUploadTrend: formattedUploadTrend,
      userActivityTrend: formattedActivityTrend,
    },
  });
});

module.exports = { getStats };
