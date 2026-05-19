import React from 'react';

export const PageSkeleton = () => (
  <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-12 animate-pulse">
      {/* Breadcrumb Skeleton */}
      <div className="h-4 w-48 bg-slate-100 rounded mb-8" />

      {/* Hero Skeleton */}
      <div className="bg-slate-50 p-12 rounded-3xl mb-12 h-64" />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* Left Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <div className="h-8 w-48 bg-slate-100 rounded mb-6" />
          {[...Array(6)].map((_, i) => <div key={i} className="h-6 w-full bg-slate-100 rounded" />)}
        </div>

        {/* Right Content */}
        <div className="lg:col-span-3">
          <div className="h-8 w-48 bg-slate-100 rounded mb-8" />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-48 h-48 rounded-full bg-slate-100 mb-4" />
                <div className="h-6 w-32 bg-slate-100 rounded mb-2" />
                <div className="h-4 w-24 bg-slate-100 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
);
