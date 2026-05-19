import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HEADER_CATEGORIES } from '../constants';
import { useSupabaseImages } from '../hooks/useSupabaseImages';
import { toSlug, generateCategoryUrl } from '../lib/utils';
import { HeaderCategory } from '../constants/headerCategories';

interface SubcategoriesSectionProps {
  categoryId?: string;
}

export default function SubcategoriesSection({ categoryId }: SubcategoriesSectionProps) {
  const navigate = useNavigate();
  const { getRandomImage } = useSupabaseImages();

  // Find the current category from HEADER_CATEGORIES
  const currentCategory = categoryId
    ? HEADER_CATEGORIES.find(c => c.id === categoryId)
    : undefined;

  // If no match by ID, try to find by matching subcategory slugs (wildcard route fallback)
  const targetCategory = React.useMemo(() => {
    if (currentCategory) return currentCategory;
    if (!categoryId) return undefined;

    // categoryId might be a slug — find a category whose name slug matches
    return HEADER_CATEGORIES.find(c => toSlug(c.name) === categoryId);
  }, [categoryId, currentCategory]);

  if (!targetCategory || !targetCategory.subcategories?.length) {
    return null;
  }

  const handleSubcategoryClick = (subName: string) => {
    navigate(`${generateCategoryUrl(targetCategory)}/${toSlug(subName)}`);
  };

  const subcategories = targetCategory.subcategories;

  return (
    <section className="w-full mb-12">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[#1a1a1a]">
          {targetCategory.name}
        </h2>
        <span className="text-sm text-slate-500 font-medium">
          {subcategories.length} danh mục
        </span>
      </div>

      {/* Subcategories Grid — 4 per row, larger cards */}
      <div className="bg-white rounded-xl border border-slate-100 p-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {subcategories.map((subName, index) => {
            const image = getRandomImage(subName);
            return (
              <button
                key={index}
                onClick={() => handleSubcategoryClick(subName)}
                className="flex flex-col items-center text-center group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 rounded-xl p-5 hover:bg-slate-50 transition-colors duration-200 border border-transparent hover:border-slate-200"
                style={{ border: 'none', background: 'none', padding: '20px' }}
              >
                {/* Icon/Image */}
                <div className="w-24 h-24 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-4 overflow-hidden transition-all duration-200 group-hover:bg-blue-50 group-hover:border-blue-200 shadow-sm">
                  {image ? (
                    <img
                      src={image}
                      alt={subName}
                      className="w-full h-full object-contain mix-blend-multiply p-2"
                    />
                  ) : (
                    <span className="text-[32px] font-black text-slate-300 group-hover:text-blue-300 transition-colors">
                      {subName.charAt(0)}
                    </span>
                  )}
                </div>

                {/* Subcategory Name */}
                <span className="text-[15px] font-semibold text-slate-700 leading-tight group-hover:font-bold group-hover:text-[#2071a7] transition-all duration-200 line-clamp-2">
                  {subName}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
