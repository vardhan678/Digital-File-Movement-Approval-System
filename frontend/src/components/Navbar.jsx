import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiSun, FiMoon, FiLogOut, FiUser, FiSearch, FiBell } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ darkMode, toggleDark }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-white/75 dark:bg-dark-300/75 backdrop-blur-xl border-b border-gray-150 dark:border-dark-border/40 h-16 flex items-center px-6 gap-6 transition-all duration-300">
      {/* Current Page Title (Dynamic) */}
      <div className="flex-1 flex items-center gap-3">
        <h1 className="text-lg font-bold text-gray-800 dark:text-white capitalize hidden sm:block">
          {location.pathname === '/dashboard' 
            ? 'Command Center' 
            : location.pathname.includes('/files') 
            ? 'Document Hub' 
            : location.pathname.includes('/approval') 
            ? 'Approval Matrix' 
            : 'Digital Workspace'}
        </h1>
        
        {/* Dynamic visual indicator */}
        <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
          v1.2.0
        </span>
      </div>

      {/* Action Bar */}
      <div className="flex items-center gap-4">
        {/* Decorative Premium Search Input */}
        <div className="relative max-w-xs hidden lg:block">
          <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
            <FiSearch className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Universal search..."
            className="w-56 px-9 py-2 bg-gray-100/70 hover:bg-gray-100 focus:bg-white dark:bg-dark-200/50 dark:hover:bg-dark-200 dark:focus:bg-dark-100 border border-transparent dark:border-dark-border/20 focus:border-primary-500/30 focus:ring-2 focus:ring-primary-500/20 text-xs rounded-xl transition-all duration-300 outline-none text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500"
          />
        </div>

        {/* Notifications Icon (Premium Detail) */}
        <button className="p-2 hover:bg-gray-100 dark:hover:bg-dark-200/70 rounded-xl transition-all text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 relative">
          <FiBell className="w-4.5 h-4.5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-gradient-to-r from-red-500 to-rose-500 rounded-full ring-2 ring-white dark:ring-dark-300" />
        </button>

        {/* Dark mode toggle */}
        <button
          onClick={toggleDark}
          className="p-2 hover:bg-gray-100 dark:hover:bg-dark-200/70 rounded-xl transition-all text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
          aria-label={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {darkMode ? (
            <FiSun className="w-4.5 h-4.5 text-amber-500 animate-pulse-subtle" />
          ) : (
            <FiMoon className="w-4.5 h-4.5 text-indigo-500" />
          )}
        </button>

        {/* Divider */}
        <span className="w-px h-6 bg-gray-200 dark:bg-dark-border/40" />

        {/* Premium Profile Badge */}
        <div className="flex items-center gap-2.5 px-1 py-1 rounded-full group cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary-500 to-indigo-600 flex items-center justify-center shadow-md shadow-primary-500/20 group-hover:scale-105 transition-transform">
            <FiUser className="w-4 h-4 text-white" />
          </div>
          <div className="hidden md:block text-left pr-2">
            <p className="text-xs font-bold text-gray-800 dark:text-gray-200 leading-tight">
              {user?.name}
            </p>
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-primary-600 dark:text-primary-400 leading-none">
              {user?.role}
            </span>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="p-2 hover:bg-red-50 dark:hover:bg-red-900/10 text-gray-400 hover:text-red-500 rounded-xl transition-all"
          title="Sign Out"
        >
          <FiLogOut className="w-4.5 h-4.5" />
        </button>
      </div>
    </header>
  );
};

export default Navbar;

