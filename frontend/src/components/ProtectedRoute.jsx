import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = ({ roles }) => {
  const { user, loading } = useAuth();

  // Show spinner while auth state is being restored from localStorage
  if (loading) return <LoadingSpinner text="Authenticating..." />;

  // Fallback: read directly from localStorage to handle React state race condition
  // (navigate() can fire before setUser() commits to context)
  let currentUser = user;
  if (!currentUser) {
    try {
      const stored = localStorage.getItem('digitalfile_auth');
      if (stored) {
        const parsed = JSON.parse(stored);
        currentUser = parsed?.user || null;
      }
    } catch {
      currentUser = null;
    }
  }

  // Not logged in — redirect to login
  if (!currentUser) return <Navigate to="/login" replace />;

  // Logged in but wrong role — redirect to dashboard
  if (roles && !roles.includes(currentUser.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
