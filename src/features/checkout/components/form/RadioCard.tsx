import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@utils';

interface RadioCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  selected: boolean;
  onClick: () => void;
  badge?: string;
  helperText?: string;
  disabled?: boolean;
  className?: string;
}

export function RadioCard({
  icon,
  title,
  description,
  selected,
  onClick,
  badge,
  helperText,
  disabled = false,
  className,
}: RadioCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'w-full p-4 rounded-xl border-2 text-left transition-all flex items-start gap-4',
        disabled
          ? 'opacity-50 cursor-not-allowed border-slate-100 bg-slate-50/50'
          : selected
            ? 'border-brand-secondary bg-brand-secondary/5'
            : 'border-slate-200 hover:border-slate-300 bg-white',
        className
      )}
    >
      {/* Icon */}
      <div
        className={cn(
          'w-10 h-10 rounded-lg flex items-center justify-center shrink-0',
          disabled
            ? 'bg-slate-100 text-slate-400'
            : selected
              ? 'bg-brand-secondary text-white'
              : 'bg-slate-100 text-slate-500'
        )}
      >
        {icon}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={cn(
              'text-sm font-bold',
              disabled
                ? 'text-slate-400'
                : selected
                  ? 'text-brand-secondary'
                  : 'text-slate-900'
            )}
          >
            {title}
          </span>
          {badge && (
            <span className="px-2 py-0.5 bg-brand-primary/20 text-brand-secondary text-[10px] font-bold rounded">
              {badge}
            </span>
          )}
        </div>
        <p className="text-xs text-slate-500 mt-0.5">{description}</p>
        {helperText && (
          <p className="text-[11px] text-slate-400 mt-1 italic">{helperText}</p>
        )}
      </div>

      {/* Radio indicator */}
      <div
        className={cn(
          'w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0',
          disabled
            ? 'border-slate-300 bg-slate-100'
            : selected
              ? 'border-brand-secondary'
              : 'border-slate-300'
        )}
      >
        {selected && (
          <div className="w-2.5 h-2.5 rounded-full bg-brand-secondary" />
        )}
      </div>
    </button>
  );
}

/**
 * Grid layout for radio cards
 */
interface RadioCardGridProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3;
  className?: string;
}

export function RadioCardGrid({
  children,
  columns = 2,
  className,
}: RadioCardGridProps) {
  return (
    <div
      className={cn(
        'grid gap-3',
        columns === 3 ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1 md:grid-cols-2',
        className
      )}
    >
      {children}
    </div>
  );
}
