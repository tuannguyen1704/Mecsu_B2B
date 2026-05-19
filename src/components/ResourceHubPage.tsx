import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Search,
  ArrowRight,
  Clock,
  BookOpen,
  Send,
} from 'lucide-react';

// Image placeholders - replace with actual images later
const IMAGES = {
  hero: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1200&auto=format&fit=crop',
  boltGuide: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebb6122?q=80&w=800&auto=format&fit=crop',
  dinIso: 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?q=80&w=800&auto=format&fit=crop',
  warehouseProcurement: 'https://images.unsplash.com/photo-1553413077-190dd305871c?q=80&w=800&auto=format&fit=crop',
  mro: 'https://images.unsplash.com/photo-1565043666747-69f6646db940?q=80&w=800&auto=format&fit=crop',
  stainless: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?q=80&w=800&auto=format&fit=crop',
  boltSpecs: 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?q=80&w=800&auto=format&fit=crop',
  onlineProcurement: 'https://images.unsplash.com/photo-1553413077-190dd305871c?q=80&w=800&auto=format&fit=crop',
};

// Category buttons data
const categoryButtons = [
  'Hướng dẫn mua hàng',
  'Kiến thức kỹ thuật',
  'Tin tức ngành',
  'So sánh sản phẩm',
  'Kho vận & chuỗi cung ứng',
];

// Trending articles data
const trendingArticles = [
  {
    category: 'HƯỚNG DẪN MUA HÀNG',
    title: 'Cách chọn bu lông phù hợp cho môi trường công nghiệp',
    excerpt: 'Tìm hiểu cách lựa chọn bu lông theo vật liệu, cấp bền, tiêu chuẩn ren và điều kiện sử dụng.',
    image: IMAGES.boltGuide,
  },
  {
    category: 'KIẾN THỨC KỸ THUẬT',
    title: 'DIN và ISO khác nhau như thế nào?',
    excerpt: 'Giải thích sự khác nhau giữa các tiêu chuẩn phổ biến trong linh kiện và vật tư công nghiệp.',
    image: IMAGES.dinIso,
  },
];

// Featured article data
const featuredArticle = {
  title: 'Làm sao để doanh nghiệp giảm thời gian tìm kiếm vật tư?',
  excerpt: 'Mecsu giúp đội mua hàng và bảo trì tra cứu sản phẩm, báo giá và đặt hàng nhanh hơn trên một nền tảng duy nhất.',
  image: IMAGES.warehouseProcurement,
  category: 'Vận hành mua hàng',
  date: 'Cập nhật mới nhất',
};

// Latest articles for sidebar
const latestArticles = [
  { title: 'MRO là gì? Vai trò của MRO trong nhà máy sản xuất', category: 'Kiến thức kỹ thuật' },
  { title: 'Inox 304 và inox 316: nên chọn loại nào?', category: 'So sánh sản phẩm' },
  { title: 'Cách đọc thông số bu lông và đai ốc', category: 'Kiến thức kỹ thuật' },
  { title: 'Quy trình mua hàng công nghiệp online nên có những gì?', category: 'Hướng dẫn mua hàng' },
];

