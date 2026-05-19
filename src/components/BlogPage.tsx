import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'motion/react';
import { BookOpen, Clock, User, ChevronRight, Share2, MessageSquare, Search, ArrowUpRight, Sparkles, ArrowRight } from 'lucide-react';
import { Badge } from './ui/Badge';
import Button from './ui/Button';
import { BLOG_POSTS } from '../constants';
import { BlogPost } from '../types';
import BlogNavbar from './BlogNavbar';

const innovationPosts = [
  {
    id: 'inv-1',
    title: "Khám phá cách AI giúp các nhà máy tiết kiệm 30% thời gian kiểm kho",
    date: "28/04/2026",
    category: "Công nghệ",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=60"
  },
  {
    id: 'inv-2',
    title: "Mecsu ra mắt trợ lý ảo kỹ thuật tư vấn chọn bulong chuẩn xác",
    date: "29/04/2026",
    category: "Sản phẩm mới",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=60"
  },
  {
    id: 'inv-3',
    title: "Tương lai của gia công chính xác với sự hỗ trợ từ trí tuệ nhân tạo (AI)",
    date: "28/04/2026",
    category: "Công nghệ",
    image: "https://images.unsplash.com/photo-1565514020179-026b92b6d196?w=800&auto=format&fit=crop&q=60"
  },
  {
    id: 'inv-4',
    title: "Tối ưu hóa chuỗi cung ứng cơ khí bằng thuật toán Machine Learning",
    date: "29/04/2026",
    category: "Giải pháp",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=60"
  }
];

const shoppingPosts = [
  {
    id: 'shp-1',
    title: "Gói tiết kiệm Mecsu Plus: Giảm ngay 5% cho doanh nghiệp sản xuất",
    date: "14/04/2026",
    category: "Khuyến mãi",
    image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&auto=format&fit=crop&q=60"
  },
  {
    id: 'shp-2',
    title: "Cách khách hàng B2B chuyển đổi các khoản chi tiêu vật tư thành hoàn tiền",
    date: "19/03/2026",
    category: "Bán lẻ",
    image: "https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?w=800&auto=format&fit=crop&q=60"
  },
  {
    id: 'shp-3',
    title: "Báo cáo quý 1: Doanh nghiệp tối ưu chi phí hiệu quả nhờ Mecsu PRO",
    date: "29/04/2026",
    category: "Tin công ty",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=60"
  },
  {
    id: 'shp-4',
    title: "Top 20 sản phẩm dụng cụ điện cầm tay giảm mạnh nhất mùa hè này",
    date: "27/04/2026",
    category: "Bán lẻ",
    image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800&auto=format&fit=crop&q=60"
  }
];

const lifePosts = [
  {
    id: 'lf-1',
    title: "Tham quan Trung tâm Phân phối Vật tư Cơ khí thông minh của Mecsu",
    date: "26/03/2026",
    category: "Vận hành",
    image: "https://images.unsplash.com/photo-1586528116311-ad8ed7c159bf?w=800&auto=format&fit=crop&q=60"
  },
  {
    id: 'lf-2',
    title: "Đội ngũ Mecsu chung tay hỗ trợ trang thiết bị cho các trường dạy nghề",
    date: "01/05/2026",
    category: "Cộng đồng",
    image: "https://images.unsplash.com/photo-1531206715517-5c561081788a?w=800&auto=format&fit=crop&q=60"
  },
  {
    id: 'lf-3',
    title: "CEO Mecsu chia sẻ: \"Tốc độ không bằng sự chính xác trong kỹ thuật\"",
    date: "30/04/2026",
    category: "Nhân vật",
    image: "https://images.unsplash.com/photo-1573164713988-8665fc963095?w=800&auto=format&fit=crop&q=60"
  },
  {
    id: 'lf-4',
    title: "9 bài học quý giá sau 10 năm gắn bó với ngành phân phối vật tư",
    date: "10/04/2026",
    category: "Góc nhìn",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=60"
  }
];

