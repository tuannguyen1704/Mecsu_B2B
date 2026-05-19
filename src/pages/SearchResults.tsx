import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { ChevronRight, Heart, Star, Search, Filter, X, Package, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PRODUCTS } from '../constants';
import { Product } from '../types';
import { PageSkeleton } from '../components/PageSkeleton';
import { useSupabaseImages } from '../hooks/useSupabaseImages';
import { OptimizedImage } from '../components/ui/OptimizedImage';
import { ProductFilterSidebar } from '../components/ProductFilterSidebar';
import Pagination from '../components/product-detail/Pagination';
import { searchProducts, sortByRelevance } from '../utils/searchProducts';
import { generateProductUrl, toSlug } from '../lib/utils';

interface SearchResultsProps {
  onAddToCart?: (product: Product, quantity: number) => void;
}

export default function SearchResults({ onAddToCart }: SearchResultsProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { getRandomImage } = useSupabaseImages();
  const [loading, setLoading] = useState(true);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const productListRef = useRef<HTMLDivElement>(null);
  
  const itemsPerPage = 36;
  
  // Get search query from URL
  const searchQuery = searchParams.get('q') || '';
  
  // Parse filter params from URL
  const activeFilters = useMemo(() => {
    const filters: Record<string, string[]> = {};
    for (const [key, value] of searchParams.entries()) {
      if (key !== 'q') {
        filters[key] = value.split(',');
      }
    }
    return filters;
  }, [searchParams]);

  // Search products
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) {
      return [];
    }
    return sortByRelevance(searchProducts(PRODUCTS, searchQuery), searchQuery);
  }, [searchQuery]);

  // Apply filters to search results
  const filteredResults = useMemo(() => {
    let results = [...searchResults];
    
    // Filter by brand
    if (activeFilters.brand && activeFilters.brand.length > 0) {
      results = results.filter(p => 
        activeFilters.brand!.some(brand => 
          p.brand.toLowerCase().includes(brand.toLowerCase())
        )
      );
    }
    
    // Filter by availability
    if (activeFilters.availability && activeFilters.availability.length > 0) {
      results = results.filter(p => {
        if (activeFilters.availability!.includes('in_stock') && p.stock > 0) {
          return true;
        }
        if (activeFilters.availability!.includes('express') && p.delivery?.includes('2h')) {
          return true;
        }
        if (activeFilters.availability!.includes('preorder')) {
          return p.stock === 0;
        }
        return false;
      });
    }
    
    // Filter by material (using tags as proxy)
    if (activeFilters.material && activeFilters.material.length > 0) {
      results = results.filter(p => {
        const productMaterial = p.material?.toLowerCase() || '';
        return activeFilters.material!.some(mat => productMaterial.includes(mat));
      });
    }
    
    // Filter by origin
    if (activeFilters.origin && activeFilters.origin.length > 0) {
      results = results.filter(p => {
        const productOrigin = p.origin?.toLowerCase() || '';
        return activeFilters.origin!.some(origin => productOrigin.includes(origin.toLowerCase()));
      });
    }
    
    // Filter by price range (if implemented)
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    if (minPrice) {
      results = results.filter(p => p.price >= parseFloat(minPrice));
    }
    if (maxPrice) {
      results = results.filter(p => p.price <= parseFloat(maxPrice));
    }
    
    return results;
  }, [searchResults, activeFilters, searchParams]);

  // Pagination
  const totalPages = Math.ceil(filteredResults.length / itemsPerPage);
  const paginatedResults = filteredResults.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Loading effect
  useEffect(() => {
    setLoading(true);
    setCurrentPage(1);
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Handle filter changes
  const toggleFilter = (key: string, value: string) => {
    const currentValues = activeFilters[key] || [];
    let newValues: string[];
    
    if (currentValues.includes(value)) {
      newValues = currentValues.filter(v => v !== value);
    } else {
      newValues = [...currentValues, value];
    }
    
    const newParams = new URLSearchParams(searchParams);
    if (newValues.length > 0) {
      newParams.set(key, newValues.join(','));
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const clearAllFilters = () => {
    const newParams = new URLSearchParams();
    if (searchQuery) {
      newParams.set('q', searchQuery);
    }
    setSearchParams(newParams);
  };

  const removeFilterChip = (key: string, value: string) => {
    const newValues = activeFilters[key].filter(v => v !== value);
    const newParams = new URLSearchParams(searchParams);
    if (newValues.length > 0) {
      newParams.set(key, newValues.join(','));
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  // Page change handler
  const handlePageChange = (page: number) => {
    setIsPageLoading(true);
    setCurrentPage(page);

    if (productListRef.current) {
      const offset = 80;
      const elementPosition = productListRef.current.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }

    // Wait for products to render, then hide spinner
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIsPageLoading(false);
      });
    });
  };

  // Total active filters count
  const totalActiveCount = Object.values(activeFilters).reduce((acc, curr) => acc + curr.length, 0);

  // Navigate to product detail page
  const handleProductClick = (product: Product) => {
    // Store product data in sessionStorage for the detail page
    sessionStorage.setItem('selectedProduct', JSON.stringify(product));
    const url = generateProductUrl(product);
    navigate(url);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return <PageSkeleton />;
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="max-w-[1600px] mx-auto px-6 lg:px-12 py-8"
    >
      {/* Back Button and Search Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[14px] font-medium text-slate-500 hover:text-brand-secondary transition-colors mb-4"
        >
          <ArrowLeft size={16} />
          Quay lại
        </button>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#1a1a1a]">
              Kết quả tìm kiếm cho: <span className="text-brand-secondary">"{searchQuery}"</span>
            </h1>
            <p className="text-[14px] text-slate-500 mt-1">
              {filteredResults.length > 0 ? (
                <>{filteredResults.length.toLocaleString()} sản phẩm được tìm thấy</>
              ) : (
                <>Không có sản phẩm nào phù hợp</>
              )}
            </p>
          </div>
          
          {/* Mobile Filter Button */}
          <button 
            onClick={() => setIsMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-2 bg-[#1a1a1a] text-white px-4 py-2 rounded-full font-bold text-[12px]"
          >
            <Filter size={16} />
            Bộ lọc
            {totalActiveCount > 0 && (
              <span className="bg-brand-primary text-[#1a1a1a] w-5 h-5 rounded-full text-[10px] flex items-center justify-center">
                {totalActiveCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Active Filters Chips */}
      <AnimatePresence>
        {totalActiveCount > 0 && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-wrap items-center gap-2 mb-6"
          >
            <span className="text-[12px] font-bold text-slate-500 uppercase tracking-wider">
              Đang lọc:
            </span>
            {Object.entries(activeFilters).map(([key, values]) => 
              values.map(val => (
                <button
                  key={`${key}-${val}`}
                  onClick={() => removeFilterChip(key, val)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-secondary/10 text-brand-secondary text-[12px] font-bold rounded-full hover:bg-brand-secondary/20 transition-colors"
                >
                  {val}
                  <X size={12} />
                </button>
              ))
            )}
            <button
              onClick={clearAllFilters}
              className="text-[12px] font-bold text-red-500 hover:text-red-700 transition-colors ml-2"
            >
              Xóa tất cả
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex gap-8 relative">
        {/* Sidebar Filters - Desktop */}
        <div className="hidden lg:block w-[300px] flex-shrink-0">
          <ProductFilterSidebar />
        </div>

        {/* Mobile Filter Modal */}
        <AnimatePresence>
          {isMobileFilterOpen && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileFilterOpen(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999]"
              />
              <motion.div 
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed top-0 left-0 bottom-0 w-[300px] bg-white z-[1000] p-6 shadow-2xl overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                  <h3 className="font-black text-lg uppercase tracking-tight">Bộ lọc</h3>
                  <button onClick={() => setIsMobileFilterOpen(false)}>
                    <X size={24} className="text-slate-400" />
                  </button>
                </div>
                <div className="pb-20">
                  <ProductFilterSidebar />
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Main Product List */}
        <div className="flex-1" ref={productListRef}>
          {/* Empty State */}
          {filteredResults.length === 0 ? (
            <div className="bg-[#f5f5f5] rounded-xl p-12 text-center min-h-[400px] flex flex-col items-center justify-center">
              <Package className="w-20 h-20 text-slate-300 mb-4" />
              <h2 className="text-xl font-bold text-slate-700 mb-2">
                Không tìm thấy sản phẩm phù hợp
              </h2>
              <p className="text-[14px] text-slate-500 mb-6 max-w-md mx-auto">
                Vui lòng thử từ khóa khác hoặc điều chỉnh bộ lọc để có kết quả tốt hơn.
              </p>
              <div className="flex gap-3">
                {searchQuery && (
                  <button
                    onClick={clearAllFilters}
                    className="px-6 py-2.5 bg-brand-primary text-brand-secondary font-bold text-[14px] rounded-lg hover:bg-brand-primary/90 transition-colors"
                  >
                    Xóa bộ lọc
                  </button>
                )}
                <Link
                  to="/"
                  className="px-6 py-2.5 bg-brand-secondary text-white font-bold text-[14px] rounded-lg hover:bg-[#002a55] transition-colors"
                >
                  Quay về trang chủ
                </Link>
              </div>
              
              {/* Suggested searches */}
              <div className="mt-8 pt-6 border-t border-slate-200">
                <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-3">
                  Gợi ý tìm kiếm:
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {['Bulong Inox', 'Vòng bi', 'Ốc vít', 'Bánh xe đẩy'].map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => navigate(`/search?q=${encodeURIComponent(suggestion)}`)}
                      className="px-4 py-1.5 bg-white border border-slate-200 text-[13px] font-medium text-slate-600 rounded-full hover:border-brand-primary hover:text-brand-secondary transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="bg-[#ededed] p-4 rounded-sm min-h-[500px] relative">
                {isPageLoading && (
                  <div className="absolute inset-0 bg-[#ededed]/50 backdrop-blur-[1px] z-20 flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                  {paginatedResults.map((product, i) => (
                    <div
                        key={`${product.id}-${i}`} 
                        onClick={() => handleProductClick(product)}
                        className="bg-white p-4 flex flex-col group relative transition-shadow rounded-sm border border-transparent hover:border-slate-300 cursor-pointer"
                      >
                        <button 
                          className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors z-10"
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          <Heart size={18} />
                        </button>

                        <div className="aspect-square mb-6 flex items-center justify-center p-2">
                          <OptimizedImage 
                            src={getRandomImage(product.id.toString()) || undefined} 
                            alt={product.name} 
                            className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>

                        <div className="flex flex-col flex-1">
                          <div className="text-[13px] font-bold text-[#1a1a1a] mb-1">{product.brand}</div>
                          <span className="text-[15px] text-[#2071a7] font-medium leading-tight mb-2 block line-clamp-2 min-h-[2.5rem]">
                            {product.name}
                          </span>

                          <div className="text-[12px] text-slate-500 mb-3 font-medium tracking-tight">
                            SKU: {product.sku}
                          </div>

                          <div className="flex items-center gap-0.5 mb-3 mt-auto">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                size={14} 
                                className={i < (product.rating || 0) ? "fill-[#ed6c2d] text-[#ed6c2d]" : "text-slate-300"} 
                              />
                            ))}
                            <span className="text-[14px] text-slate-600 ml-1">
                              ({Math.floor(Math.random() * 200 + 10)})
                            </span>
                          </div>

                          <div className="flex flex-col gap-3">
                            <div className="flex items-baseline gap-1">
                              <span className="text-[18px] font-black text-[#1a1a1a]">
                                {product.price.toLocaleString('vi-VN')} đ
                              </span>
                              {product.unit && (
                                <span className="text-[12px] text-slate-500">/ {product.unit}</span>
                              )}
                            </div>

                            <div className={`text-[13px] font-bold ${product.stock > 0 ? 'text-green-700' : 'text-slate-900'}`}>
                              {product.stock > 0 ? 'Sẵn hàng' : 'Hết hàng'}
                            </div>

                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                if (onAddToCart) {
                                  onAddToCart(product, 1);
                                }
                              }}
                              className={`w-full py-2.5 rounded-sm border transition-all text-sm font-bold uppercase tracking-tight ${
                                product.stock > 0 
                                  ? 'bg-brand-primary border-brand-primary text-brand-secondary hover:bg-brand-primary/90' 
                                  : 'border-slate-800 bg-white text-slate-800 hover:bg-slate-800 hover:text-white font-black'
                              }`}
                            >
                              {product.stock > 0 ? 'Thêm giỏ hàng' : 'Nhắc tôi sau'}
                            </button>
                          </div>
                        </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8 bg-white rounded-sm border border-slate-200">
                  <Pagination 
                    currentPage={currentPage} 
                    totalPages={totalPages} 
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}
