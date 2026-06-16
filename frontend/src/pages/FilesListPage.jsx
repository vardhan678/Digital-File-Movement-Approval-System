/**
 * FilesListPage.jsx
 *
 * Changes from original:
 *  ✅ Removed manual useState/useEffect fetch pattern
 *  ✅ Uses useGetFilesQuery (RTK Query) — auto-refetches when params change
 *  ✅ Uses useDeleteFileMutation (RTK Query) — auto-invalidates cache
 *  ✅ RTK Query skips re-fetch when args are the same (automatic deduplication)
 */
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  FiPlus, FiGrid, FiList, FiAlertTriangle, FiSearch,
  FiSliders, FiUsers, FiDollarSign, FiCpu, FiTrendingUp,
  FiShield, FiShoppingBag, FiLayers, FiCode, FiHash,
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { useGetFilesQuery, useDeleteFileMutation } from '../features/files/fileApi';
import FileCard from '../components/FileCard';
import FileTable from '../components/FileTable';
import LoadingSkeleton from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';
import Pagination from '../components/Pagination';
import useDebounce from '../hooks/useDebounce';

const STATUS_OPTIONS = ['Submitted', 'Under Review', 'Approved', 'Rejected', 'Returned'];
const PRIORITY_OPTIONS = ['Low', 'Medium', 'High', 'Urgent'];

const CATEGORIES = [
  { name: 'HR',             icon: FiUsers },
  { name: 'Finance',        icon: FiDollarSign },
  { name: 'IT',             icon: FiCpu },
  { name: 'Operations',     icon: FiTrendingUp },
  { name: 'Legal',          icon: FiShield },
  { name: 'Procurement',    icon: FiShoppingBag },
  { name: 'Administration', icon: FiLayers },
  { name: 'Engineering',    icon: FiCode },
  { name: 'General',        icon: FiHash },
];

