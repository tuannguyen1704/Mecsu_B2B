import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home, ArrowLeft } from 'lucide-react';
import { cn } from '../../../lib/utils';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
  className?: string;
  showHome?: boolean;
  showBackButton?: boolean;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items = [], className, showHome = true, showBackButton = false }) => {
  const location = useLocation();

  if (showBackButton) {
    return (
      <nav className={cn('flex items-center text-sm', className)}>
        <Link
          to="/"
          className="flex items-center gap-1.5 text-slate-500 hover:text-[#163F78] transition-colors font-medium"
        >
          <ArrowLeft size={16} className="text-slate-400" />
          <span>Quay lại</span>
        </Link>
      </nav>
    );
  }
  
  const defaultItems: BreadcrumbItem[] = showHome
    ? [
        { label: 'Trang chủ', href: '/' },
        { label: 'Tài khoản', href: '/tai-khoan' },
        ...items
      ]
    : items;

  return (
    <nav className={cn('flex items-center text-sm', className)}>
      {defaultItems.map((item, index) => {
        const isLast = index === defaultItems.length - 1;

        return (
          <React.Fragment key={index}>
            {index > 0 && (
              <ChevronRight size={14} className="mx-2 text-slate-400 flex-shrink-0" />
            )}
            
            {isLast || !item.href ? (
              <span
                className={cn(
                  "transition-colors truncate",
                  isLast 
                    ? "text-[#163F78] font-semibold" 
                    : "text-slate-500"
                )}
              >
                {item.label}
              </span>
            ) : (
              <Link
                to={item.href}
                className="text-slate-500 hover:text-[#163F78] transition-colors duration-200 flex items-center gap-1 truncate"
              >
                {index === 0 && <Home size={14} className="mr-1 flex-shrink-0" />}
                {item.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumbs;
