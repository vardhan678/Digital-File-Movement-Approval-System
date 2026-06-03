import React from 'react';

const STATUS_STYLES = {
  'Submitted':    'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800',
  'Under Review': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800',
  'Approved':     'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800',
  'Rejected':     'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800',
  'Returned':     'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border border-orange-200 dark:border-orange-800',
};

const PRIORITY_STYLES = {
  'Low':    'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
  'Medium': 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
  'High':   'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  'Urgent': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

const StatusBadge = ({ status, type = 'status' }) => {
  const styles = type === 'priority' ? PRIORITY_STYLES : STATUS_STYLES;
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${styles[status] || 'bg-gray-100 text-gray-600'}`}>
      {type === 'status' && (
        <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-70" />
      )}
      {status}
    </span>
  );
};

export default StatusBadge;
