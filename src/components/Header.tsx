import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  User,
  ShoppingCart,
  Sparkles,
  X,
  ChevronDown,
  Check,
  Menu,
  ChevronRight,
  Blocks,
  ArrowUpCircle,
  Database,
  Settings,
  PenTool,
  Monitor,
  Wind,
  Wrench,
  DoorOpen,
  Zap,
  Ruler,
  Droplet,
  Factory,
  MapPin,
  CheckCircle2,
  Award,
  Lock,
  LogOut,
} from "lucide-react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
  useTransform,
  useSpring,
} from "motion/react";
import ProfilePopup from "./ProfilePopup";
import LoginModal from "./LoginModal";
import SearchBar from "./search/SearchBar";
import { HEADER_CATEGORIES, HEADER_LOCATIONS, PRODUCTS } from "../constants";
import { useSupabaseImages } from "../hooks/useSupabaseImages";
import { toSlug, generateCategoryUrl } from "../lib/utils";
import { useAuth } from "../hooks/useAuth";
import { Product } from "../types";

const mecsuLogo = "/assets/mecsu.png";

const ICON_MAP: Record<string, any> = {
  Blocks,
  ArrowUpCircle,
  Database,
  Settings,
  PenTool,
  Monitor,
  Wind,
  Wrench,
  DoorOpen,
  Zap,
  Ruler,
  Droplet,
  Factory,
};

interface HeaderProps {
  onLogoClick?: () => void;
  onCartClick?: () => void;
  cartCount?: number;
  cartTotal?: number;
  isCartView?: boolean;
  notifications?: any[];
  onMarkAllRead?: () => void;
  isCategoryOpen?: boolean;
  setIsCategoryOpen?: (open: boolean) => void;
  isSearchSticky?: boolean;
  cartPopupItem?: { product: Product, quantity: number } | null;
  onCloseCartPopup?: () => void;
  onNavigateToCheckout?: () => void;
  onAddToCart?: (product: Product, quantity: number) => void;
  isHomePage?: boolean;
  orderJustCompleted?: boolean;
  onOrderAnimationComplete?: () => void;
  isLoggedIn?: boolean;
  userName?: string;
}

