import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from '../types';
import ProductCard from './ProductCard';

interface HighlightSectionProps {
  products: Product[];
  onAddToCart: (product: Product, qty: number) => void;
  onQuickView: (product: Product) => void;
  onViewDetails: (product: Product) => void;
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
  imagePath: string;
  filterKeyword: string;
  accentColor?: string;
}

const HighlightSection = ({ 
  products, 
  onAddToCart, 
  onQuickView, 
  onViewDetails,
  title,
  subtitle,
  description,
  buttonText,
  imagePath,
  filterKeyword,
  accentColor = "text-brand-primary"
}: HighlightSectionProps) => {
  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState(0);

  // Filtering products based on keyword
  let filteredSectionProducts = products.filter(p => 
    p.name.toLowerCase().includes(filterKeyword.toLowerCase()) || 
    p.category.toLowerCase().includes(filterKeyword.toLowerCase())
  );

  // Fallback to "any" items if none found (as requested: "nhét đại")
  if (filteredSectionProducts.length === 0 && products.length > 0) {
    filteredSectionProducts = products.slice(0, 12);
  }

  const cardsPerPage = 3;
  const totalPages = Math.ceil(filteredSectionProducts.length / cardsPerPage);

  const nextPage = () => {
    if (totalPages <= 1) return;
    setDirection(1);
    setPage((prev) => (prev + 1) % totalPages);
  };

  const prevPage = () => {
    if (totalPages <= 1) return;
    setDirection(-1);
    setPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const currentItems = filteredSectionProducts.slice(
    page * cardsPerPage,
    (page + 1) * cardsPerPage
  );

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 30 : -30,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 30 : -30,
      opacity: 0,
    })
  };

  return (
    <div className="col-span-full grid grid-cols-1 lg:grid-cols-5 gap-4 mb-8 items-stretch bg-white p-5 rounded-[3rem] border border-slate-50 shadow-sm min-h-[580px]">
      {/* Mega Banner Side (2 columns) */}
      <div className="lg:col-span-2 relative group rounded-[2.5rem] overflow-hidden shadow-2xl bg-brand-secondary border border-premium-border h-full min-h-[500px]">
        {/* Background Overlay - Animates in */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, delay: 0.5 }}
          className="absolute inset-0 bg-gradient-to-tr from-brand-secondary via-brand-secondary/70 to-transparent z-10" 
        />
        
        {/* Banner Image - Starts clear, then dims/blurs */}
        <motion.img 
          src={imagePath} 
          alt={title}
          initial={{ scale: 1.1, filter: "brightness(1) blur(0px)" }}
          whileInView={{ scale: 1.05, filter: "brightness(0.6) blur(2px)" }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0 w-full h-full object-cover z-0 group-hover:scale-110 transition-transform duration-2000"
          onError={(e) => {
             (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1542013936693-884638332954?w=1600&auto=format&fit=crop&q=80';
          }}
        />

        {/* Content - Fades in after image transition starts */}
        <div className="absolute inset-0 z-20 p-12 flex flex-col justify-end overflow-hidden">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="px-4 py-1.5 bg-brand-primary/20 backdrop-blur-md border border-brand-primary/30 text-brand-primary text-[10px] font-black uppercase tracking-[0.3em] rounded-lg">
                Exclusive Collection
              </span>
            </div>
            
            <h2 className="text-white text-5xl font-display font-bold leading-[1] mb-4 tracking-tight">
              {title} <br />
              <span className={`${accentColor} filter brightness-110`}>{subtitle}</span>
            </h2>
            
            <p className="text-white/50 text-sm font-medium mb-10 max-w-xs leading-relaxed italic">
              {description}
            </p>
            
            <button className="flex items-center gap-4 text-white text-[11px] font-black uppercase tracking-[0.3em] group/btn">
              {buttonText} 
              <div className="w-12 h-12 rounded-2xl border border-white/20 flex items-center justify-center group-hover/btn:bg-brand-primary group-hover/btn:border-brand-primary group-hover/btn:text-brand-secondary transition-all duration-700 shadow-2xl">
                <ArrowRight size={18} />
              </div>
            </button>
          </motion.div>
        </div>
      </div>

      {/* Gallery Side (3 columns) */}
      <div className="lg:col-span-3 relative group/gallery min-h-[500px] flex items-stretch bg-slate-50/50 rounded-[2.5rem] p-4 border border-slate-100">
        {/* Navigation Arrows - Hover show */}
        <div className="absolute inset-y-0 -left-6 lg:-left-4 flex items-center z-40">
           <motion.button 
             onClick={prevPage}
             whileHover={{ scale: 1.1 }}
             whileTap={{ scale: 0.9 }}
             className="w-14 h-14 bg-white shadow-2xl rounded-2xl flex items-center justify-center text-brand-secondary border border-slate-100 opacity-0 group-hover/gallery:opacity-100 transition-all duration-300 pointer-events-auto"
             disabled={totalPages <= 1}
           >
             <ChevronLeft size={24} />
           </motion.button>
        </div>
        
        <div className="absolute inset-y-0 -right-6 lg:-right-4 flex items-center z-40">
           <motion.button 
             onClick={nextPage}
             whileHover={{ scale: 1.1 }}
             whileTap={{ scale: 0.9 }}
             className="w-14 h-14 bg-white shadow-2xl rounded-2xl flex items-center justify-center text-brand-secondary border border-slate-100 opacity-0 group-hover/gallery:opacity-100 transition-all duration-300 pointer-events-auto"
             disabled={totalPages <= 1}
           >
             <ChevronRight size={24} />
           </motion.button>
        </div>

        <div className="w-full h-full relative overflow-hidden flex flex-col">
          <AnimatePresence mode="wait" custom={direction}>
            {filteredSectionProducts.length > 0 ? (
              <motion.div
                key={page}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 h-full flex-1 p-2"
              >
                {currentItems.map((product) => (
                  <div key={product.id} className="h-full">
                    <ProductCard 
                      product={product}
                      onAddToCart={(qty) => onAddToCart(product, qty)}
                      onQuickView={() => onQuickView(product)}
                      onViewDetails={() => onViewDetails(product)}
                    />
                  </div>
                ))}
              </motion.div>
            ) : (
              <div className="h-full flex items-center justify-center text-text-dim/40 italic">
                Không tìm thấy sản phẩm liên quan
              </div>
            )}
          </AnimatePresence>
          
          <div className="mt-4 flex justify-center gap-2">
            {[...Array(totalPages)].map((_, i) => (
              <div 
                key={i} 
                className={`h-1 rounded-full transition-all duration-500 ${i === page ? 'w-8 bg-brand-primary' : 'w-2 bg-slate-200'}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HighlightSection;

