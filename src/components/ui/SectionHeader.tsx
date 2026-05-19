import React from 'react';
import { cn } from '../../lib/utils';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  titleClassName?: string;
}

export default function SectionHeader({ 
  title, 
  subtitle, 
  action, 
  children,
  className,
  titleClassName 
}: SectionHeaderProps) {
  return (
    <div className={cn("flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10", className)}>
      <div className="flex items-center gap-4">
        {children}
        <div className="space-y-1">
          <h2 className={cn("text-2xl font-black text-slate-900 uppercase tracking-tight", titleClassName)}>
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.15em]">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {action && (
        <div className="shrink-0">
          {action}
        </div>
      )}
    </div>
  );
}
