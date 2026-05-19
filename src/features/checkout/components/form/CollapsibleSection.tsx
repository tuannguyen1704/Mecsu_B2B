import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@utils';

interface CollapsibleSectionProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  isExpanded: boolean;
  onToggle?: () => void;
  defaultExpanded?: boolean;
  children: React.ReactNode;
  className?: string;
  headerClassName?: string;
}

export function CollapsibleSection({
  title,
  subtitle,
  icon,
  isExpanded,
  onToggle,
  defaultExpanded = false,
  children,
  className,
  headerClassName,
}: CollapsibleSectionProps) {
  const [hasBeenExpanded, setHasBeenExpanded] = useState(defaultExpanded);
  const shouldShowContent = isExpanded || hasBeenExpanded;

  const handleToggle = () => {
    setHasBeenExpanded(true);
    if (onToggle) onToggle();
  };

  return (
    <div
      className={cn(
        'bg-white rounded-2xl border border-slate-200 overflow-hidden',
        className
      )}
    >
      {/* Header */}
      <button
        type="button"
        onClick={handleToggle}
        className={cn(
          'w-full flex items-center justify-between p-6 hover:bg-slate-50/50 transition-colors',
          headerClassName
        )}
      >
        <div className="flex items-center gap-3">
          {icon && (
            <div className="w-10 h-10 rounded-xl bg-brand-secondary/10 flex items-center justify-center">
              <span className="text-brand-secondary">{icon}</span>
            </div>
          )}
          <div className="text-left">
            <h2 className="text-lg font-bold text-slate-900">{title}</h2>
            {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
          </div>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={20} className="text-slate-400" />
        </motion.div>
      </button>

      {/* Content */}
      <AnimatePresence>
        {shouldShowContent && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 border-t border-slate-100 pt-4">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
