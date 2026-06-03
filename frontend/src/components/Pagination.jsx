import React from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const getPages = () => {
    const pages = [];
    const delta = 2;
    const left = currentPage - delta;
    const right = currentPage + delta + 1;

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= left && i < right)) {
        pages.push(i);
      }
    }

    const result = [];
    let prev = null;
    for (const page of pages) {
      if (prev !== null && page - prev > 1) {
        result.push('...');
      }
      result.push(page);
      prev = page;
    }
    return result;
  };

  return (
    <div className="flex items-center justify-center gap-1 mt-6">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <FiChevronLeft className="w-4 h-4" />
      </button>
      {getPages().map((page, idx) =>
        page === '...' ? (
          <span key={`ellipsis-${idx}`} className="px-2 text-gray-400 text-sm">…</span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-9 h-9 rounded-lg text-sm font-semibold transition-all ${
              page === currentPage
                ? 'bg-primary-600 text-white shadow-sm'
                : 'hover:bg-gray-100 dark:hover:bg-dark-200 text-gray-600 dark:text-gray-400'
            }`}
          >
            {page}
          </button>
        )
      )}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <FiChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Pagination;
