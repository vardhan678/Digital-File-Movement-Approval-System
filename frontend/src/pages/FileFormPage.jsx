/**
 * FileFormPage.jsx
 *
 * Changes from original:
 *  ✅ Removed manual service calls (createFile, updateFile, getFileById)
 *  ✅ Uses useGetFileByIdQuery for pre-filling edit form
 *  ✅ Uses useCreateFileMutation and useUpdateFileMutation
 *  ✅ validateFileForm() from utils/validators.js
 *  ✅ Cache is automatically invalidated after create/update
 */
import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiUpload, FiX, FiFile, FiCheckSquare, FiAlertCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useGetFileByIdQuery, useCreateFileMutation, useUpdateFileMutation } from '../features/files/fileApi';
import { validateFileForm } from '../utils/validators';
import LoadingSkeleton from '../components/LoadingSkeleton';
import InputField from '../components/InputField';

const DEPARTMENTS = [
  'HR', 'Finance', 'IT', 'Operations', 'Legal',
  'Procurement', 'Administration', 'Engineering', 'General',
];
const CATEGORIES = [
  'Budget Approval', 'Leave Request', 'Procurement', 'Recruitment',
  'IT Request', 'Policy Review', 'Contract', 'Report', 'Complaint', 'General',
];
const PRIORITIES = ['Low', 'Medium', 'High', 'Urgent'];

const FileFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const isEdit = Boolean(id) && id !== 'new';

  const [form, setForm] = useState({
    title: '',
    description: '',
    department: '',
    category: '',
    priority: 'Medium',
    tags: '',
  });
  const [errors, setErrors] = useState({});
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [dragOver, setDragOver] = useState(false);

  // ── RTK Query hooks ───────────────────────────────────
  // Only fetch existing file data when editing
  const { data: fileResponse, isLoading: isLoadingFile } = useGetFileByIdQuery(id, {
    skip: !isEdit,
  });
  const [createFile, { isLoading: isCreating }] = useCreateFileMutation();
  const [updateFile, { isLoading: isUpdating }] = useUpdateFileMutation();

  const submitting = isCreating || isUpdating;

  // Pre-fill form when editing — runs when file data arrives
  useEffect(() => {
    if (isEdit && fileResponse?.data) {
      const f = fileResponse.data;
      setForm({
        title:       f.title       || '',
        description: f.description || '',
        department:  f.department  || '',
        category:    f.category    || '',
        priority:    f.priority    || 'Medium',
        tags:        f.tags?.join(', ') || '',
      });
    }
  }, [isEdit, fileResponse]);

  // ── Form handlers ─────────────────────────────────────
  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
  };

  const addFiles = (newFiles) => {
    const validFiles = newFiles.filter((f) => f.size <= 10 * 1024 * 1024);
    if (validFiles.length < newFiles.length) {
      toast.error('Some files exceed the 10MB safety limit and were omitted');
    }
    setSelectedFiles((prev) => {
      const existing = new Set(prev.map((f) => f.name));
      return [...prev, ...validFiles.filter((f) => !existing.has(f.name))];
    });
  };

  const handleFileSelect = (e) => addFiles(Array.from(e.target.files || []));
  const removeFile = (name) => setSelectedFiles((prev) => prev.filter((f) => f.name !== name));

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    addFiles(Array.from(e.dataTransfer.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ── Plain JS Validation ───────────────────────────
    const validationErrors = validateFileForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));
      selectedFiles.forEach((f) => formData.append('attachment', f));

      if (isEdit) {
        await updateFile({ id, formData }).unwrap();
        toast.success('Document request updated successfully!');
      } else {
        await createFile(formData).unwrap();
        toast.success('Document request submitted successfully!');
      }
      navigate('/files');
    } catch (err) {
      toast.error(err?.data?.message || `Failed to ${isEdit ? 'update' : 'submit'} document`);
    }
  };

  if (isEdit && isLoadingFile) return <LoadingSkeleton variant="detail" />;

  return (
    <div className="max-w-3xl space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2.5 hover:bg-gray-100 dark:hover:bg-dark-200 rounded-xl transition-all border border-transparent hover:border-gray-200/50 dark:hover:border-dark-border/40"
        >
          <FiArrowLeft className="w-5 h-5 text-gray-500" />
        </button>
        <div>
          <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
            {isEdit ? 'Refine Request Details' : 'Initiate New Document Request'}
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-semibold uppercase tracking-wider">
            {isEdit ? 'Revise record values below' : 'Establish operational parameters for review routing'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Document Specifications */}
        <div className="card-premium border-gray-150 dark:border-dark-border/40 bg-white dark:bg-dark-card space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100 dark:border-dark-border/20">
            <FiCheckSquare className="text-primary-500 w-4.5 h-4.5" />
            <h3 className="font-bold text-gray-800 dark:text-gray-200 text-sm uppercase tracking-wider">Document Specifications</h3>
          </div>

          <InputField
            label="Title / Nomenclature"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="e.g. Budget Allocation Request Q3"
            error={errors.title}
            required
          />

          <div className="space-y-1.5">
            <label className="text-[10px] font-extrabold uppercase tracking-widest text-gray-450 dark:text-gray-500">
              Summary / Purpose Context
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Provide a detailed summary regarding the goal and contents of this document request..."
              rows={4}
              className="input-field resize-none py-3 text-sm rounded-xl border-gray-200 dark:border-dark-border/30"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Department */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-extrabold uppercase tracking-widest text-gray-450 dark:text-gray-500">
                Division <span className="text-rose-500 font-extrabold">*</span>
              </label>
              <select
                name="department"
                value={form.department}
                onChange={handleChange}
                className={`input-field text-xs font-semibold py-3 cursor-pointer rounded-xl border-gray-200 dark:border-dark-border/30 ${errors.department ? 'border-rose-400 focus:ring-rose-450' : ''}`}
              >
                <option value="">Select Division</option>
                {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
              {errors.department && (
                <p className="mt-1 text-[10px] font-bold text-rose-500 flex items-center gap-1">
                  <FiAlertCircle />{errors.department}
                </p>
              )}
            </div>

            {/* Category */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-extrabold uppercase tracking-widest text-gray-450 dark:text-gray-500">
                Classification <span className="text-rose-500 font-extrabold">*</span>
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className={`input-field text-xs font-semibold py-3 cursor-pointer rounded-xl border-gray-200 dark:border-dark-border/30 ${errors.category ? 'border-rose-400 focus:ring-rose-450' : ''}`}
              >
                <option value="">Select Classification</option>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              {errors.category && (
                <p className="mt-1 text-[10px] font-bold text-rose-500 flex items-center gap-1">
                  <FiAlertCircle />{errors.category}
                </p>
              )}
            </div>

            {/* Priority */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-extrabold uppercase tracking-widest text-gray-450 dark:text-gray-500">Priority Level</label>
              <select
                name="priority"
                value={form.priority}
                onChange={handleChange}
                className="input-field text-xs font-semibold py-3 cursor-pointer rounded-xl border-gray-200 dark:border-dark-border/30"
              >
                {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-extrabold uppercase tracking-widest text-gray-450 dark:text-gray-500">
              Reference Identifiers (comma-separated)
            </label>
            <input
              type="text"
              name="tags"
              value={form.tags}
              onChange={handleChange}
              placeholder="e.g. audit-2026, approved-draft, ops"
              className="input-field py-3 text-sm rounded-xl border-gray-200 dark:border-dark-border/30"
            />
            <p className="text-[10px] text-gray-400 dark:text-gray-500 pl-0.5">
              Identifiers help tag items for quick indexing across operational workspaces.
            </p>
          </div>
        </div>

        {/* Attachments */}
        <div className="card-premium border-gray-150 dark:border-dark-border/40 bg-white dark:bg-dark-card space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100 dark:border-dark-border/20">
            <FiUpload className="text-indigo-500 w-4.5 h-4.5" />
            <h3 className="font-bold text-gray-800 dark:text-gray-200 text-sm uppercase tracking-wider">Supporting Documentation</h3>
          </div>

          {/* Drop zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
              dragOver
                ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-950/10'
                : 'border-gray-200 dark:border-dark-border/40 hover:border-primary-400 dark:hover:border-dark-border/80 hover:bg-gray-50/50 dark:hover:bg-dark-200/30'
            }`}
          >
            <FiUpload className={`w-7 h-7 mx-auto mb-2 transition-transform duration-300 ${dragOver ? 'text-primary-500 scale-110' : 'text-gray-450'}`} />
            <p className="text-xs font-bold text-gray-600 dark:text-gray-400">
              {dragOver ? 'Release documents now' : 'Click to select or drag & drop files here'}
            </p>
            <p className="text-[10px] text-gray-400 mt-1 font-semibold">
              Supports typical doc extensions (Max 10MB per file)
            </p>
          </div>

          <input ref={fileInputRef} type="file" multiple onChange={handleFileSelect} className="hidden" />

          {selectedFiles.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {selectedFiles.map((f) => (
                <div
                  key={f.name}
                  className="flex items-center gap-3 p-3 bg-gray-50/80 dark:bg-dark-200/50 border border-gray-100 dark:border-dark-border/20 rounded-2xl animate-fade-in"
                >
                  <div className="p-2 bg-white dark:bg-dark-100 rounded-xl border border-gray-100 dark:border-dark-border/30">
                    <FiFile className="w-4 h-4 text-primary-500 flex-shrink-0" />
                  </div>
                  <div className="flex-1 min-w-0 pr-1">
                    <p className="text-xs font-bold text-gray-700 dark:text-gray-200 truncate">{f.name}</p>
                    <span className="text-[9px] font-extrabold text-gray-400 dark:text-gray-500">
                      {(f.size / 1024).toFixed(1)} KB
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(f.name)}
                    className="p-1.5 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-gray-400 hover:text-rose-500 rounded-xl transition-colors shrink-0"
                  >
                    <FiX className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Form Actions */}
        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="btn-secondary text-xs uppercase tracking-wider px-6"
          >
            Cancel Request
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="btn-primary text-xs uppercase tracking-wider px-6 shadow-lg shadow-primary-500/10"
          >
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                {isEdit ? 'Refining...' : 'Submitting...'}
              </span>
            ) : (
              isEdit ? 'Update Document' : 'Submit Routing Request'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FileFormPage;
