import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('digitalfile_auth');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUser(parsed.user);
        setToken(parsed.token);
      } catch {
        localStorage.removeItem('digitalfile_auth');
      }
    }
    setLoading(false);
  }, []);

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('digitalfile_auth', JSON.stringify({ user: userData, token: authToken }));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('digitalfile_auth');
  };

  const isAdmin = () => user?.role === 'admin';
  const isEmployee = () => user?.role === 'employee';

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, isAdmin, isEmployee }}>
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
