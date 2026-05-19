import React from 'react';
import { Heart, Star } from 'lucide-react';
import { useSupabaseImages } from '../../hooks/useSupabaseImages';
import { OptimizedImage } from '../ui/OptimizedImage';
import { Link } from 'react-router-dom';

interface TopSellerProduct {
  id: string;
  brand: string;
  name: string;
  price: string;
  image: string | null;
}

interface ShopTopSellersProps {
  subcategoryName: string;
}

const MOCK_SELLERS = [
  {
    id: '1',
    brand: 'KLEIN TOOLS',
    name: '6 1/8 in Wire Stripper',
    price: '15.97',
  },
  {
    id: '2',
    brand: 'MILWAUKEE TOOL',
    name: 'M18 750 MCM Cu/Al Replacement Blades',
    price: '139.00',
  },
  {
    id: '3',
    brand: 'DEWALT',
    name: 'Atomic 20V MAX* Brushless Compact 1/4 in. Impact Driver',
    price: '99.00',
  },
  {
    id: '4',
    brand: 'RIDGID',
    name: 'Heavy-Duty Pipe Wrench, 14-inch',
    price: '45.50',
  },
  {
    id: '5',
    brand: 'MAKITA',
    name: '18V LXT Lithium-Ion Brushless Cordless Impact Driver',
    price: '124.00',
  },
];

export default function ShopTopSellers({ subcategoryName }: ShopTopSellersProps) {
  const { getRandomImage } = useSupabaseImages();

  return (
    <section className="py-12 border-t border-slate-200">
      <h2 className="text-[22px] font-bold text-[#222] mb-8">Shop Top Sellers in {subcategoryName}</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {MOCK_SELLERS.map((product) => {
          const image = getRandomImage(product.id) || null;
          return (
            <div key={product.id} className="group relative flex flex-col bg-white border border-slate-200 rounded-sm p-4 hover:shadow-lg transition-all duration-300">
              {/* Wishlist Button */}
              <button className="absolute top-4 right-4 z-10 text-slate-300 hover:text-[#007185] transition-colors">
                <Heart size={24} strokeWidth={1.5} />
              </button>

              {/* Image */}
              <div className="aspect-square mb-6 flex items-center justify-center p-2 overflow-hidden">
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
              <div className="text-[11px] font-bold text-black uppercase mb-1 tracking-tight">
                {product.brand}
              </div>

              {/* Name */}
              <Link 
                to={`/products/${product.id}`}
                className="text-[15px] font-bold text-[#3f74a6] hover:text-[#C7511F] hover:underline transition-colors line-clamp-2 mb-4 min-h-[40px] leading-tight"
              >
                {product.name}
              </Link>

              {/* Price */}
              <div className="text-[18px] font-bold text-slate-900 mb-4">
                ${product.price}
              </div>

              {/* Placeholder Rating/Stats Bar */}
              <div className="w-full h-4 bg-slate-100 rounded-full mb-6 overflow-hidden">
                <div className="h-full bg-[#E5E7EB] w-[70%]"></div>
              </div>

              {/* Add to Cart Button */}
              <button className="mt-auto w-full py-2 bg-brand-primary border-brand-primary text-brand-secondary font-bold text-[13px] rounded-sm hover:bg-brand-primary/90 transition-all">
                Thêm giỏ hàng
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
