import React from 'react';
import { ChevronUp, Plus, Minus, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Product } from '../../types';

interface PurchaseControlsProps {
  product: Product;
  qty: number;
  setQty: (qty: number) => void;
  onAddToCart: (product: Product, quantity: number) => void;
}

export default function PurchaseControls({ product, qty, setQty, onAddToCart }: PurchaseControlsProps) {
  return (
    <div className="font-sans text-[#222]">
      {/* Stock Status */}
      <div className="mb-4">
        <h3 className="text-[18px] font-bold text-[#3c763d]">
          Sẵn hàng
        </h3>
      </div>

      {/* Qty & Add to Cart Area */}
      <div className="flex items-stretch gap-4 mb-2">
        <div className="flex items-center border border-slate-300 h-11">
          <button 
            onClick={() => setQty(Math.max(1, qty - 1))}
            className="px-3 hover:bg-slate-50 transition-colors h-full text-slate-500"
          >
            <Minus size={14} />
          </button>
          <input 
            type="text" 
            value={qty} 
            readOnly
            className="w-12 text-center text-[14px] font-medium h-full border-x border-slate-300"
          />
          <button 
            onClick={() => setQty(qty + 1)}
            className="px-3 hover:bg-slate-50 transition-colors h-full text-slate-500"
          >
            <Plus size={14} />
          </button>
        </div>

        <button 
          onClick={() => onAddToCart(product, qty)}
          className="flex-1 bg-[#FFD100] hover:bg-[#ebc100] text-[#222] flex items-center justify-center gap-2 px-6 py-2 font-bold text-[16px] transition-colors shadow-sm"
        >
          <ShoppingCart size={18} />
          Add to Cart
        </button>
      </div>
      
      <div className="text-[12px] text-[#666] font-medium mb-4">
        Tổng cộng: { (product.price * qty).toLocaleString() }đ / cái
      </div>

      {/* Key Features Table */}
      <div className="mt-4">
        <div className="bg-[#132832] text-white px-3 py-2 text-[18px] font-bold rounded-t-sm">
          Thông số kỹ thuật
        </div>
        <div className="border border-slate-200 border-t-0 text-[14px]">
          <div className="grid grid-cols-[160px_1fr] border-b border-slate-200">
            <div className="bg-[#f2f5f7] p-2 font-bold border-r border-slate-200">Dùng Cho Trục:</div>
            <div className="p-2">36 mm</div>
          </div>
          <div className="grid grid-cols-[160px_1fr] border-b border-slate-200">
            <div className="bg-[#f2f5f7] p-2 font-bold border-r border-slate-200">Vật Liệu:</div>
            <div className="p-2">Thép 65Mn</div>
          </div>
          <div className="grid grid-cols-[160px_1fr] border-b border-slate-200">
            <div className="bg-[#f2f5f7] p-2 font-bold border-r border-slate-200">Bề Rộng Rãnh Sử Dụng:</div>
            <div className="p-2">1.85 mm</div>
          </div>
          <div className="grid grid-cols-[160px_1fr] border-b border-slate-200">
            <div className="bg-[#f2f5f7] p-2 font-bold border-r border-slate-200">Đường Kính Rãnh Sử Dụng:</div>
            <div className="p-2">34 mm</div>
          </div>
          <div className="grid grid-cols-[160px_1fr]">
            <div className="bg-[#f2f5f7] p-2 font-bold border-r border-slate-200">Đường Kính Trong:</div>
            <div className="p-2">33.2 mm</div>
          </div>
        </div>
        <a 
          href="https://mecsu.vn/files/document/5YpAQ/DIN+471+Data+Sheet.pdf" 
          target="_blank" 
          rel="noopener noreferrer"
          className="mt-2 text-[#005da4] font-bold text-[15px] hover:underline inline-block"
        >
          Tài liệu tham khảo
        </a>
      </div>
    </div>
  );
}
