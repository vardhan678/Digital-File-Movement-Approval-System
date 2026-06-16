/**
 * ApprovalQueuePage.jsx
 *
 * Changes from original:
 *  ✅ Removed manual useState/useEffect fetch pattern
 *  ✅ Uses useGetPendingFilesQuery (RTK Query)
 *  ✅ RTK Query auto-refetches when approvalApi.performAction invalidates cache
 *  ✅ isFetching used for background fetch indicator
 */
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  FiSearch, FiRefreshCw, FiFilter, FiEye, FiCheckSquare, FiLoader,
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useGetPendingFilesQuery } from '../features/approval/approvalApi';
import ApprovalModal from '../components/ApprovalModal';
import StatusBadge from '../components/StatusBadge';
import Pagination from '../components/Pagination';

const PRIORITY_COLORS = {
  Urgent: 'bg-red-500',
  High:   'bg-orange-500',
  Medium: 'bg-indigo-400',
  Low:    'bg-gray-300',
};
const DEPARTMENTS = [
  'HR', 'Finance', 'IT', 'Operations', 'Legal',
  'Procurement', 'Administration', 'Engineering',
];
const PRIORITIES = ['Low', 'Medium', 'High', 'Urgent'];

const ApprovalQueuePage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [search, setSearch]             = useState('');
  const [deptFilter, setDeptFilter]     = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [currentPage, setCurrentPage]   = useState(1);

  // Build query params
  const queryParams = useMemo(() => ({
    page: currentPage,
    limit: 15,
    ...(deptFilter     && { department: deptFilter }),
    ...(priorityFilter && { priority: priorityFilter }),
  }), [currentPage, deptFilter, priorityFilter]);

  // ── RTK Query hooks ───────────────────────────────────
  const {
    data: pendingResponse,
    isLoading,
    isFetching,
    refetch,
    isError,
  } = useGetPendingFilesQuery(queryParams);

  const allFiles     = pendingResponse?.data        || [];
  const pagination   = pendingResponse?.pagination  || {};
  const totalPages   = pagination.pages || 1;
  const totalPending = pagination.total || 0;

  // Client-side search filter (search field is not passed to API)
  const displayedFiles = useMemo(() => {
    if (!search) return allFiles;
    const lower = search.toLowerCase();
    return allFiles.filter(
      (f) =>
        f.title?.toLowerCase().includes(lower) ||
        f.department?.toLowerCase().includes(lower) ||
        f.createdBy?.name?.toLowerCase().includes(lower)
    );
  }, [allFiles, search]);

  const clearFilters = () => {
    setSearch('');
    setDeptFilter('');
    setPriorityFilter('');
    setCurrentPage(1);
  };

  const handleRefresh = () => {
    refetch();
    toast.success('Queue refreshed');
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white flex items-center gap-3">
            <span className="w-9 h-9 bg-primary-100 dark:bg-primary-950/30 text-primary-600 dark:text-primary-400 rounded-2xl flex items-center justify-center flex-shrink-0">
              <FiCheckSquare className="w-4.5 h-4.5" />
            </span>
            Approval Matrix
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider mt-1.5 ml-12">
            {totalPending} {totalPending === 1 ? 'document' : 'documents'} awaiting your review
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={isFetching}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-dark-border/40 text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-200 transition-all"
        >
          <FiRefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Filter Bar */}
      <div className="card-premium p-4 border-gray-150 dark:border-dark-border/40">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, department, submitter..."
              className="input-field pl-9 text-sm py-2.5 rounded-xl border-gray-200 dark:border-dark-border/30 w-full"
            />
          </div>

          {/* Department filter */}
          <div className="relative">
            <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={deptFilter}
              onChange={(e) => { setDeptFilter(e.target.value); setCurrentPage(1); }}
              className="input-field pl-9 text-sm py-2.5 rounded-xl border-gray-200 dark:border-dark-border/30 w-full cursor-pointer"
            >
              <option value="">All Departments</option>
              {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          {/* Priority filter */}
          <div className="flex gap-2">
            <select
              value={priorityFilter}
              onChange={(e) => { setPriorityFilter(e.target.value); setCurrentPage(1); }}
              className="input-field text-sm py-2.5 rounded-xl border-gray-200 dark:border-dark-border/30 flex-1 cursor-pointer"
            >
              <option value="">All Priorities</option>
              {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
            {(search || deptFilter || priorityFilter) && (
              <button
                onClick={clearFilters}
                className="px-4 py-2.5 text-xs font-bold text-primary-600 dark:text-primary-400 border border-primary-200 dark:border-primary-500/30 rounded-xl hover:bg-primary-50 dark:hover:bg-primary-950/20 whitespace-nowrap transition-colors"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <FiLoader className="w-8 h-8 animate-spin text-primary-500" />
        </div>
      ) : isError ? (
        <div className="text-center py-16 text-gray-400 dark:text-gray-500">
          <p>Failed to load pending files.</p>
          <button onClick={handleRefresh} className="mt-3 btn-primary text-sm">Retry</button>
        </div>
      ) : displayedFiles.length === 0 ? (
        <div className="card-premium py-20 text-center">
          <FiCheckSquare className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
          <p className="text-gray-800 dark:text-white font-bold">All Clear!</p>
          <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
            {search || deptFilter || priorityFilter
              ? 'No files match your current filters.'
              : 'There are no documents pending approval at this time.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="card-premium overflow-hidden border border-gray-150 dark:border-dark-border/40">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-dark-border/30">
                    <th className="text-left px-5 py-4 text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Priority</th>
                    <th className="text-left px-5 py-4 text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Document Title</th>
                    <th className="text-left px-5 py-4 text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Department</th>
                    <th className="text-left px-5 py-4 text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Submitted By</th>
                    <th className="text-left px-5 py-4 text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Status</th>
                    <th className="text-left px-5 py-4 text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Date</th>
                    <th className="text-left px-5 py-4 text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-dark-border/20">
                  {displayedFiles.map((file) => (
                    <tr key={file._id} className="hover:bg-gray-50/50 dark:hover:bg-dark-200/30 transition-colors">
                      {/* Priority indicator */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-10 rounded-full ${PRIORITY_COLORS[file.priority] || 'bg-gray-300'}`} />
                          <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                            {file.priority}
                          </span>
                        </div>
                      </td>
                      {/* Title */}
                      <td className="px-5 py-4">
                        <p className="font-bold text-gray-800 dark:text-gray-200 text-xs truncate max-w-[200px]">{file.title}</p>
                        <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">{file.category}</p>
                      </td>
                      {/* Department */}
                      <td className="px-5 py-4">
                        <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">{file.department}</span>
                      </td>
                      {/* Submitted By */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-primary-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                            <span className="text-[9px] text-white font-bold">
                              {file.createdBy?.name?.charAt(0)?.toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-gray-700 dark:text-gray-200">{file.createdBy?.name}</p>
                            <p className="text-[10px] text-gray-400 dark:text-gray-500">{file.createdBy?.department}</p>
                          </div>
                        </div>
                      </td>
                      {/* Status */}
                      <td className="px-5 py-4">
                        <StatusBadge status={file.status} />
                      </td>
                      {/* Date */}
                      <td className="px-5 py-4">
                        <span className="text-[11px] text-gray-400 dark:text-gray-500 font-medium whitespace-nowrap">
                          {new Date(file.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                        </span>
                      </td>
                      {/* Actions */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <Link
                            to={`/files/${file._id}`}
                            className="p-2 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-950/20 rounded-xl transition-all"
                            title="View Details"
                          >
                            <FiEye className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => setSelectedFile(file)}
                            className="btn-primary text-xs py-1.5 px-3 whitespace-nowrap"
                          >
                            Take Action
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      )}

      {/* Approval Modal */}
      {selectedFile && (
        <ApprovalModal
          file={selectedFile}
          onClose={() => setSelectedFile(null)}
          onSuccess={() => {
            // RTK Query auto-refetches pending files because performAction
            // invalidates the PENDING tag — no manual refetch needed
            setSelectedFile(null);
          }}
        />
      )}
    </div>
  );
};

export default ApprovalQueuePage;
