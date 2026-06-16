const mongoose = require('mongoose');

/**
 * file_status_history collection
 * Tracks every status change on a file as a separate audit document
 */
const fileStatusHistorySchema = new mongoose.Schema(
  {
    fileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'File',
      required: true,
    },
    fileTitle: {
      type: String,
      default: '',
    },
    action: {
      type: String,
      enum: ['Submitted', 'Under Review', 'Approved', 'Rejected', 'Returned'],
      required: true,
    },
    previousStatus: {
      type: String,
      default: null,
    },
    newStatus: {
      type: String,
      required: true,
    },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    performedByName: {
      type: String,
      default: '',
    },
    performedByRole: {
      type: String,
      default: '',
    },
    remarks: {
      type: String,
      default: '',
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
    collection: 'file_status_history',
  }
);

// Indexes for performance
fileStatusHistorySchema.index({ fileId: 1 });
fileStatusHistorySchema.index({ timestamp: -1 });
fileStatusHistorySchema.index({ performedBy: 1 });
fileStatusHistorySchema.index({ action: 1 });

module.exports = mongoose.model('FileStatusHistory', fileStatusHistorySchema);
