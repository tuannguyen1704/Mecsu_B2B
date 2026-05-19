import React from 'react';
import { Building2, Users, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

// Chuyển Counter ra thành component riêng nếu cần thêm, hoặc giữ đây.
function AnimatedCounter({ end, suffix = "", prefix = "" }: { end: number; suffix?: string; prefix?: string; }) {
  const [count, setCount] = React.useState(0);
  const ref = React.useRef<HTMLSpanElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          let startTimestamp: number;
          const duration = 2000;
          const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 4);
            setCount(Math.floor(ease * end));
            if (progress < 1) window.requestAnimationFrame(step);
          };
          window.requestAnimationFrame(step);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end]);

  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>;
}

export default function HeroSection({ searchQuery, setSearchQuery }: { searchQuery: string, setSearchQuery: (q: string) => void }) {
  return (
    <section className="relative min-h-screen py-12 px-6 lg:px-12 overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=2070&auto=format&fit=crop"
          alt="Construction Equipment & Progress"
          className="w-full h-full object-cover grayscale opacity-40 brightness-50"
        />
        <div className="absolute inset-0 bg-slate-950/80" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-primary/10 rounded-full blur-[120px] pointer-events-none" />
      </div>

      <div className="max-w-4xl mx-auto flex flex-col items-center text-center relative z-10 w-full">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full">
          <h1 className="text-4xl md:text-[56px] font-bold text-white mb-4 tracking-tight leading-tight drop-shadow-md">
            Find and buy industrial supplies faster
          </h1>
          <p className="text-lg md:text-xl text-slate-200 max-w-2xl mx-auto mb-8 leading-relaxed font-medium drop-shadow">
            Search millions of MRO products, upload BOMs or part images, and get matched with verified suppliers across Vietnam.
          </p>

          <div className="w-full max-w-3xl mx-auto">
            <div className="relative flex items-center bg-white border border-slate-300 rounded-lg overflow-hidden h-[60px] shadow-sm focus-within:ring-4 focus-within:ring-brand-primary/40 transition-all text-left">
              <div className="flex-1 flex items-center px-4 h-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="flex-1 bg-transparent border-none outline-none text-[15px] font-medium text-slate-800 placeholder:text-slate-500 placeholder:font-normal h-full w-full"
                />
              </div>
            </div>
          </div>

          <div className="mt-10 pt-8 border-t border-white/10 w-full max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 lg:gap-8">
            <StatItem icon={Building2} end={15000} label="Business Accounts" />
            <StatItem icon={Users} end={1000} label="Verified Supply Partners" />
            <StatItem icon={CheckCircle2} end={98} suffix="%" label="On-Time Deliveries" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function StatItem({ icon: Icon, end, suffix = "", label }: { icon: any, end: number, suffix?: string, label: string }) {
  return (
    <div className="flex items-start gap-4 sm:gap-5 w-[260px] mx-auto">
      <div className="w-12 h-12 mt-0.5 shrink-0 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-white">
        <Icon size={24} />
      </div>
      <div className="text-left flex-1">
        <div className="text-3xl font-bold text-white mb-1 tabular-nums w-full text-left leading-none inline-block">
          <AnimatedCounter end={end} suffix={suffix} />
        </div>
        <div className="text-[11px] font-bold text-slate-300 tracking-widest uppercase mt-1.5 leading-snug">
          {label}
        </div>
      </div>
    </div>
  );
}
