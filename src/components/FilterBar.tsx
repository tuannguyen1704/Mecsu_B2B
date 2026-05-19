import React from 'react';
import { Download, LayoutGrid, SlidersHorizontal } from 'lucide-react';
import { motion } from 'motion/react';

const FilterBar = React.memo(() => {
  return (
    <div className="flex flex-col gap-2 bg-premium-surface px-8 py-4">
      {/* Main Filter Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-10">
          {/* Checkbox Filters */}
          <div className="flex items-center gap-8">
            {['Có Sẵn', 'Hàng Quốc Tế', 'Giảm Giá'].map((label) => (
              <label key={label} className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded-md border-premium-border text-brand-primary focus:ring-brand-primary/20 accent-brand-primary" />
                <span className="text-[13px] font-medium text-text-dim group-hover:text-text-main transition-colors">{label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div className="text-[13px] text-text-dim font-medium italic">
            Đang hiển thị <span className="font-bold text-text-main not-italic">67,284</span> linh kiện chính xác
          </div>
          
          <button className="flex items-center gap-3 px-5 py-2.5 border border-premium-border rounded-xl text-[12px] font-bold text-text-main hover:bg-premium-bg transition-all duration-300 uppercase tracking-widest">
            <SlidersHorizontal size={14} className="text-brand-primary" />
            Sắp xếp: Nổi bật
          </button>
        </div>
      </div>
    </div>
  );
});

export default FilterBar;
