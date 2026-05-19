import React from 'react';
import { ChevronLeft, ChevronRight, ShoppingCart } from 'lucide-react';
import { Product } from '../types';
import { useSupabaseImages } from '../hooks/useSupabaseImages';
import { OptimizedImage } from './ui/OptimizedImage';
import { Skeleton } from './ui/Skeleton';

interface WidgetProps {
  title: string;
  products: Product[];
  onAddToCart: (product: Product, qty: number) => void;
  onViewDetails: (product: Product) => void;
  isLoading?: boolean;
}

const ProductWidgetSkeleton = () => (
  <div className="bg-white p-4 flex flex-col h-full font-sans transition-all rounded-xl">
    <Skeleton className="h-4 w-1/2 mb-4" />
    <div className="flex gap-4 mb-4">
      <Skeleton className="w-[100px] h-[100px] shrink-0" />
      <div className="flex-1 flex flex-col gap-2">
        <Skeleton className="h-3 w-1/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-6 w-1/2 rounded" />
      </div>
    </div>
    <div className="mt-auto pt-4 border-t border-slate-100 flex items-center gap-2">
      <div className="flex gap-2">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="w-16 h-16 shrink-0" />
        ))}
      </div>
    </div>
  </div>
);

const ProductWidget = ({ title, products, onAddToCart, onViewDetails, isLoading }: WidgetProps) => {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const mainProduct = products[activeIndex] || products[0];
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const { getRandomImage } = useSupabaseImages();

  const handleViewDetails = (product: Product) => {
    onViewDetails(product);
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - 100 : scrollLeft + 100;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  if (isLoading) return <ProductWidgetSkeleton />;
  if (!mainProduct) return null;

  const cleanName = mainProduct.name.replace(/\s*\([^)]*\)/, '');

  return (
    <div className="bg-white p-3 flex flex-col h-[300px] font-sans transition-all group/container rounded-xl">
      <h3 className="text-[14px] font-black text-slate-800 mb-3 tracking-tight h-[40px]">{title}</h3>
      
      <div className="flex gap-2 mb-3 min-h-[120px]">
        <div 
          className="w-[80px] aspect-square flex items-center justify-center p-1 cursor-pointer group shrink-0"
          onClick={() => handleViewDetails(mainProduct)}
        >
          <OptimizedImage 
            src={getRandomImage(mainProduct.name || mainProduct.id) || mainProduct.image} 
            alt={cleanName} 
            className="max-w-full max-h-full mix-blend-multiply group-hover:scale-105 transition-transform duration-500" 
          />
        </div>
        <div className="flex-1 flex flex-col pt-0.5 min-w-0">
          <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">{mainProduct.brand}</span>
          <h4 
            className="text-[11px] font-bold text-[#0056A8] leading-[1.2] mb-1 cursor-pointer hover:underline overflow-hidden text-ellipsis"
            style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}
            onClick={() => handleViewDetails(mainProduct)}
            title={cleanName}
          >
            {cleanName}
          </h4>
          <span className="text-sm font-black text-slate-900 mb-2 whitespace-nowrap">
            {mainProduct.price.toLocaleString()} đ / cái
          </span>
          <button 
            onClick={() => onAddToCart(mainProduct, 1)}
            className="px-3 py-1 bg-brand-primary border-brand-primary text-brand-secondary hover:bg-brand-primary/90 text-[10px] font-bold rounded transiton-all w-fit"
          >
            Thêm vào giỏ
          </button>
        </div>
      </div>

      <div className="mt-auto pt-4 border-t border-slate-100 flex items-center gap-2">
        <button 
          onClick={() => scroll('left')}
          className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-brand-secondary shrink-0"
        >
          <ChevronLeft size={24} />
        </button>
        
        <div 
          ref={scrollRef}
          className="flex-1 flex items-center gap-2 overflow-x-auto no-scrollbar py-1"
          style={{ scrollBehavior: 'smooth' }}
        >
          {products.slice(0, 3).map((p, i) => (
            <div 
              key={p.id} 
              className={`w-16 h-16 border-2 shrink-0 flex items-center justify-center p-1 cursor-pointer transition-all rounded-sm ${i === activeIndex ? 'border-[#0056A8]' : 'border-slate-200 hover:border-slate-300'}`}
              onClick={() => setActiveIndex(i)}
            >
              <OptimizedImage src={getRandomImage(p.name || p.id) || p.image} alt="" className="max-w-full max-h-full" />
            </div>
          ))}
        </div>

        <button 
          onClick={() => scroll('right')}
          className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-brand-secondary shrink-0"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
};

