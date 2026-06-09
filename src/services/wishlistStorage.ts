import { Product } from '../types';

const STORAGE_PREFIX = 'mecsu_wishlist_';

export interface WishlistItem {
  id: string;
  productId: string;
  name: string;
  sku: string;
  brand: string;
  image: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  stock: number;
  savedDate: string;
  stockStatus: 'in_stock' | 'out_of_stock' | 'limited';
}

export const wishlistStorage = {
  /**
   * Get wishlist for a specific user from localStorage
   */
  getWishlist(userId: string): WishlistItem[] {
    if (!userId) return [];
    const stored = localStorage.getItem(STORAGE_PREFIX + userId);
    return stored ? JSON.parse(stored) : [];
  },

  /**
   * Save wishlist for a specific user to localStorage
   */
  saveWishlist(userId: string, items: WishlistItem[]): void {
    if (!userId) return;
    localStorage.setItem(STORAGE_PREFIX + userId, JSON.stringify(items));
  },

  /**
   * Add a product to wishlist
   */
  addToWishlist(userId: string, product: Product): void {
    const items = this.getWishlist(userId);
    const exists = items.find((item) => item.productId === product.id);
    if (exists) return;

    const stockStatus: WishlistItem['stockStatus'] =
      product.stock === 0
        ? 'out_of_stock'
        : product.stock < 100
        ? 'limited'
        : 'in_stock';

    const item: WishlistItem = {
      id: `wish-${Date.now()}`,
      productId: product.id,
      name: product.name,
      sku: product.sku,
      brand: product.brand,
      image: product.image,
      price: product.price,
      originalPrice: product.originalPrice,
      discount: product.discount,
      stock: product.stock,
      savedDate: new Date().toISOString().split('T')[0],
      stockStatus,
    };

    items.unshift(item);
    this.saveWishlist(userId, items);
  },

  /**
   * Remove a product from wishlist
   */
  removeFromWishlist(userId: string, productId: string): void {
    const items = this.getWishlist(userId);
    const filtered = items.filter((item) => item.productId !== productId);
    this.saveWishlist(userId, filtered);
  },

  /**
   * Remove multiple products from wishlist
   */
  removeMultipleFromWishlist(userId: string, productIds: string[]): void {
    const items = this.getWishlist(userId);
    const filtered = items.filter((item) => !productIds.includes(item.productId));
    this.saveWishlist(userId, filtered);
  },

  /**
   * Check if a product is in wishlist
   */
  isInWishlist(userId: string, productId: string): boolean {
    const items = this.getWishlist(userId);
    return items.some((item) => item.productId === productId);
  },

  /**
   * Clear all wishlist items for a user
   */
  clearWishlist(userId: string): void {
    if (!userId) return;
    localStorage.removeItem(STORAGE_PREFIX + userId);
  },

  /**
   * Initialize demo wishlist for a new user
   */
  initDemoWishlist(userId: string): void {
    const existing = this.getWishlist(userId);
    if (existing.length > 0) return;

    const demoItems: WishlistItem[] = [
      {
        id: 'wish-demo-1',
        productId: '0043170',
        name: 'Phe Gài Trục Thép 65Mn DIN471 D3x0.4 (50Cái/Bịch)',
        sku: '0043170',
        brand: 'MS-PRO',
        image: '/assets/Phe Gài Trục Thép 65Mn DIN471 D3x0.4 (50Cái_Bịch).png',
        price: 2592,
        originalPrice: 3200,
        discount: 19,
        stock: 863,
        savedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        stockStatus: 'in_stock',
      },
      {
        id: 'wish-demo-2',
        productId: 'bulong-inox-001293',
        name: 'Bulong Inox 304 DIN933 M3x20',
        sku: '001293',
        brand: 'INOX 304',
        image: '/assets/Bulong Inox 304 DIN933 M3x20.jpg',
        price: 3492,
        originalPrice: 4500,
        discount: 22,
        stock: 2469,
        savedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        stockStatus: 'in_stock',
      },
      {
        id: 'wish-demo-3',
        productId: 'ren-cay-009821',
        name: 'Ren Cay Inox M6',
        sku: '009821',
        brand: 'INOX 304',
        image: '/assets/Ren Cay Inox M6.jpg',
        price: 1892,
        originalPrice: 2500,
        discount: 24,
        stock: 0,
        savedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        stockStatus: 'out_of_stock',
      },
      {
        id: 'wish-demo-4',
        productId: 'demo-skf-6205',
        name: 'Vòng bi SKF 6205-2Z',
        sku: 'SKF6205ZZ',
        brand: 'SKF',
        image: '/assets/SKF-6205.jpg',
        price: 185000,
        originalPrice: 220000,
        discount: 16,
        stock: 45,
        savedDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        stockStatus: 'limited',
      },
      {
        id: 'wish-demo-5',
        productId: 'demo-ong-keo-inox',
        name: 'Ống Kẹp Inox 304 Ø21.3mm',
        sku: 'INOX-ODS-213',
        brand: 'INOX 304',
        image: '/assets/Ong-Kep-Inox.jpg',
        price: 89000,
        stock: 320,
        savedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        stockStatus: 'in_stock',
      },
      {
        id: 'wish-demo-6',
        productId: 'demo-gioang-caosu',
        name: 'Gioăng Cao Su Chịu Nhiệt 10x15x2mm',
        sku: 'GIOANG-CS-10152',
        brand: 'VITON',
        image: '/assets/Gioang-Cao-Su.jpg',
        price: 12500,
        stock: 0,
        savedDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        stockStatus: 'out_of_stock',
      },
    ];

    this.saveWishlist(userId, demoItems);
  },
};
