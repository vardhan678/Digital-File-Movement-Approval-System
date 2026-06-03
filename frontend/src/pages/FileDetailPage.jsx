import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  FiArrowLeft, FiEdit2, FiTrash2, FiDownload,
  FiFileText, FiUser, FiClock, FiAlertTriangle, FiTag, FiPaperclip
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import { getFileById, deleteFile } from '../services/fileService';
import { useAuth } from '../context/AuthContext';
import LoadingSkeleton from '../components/LoadingSkeleton';
import StatusBadge from '../components/StatusBadge';
import ApprovalTimeline from '../components/ApprovalTimeline';
import ApprovalModal from '../components/ApprovalModal';

const FileDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showApproval, setShowApproval] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchFile = async () => {
    try {
      const res = await getFileById(id);
      setFile(res.data);
    } catch {
      toast.error('Document not found');
      navigate('/files');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFile();
  }, [id]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteFile(id);
      toast.success('Document deleted successfully');
      navigate('/files');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    } finally {
      setDeleting(false);
      setShowDelete(false);
    }
  };

  if (loading) return <LoadingSkeleton variant="detail" />;
  if (!file) return null;

  const canEdit = user?.role === 'employee' && ['Submitted', 'Returned'].includes(file.status);
  const canDelete = user?.role === 'employee' && file.createdBy?._id === user?._id;
  const canApprove = user?.role === 'admin';

  const InfoRow = ({ icon: Icon, label, value }) => (
    <div className="flex items-start gap-3.5 py-3.5 border-b border-gray-100 dark:border-dark-border/30 last:border-0">
      <div className="w-8.5 h-8.5 bg-gray-50 dark:bg-dark-200 border border-gray-100 dark:border-dark-border/20 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
        <Icon className="w-4 h-4 text-primary-500" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] text-gray-400 dark:text-gray-500 font-extrabold uppercase tracking-widest">{label}</p>
        <p className="text-xs font-bold text-gray-800 dark:text-gray-200 mt-1 truncate">{value || '—'}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl pb-12">
      {/* Back button & actions */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-xs font-bold uppercase tracking-wider transition-colors"
        >
          <FiArrowLeft className="w-4.5 h-4.5 stroke-[2.5]" />
          Back to Vault
        </button>

        <div className="flex items-center gap-2">
          {canEdit && (
            <Link to={`/files/${id}/edit`} className="btn-secondary flex items-center gap-2 text-xs uppercase tracking-wider">
              <FiEdit2 className="w-4 h-4" />
              Edit Request
            </Link>
          )}
          {canDelete && (
            <button
              onClick={() => setShowDelete(true)}
              className="btn-danger flex items-center gap-2 text-xs uppercase tracking-wider"
            >
              <FiTrash2 className="w-4 h-4" />
              Delete Logs
            </button>
          )}
          {canApprove && (
            <button
              onClick={() => setShowApproval(true)}
              className="btn-primary flex items-center gap-2 text-xs uppercase tracking-wider shadow-lg shadow-primary-500/10"
            >
              Take Action
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Pane */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title Header Card */}
          <div className="card-premium border-gray-150 dark:border-dark-border/40 bg-white dark:bg-dark-card">
            <div className="flex items-start justify-between gap-4 mb-5">
              <div className="flex-1 space-y-2">
                <span className="text-[10px] font-extrabold text-primary-600 dark:text-primary-400 uppercase tracking-widest leading-none block">
                  {file.department} &middot; {file.category}
                </span>
                <h1 className="text-xl md:text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-tight">
                  {file.title}
                </h1>
                <div className="flex items-center gap-2 mt-3 flex-wrap">
                  <StatusBadge status={file.status} />
                  <StatusBadge status={file.priority} type="priority" />
                  <span className="text-[10px] font-extrabold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-2 py-0.5 bg-gray-100 dark:bg-dark-200 rounded">
                    REF: #{file.referenceNumber || 'N/A'}
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 bg-primary-50 dark:bg-primary-950/20 border border-primary-100 dark:border-primary-900/30 rounded-2xl flex items-center justify-center flex-shrink-0">
                <FiFileText className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
            </div>

            {file.description && (
              <div className="space-y-2 pt-4 border-t border-gray-100 dark:border-dark-border/20">
                <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-widest font-extrabold">
                  Detailed Description
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed bg-gray-50/50 dark:bg-dark-200/30 border border-gray-100 dark:border-dark-border/10 rounded-2xl p-4 font-medium">
                  {file.description}
                </p>
              </div>
            )}

            {file.remarks && (
              <div className="mt-5 space-y-2 pt-4 border-t border-gray-100 dark:border-dark-border/20">
                <p className="text-[10px] text-amber-600 dark:text-amber-500 uppercase tracking-widest font-extrabold">
                  Reviewer Feedback / Remarks
                </p>
                <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed bg-amber-50/50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/20 rounded-2xl p-4 font-semibold">
                  {file.remarks}
                </p>
              </div>
            )}
          </div>

          {/* Attachments Section */}
          {file.attachments?.length > 0 && (
            <div className="card-premium border-gray-150 dark:border-dark-border/40 bg-white dark:bg-dark-card">
              <div className="flex items-center gap-2 mb-4">
                <FiPaperclip className="w-4 h-4 text-indigo-500" />
                <h3 className="font-bold text-gray-800 dark:text-gray-200 text-sm uppercase tracking-wider">
                  Document Attachments ({file.attachments.length})
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {file.attachments.map((att, idx) => (
                  <a
                    key={idx}
                    href={att.url || att}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3.5 bg-gray-50 dark:bg-dark-200 border border-gray-100 dark:border-dark-border/20 rounded-2xl hover:bg-gray-100 dark:hover:bg-dark-border hover:-translate-y-0.5 transition-all group"
                  >
                    <div className="p-2.5 bg-white dark:bg-dark-100 rounded-xl border border-gray-100 dark:border-dark-border/30">
                      <FiFileText className="w-4.5 h-4.5 text-primary-500" />
                    </div>
                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300 flex-1 truncate">
                      {att.originalName || att.name || `Attachment ${idx + 1}`}
                    </span>
                    <FiDownload className="w-4 h-4 text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Workflow Status Tracker History */}
          <div className="card-premium border-gray-150 dark:border-dark-border/40 bg-white dark:bg-dark-card">
            <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-6 text-sm uppercase tracking-wider">
              Approval Journey Map
            </h3>
            <ApprovalTimeline history={file.approvalHistory || []} />
          </div>
        </div>

        {/* Sidebar Info Panel */}
        <div className="space-y-6">
          <div className="card-premium border-gray-150 dark:border-dark-border/40 bg-white dark:bg-dark-card">
            <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-4 text-sm uppercase tracking-wider">Meta Credentials</h3>
            <InfoRow icon={FiUser} label="Submitted by" value={file.createdBy?.name} />
            <InfoRow icon={FiClock} label="Date Submitted" value={new Date(file.createdAt).toLocaleString('en-IN', { dateStyle: 'long', timeStyle: 'short' })} />
            <InfoRow icon={FiClock} label="System Last Sync" value={new Date(file.updatedAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })} />
            <InfoRow icon={FiTag} label="Log Division" value={file.department} />
            <InfoRow icon={FiTag} label="Record Category" value={file.category} />
          </div>

          {file.tags?.length > 0 && (
            <div className="card-premium border-gray-150 dark:border-dark-border/40 bg-white dark:bg-dark-card">
              <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-3.5 text-sm uppercase tracking-wider">Reference Tags</h3>
              <div className="flex flex-wrap gap-2">
                {file.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-gradient-to-r from-primary-50 to-indigo-50 dark:from-primary-950/20 dark:to-indigo-950/20 border border-primary-100/40 dark:border-primary-900/30 text-primary-700 dark:text-primary-450 text-[10px] font-bold rounded-xl tracking-wide"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Approval action overlay */}
      {showApproval && (
        <ApprovalModal
          file={file}
          onClose={() => setShowApproval(false)}
          onSuccess={fetchFile}
        />
      )}

      {/* Premium Accessible Delete confirmation modal */}
      {showDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30 dark:bg-black/50 backdrop-blur-sm animate-fade-in" onClick={() => setShowDelete(false)} />
          <div className="relative bg-white dark:bg-dark-card rounded-2xl shadow-2xl p-6 max-w-sm w-full border border-gray-150 dark:border-dark-border/40 animate-slide-in">
            <div className="flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 bg-rose-50 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-900/30 rounded-full flex items-center justify-center">
                <FiAlertTriangle className="w-6 h-6 text-rose-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Delete Document?</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                Are you sure you want to permanently delete this document? All associated workflow logs and attachments will be lost.
              </p>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowDelete(false)} className="btn-secondary text-xs flex-1 uppercase tracking-wider">
                Cancel
              </button>
              <button onClick={handleDelete} disabled={deleting} className="btn-danger text-xs flex-1 uppercase tracking-wider">
                {deleting ? 'Deleting...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileDetailPage;

