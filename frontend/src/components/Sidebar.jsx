import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  FiHome, FiFileText, FiPlusCircle, FiCheckSquare,
  FiMenu, FiX, FiFolder, FiActivity, FiUsers, FiClock
} from 'react-icons/fi';
import { useSelector } from 'react-redux';
import logoImg from '../assets/logo.png';

const NAV_LINKS = [
  { to: '/dashboard', icon: FiHome,        label: 'Dashboard',      roles: ['admin', 'employee'] },
  { to: '/files',     icon: FiFileText,    label: 'My Requests',    roles: ['employee'] },
  { to: '/files/new', icon: FiPlusCircle,  label: 'New Request',    roles: ['employee'] },
  { to: '/files',     icon: FiFolder,      label: 'All Documents',  roles: ['admin'] },
  { to: '/approval',  icon: FiCheckSquare, label: 'Approval Queue', roles: ['admin'] },
  { to: '/sessions',  icon: FiClock,       label: 'Sessions',       roles: ['admin'] },
];

const Sidebar = () => {
  const user = useSelector((state) => state.auth.user);
  const [open, setOpen] = useState(false);

  const links = NAV_LINKS.filter((l) => l.roles.includes(user?.role));

  const NavItem = ({ to, icon: Icon, label }) => (
    <NavLink
      to={to}
      end={to === '/files' || to === '/dashboard'}
      onClick={() => setOpen(false)}
      className={({ isActive }) =>
        `flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-xs font-semibold tracking-wide uppercase transition-all duration-300 ${
          isActive
            ? 'bg-gradient-to-r from-primary-50/50 to-indigo-50/50 dark:from-primary-950/10 dark:to-indigo-950/10 text-primary-600 dark:text-primary-400 border-l-4 border-primary-600 dark:border-primary-500 pl-3 shadow-[inset_1px_0_0_0_rgba(59,130,246,0.1)]'
            : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-200/50 hover:text-gray-800 dark:hover:text-white border-l-4 border-transparent'
        }`
      }
    >
      <Icon className="w-4 h-4 flex-shrink-0" />
      <span>{label}</span>
    </NavLink>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setOpen(true)}
        className="fixed top-3.5 left-4 z-50 md:hidden p-2.5 bg-white/90 dark:bg-dark-card/90 backdrop-blur-md shadow-lg rounded-xl border border-gray-150 dark:border-dark-border/40 focus:ring-2 focus:ring-primary-500/20 active:scale-95 transition-all"
        aria-label="Open sidebar"
      >
        <FiMenu className="w-5 h-5 text-gray-700 dark:text-gray-300" />
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 dark:bg-black/50 backdrop-blur-sm z-40 md:hidden animate-fade-in"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={`fixed left-0 top-0 h-full w-64 bg-white/95 dark:bg-dark-100/95 backdrop-blur-xl border-r border-gray-150 dark:border-dark-border/40 z-40 transition-transform duration-300 ease-out ${
          open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } flex flex-col shadow-xl md:shadow-none`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-gray-150 dark:border-dark-border/40 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-tr from-primary-600 to-indigo-600 rounded-xl p-0.5 shadow-md shadow-primary-500/20">
              <img src={logoImg} alt="Logo" className="w-full h-full object-contain rounded-lg invert dark:invert-0" />
            </div>
            <div className="leading-tight">
              <p className="font-extrabold tracking-wide text-gray-800 dark:text-white text-sm">DIGITAL FILE</p>
              <p className="text-[10px] text-primary-600 dark:text-primary-400 font-extrabold uppercase tracking-widest">FLOW MANAGER</p>
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="md:hidden p-1.5 hover:bg-gray-100 dark:hover:bg-dark-200 rounded-xl"
            aria-label="Close sidebar"
          >
            <FiX className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* System Status Widget */}
        <div className="px-4 pt-5 pb-3">
          <div className="p-3.5 bg-gradient-to-tr from-gray-50 to-gray-100/50 dark:from-dark-200/40 dark:to-dark-card/20 rounded-2xl border border-gray-100 dark:border-dark-border/20 flex items-center gap-3">
            <span className="p-2 bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-xl animate-pulse-subtle">
              <FiActivity className="w-4 h-4" />
            </span>
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest leading-none">System Status</p>
              <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-1 leading-none">All nodes healthy</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          {links.map((link) => (
            <NavItem key={link.to + link.label} {...link} />
          ))}
        </nav>

        {/* User Footer */}
        <div className="p-4 border-t border-gray-150 dark:border-dark-border/40 flex-shrink-0">
          <div className="p-3.5 rounded-2xl bg-gradient-to-tr from-primary-500/5 to-indigo-600/5 dark:from-primary-500/10 dark:to-indigo-600/10 border border-primary-500/10 dark:border-primary-500/20">
            <div className="flex justify-between items-center">
              <span className="text-[9px] font-extrabold tracking-widest text-primary-600 dark:text-primary-400 uppercase leading-none">
                Active Department
              </span>
              <span className="h-2 w-2 bg-primary-500 rounded-full animate-ping" />
            </div>
            <p className="text-xs font-bold text-gray-700 dark:text-gray-200 truncate mt-2 capitalize">
              {user?.department || 'System Operations'}
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
