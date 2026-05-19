import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Clock, User, Share2, Bookmark, ChevronRight } from 'lucide-react';
import { Badge } from './ui/Badge';
import Button from './ui/Button';
import { BlogPost } from '../types';
import Markdown from 'react-markdown';
import BlogNavbar from './BlogNavbar';

interface BlogPostDetailPageProps {
  post: BlogPost;
  onBack: () => void;
}

export default function BlogPostDetailPage({ post, onBack }: BlogPostDetailPageProps) {
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-[#fcfcfc] min-h-screen text-slate-900 pb-32 font-sans">
      {/* Top Progress Bar */}
      <motion.div 
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        className="fixed top-0 left-0 right-0 h-1 bg-brand-primary z-[100] origin-left shadow-[0_0_10px_rgba(var(--brand-primary),0.5)]"
      />

      {/* Navigation Header */}
      <BlogNavbar onBackToBlog={onBack} isDetailPage />

      {/* Hero Header */}
      <header className="max-w-4xl mx-auto px-4 pt-20 pb-12">
        <div className="flex items-center gap-4 mb-8">
          <Badge variant="primary" className="bg-brand-primary/10 text-brand-secondary border-none px-4 py-1.5 font-black uppercase tracking-[0.2em] text-[10px]">
            {post.category}
          </Badge>
          <div className="w-1.5 h-1.5 bg-slate-200 rounded-full" />
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{post.date}</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-display font-bold text-slate-900 leading-[1.05] mb-10 tracking-tight">
          {post.title}
        </h1>

        <div className="flex flex-wrap items-center gap-8 pb-12 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-secondary text-brand-primary flex items-center justify-center font-black text-lg shadow-xl shadow-brand-secondary/10">
              {post.author.charAt(0)}
            </div>
            <div>
              <div className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-1">Kiến trúc sư nội dung</div>
              <div className="text-sm font-bold text-slate-900">{post.author}</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center">
              <Clock size={18} className="text-brand-primary" />
            </div>
            <div>
              <div className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-1">Thời lượng tối ưu</div>
              <div className="text-sm font-bold text-slate-900">{post.readTime}</div>
            </div>
          </div>
        </div>
      </header>

      {/* Featured Image */}
      <div className="max-w-5xl mx-auto px-4 mb-20">
        <div className="aspect-[21/9] rounded-[3rem] overflow-hidden shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] border-8 border-white">
          <img 
            src={post.image} 
            alt={post.title} 
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Article Content Layout */}
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-16">
        
        <main className="lg:col-span-8 lg:pr-12">
          {/* Intro Excerpt */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.6 }}
            className="bg-white border-l-4 border-brand-primary p-10 mb-16 rounded-r-[2.5rem] shadow-2xl shadow-brand-secondary/5"
          >
            <p className="text-xl md:text-2xl font-medium text-slate-700 leading-relaxed italic">
              "{post.excerpt}"
            </p>
          </motion.div>

          {/* Body content */}
          <motion.article 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="prose prose-slate prose-lg md:prose-xl max-w-none prose-headings:font-display prose-headings:font-bold prose-headings:tracking-tight prose-a:text-brand-primary prose-img:rounded-[2.5rem]"
          >
            <div className="text-slate-800 leading-[1.8] font-normal space-y-8">
              {post.content ? (
                <div className="markdown-body">
                  <Markdown
                    components={{
                      h2: ({node, ...props}) => <h2 className="text-3xl md:text-4xl font-bold text-slate-900 border-b border-slate-100 pb-5 mt-16 mb-8 flex items-center gap-4" {...props} />,
                      p: ({node, ...props}) => <p className="text-lg md:text-xl text-slate-600 leading-relaxed" {...props} />,
                      ul: ({node, ...props}) => <ul className="list-disc pl-8 space-y-4 text-slate-600 text-lg md:text-xl my-8" {...props} />,
                      li: ({node, ...props}) => <li className="pl-3" {...props} />,
                      strong: ({node, ...props}) => <strong className="font-bold text-brand-secondary" {...props} />,
                      a: ({node, ...props}) => <a className="text-brand-primary hover:text-brand-secondary font-bold underline underline-offset-8 decoration-2" target="_blank" rel="noopener noreferrer" {...props} />
                    }}
                  >
                    {post.content}
                  </Markdown>
                </div>
              ) : (
                <p className="text-slate-400 italic">Dữ liệu phân tích đang được tổng hợp...</p>
              )}
            </div>
          </motion.article>

          {/* Author Bio */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.6 }}
            className="mt-20 p-10 bg-brand-secondary rounded-[3rem] text-white flex flex-col sm:flex-row gap-8 items-center sm:items-start relative overflow-hidden"
          >
             <div className="absolute top-0 right-0 w-40 h-40 bg-brand-primary/10 blur-3xl rounded-full" />
             <div className="w-20 h-20 rounded-3xl bg-brand-primary text-brand-secondary flex items-center justify-center text-3xl font-black shrink-0 shadow-2xl shadow-brand-primary/20 z-10">
               {post.author.charAt(0)}
             </div>
             <div className="space-y-4 z-10 text-center sm:text-left">
                <div>
                   <h4 className="text-2xl font-display font-bold text-white">{post.author}</h4>
                   <p className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-primary mt-2">Strategic Content Director</p>
                </div>
                <p className="text-slate-400 leading-relaxed text-sm">
                   Kỹ sư vật liệu với hơn 15 năm kinh nghiệm trong ngành cơ khí chính xác. Đam mê chia sẻ những tiến bộ kỹ thuật giúp doanh nghiệp tối ưu hóa quy trình sản xuất và nâng cao chất lượng sản phẩm.
                </p>
             </div>
          </motion.div>
        </main>

        <aside className="lg:col-span-4 space-y-12">
          {/* Quick Actions Card */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.6 }}
            className="p-10 bg-white border border-slate-50 rounded-[3rem] shadow-2xl shadow-brand-secondary/5 sticky top-28"
          >
             <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-10 flex items-center gap-3">
                <Share2 size={14} className="text-brand-primary" /> Lan tỏa tri thức
             </h3>
             <div className="grid grid-cols-1 gap-4 mb-10">
                <button className="flex items-center gap-4 p-5 bg-slate-50 hover:bg-brand-primary/10 rounded-2xl transition-all group">
                   <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                      <Share2 size={16} className="text-slate-400 group-hover:text-brand-secondary" />
                   </div>
                   <span className="text-xs font-bold text-slate-600 group-hover:text-brand-secondary">Chia sẻ qua Facebook</span>
                </button>
                <button className="flex items-center gap-4 p-5 bg-slate-50 hover:bg-brand-secondary hover:text-white rounded-2xl transition-all group">
                   <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                      <Bookmark size={16} className="text-slate-400 group-hover:text-brand-secondary" />
                   </div>
                   <span className="text-xs font-bold text-slate-600 group-hover:text-white">Lưu vào bộ sưu tập</span>
                </button>
             </div>
             <Button variant="black" className="w-full bg-brand-secondary text-white h-14 rounded-2xl font-black uppercase tracking-widest text-[11px]" size="md">Nhận bản tin kỹ thuật</Button>
          </motion.div>

          {/* Related Articles in Sidebar */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-8"
          >
             <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 border-b border-slate-50 pb-4">Nội dung liên quan</h3>
             <div className="space-y-10">
                {/* Mock recent posts */}
                {[1, 2].map((i) => (
                  <div key={i} className="group cursor-pointer space-y-4">
                    <div className="aspect-video rounded-[2rem] overflow-hidden border border-slate-100 shadow-sm">
                       <img src={`https://images.unsplash.com/photo-${i === 1 ? '1540103395150-d2a21e42cca0' : '1504917595217-d4dc5f649776'}?w=400&q=80`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="recent" />
                    </div>
                    <div className="space-y-2">
                       <div className="text-[9px] font-black text-brand-primary uppercase tracking-widest">Kỹ thuật vật liệu</div>
                       <h4 className="text-base font-bold text-slate-900 leading-snug group-hover:text-brand-secondary transition-colors line-clamp-2">
                          {i === 1 ? 'Sự trỗi dậy của Inox Duplex trong hạ tầng công nghiệp' : 'Tối ưu hóa hành trình gia công CNC thế hệ mới'}
                       </h4>
                    </div>
                  </div>
                ))}
             </div>
          </motion.div>
        </aside>

      </div>
    </div>
  );
}
