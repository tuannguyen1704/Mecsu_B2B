import { useState, useMemo, useCallback } from 'react';
import { Product, Category } from '@types';
import { productService, ProductFilters, SortOption } from '../services/productService';

export interface UseProductsOptions {
  initialCategory?: Category | null;
  initialFilters?: ProductFilters;
  itemsPerPage?: number;
}

export interface UseProductsReturn {
  // Products
  products: Product[];
  filteredProducts: Product[];
  displayedProducts: Product[];

  // Category
  selectedCategory: Category | null;
  setSelectedCategory: (cat: Category | null) => void;

  // Filters
  filters: ProductFilters;
  updateFilters: (filters: Partial<ProductFilters>) => void;
  clearFilters: () => void;
  hasActiveFilters: boolean;

  // Sort
  sortBy: SortOption;
  setSortBy: (sort: SortOption) => void;

  // Pagination
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
  totalProducts: number;
  itemsPerPage: number;

  // Loading
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

/**
 * Hook for managing products with filtering, sorting, and pagination
 */
export function useProducts(options: UseProductsOptions = {}): UseProductsReturn {
  const {
    initialCategory = null,
    initialFilters = {},
    itemsPerPage: defaultItemsPerPage = 15,
  } = options;

  // State
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(initialCategory);
  const [filters, setFilters] = useState<ProductFilters>(initialFilters);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // All products
  const products = useMemo(() => productService.getAll(), []);

  // Filtered products
  const filteredProducts = useMemo(() => {
    let result = products;

    // Category filter
    if (selectedCategory) {
      result = result.filter((p) => p.category === selectedCategory.name);
    }

    // Apply additional filters
    result = productService.filter(result, filters);

    // Sort
    result = productService.sort(result, sortBy);

    return result;
  }, [products, selectedCategory, filters, sortBy]);

  // Pagination
  const totalProducts = filteredProducts.length;
  const totalPages = Math.ceil(totalProducts / defaultItemsPerPage);
  const displayedProducts = useMemo(() => {
    const start = (currentPage - 1) * defaultItemsPerPage;
    return filteredProducts.slice(start, start + defaultItemsPerPage);
  }, [filteredProducts, currentPage, defaultItemsPerPage]);

  // Check if any filters are active
  const hasActiveFilters = useMemo(
    () =>
      Boolean(
        filters.category ||
          filters.brand ||
          filters.minPrice !== undefined ||
          filters.maxPrice !== undefined ||
          filters.inStock ||
          filters.search
      ),
    [filters]
  );

  // Update filters
  const updateFilters = useCallback((newFilters: Partial<ProductFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setCurrentPage(1); // Reset page when filters change
  }, []);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setFilters({});
    setSelectedCategory(null);
    setCurrentPage(1);
  }, []);

  // Reset page when category changes
  const handleSetSelectedCategory = useCallback((cat: Category | null) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
  }, []);

  return {
    // Products
    products,
    filteredProducts,
    displayedProducts,

    // Category
    selectedCategory,
    setSelectedCategory: handleSetSelectedCategory,

    // Filters
    filters,
    updateFilters,
    clearFilters,
    hasActiveFilters,

    // Sort
    sortBy,
    setSortBy,

    // Pagination
    currentPage,
    setCurrentPage,
    totalPages,
    totalProducts,
    itemsPerPage: defaultItemsPerPage,

    // Loading
    isLoading,
    setIsLoading,
  };
}
