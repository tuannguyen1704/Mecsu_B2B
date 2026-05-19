import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Package } from 'lucide-react';
import { Product } from '../../types';
import { useSupabaseImages } from '../../hooks/useSupabaseImages';
import { OptimizedImage } from '../ui/OptimizedImage';

interface SearchSuggestionDropdownProps {
  suggestions: Product[];
  isVisible: boolean;
  onSelect: (product: Product) => void;
  onViewAll: (keyword: string) => void;
  onSearch: (keyword: string) => void;
  searchKeyword: string;
}

export default function SearchSuggestionDropdown({
  suggestions,
  isVisible,
  onSelect,
  onViewAll,
  onSearch,
  searchKeyword,
}: SearchSuggestionDropdownProps) {
  const { getRandomImage } = useSupabaseImages();
  const hasResults = suggestions.length > 0;
  const showEmpty = isVisible && searchKeyword.trim().length > 0 && !hasResults;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.15 }}
          className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border border-slate-200 shadow-2xl z-[1000] overflow-hidden"
        >
          {/* Suggestions List */}
          {hasResults && (
            <div className="max-h-[400px] overflow-y-auto">
              {suggestions.map((product, index) => (
                <button
                  key={product.id}
                  onClick={() => onSelect(product)}
                  className="w-full flex items-center gap-4 px-4 py-3 hover:bg-slate-50 transition-colors text-left border-b border-slate-100 last:border-b-0 group"
                >
                  {/* Product Thumbnail */}
                  <div className="w-14 h-14 bg-white rounded-lg border border-slate-200 flex-shrink-0 flex items-center justify-center p-1 group-hover:bg-slate-50 transition-colors duration-200 overflow-hidden">
                    <OptimizedImage
                      src={getRandomImage(product.id) || undefined}
                      alt={product.name}
                      className="w-full h-full object-contain mix-blend-multiply"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-[13px] font-bold text-brand-secondary truncate group-hover:text-slate-900 transition-colors duration-200 leading-tight">
                          {product.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                            {product.brand}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {product.category}
                          </span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-[14px] font-black text-[#1a1a1a]">
                          {product.price.toLocaleString('vi-VN')} đ
                        </div>
                        {product.discount && product.discount > 0 && (
                          <div className="text-[11px] text-slate-400 line-through">
                            {product.originalPrice?.toLocaleString('vi-VN')} đ
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Empty State */}
          {showEmpty && (
            <div className="px-4 py-8 text-center">
              <Package className="w-12 h-12 mx-auto text-slate-300 mb-3" />
              <p className="text-[14px] font-medium text-slate-500">
                Không tìm thấy sản phẩm phù hợp
              </p>
              <p className="text-[12px] text-slate-400 mt-1">
                Thử từ khóa khác hoặc xem tất cả sản phẩm
              </p>
            </div>
          )}

          {/* View All Button */}
          {hasResults && (
            <div className="border-t border-slate-200 bg-slate-50/50 p-3">
              <button
                onClick={() => onViewAll(searchKeyword)}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-brand-secondary text-white rounded-lg font-bold text-[13px] hover:bg-[#002a55] transition-colors"
              >
                <Search size={16} />
                Xem tất cả kết quả cho "{searchKeyword}"
              </button>
            </div>
          )}

          {/* Quick Search Actions */}
          {searchKeyword.trim().length > 0 && (
            <div className="border-t border-slate-100 p-2 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 px-2">
                Nhấn Enter để tìm kiếm
              </span>
              <button
                onClick={() => onSearch(searchKeyword)}
                className="text-[11px] font-medium text-brand-primary hover:text-[#002a55] transition-colors px-2"
              >
                Tìm ngay
              </button>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
