import React from 'react';
import { Link } from 'react-router-dom';
import { FiEye, FiEdit2, FiTrash2 } from 'react-icons/fi';
import StatusBadge from './StatusBadge';

const FileTable = ({ files, onDelete, showActions = true }) => (
  <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-dark-border">
    <table className="w-full">
      <thead className="bg-gray-50 dark:bg-dark-200">
        <tr>
          {['Title', 'Department', 'Category', 'Priority', 'Status', 'Date', 'Actions'].map((h) => (
            <th
              key={h}
              className={`table-header px-4 py-3 ${h === 'Actions' ? 'text-right' : ''}`}
            >
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-50 dark:divide-dark-border">
        {files.map((file) => (
          <tr
            key={file._id}
            className="bg-white dark:bg-dark-card hover:bg-gray-50 dark:hover:bg-dark-200 transition-colors"
          >
            <td className="table-cell px-4 max-w-xs">
              <p className="font-medium text-gray-800 dark:text-gray-200 truncate text-sm">
                {file.title}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                {file.createdBy?.name || 'Unknown'}
              </p>
            </td>
            <td className="table-cell px-4 whitespace-nowrap">{file.department}</td>
            <td className="table-cell px-4 whitespace-nowrap">{file.category}</td>
            <td className="table-cell px-4">
              <StatusBadge status={file.priority} type="priority" />
            </td>
            <td className="table-cell px-4">
              <StatusBadge status={file.status} />
            </td>
            <td className="table-cell px-4 whitespace-nowrap">
              {new Date(file.createdAt).toLocaleDateString('en-IN')}
            </td>
            <td className="table-cell px-4">
              <div className="flex items-center justify-end gap-1">
                <Link
                  to={`/files/${file._id}`}
                  className="p-1.5 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-gray-400 hover:text-blue-600 rounded-lg transition-colors"
                  title="View"
                >
                  <FiEye className="w-4 h-4" />
                </Link>
                {showActions && ['Submitted', 'Returned'].includes(file.status) && (
                  <Link
                    to={`/files/${file._id}/edit`}
                    className="p-1.5 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 text-gray-400 hover:text-yellow-600 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <FiEdit2 className="w-4 h-4" />
                  </Link>
                )}
                {showActions && onDelete && (
                  <button
                    onClick={() => onDelete(file._id)}
                    className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-600 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default FileTable;
