import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { cn } from '@utils';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
  separator?: React.ReactNode;
}

export function Breadcrumb({
  items,
  className,
  separator = <ChevronRight size={14} className="mx-2 text-slate-400" />,
}: BreadcrumbProps) {
  return (
    <nav className={cn('flex items-center text-sm text-slate-500 font-medium', className)}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <React.Fragment key={index}>
            {index > 0 && separator}
            {isLast || !item.href ? (
              <span
                className={cn(
                  isLast && 'text-slate-900 font-bold line-clamp-1'
                )}
              >
                {item.label}
              </span>
            ) : (
              <Link
                to={item.href}
                className="hover:text-blue-600 transition-colors"
              >
                {item.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
