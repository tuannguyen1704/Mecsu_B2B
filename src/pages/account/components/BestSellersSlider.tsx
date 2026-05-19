import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { Product } from '../../../types';
import { OptimizedImage } from '../../../components/ui/OptimizedImage';
import { useSupabaseImages } from '../../../hooks/useSupabaseImages';
import { cn } from '../../../lib/utils';

interface BestSellersSliderProps {
  products: Product[];
  title?: string;
}

export const BestSellersSlider: React.FC<BestSellersSliderProps> = ({ 
  products,
  title = 'Explore our best sellers'
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const { getRandomImage } = useSupabaseImages();

  const cardWidth = 280;
  const cardGap = 16;
  const visibleCards = 4;
  const totalPages = Math.ceil(products.length / visibleCards);

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
      
      // Calculate current page
      const newPage = Math.round(scrollLeft / ((cardWidth + cardGap) * visibleCards)) + 1;
      setCurrentPage(Math.min(Math.max(newPage, 1), totalPages));
    }
  };

  useEffect(() => {
    checkScroll();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScroll);
      window.addEventListener('resize', checkScroll);
    }
    return () => {
      if (container) {
        container.removeEventListener('scroll', checkScroll);
      }
      window.removeEventListener('resize', checkScroll);
    };
  }, [products, totalPages]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = (cardWidth + cardGap) * visibleCards;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price);
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E5EAF2] p-4 lg:p-6 w-full max-w-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 lg:mb-6">
        <div className="flex items-center gap-2 lg:gap-3">
          <Star size={20} className="text-[#FFC72C] fill-[#FFC72C] flex-shrink-0" />
          <h3 className="text-lg lg:text-xl font-bold text-slate-800 truncate">{title}</h3>
        </div>
        
        {/* Navigation & Pagination */}
        <div className="flex items-center gap-3 lg:gap-4 flex-shrink-0">
          <span className="text-xs lg:text-sm text-slate-500 hidden sm:block">
            {currentPage} of {totalPages}
          </span>
          <div className="flex items-center gap-1.5 lg:gap-2">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className={cn(
                "w-8 h-8 lg:w-10 lg:h-10 rounded-xl flex items-center justify-center transition-all",
                canScrollLeft
                  ? "bg-slate-100 hover:bg-slate-200 text-slate-700"
                  : "bg-slate-50 text-slate-300 cursor-not-allowed"
              )}
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className={cn(
                "w-8 h-8 lg:w-10 lg:h-10 rounded-xl flex items-center justify-center transition-all",
                canScrollRight
                  ? "bg-[#163F78] hover:bg-[#1a4a8a] text-white"
                  : "bg-slate-50 text-slate-300 cursor-not-allowed"
              )}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Products Slider */}
      <div 
        ref={scrollContainerRef}
        onScroll={checkScroll}
        className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth pb-2 min-w-0"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {products.map((product) => {
          const imageUrl = getRandomImage(product.name || product.id);
          
          return (
            <div 
              key={product.id}
              className="flex-shrink-0 w-[240px] lg:w-[280px] bg-white border border-[#E5EAF2] rounded-xl overflow-hidden hover:shadow-lg hover:border-slate-300 transition-all duration-300 group cursor-pointer min-w-0"
            >
              {/* Product Image */}
              <div className="relative aspect-square bg-slate-50 p-3 lg:p-4 flex items-center justify-center overflow-hidden min-w-0">
                {imageUrl ? (
                  <OptimizedImage
                    src={imageUrl}
                    alt={product.name}
                    className="max-h-full max-w-full transition-transform duration-500 group-hover:scale-110 object-contain"
                  />
                ) : (
                  <div className="w-20 h-20 lg:w-24 lg:h-24 bg-slate-200 rounded-lg" />
                )}
                
                {/* Discount Badge */}
                {product.discount && (
                  <div className="absolute top-2 left-2 lg:top-3 lg:left-3 px-1.5 lg:px-2 py-0.5 lg:py-1 bg-red-500 text-white text-[9px] lg:text-[10px] font-bold rounded">
                    -{product.discount}%
                  </div>
                )}
                
                {/* Quick Add Button */}
                <button className="absolute bottom-2 right-2 lg:bottom-3 lg:right-3 w-8 h-8 lg:w-10 lg:h-10 bg-[#163F78] hover:bg-[#1a4a8a] text-white rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                </button>
              </div>
              
              {/* Product Info */}
              <div className="p-3 lg:p-4 min-w-0 overflow-hidden">
                <p className="text-[8px] lg:text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1 truncate">
                  {product.brand}
                </p>
                <h4 className="text-xs lg:text-sm font-bold text-slate-800 line-clamp-2 leading-snug mb-1 lg:mb-2 min-h-[32px] lg:min-h-[40px]">
                  {product.name}
                </h4>
                <p className="text-[9px] lg:text-[10px] text-slate-500 mb-2 lg:mb-3 truncate">SKU: {product.sku}</p>
                
                {/* Price */}
                <div className="flex items-baseline gap-1.5 lg:gap-2 mb-2 lg:mb-3 min-w-0">
                  <span className="text-sm lg:text-lg font-bold text-[#163F78] truncate">
                    {formatPrice(product.price)} đ
                  </span>
                  {product.originalPrice && (
                    <span className="text-[9px] lg:text-xs text-slate-400 line-through truncate">
                      {formatPrice(product.originalPrice)} đ
                    </span>
                  )}
                </div>
                
                {/* Stock Status */}
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "px-1.5 lg:px-2 py-0.5 lg:py-1 text-[8px] lg:text-[9px] font-bold rounded whitespace-nowrap",
                    product.stock > 0
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-red-50 text-red-700"
                  )}>
                    {product.stock > 0 ? 'Còn hàng' : 'Hết hàng'}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination Dots */}
      <div className="flex items-center justify-center gap-2 mt-4 lg:mt-6">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => {
              if (scrollContainerRef.current) {
                scrollContainerRef.current.scrollTo({
                  left: (page - 1) * (cardWidth + cardGap) * visibleCards,
                  behavior: 'smooth'
                });
              }
            }}
            className={cn(
              "h-2 rounded-full transition-all",
              currentPage === page
                ? "w-5 lg:w-6 bg-[#163F78]"
                : "w-2 bg-slate-300 hover:bg-slate-400"
            )}
          />
        ))}
      </div>
    </div>
  );
};

export default BestSellersSlider;
