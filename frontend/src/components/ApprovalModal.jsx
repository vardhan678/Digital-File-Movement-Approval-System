/**
 * ApprovalModal.jsx
 *
 * Changes from original:
 *  ✅ Removed direct import of performAction service function
 *  ✅ Uses usePerformActionMutation from RTK Query
 *  ✅ Cache automatically invalidated on success (no manual refetch needed)
 *  ✅ isLoading state comes from RTK Query mutation state
 *  ✅ Action buttons are filtered based on the file's current status
 *     so invalid transitions (e.g. Reject on an Approved file) are hidden
 */
import React, { useState, useMemo } from 'react';
import { FiX, FiCheckCircle, FiXCircle, FiRotateCcw, FiClock } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { usePerformActionMutation } from '../features/approval/approvalApi';

// Mirrors the backend validTransitions — maps current status → allowed action keys
const allowedActionsForStatus = {
  Submitted:     ['review', 'reject'],
  'Under Review': ['approve', 'reject', 'return'],
  Returned:      ['review'],
  Approved:      [],
  Rejected:      [],
};

const ApprovalModal = ({ file, onClose, onSuccess }) => {
  const availableActions = useMemo(() => {
    const currentStatus = file?.status || '';
    return allowedActionsForStatus[currentStatus] ?? [];
  }, [file]);

  const [action, setAction]   = useState(() => availableActions[0] || '');
  const [remarks, setRemarks] = useState('');

  // ── RTK Query mutation ────────────────────────────────
  const [performAction, { isLoading }] = usePerformActionMutation();

  const actionConfig = {
    review:  { label: 'Mark Under Review',  icon: FiClock,       btnClass: 'btn-secondary', bg: 'bg-yellow-50 dark:bg-yellow-900/20' },
    approve: { label: 'Approve File',        icon: FiCheckCircle, btnClass: 'btn-primary',   bg: 'bg-green-50 dark:bg-green-900/20' },
    reject:  { label: 'Reject File',         icon: FiXCircle,     btnClass: 'btn-danger',    bg: 'bg-red-50 dark:bg-red-900/20' },
    return:  { label: 'Return for Changes',  icon: FiRotateCcw,   btnClass: 'btn-secondary', bg: 'bg-orange-50 dark:bg-orange-900/20' },
  };

  const handleSubmit = async () => {
    // Remarks required for reject and return actions
    if ((action === 'reject' || action === 'return') && !remarks.trim()) {
      toast.error('Remarks are required for rejection/return');
      return;
    }

    try {
      await performAction({ id: file._id, action, remarks }).unwrap();
      const actionLabel = { approve: 'approved', reject: 'rejected', return: 'returned', review: 'put under review' }[action];
      toast.success(`File ${actionLabel} successfully!`);
      onSuccess(); // Caller can close modal / refresh
      onClose();
    } catch (err) {
      toast.error(err?.data?.message || 'Action failed');
    }
  };

  const cfg = actionConfig[action];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-dark-card rounded-2xl shadow-2xl w-full max-w-md animate-slide-in">

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-dark-border">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Approval Action</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-dark-200 rounded-lg transition-colors"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* File info */}
          <div className={`p-3 rounded-lg ${cfg ? cfg.bg : 'bg-gray-50 dark:bg-gray-800/30'}`}>
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">{file.title}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {file.department} · {file.category}
            </p>
          </div>

          {/* Action selector */}
          {availableActions.length === 0 ? (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-gray-100 dark:bg-gray-800/50 text-sm text-gray-500 dark:text-gray-400">
              <FiXCircle className="w-4 h-4 flex-shrink-0 text-gray-400" />
              This file is <strong className="text-gray-700 dark:text-gray-300">{file.status}</strong> — no further actions are available.
            </div>
          ) : (
            <div>
              <label className="label">Select Action</label>
              <div className="grid grid-cols-2 gap-2">
                {availableActions.map((key) => {
                  const val = actionConfig[key];
                  return (
                    <button
                      key={key}
                      onClick={() => setAction(key)}
                      className={`p-3 rounded-lg border-2 text-sm font-medium transition-all text-left ${
                        action === key
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400'
                          : 'border-gray-200 dark:border-dark-border hover:border-gray-300 text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      <val.icon className="w-4 h-4 mb-1" />
                      {val.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Remarks — only shown when an action is available */}
          {availableActions.length > 0 && (
            <div>
              <label className="label">
                Remarks{' '}
                {(action === 'reject' || action === 'return') && (
                  <span className="text-red-500">*</span>
                )}
              </label>
              <textarea
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Add your remarks or comments..."
                rows={3}
                className="input-field resize-none"
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 pt-0">
          <button onClick={onClose} className="btn-secondary flex-1">
            {availableActions.length === 0 ? 'Close' : 'Cancel'}
          </button>
          {availableActions.length > 0 && cfg && (
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className={`${cfg.btnClass} flex-1`}
            >
              {isLoading ? 'Processing...' : cfg.label}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApprovalModal;
