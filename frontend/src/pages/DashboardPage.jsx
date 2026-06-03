import React, { useEffect, useState } from 'react';
import {
  PieChart, Pie, Cell, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { getDashboardStats } from '../services/dashboardService';
import DashboardCards from '../components/DashboardCards';
import LoadingSkeleton from '../components/LoadingSkeleton';
import StatusBadge from '../components/StatusBadge';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiRefreshCw, FiPlus, FiGrid, FiActivity, FiBriefcase } from 'react-icons/fi';
import toast from 'react-hot-toast';

const PIE_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6'];

const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    try {
      const res = await getDashboardStats();
      setStats(res.data);
    } catch {
      toast.error('Failed to load dashboard stats');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) return <LoadingSkeleton variant="dashboard" />;

  const categoryData =
    stats?.categoryCounts?.map(({ _id, count }) => ({ name: _id, value: count })) || [];
  const deptData =
    stats?.departmentCounts?.map(({ _id, count }) => ({ name: _id, count })) || [];

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Dynamic Welcome Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary-600 via-primary-700 to-indigo-700 dark:from-dark-card dark:via-dark-100 dark:to-dark-card border border-transparent dark:border-dark-border/40 rounded-3xl p-6 md:p-8 text-white shadow-lg shadow-primary-500/10 dark:shadow-none">
        {/* Ambient background blur circles */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 dark:bg-primary-500/10 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />
        <div className="absolute bottom-0 left-1/3 w-48 h-48 bg-primary-400/20 dark:bg-indigo-500/10 rounded-full blur-2xl pointer-events-none -mb-12" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase bg-white/20 dark:bg-primary-900/30 text-white dark:text-primary-400 backdrop-blur-sm">
              Workspace Hub
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Welcome back, {user?.name}!
            </h2>
            <p className="text-white/80 dark:text-gray-400 text-sm max-w-xl font-medium">
              You are signed in as an <span className="text-white dark:text-primary-400 font-bold capitalize">{user?.role}</span> in the <span className="font-semibold">{user?.department || 'Operations'}</span> division. Manage requests, review metrics, and approve workflows seamlessly.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {user?.role === 'employee' ? (
              <Link to="/files/new" className="bg-white hover:bg-gray-50 text-primary-600 hover:text-primary-700 dark:bg-white/10 dark:hover:bg-white/20 dark:text-white border border-transparent dark:border-white/15 px-5 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-black/10 hover:scale-[1.02] active:scale-[0.98] transition-all">
                <FiPlus className="w-4 h-4 stroke-[3]" />
                Create New Request
              </Link>
            ) : (
              <Link to="/approval" className="bg-white hover:bg-gray-50 text-primary-600 hover:text-primary-700 dark:bg-white/10 dark:hover:bg-white/20 dark:text-white border border-transparent dark:border-white/15 px-5 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-black/10 hover:scale-[1.02] active:scale-[0.98] transition-all">
                <FiGrid className="w-4 h-4" />
                Review Queue
              </Link>
            )}
            <button
              onClick={() => fetchStats(true)}
              disabled={refreshing}
              className="bg-white/10 dark:bg-dark-200/50 hover:bg-white/20 dark:hover:bg-dark-border text-white border border-white/10 dark:border-dark-border/40 font-bold px-4 py-3 rounded-xl flex items-center gap-2 transition-all backdrop-blur-sm"
            >
              <FiRefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh System
            </button>
          </div>
        </div>
      </div>

      {/* Stat cards grid */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-gray-800 dark:text-white">
          <FiActivity className="w-5 h-5 text-primary-500" />
          <h3 className="text-base font-bold tracking-tight uppercase">Operational Overview</h3>
        </div>
        <DashboardCards stats={stats?.statusSummary} />
      </div>

      {/* Split visual section (Charts) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Pie Chart */}
        <div className="card-premium border-gray-150 dark:border-dark-border/40">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-gray-800 dark:text-gray-200 text-sm tracking-wide uppercase">
              Distribution by Category
            </h3>
            <span className="text-[10px] bg-gray-100 dark:bg-dark-200 text-gray-500 dark:text-gray-400 px-2 py-1 rounded-md font-bold">
              Real-time
            </span>
          </div>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={85}
                  innerRadius={50}
                  paddingAngle={4}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} (${(percent * 100).toFixed(0)}%)`
                  }
                  labelLine={false}
                  style={{ outline: 'none' }}
                >
                  {categoryData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} className="focus:outline-none transition-all duration-300" />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '12px', 
                    border: 'none', 
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    backgroundColor: 'rgba(255, 255, 255, 0.95)'
                  }}
                  itemStyle={{ color: '#1f2937', fontWeight: 'bold' }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <FiBriefcase className="w-8 h-8 opacity-40 mb-2" />
              <p className="text-sm">No category distribution data available</p>
            </div>
          )}
        </div>

        {/* Department Bar Chart */}
        <div className="card-premium border-gray-150 dark:border-dark-border/40">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-gray-800 dark:text-gray-200 text-sm tracking-wide uppercase">
              Volume by Department
            </h3>
            <span className="text-[10px] bg-gray-100 dark:bg-dark-200 text-gray-500 dark:text-gray-400 px-2 py-1 rounded-md font-bold">
              Total Traffic
            </span>
          </div>
          {deptData.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={deptData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="4 4" className="opacity-20 stroke-gray-300 dark:stroke-dark-border" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#9ca3af', fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#9ca3af', fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ 
                    borderRadius: '12px', 
                    border: 'none', 
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    backgroundColor: 'rgba(255, 255, 255, 0.95)'
                  }}
                  itemStyle={{ color: '#1f2937', fontWeight: 'bold' }}
                />
                <Bar dataKey="count" fill="#4f46e5" radius={[6, 6, 0, 0]}>
                  {deptData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <FiBriefcase className="w-8 h-8 opacity-40 mb-2" />
              <p className="text-sm">No departmental activity data available</p>
            </div>
          )}
        </div>
      </div>

      {/* Trending & Recent Updates (Netflix-style horizontal queue) */}
      {stats?.recentFiles?.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FiActivity className="w-5 h-5 text-indigo-500" />
              <h3 className="text-base font-bold tracking-tight uppercase text-gray-800 dark:text-white">
                Latest Workflow Actions
              </h3>
            </div>
            <Link
              to="/files"
              className="text-xs text-primary-600 hover:text-primary-700 font-extrabold flex items-center gap-1 uppercase tracking-wider"
            >
              Explore Hub <FiArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </Link>
          </div>

          {/* Premium Horizontal Scroll container */}
          <div className="flex gap-4 overflow-x-auto pb-4 pt-1 snap-x scrollbar-thin scroll-smooth -mx-4 px-4 md:mx-0 md:px-0">
            {stats.recentFiles.map((file) => (
              <div
                key={file._id}
                className="snap-start min-w-[280px] md:min-w-[320px] max-w-[340px] flex-shrink-0 card-premium border-gray-150 dark:border-dark-border/40 p-5 flex flex-col justify-between hover:shadow-md dark:hover:shadow-primary-950 hover:-translate-y-1 transition-all"
              >
                <div>
                  <div className="flex justify-between items-start gap-2 mb-3">
                    <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest leading-none">
                      {file.department}
                    </span>
                    <StatusBadge status={file.status} />
                  </div>
                  <h4 className="text-sm font-bold text-gray-800 dark:text-gray-100 line-clamp-2 leading-relaxed h-10 mb-2">
                    {file.title}
                  </h4>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    Submitted by: <span className="font-semibold text-gray-600 dark:text-gray-300">{file.createdBy?.name}</span>
                  </p>
                </div>

                <div className="flex justify-between items-center mt-6 pt-3.5 border-t border-gray-100 dark:border-dark-border/30">
                  <span className="text-[10px] font-extrabold px-2.5 py-1 bg-gray-100 dark:bg-dark-200 text-gray-600 dark:text-gray-400 rounded-lg">
                    {file.category}
                  </span>
                  <Link
                    to={`/files/${file._id}`}
                    className="h-8 w-8 rounded-xl bg-primary-50 dark:bg-primary-950/20 text-primary-600 dark:text-primary-400 flex items-center justify-center hover:bg-primary-600 hover:text-white transition-all active:scale-95"
                  >
                    <FiArrowRight className="w-4 h-4 stroke-[2]" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;

