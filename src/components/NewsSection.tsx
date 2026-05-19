import React, { useState, useEffect } from 'react';
import { Skeleton } from './ui/Skeleton';

const NEWS_ITEMS = [
  {
    category: "HƯỚNG DẪN",
    title: "Hướng dẫn lựa chọn máy khoan phù hợp cho xưởng cơ khí",
    description: "Những tiêu chí quan trọng giúp doanh nghiệp lựa chọn thiết bị phù hợp với nhu cầu vận hành.",
    image: "https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&w=800&q=80"
  },
  {
    category: "XU HƯỚNG",
    title: "AI đang thay đổi ngành cung ứng công nghiệp như thế nào?",
    description: "Các doanh nghiệp đang ứng dụng AI để tối ưu quản lý kho và vận hành sản xuất.",
    image: "https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?auto=format&fit=crop&w=800&q=80"
  },
  {
    category: "MẸO KỸ THUẬT",
    title: "Cách bảo quản dụng cụ công nghiệp bền hơn",
    description: "Những phương pháp giúp tăng tuổi thọ thiết bị và giảm chi phí bảo trì.",
    image: "https://images.unsplash.com/photo-1581092160607-ee22531d30f7?auto=format&fit=crop&w=800&q=80"
  },
  {
    category: "TƯ VẤN MUA HÀNG",
    title: "So sánh máy khoan pin và máy khoan điện cho doanh nghiệp",
    description: "Đâu là lựa chọn phù hợp cho môi trường sản xuất hiện đại?",
    image: "https://images.unsplash.com/photo-1503698711475-43038fc7164b?auto=format&fit=crop&w=800&q=80"
  }
];

export default function NewsSection() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate data fetching
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
        <div className="flex items-baseline gap-4 mb-8">
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Trending guides</h2>
          <a href="#" className="text-blue-600 hover:text-blue-800 font-medium text-sm">Explore our Resource Hub</a>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                <Skeleton className="h-56 w-full" />
                <div className="p-5">
                  <Skeleton className="h-4 w-20 mb-3" />
                  <Skeleton className="h-6 w-full mb-3" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            ))
          ) : (
            NEWS_ITEMS.map((item, idx) => (
              <div key={idx} className="bg-white border border-slate-200 rounded-lg overflow-hidden group">
                <div className="h-56 overflow-hidden">
                  <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                </div>
                <div className="p-5">
                  <span className="text-[12px] font-medium text-slate-500 uppercase tracking-wide">{item.category}</span>
                  <h3 className="text-xl font-bold text-slate-900 mt-2 mb-3 leading-tight group-hover:text-blue-700 transition-colors">{item.title}</h3>
                  <p className="text-slate-600 text-[14px] leading-relaxed line-clamp-2">{item.description}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
