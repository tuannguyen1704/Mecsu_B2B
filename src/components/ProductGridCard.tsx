import React from 'react';
import { Heart, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Product } from '../../types';
import { OptimizedImage } from './ui/OptimizedImage';
import { useSupabaseImages } from '../hooks/useSupabaseImages';
import { generateProductUrl } from '../lib/utils';

interface ProductGridCardProps {
  product: Product;
  onAddToCart?: (product: Product, quantity: number) => void;
  customImage?: string | null;
}

export default function ProductGridCard({ product, onAddToCart, customImage }: ProductGridCardProps) {
  const navigate = useNavigate();
  const { getRandomImage } = useSupabaseImages();
  const image = customImage ?? getRandomImage(product.id) ?? null;
  const isOutOfStock = product.stock <= 0;

  const handleProductClick = () => {
    sessionStorage.setItem('selectedProduct', JSON.stringify(product));
    navigate(generateProductUrl(product));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div
      onClick={handleProductClick}
      className="group relative flex flex-col bg-white border border-slate-200 rounded-sm p-4 hover:border-slate-300 cursor-pointer transition-all duration-300 hover:-translate-y-[2px] hover:shadow-xl"
    >
      {/* Wishlist Button */}
      <button
        className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <Heart size={18} strokeWidth={1.5} />
      </button>

      {/* Image */}
      <div className="aspect-[4/3] mb-3 flex items-center justify-center p-1 overflow-hidden">
        {image ? (
          <OptimizedImage
            src={image}
            alt={product.name}
            className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-slate-50 flex items-center justify-center text-slate-300 text-xs">
            No Image
          </div>
        )}
      </div>

      {/* Brand */}
      <div className="text-[10px] font-bold text-[#1a1a1a] uppercase mb-0.5 tracking-tight">
        {product.brand}
      </div>

      {/* Name */}
      <span className="text-[12px] text-[#2071a7] font-medium leading-tight mb-1 block line-clamp-2 min-h-[1.8rem]">
        {product.name}
      </span>

      {/* SKU */}
      <div className="text-[10px] text-slate-500 mb-1 font-medium tracking-tight">
        {product.sku}
      </div>

      {/* Stars */}
      <div className="flex items-center gap-0.5 mb-2">
        {[...Array(5)].map((_, starIndex) => (
          <Star
            key={starIndex}
            size={12}
            className={starIndex < 4 ? 'fill-[#ed6c2d] text-[#ed6c2d]' : 'text-slate-300'}
          />
        ))}
        <span className="text-[11px] text-slate-600 ml-0.5">(150+)</span>
      </div>

      {/* Price */}
      <div className="flex flex-col gap-0.5 mb-2">
        <div className="flex items-baseline gap-1">
          <span className="text-[14px] font-black text-[#1a1a1a]">
            {product.price.toLocaleString()} đ
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-[11px] text-slate-400 line-through">
              {product.originalPrice.toLocaleString()} đ
            </span>
          )}
        </div>
        <div className={`text-[11px] font-bold ${isOutOfStock ? 'text-slate-900' : 'text-green-700'}`}>
          {isOutOfStock ? 'Hết hàng' : 'Sẵn hàng'}
        </div>
      </div>

      {/* Add to Cart Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          if (onAddToCart) {
            onAddToCart(product, 1);
          }
        }}
        className={`mt-auto w-full py-2 rounded-sm border transition-all text-[11px] font-bold uppercase tracking-tight ${
          isOutOfStock
            ? 'border-slate-800 bg-white text-slate-800 hover:bg-slate-800 hover:text-white'
            : 'bg-brand-primary border-brand-primary text-brand-secondary hover:bg-brand-primary/90'
        }`}
      >
        {isOutOfStock ? 'Nhắc tôi sau' : 'Thêm giỏ hàng'}
      </button>
    </div>
  );
}
