import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '../../../lib/utils';

interface StatCardProps {
  icon: LucideIcon;
  value: number | string;
  label: string;
  className?: string;
  iconColor?: 'navy' | 'yellow' | 'green' | 'blue' | 'purple' | 'red';
  /** Override icon wrapper classes (bg + text) e.g. 'bg-[#DBEAFE] text-[#2563EB]' */
  iconWrapperClass?: string;
  /** Override value text classes e.g. 'text-[32px] text-[#020617]' */
  valueClassName?: string;
}

const iconColorClasses: Record<string, string> = {
  navy:   'bg-[#163F78]/10 text-[#163F78]',
  yellow: 'bg-[#FFC72C]/20 text-[#B8941F]',
  green:  'bg-green-100 text-green-600',
  blue:   'bg-blue-100 text-blue-600',
  purple: 'bg-purple-100 text-purple-600',
  red:    'bg-red-100 text-red-600',
};

export const StatCard: React.FC<StatCardProps> = ({
  icon: Icon,
  value,
  label,
  className,
  iconColor = 'navy',
  iconWrapperClass,
  valueClassName,
}) => {
  return (
    <div className={cn(
      "bg-white rounded-md border border-slate-200 p-3 lg:p-3.5 hover:border-[#163F78]/30 transition-all duration-300 group",
      className
    )}>
      <div className="flex items-start justify-between gap-3">
        <div className={cn(
          "w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110",
          iconWrapperClass ?? iconColorClasses[iconColor]
        )}>
          <Icon size={20} />
        </div>
      </div>
      
      <div className="mt-2">
        <p className={cn("text-2xl lg:text-3xl font-bold text-slate-900", valueClassName)}>{value}</p>
        <p className="text-sm text-slate-500 mt-0.5">{label}</p>
      </div>
    </div>
  );
};

export default StatCard;
