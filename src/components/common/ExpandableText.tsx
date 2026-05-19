import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@utils';

interface ExpandableTextProps {
  text: string;
  maxLines?: number;
  className?: string;
  expandText?: string;
  collapseText?: string;
}

export function ExpandableText({
  text,
  maxLines = 3,
  className,
  expandText = 'Xem thêm',
  collapseText = 'Thu gọn',
}: ExpandableTextProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Estimate line height (assuming ~1.5rem line height)
  const lineHeight = 1.5;
  const maxHeight = maxLines * lineHeight;

  return (
    <div className={cn('relative', className)}>
      <div
        className={cn(
          'text-slate-600 text-sm leading-relaxed overflow-hidden transition-all duration-300',
          !isExpanded && 'line-clamp-' + maxLines
        )}
        style={{}}
      >
        {text}
      </div>

      {/* Gradient overlay when collapsed */}
      {!isExpanded && (
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent pointer-events-none" />
      )}

      {/* Toggle button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="text-sm text-blue-600 hover:text-blue-700 font-medium mt-2"
      >
        {isExpanded ? (
          <span className="flex items-center gap-1">
            <ChevronUp size={14} />
            {collapseText}
          </span>
        ) : (
          <span className="flex items-center gap-1">
            <ChevronDown size={14} />
            {expandText}
          </span>
        )}
      </button>
    </div>
  );
}

/**
 * Simple expand/collapse for sections
 */
interface ExpandableSectionProps {
  title: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  className?: string;
}

export function ExpandableSection({
  title,
  children,
  defaultExpanded = false,
  className,
}: ExpandableSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className={cn('', className)}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between py-3 border-b border-slate-200"
      >
        <span className="font-medium text-slate-900">{title}</span>
        {isExpanded ? (
          <ChevronUp size={18} className="text-slate-400" />
        ) : (
          <ChevronDown size={18} className="text-slate-400" />
        )}
      </button>

      {isExpanded && <div className="py-4">{children}</div>}
    </div>
  );
}