const featuredStories = [
  {
    id: 'fs-1',
    title: "Bên trong quy trình kiểm định chất lượng siêu tốc từ nhà sản xuất",
    date: "18/02/2026",
    category: "Chất lượng",
    image: "https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?w=800&auto=format&fit=crop&q=60"
  },
  {
    id: 'fs-2',
    title: "Giải pháp từ Mecsu giúp nhà máy lắp ráp tăng tốc độ sản xuất lên 150%",
    date: "25/11/2025",
    category: "Giải pháp",
    image: "https://images.unsplash.com/photo-1565439390118-c215d2a6a623?w=800&auto=format&fit=crop&q=60"
  },
  {
    id: 'fs-3',
    title: "Tự động hóa trạm giao hàng: Đưa vật tư đến công trường vào mọi thời điểm",
    date: "09/10/2025",
    category: "Vận hành",
    image: "https://images.unsplash.com/photo-1588508065123-287b28e013da?w=800&auto=format&fit=crop&q=60"
  },
  {
    id: 'fs-4',
    title: "Mảnh ghép quan trọng: Khám phá thế giới của những chiếc ốc vít vi cơ khí",
    date: "03/09/2025",
    category: "Kiến thức",
    image: "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=800&auto=format&fit=crop&q=60"
  }
];

const QuickUpdateItem = React.memo(({ post, onClick }: { post: any; onClick: (p: any) => void }) => (
  <motion.div 
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.1 }}
    transition={{ duration: 0.4 }}
    onClick={() => onClick(post)} 
    className="cursor-pointer group border-b border-slate-100 hover:border-brand-primary pb-6 last:border-b last:border-transparent last:hover:border-brand-primary last:pb-6 transition-all duration-300"
  >
    <h3 className="text-[14px] font-bold text-slate-800 group-hover:text-brand-secondary transition-all duration-300 leading-[1.5] mb-2 tracking-tight">
      {post.title}
    </h3>
    <div className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">{post.date}</div>
  </motion.div>
));

const TrendingItem = React.memo(({ post, onClick }: { post: any; onClick: (p: any) => void }) => (
  <motion.div 
    initial={{ opacity: 0, x: 20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true, amount: 0.1 }}
    transition={{ duration: 0.4 }}
    onClick={() => onClick(post)}
    className="group cursor-pointer flex gap-4 items-center border-b border-transparent hover:border-slate-100 pb-4 transition-all duration-300"
  >
    <div className="w-20 h-14 shrink-0 rounded-xl overflow-hidden bg-white border border-slate-100 shadow-sm relative">
        <img src={post.image} alt={post.title} loading="lazy" decoding="async" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
        <div className="absolute inset-0 bg-brand-secondary/5 group-hover:opacity-0 transition-opacity" />
    </div>
    <div className="flex-1">
      <h4 className="text-[12px] font-bold text-slate-700 leading-snug group-hover:text-brand-secondary transition-colors line-clamp-2">
        {post.title}
      </h4>
    </div>
  </motion.div>
));

const CardPostItem = React.memo(({ post, onClick }: { post: any; onClick: (p: any) => void }) => (
  <motion.div 
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.1 }}
    transition={{ duration: 0.5 }}
    onClick={() => onClick(post)}
    className="cursor-pointer group flex flex-col h-full bg-white rounded-[2rem] border border-slate-100 hover:border-brand-primary/20 hover:shadow-2xl hover:shadow-brand-secondary/5 transition-all duration-500 overflow-hidden"
  >
    <div className="bg-white border border-slate-50 aspect-[1.3] relative overflow-hidden shrink-0">
      <img 
        src={post.image} 
        alt={post.title} 
        loading="lazy" 
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
      />
      <div className="absolute top-4 left-4">
        <div className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[9px] font-black uppercase tracking-widest text-brand-secondary shadow-sm">
          {post.category}
        </div>
      </div>
    </div>
    
    <div className="flex-1 p-6 flex flex-col">
      <h3 className="text-lg font-bold text-slate-900 mb-5 group-hover:text-brand-secondary leading-[1.3] flex-1 line-clamp-3">
        {post.title}
      </h3>
      
      <div className="mt-auto flex items-center justify-between">
        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{post.date}</div>
        <div className="w-8 h-8 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-300 group-hover:bg-brand-primary group-hover:text-brand-secondary transition-all">
          <ArrowUpRight size={14} />
        </div>
      </div>
    </div>
  </motion.div>
));

