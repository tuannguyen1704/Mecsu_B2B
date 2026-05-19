import React from 'react';
import { cn } from '@utils';

interface PriceDisplayProps {
  price: number;
  originalPrice?: number;
  currency?: string;
  unit?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showDiscount?: boolean;
  showUnit?: boolean;
  className?: string;
  priceClassName?: string;
  originalPriceClassName?: string;
}

export function PriceDisplay({
  price,
  originalPrice,
  currency = 'đ',
  unit,
  size = 'md',
  showDiscount = true,
  showUnit = true,
  className,
  priceClassName,
  originalPriceClassName,
}: PriceDisplayProps) {
  const hasDiscount = originalPrice && originalPrice > price;
  const discountPercentage = hasDiscount
    ? Math.round(((originalPrice! - price) / originalPrice!) * 100)
    : 0;

  const sizeClasses = {
    sm: {
      price: 'text-sm',
      original: 'text-xs',
      unit: 'text-[10px]',
    },
    md: {
      price: 'text-base',
      original: 'text-xs',
      unit: 'text-[11px]',
    },
    lg: {
      price: 'text-xl',
      original: 'text-sm',
      unit: 'text-xs',
    },
    xl: {
      price: 'text-2xl',
      original: 'text-base',
      unit: 'text-sm',
    },
  };

  const classes = sizeClasses[size];

  return (
    <div className={cn('flex flex-col', className)}>
      <div className="flex items-baseline gap-1">
        {/* Current Price */}
        <span
          className={cn(
            'font-bold text-brand-secondary italic tracking-tight',
            classes.price,
            priceClassName
          )}
        >
          {price.toLocaleString('vi-VN')}
        </span>

        {/* Currency */}
        {showUnit && (
          <span className={cn('text-slate-500', classes.unit)}>{currency}</span>
        )}

        {/* Unit */}
        {unit && (
          <span className={cn('text-slate-400 ml-1', classes.unit)}>/ {unit}</span>
        )}
      </div>

      {/* Original Price & Discount */}
      {hasDiscount && (
        <div className="flex items-center gap-2">
          <span
            className={cn(
              'text-slate-400 line-through',
              classes.original,
              originalPriceClassName
            )}
          >
            {originalPrice!.toLocaleString('vi-VN')} {currency}
          </span>
          {showDiscount && (
            <span className="px-1.5 py-0.5 bg-red-50 text-red-600 text-[10px] font-bold rounded">
              -{discountPercentage}%
            </span>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Simple price only display
 */
export function SimplePrice({
  price,
  className,
}: {
  price: number;
  className?: string;
}) {
  return (
    <span className={cn('font-bold text-brand-secondary', className)}>
      {price.toLocaleString('vi-VN')}đ
    </span>
  );
}

/**
 * Price range display
 */
export function PriceRange({
  minPrice,
  maxPrice,
  currency = 'đ',
}: {
  minPrice: number;
  maxPrice: number;
  currency?: string;
}) {
  return (
    <div className="flex items-baseline gap-1 text-brand-secondary font-bold">
      <span>{minPrice.toLocaleString('vi-VN')}</span>
      {minPrice !== maxPrice && (
        <>
          <span className="text-slate-400">-</span>
          <span>{maxPrice.toLocaleString('vi-VN')}</span>
        </>
      )}
      <span className="text-slate-400 text-sm ml-1">{currency}</span>
    </div>
  );
}

/**
 * Total price display with label
 */
export function TotalPrice({
  label = 'Tổng cộng',
  price,
  currency = 'đ',
  size = 'lg',
  className,
}: {
  label?: string;
  price: number;
  currency?: string;
  size?: 'md' | 'lg' | 'xl';
  className?: string;
}) {
  const sizeClasses = {
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl',
  };

  return (
    <div className={cn('flex items-center justify-between', className)}>
      <span className="text-slate-700 font-medium">{label}</span>
      <span className={cn('font-black text-brand-secondary', sizeClasses[size])}>
        {price.toLocaleString('vi-VN')} {currency}
      </span>
    </div>
  );
}
