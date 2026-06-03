const asyncHandler = require('express-async-handler');
const File = require('../models/File');

// @desc    Create a new file request
// @route   POST /api/files
// @access  Private (Employee)
const createFile = asyncHandler(async (req, res) => {
  const { title, description, department, category, priority } = req.body;

  if (!title || !description || !department || !category) {
    res.status(400);
    throw new Error('Title, description, department, and category are required');
  }

  // Handle optional file attachment
  let attachment = {};
  if (req.file) {
    attachment = {
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
    };
  }

  const file = await File.create({
    title,
    description,
    department,
    category,
    priority: priority || 'Medium',
    createdBy: req.user._id,
    attachment,
    approvalHistory: [
      {
        action: 'submitted',
        actionBy: req.user._id,
        actionByName: req.user.name,
        remarks: 'File submitted for approval',
      },
    ],
  });

  await file.populate('createdBy', 'name email department');

  res.status(201).json({
    success: true,
    message: 'File request created successfully',
    data: file,
  });
});

// @desc    Get all files (with search, filter, pagination)
// @route   GET /api/files
// @access  Private
const getFiles = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    search,
    status,
    department,
    priority,
    sortBy = 'createdAt',
    order = 'desc',
  } = req.query;

  let query = {};

  // Employees only see their own files
  if (req.user.role === 'employee') {
    query.createdBy = req.user._id;
  }

  // Filters
  if (status) query.status = status;
  if (department) query.department = department;
  if (priority) query.priority = priority;

  // Text search
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);
  const sortOrder = order === 'asc' ? 1 : -1;

  let sortObj = {};
  if (sortBy === 'priority') {
    sortObj = { priority: sortOrder };
  } else {
    sortObj[sortBy] = sortOrder;
  }

  const [files, total] = await Promise.all([
    File.find(query)
      .populate('createdBy', 'name email department')
      .populate('assignedTo', 'name email')
      .sort(sortObj)
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

// @desc    Get single file by ID
// @route   GET /api/files/:id
// @access  Private
const getFileById = asyncHandler(async (req, res) => {
  const file = await File.findById(req.params.id)
    .populate('createdBy', 'name email department')
    .populate('assignedTo', 'name email');

  if (!file) {
    res.status(404);
    throw new Error('File not found');
  }

  // Employees can only view their own files
  if (
    req.user.role === 'employee' &&
    file.createdBy._id.toString() !== req.user._id.toString()
  ) {
    res.status(403);
    throw new Error('Not authorized to view this file');
  }

  res.json({ success: true, data: file });
});

// @desc    Update file request
// @route   PUT /api/files/:id
// @access  Private (Owner only, only if Submitted or Returned)
const updateFile = asyncHandler(async (req, res) => {
  const file = await File.findById(req.params.id);

  if (!file) {
    res.status(404);
    throw new Error('File not found');
  }

  // Only owner can edit
  if (file.createdBy.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to edit this file');
  }

  // Only editable if Submitted or Returned
  if (!['Submitted', 'Returned'].includes(file.status)) {
    res.status(400);
    throw new Error(
      `Cannot edit a file with status "${file.status}". Only Submitted or Returned files can be edited.`
    );
  }

  const { title, description, department, category, priority } = req.body;

  file.title = title || file.title;
  file.description = description || file.description;
  file.department = department || file.department;
  file.category = category || file.category;
  file.priority = priority || file.priority;

  // If returning to submitted after being returned for changes
  if (file.status === 'Returned') {
    file.status = 'Submitted';
    file.approvalHistory.push({
      action: 'submitted',
      actionBy: req.user._id,
      actionByName: req.user.name,
      remarks: 'File resubmitted after changes',
    });
  }

  const updatedFile = await file.save();
  await updatedFile.populate('createdBy', 'name email department');

  res.json({
    success: true,
    message: 'File updated successfully',
    data: updatedFile,
  });
});

// @desc    Delete file request
// @route   DELETE /api/files/:id
// @access  Private (Owner or Admin)
const deleteFile = asyncHandler(async (req, res) => {
  const file = await File.findById(req.params.id);

  if (!file) {
    res.status(404);
    throw new Error('File not found');
  }

  // Admin can delete any; employee can only delete their own
  if (
    req.user.role !== 'admin' &&
    file.createdBy.toString() !== req.user._id.toString()
  ) {
    res.status(403);
    throw new Error('Not authorized to delete this file');
  }

  await file.deleteOne();

  res.json({ success: true, message: 'File deleted successfully' });
});

module.exports = { createFile, getFiles, getFileById, updateFile, deleteFile };
