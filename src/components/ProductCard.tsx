import React, { useState, useCallback } from 'react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { OptimizedImage } from './ui/OptimizedImage';
import { Product } from '../types';
import { useSupabaseImages } from '../hooks/useSupabaseImages';
import { generateProductUrl, toSlug } from '../lib/utils';
import { NotifyWhenAvailableModal } from './ui/NotifyWhenAvailableModal';
import { Toast } from './ui/Toast';

interface ProductCardProps {
  key?: string | number;
  product: Product;
  onAddToCart?: (qty: number) => void;
  onQuickView?: () => void;
  onViewDetails?: () => void;
  forceOutOfStock?: boolean;
}

interface ToastState {
  message: string;
  type: 'success' | 'error';
}

const ProductCard = React.memo(({ product, onAddToCart, onQuickView, onViewDetails, forceOutOfStock = false }: ProductCardProps) => {
  const [qty] = useState(1);
  const { getRandomImage } = useSupabaseImages();
  const navigate = useNavigate();
  const imageUrl = getRandomImage(product.name || product.id);
  
  // Notify modal state
  const [isNotifyModalOpen, setIsNotifyModalOpen] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);
  
  // Check if product is out of stock (either real or forced)
  const isOutOfStock = product.stock <= 0 || forceOutOfStock;

  // Generate slug for link - use existing slug or create from product name
  const productSlug = product.slug || toSlug(product.name || product.id);

  const handleAdd = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // If out of stock, open notify modal instead
    if (isOutOfStock) {
      setIsNotifyModalOpen(true);
      return;
    }
    
    if (onAddToCart) {
      onAddToCart(qty);
    }
  }, [isOutOfStock, onAddToCart, qty]);

  const handleQuickView = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onQuickView) onQuickView();
  }, [onQuickView]);

  const handleCardClick = useCallback((e: React.MouseEvent) => {
    // Only navigate if clicking directly on card (not on buttons)
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('a')) {
      return;
    }
    // Store product data in sessionStorage for the detail page
    sessionStorage.setItem('selectedProduct', JSON.stringify(product));
    if (onViewDetails) {
      onViewDetails(product);
    } else {
      const url = generateProductUrl(product);
      console.log('[DEBUG ProductCard] navigate to:', url);
      navigate(url);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [product, onViewDetails, navigate]);

  return (
    <>
      <motion.div
        layout
        className="flex flex-col group bg-white border border-slate-200 hover:border-brand-primary transition-all duration-500 overflow-hidden h-full font-sans hover:-translate-y-[2px] hover:shadow-xl"
      >
      <Link 
        to={`/san-pham/${productSlug}`}
        className="flex flex-col flex-1 cursor-pointer"
        onClick={handleCardClick}
      >
        {/* Image Container */}
        <div className="relative aspect-square p-4 flex items-center justify-center overflow-hidden bg-white group-hover:bg-slate-50/50 transition-colors duration-500">
          <OptimizedImage
            src={imageUrl || product.image} 
            alt={product.name} 
            className="max-h-full max-w-full transition-transform duration-700 group-hover:scale-110" 
          />

          
          {/* Availability Badge */}
          <div className="absolute top-4 left-4 flex gap-2">
             <span className={`text-[9px] font-bold capitalize tracking-widest px-2 py-1 border rounded-sm ${
               isOutOfStock 
                 ? 'bg-red-50 text-red-700 border-red-100' 
                 : 'bg-emerald-50 text-emerald-700 border-emerald-100'
             }`}>
               {isOutOfStock ? 'Hết hàng' : 'Sẵn kho'}
             </span>
          </div>

          {/* Brand/MPN Info */}
          <div className="absolute bottom-4 left-4 right-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 flex justify-between items-center bg-white/90 backdrop-blur-md p-3 border border-slate-200 shadow-lg">
             <div className="flex flex-col">
                <span className="text-[8px] font-bold text-slate-400 capitalize tracking-widest leading-none mb-1">Thương hiệu</span>
                <span className="text-[10px] font-bold text-brand-secondary">{product.brand}</span>
             </div>
             <button 
               onClick={handleQuickView}
               className="text-[9px] font-bold text-brand-primary capitalize tracking-widest hover:text-brand-secondary transition-colors"
             >
               Xem nhanh
             </button>
          </div>
        </div>

        {/* Product Information */}
        <div className="p-4 flex flex-col flex-1 gap-2 border-t border-slate-100">
          <div className="flex flex-col gap-1.5">
            <h4 className="text-[13px] font-bold text-slate-800 line-clamp-2 leading-snug tracking-tight group-hover:text-brand-primary transition-colors">
              {product.name}
            </h4>
            <div className="flex items-center gap-4">
               <span className="text-[10px] font-bold text-slate-400">SKU: {product.sku}</span>
               <span className="text-[10px] font-bold text-slate-400">|</span>
               <span className="text-[10px] font-bold text-brand-secondary tracking-widest">{product.origin}</span>
            </div>
          </div>

          <div className="mt-auto pt-3 border-t border-slate-50">
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-[18px] font-display font-black text-brand-secondary italic tracking-tighter">
                    {product.price.toLocaleString()} đ / cái
                  </span>
                </div>
                <div className={`text-[12px] font-bold ${isOutOfStock ? 'text-red-600' : 'text-green-700'}`}>
                  {isOutOfStock ? 'Hết hàng' : 'Sẵn hàng'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>

      {/* Add to Cart Button - Outside Link to prevent navigation */}
      <div className="px-4 pb-4">
        <button
          onClick={handleAdd}
          className={`w-full h-10 px-4 flex items-center justify-center transition-all duration-300 border font-bold uppercase text-[12px] tracking-tight ${
            isOutOfStock 
             ? 'border-slate-800 bg-white text-slate-800 hover:bg-slate-800 hover:text-white' 
             : 'bg-brand-primary border-brand-primary text-brand-secondary hover:bg-brand-primary/90'
          }`}
        >
          {isOutOfStock ? 'Nhắc tôi sau' : 'Thêm giỏ hàng'}
        </button>
      </div>
      </motion.div>

      {/* Notify When Available Modal */}
      <NotifyWhenAvailableModal
        isOpen={isNotifyModalOpen}
        onClose={() => setIsNotifyModalOpen(false)}
        product={product}
        onSuccess={() => {
          setToast({
            message: 'Đã đăng ký nhắc hàng. Chúng tôi sẽ gửi email khi sản phẩm có hàng trở lại.',
            type: 'success',
          });
        }}
      />

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
});

export default ProductCard;

