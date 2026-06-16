const asyncHandler = require('express-async-handler');
const File = require('../models/File');
const FileStatusHistory = require('../models/FileStatusHistory');
const { logInfo } = require('../utils/logger');

// Valid status transitions
const validTransitions = {
  Submitted: ['Under Review', 'Rejected'],
  'Under Review': ['Approved', 'Rejected', 'Returned'],
  Returned: ['Under Review'],
  Approved: [],
  Rejected: [],
};

// @desc    Update file status (Admin only)
// @route   PUT /api/approval/:id
// @access  Private/Admin

const updateStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { action, remarks } = req.body;

  const actionStatusMap = {
    review: 'Under Review',
    approve: 'Approved',
    reject: 'Rejected',
    return: 'Returned',
  };

  const newStatus = actionStatusMap[action];
  if (!newStatus) {
    res.status(400);
    throw new Error(`Invalid action "${action}". Use: review, approve, reject, return`);
  }

  if (action === 'reject' && (!remarks || remarks.trim() === '')) {
    res.status(400);
    throw new Error('Remarks are mandatory when rejecting a file');
  }

  if (action === 'return' && (!remarks || remarks.trim() === '')) {
    res.status(400);
    throw new Error('Remarks are mandatory when returning a file for changes');
  }

  const file = await File.findById(id);
  if (!file) {
    res.status(404);
    throw new Error('File not found');
  }

  const allowed = validTransitions[file.status] || [];
  if (!allowed.includes(newStatus)) {
    res.status(400);
    throw new Error(
      `Cannot transition from "${file.status}" to "${newStatus}". Valid transitions: ${allowed.join(', ') || 'None'}`
    );
  }

  const previousStatus = file.status;

  // Update file inline history
  file.status = newStatus;
  file.remarks = remarks || '';
  file.approvalHistory.push({
    action: action === 'review' ? 'under_review' : action === 'return' ? 'returned' : action + 'd',
    actionBy: req.user._id,
    actionByName: req.user.name,
    remarks: remarks || '',
  });

  await file.save();

  // ✅ Write to separate file_status_history collection (audit trail)
  await FileStatusHistory.create({
    fileId: file._id,
    fileTitle: file.title,
    action: newStatus,
    previousStatus,
    newStatus,
    performedBy: req.user._id,
    performedByName: req.user.name,
    performedByRole: req.user.role,
    remarks: remarks || '',
    timestamp: new Date(),
  });

  await file.populate('createdBy', 'name email department');

  logInfo(`File "${file.title}" status changed: ${previousStatus} → ${newStatus} by ${req.user.name}`);

  res.json({
    success: true,
    message: `File status updated to "${newStatus}" successfully`,
    data: file,
  });
});

// @desc    Get all files pending for approval
// @route   GET /api/approval/pending
// @access  Private/Admin
const getPendingFiles = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, department, priority } = req.query;
  let query = { status: { $in: ['Submitted', 'Under Review', 'Returned'] } };

  if (department) query.department = department;
  if (priority) query.priority = priority;

  const skip = (Number(page) - 1) * Number(limit);

  const [files, total] = await Promise.all([
    File.find(query)
      .populate('createdBy', 'name email department')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    File.countDocuments(query),
  ]);

  res.json({
    success: true,
    data: files,
    pagination: {
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      limit: Number(limit),
    },
  });
});

module.exports = { updateStatus, getPendingFiles };
