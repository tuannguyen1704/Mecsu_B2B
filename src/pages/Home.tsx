import React, { lazy, Suspense, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "motion/react";
import {
  CheckCircle2,
  Award,
  ChevronRight,
  Zap,
  Settings,
  User,
  MapPin,
  Factory,
  Blocks,
  Sparkles,
  MessageSquare,
  Mic,
  Image as ImageIcon,
  ArrowUpCircle,
  Hexagon,
  Building2,
  Users,
  Receipt,
  ChevronDown,
} from "lucide-react";
import { Product } from "../types";
import PromotionBanners from "../components/PromotionBanners";
import CategoryExploreCarousel from "../components/CategoryExploreCarousel";
import { HEADER_CATEGORIES } from "../constants";
import { useSupabaseImages } from "../hooks/useSupabaseImages";
import SearchBar from "../components/search/SearchBar";
import { toSlug, generateCategoryUrl } from "../lib/utils";

import BestDealsCarousel from "../components/BestDealsCarousel";
import AccountCreationAndDeals from "../components/AccountCreationAndDeals";
import BrandsYouTrust from "../components/BrandsYouTrust";
import ValueProposition from "../components/ValueProposition";
import NewsSection from "../components/NewsSection";

const ProductCard = lazy(() => import("../components/ProductCard"));
const RecommendationsGrid = lazy(
  () => import("../components/RecommendationsGrid"),
);
const ShopCategoriesGrid = lazy(
  () => import("../components/ShopCategoriesGrid"),
);

const ICON_MAP: Record<string, any> = {
  Blocks,
  ArrowUpCircle: Zap,
  Database: Settings,
  Settings,
  PenTool: Settings,
  Monitor: User,
  Wind: Zap,
  Wrench: Settings,
  DoorOpen: MapPin,
  Zap,
  Ruler: Settings,
  Droplet: Zap,
  Factory,
};

function AnimatedCounter({
  end,
  suffix = "",
  prefix = "",
}: {
  end: number;
  suffix?: string;
  prefix?: string;
}) {
  const [count, setCount] = useState(0);
  const ref = React.useRef<HTMLSpanElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          let startTimestamp: number;
          const duration = 2000;
          const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min(
              (timestamp - startTimestamp) / duration,
              1,
            );
            const ease = 1 - Math.pow(1 - progress, 4);
            setCount(Math.floor(ease * end));
            if (progress < 1) {
              window.requestAnimationFrame(step);
            }
          };
          window.requestAnimationFrame(step);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [end]);

  return (
    <span ref={ref}>
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

interface HomeProps {
  displayedProducts: Product[];
  filteredProducts: Product[];
  selectedCategory: any;
  setSelectedCategory: (cat: any) => void;
  currentPage: number;
  setCurrentPage: (page: number | ((prev: number) => number)) => void;
  itemsPerPage: number;
  totalPages: number;
  handleAddToCart: (product: Product, qty: number) => void;
  handleQuickView: (product: Product) => void;
  handleNavigateToDetails: (product: Product) => void;
  handleNavigateToCategories: () => void;
  setIsTrackingOpen: (isOpen: boolean) => void;
  setIsSearchSticky: (isSticky: boolean) => void;
}

export default function Home({
  displayedProducts,
  filteredProducts,
  selectedCategory,
  setSelectedCategory,
  currentPage,
  setCurrentPage,
  totalPages,
  handleAddToCart,
  handleQuickView,
  handleNavigateToDetails,
  handleNavigateToCategories,
  setIsTrackingOpen,
  setIsSearchSticky,
}: HomeProps) {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const { getRandomImage } = useSupabaseImages();
  const searchBarRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        setIsSearchSticky(!entries[0].isIntersecting);
      },
      { threshold: 0, rootMargin: "-80px 0px 0px 0px" } 
    );

    if (searchBarRef.current) {
      observer.observe(searchBarRef.current);
    }

    return () => observer.disconnect();
  }, [setIsSearchSticky]);

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex-1 w-full bg-white"
    >
      {/* Simple Search Hero Section */}
      <section className="relative h-[calc(100vh-80px)] pt-1 pb-12 px-6 lg:px-12 overflow-hidden flex items-center justify-center">
        {/* Enhanced Background with Depth & Focal Light */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=2070&auto=format&fit=crop"
            alt="Construction Equipment & Progress"
            className="w-full h-full object-cover grayscale opacity-40 brightness-50"
          />
          {/* Multi-layered sophisticated overlays */}
          <div className="absolute inset-0 bg-slate-950/80" />

          {/* Focal Radial Glow to highlight the search area */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-primary/10 rounded-full blur-[120px] pointer-events-none" />
        </div>

        <div className="max-w-4xl mx-auto flex flex-col items-center text-center relative z-10 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full"
          >
            <h1 className="text-3xl md:text-[48px] font-bold text-white mb-3 tracking-tight leading-tight drop-shadow-md">
              Tìm kiếm và mua vật tư công nghiệp nhanh hơn
            </h1>
            <p className="text-base md:text-lg text-slate-200 max-w-2xl mx-auto mb-6 leading-relaxed font-medium drop-shadow">
              Từ linh kiện lắp ráp, vật tư nhà xưởng đến thiết bị công nghiệp — Mecsu giúp doanh nghiệp tìm kiếm, báo giá và đặt hàng nhanh chóng trên một nền tảng duy nhất.
            </p>

            <div className="w-full max-w-3xl mx-auto" ref={searchBarRef}>
              <SearchBar
                placeholder="Tìm kiếm sản phẩm công nghiệp..."
                onSearch={(keyword) => {
                  navigate(`/search?q=${encodeURIComponent(keyword)}`);
                }}
                className="[&_.relative]:!bg-white [&_.relative]:!border-2 [&_.relative]:!border-white/50 [&_.relative]:!rounded-xl [&_.relative]:!overflow-hidden [&_.relative]:!h-[60px]"
              />
            </div>

            {/* Stats Section Integrated into Hero */}
            <div className="mt-10 pt-8 w-full max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 lg:gap-8">
              {/* Stat 1 */}
              <div className="flex items-start gap-4 sm:gap-5 w-[260px] mx-auto">
                <div className="w-12 h-12 mt-0.5 shrink-0 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-white">
                  <Building2 size={24} />
                </div>
                <div className="text-left flex-1">
                  <div className="text-3xl font-bold text-white mb-1 tabular-nums w-full text-left leading-none inline-block">
                    <AnimatedCounter end={15000} suffix="+" />
                  </div>
                  <div className="text-[11px] font-bold text-slate-300 tracking-widest uppercase mt-1.5 leading-snug">
                    Business Accounts
                  </div>
                </div>
              </div>
              {/* Stat 2 */}
              <div className="flex items-start gap-4 sm:gap-5 w-[260px] mx-auto">
                <div className="w-12 h-12 mt-0.5 shrink-0 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-white">
                  <Users size={24} />
                </div>
                <div className="text-left flex-1">
                  <div className="text-3xl font-bold text-white mb-1 tabular-nums w-full text-left leading-none inline-block">
                    <AnimatedCounter end={1000} suffix="+" />
                  </div>
                  <div className="text-[11px] font-bold text-slate-300 tracking-widest uppercase mt-1.5 leading-snug">
                    Verified Supply Partners
                  </div>
                </div>
              </div>
              {/* Stat 3 */}
              <div className="flex items-start gap-4 sm:gap-5 w-[260px] mx-auto">
                <div className="w-12 h-12 mt-0.5 shrink-0 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-white">
                  <CheckCircle2 size={24} />
                </div>
                <div className="text-left flex-1">
                  <div className="text-3xl font-bold text-white mb-1 tabular-nums w-full text-left leading-none inline-block">
                    <AnimatedCounter end={98} suffix="%" />
                  </div>
                  <div className="text-[11px] font-bold text-slate-300 tracking-widest uppercase mt-1.5 leading-snug">
                    On-Time Deliveries
                  </div>
                </div>
              </div>
            </div>

            {/*
            <div className="mt-8 flex justify-center w-full">
              <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-full px-6 py-2.5 flex items-center gap-2 shadow-sm">
                <Receipt size={18} className="text-white" />
                <span className="text-[14px] font-bold text-white">
                  VAT invoicing supported
                </span>
              </div>
            </div>
            */}
          </motion.div>
        </div>
      </section>

      {/* 1.8 Comprehensive Shop Categories Grid (Moved here for better readability) */}
      <Suspense
        fallback={<div className="h-[200px] bg-slate-50 animate-pulse" />}
      >
        <ShopCategoriesGrid />
      </Suspense>

      {/* 1. Promotion Banners - Semantic & Visual */}
      <PromotionBanners />

      {/* 1.5 Recommendations Widget Grid */}
      <Suspense
        fallback={
          <div className="h-[400px] bg-slate-900 flex items-center justify-center text-white">
            Đang tải gợi ý...
          </div>
        }
      >
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 -mt-10 relative z-20">
          <RecommendationsGrid
            products={filteredProducts}
            onAddToCart={handleAddToCart}
            onViewDetails={handleNavigateToDetails}
          />
        </div>
      </Suspense>

      <CategoryExploreCarousel />

      <BestDealsCarousel
        products={filteredProducts}
        onAddToCart={handleAddToCart}
        onViewDetails={handleNavigateToDetails}
      />

      <AccountCreationAndDeals />
      
      <BrandsYouTrust />
      <ValueProposition />
      <NewsSection />


          {/* Trust Indicators - Updated to Explore Categories */}
      <section className="bg-white py-16 border-t border-slate-200 font-sans">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight mb-8">
            Explore more
          </h2>

          <div className="relative">
            <div
              className={`grid grid-cols-2 md:grid-cols-4 gap-4 transition-all duration-300 ${
                isExpanded ? "max-h-none" : "max-h-40 overflow-hidden"
              }`}
            >
              {HEADER_CATEGORIES.map((category) =>
                (category.subcategories || []).map((subcategory, subIndex) => {
                  const subcategorySlug = toSlug(subcategory);
                  return (
                    <button
                      key={`${category.id}-${subIndex}`}
                      onClick={() => navigate(`${generateCategoryUrl(category)}/${subcategorySlug}`)}
                      className="text-[#2071a7] hover:text-[#EAB308] transition-all duration-200 text-base font-medium cursor-pointer hover:underline underline-offset-4 bg-transparent border-none text-left"
                    >
                      {subcategory}
                    </button>
                  );
                })
              )}
            </div>

            {!isExpanded && (
              <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-white to-transparent" />
            )}
          </div>

          <div className="mt-8 flex justify-center">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center text-[#4c7dac] font-medium hover:bg-[#4c7dac]/10 px-4 py-2 rounded-full transition-all duration-300 active:scale-95"
            >
              {isExpanded ? "See Less" : "See More"}
              <ChevronDown
                size={16}
                className={`ml-1 transition-transform ${
                  isExpanded ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>
        </div>
      </section>
    </motion.main>
  );
}
