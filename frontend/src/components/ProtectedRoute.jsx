import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ roles }) => {
  const { user, initializing } = useSelector((state) => state.auth);

  // While app is initializing (fetching user from DB using HttpOnly cookie), wait
  if (initializing) return null;

  // No user — not authenticated (HttpOnly cookie is invalid/expired)
  if (!user) return <Navigate to="/login" replace />;

  // Wrong role — redirect to dashboard
  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