const HorizontalPostItem = React.memo(({ post, onClick }: { post: any; onClick: (p: any) => void }) => (
  <motion.div 
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.1 }}
    transition={{ duration: 0.5 }}
    onClick={() => onClick(post)}
    className="flex flex-col sm:flex-row gap-8 bg-white overflow-hidden hover:shadow-2xl hover:shadow-brand-secondary/5 cursor-pointer group transition-all duration-500 rounded-[2.5rem] p-6 border border-slate-50"
  >
    <div className="w-full sm:w-72 h-52 shrink-0 rounded-[2rem] overflow-hidden bg-white border border-slate-100 relative">
      <img 
        src={post.image} 
        alt={post.title} 
        loading="lazy" 
        decoding="async"
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
      />
      <div className="absolute inset-0 bg-brand-secondary/5 group-hover:opacity-0 transition-opacity" />
    </div>
    <div className="flex-1 flex flex-col justify-center py-2">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-[10px] font-black text-brand-primary uppercase tracking-[0.3em]">{post.category}</span>
        <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{post.date}</span>
      </div>
      <h2 className="text-2xl font-display font-bold text-slate-900 mb-4 group-hover:text-brand-secondary transition-colors leading-tight">
        {post.title}
      </h2>
      <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed mb-6">
        {post.excerpt}
      </p>
      <div className="mt-auto flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-brand-secondary transition-colors">
        Tiếp tục đọc <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  </motion.div>
));

const SectionGrid = React.memo(({ title, linkText, posts, onPostClick }: any) => {
  return (
    <div className="mb-24">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between mb-12 border-b border-slate-100 pb-6"
      >
        <div className="flex items-center gap-4">
           <div className="w-1.5 h-8 bg-brand-primary rounded-full shadow-[0_0_12px_rgba(var(--brand-primary),0.4)]" />
           <h2 className="text-3xl font-display font-bold text-slate-900 tracking-tight">{title}</h2>
        </div>
        <button className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-brand-secondary transition-all group">
          {linkText} <ArrowRight size={16} className="text-brand-primary group-hover:translate-x-1 transition-transform" />
        </button>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {posts.map((post: any) => (
          <CardPostItem key={post.id} post={post} onClick={onPostClick} />
        ))}
      </div>
    </div>
  );
});

