/**
 * SessionsPage.jsx
 *
 * Changes from original:
 *  ✅ Removed manual useEffect/useState fetch
 *  ✅ Uses useGetUserSessionsQuery (RTK Query) with page param
 *  ✅ RTK Query handles caching per page — switching pages reuses cache
 */
import React, { useState } from 'react';
import { useGetUserSessionsQuery } from '../features/history/historyApi';
import { FiMonitor, FiLogIn, FiLogOut, FiClock, FiLoader, FiWifi } from 'react-icons/fi';

const SessionsPage = () => {
  const [page, setPage] = useState(1);
  const LIMIT = 20;

  // ── RTK Query ─────────────────────────────────────────
  const { data: sessionsResponse, isLoading, isFetching, isError } = useGetUserSessionsQuery({
    page,
    limit: LIMIT,
  });

  const sessions   = sessionsResponse?.data       || [];
  const pagination = sessionsResponse?.pagination || {};
  const totalPages = pagination.pages || 1;
  const totalCount = pagination.total || 0;

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">Login / Logout Sessions</h1>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">
            Complete user session history with IP, device, and duration
          </p>
        </div>
        {totalCount > 0 && (
          <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
            {totalCount} total sessions
          </span>
        )}
      </div>

      {/* Table */}
      <div className="card-premium overflow-hidden border border-gray-150 dark:border-dark-border/40">
        {isLoading || isFetching ? (
          <div className="flex items-center justify-center py-20">
            <FiLoader className="w-8 h-8 animate-spin text-primary-500" />
          </div>
        ) : isError ? (
          <div className="py-16 text-center text-gray-400 dark:text-gray-500">
            Failed to load session records.
          </div>
        ) : sessions.length === 0 ? (
          <div className="py-16 text-center text-gray-400 dark:text-gray-500">
            No session records found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-dark-border/30">
                  <th className="text-left px-5 py-3.5 text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">User</th>
                  <th className="text-left px-5 py-3.5 text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Login Time</th>
                  <th className="text-left px-5 py-3.5 text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Logout Time</th>
                  <th className="text-left px-5 py-3.5 text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Duration</th>
                  <th className="text-left px-5 py-3.5 text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">IP Address</th>
                  <th className="text-left px-5 py-3.5 text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Device</th>
                  <th className="text-left px-5 py-3.5 text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-dark-border/20">
                {sessions.map((session) => (
                  <tr key={session._id} className="hover:bg-gray-50/50 dark:hover:bg-dark-200/30 transition-colors">
                    {/* User */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-primary-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                          <span className="text-[9px] text-white font-bold">
                            {session.userId?.name?.charAt(0)?.toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-700 dark:text-gray-200 text-xs">{session.userId?.name}</p>
                          <p className="text-[10px] text-gray-400 dark:text-gray-500">{session.userId?.email}</p>
                        </div>
                      </div>
                    </td>
                    {/* Login */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-300">
                        <FiLogIn className="w-3.5 h-3.5 text-emerald-500" />
                        {session.loginTime
                          ? new Date(session.loginTime).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })
                          : '—'}
                      </div>
                    </td>
                    {/* Logout */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-300">
                        <FiLogOut className="w-3.5 h-3.5 text-rose-500" />
                        {session.logoutTime
                          ? new Date(session.logoutTime).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })
                          : <span className="text-amber-500 font-semibold">Active</span>}
                      </div>
                    </td>
                    {/* Duration */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                        <FiClock className="w-3.5 h-3.5" />
                        {session.sessionDuration || (session.isActive ? 'Ongoing' : '—')}
                      </div>
                    </td>
                    {/* IP */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 font-mono">
                        <FiWifi className="w-3.5 h-3.5 text-blue-400" />
                        {session.ipAddress || 'unknown'}
                      </div>
                    </td>
                    {/* Device */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                        <FiMonitor className="w-3.5 h-3.5" />
                        <span className="truncate max-w-[120px]" title={session.deviceInfo}>
                          {session.deviceInfo || 'unknown'}
                        </span>
                      </div>
                    </td>
                    {/* Status */}
                    <td className="px-5 py-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        session.isActive
                          ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400'
                          : 'bg-gray-100 dark:bg-dark-200 text-gray-500 dark:text-gray-400'
                      }`}>
                        {session.isActive ? 'Active' : 'Ended'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 text-sm font-semibold border border-gray-200 dark:border-dark-border rounded-lg hover:bg-gray-50 dark:hover:bg-dark-200 disabled:opacity-40 disabled:pointer-events-none transition-all"
          >
            Previous
          </button>
          <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 text-sm font-semibold border border-gray-200 dark:border-dark-border rounded-lg hover:bg-gray-50 dark:hover:bg-dark-200 disabled:opacity-40 disabled:pointer-events-none transition-all"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default SessionsPage;
