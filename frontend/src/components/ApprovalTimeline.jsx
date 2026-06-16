import React from 'react';
import { FiCheck, FiX, FiRotateCcw, FiClock, FiUpload } from 'react-icons/fi';

const ACTION_CONFIG = {
  submitted:    { icon: FiUpload,     color: 'bg-blue-500',   label: 'Submitted' },
  under_review: { icon: FiClock,      color: 'bg-yellow-500', label: 'Under Review' },
  approve:      { icon: FiCheck,      color: 'bg-green-500',  label: 'Approved' },
  approved:     { icon: FiCheck,      color: 'bg-green-500',  label: 'Approved' },
  reject:       { icon: FiX,          color: 'bg-red-500',    label: 'Rejected' },
  rejected:     { icon: FiX,          color: 'bg-red-500',    label: 'Rejected' },
  return:       { icon: FiRotateCcw,  color: 'bg-orange-500', label: 'Returned for Changes' },
  returned:     { icon: FiRotateCcw,  color: 'bg-orange-500', label: 'Returned for Changes' },
  review:       { icon: FiClock,      color: 'bg-yellow-500', label: 'Put Under Review' },
};

const ApprovalTimeline = ({ history = [] }) => {
  if (!history.length) {
    return <p className="text-gray-400 text-sm py-4">No history available.</p>;
  }

  return (
    <div className="relative">
      <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-dark-border" />
      <div className="space-y-6">
        {history.map((entry, idx) => {
          const cfg = ACTION_CONFIG[entry.action] || {
            icon: FiClock,
            color: 'bg-gray-400',
            label: entry.action,
          };
          const Icon = cfg.icon;
          return (
            <div
            //Creates one timeline row.
              key={idx}
              className="flex gap-4 relative animate-fade-in"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <div
                className={`w-10 h-10 ${cfg.color} rounded-full flex items-center justify-center flex-shrink-0 z-10 shadow-sm`}
              >
                <Icon className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 pb-2">
                <div className="flex items-center justify-between flex-wrap gap-1">
                  <p className="font-semibold text-gray-800 dark:text-gray-200 text-sm">
                    {cfg.label}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(entry.timestamp).toLocaleString('en-IN', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </p>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  By: {entry.actionByName || entry.actionBy?.name || 'System'}
                </p>
                {entry.remarks && (
                  <p className="mt-1.5 text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-dark-200 rounded-lg px-3 py-2">
                    {entry.remarks}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ApprovalTimeline;
