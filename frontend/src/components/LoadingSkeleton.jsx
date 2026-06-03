import React from 'react';

export const CardSkeleton = () => (
  <div className="card-premium animate-pulse-subtle bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border/40 p-6 flex flex-col h-44">
    <div className="flex justify-between items-start mb-4">
      <div className="h-4 bg-gray-200 dark:bg-dark-border rounded w-2/3" />
      <div className="h-6 bg-gray-200 dark:bg-dark-border rounded w-16" />
    </div>
    <div className="h-3 bg-gray-200 dark:bg-dark-border rounded w-5/6 mb-2" />
    <div className="h-3 bg-gray-200 dark:bg-dark-border rounded w-1/2 mb-4" />
    <div className="mt-auto pt-3 border-t border-gray-100 dark:border-dark-border flex justify-between items-center">
      <div className="h-5 bg-gray-200 dark:bg-dark-border rounded w-24" />
      <div className="h-4 bg-gray-200 dark:bg-dark-border rounded w-12" />
    </div>
  </div>
);

export const TableSkeleton = () => (
  <div className="animate-pulse-subtle border border-gray-100 dark:border-dark-border/40 rounded-2xl overflow-hidden bg-white dark:bg-dark-card shadow-sm">
    <div className="bg-gray-50 dark:bg-dark-200 h-12 border-b border-gray-100 dark:border-dark-border/40 px-6 flex items-center justify-between">
      <div className="h-4 bg-gray-200 dark:bg-dark-border rounded w-20" />
      <div className="h-4 bg-gray-200 dark:bg-dark-border rounded w-28" />
      <div className="h-4 bg-gray-200 dark:bg-dark-border rounded w-20" />
      <div className="h-4 bg-gray-200 dark:bg-dark-border rounded w-16" />
      <div className="h-4 bg-gray-200 dark:bg-dark-border rounded w-24" />
    </div>
    <div className="divide-y divide-gray-50 dark:divide-dark-border/40">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="px-6 py-5 flex items-center justify-between">
          <div className="space-y-2 w-1/3">
            <div className="h-4 bg-gray-200 dark:bg-dark-border rounded w-3/4" />
            <div className="h-3 bg-gray-200 dark:bg-dark-border rounded w-1/2" />
          </div>
          <div className="h-4 bg-gray-200 dark:bg-dark-border rounded w-20" />
          <div className="h-4 bg-gray-200 dark:bg-dark-border rounded w-20" />
          <div className="h-6 bg-gray-200 dark:bg-dark-border rounded w-16" />
          <div className="h-4 bg-gray-200 dark:bg-dark-border rounded w-28" />
        </div>
      ))}
    </div>
  </div>
);

export const DashboardSkeleton = () => (
  <div className="space-y-8 animate-pulse-subtle">
    {/* Hero banner skeleton */}
    <div className="h-44 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-dark-border/40 dark:to-dark-border/20 rounded-3xl p-6 flex flex-col justify-between" />
    
    {/* Grid cards */}
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border/40 rounded-2xl p-5 h-28 flex flex-col justify-between">
          <div className="h-8 w-8 bg-gray-200 dark:bg-dark-border rounded-lg" />
          <div className="h-6 bg-gray-200 dark:bg-dark-border rounded w-1/2" />
          <div className="h-3 bg-gray-200 dark:bg-dark-border rounded w-3/4" />
        </div>
      ))}
    </div>

    {/* Split sections */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border/40 rounded-2xl p-6 h-80 flex flex-col justify-between">
        <div className="h-5 bg-gray-200 dark:bg-dark-border rounded w-1/3 mb-4" />
        <div className="flex-1 flex items-center justify-center">
          <div className="h-36 w-36 bg-gray-200 dark:bg-dark-border rounded-full" />
        </div>
      </div>
      <div className="bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border/40 rounded-2xl p-6 h-80 flex flex-col justify-between">
        <div className="h-5 bg-gray-200 dark:bg-dark-border rounded w-1/3 mb-4" />
        <div className="space-y-4 flex-1">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-10 bg-gray-200 dark:bg-dark-border rounded w-full" />
          ))}
        </div>
      </div>
    </div>
  </div>
);

export const DetailSkeleton = () => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-pulse-subtle">
    <div className="lg:col-span-2 space-y-6">
      <div className="bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border/40 rounded-2xl p-6 h-96 flex flex-col justify-between">
        <div>
          <div className="h-6 bg-gray-200 dark:bg-dark-border rounded w-1/2 mb-4" />
          <div className="h-4 bg-gray-200 dark:bg-dark-border rounded w-1/3 mb-6" />
          <div className="space-y-3">
            <div className="h-3 bg-gray-200 dark:bg-dark-border rounded w-full" />
            <div className="h-3 bg-gray-200 dark:bg-dark-border rounded w-full" />
            <div className="h-3 bg-gray-200 dark:bg-dark-border rounded w-4/5" />
          </div>
        </div>
        <div className="h-12 bg-gray-200 dark:bg-dark-border rounded-xl w-full" />
      </div>
    </div>
    <div className="bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border/40 rounded-2xl p-6 h-96 flex flex-col">
      <div className="h-5 bg-gray-200 dark:bg-dark-border rounded w-1/2 mb-6" />
      <div className="space-y-6 flex-1">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex gap-4">
            <div className="h-8 w-8 bg-gray-200 dark:bg-dark-border rounded-full shrink-0" />
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-gray-200 dark:bg-dark-border rounded w-1/3" />
              <div className="h-3 bg-gray-200 dark:bg-dark-border rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const LoadingSkeleton = ({ variant = 'cards' }) => {
  switch (variant) {
    case 'dashboard':
      return <DashboardSkeleton />;
    case 'table':
      return <TableSkeleton />;
    case 'detail':
      return <DetailSkeleton />;
    case 'cards':
    default:
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      );
  }
};

export default LoadingSkeleton;
