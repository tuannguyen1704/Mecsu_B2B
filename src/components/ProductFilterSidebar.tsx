import React, { useState, useMemo, useEffect } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  Search, 
  X, 
  Star, 
  Filter, 
  RotateCcw,
  Plus,
  Minus
} from 'lucide-react';
import { motion, AnimatePresence, useScroll, useSpring, useTransform } from 'motion/react';
import { useSearchParams } from 'react-router-dom';
import { BRANDS, ORIGINS } from '../constants';

interface FilterItem {
  id: string;
  label: string;
  count?: number;
}

interface FilterGroupProps {
  title: string;
  items: FilterItem[];
  selectedItems: string[];
  onToggle: (id: string) => void;
  searchable?: boolean;
  maxInitialItems?: number;
}

const FilterGroup: React.FC<FilterGroupProps> = ({ 
  title, 
  items, 
  selectedItems, 
  onToggle, 
  searchable = false,
  maxInitialItems = 6
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const filteredItems = useMemo(() => {
    if (!searchable || !searchQuery) return items;
    return items.filter(item => 
      item.label.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [items, searchable, searchQuery]);

  const displayItems = isExpanded ? filteredItems : filteredItems.slice(0, maxInitialItems);

  return (
    <div className="border-b border-slate-200 last:border-b-0">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-left py-4 px-5 hover:bg-slate-100 transition-colors group"
      >
        <span className="text-[15px] font-black text-[#1a1a1a] uppercase tracking-wider">{title}</span>
        <motion.div
           animate={{ rotate: isOpen ? 0 : -180 }}
           transition={{ duration: 0.2 }}
        >
          <ChevronDown size={14} className="text-slate-400 group-hover:text-slate-600" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-white"
          >
            <div className="px-5 pb-5 pt-1 space-y-2">
              {searchable && (
                <div className="relative mb-3">
                  <input
                    type="text"
                    placeholder={`Tìm ${title}...`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#f8f8f8] border border-slate-300 rounded-none py-2 pl-8 pr-3 text-sm focus:border-blue-600 transition-all outline-none font-medium placeholder:italic"
                  />
                  <Search size={12} className="absolute left-2.5 top-3 text-slate-400" />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2 top-2.5 text-slate-400 hover:text-slate-600"
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>
              )}

              <div className={`space-y-1.5 ${filteredItems.length > 8 ? 'max-h-[240px] overflow-y-auto pr-2 custom-scrollbar' : ''}`}>
                {displayItems.map((item) => (
                  <label 
                    key={item.id}
                    className="flex items-start group cursor-pointer py-0.5"
                  >
                    <div className="relative flex items-center mt-0.5">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        onChange={() => onToggle(item.id)}
                        className="peer h-4 w-4 rounded-none border-slate-300 text-slate-900 focus:ring-0 focus:ring-offset-0 cursor-pointer appearance-none border transition-all checked:bg-[#1a1a1a] checked:border-[#1a1a1a]"
                      />
                      <svg 
                        className="absolute h-4 w-4 pointer-events-none opacity-0 peer-checked:opacity-100 text-white p-0.5" 
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="4" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <div className="ml-3 flex-1 flex items-center justify-between min-w-0">
                      <span className={`text-[14px] transition-colors leading-tight ${selectedItems.includes(item.id) ? 'text-[#1a1a1a] font-black' : 'text-slate-600 group-hover:text-slate-900 font-bold'}`}>
                        {item.label}
                      </span>
                      {item.count !== undefined && (
                        <span className="ml-2 text-[12px] text-slate-400 font-bold tracking-tighter tabular-nums shrink-0">({item.count.toLocaleString()})</span>
                      )}
                    </div>
                  </label>
                ))}
              </div>

              {filteredItems.length > maxInitialItems && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-[11px] font-black text-blue-600 hover:text-blue-800 flex items-center mt-3 group uppercase tracking-widest border-t border-slate-100 pt-2 w-full"
                >
                  {isExpanded ? (
                    <><Minus size={10} className="mr-2" /> Thu gọn</>
                  ) : (
                    <><Plus size={10} className="mr-2" /> Xem thêm ({filteredItems.length - maxInitialItems})</>
                  )}
                </button>
              )}

              {filteredItems.length === 0 && (
                <p className="text-[11px] text-slate-400 italic py-2">Không tìm thấy kết quả</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const ProductFilterSidebar: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Parse filters from URL
  const activeFilters = useMemo(() => {
    const filters: Record<string, string[]> = {};
    for (const [key, value] of searchParams.entries()) {
      filters[key] = value.split(',');
    }
    return filters;
  }, [searchParams]);

  const toggleFilter = (key: string, id: string) => {
    const currentValues = activeFilters[key] || [];
    let newValues: string[];
    
    if (currentValues.includes(id)) {
      newValues = currentValues.filter(v => v !== id);
    } else {
      newValues = [...currentValues, id];
    }
    
    const newParams = new URLSearchParams(searchParams);
    if (newValues.length > 0) {
      newParams.set(key, newValues.join(','));
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const clearAllFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  const removeFilterChip = (key: string, value: string) => {
    const newValues = activeFilters[key].filter(v => v !== value);
    const newParams = new URLSearchParams(searchParams);
    if (newValues.length > 0) {
      newParams.set(key, newValues.join(','));
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  // Mock data for filters
  const mockBrands: FilterItem[] = BRANDS.map(b => ({ id: b.id, label: b.name, count: b.count || Math.floor(Math.random() * 500) }));
  const mockMaterials: FilterItem[] = [
    { id: 'steel', label: 'Thép', count: 1200 },
    { id: 'inox304', label: 'Inox 304', count: 850 },
    { id: 'inox316', label: 'Inox 316', count: 320 },
    { id: 'carbon-steel', label: 'Thép Carbon', count: 450 },
    { id: 'aluminum', label: 'Nhôm', count: 120 },
    { id: 'brass', label: 'Đồng', count: 85 }
  ];
  const mockOrigins: FilterItem[] = ORIGINS.map(o => ({ id: o.id, label: o.name, count: o.count }));
  const mockAvailability: FilterItem[] = [
    { id: 'in_stock', label: 'Sẵn hàng tại kho' },
    { id: 'express', label: 'Giao hàng nhanh 2H' },
    { id: 'preorder', label: 'Đặt hàng (7-14 ngày)' }
  ];

  const totalActiveCount = Object.values(activeFilters).reduce((acc, curr) => acc + curr.length, 0);

  return (
    <aside className="w-[300px] flex-shrink-0 lg:block hidden h-full">
      <div 
        className="sticky top-[80px] h-[calc(100vh-80px)] flex flex-col bg-[#f5f5f5] border-r border-slate-200 overflow-hidden"
      >
        {/* Header - Industrial style */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between shrink-0 bg-white">
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-[#1a1a1a]" />
            <span className="text-[15px] font-black text-[#1a1a1a] uppercase tracking-tighter">Bộ lọc nâng cao</span>
          </div>
          {totalActiveCount > 0 && (
            <button 
              onClick={clearAllFilters}
              className="text-[13px] font-black text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors uppercase tracking-widest"
            >
              <RotateCcw size={10} />
              Làm mới
            </button>
          )}
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar pb-12">
          {/* Active Chips - Dynamic and clean */}
          <AnimatePresence>
            {totalActiveCount > 0 && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-white px-5 py-4 border-b border-slate-200 overflow-hidden"
              >
                <div className="flex flex-wrap gap-1.5">
                  {Object.entries(activeFilters).map(([key, values]) => 
                    values.map(val => (
                      <button
                        key={`${key}-${val}`}
                        onClick={() => removeFilterChip(key, val)}
                        className="flex items-center gap-1.5 px-2 py-1 bg-white text-[#1a1a1a] text-[11px] font-black border border-slate-300 hover:border-slate-400 hover:bg-slate-50 transition-colors uppercase tracking-tight shadow-[1px_1px_0px_rgba(0,0,0,0.1)]"
                      >
                        {val}
                        <X size={10} className="text-slate-400" />
                      </button>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Filter Groups */}
          <div className="bg-white">
            <FilterGroup 
              title="Sẵn có & Giao hàng" 
              items={mockAvailability} 
              selectedItems={activeFilters['availability'] || []}
              onToggle={(id) => toggleFilter('availability', id)}
            />

            <FilterGroup 
              title="Thương hiệu" 
              items={mockBrands} 
              selectedItems={activeFilters['brand'] || []}
              onToggle={(id) => toggleFilter('brand', id)}
              searchable={false}
            />

            <FilterGroup 
              title="Vật liệu" 
              items={mockMaterials} 
              selectedItems={activeFilters['material'] || []}
              onToggle={(id) => toggleFilter('material', id)}
            />

            <FilterGroup 
              title="Xuất xứ" 
              items={mockOrigins} 
              selectedItems={activeFilters['origin'] || []}
              onToggle={(id) => toggleFilter('origin', id)}
              searchable
            />

            <div className="py-6 px-5 border-b border-slate-200">
               <h4 className="text-[15px] font-black text-[#1a1a1a] uppercase tracking-wider mb-4">Khoảng giá (VND)</h4>
               <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <input 
                      type="number" 
                      placeholder="Min" 
                      className="w-full bg-[#f8f8f8] border border-slate-300 rounded-none p-2.5 text-sm font-bold outline-none focus:border-blue-600 transition-colors"
                    />
                  </div>
                  <span className="text-slate-400 font-bold">-</span>
                  <div className="relative flex-1">
                    <input 
                      type="number" 
                      placeholder="Max" 
                      className="w-full bg-[#f8f8f8] border border-slate-300 rounded-none p-2.5 text-sm font-bold outline-none focus:border-blue-600 transition-colors"
                    />
                  </div>
               </div>
               <button className="w-full mt-4 bg-[#1a1a1a] text-white py-3 text-sm font-black uppercase tracking-[0.2em] hover:bg-black transition-all active:scale-[0.98]">
                  Áp dụng giá
               </button>
            </div>

            <div className="py-6 px-5 border-b border-slate-200">
               <h4 className="text-[15px] font-black text-[#1a1a1a] uppercase tracking-wider mb-4">Đánh giá khách hàng</h4>
               <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map(rating => (
                    <button 
                      key={rating}
                      className="flex items-center gap-3 w-full hover:bg-slate-50 py-1.5 transition-colors group"
                    >
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            size={14} 
                            className={i < rating ? "fill-[#ed6c2d] text-[#ed6c2d]" : "text-slate-200"} 
                          />
                        ))}
                      </div>
                      <span className="text-[14px] font-bold text-slate-500 group-hover:text-[#1a1a1a] transition-colors">
                        {rating === 5 ? 'Tất cả 5 sao' : `Từ ${rating} sao trở lên`}
                      </span>
                    </button>
                  ))}
               </div>
            </div>

            <div className="py-6 px-5 bg-[#f5f5f5]">
               <div className="p-4 bg-white border border-slate-200 border-dashed text-center">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                    Đang xem 25,482 sản phẩm<br/>trong danh mục này
                  </p>
               </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </aside>
  );
};
