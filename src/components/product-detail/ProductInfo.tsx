import React, { useState, useRef } from 'react';
import { Star, ChevronDown, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Product } from '../../types';
import RatingDetailsPopover from './RatingDetailsPopover';
import { motion, AnimatePresence } from 'motion/react';

interface ProductInfoProps {
  product: Product;
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const [showRatingDetails, setShowRatingDetails] = useState(false);
  const timeoutRef = useRef<any>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setShowRatingDetails(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setShowRatingDetails(false);
    }, 150);
  };

  return (
    <div className="font-sans text-[#222]">
      {/* Title */}
      <h1 className="text-[32px] font-bold leading-tight mb-2 uppercase">
        {product.name}
      </h1>
      
      {/* Manufacturer IDs */}
      <div className="flex gap-6 text-[14px] text-[#666] mb-4 font-medium uppercase tracking-tighter">
        <span>Mfr # {product.sku}</span>
        <span>Zoro # G{Math.floor(Math.random() * 9000000) + 1000000}</span>
      </div>

      {/* Ratings with Popover */}
      <div className="flex items-center gap-2 mb-4 border-b border-slate-200 pb-3 relative">
        <div 
          className="flex items-center gap-2 relative"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="flex items-center text-[#ed6c2d] cursor-pointer">
            {[1, 2, 3, 4].map(i => <Star key={i} size={18} fill="currentColor" stroke="none" />)}
            <Star size={18} fill="currentColor" fillOpacity={0.4} stroke="none" />
            <ChevronDown size={14} className="ml-1 text-slate-500" />
          </div>
          <Link to="#" className="text-[#007185] hover:underline text-[15px] font-bold">
            51 ratings
          </Link>

          <AnimatePresence>
            {showRatingDetails && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-full left-0 mt-2 z-[2000]"
              >
                <RatingDetailsPopover />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <span className="text-slate-300 ml-1">|</span>
        <Link to="#" className="text-[#007185] hover:underline text-[15px] font-bold ml-1">
          Write a Review
        </Link>
      </div>

      {/* Price Section */}
      <div className="mb-4">
        <div className="flex items-baseline gap-1">
          <span className="text-[42px] font-bold text-[#222]">{product.price.toLocaleString()}đ</span>
          <span className="text-[16px] text-[#666]">/ cái</span>
        </div>
      </div>

    </div>
  );
}
