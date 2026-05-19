import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { ChevronRight, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { PRODUCTS, HEADER_CATEGORIES } from '../constants';
import { useSupabaseImages } from '../hooks/useSupabaseImages';
import { toSlug, generateProductUrl } from '../lib/utils';

// Sub-components
import ProductGallery from './product-detail/ProductGallery';
import ProductInfo from './product-detail/ProductInfo';
import PurchaseControls from './product-detail/PurchaseControls';
import ProductInformation from './product-detail/ProductInformation';
import YouMayAlsoLike from './product-detail/YouMayAlsoLike';
import CustomerReviews from './product-detail/CustomerReviews';
import ExploreMoreProducts from './product-detail/ExploreMoreProducts';
import StickyProductBar from './product-detail/StickyProductBar';

interface ProductPageProps {
  product: Product;
  onBack: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onSelectRelated: (product: Product) => void;
}

export default function ProductPage({ product, onBack, onAddToCart, onSelectRelated }: ProductPageProps) {
  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const { getRandomImage, images: allImages } = useSupabaseImages();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setQty(1);
    setActiveImage(0);
    setShowStickyBar(false);
  }, [product.id]);

  useEffect(() => {
    const relatedSection = document.getElementById('related-products');
    if (!relatedSection) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Toggle sticky bar based on whether the related products section is in view or above it
        setShowStickyBar(entry.boundingClientRect.top <= 100);
      },
      {
        threshold: [0, 1],
        rootMargin: '-100px 0px 0px 0px'
      }
    );

    observer.observe(relatedSection);

    // Fallback scroll listener for cases where IntersectionObserver doesn't trigger as expected on fast scroll
    const handleScroll = () => {
      const rect = relatedSection.getBoundingClientRect();
      setShowStickyBar(rect.top <= 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, [product.id]);

  const parentCategory = useMemo(() => {
    // Find parent category that contains the product's category in its subcategories
    return HEADER_CATEGORIES.find(cat => cat.subcategories.includes(product.category)) || HEADER_CATEGORIES[0];
  }, [product.category]);

  const relatedProducts = useMemo(() => {
    return PRODUCTS.filter(
      p => p.category === product.category && p.id !== product.id
    ).slice(0, 8);
  }, [product.category, product.id]);

  const images = useMemo(() => {
    const defaultImage = product.image || null;
    if (!allImages.length) return [defaultImage, defaultImage, defaultImage];
    
    const list = [defaultImage];
    for (let i = 0; i < 3; i++) {
      const randImg = getRandomImage(`${product.id}-${i}`);
      if (randImg && !list.includes(randImg)) {
        list.push(randImg);
      }
    }
    
    while (list.length < 3) list.push(defaultImage);
    return list;
  }, [product.image, product.id, allImages, getRandomImage]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white min-h-screen pb-20"
    >
      {/* Consistent Breadcrumb - Match Category/Subcategory hierarchy and styles */}
      <div className="max-w-[1500px] mx-auto px-4 lg:px-8 py-8 pb-4">
        <nav className="flex items-center text-sm text-slate-500 font-medium flex-wrap">
          <Link to="/" className="hover:text-blue-600 whitespace-nowrap">Trang chủ</Link>
          <ChevronRight size={14} className="mx-2 text-slate-400 flex-shrink-0" />
          <Link 
            to={`/danh-muc/${toSlug(parentCategory.name)}`}
            className="hover:text-blue-600 whitespace-nowrap"
          >
            {parentCategory.name}
          </Link>
          <ChevronRight size={14} className="mx-2 text-slate-400 flex-shrink-0" />
          <Link 
            to={`/danh-muc/${toSlug(parentCategory.name)}/${toSlug(product.category)}`}
            className="hover:text-blue-600 whitespace-nowrap"
          >
            {product.category}
          </Link>
          <ChevronRight size={14} className="mx-2 text-slate-400 flex-shrink-0" />
          <span className="text-slate-900 font-bold line-clamp-1">{product.name}</span>
        </nav>
      </div>

      <div className="max-w-[1500px] mx-auto px-4 lg:px-8 py-4">
        {/* Main Product Section - Zoro Style layout with Similar Products column */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-8 items-start">
          {/* Left Column: Gallery */}
          <div className="lg:col-span-4 xl:col-span-4 lg:sticky lg:top-8">
            <ProductGallery 
              images={images} 
              productName={product.name} 
              activeImage={activeImage} 
              setActiveImage={setActiveImage} 
            />
          </div>

          {/* Middle Column: Info & Purchase (Expanded) */}
          <div className="lg:col-span-5 xl:col-span-5 flex flex-col pt-0">
            <ProductInfo product={product} />
            
            <div className="mt-2">
              <PurchaseControls 
                product={product} 
                qty={qty} 
                setQty={setQty} 
                onAddToCart={onAddToCart} 
              />
            </div>
          </div>

          {/* Right Column: Similar Products Sidebar */}
          <div className="lg:col-span-3 xl:col-span-3 border-l border-slate-100 pl-8 hidden lg:block lg:sticky lg:top-8">
            <h3 className="text-[16px] font-bold text-[#222] mb-4 uppercase tracking-wider">Sản phẩm tương tự</h3>
            <div className="flex flex-col gap-6">
              {relatedProducts.slice(0, 4).map((rp) => {
                const randomImg = getRandomImage(rp.id);
                return (
                  <div key={rp.id} className="relative group">
                    <button 
                      onClick={() => onSelectRelated(rp)}
                      className="flex gap-4 text-left transition-all hover:translate-x-1 w-full"
                    >
                      <div className="relative w-20 h-20 bg-[#f8f8f8] rounded p-1 shrink-0 overflow-hidden">
                        {(randomImg || rp.image) ? (
                          <img 
                            src={randomImg || rp.image} 
                            alt={rp.name} 
                            className="w-full h-full object-contain group-hover:scale-110 transition-transform" 
                          />
                        ) : (
                          <div className="w-full h-full bg-slate-50 flex items-center justify-center text-[10px] text-slate-300">
                            No Image
                          </div>
                        )}
                        {/* Add to cart hover button */}
                        <div 
                          onClick={(e) => {
                            e.stopPropagation();
                            onAddToCart(rp, 1);
                          }}
                          className="absolute inset-0 bg-black/0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                        >
                          <div className="bg-[#FFD814] hover:bg-[#F7CA00] p-1.5 rounded-full shadow-lg border border-yellow-500 transform hover:scale-110 transition-transform">
                            <Plus size={16} className="text-[#0F1111]" strokeWidth={3} />
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col pr-2">
                        <h4 className="text-[13px] text-[#222] font-medium line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
                          {rp.name}
                        </h4>
                        <div className="mt-1 text-[13px] font-bold text-[#0F1111]">
                          {rp.price.toLocaleString()}đ / cái
                        </div>
                      </div>
                    </button>
                  </div>
                );
              })}
            </div>
            
            <Link 
              to={`/danh-muc/${toSlug(parentCategory.name)}/${toSlug(product.category)}`}
              className="mt-8 block text-center py-2 border border-slate-200 text-[13px] font-bold text-[#666] hover:bg-slate-50 transition-colors rounded-sm uppercase"
            >
              Xem tất cả
            </Link>
          </div>
        </div>

        {/* Sticky Product Bar component */}
        <StickyProductBar 
          product={product} 
          onAddToCart={onAddToCart} 
          isVisible={showStickyBar} 
        />

        {/* Product Information Section (Amazon Style) */}
        <div id="product-info">
          <ProductInformation />
        </div>
        <div id="related-products">
          <YouMayAlsoLike />
        </div>
        <div id="customer-reviews">
          <CustomerReviews product={product} />
        </div>
        <ExploreMoreProducts />
      </div>
    </motion.div>
  );
}
