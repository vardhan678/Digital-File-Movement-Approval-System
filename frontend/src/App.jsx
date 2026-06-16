/**
 * App.jsx — Root Application Component
 *
 * Changes from original:
 *  ✅ Removed fetchMeThunk (createAsyncThunk) — replaced with useGetMeQuery
 *  ✅ useGetMeQuery auto-runs on mount, validates HttpOnly cookie,
 *     and populates Redux authSlice via onQueryStarted lifecycle
 *  ✅ The `initializing` state is driven by the RTK Query query status
 */
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useSelector, useDispatch } from 'react-redux';
import { setInitializing } from './features/auth/authSlice';
import { useGetMeQuery } from './features/auth/authApi';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './layouts/MainLayout';
import LoadingSpinner from './components/LoadingSpinner';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import FilesListPage from './pages/FilesListPage';
import FileDetailPage from './pages/FileDetailPage';
import FileFormPage from './pages/FileFormPage';
import ApprovalQueuePage from './pages/ApprovalQueuePage';
import FileHistoryPage from './pages/FileHistoryPage';
import SessionsPage from './pages/SessionsPage';
import NotFoundPage from './pages/NotFoundPage';

// Ensure all API slices are registered by importing them
import './features/files/fileApi';
import './features/approval/approvalApi';
import './features/dashboard/dashboardApi';
import './features/history/historyApi';

const App = () => {
  const dispatch = useDispatch();
  const { initializing } = useSelector((state) => state.auth);

  // Dark mode state — persisted in localStorage
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('digitalfile_dark');
    return saved ? saved === 'true' : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('digitalfile_dark', darkMode);
  }, [darkMode]);

  /**
   * useGetMeQuery — Replaces fetchMeThunk
   *
   * On mount, this calls GET /api/auth/me with the HttpOnly cookie.
   * - Success → authApi.onQueryStarted calls dispatch(setCredentials(user))
   * - Failure (401/expired) → global 401 handler in apiSlice clears auth
   *
   * `skip` is false so it always runs once on mount.
   */
  const { isLoading: isMeLoading } = useGetMeQuery(undefined, {
    // Run once on mount; don't re-poll
    refetchOnMountOrArgChange: false,
  });

  // Mark app as no longer initializing once getMe settles
  useEffect(() => {
    if (!isMeLoading) {
      dispatch(setInitializing(false));
    }
  }, [isMeLoading, dispatch]);

  const toggleDark = () => setDarkMode((prev) => !prev);

  // Show spinner while checking cookie on initial load
  if (initializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-dark-300">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            borderRadius: '10px',
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '14px',
            fontWeight: '500',
          },
          success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
        }}
      />
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected routes — all roles */}
        <Route element={<ProtectedRoute roles={['admin', 'employee']} />}>
          <Route element={<MainLayout darkMode={darkMode} toggleDark={toggleDark} />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/files" element={<FilesListPage />} />
            <Route path="/files/:id" element={<FileDetailPage />} />
          </Route>
        </Route>

        {/* Employee routes */}
        <Route element={<ProtectedRoute roles={['employee']} />}>
          <Route element={<MainLayout darkMode={darkMode} toggleDark={toggleDark} />}>
            <Route path="/files/new" element={<FileFormPage />} />
            <Route path="/files/:id/edit" element={<FileFormPage />} />
          </Route>
        </Route>

        {/* Admin-only routes */}
        <Route element={<ProtectedRoute roles={['admin']} />}>
          <Route element={<MainLayout darkMode={darkMode} toggleDark={toggleDark} />}>
            <Route path="/approval" element={<ApprovalQueuePage />} />
            <Route path="/history/file/:fileId" element={<FileHistoryPage />} />
            <Route path="/sessions" element={<SessionsPage />} />
          </Route>
        </Route>

        {/* Redirects */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
