import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronRight, Heart, Star, Filter, X } from 'lucide-react';
import { motion } from 'motion/react';
import { CATEGORIES, HEADER_CATEGORIES, PRODUCTS } from '../constants';
import { Product } from '../types';
import { PageSkeleton } from '../components/PageSkeleton';
import { useSupabaseImages } from '../hooks/useSupabaseImages';
import { OptimizedImage } from '../components/ui/OptimizedImage';
import { ProductFilterSidebar } from '../components/ProductFilterSidebar';
import { AnimatePresence } from 'motion/react';
import Pagination from '../components/product-detail/Pagination';
import ExploreMoreProducts from '../components/product-detail/ExploreMoreProducts';
import ShopTopSellers from '../components/product-detail/ShopTopSellers';
import AboutCategory from '../components/product-detail/AboutCategory';
import CategoryFAQ from '../components/product-detail/CategoryFAQ';
import { toSlug, generateCategoryUrl, generateProductUrl } from '../lib/utils';

interface SubcategoryPageProps {
  onAddToCart?: (product: Product, quantity: number) => void;
}

// Convert slug back to readable name
const fromSlug = (slug: string): string => {
  if (!slug) return '';
  const words = slug.split('-');
  return words.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

// Find parent category of a subcategory
const findParentCategory = (subcategorySlug: string) => {
  if (!subcategorySlug) return null;
  
  const decoded = decodeURIComponent(subcategorySlug);
  
  // Find which category contains this subcategory
  for (const cat of CATEGORIES) {
    if (toSlug(cat.name) === decoded) {
      return cat; // This is the category itself
    }
    if (cat.subcategories?.some(sub => toSlug(sub) === decoded)) {
      return cat; // This is the parent
    }
  }
  
  // Fallback: search by original name in PRODUCTS
  return null;
};

// Generate proper mock products matching Product interface
const generateMockProducts = (count: number, categorySlug?: string, subcategorySlug?: string): Product[] => {
  const brands = ['ANSELL', 'PIP', 'MECHANIX WEAR', 'SHOWA', 'CAIMAN', 'AZUSA SAFETY', 'GLOVEWORKS', 'KIMBERLY-CLARK'];
  const titles = [
    'Microflex MF-300 Exam Gloves, 6.3 mil, Natural Rubber Latex, Powder-Free, L (9), Natural, PK100',
    'SG-375, Disposable Gloves, 11 mil Palm, Latex, Powder-Free, XL (10), 50 PK, Blue',
    'Ambi-dex Octane, Disposable Gloves, 3 mil Palm, Nitrile, Powder-Free, L (9), 100 PK, Blue',
    'Premium Nitrile Disposable Gloves, 6 mil, Powder-Free, Fully Textured, XL, 100 PK, Black',
    'HyFlex 11-840 Nitrile Coated Gloves, Spandex Liner, Knit Wrist, Gray/Black, Size 9',
    'PowerGrab Thermo Hi-Vis Winter Gloves, Latex Coated, Brushed Acrylic Liner, Orange',
    'MaxiFlex Ultimate Gloves, Nitrile Foam Coating, 18 Gauges, Gray/Black, Size L',
    'Touch N Tuff Gloves, 4 mil, Nitrile, Powder-Free, Blue, 100/PK',
  ];
  
  // Find category info
  const decodedCatSlug = categorySlug ? decodeURIComponent(categorySlug) : '';
  const decodedSubCatSlug = subcategorySlug ? decodeURIComponent(subcategorySlug) : '';
  const parentCategory = CATEGORIES.find(c => toSlug(c.name) === decodedCatSlug);
  const subcategoryName = parentCategory?.subcategories?.find(sub => toSlug(sub) === decodedSubCatSlug) || fromSlug(decodedSubCatSlug);

  return Array.from({ length: count }).map((_, i) => {
    const brand = brands[i % brands.length];
    const title = titles[i % titles.length];
    const baseProduct = PRODUCTS[i % PRODUCTS.length];
    const price = baseProduct?.price || 50000 + Math.floor(Math.random() * 200000);
    const productId = `prod-${i}-${Date.now()}`;
    
    return {
      id: productId,
      sku: `SKU-${brand.substring(0, 3).toUpperCase()}-${1000 + i}`,
      name: `${subcategoryName} - ${title.substring(0, 50)}`,
      slug: toSlug(title.substring(0, 40)),
      category: subcategoryName,
      categorySlug: subcategorySlug || 'san-pham',
      brand,
      price,
      originalPrice: price < 100000 ? undefined : Math.floor(price * 1.2),
      tax: 10,
      stock: i % 5 !== 0 ? Math.floor(Math.random() * 100) + 1 : 0,
      unit: i % 2 === 0 ? 'Hộp 100 cái' : 'Hộp 50 cái',
      delivery: 'Giao hàng trong 24h',
      image: baseProduct?.image || '',
      origin: 'Mỹ',
    } as Product;
  });
};

export default function SubcategoryPage({ onAddToCart }: SubcategoryPageProps) {
  const { categoryId, subSlug } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 36;
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const { getRandomImage } = useSupabaseImages();
  const productListRef = useRef<HTMLDivElement>(null);

  // Find parent category by ID - check HEADER_CATEGORIES first (top-level), then CATEGORIES
  // Fall back to finding by subSlug if categoryId doesn't match any actual ID (wildcard route case)
  const parentCategory = useMemo(() => {
    if (!categoryId) {
      // Try to find parent by subSlug when categoryId is missing/invalid
      if (!subSlug) return null;
      const decodedSub = decodeURIComponent(subSlug);
      return (
        HEADER_CATEGORIES.find(c =>
          c.subcategories?.some(sub => toSlug(sub) === decodedSub)
        ) ||
        CATEGORIES.find(c =>
          c.subcategories?.some(sub => toSlug(sub) === decodedSub)
        ) ||
        null
      );
    }
    return (
      HEADER_CATEGORIES.find(c => c.id === categoryId) ||
      CATEGORIES.find(c => c.id === categoryId) ||
      // If categoryId doesn't match any ID, try to find by subSlug
      (() => {
        const decodedSub = subSlug ? decodeURIComponent(subSlug) : '';
        return (
          HEADER_CATEGORIES.find(c =>
            c.subcategories?.some(sub => toSlug(sub) === decodedSub)
          ) ||
          CATEGORIES.find(c =>
            c.subcategories?.some(sub => toSlug(sub) === decodedSub)
          ) ||
          null
        );
      })()
    );
  }, [categoryId, subSlug]);

  // Handle sub-subcategory click - navigate to update URL
  const handleSubSubcategoryClick = (subName: string) => {
    if (parentCategory) {
      navigate(`${generateCategoryUrl(parentCategory)}/${subSlug}/${toSlug(subName)}`);
    }
  };

  // Find subcategory details - same parent as parentCategory, used for carousel sub-subcategories
  const subcategoryDetails = parentCategory;

  // Display names
  const displayName = subSlug ? fromSlug(subSlug) : '';
  const parentName = parentCategory?.name || displayName;
  const displayTitle = displayName;

  // Generate products
  const mockProducts = useMemo(() =>
    generateMockProducts(360, categoryId, subSlug),
    [categoryId, subSlug]
  );

  useEffect(() => {
    setLoading(true);
    setCurrentPage(1);
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, [categoryId, subSlug]);

  const handlePageChange = (page: number) => {
    setIsPageLoading(true);
    setCurrentPage(page);

    if (productListRef.current) {
      const offset = 80;
      const elementPosition = productListRef.current.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }

    setTimeout(() => setIsPageLoading(false), 800);
  };

  const paginatedProducts = mockProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(mockProducts.length / itemsPerPage);

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

  // Page title is always the subcategory name (displayName)
  const pageTitle = displayName || 'Sản phẩm';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="max-w-[1600px] mx-auto px-6 lg:px-12 py-8"
    >
      {/* Breadcrumb */}
      <nav className="flex items-center text-[13px] text-slate-500 mb-6 font-medium">
        <Link to="/" className="hover:text-blue-600">Trang chủ</Link>
        <ChevronRight size={14} className="mx-2 text-slate-400" />
        {parentCategory ? (
          <>
            <Link to={generateCategoryUrl(parentCategory)} className="hover:text-blue-600 font-bold">{parentCategory.name}</Link>
            <ChevronRight size={14} className="mx-2 text-slate-400" />
            <span className="text-slate-900 font-bold">{displayName}</span>
          </>
        ) : (
          <span className="text-slate-900 font-bold">{displayName || 'Sản phẩm'}</span>
        )}
      </nav>

      {/* Subcategory Section — 4-per-row grid, no scroll — only show when NOT viewing a specific subcategory */}
      {!subSlug && subcategoryDetails?.subcategories && subcategoryDetails.subcategories.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[#1a1a1a] mb-6">
            {displayTitle}
          </h2>

          <div className="bg-white rounded-xl border border-slate-100 p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {subcategoryDetails.subcategories.map((sub, index) => (
                <button
                  key={index}
                  onClick={() => handleSubSubcategoryClick(sub)}
                  className="flex flex-col items-center text-center group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 rounded-xl p-5 hover:bg-slate-50 transition-colors duration-200 border border-transparent hover:border-slate-200"
                  style={{ border: 'none', background: 'none', padding: '20px' }}
                >
                  {/* Icon/Image */}
                  <div className="w-24 h-24 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-4 overflow-hidden transition-all duration-200 group-hover:bg-blue-50 group-hover:border-blue-200 shadow-sm">
                    <OptimizedImage
                      src={getRandomImage(sub) || undefined}
                      alt={sub}
                      className="w-full h-full object-contain mix-blend-multiply p-2"
                    />
                  </div>
                  {/* Subcategory Name */}
                  <span className="text-[15px] font-semibold text-slate-700 leading-tight group-hover:font-bold group-hover:text-[#2071a7] transition-all duration-200 line-clamp-2">
                    {sub}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      <div className="flex gap-8 relative">
        {/* Sidebar Filters - Desktop */}
        <div className="hidden lg:block w-[300px] flex-shrink-0">
          <ProductFilterSidebar />
        </div>

        {/* Mobile Filter Button and Modal */}
        <div className="lg:hidden fixed bottom-6 right-6 z-[200]">
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="flex items-center gap-2 bg-[#1a1a1a] text-white px-6 py-4 rounded-full font-black uppercase text-[12px] tracking-[0.2em] shadow-2xl hover:scale-105 active:scale-95 transition-all"
          >
            <Filter size={18} />
            Bộ lọc
          </button>
        </div>

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
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-[#1a1a1a]">
              {displayTitle} <span className="text-slate-500 font-normal text-sm ml-1">({mockProducts.length}+ sản phẩm)</span>
            </h1>
          </div>

          <div className="bg-[#ededed] p-4 rounded-sm min-h-[500px] relative">
            {isPageLoading && (
              <div className="absolute inset-0 bg-[#ededed]/50 backdrop-blur-[1px] z-20 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              {isPageLoading ? (
                Array.from({ length: 12 }).map((_, i) => (
                  <div key={`skeleton-${i}`} className="bg-white p-4 flex flex-col rounded-sm border border-transparent h-[450px]">
                    <div className="aspect-square bg-slate-100 animate-pulse mb-6 rounded-sm" />
                    <div className="h-4 bg-slate-100 animate-pulse w-1/3 mb-2" />
                    <div className="h-6 bg-slate-100 animate-pulse w-3/4 mb-4" />
                    <div className="h-4 bg-slate-100 animate-pulse w-1/2 mb-auto" />
                    <div className="h-8 bg-slate-100 animate-pulse w-full mt-4" />
                  </div>
                ))
              ) : (
                paginatedProducts.map((product, i) => (
                  <div
                    key={`${product.id}-${i}`}
                    onClick={() => handleProductClick(product)}
                    className="bg-white p-4 flex flex-col group relative transition-shadow rounded-sm border border-transparent hover:border-slate-300 cursor-pointer"
                  >
                    <button
                      className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors z-10"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Heart size={18} />
                    </button>

                    <div className="aspect-square mb-6 flex items-center justify-center p-2">
                      <OptimizedImage
                        src={getRandomImage(product.id) || undefined}
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
                        {product.sku || 'SKU: Đang cập nhật'}
                      </div>

                      <div className="flex items-center gap-0.5 mb-3 mt-auto">
                        {[...Array(5)].map((_, starIndex) => (
                          <Star key={starIndex} size={14} className={starIndex < 4 ? "fill-[#ed6c2d] text-[#ed6c2d]" : "text-slate-300"} />
                        ))}
                        <span className="text-[14px] text-slate-600 ml-1">(150+ đánh giá)</span>
                      </div>

                      <div className="flex flex-col gap-3">
                        <div className="flex items-baseline gap-1">
                          <span className="text-[18px] font-black text-[#1a1a1a]">
                            {product.price > 0 ? `${product.price.toLocaleString()} đ` : 'Liên hệ'}
                          </span>
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
                ))
              )}
            </div>
          </div>

          <div className="mt-8 bg-white rounded-sm border border-slate-200">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>

      <div className="mt-16 bg-white">
        <ShopTopSellers subcategoryName={displayTitle} />
        <AboutCategory title={`Giới thiệu về ${displayTitle}`} />
        <CategoryFAQ />
        <ExploreMoreProducts />
      </div>
    </motion.div>
  );
}
