import React, { useRef } from "react";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";
import { Product } from "../types";
import { useSupabaseImages } from "../hooks/useSupabaseImages";
import { OptimizedImage } from "./ui/OptimizedImage";

interface BestDealsCarouselProps {
  products: Product[];
  onAddToCart: (product: Product, qty: number) => void;
  onViewDetails: (product: Product) => void;
}

export default function BestDealsCarousel({
  products,
  onAddToCart,
  onViewDetails,
}: BestDealsCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { getRandomImage } = useSupabaseImages();

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      const { scrollLeft } = scrollRef.current;
      const scrollTo =
        direction === "left"
          ? scrollLeft - scrollAmount
          : scrollLeft + scrollAmount;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  const dealProducts = products.filter((p) => p.price > 0).slice(0, 10);

  return (
    <section className="bg-white pt-1 pb-2 font-sans">
      <div className="max-w-[1600px] mx-auto px-4 lg:px-8">
        <div className="bg-[#244356] p-6 lg:p-8 relative rounded-[12px]">
          <h2 className="text-white text-[24px] font-bold mb-6">
            Best deals for you
          </h2>

          <button
            onClick={() => scroll("left")}
            className="absolute left-2 top-[55%] -translate-y-1/2 w-8 h-8 flex items-center justify-center text-white hover:bg-white/10 rounded-full z-10"
          >
            <ChevronLeft size={24} />
          </button>

          <div
            ref={scrollRef}
            className="flex overflow-x-auto gap-4 no-scrollbar snap-x relative z-0"
          >
            {dealProducts.map((product) => {
              const originalPrice = product.price;
              const discountPercent = Math.floor(Math.random() * 20) + 10; // Random discount between 10-30%
              const currentPrice = originalPrice * (1 - discountPercent / 100);

              return (
                <div
                  key={product.id}
                  className="bg-white min-w-[220px] max-w-[220px] p-4 flex flex-col snap-start shrink-0 shadow-sm rounded-[12px]"
                >
                  <div className="relative mb-4 flex-1 flex flex-col">
                    <button className="absolute top-0 right-0 text-slate-400 hover:text-red-500 z-10">
                      <Heart size={20} />
                    </button>
                    <div
                      className="cursor-pointer h-[150px] flex items-center justify-center pt-4"
                      onClick={() => onViewDetails(product)}
                    >
                      <OptimizedImage
                        src={getRandomImage(product.name || product.id) || product.image}
                        alt={product.name}
                        className="max-h-full max-w-full"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col flex-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                      {product.brand || "Thương hiệu"}
                    </span>
                    <h3
                      className="text-[13px] text-[#0056A8] font-medium leading-tight mb-4 cursor-pointer hover:underline line-clamp-3"
                      onClick={() => onViewDetails(product)}
                    >
                      {product.name}
                    </h3>

                    <div className="mt-auto">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[12px] text-slate-400 line-through">
                          {(originalPrice * 1.2).toLocaleString()} đ
                        </span>
                        <span className="text-[12px]" style={{ color: "#bb2a3e" }}>
                          {discountPercent}% off
                        </span>
                      </div>
                      <div className="text-[18px] font-bold mb-2" style={{ color: "#bb2a3e" }}>
                        {currentPrice.toLocaleString()} đ / cái
                      </div>

                      <div className="mb-4 h-1.5 w-[60px] mx-auto bg-slate-200 rounded-full" />

                      <button
                        onClick={() => onAddToCart(product, 1)}
                        className="w-full py-2 bg-brand-primary border-brand-primary text-brand-secondary hover:bg-brand-primary/90 font-bold text-[13px] transition-colors rounded-sm"
                      >
                        Choose Options
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => scroll("right")}
            className="absolute right-2 top-[55%] -translate-y-1/2 w-8 h-8 flex items-center justify-center text-white hover:bg-white/10 rounded-full z-10"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </section>
  );
}
