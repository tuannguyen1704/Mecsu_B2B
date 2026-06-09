import React from 'react';
import { useSupabaseImages } from '../../hooks/useSupabaseImages';
import { Product } from '../../types';
import ProductGridCard from '../ProductGridCard';

interface ShopTopSellersProps {
  subcategoryName: string;
  onAddToCart?: (product: Product, quantity: number) => void;
}

const MOCK_SELLERS: Product[] = [
  {
    id: 'topseller-1',
    sku: 'SKU-KTN-1001',
    name: '6 1/8 in Wire Stripper',
    slug: '6-1-8-in-wire-stripper',
    category: '',
    categorySlug: '',
    brand: 'KLEIN TOOLS',
    price: 369000,
    originalPrice: 449000,
    tax: 10,
    stock: 42,
    unit: 'Cái',
    delivery: 'Giao hàng trong 24h',
    image: '',
    origin: 'Mỹ',
  },
  {
    id: 'topseller-2',
    sku: 'SKU-MIL-2002',
    name: 'M18 750 MCM Cu/Al Replacement Blades',
    slug: 'm18-750-mcm-replacement-blades',
    category: '',
    categorySlug: '',
    brand: 'MILWAUKEE TOOL',
    price: 3217000,
    originalPrice: 3890000,
    tax: 10,
    stock: 15,
    unit: 'Bộ',
    delivery: 'Giao hàng trong 24h',
    image: '',
    origin: 'Mỹ',
  },
  {
    id: 'topseller-3',
    sku: 'SKU-DWT-3003',
    name: 'Atomic 20V MAX Brushless Compact 1/4 in. Impact Driver',
    slug: 'atomic-20v-max-impact-driver',
    category: '',
    categorySlug: '',
    brand: 'DEWALT',
    price: 2289000,
    originalPrice: 2790000,
    tax: 10,
    stock: 28,
    unit: 'Cái',
    delivery: 'Giao hàng trong 24h',
    image: '',
    origin: 'Mỹ',
  },
  {
    id: 'topseller-4',
    sku: 'SKU-RID-4004',
    name: 'Heavy-Duty Pipe Wrench, 14-inch',
    slug: 'heavy-duty-pipe-wrench-14-inch',
    category: '',
    categorySlug: '',
    brand: 'RIDGID',
    price: 1051500,
    originalPrice: 1270000,
    tax: 10,
    stock: 63,
    unit: 'Cái',
    delivery: 'Giao hàng trong 24h',
    image: '',
    origin: 'Mỹ',
  },
  {
    id: 'topseller-5',
    sku: 'SKU-MAK-5005',
    name: '18V LXT Lithium-Ion Brushless Cordless Impact Driver',
    slug: '18v-lxt-brushless-impact-driver',
    category: '',
    categorySlug: '',
    brand: 'MAKITA',
    price: 2865000,
    originalPrice: 3450000,
    tax: 10,
    stock: 19,
    unit: 'Cái',
    delivery: 'Giao hàng trong 24h',
    image: '',
    origin: 'Nhật Bản',
  },
];

export default function ShopTopSellers({ subcategoryName, onAddToCart }: ShopTopSellersProps) {
  const { getRandomImage } = useSupabaseImages();

  return (
    <section className="py-6 border-t border-slate-200">
      <h2 className="text-[22px] font-bold text-[#222] mb-4">Shop Top Sellers in {subcategoryName}</h2>

      <div className="grid grid-cols-5 gap-3">
        {MOCK_SELLERS.map((product) => (
          <ProductGridCard
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
            customImage={getRandomImage(product.id)}
          />
        ))}
      </div>
    </section>
  );
}
