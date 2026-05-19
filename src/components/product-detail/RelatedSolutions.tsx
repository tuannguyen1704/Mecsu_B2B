import React from 'react';
import { motion } from 'motion/react';
import { Plus } from 'lucide-react';
import SectionHeader from '../ui/SectionHeader';
import { Product } from '../../types';

interface RelatedSolutionsProps {
  products: Product[];
  onSelect: (p: Product) => void;
  onBack: () => void;
}

export default function RelatedSolutions({ products, onSelect, onBack }: RelatedSolutionsProps) {
  return (
    <div className="mt-24 pt-24 border-t border-premium-border">
      <SectionHeader 
        title="Giải pháp bổ trợ"
        subtitle="Các sản phẩm cùng hệ sinh thái thường được sử dụng kèm"
        action={
          <button 
            onClick={onBack}
            className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-brand-primary transition-colors"
          >
            Xem tất cả danh mục
          </button>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mt-12">
        {products.map((p) => (
          <motion.div
            key={p.id}
            whileHover={{ y: -12 }}
            onClick={() => onSelect(p)}
            className="group cursor-pointer"
          >
            <div className="aspect-square bg-premium-bg/30 border border-slate-100 rounded-[2rem] p-8 flex items-center justify-center mb-5 transition-all duration-700 group-hover:border-brand-primary/20 group-hover:bg-white group-hover:shadow-2xl group-hover:shadow-brand-secondary/5">
              <img src={p.image} alt={p.name} className="max-w-full max-h-full object-contain mix-blend-multiply transition-transform duration-1000 group-hover:scale-110" />
            </div>
            <div className="text-[9px] font-black text-brand-primary uppercase tracking-[0.3em] mb-2">{p.brand}</div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-tight line-clamp-1 truncate mb-3 group-hover:text-brand-primary transition-colors">
              {p.name}
            </h4>
            <div className="flex items-center justify-between">
              <div className="font-black text-brand-secondary text-sm">
                {p.price.toLocaleString()}đ
              </div>
              <div className="h-6 w-6 rounded-full border border-slate-100 flex items-center justify-center text-slate-300 group-hover:bg-brand-primary group-hover:text-brand-secondary group-hover:border-brand-primary transition-all">
                <Plus size={12} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
