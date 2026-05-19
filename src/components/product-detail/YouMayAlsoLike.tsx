import React, { useState } from 'react';
import { Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useSupabaseImages } from '../../hooks/useSupabaseImages';

interface ProductCardProps {
  brand: string;
  name: string;
  price: string;
  image: string | null;
}

const ProductCard = ({ brand, name, price, image }: ProductCardProps) => (
  <div className="flex-none w-[200px] bg-white p-4 border border-slate-200 rounded-sm shadow-sm hover:shadow-md transition-shadow group relative">
    <button className="absolute top-2 right-2 text-slate-400 hover:text-red-500 transition-colors">
      <Heart size={20} />
    </button>
    <div className="aspect-square mb-3 overflow-hidden">
      {image ? (
        <img src={image} alt={name} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300" />
      ) : (
        <div className="w-full h-full bg-slate-50 flex items-center justify-center text-slate-300">
          No Image
        </div>
      )}
    </div>
    <div className="text-[12px] font-bold text-slate-600 uppercase mb-1">{brand}</div>
    <h4 className="text-[14px] font-medium text-[#007185] hover:underline cursor-pointer line-clamp-3 mb-4 h-[60px]">
      {name}
    </h4>
    <div className="text-[18px] font-bold text-[#0F1111] mb-4">{price}</div>
    <button className="w-full py-2 bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] text-[#0F1111] font-medium rounded-full shadow-sm transition-colors text-[14px]">
      Add to Cart
    </button>
  </div>
);

const CATEGORIES = [
  "Impact Socket Adapters",
  "Screwdriver Bits and Nutsetters",
  "Socket Adapters"
];

export default function YouMayAlsoLike() {
  const { getRandomImage } = useSupabaseImages();
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 3;

  const products = [
    { brand: "MILWAUKEE TOOL", name: "SHOCKWAVE Impact Hex Shank Socket Adapter Set, 1/4 in Drive, 3-Piece", price: "270.000đ / cái", image: getRandomImage('milwaukee_set') },
    { brand: "MILWAUKEE TOOL", name: "SHOCKWAVE 1/4 in. Hex to 1/2 in. Square Socket Adapter", price: "150.000đ / cái", image: getRandomImage('milwaukee_adapter_1') },
    { brand: "MILWAUKEE TOOL", name: "SHOCKWAVE 1/4\" HEX SHANK TO 1/4\" SOCKET Adapter", price: "115.000đ / cái", image: getRandomImage('milwaukee_adapter_2') },
    { brand: "DEWALT", name: "3/8\" Socket Adapter, Rapid Load Quick Change Adapter", price: "89.000đ / cái", image: getRandomImage('dewalt_adapter') },
    { brand: "MILWAUKEE TOOL", name: "Impact Duty 3/8 in x 2-9/16 in Magnetic Nut Driver", price: "99.000đ / cái", image: getRandomImage('milwaukee_driver') },
    { brand: "MILWAUKEE TOOL", name: "Shockwave 1/4 to 1/2 Socket Adapter-BK10", price: "95.000đ / cái", image: getRandomImage('milwaukee_adapter_3') },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 border-t border-slate-200">
      <h2 className="text-[24px] font-bold text-[#0F1111] mb-2">Phụ kiện & sản phẩm tương thích</h2>
      
      <div className="flex flex-wrap gap-2 text-[14px] text-[#007185] mb-4">
        {CATEGORIES.map((cat, i) => (
          <React.Fragment key={cat}>
            <span className="hover:underline cursor-pointer">Shop {cat}</span>
            {i < CATEGORIES.length - 1 && <span className="text-slate-300">|</span>}
          </React.Fragment>
        ))}
      </div>

      <div className="relative mb-6">
        <div className="flex gap-4 overflow-x-hidden pb-4">
          {products.map((product, index) => (
            <ProductCard key={index} product={product} />
          ))}
        </div>
      </div>

      <div className="flex items-center justify-center gap-6 mt-4">
        <button 
          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
          className="p-1 hover:bg-slate-100 rounded-full transition-colors"
        >
          <ChevronLeft size={24} className="text-slate-600" />
        </button>
        <span className="text-[16px] text-slate-700">
          {currentPage} of {totalPages}
        </span>
        <button 
          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
          className="p-1 hover:bg-slate-100 rounded-full transition-colors"
        >
          <ChevronRight size={24} className="text-slate-600" />
        </button>
      </div>
    </div>
  );
}
