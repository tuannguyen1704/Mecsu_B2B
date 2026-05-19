import React from 'react';
import { ChevronUp, ShoppingCart } from 'lucide-react';
import { Product } from '../../types';
import { motion, AnimatePresence } from 'motion/react';
import { useSupabaseImages } from '../../hooks/useSupabaseImages';

interface StickyProductBarProps {
  product: Product;
  onAddToCart: (product: Product, quantity: number) => void;
  isVisible: boolean;
}

export default function StickyProductBar({ product, onAddToCart, isVisible }: StickyProductBarProps) {
  const { getRandomImage } = useSupabaseImages();
  const productImage = getRandomImage(product.id) || product.image || null;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100; // Adjusted for taller sticky bar
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: -120 }}
          animate={{ y: 0 }}
          exit={{ y: -120 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="fixed top-0 left-0 right-0 z-[3000] bg-white border-b border-slate-200"
        >
          <div className="max-w-[1500px] mx-auto px-4 lg:px-8">
            <div className="flex items-center justify-between py-2 h-[82px]">
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-14 h-14 shrink-0 bg-white border border-slate-100 rounded overflow-hidden p-1">
                  {productImage ? (
                    <img src={productImage} alt={product.name} className="w-full h-full object-contain" />
                  ) : (
                    <div className="w-full h-full bg-slate-50 flex items-center justify-center text-[10px] text-slate-300">
                      No Image
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex flex-col justify-center">
                  <div className="text-[11px] font-bold text-[#007185] uppercase leading-none mb-1">
                    {product.brand || 'MECSU'}
                  </div>
                  <h2 className="text-[15px] font-bold text-slate-900 line-clamp-1 truncate uppercase">
                    {product.name}
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-8 shrink-0 h-full">
                <div className="hidden xl:flex items-center gap-6 mr-4 h-full border-r border-slate-100 pr-8">
                  {['product-info', 'related-products', 'customer-reviews'].map((id, idx) => (
                    <button 
                      key={id}
                      onClick={() => scrollToSection(id)}
                      className="text-[12px] font-bold text-slate-500 hover:text-[#007185] uppercase tracking-tight"
                    >
                      {idx === 0 ? 'Thông tin sản phẩm' : idx === 1 ? 'Sản phẩm tương thích' : 'Đánh giá khách hàng'}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <span className="text-[20px] font-bold text-slate-900">{product.price.toLocaleString()}đ</span>
                    <span className="text-[12px] text-slate-500 ml-1">/ cái</span>
                  </div>
                  
                  <button 
                    onClick={() => onAddToCart(product, 1)}
                    className="flex items-center gap-2 px-8 py-3 bg-brand-primary border-brand-primary text-brand-secondary hover:bg-brand-primary/90 font-bold rounded-sm transition-colors text-[14px] uppercase shadow-sm"
                  >
                    <ShoppingCart size={18} />
                    <span>Thêm vào giỏ</span>
                  </button>

                  <button 
                    onClick={scrollToTop}
                    className="p-2 text-slate-400 hover:text-[#007185] transition-colors ml-2"
                  >
                    <ChevronUp size={24} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
