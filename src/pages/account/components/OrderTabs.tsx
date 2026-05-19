import React from 'react';
import { cn } from '../../../lib/utils';

type TabId = 'orders' | 'reorder' | 'returns';

interface Tab {
  id: TabId;
  label: string;
  count?: number;
}

interface OrderTabsProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  counts?: {
    orders: number;
    reorder: number;
    returns: number;
  };
}

const tabs: Tab[] = [
  { id: 'orders', label: 'Đơn hàng' },
  { id: 'reorder', label: 'Mua lại' },
  { id: 'returns', label: 'Đổi trả' },
];

export const OrderTabs: React.FC<OrderTabsProps> = ({ activeTab, onTabChange, counts }) => {
  return (
    <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl w-fit">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const count = counts?.[tab.id === 'orders' ? 'orders' : tab.id === 'reorder' ? 'reorder' : 'returns'];

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 ease-out",
              isActive
                ? "bg-[#163F78] text-white shadow-md"
                : "bg-transparent text-slate-600 hover:bg-white hover:text-slate-900"
            )}
          >
            <span className="flex items-center gap-2">
              {tab.label}
              {count !== undefined && count > 0 && (
                <span className={cn(
                  "px-2 py-0.5 text-[10px] rounded-full",
                  isActive 
                    ? "bg-white/20 text-white" 
                    : "bg-slate-200 text-slate-600"
                )}>
                  {count}
                </span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default OrderTabs;
