import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingCart, Heart } from 'lucide-react';
import { Badge } from './ui/Badge';
import { Product } from '../types';

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart?: (product: Product, quantity: number) => void;
}

import { PRODUCTS } from '../constants';

export default function QuickViewModal({ product, isOpen, onClose, onAddToCart }: QuickViewModalProps) {
  const [modalQty, setModalQty] = React.useState(1);
  const detailsRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setModalQty(1);
    if (detailsRef.current) {
      detailsRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [product?.id]);

  if (!product) return null;

  const relatedProducts = PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(0, 6);

  const specs = [
    { label: 'Hệ Kích Thước', value: 'Met' },
    { label: 'Xuất Xứ', value: product.origin || 'Trung Quốc' },
    { label: 'Xử Lý Bề Mặt', value: 'Nhiệt Luyện (Đen)' },
    { label: 'Size Ren', value: 'M6' },
    { label: 'Chiều Dài', value: '10 mm' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-5xl bg-white rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(15,23,42,0.2)] overflow-hidden flex flex-col md:flex-row max-h-[92vh] border border-premium-border"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 z-40 p-2.5 bg-white/80 backdrop-blur-md shadow-xl hover:bg-slate-900 hover:text-white text-slate-900 rounded-full transition-all duration-300 border border-slate-100 group"
            >
              <X size={18} className="group-hover:rotate-90 transition-transform duration-500" />
            </button>

            {/* Product Image Section */}
            <div className="md:w-[45%] p-12 bg-slate-50/50 flex items-center justify-center relative overflow-hidden shrink-0 border-r border-slate-100">
               <motion.img 
                 initial={{ scale: 0.8, opacity: 0 }}
                 animate={{ scale: 1, opacity: 1 }}
                 transition={{ delay: 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                 src={product.image} 
                 alt={product.name} 
                 className="w-full h-auto max-h-[480px] object-contain mix-blend-multiply transition-transform hover:scale-110 duration-1000"
               />
               
               {/* Accent decoration */}
               <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-slate-200/20 rounded-full blur-[100px] pointer-events-none" />
               <div className="absolute top-0 left-0 p-10">
                 <div className="text-[10px] font-black uppercase tracking-[0.6em] text-slate-200 vertical-rl">
                   INDUSTRIAL PRECISION
                 </div>
               </div>
            </div>

            {/* Product Details Section */}
            <div ref={detailsRef} className="flex-1 p-10 overflow-y-auto custom-scrollbar flex flex-col bg-white">
              <div className="mb-4 flex items-center gap-3">
                <Badge variant="success" className="bg-emerald-50 text-emerald-600 border border-emerald-100 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider">
                   Tồn kho sẵn có
                </Badge>
                <div className="h-1 w-1 bg-slate-200 rounded-full" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tiêu chuẩn Nhật Bản</span>
              </div>

              <h2 className="text-3xl font-display font-bold text-slate-900 leading-[1.1] mb-2 tracking-tight">
                {product.name}
              </h2>

              <div className="flex items-center gap-4 mb-8">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  SKU: <span className="text-slate-900">#{product.sku}</span>
                </p>
                <div className="w-px h-3 bg-slate-200" />
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  MPN: <span className="text-slate-900">B02M06010</span>
                </p>
              </div>

              <div className="flex items-baseline gap-4 mb-10">
                <div className="flex flex-col">
                  <span className="text-[9px] font-black text-brand-primary uppercase tracking-[0.3em] mb-1.5 px-0.5">Đơn giá ưu đãi</span>
                  <div className="flex items-baseline gap-3">
                    <span className="text-4xl font-display font-black text-slate-900">
                      {product.price.toLocaleString()}đ
                    </span>
                    <span className="text-slate-400 text-sm font-medium tracking-tight">/ cái</span>
                    {product.originalPrice && (
                      <span className="text-base text-slate-300 line-through font-medium ml-2">
                        {product.originalPrice.toLocaleString()}đ
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Technical Specs Section */}
              <div className="mb-12 p-8 rounded-[2rem] bg-slate-50 border border-slate-100 group/specs relative overflow-hidden">
                <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.4em] mb-8 flex items-center justify-between">
                  Thông số kỹ thuật
                  <div className="w-12 h-[1px] bg-slate-200" />
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-12">
                  {specs.map((spec, idx) => (
                    <div key={idx} className="flex justify-between items-center border-b border-slate-200/40 pb-2.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em]">{spec.label}</span>
                      <span className="text-[11px] font-black text-slate-900">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Controls: Qty & Action */}
              <div className="flex flex-col gap-6 mt-auto">
                <div className="flex items-center gap-4">
                   <div className="flex items-center h-14 border border-slate-200 rounded-2xl overflow-hidden bg-slate-50/50 shadow-sm">
                      <button 
                        onClick={() => setModalQty(Math.max(1, modalQty - 1))}
                        className="w-12 flex items-center justify-center hover:bg-white transition-all text-slate-400 active:scale-95"
                      >
                        <span className="text-xl font-light">−</span>
                      </button>
                      <input 
                        type="text" 
                        value={modalQty} 
                        readOnly 
                        className="w-14 text-center font-black text-slate-900 bg-transparent outline-none text-base" 
                      />
                      <button 
                        onClick={() => setModalQty(modalQty + 1)}
                        className="w-12 flex items-center justify-center hover:bg-white transition-all text-slate-400 active:scale-95"
                      >
                        <span className="text-xl font-light">+</span>
                      </button>
                   </div>
                   <button 
                    onClick={() => {
                      if (onAddToCart && product) {
                        onAddToCart(product, modalQty);
                        onClose();
                      }
                    }}
                    className="flex-1 h-14 bg-brand-primary border-brand-primary text-brand-secondary rounded-2xl font-bold text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-brand-primary/90 transition-all duration-500 shadow-xl shadow-slate-900/10 group active:scale-[0.98]"
                  >
                    <ShoppingCart size={15} className="group-hover:-rotate-12 transition-transform" />
                    Thêm vào giỏ hàng
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-6 mt-2 border-t border-slate-50">
                  <button
                    className="h-12 bg-white border border-slate-200 text-slate-600 rounded-2xl font-bold text-[9px] uppercase tracking-[0.2em] transition-all hover:bg-slate-50 active:scale-95 flex items-center justify-center"
                  >
                    Xem chi tiết
                  </button>
                  <button
                    className="h-12 border border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-100 hover:bg-red-50 rounded-2xl flex items-center justify-center gap-2 transition-all duration-300 active:scale-95 font-bold text-[9px] uppercase tracking-[0.2em]"
                  >
                    <Heart size={14} />
                    Lưu ưa thích
                  </button>
                </div>
              </div>


              {/* Related Products Section */}
              {relatedProducts.length > 0 && (
                <div className="mt-20 pt-12 border-t border-slate-50">
                  <div className="flex items-center justify-between mb-10">
                    <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.5em] flex items-center gap-5">
                       <div className="w-1.5 h-1.5 bg-brand-primary rounded-full shadow-[0_0_8px_rgba(var(--brand-primary),0.5)]" />
                       Hệ sinh thái liên quan
                    </h3>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                    {relatedProducts.map((p) => (
                      <motion.div
                        key={p.id}
                        whileHover={{ y: -8 }}
                        className="group flex flex-col p-4 bg-slate-50 rounded-[2rem] border border-transparent cursor-pointer transition-all hover:border-slate-200 hover:shadow-2xl hover:shadow-slate-200/50 hover:bg-white"
                      >
                        <div className="aspect-square bg-transparent rounded-2xl mb-5 flex items-center justify-center p-4 relative overflow-hidden">
                           <img 
                             src={p.image} 
                             alt={p.name} 
                             className="max-w-full max-h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-1000 relative z-10" 
                           />
                           <div className="absolute inset-x-4 inset-y-4 bg-white/40 rounded-3xl" />
                        </div>
                        <h4 className="text-[11px] font-bold text-slate-900 line-clamp-2 leading-tight min-h-[2.5em] group-hover:text-brand-primary transition-colors">
                          {p.name}
                        </h4>
                    <div className="mt-4 flex items-center justify-between gap-2">
                      <div className="flex flex-col">
                        <div className="text-[13px] font-black text-slate-900">
                          {p.price.toLocaleString()}đ / cái
                        </div>
                            {p.originalPrice && (
                              <div className="text-[9px] text-slate-300 line-through font-medium">
                                {p.originalPrice.toLocaleString()}đ
                              </div>
                            )}
                          </div>
                          
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (onAddToCart) {
                                onAddToCart(p, 1);
                              }
                            }}
                            className="w-8 h-8 rounded-full bg-brand-primary text-brand-secondary flex items-center justify-center hover:bg-brand-primary/90 transition-all duration-300 shadow-sm active:scale-90 group/add"
                            title="Thêm vào giỏ"
                          >
                            <ShoppingCart size={12} className="group-hover/add:-rotate-12 transition-transform" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
