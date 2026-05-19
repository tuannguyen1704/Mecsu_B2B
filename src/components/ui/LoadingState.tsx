import React from 'react';
import { cn } from '@utils';

interface LoadingStateProps {
  text?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  fullPage?: boolean;
}

export function LoadingState({
  text = 'Đang tải...',
  size = 'md',
  className,
  fullPage = false,
}: LoadingStateProps) {
  const spinnerSizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  if (fullPage) {
    return (
      <div className={cn('flex flex-col items-center justify-center min-h-[400px] w-full', className)}>
        {/* Spinner */}
        <div className="relative">
          <div
            className={cn(
              'border-4 border-slate-200 border-t-brand-secondary rounded-full animate-spin',
              spinnerSizes[size]
            )}
          />
        </div>
        {/* Text */}
        {text && (
          <p className={cn('text-slate-500 mt-4 font-medium', textSizes[size])}>
            {text}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col items-center justify-center py-8', className)}>
      <div
        className={cn(
          'border-4 border-slate-200 border-t-brand-secondary rounded-full animate-spin',
          spinnerSizes[size]
        )}
      />
      {text && (
        <p className={cn('text-slate-500 mt-3 font-medium', textSizes[size])}>
          {text}
        </p>
      )}
    </div>
  );
}

/**
 * Inline loading spinner for buttons
 */
export function ButtonSpinner({ size = 16 }: { size?: number }) {
  return (
    <svg
      className="animate-spin"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

/**
 * Skeleton loading for content areas
 */
export function SkeletonLoader({
  className,
  lines = 1,
}: {
  className?: string;
  lines?: number;
}) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-4 bg-slate-200 rounded animate-pulse"
          style={{ width: `${100 - i * 10}%` }}
        />
      ))}
    </div>
  );
}

/**
 * Card skeleton
 */
export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('bg-white rounded-lg border border-slate-200 p-4', className)}>
      {/* Image skeleton */}
      <div className="w-full h-40 bg-slate-200 rounded animate-pulse mb-4" />
      {/* Title skeleton */}
      <div className="h-4 bg-slate-200 rounded animate-pulse mb-2 w-3/4" />
      {/* Description skeleton */}
      <div className="h-3 bg-slate-200 rounded animate-pulse mb-2 w-1/2" />
      {/* Price skeleton */}
      <div className="h-6 bg-slate-200 rounded animate-pulse mt-4 w-1/3" />
    </div>
  );
}
