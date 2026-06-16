/**
 * FileHistoryPage.jsx
 *
 * Changes from original:
 *  ✅ Removed manual useEffect/useState fetch
 *  ✅ Uses useGetFileHistoryQuery (RTK Query)
 */
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGetFileHistoryQuery } from '../features/history/historyApi';
import {
  FiArrowLeft, FiClock, FiCheckCircle, FiXCircle,
  FiRotateCcw, FiEye, FiLoader,
} from 'react-icons/fi';

const STATUS_CONFIG = {
  'Submitted':    { icon: FiEye,        color: 'text-indigo-600',  bg: 'bg-indigo-50 dark:bg-indigo-950/40',   border: 'border-indigo-200 dark:border-indigo-800' },
  'Under Review': { icon: FiClock,       color: 'text-amber-600',   bg: 'bg-amber-50 dark:bg-amber-950/40',     border: 'border-amber-200 dark:border-amber-800' },
  'Approved':     { icon: FiCheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-950/40', border: 'border-emerald-200 dark:border-emerald-800' },
  'Rejected':     { icon: FiXCircle,     color: 'text-rose-600',    bg: 'bg-rose-50 dark:bg-rose-950/40',       border: 'border-rose-200 dark:border-rose-800' },
  'Returned':     { icon: FiRotateCcw,   color: 'text-orange-600',  bg: 'bg-orange-50 dark:bg-orange-950/40',   border: 'border-orange-200 dark:border-orange-800' },
};

const FileHistoryPage = () => {
  const { fileId } = useParams();

  // ── RTK Query ─────────────────────────────────────────
  const { data: historyResponse, isLoading, isError } = useGetFileHistoryQuery(fileId);
  const history = historyResponse?.data || [];

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          to={`/files/${fileId}`}
          className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-200 transition-all text-gray-500"
        >
          <FiArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">File Audit Trail</h1>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">
            Complete status change history for this file
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <FiLoader className="w-8 h-8 animate-spin text-primary-500" />
        </div>
      ) : isError ? (
        <div className="card-premium p-10 text-center">
          <p className="text-gray-400 dark:text-gray-500">Failed to load file history.</p>
        </div>
      ) : history.length === 0 ? (
        <div className="card-premium p-10 text-center">
          <p className="text-gray-400 dark:text-gray-500">No history records found for this file.</p>
        </div>
      ) : (
        <div className="relative">
          {/* Vertical timeline line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-dark-border/40" />

          <div className="space-y-4">
            {history.map((entry, idx) => {
              const cfg = STATUS_CONFIG[entry.newStatus] || STATUS_CONFIG['Submitted'];
              const Icon = cfg.icon;
              const isLast = idx === history.length - 1;

              return (
                <div key={entry._id} className="relative flex gap-6 pl-14">
                  {/* Timeline dot */}
                  <div className={`absolute left-0 w-12 h-12 ${cfg.bg} border-2 ${cfg.border} rounded-full flex items-center justify-center shadow-sm z-10`}>
                    <Icon className={`w-5 h-5 ${cfg.color}`} />
                  </div>

                  {/* Card */}
                  <div className={`flex-1 card-premium p-5 border border-gray-150 dark:border-dark-border/40 ${isLast ? 'border-primary-200 dark:border-primary-900/40 shadow-primary-500/5' : ''}`}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        {entry.previousStatus && (
                          <>
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${STATUS_CONFIG[entry.previousStatus]?.bg || 'bg-gray-100'} ${STATUS_CONFIG[entry.previousStatus]?.color || 'text-gray-600'}`}>
                              {entry.previousStatus}
                            </span>
                            <span className="text-gray-400 text-xs">→</span>
                          </>
                        )}
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.color}`}>
                          {entry.newStatus}
                        </span>
                      </div>
                      <span className="text-[11px] text-gray-400 dark:text-gray-500 font-medium whitespace-nowrap">
                        {new Date(entry.timestamp).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-primary-500 to-indigo-600 flex items-center justify-center">
                        <span className="text-[8px] text-white font-bold">
                          {entry.performedByName?.charAt(0)?.toUpperCase()}
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">{entry.performedByName}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${
                        entry.performedByRole === 'admin'
                          ? 'bg-primary-50 dark:bg-primary-950/30 text-primary-600 dark:text-primary-400'
                          : 'bg-gray-100 dark:bg-dark-200 text-gray-500 dark:text-gray-400'
                      }`}>
                        {entry.performedByRole}
                      </span>
                    </div>

                    {entry.remarks && (
                      <div className="mt-2 pt-2 border-t border-gray-100 dark:border-dark-border/30">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          <span className="font-semibold text-gray-700 dark:text-gray-300">Remarks:</span>{' '}
                          {entry.remarks}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileHistoryPage;
