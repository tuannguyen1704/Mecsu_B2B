import React from 'react';
import { Link } from 'react-router-dom';
import { LucideIcon, ChevronRight } from 'lucide-react';
import { cn } from '../../../lib/utils';

interface AccountCardProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  href: string;
  className?: string;
  iconColor?: 'navy' | 'yellow' | 'green' | 'blue' | 'purple' | 'red';
  badge?: string | number;
}

const iconColorClasses = {
  navy: 'bg-[#163F78]/10 text-[#163F78]',
  yellow: 'bg-[#FFC72C]/20 text-[#B8941F]',
  green: 'bg-green-100 text-green-600',
  blue: 'bg-blue-100 text-blue-600',
  purple: 'bg-purple-100 text-purple-600',
  red: 'bg-red-100 text-red-600',
};

export const AccountCard: React.FC<AccountCardProps> = ({
  icon: Icon,
  title,
  description,
  href,
  className,
  iconColor = 'navy',
  badge,
}) => {
  return (
    <Link
      to={href}
      className={cn(
        "bg-white rounded-2xl border border-slate-200 p-5 hover:border-[#163F78]/30 transition-all duration-300 group block",
        className
      )}
    >
      <div className="flex items-start gap-4">
        <div className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110",
          iconColorClasses[iconColor]
        )}>
          <Icon size={22} />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-slate-900 group-hover:text-[#163F78] transition-colors">
              {title}
            </h3>
            {badge !== undefined && (
              <span className="px-2 py-0.5 text-xs font-semibold bg-slate-100 text-slate-600 rounded-full">
                {badge}
              </span>
            )}
          </div>
          {description && (
            <p className="text-sm text-slate-500 mt-1 line-clamp-2">{description}</p>
          )}
        </div>
        
        <ChevronRight 
          size={18} 
          className="text-slate-300 group-hover:text-[#163F78] group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" 
        />
      </div>
    </Link>
  );
};

export default AccountCard;
