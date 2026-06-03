import React, { useEffect, useState, useCallback } from 'react';
import { FiCheckSquare, FiRefreshCw, FiUser, FiClock, FiEye } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getPendingFiles } from '../services/approvalService';
import SearchBar from '../components/SearchBar';
import FilterDropdown from '../components/FilterDropdown';
import Pagination from '../components/Pagination';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import StatusBadge from '../components/StatusBadge';
import ApprovalModal from '../components/ApprovalModal';
import useDebounce from '../hooks/useDebounce';

const PRIORITY_OPTIONS = ['Low', 'Medium', 'High', 'Urgent'];
const DEPARTMENT_OPTIONS = [
  'HR', 'Finance', 'IT', 'Operations', 'Legal',
  'Procurement', 'Administration', 'Engineering', 'General',
];

const ApprovalQueuePage = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);

  const debouncedSearch = useDebounce(search, 400);

  const fetchPending = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: 10,
        ...(debouncedSearch && { search: debouncedSearch }),
        ...(priorityFilter && { priority: priorityFilter }),
        ...(deptFilter && { department: deptFilter }),
      };
      const res = await getPendingFiles(params);
      setFiles(res.data?.files || res.data || []);
      setTotalPages(res.data?.totalPages || 1);
      setTotalCount(res.data?.total || 0);
    } catch {
      toast.error('Failed to load approval queue');
    } finally {
      setLoading(false);
    }
  }, [currentPage, debouncedSearch, priorityFilter, deptFilter]);

  useEffect(() => {
    fetchPending();
  }, [fetchPending]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, priorityFilter, deptFilter]);

  const hasFilters = search || priorityFilter || deptFilter;

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <FiCheckSquare className="w-5 h-5 text-primary-600" />
            Approval Queue
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">
            {totalCount} pending {totalCount === 1 ? 'request' : 'requests'}
          </p>
        </div>
        <button
          onClick={() => fetchPending()}
          className="btn-secondary flex items-center gap-2 text-sm"
        >
          <FiRefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-1">
            <SearchBar value={search} onChange={setSearch} placeholder="Search files..." />
          </div>
          <FilterDropdown
            label="All Priorities"
            value={priorityFilter}
            onChange={setPriorityFilter}
            options={PRIORITY_OPTIONS}
          />
          <FilterDropdown
            label="All Departments"
            value={deptFilter}
            onChange={setDeptFilter}
            options={DEPARTMENT_OPTIONS}
          />
        </div>
        {hasFilters && (
          <button
            onClick={() => { setSearch(''); setPriorityFilter(''); setDeptFilter(''); }}
            className="mt-3 text-xs text-primary-600 hover:text-primary-700 font-semibold"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Content */}
      {loading ? (
        <LoadingSpinner text="Loading approval queue..." />
      ) : files.length === 0 ? (
        <EmptyState
          title="No pending approvals"
          description={hasFilters ? 'No files match your filters.' : 'The approval queue is empty — all caught up!'}
        />
      ) : (
        <>
          <div className="space-y-3">
            {files.map((file) => (
              <div
                key={file._id}
                className="card p-4 hover:shadow-md transition-all duration-200 animate-fade-in"
              >
                <div className="flex items-start gap-4">
                  {/* Priority indicator */}
                  <div
                    className={`w-1.5 self-stretch rounded-full flex-shrink-0 ${
                      file.priority === 'Urgent' ? 'bg-red-500' :
                      file.priority === 'High' ? 'bg-orange-500' :
                      file.priority === 'Medium' ? 'bg-indigo-500' :
                      'bg-gray-300'
                    }`}
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-800 dark:text-gray-200 truncate">
                          {file.title}
                        </h3>
                        <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                          <span className="flex items-center gap-1 text-xs text-gray-400">
                            <FiUser className="w-3 h-3" />
                            {file.createdBy?.name || 'Unknown'}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-gray-400">
                            <FiClock className="w-3 h-3" />
                            {new Date(file.createdAt).toLocaleDateString('en-IN')}
                          </span>
                          <span className="text-xs text-gray-400">
                            {file.department} · {file.category}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <StatusBadge status={file.status} />
                        <StatusBadge status={file.priority} type="priority" />
                      </div>
                    </div>

                    {file.description && (
                      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                        {file.description}
                      </p>
                    )}

                    <div className="flex items-center gap-2 mt-3">
                      <button
                        onClick={() => setSelectedFile(file)}
                        className="btn-primary text-sm py-1.5 px-4"
                      >
                        Take Action
                      </button>
                      <Link
                        to={`/files/${file._id}`}
                        className="btn-secondary text-sm py-1.5 px-4 flex items-center gap-1.5"
                      >
                        <FiEye className="w-3.5 h-3.5" />
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}

      {/* Approval modal */}
      {selectedFile && (
        <ApprovalModal
          file={selectedFile}
          onClose={() => setSelectedFile(null)}
          onSuccess={() => {
            setSelectedFile(null);
            fetchPending();
          }}
        />
      )}
    </div>
  );
};

export default ApprovalQueuePage;
