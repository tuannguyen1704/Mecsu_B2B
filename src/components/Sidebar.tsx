import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Award, ChevronRight } from 'lucide-react';
import { CATEGORIES, BRANDS, ORIGINS } from '../constants';
import { motion, AnimatePresence } from 'motion/react';

interface SidebarProps {
  onSeeAll?: () => void;
}

const Sidebar = React.memo(({ onSeeAll }: SidebarProps) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [megaMenuTop, setMegaMenuTop] = useState(0);
  const [isMenuHovered, setIsMenuHovered] = useState(false);
  const [searchQuery] = useState('');
  
  const [isCategoriesExpanded, setIsCategoriesExpanded] = useState(false);
  const [isBrandsExpanded, setIsBrandsExpanded] = useState(false);
  const [isOriginsExpanded, setIsOriginsExpanded] = useState(false);

  const filteredCategories = CATEGORIES.filter(cat => 
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const displayedCategories = isCategoriesExpanded ? filteredCategories : filteredCategories.slice(0, 5);
  const displayedBrands = isBrandsExpanded ? BRANDS : BRANDS.slice(0, 5);
  const displayedOrigins = isOriginsExpanded ? ORIGINS : ORIGINS.slice(0, 5);

  const hoveredCategory = CATEGORIES.find(c => c.id === hoveredId);

  // Lock body scroll ONLY when mouse is inside the mega menu panel
  React.useEffect(() => {
    if (isMenuHovered) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuHovered]);

  return (
    <aside className="w-64 flex-shrink-0 flex flex-col gap-10 pr-6 sticky top-28 self-start h-max z-[110]">
      <section className="relative z-0 flex flex-col bg-transparent max-h-[calc(100vh-8rem)] overflow-y-auto scrollbar-hide">
        {/* Categories section */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 bg-brand-primary rounded-full"></div>
            <h3 className="font-bold text-text-main text-[11px] uppercase tracking-[0.2em]">Danh Mục</h3>
          </div>
          
          <nav className="flex flex-col gap-1 pb-6 border-b border-premium-border">
            {displayedCategories.map((cat) => {
              const isHovered = hoveredId === cat.id;

              return (
                <div 
                  key={cat.id} 
                  className="relative"
                  onMouseEnter={(e) => {
                    setHoveredId(cat.id);
                    const buttonElement = e.currentTarget;
                    const buttonRect = buttonElement.getBoundingClientRect();
                    const asideElement = e.currentTarget.closest('aside');
                    if (asideElement) {
                      const asideRect = asideElement.getBoundingClientRect();
                      let topPos = buttonRect.top - asideRect.top - 20; 
                      setMegaMenuTop(topPos);
                    }
                  }}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  <button 
                    className={`w-full flex items-center justify-between py-2.5 px-3 rounded-xl transition-all duration-300 text-left text-[13px] font-medium leading-tight ${
                      isHovered 
                        ? 'bg-premium-surface text-brand-primary premium-shadow translate-x-1' 
                        : 'text-text-dim hover:text-text-main hover:bg-premium-surface/50'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <ChevronRight 
                      size={14} 
                      className={`transition-all duration-300 ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}`} 
                    />
                  </button>
                </div>
              );
            })}
            
            {filteredCategories.length > 5 && (
              <button 
                onClick={() => setIsCategoriesExpanded(!isCategoriesExpanded)}
                className="mt-4 px-3 text-[11px] font-bold text-brand-primary hover:text-brand-primary/80 transition-colors uppercase tracking-[0.15em] flex items-center gap-2 group"
              >
                {isCategoriesExpanded ? (
                  <>Thu Gọn <ChevronUp size={14} className="group-hover:-translate-y-0.5 transition-transform" /></>
                ) : (
                  <>Khám Phá Thêm <ChevronDown size={14} className="group-hover:translate-y-0.5 transition-transform" /></>
                )}
              </button>
            )}
          </nav>
        </div>

        {/* Brands section */}
        <div className="pt-10 flex flex-col gap-6">
           <h3 className="font-bold text-text-main text-[11px] uppercase tracking-[0.2em]">Thương Hiệu</h3>
          
          <div className="flex flex-col gap-3 px-3">
            {displayedBrands.map((brand) => (
              <label 
                key={brand.id}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <input type="checkbox" className="w-4 h-4 rounded border-premium-border text-brand-primary focus:ring-brand-primary/20 accent-brand-primary" />
                <span className="text-[13px] font-medium text-text-dim group-hover:text-text-main transition-colors">
                  {brand.name}
                </span>
              </label>
            ))}
            
            {BRANDS.length > 5 && (
              <button 
                onClick={() => setIsBrandsExpanded(!isBrandsExpanded)}
                className="mt-2 text-[11px] font-bold text-text-dim/60 hover:text-brand-primary transition-colors tracking-widest uppercase flex items-center gap-2"
              >
                {isBrandsExpanded ? 'Thu gọn' : 'Xem thêm...'}
              </button>
            )}
          </div>
        </div>

        {/* Origin section */}
        <div className="pt-10 flex flex-col gap-6">
           <h3 className="font-bold text-text-main text-[11px] uppercase tracking-[0.2em]">Xuất Xứ</h3>
          
          <div className="flex flex-col gap-3 px-3">
            {displayedOrigins.map((origin) => (
              <label 
                key={origin.id}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <input type="checkbox" className="w-4 h-4 rounded border-premium-border text-brand-primary focus:ring-brand-primary/20 accent-brand-primary" />
                <span className="text-[13px] font-medium text-text-dim group-hover:text-text-main transition-colors">
                  {origin.name}
                </span>
              </label>
            ))}
            
            {ORIGINS.length > 5 && (
              <button 
                onClick={() => setIsOriginsExpanded(!isOriginsExpanded)}
                className="mt-2 text-[11px] font-bold text-text-dim/60 hover:text-brand-primary transition-colors tracking-widest uppercase flex items-center gap-2"
              >
                {isOriginsExpanded ? 'Thu gọn' : 'Xem thêm...'}
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Mega Menu Flyout Panel */}
      <AnimatePresence>
        {hoveredId && hoveredCategory && (
          <motion.div
            initial={{ opacity: 0, x: -15, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -15, scale: 0.98 }}
            onMouseEnter={() => {
              setHoveredId(hoveredId);
              setIsMenuHovered(true);
            }}
            onMouseLeave={() => {
              setHoveredId(null);
              setIsMenuHovered(false);
            }}
            onWheel={(e) => e.stopPropagation()}
            className="absolute left-[102%] z-[500] w-[720px] bg-premium-surface rounded-[2rem] premium-shadow border border-premium-border p-10 grid grid-cols-2 gap-12 min-h-[400px] pointer-events-auto overflow-hidden"
            style={{ top: Math.max(-20, megaMenuTop - 40) }}
          >
            {/* Column 1: Core Selection */}
            <div className="flex flex-col gap-8">
              <h4 className="text-[10px] font-bold text-text-dim uppercase tracking-[0.3em] border-b border-premium-border pb-4 flex items-center gap-3">
                <div className="w-1.5 h-1.5 bg-brand-primary rounded-full animate-pulse" />
                Bộ sưu tập {hoveredCategory.name}
              </h4>
              <div className="grid grid-cols-1 gap-4">
                {hoveredCategory.subcategories?.map((item) => (
                  <a key={item} href="#" className="text-[14px] font-medium text-text-dim hover:text-brand-primary hover:translate-x-1 transition-all duration-300 flex items-center gap-3 group">
                    <div className="w-0.5 h-3 bg-premium-border group-hover:bg-brand-primary transition-colors" />
                    {item}
                  </a>
                ))}
              </div>
            </div>

            {/* Column 2: Specific Applications */}
            <div className="flex flex-col gap-8">
               {hoveredCategory.sections && hoveredCategory.sections[0] ? (
                 <>
                   <h4 className="text-[10px] font-bold text-text-dim uppercase tracking-[0.3em] border-b border-premium-border pb-4">
                    {hoveredCategory.sections[0].title}
                  </h4>
                  <div className="flex flex-wrap gap-2.5">
                    {hoveredCategory.sections[0].items.map((item) => (
                      <a 
                        key={item} 
                        href="#" 
                        className="px-4 py-2.5 bg-premium-bg border border-premium-border rounded-xl text-[12px] font-bold text-text-main hover:bg-premium-surface hover:border-brand-primary hover:text-brand-primary transition-all duration-500 shadow-sm"
                      >
                        {item}
                      </a>
                    ))}
                  </div>
                 </>
               ) : (
                <div className="h-full flex items-center justify-center opacity-[0.05]">
                  <Award size={120} />
                </div>
               )}
               
               <div className="mt-auto pt-8 border-t border-premium-border">
                  <button className="text-[10px] font-bold text-brand-primary uppercase tracking-[0.25em] flex items-center gap-3 group">
                    Xem Toàn Bộ Danh Mục <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </button>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Corporate Promo Card */}
      <div className="mt-auto bg-brand-secondary rounded-[2rem] p-8 text-premium-surface relative overflow-hidden group premium-shadow border border-premium-border">
        <div className="relative z-10 flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <Award size={16} className="text-brand-primary" />
            <span className="text-[10px] text-premium-surface/40 font-bold uppercase tracking-[0.25em]">Doanh Nghiệp</span>
          </div>
          <p className="text-lg font-display font-medium leading-tight">Mở rộng quy mô với giải pháp B2B chuyên nghiệp</p>
          <button className="w-full bg-premium-surface/10 hover:bg-premium-surface text-premium-surface hover:text-brand-secondary border border-premium-surface/10 py-3.5 rounded-xl text-[10px] uppercase font-bold tracking-widest transition-all duration-500 backdrop-blur-sm">
            Liên Hệ Logistics
          </button>
        </div>
        <div className="absolute right-[-10%] bottom-[-10%] opacity-5 group-hover:scale-110 transition-transform duration-1000">
           <Award size={140} />
        </div>
      </div>
    </aside>
  );
});

export default Sidebar;
