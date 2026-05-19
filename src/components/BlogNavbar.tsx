import React from 'react';
import { Search, ChevronDown, Mail, ArrowLeft } from 'lucide-react';

interface BlogNavbarProps {
  onBackToHome?: () => void;
  onBackToBlog?: () => void;
  isDetailPage?: boolean;
}

export default function BlogNavbar({ onBackToHome, onBackToBlog, isDetailPage }: BlogNavbarProps) {
  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        {/* Left: Logo */}
        <div className="flex items-center gap-6">
          <div 
            className="text-2xl sm:text-3xl font-display font-bold tracking-tight cursor-pointer flex items-center"
            onClick={isDetailPage ? onBackToBlog : onBackToHome}
          >
            {isDetailPage && (
              <button className="mr-4 text-slate-400 hover:text-brand-secondary transition-colors">
                <ArrowLeft size={20} />
              </button>
            )}
            <span className="text-brand-secondary leading-none">Mecsu</span>
            <span className="text-brand-primary font-black leading-none ml-1 transform -skew-x-6">News</span>
          </div>
        </div>

        {/* Middle: Navigation Links */}
        <div className="hidden lg:flex items-center gap-6 xl:gap-8 text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">
          <button className="flex items-center gap-1 hover:text-brand-secondary transition-colors group">
            Danh mục <ChevronDown size={14} className="text-brand-primary group-hover:translate-y-0.5 transition-transform" />
          </button>
          <button className="flex items-center gap-1 hover:text-brand-secondary transition-colors group">
            Ứng dụng <ChevronDown size={14} className="text-brand-primary group-hover:translate-y-0.5 transition-transform" />
          </button>
          <button className="flex items-center gap-1 hover:text-brand-secondary transition-colors group">
            Tri thức <ChevronDown size={14} className="text-brand-primary group-hover:translate-y-0.5 transition-transform" />
          </button>
          <button className="flex items-center gap-2 hover:text-brand-secondary transition-colors">
            Bản tin <Mail size={14} className="text-brand-primary/60" />
          </button>
        </div>

        {/* Right: Search & Back to Store */}
        <div className="hidden md:flex items-center gap-4">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Truy vấn dữ liệu..." 
              className="pl-5 pr-10 py-2.5 w-56 xl:w-64 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20 transition-all text-[11px] font-bold tracking-widest uppercase placeholder:text-slate-300"
            />
            <button className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-brand-secondary">
              <Search size={16} />
            </button>
          </div>
          {!isDetailPage && onBackToHome && (
            <button 
              onClick={onBackToHome}
              className="px-6 py-2.5 text-[10px] font-black uppercase tracking-[0.25em] text-brand-secondary border border-brand-secondary rounded-xl hover:bg-brand-secondary hover:text-white hover:shadow-xl hover:shadow-brand-secondary/10 transition-all duration-500 active:scale-95"
            >
              Về cửa hàng
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
