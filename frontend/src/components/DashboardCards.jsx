import React from 'react';
import { FiFileText, FiCheckCircle, FiClock, FiXCircle, FiRotateCcw } from 'react-icons/fi';

const CARDS = [
  { key: 'total',       label: 'Total Requests', icon: FiFileText,    bg: 'bg-blue-50 dark:bg-blue-950/40 border-blue-100 dark:border-blue-900/30',      text: 'text-blue-600 dark:text-blue-400' },
  { key: 'approved',    label: 'Approved',       icon: FiCheckCircle, bg: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-100 dark:border-emerald-900/30',  text: 'text-emerald-600 dark:text-emerald-400' },
  { key: 'underReview', label: 'Under Review',   icon: FiClock,       bg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-100 dark:border-amber-900/30',text: 'text-amber-600 dark:text-amber-400' },
  { key: 'submitted',   label: 'Submitted',      icon: FiFileText,    bg: 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-100 dark:border-indigo-900/30',text: 'text-indigo-600 dark:text-indigo-400' },
  { key: 'rejected',    label: 'Rejected',       icon: FiXCircle,     bg: 'bg-rose-50 dark:bg-rose-950/40 border-rose-100 dark:border-rose-900/30',      text: 'text-rose-600 dark:text-rose-400' },
  { key: 'returned',    label: 'Returned',       icon: FiRotateCcw,   bg: 'bg-orange-50 dark:bg-orange-950/40 border-orange-100 dark:border-orange-900/30',text: 'text-orange-600 dark:text-orange-400' },
];

const DashboardCards = ({ stats }) => (
  <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
    {CARDS.map(({ key, label, icon: Icon, bg, text }) => (
      <div 
        key={key} 
        className="card-premium p-5 flex flex-col justify-between hover:shadow-lg dark:hover:shadow-primary-900/5 group border border-gray-150 dark:border-dark-border/40"
      >
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 leading-none">
            {label}
          </span>
          <div className={`w-8 h-8 ${bg} border rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
            <Icon className={`w-4 h-4 ${text}`} />
          </div>
        </div>
        <div className="mt-1">
          <p className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-none">
            {stats?.[key] ?? 0}
          </p>
          <span className="text-[10px] font-medium text-gray-400 dark:text-gray-500 block mt-2">
            Updated just now
          </span>
        </div>
      </div>
    ))}
  </div>
);

export default DashboardCards;

