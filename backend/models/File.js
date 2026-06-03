const mongoose = require('mongoose');

// Sub-schema for approval history entries
const approvalHistorySchema = new mongoose.Schema(
  {
    action: {
      type: String,
      enum: ['submitted', 'under_review', 'approved', 'rejected', 'returned'],
      required: true,
    },
    actionBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    actionByName: { type: String },
    remarks: { type: String, default: '' },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false }
);

const fileSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'File title is required'],
      trim: true,
      minlength: [5, 'Title must be at least 5 characters'],
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      minlength: [20, 'Description must be at least 20 characters'],
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      enum: [
        'HR',
        'Finance',
        'IT',
        'Operations',
        'Legal',
        'Procurement',
        'Administration',
        'Engineering',
      ],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'Policy',
        'Invoice',
        'Contract',
        'Report',
        'Request',
        'Complaint',
        'Proposal',
        'Other',
      ],
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Urgent'],
      default: 'Medium',
    },
    status: {
      type: String,
      enum: ['Submitted', 'Under Review', 'Approved', 'Rejected', 'Returned'],
      default: 'Submitted',
    },
    remarks: {
      type: String,
      default: '',
    },
    attachment: {
      filename: { type: String, default: '' },
      originalName: { type: String, default: '' },
      mimetype: { type: String, default: '' },
      size: { type: Number, default: 0 },
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    approvalHistory: [approvalHistorySchema],
  },
  {
    timestamps: true,
  }
);

// Index for search and filtering
fileSchema.index({ title: 'text', description: 'text' });
fileSchema.index({ status: 1, department: 1, priority: 1 });
fileSchema.index({ createdBy: 1 });

module.exports = mongoose.model('File', fileSchema);
