import React from 'react';
import { cn } from '@utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'outline' | 'primary';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  className,
}: BadgeProps) {
  const variants = {
    default: 'bg-slate-100 text-slate-700',
    primary: 'bg-brand-secondary text-white',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
    warning: 'bg-amber-50 text-amber-700 border border-amber-100',
    danger: 'bg-red-50 text-red-700 border border-red-100',
    info: 'bg-blue-50 text-blue-700 border border-blue-100',
    outline: 'bg-transparent border border-slate-200 text-slate-600',
  };

  const sizes = {
    sm: 'text-[9px] px-1.5 py-0.5',
    md: 'text-[10px] px-2 py-0.5',
    lg: 'text-xs px-2.5 py-1',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center font-semibold uppercase tracking-wider rounded',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  );
}

/**
 * Stock status badge
 */
export function StockBadge({
  inStock,
  stockCount,
  showCount = false,
}: {
  inStock: boolean;
  stockCount?: number;
  showCount?: boolean;
}) {
  if (!inStock) {
    return (
      <Badge variant="danger" size="sm">
        Hết hàng
      </Badge>
    );
  }

  if (showCount && stockCount !== undefined) {
    return (
      <Badge variant="success" size="sm">
        Còn {stockCount}
      </Badge>
    );
  }

  return (
    <Badge variant="success" size="sm">
      Sẵn kho
    </Badge>
  );
}

/**
 * Discount badge
 */
export function DiscountBadge({
  percentage,
  className,
}: {
  percentage: number;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'absolute top-2 left-2 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded shadow-sm',
        className
      )}
    >
      -{percentage}%
    </span>
  );
}

/**
 * Featured/NEW badge
 */
export function FeaturedBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'px-2 py-1 bg-brand-secondary text-white text-[10px] font-bold uppercase tracking-wider rounded',
        className
      )}
    >
      Nổi bật
    </span>
  );
}

/**
 * B2B badge
 */
export function B2BBadge({ className }: { className?: string }) {
  return (
    <Badge variant="info" size="sm" className={cn('bg-blue-50 text-blue-700', className)}>
      B2B
    </Badge>
  );
}