const FilesListPage = () => {
  const user = useSelector((state) => state.auth.user);

  // ── Filter/pagination state ───────────────────────────
  const [viewMode, setViewMode]           = useState('grid');
  const [search, setSearch]               = useState('');
  const [statusFilter, setStatusFilter]   = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [deptFilter, setDeptFilter]       = useState('');
  const [currentPage, setCurrentPage]     = useState(1);
  const [deleteModal, setDeleteModal]     = useState(null);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const debouncedSearch = useDebounce(search, 300);

  // Build query params object — RTK Query re-fetches automatically when this changes
  const queryParams = useMemo(() => ({
    page: currentPage,
    limit: 12,
    ...(debouncedSearch  && { search: debouncedSearch }),
    ...(statusFilter     && { status: statusFilter }),
    ...(priorityFilter   && { priority: priorityFilter }),
    ...(deptFilter       && { department: deptFilter }),
  }), [currentPage, debouncedSearch, statusFilter, priorityFilter, deptFilter]);

  // ── RTK Query hooks ───────────────────────────────────
  const {
    data: filesResponse,
    isLoading,
    isFetching,
  } = useGetFilesQuery(queryParams);

  const [deleteFile, { isLoading: deleting }] = useDeleteFileMutation();

  const files      = filesResponse?.data || [];
  const pagination = filesResponse?.pagination || {};
  const totalPages = pagination.pages || 1;
  const totalCount = pagination.total || 0;

  // Reset to page 1 when any filter changes
  const handleFilterChange = (setter) => (value) => {
    setter(value);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearch('');
    setStatusFilter('');
    setPriorityFilter('');
    setDeptFilter('');
    setCurrentPage(1);
  };

  const selectCategory = (catName) => {
    setDeptFilter((prev) => (prev === catName ? '' : catName));
    setCurrentPage(1);
  };

  const handleDelete = async () => {
    if (!deleteModal) return;
    try {
      await deleteFile(deleteModal).unwrap();
      toast.success('Document deleted successfully');
      setDeleteModal(null);
    } catch (err) {
      toast.error(err?.data?.message || 'Delete failed');
    }
  };

  const hasFilters = search || statusFilter || priorityFilter || deptFilter;

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header section */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            {user?.role === 'admin' ? 'Centralized Archive' : 'Personal Document Vault'}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider mt-1">
            {totalCount} active {totalCount === 1 ? 'record' : 'records'} logged
          </p>
        </div>

        <div className="flex items-center gap-2">
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="text-xs text-primary-600 dark:text-primary-400 font-extrabold uppercase tracking-wider hover:underline pr-2"
            >
              Reset Filters
            </button>
          )}
          {user?.role === 'employee' && (
            <Link to="/files/new" className="btn-primary flex items-center gap-2">
              <FiPlus className="w-4 h-4 stroke-[3]" />
              New Request
            </Link>
          )}
        </div>
      </div>

      {/* Department category bar */}
      <div className="w-full space-y-2">
        <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest block pl-1">
          Explore by Department
        </span>
        <div className="flex items-center gap-3 overflow-x-auto pb-3 pt-1 scrollbar-thin scroll-smooth -mx-4 px-4 md:mx-0 md:px-0">
          {CATEGORIES.map(({ name, icon: Icon }) => {
            const isSelected = deptFilter === name;
            return (
              <button
                key={name}
                onClick={() => selectCategory(name)}
                className={`flex flex-col items-center gap-2 p-3 min-w-[76px] rounded-2xl border text-center transition-all focus:outline-none ${
                  isSelected
                    ? 'bg-primary-600 dark:bg-primary-500/20 text-white dark:text-primary-400 border-primary-600 dark:border-primary-500 shadow-md shadow-primary-600/10'
                    : 'bg-white dark:bg-dark-card border-gray-150 dark:border-dark-border/40 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-gray-300 dark:hover:border-dark-border'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-[10px] font-bold tracking-wide">{name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter Sheet */}
      <div className="card-premium p-4 border-gray-150 dark:border-dark-border/40">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search */}
          <div className="relative w-full md:max-w-md">
            <span className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
              <FiSearch className="w-4 h-4" />
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              placeholder="Search documents by title, description, keywords..."
              className="input-field pl-10 text-sm py-2.5 rounded-xl border-gray-200 dark:border-dark-border/30"
            />
          </div>

          <div className="flex items-center justify-between w-full md:w-auto gap-4">
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all ${
                showAdvancedFilters || statusFilter || priorityFilter
                  ? 'bg-primary-50 dark:bg-primary-950/20 text-primary-600 dark:text-primary-400 border-primary-200 dark:border-primary-500/30'
                  : 'bg-white dark:bg-dark-card text-gray-500 dark:text-gray-400 border-gray-150 dark:border-dark-border/40 hover:bg-gray-50'
              }`}
            >
              <FiSliders className="w-4 h-4" />
              Filters {isFetching && <span className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" />}
            </button>

            {/* Grid vs List View */}
            <div className="flex items-center gap-1.5 bg-gray-100/70 dark:bg-dark-200/50 rounded-xl p-1 border border-transparent dark:border-dark-border/20">
              <button
                onClick={() => setViewMode('table')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'table' ? 'bg-white dark:bg-dark-card shadow text-primary-600 dark:text-primary-400 font-bold' : 'text-gray-400 hover:text-gray-600'}`}
                title="Table List View"
              >
                <FiList className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white dark:bg-dark-card shadow text-primary-600 dark:text-primary-400 font-bold' : 'text-gray-400 hover:text-gray-600'}`}
                title="Card Grid View"
              >
                <FiGrid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Advanced Filters */}
        {showAdvancedFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-100 dark:border-dark-border/30 animate-fade-in">
            <div className="space-y-1.5">
              <label className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 dark:text-gray-500">Document Status</label>
              <select
                value={statusFilter}
                onChange={(e) => handleFilterChange(setStatusFilter)(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-dark-200 border border-gray-200 dark:border-dark-border/40 rounded-xl text-xs font-semibold text-gray-700 dark:text-gray-300 outline-none"
              >
                <option value="">All Statuses</option>
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 dark:text-gray-500">Urgency Level</label>
              <select
                value={priorityFilter}
                onChange={(e) => handleFilterChange(setPriorityFilter)(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-dark-200 border border-gray-200 dark:border-dark-border/40 rounded-xl text-xs font-semibold text-gray-700 dark:text-gray-300 outline-none"
              >
                <option value="">All Priorities</option>
                {PRIORITY_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      {isLoading ? (
        <LoadingSkeleton variant={viewMode === 'table' ? 'table' : 'cards'} />
      ) : files.length === 0 ? (
        <EmptyState
          title="Document Hub is Empty"
          description={hasFilters ? 'No files match your advanced filter combinations. Try adjusting parameters.' : 'No record logs found. Upload your first file request to start operating.'}
          action={
            user?.role === 'employee' && !hasFilters ? (
              <Link to="/files/new" className="btn-primary flex items-center gap-2">
                <FiPlus className="w-4 h-4 stroke-[3]" />
                Submit First Request
              </Link>
            ) : null
          }
        />
      ) : viewMode === 'table' ? (
        <div className="space-y-6">
          <FileTable
            files={files}
            onDelete={user?.role === 'employee' ? (id) => setDeleteModal(id) : null}
            showActions
          />
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {files.map((file) => <FileCard key={file._id} file={file} />)}
          </div>
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/30 dark:bg-black/50 backdrop-blur-sm animate-fade-in"
            onClick={() => setDeleteModal(null)}
          />
          <div className="relative bg-white dark:bg-dark-card rounded-2xl shadow-2xl p-6 max-w-sm w-full border border-gray-100 dark:border-dark-border/40 animate-slide-in">
            <div className="flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 bg-rose-50 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-900/30 rounded-full flex items-center justify-center">
                <FiAlertTriangle className="w-6 h-6 text-rose-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Delete Document Request?</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                This action is irreversible. The request logs and files will be permanently deleted from our database.
              </p>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setDeleteModal(null)}
                className="btn-secondary text-xs flex-1 uppercase tracking-wider"
              >
                Keep File
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="btn-danger text-xs flex-1 uppercase tracking-wider"
              >
                {deleting ? 'Deleting...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilesListPage;
