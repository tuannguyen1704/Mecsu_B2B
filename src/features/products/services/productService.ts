import { Product, Category, Brand } from '@types';
import { PRODUCTS, CATEGORIES, BRANDS, HEADER_CATEGORIES } from '@constants';

/**
 * Product service - handles product-related data operations
 */
export const productService = {
  /**
   * Get all products
   */
  getAll(): Product[] {
    return PRODUCTS;
  },

  /**
   * Get product by ID
   */
  getById(id: string): Product | undefined {
    return PRODUCTS.find((p) => p.id === id);
  },

  /**
   * Get product by SKU
   */
  getBySku(sku: string): Product | undefined {
    return PRODUCTS.find((p) => p.sku === sku);
  },

  /**
   * Get products by category
   */
  getByCategory(category: string): Product[] {
    return PRODUCTS.filter((p) => p.category === category);
  },

  /**
   * Get products by brand
   */
  getByBrand(brand: string): Product[] {
    return PRODUCTS.filter((p) => p.brand === brand);
  },

  /**
   * Search products by query
   */
  search(query: string): Product[] {
    if (!query.trim()) return PRODUCTS;

    const lower = query.toLowerCase();
    return PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(lower) ||
        p.sku.toLowerCase().includes(lower) ||
        p.brand.toLowerCase().includes(lower) ||
        p.category.toLowerCase().includes(lower)
    );
  },

  /**
   * Get related products (same category, different product)
   */
  getRelated(productId: string, category: string, limit = 8): Product[] {
    return PRODUCTS.filter((p) => p.category === category && p.id !== productId).slice(
      0,
      limit
    );
  },

  /**
   * Get featured/best deal products
   */
  getFeatured(limit = 12): Product[] {
    return PRODUCTS.filter((p) => p.discount && p.discount > 0)
      .slice(0, limit);
  },

  /**
   * Get new products
   */
  getNew(limit = 12): Product[] {
    return PRODUCTS.slice(0, limit);
  },

  /**
   * Get products with pagination
   */
  getPaginated(
    page: number,
    itemsPerPage: number,
    filters?: {
      category?: string;
      brand?: string;
      minPrice?: number;
      maxPrice?: number;
      inStock?: boolean;
    }
  ): {
    products: Product[];
    total: number;
    totalPages: number;
    currentPage: number;
  } {
    let filtered = [...PRODUCTS];

    // Apply filters
    if (filters?.category) {
      filtered = filtered.filter((p) => p.category === filters.category);
    }
    if (filters?.brand) {
      filtered = filtered.filter((p) => p.brand === filters.brand);
    }
    if (filters?.minPrice !== undefined) {
      filtered = filtered.filter((p) => p.price >= filters.minPrice!);
    }
    if (filters?.maxPrice !== undefined) {
      filtered = filtered.filter((p) => p.price <= filters.maxPrice!);
    }
    if (filters?.inStock) {
      filtered = filtered.filter((p) => p.stock > 0);
    }

    const total = filtered.length;
    const totalPages = Math.ceil(total / itemsPerPage);
    const start = (page - 1) * itemsPerPage;
    const products = filtered.slice(start, start + itemsPerPage);

    return {
      products,
      total,
      totalPages,
      currentPage: page,
    };
  },

  /**
   * Get all categories
   */
  getCategories(): Category[] {
    return CATEGORIES;
  },

  /**
   * Get header categories
   */
  getHeaderCategories() {
    return HEADER_CATEGORIES;
  },

  /**
   * Get all brands
   */
  getBrands(): Brand[] {
    return BRANDS;
  },

  /**
   * Find parent category for a product
   */
  getParentCategory(productCategory: string): (typeof HEADER_CATEGORIES)[0] | null {
    return (
      HEADER_CATEGORIES.find((cat) =>
        cat.subcategories.includes(productCategory)
      ) || HEADER_CATEGORIES[0]
    );
  },

  /**
   * Filter products with multiple criteria
   */
  filter(
    products: Product[],
    filters: {
      category?: string;
      brand?: string;
      minPrice?: number;
      maxPrice?: number;
      inStock?: boolean;
      search?: string;
    }
  ): Product[] {
    return products.filter((p) => {
      if (filters.category && p.category !== filters.category) return false;
      if (filters.brand && p.brand !== filters.brand) return false;
      if (filters.minPrice && p.price < filters.minPrice) return false;
      if (filters.maxPrice && p.price > filters.maxPrice) return false;
      if (filters.inStock && p.stock <= 0) return false;
      if (filters.search) {
        const search = filters.search.toLowerCase();
        if (
          !p.name.toLowerCase().includes(search) &&
          !p.sku.toLowerCase().includes(search) &&
          !p.brand.toLowerCase().includes(search)
        )
          return false;
      }
      return true;
    });
  },

  /**
   * Sort products
   */
  sort(
    products: Product[],
    sortBy: 'price-asc' | 'price-desc' | 'name' | 'newest' = 'newest'
  ): Product[] {
    const sorted = [...products];
    switch (sortBy) {
      case 'price-asc':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return sorted.sort((a, b) => b.price - a.price);
      case 'name':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'newest':
      default:
        return sorted;
    }
  },
};

export type ProductFilters = {
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  search?: string;
};

export type SortOption = 'price-asc' | 'price-desc' | 'name' | 'newest';
