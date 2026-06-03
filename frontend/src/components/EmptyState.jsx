import React from 'react';
import { FiFolderPlus } from 'react-icons/fi';

const EmptyState = ({ title = 'No items found', description = 'Nothing to display here.', action }) => (
  <div className="flex flex-col items-center justify-center py-20 gap-4 animate-fade-in">
    <div className="w-20 h-20 bg-primary-50 dark:bg-primary-900/20 rounded-full flex items-center justify-center">
      <FiFolderPlus className="w-10 h-10 text-primary-400" />
    </div>
    <div className="text-center">
      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">{title}</h3>
      <p className="text-gray-400 dark:text-gray-500 mt-1 text-sm">{description}</p>
    </div>
    {action && <div className="mt-2">{action}</div>}
  </div>
);

export default EmptyState;
