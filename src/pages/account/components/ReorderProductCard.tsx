import React from 'react';
import { ShoppingCart, RefreshCw, Check, Package } from 'lucide-react';
import { ReorderItem } from '../../../types';
import { StockBadge } from '../../../components/ui/Badge';
import { cn } from '../../../lib/utils';

interface ReorderProductCardProps {
  item: ReorderItem;
  isSelected?: boolean;
  onSelect?: (itemId: string, selected: boolean) => void;
  onAddToCart?: (item: ReorderItem) => void;
  onReorder?: (item: ReorderItem) => void;
}

export const ReorderProductCard: React.FC<ReorderProductCardProps> = ({
  item,
  isSelected = false,
  onSelect,
  onAddToCart,
  onReorder,
}) => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('vi-VN', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price) + ' đ';
  };

  const inStock = item.stock > 0;

  return (
    <div className={cn(
      "bg-white rounded-2xl border transition-all duration-300 overflow-hidden min-w-0",
      isSelected 
        ? "border-[#163F78] shadow-md ring-2 ring-[#163F78]/20" 
        : "border-[#E5EAF2] hover:border-slate-300 hover:shadow-md"
    )}>
      {/* Selection Header */}
      <div className="p-4 border-b border-[#E5EAF2] bg-slate-50/50">
        <div className="flex items-center justify-between gap-3 min-w-0">
          <label className="flex items-center gap-3 cursor-pointer min-w-0">
            <div 
              onClick={() => onSelect?.(item.id, !isSelected)}
              className={cn(
                "w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all cursor-pointer flex-shrink-0",
                isSelected 
                  ? "bg-[#163F78] border-[#163F78]" 
                  : "border-slate-300 hover:border-slate-400"
              )}
            >
              {isSelected && <Check size={14} className="text-white" />}
            </div>
            <span className="text-sm font-medium text-slate-700 truncate">Chọn sản phẩm</span>
          </label>
          <StockBadge inStock={inStock} stockCount={item.stock} showCount />
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4 min-w-0">
        <div className="flex gap-4 min-w-0">
          {/* Product Image */}
          <div className="w-20 h-20 bg-slate-100 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
            <Package size={28} className="text-slate-300" />
          </div>

          {/* Product Details */}
          <div className="flex-1 min-w-0 overflow-hidden">
            <h4 className="text-sm font-bold text-slate-800 line-clamp-2 leading-snug">
              {item.name}
            </h4>
            <p className="text-xs text-slate-500 mt-1 truncate">SKU: {item.sku}</p>
            
            <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
              <RefreshCw size={12} className="flex-shrink-0" />
              <span className="truncate">Lần mua: <span className="font-medium text-slate-700">{formatDate(item.lastPurchased)}</span></span>
            </div>

            <div className="mt-1 flex items-center gap-2">
              <span className="text-xs text-slate-500">Giá:</span>
              <span className="text-sm font-bold text-[#163F78] truncate">{formatPrice(item.lastPrice)}</span>
            </div>
          </div>
        </div>

        {/* Purchase Info */}
        <div className="mt-4 p-3 bg-slate-50 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500">Số lượng đã mua:</span>
            <span className="text-sm font-bold text-slate-800">{item.quantity}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-4 flex gap-2 min-w-0">
          <button
            onClick={() => onAddToCart?.(item)}
            disabled={!inStock}
            className={cn(
              "flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl font-bold text-xs transition-colors min-w-0",
              inStock 
                ? "bg-[#163F78] hover:bg-[#1a4a8a] text-white" 
                : "bg-slate-100 text-slate-400 cursor-not-allowed"
            )}
          >
            <ShoppingCart size={14} />
            <span className="truncate">Thêm giỏ</span>
          </button>
          <button
            onClick={() => onReorder?.(item)}
            disabled={!inStock}
            className={cn(
              "flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl font-bold text-xs transition-colors min-w-0",
              inStock 
                ? "bg-[#FFC72C] hover:bg-[#E8B931] text-[#111827]" 
                : "bg-slate-100 text-slate-400 cursor-not-allowed"
            )}
          >
            <RefreshCw size={14} />
            <span className="truncate">Mua lại</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReorderProductCard;
