import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Zap } from 'lucide-react';
import { Product } from '../types';

interface FeaturedPromotionProps {
  products: Product[];
  onAddToCart: (product: Product, qty: number) => void;
  onQuickView: (product: Product) => void;
  onViewDetails: (product: Product) => void;
}

const BANNERS = [
  {
    image: '/assets/banner_1.png',
    title: 'Giải Pháp Cơ Khí Tối Ưu',
    subtitle: 'Nâng tầm hiệu suất với linh kiện chuẩn kỹ thuật cao.',
    cta: 'Khám Phá Ngay'
  },
  {
    image: '/assets/banner_2.png',
    title: 'Chính Xác Từ Chi Tiết Nhỏ',
    subtitle: 'Sản phẩm nhập khẩu chính hãng với độ bền vượt trội.',
    cta: 'Xem Bộ Sưu Tập'
  }
];

const FeaturedPromotion = ({ products, onAddToCart, onQuickView, onViewDetails }: FeaturedPromotionProps) => {
  const [currentBanner, setCurrentBanner] = useState(0);
  const [productPage, setProductPage] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right
  const itemsPerPage = 4;
  const totalPages = Math.ceil(products.length / itemsPerPage);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % BANNERS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextBanner = () => setCurrentBanner((prev) => (prev + 1) % BANNERS.length);
  const prevBanner = () => setCurrentBanner((prev) => (prev - 1 + BANNERS.length) % BANNERS.length);

  const nextProductPage = () => {
    setDirection(1);
    setProductPage((prev) => (prev + 1) % totalPages);
  };
  
  const prevProductPage = () => {
    setDirection(-1);
    setProductPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const currentProducts = products.slice(
    productPage * itemsPerPage,
    (productPage + 1) * itemsPerPage
  );

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
      scale: 0.98
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 100 : -100,
      opacity: 0,
      scale: 0.98
    })
  };

  return (
    <div className="col-span-full w-full py-12">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-display font-bold text-text-main tracking-tight">Cơ Hội Đặc Biệt | Ưu Đãi Giới Hạn</h2>
          <div className="flex items-center gap-2 px-3 py-1 bg-brand-primary/10 text-brand-primary rounded-full border border-brand-primary/20">
            <Zap size={14} className="fill-current" />
            <span className="text-[10px] font-black uppercase tracking-widest">Đang Diễn Ra</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 min-h-[480px]">
        {/* Left Side: Cinematic Banner Slider */}
        <div className="w-full lg:w-[60%] relative group rounded-[2.5rem] overflow-hidden shadow-2xl bg-brand-secondary border border-premium-border">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentBanner}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10" />
              <img 
                src={BANNERS[currentBanner].image} 
                alt={BANNERS[currentBanner].title}
                loading="lazy"
                className="w-full h-full object-cover opacity-60 transition-transform duration-10000 ease-linear scale-100 group-hover:scale-110"
                onError={(e) => {
                  // Fallback for missing images
                  (e.target as HTMLImageElement).src = `https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=2070&auto=format&fit=crop`;
                }}
              />
              
              <div className="absolute inset-0 z-20 flex flex-col justify-center p-12 lg:p-20">
                <motion.span 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-brand-primary font-black uppercase tracking-[0.4em] text-[10px] mb-4 block"
                >
                  Featured Innovation
                </motion.span>
                <motion.h3 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-white text-4xl lg:text-6xl font-display font-bold tracking-tight mb-6 max-w-md leading-[1.1]"
                >
                  {BANNERS[currentBanner].title}
                </motion.h3>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-white/60 text-lg max-w-sm mb-10 font-sans leading-relaxed"
                >
                  {BANNERS[currentBanner].subtitle}
                </motion.p>
                <motion.button 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-fit px-10 py-5 bg-white text-black text-[12px] font-bold uppercase tracking-widest rounded-full hover:bg-brand-primary hover:text-white transition-all duration-500 shadow-2xl"
                >
                  {BANNERS[currentBanner].cta}
                </motion.button>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Banner Navigation */}
          <div className="absolute bottom-10 right-10 z-30 flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <button onClick={prevBanner} className="w-12 h-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white hover:text-black transition-all">
              <ChevronLeft size={20} />
            </button>
            <button onClick={nextBanner} className="w-12 h-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white hover:text-black transition-all">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Right Side: Product Recommendations Carousel */}
        <div className="w-full lg:w-[40%] relative group">
          <div className="overflow-hidden p-2 -m-2 h-full">
            <AnimatePresence initial={false} custom={direction} mode="popLayout">
              <motion.div
                key={productPage}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.4 },
                  scale: { duration: 0.4 }
                }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full p-2"
              >
                {currentProducts.map((product, idx) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-white rounded-[2rem] p-6 border border-premium-border/60 hover:shadow-2xl transition-all duration-500 group/card flex flex-col relative overflow-hidden"
                  >
                    <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5">
                      <div className="bg-brand-primary text-brand-secondary text-[9px] font-black px-2 py-0.5 rounded shadow-sm w-fit uppercase">
                          47% off
                      </div>
                      <div className="text-brand-primary text-[9px] font-black uppercase tracking-tighter">
                          Limited time deal
                      </div>
                    </div>
                    
                    <div className="aspect-square mb-4 flex items-center justify-center bg-premium-bg rounded-2xl p-6 group-hover/card:bg-white transition-colors duration-500">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        loading="lazy"
                        className="max-w-full max-h-full object-contain mix-blend-multiply group-hover/card:scale-110 transition-transform duration-700" 
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <h4 className="text-[14px] font-bold text-text-main line-clamp-1 leading-tight group-hover/card:text-brand-primary transition-colors">
                        {product.name}
                      </h4>
                      <div className="flex items-baseline gap-2">
                        <span className="text-[18px] font-display font-bold text-text-main">
                          {product.price.toLocaleString()}đ
                        </span>
                        <span className="text-[11px] text-text-dim line-through">
                          {(product.price * 1.5).toLocaleString()}đ
                        </span>
                      </div>
                    </div>

                    <button 
                      onClick={() => onViewDetails(product)}
                      className="mt-4 w-full py-3 bg-premium-bg hover:bg-brand-secondary hover:text-white text-text-main text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all"
                    >
                      Xem Chi Tiết
                    </button>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Product Navigation Arrows */}
          <div className="absolute top-1/2 -translate-y-1/2 -left-6 lg:-left-8 z-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <button 
              onClick={prevProductPage} 
              className="w-12 h-12 bg-premium-surface shadow-xl border border-premium-border rounded-full flex items-center justify-center text-text-main hover:bg-brand-primary hover:text-brand-secondary transition-all pointer-events-auto"
            >
              <ChevronLeft size={24} />
            </button>
          </div>
          <div className="absolute top-1/2 -translate-y-1/2 -right-6 lg:-right-8 z-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <button 
              onClick={nextProductPage} 
              className="w-12 h-12 bg-premium-surface shadow-xl border border-premium-border rounded-full flex items-center justify-center text-text-main hover:bg-brand-primary hover:text-brand-secondary transition-all pointer-events-auto"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedPromotion;