// Category sections data
const categorySections = [
  {
    title: 'Hướng dẫn mua hàng',
    articles: [
      { title: 'Cách chọn bu lông inox cho môi trường ẩm', category: 'Hướng dẫn mua hàng', image: IMAGES.boltGuide, date: '18/05/2026' },
      { title: 'Khi nào nên dùng vòng đệm phẳng và vòng đệm vênh?', category: 'Hướng dẫn mua hàng', image: IMAGES.dinIso, date: '16/05/2026' },
      { title: 'Cách chọn dụng cụ cầm tay cho đội bảo trì', category: 'Hướng dẫn mua hàng', image: IMAGES.mro, date: '14/05/2026' },
      { title: 'Checklist mua vật tư cho nhà máy sản xuất', category: 'Hướng dẫn mua hàng', image: IMAGES.warehouseProcurement, date: '12/05/2026' },
    ],
  },
  {
    title: 'Kiến thức kỹ thuật',
    articles: [
      { title: 'Cấp bền bu lông là gì?', category: 'Kiến thức kỹ thuật', image: IMAGES.boltSpecs, date: '17/05/2026' },
      { title: 'Ren hệ mét là gì?', category: 'Kiến thức kỹ thuật', image: IMAGES.dinIso, date: '15/05/2026' },
      { title: 'Tiêu chuẩn DIN, ISO, JIS khác nhau ra sao?', category: 'Kiến thức kỹ thuật', image: IMAGES.boltGuide, date: '13/05/2026' },
      { title: 'Vật liệu thép mạ kẽm và inox khác nhau thế nào?', category: 'Kiến thức kỹ thuật', image: IMAGES.stainless, date: '11/05/2026' },
    ],
  },
  {
    title: 'So sánh sản phẩm',
    articles: [
      { title: 'Inox 304 vs 316: loại nào phù hợp hơn?', category: 'So sánh sản phẩm', image: IMAGES.stainless, date: '17/05/2026' },
      { title: 'Bu lông lục giác ngoài và lục giác chìm khác nhau thế nào?', category: 'So sánh sản phẩm', image: IMAGES.boltGuide, date: '15/05/2026' },
      { title: 'SKF vs NTN: chọn vòng bi theo nhu cầu sử dụng', category: 'So sánh sản phẩm', image: IMAGES.mro, date: '13/05/2026' },
      { title: 'Dụng cụ Bosch và Stanley: nên chọn thương hiệu nào?', category: 'So sánh sản phẩm', image: IMAGES.onlineProcurement, date: '11/05/2026' },
    ],
  },
  {
    title: 'Kho vận & chuỗi cung ứng',
    articles: [
      { title: 'Tại sao tồn kho minh bạch quan trọng với doanh nghiệp sản xuất?', category: 'Kho vận', image: IMAGES.warehouseProcurement, date: '18/05/2026' },
      { title: 'ERP giúp xử lý đơn hàng công nghiệp nhanh hơn như thế nào?', category: 'Kho vận', image: IMAGES.onlineProcurement, date: '16/05/2026' },
      { title: 'Cách giảm lead time trong mua hàng vật tư', category: 'Kho vận', image: IMAGES.mro, date: '14/05/2026' },
      { title: 'Mua hàng online giúp đội bảo trì tiết kiệm thời gian ra sao?', category: 'Kho vận', image: IMAGES.boltSpecs, date: '12/05/2026' },
    ],
  },
];

// Popular topics
const popularTopics = [
  'Bu lông', 'Đai ốc', 'Inox 304', 'Inox 316', 'DIN', 'ISO',
  'MRO', 'OEM', 'ERP', 'Kho vận', 'Bảo trì công nghiệp', 'Vật tư nhà xưởng',
];

