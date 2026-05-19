import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import Magnetic from './ui/Magnetic';

const SLIDES = [
  {
    id: 1,
    tag: "Vật Liệu Xây Dựng",
    title: "Cung Ứng Vật Tư\nCông Trình Toàn Diện",
    description: "Giải pháp sắt thép, xi măng và vật liệu thô chất lượng cao cho các dự án xây dựng dân dụng và công nghiệp.",
    buttonText: "Báo Giá Dự Án",
    gradient: "from-[#1E67AF] to-[#0B3B6B]",
    icon: "🏗️"
  },
  {
    id: 2,
    tag: "Kết Cấu Thép",
    title: "Bulong & Ốc Vít\nTiêu Chuẩn Quốc Tế",
    description: "Hệ thống phụ kiện liên kết, bulong cường độ cao phục vụ lắp dựng nhà xưởng và kết cấu thép hạng nặng.",
    buttonText: "Xem Danh Mục",
    gradient: "from-[#FFC629] to-[#F59E0B]",
    icon: "🔩"
  },
  {
    id: 3,
    tag: "Giải Pháp Công Trường",
    title: "Thiết Bị & Phụ Tùng\nThi Công Hiện Đại",
    description: "Cung cấp máy móc cầm tay, đồ bảo hộ và thiết bị đo đạc chính xác giúp đẩy nhanh tiến độ công trình.",
    buttonText: "Khám Phá Ngay",
    gradient: "from-[#0B3B6B] to-[#1E67AF]",
    icon: "⚒️"
  }
];

export default function BannerCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const yIcon = useTransform(scrollYProgress, [0, 1], [-50, 150]);
  const yContent = useTransform(scrollYProgress, [0, 1], [0, -20]);

  const slideNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
  };

  const slidePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      slideNext();
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.95
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.95
    })
  };

  const currentSlide = SLIDES[currentIndex];

  return (
    <div ref={containerRef} className="relative col-span-1 lg:col-span-3 h-[380px] rounded-[2.5rem] overflow-hidden premium-shadow group border border-premium-border">
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 400, damping: 40 },
            opacity: { duration: 0.5 }
          }}
          className={`absolute inset-0 bg-gradient-to-br ${currentSlide.gradient} p-12 flex flex-col justify-center text-white`}
        >
          <motion.div style={{ y: yContent }} className="relative z-10 text-white">
            <motion.span 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="w-max bg-white/10 text-[10px] font-bold px-4 py-2 rounded-lg uppercase tracking-[0.25em] backdrop-blur-md border border-white/10"
            >
              {currentSlide.tag}
            </motion.span>
            
            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl md:text-5xl font-display font-bold mt-8 leading-[1.05] tracking-tight whitespace-pre-line"
            >
              {currentSlide.title}
            </motion.h1>
            
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="mt-6 text-white/60 max-w-sm text-base font-medium leading-relaxed italic"
            >
              {currentSlide.description}
            </motion.p>
            
            <div className="mt-12">
              <Magnetic>
                <motion.button 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-white text-brand-secondary px-10 py-4.5 rounded-2xl text-[11px] font-bold uppercase tracking-[0.2em] flex items-center gap-3 w-max shadow-2xl shadow-black/10 hover:bg-brand-primary hover:text-brand-secondary transition-all duration-500 ease-premium"
                >
                  {currentSlide.buttonText} <ArrowRight size={18} strokeWidth={2} />
                </motion.button>
              </Magnetic>
            </div>
          </motion.div>

          <motion.div 
            style={{ y: yIcon }}
            className="absolute right-16 top-1/2 -translate-y-1/2 text-[220px] opacity-[0.03] pointer-events-none select-none italic font-black text-white"
          >
            {currentSlide.icon}
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <div className="absolute bottom-6 right-10 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <Magnetic>
          <button 
            onClick={slidePrev}
            className="w-10 h-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white hover:text-brand-secondary transition-all shadow-lg"
          >
            <ChevronLeft size={20} />
          </button>
        </Magnetic>
        <Magnetic>
          <button 
            onClick={slideNext}
            className="w-10 h-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white hover:text-brand-secondary transition-all shadow-lg"
          >
            <ChevronRight size={20} />
          </button>
        </Magnetic>
      </div>
    </div>
  );
}