interface RecommendationsGridProps {
  products: Product[];
  onAddToCart: (product: Product, qty: number) => void;
  onViewDetails: (product: Product) => void;
}

export default function RecommendationsGrid({ products, onAddToCart, onViewDetails }: RecommendationsGridProps) {
  // Use subsets of products for different widgets
  const recentlyViewed = products.slice(0, 15);
  const newArrivals = products.slice(5, 20);
  const essentials = products.slice(10, 25);
  const topSales = products.slice(15, 30);
  
  // Generate a set of 10 widgets
  const allWidgets = [
    { title: "Đã xem gần đây & hơn thế nữa", products: recentlyViewed },
    { title: "Sản phẩm mới tại MECSU", products: newArrivals },
    { title: "Vật tư thiết yếu sẵn kho", products: essentials },
    { title: "Mua nhiều nhất trong tháng", products: topSales },
    { title: "Sản phẩm bán chạy nhất", products: products.slice(0, 15) },
    { title: "Gợi ý cho bạn", products: products.slice(5, 20) },
    { title: "Ưu đãi đặc biệt", products: products.slice(10, 25) },
    { title: "Được đánh giá cao", products: products.slice(15, 30) },
    { title: "Combo tiết kiệm", products: products.slice(0, 10) },
    { title: "Hàng gia dụng", products: products.slice(5, 15) },
  ];
  
  const scrollRef = React.useRef<HTMLDivElement>(null);
  

  const [isPaused, setIsPaused] = React.useState(false);
  
  // Auto-slide functionality: Slide left every 5 seconds
  React.useEffect(() => {
    if (isPaused) return;
    
    const interval = setInterval(() => {
      scrollLeft();
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const scrollLeft = () => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      // If we've reached the start, scroll to end (looping)
      if (scrollLeft <= 0) {
        scrollRef.current.scrollTo({ left: scrollRef.current.scrollWidth, behavior: 'smooth' });
      } else {
        scrollRef.current.scrollBy({ left: -clientWidth, behavior: 'smooth' });
      }
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      // If we've reached the end, scroll back to start
      if (Math.ceil(scrollLeft + clientWidth) >= scrollWidth) {
        scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        scrollRef.current.scrollBy({ left: clientWidth, behavior: 'smooth' }); // Slide by full container width (4 widgets)
      }
    }
  };

  return (
    <section className="bg-white pt-[29px] pb-4 font-sans">
      <div 
        className="max-w-[1760px] mx-auto px-2 lg:px-4 relative"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div 
          ref={scrollRef}
          className="flex items-stretch gap-2 lg:gap-4 bg-[#1a3646] p-4 lg:p-8 rounded-xl lg:rounded-2xl overflow-hidden"
        >
          {allWidgets.map((widget, i) => (
            <div key={i} className="min-w-full md:min-w-[50%] lg:min-w-[calc(25%-12px)] flex-shrink-0 h-full">
              <ProductWidget 
                title={widget.title}
                products={widget.products} 
                onAddToCart={onAddToCart}
                onViewDetails={onViewDetails}
              />
            </div>
          ))}
        </div>

        <button
          onClick={scrollLeft}
          className="absolute -left-2 lg:-left-4 top-1/2 -translate-y-1/2 z-20 bg-white/50 hover:bg-white p-2 rounded-full text-slate-800 shadow-md backdrop-blur-sm"
        >
          <ChevronLeft size={24} />
        </button>

        <button
          onClick={scrollRight}
          className="absolute -right-2 lg:-right-4 top-1/2 -translate-y-1/2 z-20 bg-white/50 hover:bg-white p-2 rounded-full text-slate-800 shadow-md backdrop-blur-sm"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </section>
  );
}
