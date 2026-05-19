import React from 'react';
import { Star, ShoppingCart } from 'lucide-react';
import { Product } from '../../types';
import { useSupabaseImages } from '../../hooks/useSupabaseImages';

interface ProductCardV2Props {
  product: Product;
}

export function ProductCardV2({ product }: ProductCardV2Props) {
  const { getRandomImage } = useSupabaseImages();
  const image = getRandomImage(product.id) || product.image || null;
  const ratingCount = Math.floor(Math.random() * 100) + 10;

  return (
    <div className="bg-white border-r border-b border-slate-100 p-6 flex flex-col group hover:shadow-lg transition-shadow relative">
      <div className="aspect-square mb-4 relative overflow-hidden">
        {image ? (
          <img 
            src={image} 
            alt={product.name} 
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300" 
          />
        ) : (
          <div className="w-full h-full bg-slate-50 flex items-center justify-center text-slate-300">
            No Image
          </div>
        )}
      </div>

      <div className="flex items-center gap-1 mb-2">
        <div className="flex text-[#ed6c2d]">
          {[1, 2, 3, 4].map(i => <Star key={i} size={14} fill="currentColor" stroke="none" />)}
          <Star size={14} fill="currentColor" fillOpacity={0.4} stroke="none" />
        </div>
        <span className="text-[13px] text-[#007185] hover:underline cursor-pointer">({ratingCount})</span>
      </div>

      <h3 className="text-[15px] font-bold text-[#0F1111] line-clamp-2 leading-tight mb-4 group-hover:text-blue-600 transition-colors uppercase h-[40px]">
        {product.name}
      </h3>

      <div className="mt-auto mb-4">
        <div className="flex items-baseline gap-1">
          <span className="text-[18px] font-bold text-slate-900">{product.price.toLocaleString()} đ</span>
          <span className="text-[13px] text-slate-500">/ cái</span>
        </div>
        <div className="text-[13px] text-[#007600] font-bold mt-1">Sẵn hàng</div>
      </div>

      <button className="w-full py-2 border border-[#C7511F] text-[#C7511F] hover:bg-[#C7511F] hover:text-white font-bold rounded-sm transition-all text-[14px] uppercase flex items-center justify-center gap-2">
        THÊM GIỎ HÀNG
      </button>
    </div>
  );
}

import Pagination from './Pagination';
import { HEADER_CATEGORIES } from '../../constants';

export default function MoreSelectionSection() {
  const mockFilters = [
    { name: 'VẬT LIỆU', options: ['Thép mạ kẽm', 'Inox 304', 'Inox 316', 'Thép carbon'] },
    { name: 'KÍCH THƯỚC', options: ['M3', 'M4', 'M5', 'M6', 'M8'] },
  ];

  const { images } = useSupabaseImages();
  
  // Create some mock products for the grid
  const mockProducts: Product[] = Array.from({ length: 8 }).map((_, i) => ({
    id: `more-${i}`,
    sku: `MS-00${i}`,
    slug: `san-pham-mecsu-mau-${i + 1}`,
    name: `Sản phẩm cơ khí công nghiệp cao cấp Mecsu - Mẫu ${i + 1}`,
    brand: i % 2 === 0 ? 'AIRTAC' : 'ANEX',
    price: 15400 + (i * 1230),
    tax: 10,
    stock: 100,
    unit: 'cái',
    delivery: '1-3 ngày',
    image: '', // will be randomized in card
    category: 'Bulong',
    categorySlug: 'bulong',
  }));

  return (
    <section className="max-w-[1500px] mx-auto py-12 border-t border-slate-200 mt-12 bg-white px-4 lg:px-8">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Sidebar Filters */}
        <div className="lg:w-64 shrink-0">
          <div className="space-y-8">
            <div>
              <h4 className="text-[14px] font-bold text-[#222] mb-4 uppercase tracking-wider">Hãng</h4>
              <div className="space-y-3">
                {['AIRTAC', 'ANEX', 'ASADA', 'BAHCO'].map(brand => (
                  <label key={brand} className="flex items-center gap-3 group cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 border-slate-300 rounded text-blue-600 focus:ring-blue-500" />
                    <span className="text-[13px] text-slate-700 group-hover:text-blue-600 uppercase font-medium">{brand}</span>
                    <span className="ml-auto text-[11px] text-slate-400 font-bold">(12)</span>
                  </label>
                ))}
              </div>
              <button className="mt-4 text-[12px] font-bold text-[#005da4] hover:underline flex items-center gap-1 uppercase">
                + XEM THÊM (8)
              </button>
            </div>

            {mockFilters.map(filter => (
              <div key={filter.name} className="border-t border-slate-100 pt-6">
                <h4 className="text-[14px] font-bold text-[#222] mb-4 uppercase tracking-wider flex justify-between items-center">
                  {filter.name}
                  <ChevronDown size={14} className="text-slate-400" />
                </h4>
                <div className="space-y-3">
                  {filter.options.map(opt => (
                    <label key={opt} className="flex items-center gap-3 group cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 border-slate-300 rounded text-blue-600 focus:ring-blue-500" />
                      <span className="text-[13px] text-slate-700 group-hover:text-blue-600 uppercase font-medium">{opt}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 border-t border-l border-slate-100 rounded-sm">
            {mockProducts.map(p => (
              <ProductCardV2 key={p.id} product={p} />
            ))}
          </div>

          <Pagination 
            currentPage={1} 
            totalPages={277} 
            onPageChange={() => {}} 
          />
        </div>
      </div>
    </section>
  );
}

import { ChevronDown as ChevronDownIcon } from 'lucide-react';
const ChevronDown = ChevronDownIcon;
