import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Wrench,
  Zap,
  Settings,
  Blocks as BlocksIcon,
  PenTool,
  ArrowUpCircle,
  Database,
  Wind,
  Monitor,
  DoorOpen,
  Ruler,
  Droplet,
} from "lucide-react";
import { Link } from "react-router-dom";
import { HEADER_CATEGORIES } from "../constants";
import { useSupabaseImages } from "../hooks/useSupabaseImages";
import { toSlug, generateCategoryUrl } from "../lib/utils";

const ICON_MAP: Record<string, any> = {
  Blocks: BlocksIcon,
  Settings,
  Wrench,
  Zap,
  PenTool,
  ArrowUpCircle,
  Database,
  Wind,
  Monitor,
  DoorOpen,
  Ruler,
  Droplet,
};

const INDUSTRIES = [
  "Manufacturing",
  "Food Processing",
  "Contractors",
  "Agriculture",
  "Hospitality",
  "Property Management",
];

export default function ShopCategoriesGrid() {
  const [activeTab, setActiveTab] = useState("top");
  const { getRandomImage } = useSupabaseImages();
  const navigate = useNavigate();

  // Use all categories
  const displayCategories = HEADER_CATEGORIES;

  // Handle subcategory click - navigate to /danh-muc/:categoryId/:subSlug
  const handleSubcategoryClick = (cat: { id: string; name: string }, subName: string) => {
    const subcategorySlug = toSlug(subName);
    navigate(`${generateCategoryUrl(cat)}/${subcategorySlug}`);
  };

  // Handle Shop all click - navigate to /danh-muc/:categoryId
  const handleShopAllClick = (cat: { id: string }) => {
    navigate(generateCategoryUrl(cat));
  };

  return (
    <section className="bg-white pt-12 pb-8 font-sans">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12 text-left">
        <h2 className="text-3xl font-bold text-slate-900 mb-[7px] tracking-tight">
          Shop categories
        </h2>

        <div className="flex flex-wrap items-center gap-6 mb-8 pb-6">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveTab("top")}
              className={`px-6 py-2.5 text-[15px] font-bold rounded-md transition-all ${
                activeTab === "top"
                  ? "bg-[#24465B] text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              Top categories
            </button>
            <div className="w-px h-6 bg-slate-300 mx-2" />
            <button
              onClick={() => setActiveTab("industry")}
              className={`px-6 py-2.5 text-[15px] font-bold rounded-md transition-all ${
                activeTab === "industry"
                  ? "bg-[#24465B] text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              By industry
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {INDUSTRIES.map((ind) => (
              <button
                key={ind}
                className="px-5 py-2 border border-slate-300 rounded-full text-[13px] font-medium text-slate-600 hover:border-[#24465B] hover:text-[#24465B] transition-all"
              >
                {ind}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-y-10 gap-x-8 items-start">
          {displayCategories.map((cat) => {
            const Icon = ICON_MAP[cat.icon as string] || Wrench;
            // Display first 4 subcategories
            const subs = cat.subcategories.slice(0, 4);

            return (
              <div key={cat.id} className="flex flex-col h-full bg-transparent">
                <div className="bg-[#F2F2F2] p-6 mb-4 rounded-lg shadow-sm">
                  <h3 className="text-[17px] font-bold text-slate-900 leading-tight">
                    {cat.name}
                  </h3>
                </div>

                <div className="flex flex-col gap-3">
                  <ul className="flex flex-col gap-1.5">
                    {subs.map((sub, idx) => {
                      const projectImage = getRandomImage(sub);
                      return (
                        <li
                          key={idx}
                          className="group cursor-pointer flex items-center gap-4"
                        >
                          <button
                            onClick={() => handleSubcategoryClick(cat, sub)}
                            className="flex items-center gap-4 w-full text-left"
                          >
                            <div className="shrink-0 w-8 h-8 rounded bg-slate-50 overflow-hidden flex items-center justify-center border border-slate-100 group-hover:bg-slate-100 transition-all duration-200">
                              {projectImage ? (
                                <img
                                  src={projectImage}
                                  alt={sub}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <Icon
                                  size={16}
                                  className="text-slate-400 group-hover:text-slate-600 transition-colors duration-200"
                                />
                              )}
                            </div>
                            <span className="text-[15px] font-medium text-slate-700 group-hover:font-bold group-hover:text-slate-900 transition-all duration-200 leading-snug">
                              {sub}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>

                  <div className="mt-2">
                    <button 
                      onClick={() => handleShopAllClick(cat)} 
                      className="text-[15px] font-medium text-blue-600 hover:underline flex items-center gap-1 group cursor-pointer"
                    >
                      Shop all
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
