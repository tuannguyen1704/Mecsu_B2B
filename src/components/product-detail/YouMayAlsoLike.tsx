import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Product } from "../../types";
import ProductGridCard from "../ProductGridCard";

interface YouMayAlsoLikeProps {
  currentProduct?: Product;
  onAddToCart?: (product: Product, quantity: number) => void;
}

// Generate compatible accessory products as proper Product objects
const generateAccessoryProducts = (): Product[] => {
  const brands = ["MILWAUKEE TOOL", "DEWALT", "MAKITA", "Bosch", "Irwin", "Stanley"];
  const names = [
    "SHOCKWAVE Impact Hex Shank Socket Adapter Set, 1/4 in Drive, 3-Piece",
    "SHOCKWAVE 1/4 in. Hex to 1/2 in. Square Socket Adapter",
    'SHOCKWAVE 1/4" HEX SHANK TO 1/4" SOCKET Adapter',
    '3/8" Socket Adapter, Rapid Load Quick Change Adapter',
    "Impact Duty 3/8 in x 2-9/16 in Magnetic Nut Driver",
    "Shockwave 1/4 to 1/2 Socket Adapter-BK10",
    "Impact Duty 1/2 in Drive x 3 in Extension Bar",
    '3/8" Drive Deep Socket, 10mm, Chrome Vanadium',
    "SHOCKWAVE Magnetic Bit Tip 2-Pack, 1 in",
  ];

  return names.map((name, i) => ({
    id: `acc-${i}`,
    sku: `SKU-ACC-${1000 + i}`,
    name,
    slug: `shockwave-accessory-${i}`,
    category: "Phụ kiện công cụ",
    categorySlug: "phu-kien-cong-cu",
    brand: brands[i % brands.length],
    price: 89000 + Math.floor(Math.random() * 200000),
    originalPrice: undefined,
    tax: 10,
    stock: Math.floor(Math.random() * 50) + 1,
    unit: "Bộ",
    delivery: "Giao hàng trong 24h",
    image: "",
    origin: "Mỹ",
  }));
};

export default function YouMayAlsoLike({
  currentProduct,
  onAddToCart,
}: YouMayAlsoLikeProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const products = React.useMemo(() => generateAccessoryProducts(), []);
  const totalPages = Math.ceil(products.length / 5);
  const startIndex = (currentPage - 1) * 5;
  const visibleProducts = products.slice(startIndex, startIndex + 5);

  return (
    <div className="py-6 border-t border-slate-200">
      <h2 className="text-[22px] font-bold text-[#222] mb-4">
        Phụ kiện & sản phẩm tương thích
      </h2>

      <div className="grid grid-cols-5 gap-3 overflow-x-hidden pb-4">
        {visibleProducts.map((product, index) => (
          <ProductGridCard
            key={`${product.id}-${index}`}
            product={product}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>

      <div className="flex items-center justify-center gap-6 mt-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
          className="p-2 hover:bg-slate-100 rounded-full transition-colors"
        >
          <ChevronLeft size={24} className="text-slate-600" />
        </button>
        <span className="text-[14px] text-slate-700 font-medium">
          {currentPage} / {totalPages}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(totalPages, prev + 1))
          }
          className="p-2 hover:bg-slate-100 rounded-full transition-colors"
        >
          <ChevronRight size={24} className="text-slate-600" />
        </button>
      </div>
    </div>
  );
}
