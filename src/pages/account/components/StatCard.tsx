import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '../../../lib/utils';

interface StatCardProps {
  icon: LucideIcon;
  value: number | string;
  label: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  iconColor?: 'navy' | 'yellow' | 'green' | 'blue' | 'purple' | 'red';
}

const iconColorClasses = {
  navy: 'bg-[#163F78]/10 text-[#163F78]',
  yellow: 'bg-[#FFC72C]/20 text-[#B8941F]',
  green: 'bg-green-100 text-green-600',
  blue: 'bg-blue-100 text-blue-600',
  purple: 'bg-purple-100 text-purple-600',
  red: 'bg-red-100 text-red-600',
};

export const StatCard: React.FC<StatCardProps> = ({
  icon: Icon,
  value,
  label,
  trend,
  className,
  iconColor = 'navy',
}) => {
  return (
    <div className={cn(
      "bg-white rounded-2xl border border-slate-200 p-5 hover:border-[#163F78]/30 transition-all duration-300 group",
      className
    )}>
      <div className="flex items-start justify-between gap-4">
        <div className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110",
          iconColorClasses[iconColor]
        )}>
          <Icon size={22} />
        </div>
        
        {trend && (
          <div className={cn(
            "flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full",
            trend.isPositive 
              ? "bg-green-100 text-green-600" 
              : "bg-red-100 text-red-600"
          )}>
            <span>{trend.isPositive ? '+' : '-'}{trend.value}%</span>
          </div>
        )}
      </div>
      
      <div className="mt-4">
        <p className="text-3xl font-bold text-slate-900">{value}</p>
        <p className="text-sm text-slate-500 mt-1">{label}</p>
      </div>
    </div>
  );
};

export default StatCard;
