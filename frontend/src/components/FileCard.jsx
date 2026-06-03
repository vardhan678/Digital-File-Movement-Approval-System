import React from 'react';
import { Link } from 'react-router-dom';
import { FiClock, FiUser, FiArrowRight, FiTag, FiCalendar } from 'react-icons/fi';
import StatusBadge from './StatusBadge';

const FileCard = ({ file }) => (
  <div className="card-premium p-5 flex flex-col justify-between hover:shadow-xl dark:hover:shadow-primary-950/20 group border border-gray-150 dark:border-dark-border/40 animate-fade-in bg-white dark:bg-dark-card h-[220px]">
    <div>
      <div className="flex items-start justify-between gap-3 mb-3">
        <span className="text-[10px] font-bold text-primary-600 dark:text-primary-400 uppercase tracking-widest leading-none">
          {file.department}
        </span>
        <StatusBadge status={file.status} />
      </div>

      <h3 className="font-bold text-gray-800 dark:text-gray-100 line-clamp-2 text-sm leading-relaxed mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
        {file.title}
      </h3>

      {file.description && (
        <p className="text-gray-400 dark:text-gray-500 text-xs line-clamp-2 mb-4 leading-normal font-medium">
          {file.description}
        </p>
      )}
    </div>

    <div>
      <div className="flex items-center gap-3 text-[10px] text-gray-400 dark:text-gray-500 font-semibold mb-3">
        <span className="flex items-center gap-1">
          <FiUser className="w-3.5 h-3.5" />
          {file.createdBy?.name || 'Operations'}
        </span>
        <span className="w-1 h-1 bg-gray-300 dark:bg-dark-border rounded-full" />
        <span className="flex items-center gap-1">
          <FiCalendar className="w-3.5 h-3.5" />
          {new Date(file.createdAt).toLocaleDateString('en-IN')}
        </span>
        <span className="w-1 h-1 bg-gray-300 dark:bg-dark-border rounded-full" />
        <StatusBadge status={file.priority} type="priority" />
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-dark-border/30">
        <span className="text-[9px] font-extrabold px-2.5 py-1 bg-gray-50 dark:bg-dark-200 text-gray-500 dark:text-gray-400 rounded-lg flex items-center gap-1 uppercase tracking-wide">
          <FiTag className="w-3.5 h-3.5 text-primary-500" />
          {file.category}
        </span>
        <Link
          to={`/files/${file._id}`}
          className="flex items-center gap-1 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-xs font-bold transition-all hover:translate-x-0.5"
        >
          View Log <FiArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
        </Link>
      </div>
    </div>
  </div>
);

export default FileCard;

