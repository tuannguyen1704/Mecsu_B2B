import React, { useState, useEffect } from 'react';
import { Star, X, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function RatingDetailsPopover() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800); // Skeleton load for 800ms
    return () => clearTimeout(timer);
  }, []);

  const ratings = [
    { stars: 5, percentage: 72 },
    { stars: 4, percentage: 12 },
    { stars: 3, percentage: 4 },
    { stars: 2, percentage: 3 },
    { stars: 1, percentage: 9 },
  ];

  return (
    <div className="w-[320px] bg-white rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.15)] border border-slate-200 p-4 relative overflow-hidden">
      <div className="absolute top-3 right-3 text-slate-400">
        <X size={18} className="cursor-pointer hover:text-slate-600" />
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="skeleton"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-3"
          >
            {/* Skeleton Header */}
            <div className="flex items-center gap-3">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="w-3.5 h-3.5 bg-slate-100 rounded-full animate-pulse" />
                ))}
              </div>
              <div className="h-5 w-24 bg-slate-100 rounded animate-pulse" />
            </div>
            <div className="h-3.5 w-32 bg-slate-100 rounded animate-pulse" />

            {/* Skeleton Rows */}
            <div className="space-y-2 pt-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="h-3.5 w-12 bg-slate-100 rounded animate-pulse" />
                  <div className="h-4 flex-1 bg-slate-100 rounded-full animate-pulse" />
                  <div className="h-3.5 w-8 bg-slate-100 rounded animate-pulse" />
                </div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3"
          >
            {/* Actual Content Header */}
            <div className="flex items-center gap-3">
              <div className="flex items-center text-[#ed6c2d]">
                {[1, 2, 3, 4].map((i) => (
                  <Star key={i} size={18} fill="currentColor" stroke="none" />
                ))}
                <Star size={18} fill="currentColor" fillOpacity={0.4} stroke="none" />
              </div>
              <span className="text-[18px] font-bold text-slate-900">4.3 out of 5</span>
            </div>
            <div className="text-[14px] text-slate-500">2,965 global ratings</div>

            {/* Rating Bars */}
            <div className="space-y-1.5 pt-1">
              {ratings.map((rating) => (
                <div key={rating.stars} className="flex items-center gap-3 group cursor-pointer">
                  <span className="text-[14px] text-[#007185] font-medium min-w-[50px] whitespace-nowrap hover:underline">
                    {rating.stars} star
                  </span>
                  <div className="flex-1 h-5 bg-white border border-slate-200 rounded-sm overflow-hidden relative">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${rating.percentage}%` }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                      className="absolute inset-0 bg-[#e47911]"
                    />
                  </div>
                  <span className="text-[14px] text-[#007185] font-medium w-8 text-right hover:underline">
                    {rating.percentage}%
                  </span>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="pt-3 mt-1 border-t border-slate-100 text-center">
              <button className="text-[14px] text-[#007185] font-medium hover:underline flex items-center justify-center gap-1 mx-auto group">
                See customer reviews
                <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pointer/Arrow */}
      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-t border-l border-slate-200 rotate-45" />
    </div>
  );
}