const MainFeaturedPost = React.memo(({ post, selectedCategory, onClick }: { post: any; selectedCategory: string; onClick: (p: any) => void }) => (
  <motion.article 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    onClick={() => onClick(post)}
    className="cursor-pointer group flex flex-col h-full bg-white rounded-[2.5rem] border border-slate-50 hover:border-brand-primary/10 hover:shadow-2xl hover:shadow-brand-secondary/5 transition-all duration-700 relative overflow-hidden"
  >
    <div className="bg-white border border-slate-50 relative min-h-[300px] sm:min-h-[440px] overflow-hidden shrink-0">
      <img 
        src={selectedCategory === 'Tất cả' ? "/assets/new.png" : (post.image || "/assets/new.png")} 
        alt={post.title} 
        loading="eager"
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
        onError={(e) => {
          (e.target as HTMLImageElement).src = "/assets/new.png";
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      <div className="absolute top-8 left-8">
        <Badge variant="primary" className="bg-white/90 backdrop-blur-md text-brand-secondary border-none px-5 py-2 font-black uppercase tracking-widest text-[10px] shadow-sm">
           NỔI BẬT
        </Badge>
      </div>
    </div>
    <div className="p-10 pb-12">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-[10px] font-black text-brand-primary uppercase tracking-[0.4em]">Tiêu điểm tuần</span>
        <div className="w-1.5 h-1.5 bg-slate-200 rounded-full" />
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{post.date}</span>
      </div>
      <h1 className="text-[32px] sm:text-[36px] font-display font-bold text-slate-900 group-hover:text-brand-secondary mb-6 transition-all duration-300 leading-[1.1] tracking-tight">
        {selectedCategory === 'Tất cả' ? 'Dịch vụ phân phối vật tư kỹ thuật siêu tốc 2H tại hạ tầng TP.HCM' : post.title}
      </h1>
      <p className="text-slate-500 text-base leading-[1.6] line-clamp-3">
        {selectedCategory === 'Tất cả' ? 'Mecsu tiếp tục khẳng định vị thế dẫn đầu trong chuỗi cung ứng vật tư phụ trợ khi chính thức vận hành trạm phân phối thông minh đầu tiên, đáp ứng nhu cầu khẩn cấp cho các công trường và nhà máy sản xuất.' : post.excerpt}
      </p>
    </div>
  </motion.article>
));

interface BlogPageProps {
  onBackToHome: () => void;
  onPostClick: (post: BlogPost) => void;
}

const BANNERS = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1600&auto=format&fit=crop&q=80",
    badge: "🎉 Cập nhật tin tức và công nghệ mới nhất",
    title: {
      text: "Khám phá thế giới",
      highlight1: "kỹ thuật",
      and: "và",
      highlight2: "công nghiệp",
      color1: "from-orange-400 to-orange-600",
      color2: "from-blue-400 to-blue-600"
    },
    description: "Nguồn thông tin uy tín về vật liệu học, cơ khí chính xác, công nghệ mới và các giải pháp tối ưu vận hành từ các chuyên gia hàng đầu."
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?w=1600&auto=format&fit=crop&q=80",
    badge: "🚀 Chuyên đề đặc biệt",
    title: {
      text: "Tối ưu hóa hệ thống",
      highlight1: "tự động hóa",
      and: "trong",
      highlight2: "nhà máy",
      color1: "from-green-400 to-green-600",
      color2: "from-emerald-400 to-emerald-600"
    },
    description: "Ngành công nghiệp tự động hóa đang chuyển mình. Cập nhật ngay các bài viết phân tích sâu từ các kỹ sư đầu ngành."
  },
  {
    id: 3,
    image: "https://plus.unsplash.com/premium_photo-1664303886548-5256eafca6d3?w=1600&auto=format&fit=crop&q=80",
    badge: "🔍 Kiến thức chuyên môn",
    title: {
      text: "Vật liệu kỹ thuật",
      highlight1: "tiên tiến",
      and: "và",
      highlight2: "ứng dụng",
      color1: "from-purple-400 to-purple-600",
      color2: "from-pink-400 to-pink-600"
    },
    description: "Hiểu rõ về các loại vật liệu mới, độ bền dai, khả năng chống ăn mòn và cách chọn vật liệu đúng cho thiết kế của bạn."
  }
];

const BannerSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % BANNERS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-brand-secondary text-white relative overflow-hidden h-[500px] lg:h-[640px]">
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <motion.div 
            className="absolute inset-0 z-0 opacity-40 mix-blend-overlay"
            initial={{ scale: 1 }}
            animate={{ scale: 1.05 }}
            transition={{ duration: 6, ease: "linear" }}
          >
             <img 
                src={BANNERS[currentIndex].image} 
                alt="Banner Background" 
                className="w-full h-full object-cover"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-brand-secondary via-brand-secondary/60 to-transparent" />
             <div className="absolute inset-0 bg-gradient-to-r from-brand-secondary via-brand-secondary/80 to-transparent" />
          </motion.div>
          
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-primary/10 blur-[120px] rounded-full translate-x-1/3 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-slate-500/10 blur-[120px] rounded-full -translate-x-1/3 translate-y-1/2" />
          
          <div className="absolute inset-0 flex items-center">
            <div className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10 w-full pt-12 pb-20 flex flex-col items-start text-left">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="inline-block px-5 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8 text-[10px] font-black tracking-[0.3em] uppercase shadow-lg"
              >
                {BANNERS[currentIndex].badge}
              </motion.div>
              <motion.h1 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ duration: 0.6, delay: 0.4 }}
                 className="text-5xl md:text-6xl lg:text-8xl font-display font-bold mb-8 leading-[1] tracking-tight max-w-4xl"
              >
                {BANNERS[currentIndex].title.text}{' '}
                <span className={`text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-white`}>{BANNERS[currentIndex].title.highlight1}</span>{' '}
                {BANNERS[currentIndex].title.and}{' '}
                <span className={`text-transparent bg-clip-text bg-gradient-to-r from-white to-brand-primary`}>{BANNERS[currentIndex].title.highlight2}</span>
              </motion.h1>
              <motion.p 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ duration: 0.6, delay: 0.6 }}
                 className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-2xl font-medium"
              >
                {BANNERS[currentIndex].description}
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="mt-10 flex gap-4"
              >
                <Button variant="primary" size="lg" className="bg-brand-primary text-brand-secondary border-brand-primary hover:bg-white hover:border-white transition-all duration-500 px-12 shadow-2xl shadow-brand-primary/20 rounded-2xl font-black uppercase tracking-widest">
                   Khám phá nội dung
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-12 left-0 right-0 z-30 max-w-7xl mx-auto px-4 lg:px-8 flex gap-4">
        {BANNERS.map((_, idx) => (
          <button 
             key={idx} 
             onClick={() => setCurrentIndex(idx)}
             className={`h-1 rounded-full transition-all duration-500 overflow-hidden relative ${idx === currentIndex ? 'w-24 bg-white/20' : 'w-6 bg-white/30 hover:bg-white/50'}`}
          >
             {idx === currentIndex && (
                <motion.div 
                   className="absolute top-0 left-0 bottom-0 bg-brand-primary"
                   initial={{ width: "0%" }}
                   animate={{ width: "100%" }}
                   transition={{ duration: 6, ease: "linear" }}
                />
             )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default function BlogPage({ onBackToHome, onPostClick }: BlogPageProps) {
  const [selectedCategory, setSelectedCategory] = React.useState('Tất cả');
  const categories = ['Tất cả', 'Vật liệu học', 'Cơ khí chính xác', 'Công nghệ mới', 'Vận hành & Bảo trì'];

  const filteredPosts = React.useMemo(() => 
    selectedCategory === 'Tất cả' 
      ? BLOG_POSTS 
      : BLOG_POSTS.filter(p => p.category === selectedCategory),
  [selectedCategory]);

  const featuredPost = filteredPosts[0];
  const otherPosts = filteredPosts.slice(1);
  const latestPosts = React.useMemo(() => [...BLOG_POSTS].sort((a, b) => b.id.localeCompare(a.id)).slice(0, 5), []);

  return (
    <div className="bg-white min-h-screen text-slate-900 font-sans">
      {/* Top Bar Navigation */}
      <BlogNavbar onBackToHome={onBackToHome} />

      {/* Hero Banner Slider */}
      <BannerSlider />

      <div className="max-w-7xl mx-auto px-4 py-12 -mt-10 relative z-20">
        
        {/* Amazon News Style Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-x-10 gap-y-12 mb-16">
          {/* Left Column: Quick Updates */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {otherPosts.slice(0, 4).map((post) => (
                <QuickUpdateItem key={post.id} post={post} onClick={onPostClick} />
              ))}
            </div>
          </div>

          {/* Center Column: Featured Main */}
          <div className="lg:col-span-2">
            {featuredPost && (
              <MainFeaturedPost post={featuredPost} onClick={onPostClick} selectedCategory={selectedCategory} />
            )}
          </div>

          {/* Right Column: Trending Now */}
          <div className="lg:col-span-1">
            <h3 className="text-[17px] font-bold text-slate-900 mb-3">Thịnh hành</h3>
            <div className="h-[2px] w-full bg-[#f2651d] mb-6" />
            <div className="flex flex-col gap-4">
              {latestPosts.map((post) => (
                <TrendingItem key={post.id} post={post} onClick={onPostClick} />
              ))}
              <div className="pt-2 text-right">
                <button className="text-[15px] font-medium text-slate-900 hover:text-[#f2651d] flex items-center justify-end gap-1 w-full transition-colors group">
                  Xem tất cả tin tức <ArrowRight size={18} className="text-[#f2651d] group-hover:translate-x-1 transition-transform ml-1" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area: Older Posts */}
        <div className="mb-20">
           <SectionGrid title="Đổi mới & AI" linkText="Xem thêm Cập nhật" posts={innovationPosts} onPostClick={onPostClick} />
           <SectionGrid title="Danh mục & Tiện ích doanh nghiệp" linkText="Xem thêm Giải pháp B2B" posts={shoppingPosts} onPostClick={onPostClick} />
           <SectionGrid title="Cuộc sống tại Mecsu" linkText="Khám phá Thêm" posts={lifePosts} onPostClick={onPostClick} />
           <SectionGrid title="Câu chuyện nổi bật" linkText="Xem thêm Tin tức" posts={featuredStories} onPostClick={onPostClick} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Post Feed */}
          <div className="lg:col-span-8 space-y-8">
            <div className="space-y-6">
              <h3 className="text-xl font-extrabold text-slate-900 border-b pb-4 flex items-center gap-2">
                 Bài viết đáng chú ý
              </h3>
              
              <div className="space-y-8">
                {otherPosts.slice(4).map((post) => (
                  <HorizontalPostItem key={post.id} post={post} onClick={onPostClick} />
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Sidebar */}
          <aside className="lg:col-span-4 space-y-12">
            {/* Newsletter Sidebar */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.6 }}
              className="bg-brand-secondary rounded-[2.5rem] p-10 text-white relative overflow-hidden"
            >
               <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/20 blur-3xl opacity-50" />
               <h3 className="text-3xl font-display font-bold leading-tight mb-4 relative z-10">Bản tin kỹ thuật chuyên sâu</h3>
               <p className="text-sm text-slate-400 mb-8 relative z-10 leading-relaxed">Nhận báo cáo thị trường và cập nhật công nghệ vật liệu định kỳ hàng tuần trực tiếp vào hòm thư.</p>
               <input 
                  type="email" 
                  placeholder="name@company.com" 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm mb-4 outline-none focus:border-brand-primary focus:bg-white/10 transition-all text-white placeholder:text-slate-500 font-bold"
               />
               <Button variant="primary" className="w-full bg-brand-primary hover:bg-white text-brand-secondary border-none h-14 rounded-2xl font-black uppercase tracking-widest text-[11px]" size="md">
                  Đăng ký ngay
               </Button>
            </motion.div>

            {/* Fixed Categories list */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white rounded-[2.5rem] p-8 shadow-2xl shadow-brand-secondary/5 border border-slate-50"
            >
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-8 pb-4 border-b border-slate-50">Phân loại dữ liệu</h3>
              <div className="flex flex-col gap-3">
                {categories.filter(c => c !== 'Tất cả').map(c => (
                  <button 
                    key={c}
                    onClick={() => setSelectedCategory(c)}
                    className="flex items-center justify-between px-6 py-4 bg-slate-50 hover:bg-brand-primary/10 hover:text-brand-secondary rounded-2xl text-[13px] font-bold text-slate-700 transition-all group"
                  >
                    {c}
                    <ChevronRight size={14} className="text-slate-300 group-hover:text-brand-primary group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
              </div>
            </motion.div>
          </aside>
        </div>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