export default function Header({
  onLogoClick,
  onCartClick,
  cartCount = 0,
  cartTotal = 0,
  notifications = [],
  onMarkAllRead = () => {},
  isCategoryOpen = false,
  setIsCategoryOpen = () => {},
  isSearchSticky = false,
  cartPopupItem = null,
  onCloseCartPopup = () => {},
  onNavigateToCheckout = () => {},
  onAddToCart = () => {},
  isHomePage = false,
  orderJustCompleted = false,
  onOrderAnimationComplete = () => {},
}: HeaderProps) {
  const navigate = useNavigate();
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [hoveredCategoryIdx, setHoveredCategoryIdx] = useState<number | null>(
    null,
  );
  const [selectedLocation, setSelectedLocation] = useState("TP. Hồ Chí Minh");
  const { getRandomImage } = useSupabaseImages();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const { scrollY } = useScroll();
  const [showTypingCursor, setShowTypingCursor] = useState(false);

  // Auth state from context
  const { isLoggedIn, user, logout } = useAuth();
  const userName = user?.fullName || '';

  // Typing cursor animation after order completion
  useEffect(() => {
    if (orderJustCompleted) {
      setShowTypingCursor(true);
      const timer = setTimeout(() => {
        setShowTypingCursor(false);
        onOrderAnimationComplete();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [orderJustCompleted, onOrderAnimationComplete]);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > previous && latest > 150) {
      setIsVisible(false);
    } else {
      setIsVisible(true);
    }
    
    setIsScrolled(latest > 20);
  });

  useEffect(() => {
    if (isCategoryOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isCategoryOpen]);

  const unreadNotifications = notifications.filter((n) => !n.read).length;

  return (
    <header 
      className="w-full flex flex-col z-[300] sticky top-0"
    >
      {/* 2. Main Premium Header */}
      <div className={`border-b border-slate-200 transition-all duration-300 ${isScrolled ? "bg-white/95 backdrop-blur-md shadow-sm" : "bg-white"}`}>
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 h-20 flex items-center gap-12 relative">
          {/* Modern Logo Area */}
          <div
            onClick={onLogoClick}
            className="flex items-center gap-4 cursor-pointer group shrink-0"
          >
            <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform overflow-hidden">
              <img src={mecsuLogo} alt="MECSU Logo" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-baseline leading-none">
                <span className="text-2xl font-black text-[#24465B] tracking-tighter uppercase italic">
                  MECSU
                </span>
                <span className="text-2xl font-black text-brand-primary tracking-tighter">
                  .VN
                </span>
              </div>
              <span className="text-[10px] font-bold text-slate-400 capitalize tracking-[0.2em] mt-1">
                Enterprise industrial
              </span>
            </div>
          </div>

          {/* Enhanced Categories Button */}
          <button
            onClick={() => setIsCategoryOpen(!isCategoryOpen)}
            className="hidden lg:flex items-center gap-4 px-6 h-12 bg-[#24465B] text-white rounded-xl font-bold text-[13px] tracking-widest hover:bg-slate-800 transition-all group shrink-0 shadow-md relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <Menu
              size={20}
              className="text-brand-primary group-hover:rotate-180 transition-transform duration-500"
            />
            Danh mục
            <ChevronDown
              size={16}
              className={`transition-transform duration-300 ${isCategoryOpen ? "rotate-180" : ""}`}
            />
          </button>

          <div className="hidden xl:flex items-center flex-1">
            {isSearchSticky || !isHomePage ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full"
              >
                <SearchBar
                  onSearch={(keyword) => navigate(`/search?q=${encodeURIComponent(keyword)}`)}
                  placeholder="Tìm kiếm sản phẩm..."
                  className="w-full"
                />
              </motion.div>
            ) : (
              <div className="flex items-center gap-10 border-l border-slate-200 pl-10">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center">
                    <CheckCircle2 size={18} className="text-[#24465B]" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold text-slate-800 tracking-tight">
                      Chuẩn ISO/DIN
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium tracking-widest">
                      100% Chính hãng
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-amber-50 flex items-center justify-center">
                    <Factory size={18} className="text-brand-primary" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold text-slate-800 tracking-tight">
                      Sẵn kho cực lớn
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium tracking-widest">
                      Giao hỏa tốc 2h
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Actions */}
          <nav className="flex items-center gap-10">
            <div className="relative">
              {isLoggedIn ? (
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-4 group"
                >
                  <div className="w-11 h-11 rounded-full border border-slate-200 flex items-center justify-center group-hover:border-brand-primary group-hover:bg-slate-50 transition-all shadow-sm">
                    <User
                      size={20}
                      className="text-slate-500 group-hover:text-[#24465B]"
                    />
                  </div>
                  <div className="text-left leading-tight hidden lg:block">
                    <div className="text-[10px] font-medium text-slate-400 capitalize tracking-widest leading-none mb-1">
                      Tài khoản
                    </div>
                    <div className="text-sm font-bold text-slate-800 flex items-center gap-1">
                      {userName}
                      <ChevronDown size={14} className="text-slate-400" />
                    </div>
                  </div>
                </button>
              ) : (
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="flex items-center gap-4 group"
                >
                  <div className="w-11 h-11 rounded-full border border-slate-200 flex items-center justify-center group-hover:border-brand-primary group-hover:bg-slate-50 transition-all shadow-sm">
                    <User
                      size={20}
                      className="text-slate-500 group-hover:text-[#24465B]"
                    />
                  </div>
                  <div className="text-left leading-tight hidden lg:block">
                    <div className="flex items-center gap-1 text-sm font-bold text-slate-800">
                      Đăng nhập
                      <ChevronDown size={14} className="text-slate-400" />
                    </div>
                  </div>
                </button>
              )}

              {isLoggedIn ? (
                <ProfilePopup
                  isOpen={isProfileOpen}
                  onClose={() => setIsProfileOpen(false)}
                  notifications={notifications}
                  onMarkAllRead={onMarkAllRead}
                  onLogout={() => {
                    logout();
                    setIsProfileOpen(false);
                  }}
                  userName={userName}
                />
              ) : (
                <ProfilePopup
                  isOpen={isProfileOpen}
                  onClose={() => setIsProfileOpen(false)}
                  notifications={notifications}
                  onMarkAllRead={onMarkAllRead}
                  onLoginClick={() => {
                    setIsProfileOpen(false);
                    setIsLoginModalOpen(true);
                  }}
                />
              )}
            </div>

            <div className="relative">
              <button
                onClick={(e) => {
                  if (cartPopupItem) {
                    e.preventDefault();
                    onCloseCartPopup();
                  } else {
                    if (onCartClick) onCartClick();
                  }
                }}
                className="flex items-center gap-4 group relative"
              >
                <div className="relative">
                  <div className="w-11 h-11 rounded-full bg-slate-900 flex items-center justify-center group-hover:bg-[#24465B] transition-all shadow-lg ring-4 ring-slate-900/5">
                    <div className="relative">
                      <ShoppingCart size={20} className="text-brand-primary" />
                      {showTypingCursor && (
                        <motion.div
                          className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-2 h-4 bg-brand-primary"
                          animate={{ opacity: [1, 0, 1] }}
                          transition={{ duration: 0.5, repeat: Infinity }}
                        />
                      )}
                    </div>
                  </div>
                  <AnimatePresence>
                    {cartCount > 0 && (
                      <motion.div
                        key={cartCount}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-brand-primary text-[#24465B] rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-white shadow-sm"
                      >
                        {cartCount}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <div className="text-left hidden xl:block leading-tight">
                  <div className="text-[10px] font-medium text-slate-400 capitalize tracking-widest leading-none mb-1">
                    Giỏ hàng
                  </div>
                  <div className="text-sm font-bold text-[#24465B] italic tracking-tighter">
                    {cartCount === 0 ? "0" : cartTotal.toLocaleString('vi-VN')} VNĐ
                  </div>
                </div>
              </button>

              <AnimatePresence>
                {cartPopupItem && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute top-16 right-0 w-[380px] bg-white rounded shadow-2xl border border-slate-200 z-50 overflow-hidden flex flex-col max-h-[600px]"
                  >
                    <div className="p-5 bg-white flex flex-col flex-shrink-0">
                      <div className="flex items-center gap-2 mb-4 pr-6 relative">
                        <CheckCircle2 size={18} className="text-[#0a823c]" strokeWidth={3} />
                        <span className="text-[16px] font-bold text-slate-900 tracking-tight">Thêm vào giỏ hàng</span>
                        <button 
                          onClick={onCloseCartPopup}
                          className="absolute right-0 text-slate-400 hover:text-slate-800 transition-colors"
                        >
                          <X size={18} strokeWidth={3} />
                        </button>
                      </div>

                      <div className="flex items-start gap-4 mb-6">
                        <div className="w-[80px] h-[80px] bg-white rounded flex-shrink-0 flex items-center justify-center p-0">
                          <img 
                            src={getRandomImage(cartPopupItem.product.name)} 
                            alt={cartPopupItem.product.name} 
                            className="max-w-full max-h-full object-contain"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-[14px] font-medium text-[#2071a7] leading-snug mb-1 cursor-pointer">
                            {cartPopupItem.product.name}
                          </h4>
                          <div className="text-[14px] text-slate-900 font-bold">
                            SL: {cartPopupItem.quantity}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-3">
                        <button 
                          onClick={() => {
                            onCloseCartPopup();
                            onNavigateToCheckout();
                          }}
                          className="w-full bg-[#C55A2B] text-white py-2.5 rounded shadow-sm font-bold text-[14px] hover:bg-[#a84a22] transition-colors flex items-center justify-center gap-2 tracking-wide"
                        >
                          <Lock size={15} className="mb-[1px]" />
                          Thanh toán ngay
                        </button>
                        <button 
                          onClick={() => {
                            onCloseCartPopup();
                            if (onCartClick) onCartClick();
                          }}
                          className="w-full bg-white border border-[#2071a7] text-[#2071a7] py-2.5 rounded shadow-sm font-bold text-[14px] hover:bg-slate-50 transition-colors tracking-wide"
                        >
                          Xem giỏ hàng
                        </button>
                      </div>
                    </div>

                    <div className="overflow-y-auto flex-1 min-h-0 w-full pb-4 border-t border-slate-100">
                      <div className="px-5 py-4 text-[16px] font-bold text-black bg-white sticky top-0 z-10 tracking-tight">
                        Khám phá sản phẩm liên quan
                      </div>
                      <div className="px-5 flex flex-col gap-5">
                        {PRODUCTS.filter(p => p.category === cartPopupItem.product.category && p.id !== cartPopupItem.product.id)
                          .slice(0, 4)
                          .map((relatedProd) => (
                            <div key={relatedProd.id} className="flex gap-4 group/item pb-5 border-b border-slate-100 last:border-b-0 last:pb-0">
                              <div className="w-[80px] h-[80px] bg-white rounded flex-shrink-0 flex items-center justify-center p-0 cursor-pointer pt-1">
                                <img 
                                  src={getRandomImage(relatedProd.name)} 
                                  alt={relatedProd.name} 
                                  className="max-w-full max-h-full object-contain mix-blend-multiply"
                                />
                              </div>
                              <div className="flex-1 min-w-0 flex flex-col">
                                <div className="text-[11px] text-slate-600 font-medium tracking-wide mb-1">
                                  MECSU SELECT
                                </div>
                                <h5 className="text-[14px] text-[#2071a7] leading-snug mb-1 cursor-pointer">
                                  {relatedProd.name}
                                </h5>
                                <div className="text-[12px] text-slate-500 mb-2 font-medium">
                                  Mã SP: {relatedProd.id}<br/>
                                  NSX: MS-{relatedProd.id.substring(0, 8)}
                                </div>
                                <div className="text-[16px] font-bold text-slate-900 mb-3">
                                  {relatedProd.price.toLocaleString('vi-VN')} ₫
                                </div>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onAddToCart(relatedProd, 1);
                                  }}
                                  className="w-[140px] bg-brand-primary border-brand-primary text-brand-secondary py-1.5 rounded hover:bg-brand-primary/90 transition-colors text-[14px] font-bold"
                                >
                                  Thêm giỏ hàng
                                </button>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>
        </div>
      </div>

      {/* Category Mega Menu (Portal content) */}
      <AnimatePresence>
        {isCategoryOpen && (
          <>
            {createPortal(
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsCategoryOpen(false)}
                className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-[195]"
              />,
              document.body,
            )}
            <motion.div
              initial={{ opacity: 0, y: -10, x: "-50%" }}
              animate={{ opacity: 1, y: 0, x: "-50%" }}
              exit={{ opacity: 0, y: -10, x: "-50%" }}
              className="fixed left-1/2 top-[84px] w-[calc(100%-2rem)] max-w-7xl bg-white rounded-2xl border border-slate-200 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] z-[196] h-[520px] flex overflow-hidden"
            >
              <div className="w-[280px] bg-slate-50 border-r border-slate-200 py-6 overflow-y-auto no-scrollbar">
                {HEADER_CATEGORIES.map((cat, idx) => {
                  const Icon = ICON_MAP[cat.icon as string] || Blocks;
                  const isHovered = hoveredCategoryIdx === idx;
                  return (
                    <button
                      key={idx}
                      onMouseEnter={() => setHoveredCategoryIdx(idx)}
                      className={`w-full flex items-center justify-between px-6 py-2.5 transition-colors ${isHovered ? "bg-white text-brand-secondary" : "text-slate-600 hover:bg-white/50"}`}
                    >
                      <div className="flex items-center gap-3">
                        {getRandomImage(cat.name) ? (
                          <img
                            src={getRandomImage(cat.name)!}
                            alt={cat.name}
                            className="w-5 h-5 rounded-full object-cover"
                          />
                        ) : (
                          <Icon
                            size={16}
                            className={
                              isHovered
                                ? "text-brand-secondary"
                                : "text-slate-400"
                            }
                          />
                        )}
                        <span className="text-[12px] font-bold tracking-tight">
                          {cat.name}
                        </span>
                      </div>
                      <ChevronRight
                        size={12}
                        className={
                          isHovered ? "text-brand-secondary" : "text-slate-300"
                        }
                      />
                    </button>
                  );
                })}
              </div>

              <div className="flex-1 p-10 overflow-y-auto">
                {hoveredCategoryIdx !== null && (
                  <div className="grid grid-cols-3 gap-x-8 gap-y-8">
                    {HEADER_CATEGORIES[hoveredCategoryIdx].subcategories.map(
                      (sub, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            setIsCategoryOpen(false);
                            navigate(generateCategoryUrl(HEADER_CATEGORIES[hoveredCategoryIdx]) + `/${toSlug(sub)}`);
                          }}
                          className="flex items-start gap-3 group text-left"
                        >
                          <div className="w-14 h-14 bg-white border border-slate-200 rounded group-hover:border-brand-primary group-hover:shadow-lg group-hover:shadow-blue-500/10 transition-all flex items-center justify-center p-0 overflow-hidden">
                            <img
                              src={
                                getRandomImage(sub) ||
                                `https://placehold.co/100x100/ffffff/003B73?text=${sub.charAt(0)}`
                              }
                              alt={sub}
                              className="w-full h-full object-cover transition-transform group-hover:scale-110"
                            />
                          </div>
                          <div className="flex flex-col gap-0.5">
                            <span className="text-[12px] font-bold text-slate-800 group-hover:text-brand-secondary leading-tight tracking-tight">
                              {sub}
                            </span>
                            <span className="text-[9px] font-medium text-slate-400 capitalize tracking-widest">
                              Sẵn kho
                            </span>
                          </div>
                        </button>
                      ),
                    )}
                  </div>
                )}
                {hoveredCategoryIdx === null && (
                  <div className="h-full flex items-center justify-center text-slate-300 italic font-medium">
                    Di chuột qua danh mục để xem chi tiết
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Location Modal */}
      {createPortal(
        <AnimatePresence>
          {isLocationModalOpen && (
            <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsLocationModalOpen(false)}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-md bg-white rounded shadow-2xl overflow-hidden border border-slate-200"
              >
                <div className="p-8 bg-brand-secondary text-white relative">
                  <h3 className="text-xl font-display font-bold tracking-widest">
                    Kho hàng khu vực
                  </h3>
                  <p className="text-xs font-bold text-white/60 mt-1 capitalize tracking-widest">
                    Tối ưu vận chuyển từ kho gần nhất
                  </p>
                  <button
                    onClick={() => setIsLocationModalOpen(false)}
                    className="absolute top-8 right-8 text-white/60 hover:text-white transition-all"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="p-6 flex flex-col gap-1">
                  {HEADER_LOCATIONS.map((loc) => (
                    <button
                      key={loc}
                      onClick={() => {
                        setSelectedLocation(loc);
                        setIsLocationModalOpen(false);
                      }}
                      className={`flex items-center justify-between px-6 py-4 rounded border transition-all ${
                        selectedLocation === loc
                          ? "bg-brand-primary/10 border-brand-primary text-brand-secondary"
                          : "border-slate-100 text-slate-600 hover:bg-slate-50 hover:border-slate-200"
                      }`}
                    >
                      <span className="text-sm font-bold tracking-tight">
                        {loc}
                      </span>
                      {selectedLocation === loc && (
                        <Check size={18} className="text-brand-secondary" />
                      )}
                    </button>
                  ))}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body,
      )}

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </header>
  );
}
