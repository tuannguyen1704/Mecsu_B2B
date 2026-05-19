import React, { useState } from 'react';
import { ShoppingCart, RefreshCw, CheckSquare, LayoutGrid, List } from 'lucide-react';
import { ReorderItem } from '../../../types';
import { ReorderProductCard } from './ReorderProductCard';
import { BestSellersSlider } from './BestSellersSlider';
import { MOCK_BEST_SELLERS } from '../../../data/mockAccountData';
import { cn } from '../../../lib/utils';

interface ReorderItemsTabProps {
  items: ReorderItem[];
  onAddToCart?: (item: ReorderItem) => void;
  onReorder?: (item: ReorderItem) => void;
}

export const ReorderItemsTab: React.FC<ReorderItemsTabProps> = ({
  items,
  onAddToCart,
  onReorder,
}) => {
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const handleSelectItem = (itemId: string, selected: boolean) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (selected) {
        newSet.add(itemId);
      } else {
        newSet.delete(itemId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedItems.size === items.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(items.map(item => item.id)));
    }
  };

  const handleBulkAddToCart = () => {
    const selectedItemObjects = items.filter(item => selectedItems.has(item.id));
    selectedItemObjects.forEach(item => onAddToCart?.(item));
    setSelectedItems(new Set());
  };

  const selectedCount = selectedItems.size;

  return (
    <div className="w-full max-w-full space-y-5">
      {/* Header Actions */}
      <div className="bg-white rounded-2xl border border-[#E5EAF2] p-4 lg:p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Selection Controls */}
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <div 
                onClick={handleSelectAll}
                className={cn(
                  "w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all cursor-pointer",
                  selectedItems.size === items.length && items.length > 0
                    ? "bg-[#163F78] border-[#163F78]" 
                    : "border-slate-300 hover:border-slate-400"
                )}
              >
                {(selectedItems.size === items.length && items.length > 0) && (
                  <CheckSquare size={14} className="text-white" />
                )}
              </div>
              <span className="text-sm font-medium text-slate-700">
                Chọn tất cả ({items.length})
              </span>
            </label>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                "p-2 rounded-lg transition-colors",
                viewMode === 'grid'
                  ? "bg-[#163F78] text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              )}
              title="Chế độ lưới"
            >
              <LayoutGrid size={18} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                "p-2 rounded-lg transition-colors",
                viewMode === 'list'
                  ? "bg-[#163F78] text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              )}
              title="Chế độ danh sách"
            >
              <List size={18} />
            </button>
          </div>
        </div>

        {/* Bulk Action */}
        {selectedCount > 0 && (
          <div className="mt-4 p-4 bg-[#163F78]/5 rounded-xl border border-[#163F78]/20">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className="text-sm font-medium text-[#163F78]">
                Đã chọn {selectedCount} sản phẩm
              </p>
              <button
                onClick={handleBulkAddToCart}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#FFC72C] hover:bg-[#E8B931] text-[#111827] rounded-xl font-bold text-sm transition-colors"
              >
                <ShoppingCart size={18} />
                Thêm các sản phẩm đã chọn vào giỏ
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Products Grid/List */}
      {items.length > 0 ? (
        <div className={cn(
          "grid gap-5 w-full max-w-full",
          viewMode === 'grid' 
            ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3" 
            : "grid-cols-1"
        )}>
          {items.map((item) => (
            <ReorderProductCard
              key={item.id}
              item={item}
              isSelected={selectedItems.has(item.id)}
              onSelect={handleSelectItem}
              onAddToCart={onAddToCart}
              onReorder={onReorder}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#E5EAF2] p-8 lg:p-12 text-center">
          <RefreshCw size={48} className="mx-auto text-slate-300 mb-4" />
          <h3 className="text-lg font-bold text-slate-700 mb-2">Chưa có sản phẩm mua lại</h3>
          <p className="text-sm text-slate-500">Các sản phẩm bạn đã từng mua sẽ xuất hiện tại đây</p>
        </div>
      )}

      {/* Best Sellers Section */}
      <BestSellersSlider products={MOCK_BEST_SELLERS} />
    </div>
  );
};

export default ReorderItemsTab;