// ============================================
// SEARCH SECTION COMPONENT
// ============================================
function SearchSection() {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <section className="bg-white border-b border-slate-100">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-5">
        {/* Search Bar */}
        <div className="relative">
          <div
            className={`relative flex items-center transition-all duration-200 ${
              isFocused ? 'transform scale-[1.01]' : ''
            }`}
          >
            {/* Search Icon */}
            <Search
              size={20}
              className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors ${
                isFocused ? 'text-[#163F78]' : 'text-slate-400'
              }`}
            />
            
            {/* Input */}
            <input
              type="text"
              placeholder="Tìm kiếm hướng dẫn, tiêu chuẩn kỹ thuật hoặc bài viết công nghiệp..."
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className={`w-full pl-12 pr-4 py-3 text-[14px] bg-slate-50 rounded-xl border transition-all duration-200 placeholder-slate-400 outline-none ${
                isFocused
                  ? 'border-[#163F78] ring-3 ring-[#163F78]/10 shadow-lg'
                  : 'border-[#E5E7EB] hover:border-slate-300 hover:shadow-md'
              }`}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================
// CATEGORY BUTTON ROW COMPONENT
// ============================================
function CategoryButtonRow() {
  return (
    <section className="bg-slate-50 border-b border-slate-100">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {categoryButtons.map((btn) => (
            <button
              key={btn}
              className="px-5 py-2.5 text-[13px] font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:border-[#163F78] hover:text-[#163F78] hover:bg-white transition-all whitespace-nowrap shadow-sm"
            >
              {btn}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// SECTION HEADER COMPONENT
// ============================================
function SectionHeader({
  title,
  showViewAll = true,
}: {
  title: string;
  showViewAll?: boolean;
}) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-lg font-bold text-slate-900 tracking-tight">{title}</h2>
      {showViewAll && (
        <Link
          to="/resource-hub"
          className="text-[13px] font-semibold text-[#163F78] flex items-center gap-1 hover:gap-2 transition-all"
        >
          Xem thêm
          <ArrowRight size={14} />
        </Link>
      )}
    </div>
  );
}

// ============================================
// TRENDING CARD COMPONENT
// ============================================
function TrendingCard({
  category,
  title,
  excerpt,
  image,
}: {
  category: string;
  title: string;
  excerpt: string;
  image: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="group relative flex flex-col bg-white rounded-[14px] border border-[#E5E7EB] overflow-hidden hover:shadow-xl transition-all duration-250 ease-out"
    >
      {/* Yellow accent line at bottom - hidden by default */}
      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#FFC928] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out origin-left z-10" />
      
      {/* Image */}
      <div className="relative overflow-hidden rounded-t-[14px]">
        <img
          src={image}
          alt={title}
          className="w-full h-[200px] lg:h-[220px] object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      
      {/* Content - flex column */}
      <div className="flex flex-col flex-1 p-6 pb-5">
        {/* Category */}
        <span className="text-[11px] font-bold text-[#163F78] tracking-wider uppercase mb-2">
          {category}
        </span>
        
        {/* Title */}
        <h3 className="text-[18px] lg:text-[20px] font-bold text-slate-900 leading-tight mb-3 group-hover:text-[#163F78] transition-colors duration-200">
          {title}
        </h3>
        
        {/* Excerpt */}
        <p className="text-[14px] text-[#64748B] leading-relaxed mb-auto">
          {excerpt}
        </p>
        
        {/* Read more link */}
        <div className="flex items-center justify-between mt-4">
          <Link className="text-[14px] font-semibold text-[#163F78] flex items-center gap-1 group-hover:gap-2 transition-all">
            Đọc bài viết
            <ArrowRight size={14} className="text-[#FFC928]" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================
// ARTICLE CARD COMPONENT
// ============================================
function ArticleCard({
  title,
  category,
  image,
  date,
}: {
  title: string;
  category: string;
  image: string;
  date: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="group relative flex flex-col bg-white rounded-[14px] border border-[#E5E7EB] overflow-hidden hover:shadow-xl transition-all duration-250 ease-out"
    >
      {/* Yellow accent line at bottom - hidden by default */}
      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#FFC928] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out origin-left z-10" />
      
      {/* Image */}
      <div className="relative overflow-hidden rounded-t-[14px]">
        <img
          src={image}
          alt={title}
          className="w-full h-[180px] lg:h-[200px] object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      
      {/* Content - flex column to push date and category to bottom */}
      <div className="flex flex-col flex-1 p-6 pb-5">
        {/* Title */}
        <h4 className="text-[18px] lg:text-[20px] font-bold text-slate-900 leading-tight mb-auto group-hover:text-[#163F78] transition-colors duration-200">
          {title}
        </h4>
        
        {/* Arrow indicator - appears on hover */}
        <div className="flex items-center justify-between mt-4">
          <span className="text-[14px] text-[#475569]">{date}</span>
          <span className="text-[#163F78] opacity-0 group-hover:opacity-100 transform translate-x-[-4px] group-hover:translate-x-0 transition-all duration-200">
            <ArrowRight size={16} className="text-[#FFC928]" />
          </span>
        </div>
        
        {/* Category Badge */}
        <div className="mt-3">
          <span className="inline-block bg-[#F1F5F9] text-[#163F78] text-[13px] font-medium px-3 py-1.5 rounded-md">
            {category}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================
// LATEST ARTICLE ITEM COMPONENT
// ============================================
function LatestArticleItem({
  title,
  category,
  isLast = false,
}: {
  title: string;
  category: string;
  isLast?: boolean;
}) {
  return (
    <div className={`pb-4 mb-4 ${!isLast ? 'border-b border-slate-100' : ''}`}>
      <span className="text-[10px] font-semibold text-[#163F78] uppercase tracking-wider">
        {category}
      </span>
      <h4 className="text-[14px] font-semibold text-slate-800 mt-1 leading-snug hover:text-[#163F78] cursor-pointer transition-colors">
        {title}
      </h4>
    </div>
  );
}

// ============================================
// TOPIC CHIP COMPONENT
// ============================================
function TopicChip({ label }: { label: string }) {
  return (
    <span className="px-4 py-2 text-[13px] font-medium text-slate-600 bg-white border border-slate-300 rounded-full hover:border-[#163F78] hover:text-[#163F78] transition-all cursor-pointer">
      {label}
    </span>
  );
}

export default function ResourceHubPage() {
  const [email, setEmail] = useState('');

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      alert(`Cảm ơn bạn đã đăng ký với email: ${email}`);
      setEmail('');
    }
  };

  return (
    <main className="min-h-screen bg-slate-50">
      {/* ============================================
          1. HERO SECTION
      ============================================ */}
      <section className="bg-white border-b border-slate-100">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
          <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 items-center">
            {/* Left - Content Panel */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-2xl p-6 lg:p-8 border border-slate-200"
            >
              <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-3 tracking-tight leading-tight">
                Trung tâm tài nguyên Mecsu
              </h1>
              <p className="text-[14px] text-slate-600 leading-relaxed mb-6">
                Kiến thức mua hàng, hướng dẫn kỹ thuật và xu hướng công nghiệp giúp doanh nghiệp lựa chọn vật tư nhanh hơn, đúng hơn và hiệu quả hơn.
              </p>
              <button className="inline-flex items-center gap-2 px-6 py-3 bg-[#163F78] hover:bg-[#1a4a8a] text-white text-[14px] font-semibold rounded-lg transition-colors">
                <BookOpen size={18} />
                Khám phá bài viết
              </button>
            </motion.div>

            {/* Right - Hero Image */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="rounded-2xl overflow-hidden"
            >
              <img
                src={IMAGES.hero}
                alt="Industrial Warehouse"
                className="w-full h-[240px] lg:h-[300px] object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============================================
          2. SEARCH SECTION
      ============================================ */}
      <SearchSection />

      {/* ============================================
          3. CATEGORY BUTTON ROW
      ============================================ */}
      <CategoryButtonRow />

      {/* ============================================
          4. TRENDING GUIDES SECTION
      ============================================ */}
      <section className="py-8 lg:py-10">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader title="Bài viết nổi bật" />

          <div className="grid lg:grid-cols-2 gap-5">
            {trendingArticles.map((article, idx) => (
              <TrendingCard
                key={idx}
                category={article.category}
                title={article.title}
                excerpt={article.excerpt}
                image={article.image}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          5. MAIN FEATURED SECTION (Amazon News Style)
      ============================================ */}
      <section className="py-5 lg:py-6 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-5">
            {/* Left - Featured Article */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
             className="lg:col-span-2"
            >
              
              <div className="group relative rounded-[14px] overflow-hidden">
                <img
                  src={featuredArticle.image}
                  alt={featuredArticle.title}
                  className="w-full h-[260px] lg:h-[320px] object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                {/* Yellow accent line at bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#FFC928] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out origin-left" />
                <div className="absolute bottom-0 left-0 right-0 p-5 lg:p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-[10px] font-bold text-[#FFC928] bg-[#163F78] px-2.5 py-1 rounded-full uppercase tracking-wider">
                      {featuredArticle.category}
                    </span>
                    <span className="text-[11px] text-white/80">
                      {featuredArticle.date}
                    </span>
                  </div>
                  <h2 className="text-lg lg:text-xl font-bold text-white mb-2 leading-snug group-hover:text-[#FFC928] transition-colors">
                    {featuredArticle.title}
                  </h2>
                  <p className="text-[13px] text-white/80 leading-relaxed line-clamp-2">
                    {featuredArticle.excerpt}
                  </p>
                  <Link className="inline-flex items-center gap-2 mt-3 text-[13px] font-semibold text-[#FFC928] hover:gap-3 transition-all">
                    Đọc bài viết
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* Right - Latest List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
               className="border-l border-slate-200 pl-5"
            >
              <h3 className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-4">
                Tin mới nhất
              </h3>
              <div className="space-y-0">
                {latestArticles.map((article, idx) => (
                  <LatestArticleItem
                    key={idx}
                    title={article.title}
                    category={article.category}
                    isLast={idx === latestArticles.length - 1}
                  />
                ))}
              </div>
              <Link
                to="/resource-hub"
                className="inline-flex items-center gap-1 mt-4 text-[13px] font-semibold text-[#163F78] hover:gap-2 transition-all"
              >
                Xem tất cả bài viết
                <ArrowRight size={14} />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============================================
          5. SECTIONS BY CATEGORY
      ============================================ */}
      {categorySections.map((section, sectionIdx) => (
        <section
          key={sectionIdx}
          className={`py-8 lg:py-10 ${sectionIdx % 2 === 0 ? 'bg-slate-50' : 'bg-white'}`}
        >
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader title={section.title} />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {section.articles.map((article, idx) => (
                <ArticleCard
                  key={idx}
                  title={article.title}
                  category={article.category}
                  image={article.image}
                  date={article.date}
                />
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* ============================================
          6. POPULAR TOPICS SECTION
      ============================================ */}
      <section className="py-8 lg:py-10 bg-slate-50">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight mb-2">
              Chủ đề được quan tâm
            </h2>
            <p className="text-[14px] text-slate-500">
              Tìm kiếm nhanh các chủ đề phổ biến trong ngành công nghiệp
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {popularTopics.map((topic, idx) => (
              <TopicChip key={idx} label={topic} />
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          7. NEWSLETTER CTA SECTION
      ============================================ */}
      <section className="py-10 lg:py-12 bg-slate-100">
        <div className="max-w-[600px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[#163F78]/10 flex items-center justify-center">
              <BookOpen size={24} className="text-[#163F78]" />
            </div>
            <h2 className="text-xl lg:text-2xl font-bold text-slate-900 mb-2 tracking-tight">
              Nhận kiến thức công nghiệp mới từ Mecsu
            </h2>
            <p className="text-[13px] text-slate-600 mb-6 leading-relaxed">
              Cập nhật hướng dẫn chọn sản phẩm, tiêu chuẩn kỹ thuật và giải pháp mua hàng cho doanh nghiệp.
            </p>

            <form
              onSubmit={handleNewsletterSubmit}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Nhập email của bạn"
                required
                className="flex-1 px-4 py-3.5 text-[14px] bg-white border border-slate-300 rounded-lg placeholder-slate-400 focus:outline-none focus:border-[#163F78] focus:ring-1 focus:ring-[#163F78]/20 transition-all"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#163F78] hover:bg-[#1a4a8a] text-white text-[14px] font-semibold rounded-lg transition-colors"
              >
                <Send size={16} />
                Đăng ký
              </button>
            </form>

            <p className="text-[11px] text-slate-400 mt-3">
              Đăng ký miễn phí. Bạn có thể hủy bất kỳ lúc nào.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ============================================
          8. BOTTOM CTA SECTION
      ============================================ */}
      <section className="py-8 bg-white border-t border-slate-100">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">
                Sẵn sàng tìm kiếm sản phẩm?
              </h3>
              <p className="text-[14px] text-slate-500">
                Khám phá hơn 30,000 sản phẩm vật tư công nghiệp tại Mecsu
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                to="/"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#163F78] hover:bg-[#1a4a8a] text-white text-[14px] font-semibold rounded-lg transition-colors"
              >
                Tìm sản phẩm
              </Link>
              <Link
                to="/dich-vu-khach-hang"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-slate-50 text-[#163F78] text-[14px] font-semibold rounded-lg border border-slate-200 transition-colors"
              >
                Liên hệ tư vấn
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
