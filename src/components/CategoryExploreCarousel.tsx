import React, { useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { HEADER_CATEGORIES } from "../constants";
import { useSupabaseImages } from "../hooks/useSupabaseImages";
import { toSlug, generateCategoryUrl } from "../lib/utils";

// Fallback image source if not found
const fallbackImage =
  "https://m.media-amazon.com/images/I/61M-F8K-g9L._SL1500_.jpg";

// Convert slug back to original title (e.g., "phe-gai" -> "Phe Gài")
const fromSlug = (slug: string): string => {
  const words = slug.split('-');
  return words.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

// Helper function to find category info for a subcategory
const getCategoryForSubcategory = (subcategory: string) => {
  for (const cat of HEADER_CATEGORIES) {
    if (cat.subcategories.includes(subcategory)) {
      return { categoryId: cat.id, categorySlug: toSlug(cat.name), subcategorySlug: toSlug(subcategory) };
    }
  }
  return null;
};

export default function CategoryExploreCarousel() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { getRandomImage } = useSupabaseImages();
  const navigate = useNavigate();

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -800, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 800, behavior: "smooth" });
    }
  };

  const allSubcategories = useMemo(() => {
    return Array.from(
      new Set(HEADER_CATEGORIES.flatMap((cat) => cat.subcategories)),
    );
  }, []);

  // Handle subcategory click
  const handleSubcategoryClick = (subcategory: string) => {
    const categoryInfo = getCategoryForSubcategory(subcategory);
    if (categoryInfo) {
      navigate(`${generateCategoryUrl({ id: categoryInfo.categoryId })}/${categoryInfo.subcategorySlug}`);
    }
  };

  return (
    <section className="max-w-[1600px] mx-auto px-6 lg:px-12 pt-10 pb-2 font-sans">
      <h2 className="text-3xl font-bold text-slate-800 tracking-tight mb-8">
        More categories to explore
      </h2>

      <div className="relative group">
        <button
          onClick={scrollLeft}
          className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white border border-slate-300 rounded-md shadow-sm flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-0"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={scrollRight}
          className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white border border-slate-300 rounded-md flex shadow-sm items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-0"
        >
          <ChevronRight size={24} />
        </button>

        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide py-4 px-2"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {allSubcategories.map((subcategory, index) => {
            return (
              <button
                key={index}
                onClick={() => handleSubcategoryClick(subcategory)}
                className="flex-shrink-0 w-[140px] flex flex-col items-center gap-3 cursor-pointer group/item"
              >
                <div className="h-[120px] w-full flex items-center justify-center p-2 rounded-xl transition-transform duration-300 group-hover/item:-translate-y-1">
                  <img
                    src={getRandomImage(subcategory) || fallbackImage}
                    alt={subcategory}
                    className="max-h-full max-w-full object-contain mix-blend-multiply transition-transform duration-300 group-hover/item:scale-105"
                  />
                </div>
                <span className="text-[14px] font-normal text-slate-800 text-center leading-snug group-hover/item:text-[#24465B] transition-colors duration-200">
                  {subcategory}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
