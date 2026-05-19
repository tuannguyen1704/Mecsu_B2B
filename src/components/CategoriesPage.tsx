import React from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Award, ChevronRight, Search, Sparkles } from 'lucide-react';
import { Badge } from './ui/Badge';
import Button from './ui/Button';
import SectionHeader from './ui/SectionHeader';
import { CATEGORIES } from '../constants';
import { Category } from '../types';

interface CategoriesPageProps {
  onBack: () => void;
  onSelectCategory: (category: Category) => void;
}

export default function CategoriesPage({ onBack, onSelectCategory }: CategoriesPageProps) {
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredCategories = CATEGORIES.filter(cat => 
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-7xl mx-auto px-4 lg:px-8 py-12"
    >
      <SectionHeader 
        title="Tất cả danh mục" 
        subtitle="Khám phá hơn 67,000+ sản phẩm"
        className="mb-12"
        action={
          <div className="relative w-full md:w-96">
            <input 
              type="text"
              placeholder="Tìm kiếm danh mục..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-14 pl-6 pr-14 bg-white border border-slate-200 rounded-3xl text-sm font-bold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all shadow-sm"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Search size={18} />
            </div>
          </div>
        }
        titleClassName="flex items-center gap-4"
      >
        <Button 
          variant="outline" 
          size="icon" 
          onClick={onBack}
          className="rounded-full border-slate-200 text-slate-500 flex shrink-0"
        >
          <ChevronLeft size={24} />
        </Button>
      </SectionHeader>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredCategories.map((cat, idx) => (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <button
              onClick={() => onSelectCategory(cat)}
              className="w-full h-full bg-white rounded-[32px] border border-slate-100 p-8 text-left hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/5 transition-all group flex flex-col relative overflow-hidden"
            >
              {/* Background Accent */}
              <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white border border-slate-50 rounded-full opacity-50 group-hover:bg-blue-50 transition-colors" />
              
              <div className="flex items-start justify-between mb-6 relative z-10">
                <div className="w-14 h-14 bg-white border border-slate-100 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner">
                  <Award size={28} />
                </div>
                <Badge variant="primary" className="bg-blue-50">
                  {cat.count} Sản phẩm
                </Badge>
              </div>

              <h3 className="text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors relative z-10 line-clamp-2 min-h-[3.5rem]">
                {cat.name}
              </h3>

              <div className="mt-6 flex flex-wrap gap-2 relative z-10">
                {cat.subcategories?.slice(0, 3).map(sub => (
                  <span key={sub} className="px-3 py-1 bg-white text-[10px] font-bold text-slate-500 rounded-lg group-hover:bg-white group-hover:border-slate-100 border border-slate-100 transition-all">
                    {sub}
                  </span>
                ))}
                {cat.subcategories && cat.subcategories.length > 3 && (
                  <span className="px-3 py-1 bg-white border border-slate-100 text-[10px] font-black text-slate-400 rounded-lg">
                    +{cat.subcategories.length - 3}
                  </span>
                )}
              </div>

              {cat.relatedItems && cat.relatedItems.length > 0 && (
                <div className="mt-3 flex flex-col gap-1 relative z-10">
                  <div className="flex flex-wrap gap-1">
                    {cat.relatedItems.map(item => (
                      <span key={item} className="text-[11px] text-[#2071a7] font-medium hover:underline">
                        • {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between relative z-10 group-hover:border-blue-100">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-blue-600 transition-colors">Khám phá ngay</span>
                <ChevronRight size={16} className="text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
              </div>

              {/* Hover Sparkle Effect */}
              <div className="absolute top-4 right-10 opacity-0 group-hover:opacity-100 transition-opacity">
                <Sparkles size={16} className="text-orange-400 animate-pulse" />
              </div>
            </button>
          </motion.div>
        ))}
      </div>

      {filteredCategories.length === 0 && (
        <div className="py-32 text-center">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
            <Search size={40} />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Không tìm thấy danh mục nào</h3>
          <p className="text-slate-500 mt-2">Vui lòng thử tìm kiếm với từ khóa khác</p>
          <button 
            onClick={() => setSearchQuery('')}
            className="mt-6 px-8 py-3 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-600 transition-all"
          >
            Xóa tìm kiếm
          </button>
        </div>
      )}
    </motion.div>
  );
}
