import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { HEADER_CATEGORIES, CATEGORIES } from '../constants';
import { PageSkeleton } from '../components/PageSkeleton';
import SubcategoriesSection from '../components/SubcategoriesSection';
import { toSlug } from '../lib/utils';

// Find category by ID or slug
const findCategoryById = (id: string) => {
  if (!id) return undefined;
  // First try to find by exact ID match
  let category = HEADER_CATEGORIES.find(c => c.id === id) || CATEGORIES.find(c => c.id === id);
  // If not found, try to match by slug
  if (!category) {
    category = HEADER_CATEGORIES.find(c => toSlug(c.name) === id) || CATEGORIES.find(c => toSlug(c.name) === id);
  }
  return category;
};

export default function CategoryPage() {
  const { categoryId } = useParams();
  const [loading, setLoading] = useState(true);

  // Find category by ID or slug
  const category = categoryId ? findCategoryById(categoryId) : undefined;

  // For display name
  const displayName = category?.name || categoryId ? decodeURIComponent(categoryId).replace(/-/g, ' ') : '';

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, [categoryId]);

  if (loading) {
    return <PageSkeleton />;
  }

  // If no real category found, still show the page
  const pageTitle = category?.name || displayName || 'Sản phẩm';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="max-w-[1600px] mx-auto px-6 lg:px-12 py-12"
    >
      {/* Breadcrumb */}
      <nav className="flex items-center text-sm text-slate-500 mb-8 font-medium">
        <Link to="/" className="hover:text-blue-600">Trang chủ</Link>
        <ChevronRight size={16} className="mx-2 text-slate-400" />
        <span className="text-slate-900 font-bold">{pageTitle}</span>
      </nav>

      {/* Hero Content */}
      <div className="bg-slate-50 p-12 rounded-3xl mb-12">
        <h1 className="text-4xl font-black text-slate-900 mb-4">{pageTitle}</h1>
        <p className="text-lg text-slate-600 max-w-2xl">
          Khám phá danh mục {pageTitle} với đa dạng các loại sản phẩm chất lượng cao, phục vụ cho mọi nhu cầu công trình và sản xuất.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* Left Sidebar - Related Categories */}
        <div className="lg:col-span-1">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Shop Related Categories</h2>
          <ul className="space-y-4">
            {HEADER_CATEGORIES.map(cat => (
              <li key={cat.id}>
                <Link
                  to={`/danh-muc/${toSlug(cat.name)}`}
                  className="text-lg text-[#2071a7] hover:underline transition-colors block"
                >
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Right Content - Subcategories */}
        <div className="lg:col-span-3">
          {/* Subcategories Grid — reuses HEADER_CATEGORIES data */}
          <SubcategoriesSection categoryId={categoryId} />
        </div>
      </div>
    </motion.div>
  );
}
