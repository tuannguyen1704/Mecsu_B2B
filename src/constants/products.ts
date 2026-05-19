import { Product } from '../types';
import { toSlug } from '../lib/utils';

const INITIAL_PRODUCTS: Product[] = [
  {
    id: '0043170',
    sku: '0043170',
    name: 'Phe Gài Trục Thép 65Mn DIN471 D3x0.4 (50Cái/Bịch)',
    slug: 'phe-gai-truc-thep-65mn-din471-d3x0-4',
    category: 'Phe Gài',
    categorySlug: 'phe-gai',
    brand: 'MS-PRO',
    price: 2592,
    originalPrice: 3200,
    discount: 19,
    tax: 192,
    stock: 863,
    unit: 'Cái',
    delivery: 'Xuất kho trong ngày',
    image: '/assets/Phe Gài Trục Thép 65Mn DIN471 D3x0.4 (50Cái_Bịch).png',
    rating: 5.0,
    isInstallment: false,
    offers: ['Miễn phí vận chuyển cho đơn hàng từ 500k']
  },
  {
    id: 'bulong-inox-001293',
    sku: '001293',
    name: 'Bulong Inox 304 DIN933 M3x20',
    slug: 'bulong-inox-304-din933-m3x20',
    category: 'Bulong',
    categorySlug: 'bulong',
    brand: 'INOX 304',
    price: 3492,
    originalPrice: 4500,
    discount: 22,
    tax: 0,
    stock: 2469,
    unit: 'Cái',
    delivery: 'Xuất kho trong ngày',
    image: '/assets/Bulong Inox 304 DIN933 M3x20.jpg',
    rating: 5.0,
    isInstallment: false,
    offers: ['Dự kiến giao hàng trong 24h']
  },
  {
    id: 'ren-cay-009821',
    sku: '009821',
    name: 'Ren Cay Inox M6',
    slug: 'ren-cay-inox-m6',
    category: 'Ren Cay',
    categorySlug: 'ren-cay',
    brand: 'INOX 304',
    price: 1892,
    originalPrice: 2500,
    discount: 24,
    tax: 0,
    stock: 1500,
    unit: 'Cái',
    delivery: 'Xuất kho trong ngày',
    image: '/assets/Ren Cay Inox M6.jpg',
    rating: 4.8,
    isInstallment: false,
    offers: ['Miễn phí vận chuyển cho đơn hàng từ 500k']
  },
];

export function generateProducts(count: number = 120): Product[] {
  return Array(count)
    .fill(INITIAL_PRODUCTS)
    .flat()
    .map((p, i) => ({
      ...p,
      id: `${p.id}-${i}`,
      // Keep the original slug without appending SKU/index
      // SKU will be appended by generateProductUrl when creating URLs
    }));
}

export const PRODUCTS: Product[] = generateProducts(120);
