import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './layouts/MainLayout';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import FilesListPage from './pages/FilesListPage';
import FileDetailPage from './pages/FileDetailPage';
import FileFormPage from './pages/FileFormPage';
import ApprovalQueuePage from './pages/ApprovalQueuePage';
import NotFoundPage from './pages/NotFoundPage';

const App = () => {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('digitalfile_dark');
    return saved ? saved === 'true' : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('digitalfile_dark', darkMode);
  }, [darkMode]);

  const toggleDark = () => setDarkMode((prev) => !prev);

  return (
    <AuthProvider>
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

          {/* Admin routes */}
          <Route element={<ProtectedRoute roles={['admin']} />}>
            <Route element={<MainLayout darkMode={darkMode} toggleDark={toggleDark} />}>
              <Route path="/approval" element={<ApprovalQueuePage />} />
            </Route>
          </Route>

          {/* Redirects */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
