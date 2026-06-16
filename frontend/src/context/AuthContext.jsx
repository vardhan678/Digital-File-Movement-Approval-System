import React, { createContext, useContext } from 'react';
import { useSelector } from 'react-redux';

const AuthContext = createContext(null);

/**
 * AuthProvider — provides authentication state from Redux only.
 * ❌ NO localStorage here — token is persisted by redux-persist, user is always fresh from DB.
 * This prevents security issues where users could modify their role in dev tools.
 */
export const AuthProvider = ({ children }) => {
  const { user, token, isAuthenticated } = useSelector((state) => state.auth);

  const isAdmin = () => user?.role === 'admin';
  const isEmployee = () => user?.role === 'employee';

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, isAdmin, isEmployee }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export default AuthContext;
