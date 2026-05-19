import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Package,
  Factory,
  Users,
  Clock,
  Zap,
  Target,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
  MapPin,
  Phone,
  Mail,
  Building2,
  Truck,
  Shield,
  Wrench,
  Cog,
  Bot,
  Star,
  Quote,
  PhoneCall,
  MessageCircle,
  Send,
} from 'lucide-react';
import { Breadcrumb } from './common/Breadcrumb';

// Animated Counter Component
function AnimatedCounter({
  end,
  suffix = '',
  prefix = '',
}: {
  end: number;
  suffix?: string;
  prefix?: string;
}) {
  const [count, setCount] = useState(0);
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
            if (progress < 1) {
              window.requestAnimationFrame(step);
            }
          };
          window.requestAnimationFrame(step);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [end]);

  return (
    <span ref={ref}>
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

// Glassmorphism floating card
function FloatingStatCard({ value, label }: { value: string; label: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white/15 backdrop-blur-md border border-white/20 rounded-xl px-5 py-4 text-white"
    >
      <div className="text-2xl font-bold mb-1">{value}</div>
      <div className="text-sm text-white/80">{label}</div>
    </motion.div>
  );
}

// Testimonial Card
function TestimonialCard({
  name,
  company,
  role,
  content,
  rating,
}: {
  name: string;
  company: string;
  role: string;
  content: string;
  rating: number;
}) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md border border-slate-100"
    >
      <div className="flex gap-1 mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={16}
            className={i < rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}
          />
        ))}
      </div>
      <Quote size={24} className="text-brand-secondary/20 mb-3" />
      <p className="text-slate-600 text-[14px] leading-relaxed mb-5">{content}</p>
      <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold text-sm">
          {name.charAt(0)}
        </div>
        <div>
          <div className="font-semibold text-slate-800 text-[13px]">{name}</div>
          <div className="text-slate-500 text-[11px]">
            {role} - {company}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Partner Logo Placeholder
function PartnerLogo({ name }: { name: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-slate-100 rounded-lg px-6 py-4 flex items-center justify-center h-16 grayscale hover:grayscale-0 transition-all duration-300"
    >
      <span className="text-slate-400 font-semibold text-sm hover:text-slate-700">{name}</span>
    </motion.div>
  );
}

// Industry Card
function IndustryCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white rounded-xl p-5 border border-slate-100 hover:border-brand-secondary/30 hover:shadow-md transition-all duration-200 group"
    >
      <div className="w-12 h-12 rounded-lg bg-slate-100 group-hover:bg-brand-secondary/10 flex items-center justify-center mb-4 transition-colors">
        <Icon size={24} className="text-slate-600 group-hover:text-brand-secondary transition-colors" />
      </div>
      <h3 className="font-bold text-slate-800 mb-2">{title}</h3>
      <p className="text-slate-500 text-[13px] leading-relaxed">{description}</p>
    </motion.div>
  );
}

export default function AboutUsPage() {
  const timelineData = [
    { year: '2014', title: 'Thành lập Mecsu', desc: 'Khởi đầu từ một cửa hàng vật tư công nghiệp nhỏ tại TP.HCM' },
    { year: '2016', title: 'Văn phòng đầu tiên', desc: 'Mở rộng văn phòng và kho hàng tại Quận 7' },
    { year: '2019', title: 'ERP & Online Ordering', desc: 'Triển khai hệ thống quản lý kho ERP' },
    { year: '2020', title: 'Nền tảng Ecommerce', desc: 'Ra mắt website Mecsu.vn - đặt hàng online 24/7' },
    { year: '2023', title: '30,000+ SKU', desc: 'Đạt 30,000 mã sản phẩm và 300+ đối tác thương hiệu' },
  ];

  const coreValues = [
    { icon: Zap, title: 'NHANH', desc: 'Xử lý đơn hàng và giao hàng trong thời gian nhanh nhất, đáp ứng nhu cầu sản xuất liên tục' },
    { icon: Target, title: 'ĐÚNG', desc: 'Đúng sản phẩm, đúng số lượng, đúng thông số kỹ thuật - không có sai sót' },
    { icon: CheckCircle2, title: 'ĐỦ', desc: 'Đảm bảo cung ứng đầy đủ cho mọi đơn hàng từ linh kiện nhỏ đến thiết bị lớn' },
    { icon: Clock, title: 'KỊP THỜI', desc: 'Giao hàng đúng thời hạn cam kết, hỗ trợ tiến độ dự án của doanh nghiệp' },
  ];

  const industries = [
    { icon: Factory, title: 'Nhà máy sản xuất', desc: 'Cung cấp vật tư cho các nhà máy sản xuất lớn trên toàn quốc' },
    { icon: Cog, title: 'OEM & ODM', desc: 'Hỗ trợ các doanh nghiệp OEM/ODM với giải pháp mua hàng linh hoạt' },
    { icon: Wrench, title: 'MRO', desc: 'Quản lý bảo trì, sửa chữa và vận hành thiết bị công nghiệp' },
    { icon: Bot, title: 'Tự động hóa', desc: 'Cung cấp linh kiện và thiết bị cho ngành tự động hóa' },
    { icon: Shield, title: 'Bảo trì công nghiệp', desc: 'Giải pháp bảo trì toàn diện cho các hệ thống máy móc' },
    { icon: Building2, title: 'Doanh nghiệp kỹ thuật', desc: 'Đối tác tin cậy của các công ty kỹ thuật hàng đầu' },
  ];

  const testimonials = [
    {
      name: 'Nguyễn Văn Minh',
      company: 'Công ty TNHH Sản xuất ABC',
      role: 'Giám đốc kỹ thuật',
      content:
        'Mecsu giúp đội kỹ thuật của chúng tôi giảm đáng kể thời gian tìm kiếm vật tư. Đặc biệt dịch vụ tư vấn kỹ thuật rất chuyên nghiệp.',
      rating: 5,
    },
    {
      name: 'Trần Thị Lan',
      company: 'Nhà máy XYZ',
      role: 'Trưởng phòng MRO',
      content:
        'Hệ thống đặt hàng online của Mecsu rất dễ sử dụng. Giao hàng nhanh và đúng sản phẩm như yêu cầu. Đã hợp tác được 3 năm.',
      rating: 5,
    },
    {
      name: 'Lê Hoàng Nam',
      company: 'Công ty CP Cơ khí Việt',
      role: 'Quản lý mua hàng',
      content:
        'Danh mục sản phẩm đa dạng, giá cả cạnh tranh. Đội ngũ tư vấn nhiệt tình giúp chúng tôi chọn đúng sản phẩm cho từng ứng dụng.',
      rating: 4,
    },
  ];

  const partners = [
    'Bosch',
    'Stanley',
    'SKF',
    '3M',
    'Makita',
    'Dewalt',
    'HiKOKI',
    'Kito',
  ];

  const whyMecsuStory = [
    {
      title: 'Thực trạng ngành công nghiệp',
      content:
        'Doanh nghiệp sản xuất Việt Nam đối mặt với thách thức trong việc tìm kiếm và mua vật tư công nghiệp từ nhiều nguồn khác nhau, tốn thời gian và chi phí.',
    },
    {
      title: 'Hệ thống phân mảnh',
      content:
        'Các nhà cung cấp phân tán, thông tin không đồng nhất, quy trình báo giá chậm chạp ảnh hưởng đến hiệu suất sản xuất.',
    },
    {
      title: 'Giải pháp số hóa',
      content:
        'Mecsu được xây dựng để đơn giản hóa việc mua hàng công nghiệp - từ tìm kiếm sản phẩm, so sánh giá đến đặt hàng và theo dõi giao hàng.',
    },
  ];

  return (
    <main className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-5">
        <Breadcrumb items={[{ label: 'Trang chủ', href: '/' }, { label: 'Giới thiệu Mecsu' }]} />
      </div>

      {/* ============================================
          1. HERO SECTION
      ============================================ */}
      <section className="relative min-h-[65vh] lg:min-h-[75vh] overflow-hidden flex items-center">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070&auto=format&fit=crop"
            alt="Industrial Warehouse"
            className="w-full h-full object-cover brightness-50"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#163F78]/95 to-[#1a4a8a]/85" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 w-full">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-12 lg:gap-16">
            {/* Left Content */}
            <div className="flex-1 max-w-2xl">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-3xl md:text-[42px] lg:text-[48px] font-bold text-white mb-5 tracking-tight leading-tight"
              >
                Nền tảng vật tư công nghiệp dành cho doanh nghiệp sản xuất
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-base md:text-lg text-white/90 mb-8 leading-relaxed"
              >
                Từ linh kiện lắp ráp, vật tư nhà xưởng đến thiết bị công nghiệp — Mecsu
                giúp doanh nghiệp tìm kiếm và mua hàng nhanh chóng, minh bạch và đáng
                tin cậy.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex flex-col sm:flex-row gap-3"
              >
                <Link
                  to="/"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#FFC928] hover:bg-[#e6b525] text-[#163F78] font-bold rounded-lg transition-colors"
                >
                  <Package size={18} />
                  Khám phá sản phẩm
                </Link>
                <Link
                  to="/dich-vu-khach-hang"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg border border-white/30 transition-colors"
                >
                  <PhoneCall size={18} />
                  Liên hệ Mecsu
                </Link>
              </motion.div>
            </div>

            {/* Right - Floating Stats */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="hidden lg:flex flex-col gap-4 shrink-0"
            >
              <FloatingStatCard value="30,000+" label="Mã sản phẩm" />
              <FloatingStatCard value="300+" label="Đối tác thương hiệu" />
              <FloatingStatCard value="2h" label="Giao hàng nhanh" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============================================
          2. STATS SECTION
      ============================================ */}
      <section className="py-14 lg:py-18 bg-slate-100">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
            {[
              { icon: Package, number: 30000, suffix: '+', label: 'Mã sản phẩm' },
              { icon: Factory, number: 300, suffix: '+', label: 'Thương hiệu đối tác' },
              { icon: Clock, number: 10, suffix: '+', label: 'Năm phát triển' },
              { icon: Zap, number: 2, suffix: 'h', label: 'Giao hàng nhanh' },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -4 }}
                className="bg-white rounded-xl p-5 lg:p-6 text-center shadow-sm hover:shadow-md transition-all duration-200"
              >
                <stat.icon className="w-10 h-10 mx-auto mb-3 text-brand-secondary" />
                <div className="text-2xl lg:text-3xl font-bold text-[#163F78] mb-1">
                  <AnimatedCounter end={stat.number} suffix={stat.suffix} />
                </div>
                <div className="text-sm text-slate-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          3. "MECSU LÀ GÌ?" SECTION
      ============================================ */}
      <section className="py-14 lg:py-20 bg-white">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-center">
            {/* Left Content */}
            <div className="flex-1">
              <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-6 tracking-tight">
                Mecsu là gì?
              </h2>
              <div className="space-y-5">
                <p className="text-slate-600 leading-relaxed">
                  Mecsu là nền tảng thương mại điện tử chuyên cung cấp vật tư công
                  nghiệp hàng đầu tại Việt Nam. Chúng tôi kết nối doanh nghiệp sản xuất
                  với hàng trăm thương hiệu uy tín trong và ngoài nước.
                </p>
                <p className="text-slate-600 leading-relaxed">
                  Với hệ thống kho hàng hiện đại và đội ngũ tư vấn kỹ thuật chuyên
                  nghiệp, Mecsu cam kết mang đến giải pháp mua hàng công nghiệp hiệu
                  quả, tiết kiệm chi phí và thời gian cho doanh nghiệp của bạn.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-brand-secondary/10 flex items-center justify-center">
                      <CheckCircle2 size={20} className="text-brand-secondary" />
                    </div>
                    <span className="text-slate-700 text-sm font-medium">
                      Hơn 30,000 sản phẩm
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-brand-secondary/10 flex items-center justify-center">
                      <CheckCircle2 size={20} className="text-brand-secondary" />
                    </div>
                    <span className="text-slate-700 text-sm font-medium">
                      300+ thương hiệu
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Image */}
            <div className="flex-1 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1553413077-190dd305871c?q=80&w=2070&auto=format&fit=crop"
                  alt="Mecsu Warehouse Operations"
                  className="w-full h-[300px] lg:h-[400px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#163F78]/40 to-transparent" />
              </div>
              {/* Floating label */}
              <div className="absolute -bottom-4 -right-4 lg:-right-6 bg-[#FFC928] text-[#163F78] px-4 py-2 rounded-lg font-bold text-sm shadow-lg">
                Kho vận & Vận hành thực tế
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          4. WHY MECSU EXISTS SECTION
      ============================================ */}
      <section className="py-14 lg:py-20 bg-gradient-to-br from-[#163F78] to-[#1a4a8a]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-center">
            {/* Left Image */}
            <div className="flex-1 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1565043666747-69f6646db940?q=80&w=2069&auto=format&fit=crop"
                  alt="Vietnamese Industrial Manufacturing"
                  className="w-full h-[300px] lg:h-[400px] object-cover"
                />
                <div className="absolute inset-0 bg-[#163F78]/30" />
              </div>
              {/* Quote Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="absolute -bottom-6 -left-4 lg:-left-8 bg-white rounded-xl p-5 shadow-2xl max-w-[280px]"
              >
                <Quote size={28} className="text-brand-secondary/30 mb-2" />
                <p className="text-slate-700 text-[14px] leading-relaxed italic">
                  "Mecsu được xây dựng để đơn giản hóa việc mua hàng công nghiệp."
                </p>
              </motion.div>
            </div>

            {/* Right Content */}
            <div className="flex-1">
              <h2 className="text-2xl lg:text-3xl font-bold text-white mb-8 tracking-tight">
                Vì sao Mecsu được thành lập?
              </h2>
              <div className="space-y-6">
                {whyMecsuStory.map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex gap-4"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#FFC928] flex items-center justify-center shrink-0 text-[#163F78] font-bold text-sm">
                      {idx + 1}
                    </div>
                    <div>
                      <h3 className="font-bold text-white mb-1">{item.title}</h3>
                      <p className="text-white/80 text-[14px] leading-relaxed">
                        {item.content}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          5. TIMELINE SECTION
      ============================================ */}
      <section className="py-14 lg:py-20 bg-white">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-12 text-center tracking-tight">
            Hành trình phát triển
          </h2>
          <div className="relative">
            {/* Timeline Line */}
            <div className="hidden lg:block absolute top-6 left-[10%] right-[10%] h-1 bg-[#FFC928]" />
            <div className="lg:hidden absolute top-6 left-6 bottom-6 w-1 bg-[#FFC928]" />

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-4">
              {timelineData.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="relative text-center lg:text-center"
                >
                  {/* Dot */}
                  <div className="hidden lg:flex w-12 h-12 mx-auto mb-4 rounded-full bg-[#163F78] text-white items-center justify-center font-bold shadow-lg z-10">
                    {item.year.slice(-2)}
                  </div>
                  <div className="lg:hidden absolute left-0 w-12 h-12 rounded-full bg-[#163F78] text-white items-center justify-center font-bold shadow-lg z-10 flex">
                    {item.year.slice(-2)}
                  </div>
                  <div className="lg:hidden ml-16 text-left">
                    <div className="text-xs font-bold text-[#163F78] mb-1">{item.year}</div>
                    <div className="font-bold text-slate-800 mb-1">{item.title}</div>
                    <div className="text-slate-500 text-[12px]">{item.desc}</div>
                  </div>
                  <div className="hidden lg:block">
                    <div className="text-xs font-bold text-[#163F78] mb-1">{item.year}</div>
                    <div className="font-bold text-slate-800 mb-1">{item.title}</div>
                    <div className="text-slate-500 text-[12px] leading-snug">{item.desc}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          6. CORE VALUES SECTION
      ============================================ */}
      <section className="py-14 lg:py-20 bg-slate-100">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-12 text-center tracking-tight">
            Giá trị cốt lõi
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {coreValues.map((value, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -4 }}
                className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-all duration-200 border border-slate-100"
              >
                <div className="w-14 h-14 rounded-full bg-[#FFC928]/20 flex items-center justify-center mx-auto mb-4">
                  <value.icon size={28} className="text-[#163F78]" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{value.title}</h3>
                <p className="text-slate-500 text-[13px] leading-relaxed">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          7. WAREHOUSE & OPERATIONS SECTION
      ============================================ */}
      <section className="py-14 lg:py-20 bg-white">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-4 tracking-tight">
              Kho hàng & Hệ thống vận hành
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Mecsu vận hành trên nền tảng kho hàng và hệ thống ERP nhằm đảm bảo tốc
              độ, độ chính xác và khả năng cung ứng ổn định.
            </p>
          </div>

          {/* Image Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
            <div className="relative rounded-2xl overflow-hidden h-[250px] lg:h-[350px]">
              <img
                src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070&auto=format&fit=crop"
                alt="Mecsu Warehouse"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#163F78]/60 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="font-bold text-lg">Kho hàng hiện đại</h3>
                <p className="text-sm text-white/80">Hệ thống kho vận quy mô lớn</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="relative rounded-2xl overflow-hidden h-[115px] lg:h-[165px]">
                <img
                  src="https://images.unsplash.com/photo-1553413077-190dd305871c?q=80&w=2070&auto=format&fit=crop"
                  alt="Inventory Management"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-[#163F78]/40" />
                <div className="absolute bottom-3 left-3 text-white text-sm font-semibold">
                  Quản lý tồn kho
                </div>
              </div>
              <div className="relative rounded-2xl overflow-hidden h-[115px] lg:h-[165px]">
                <img
                  src="https://images.unsplash.com/photo-1565043666747-69f6646db940?q=80&w=2069&auto=format&fit=crop"
                  alt="Logistics"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-[#163F78]/40" />
                <div className="absolute bottom-3 left-3 text-white text-sm font-semibold">
                  Giao hàng nhanh
                </div>
              </div>
              <div className="relative rounded-2xl overflow-hidden h-[115px] lg:h-[165px]">
                <img
                  src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070&auto=format&fit=crop"
                  alt="ERP System"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-[#163F78]/40" />
                <div className="absolute bottom-3 left-3 text-white text-sm font-semibold">
                  Hệ thống ERP
                </div>
              </div>
              <div className="relative rounded-2xl overflow-hidden h-[115px] lg:h-[165px]">
                <img
                  src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070&auto=format&fit=crop"
                  alt="Quality Control"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-[#163F78]/40" />
                <div className="absolute bottom-3 left-3 text-white text-sm font-semibold">
                  Kiểm soát chất lượng
                </div>
              </div>
            </div>
          </div>

          {/* Operational Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: Shield, title: 'Kiểm soát tồn kho', desc: 'Hệ thống FIFO chính xác' },
              { icon: CheckCircle2, title: 'Truy xuất nguồn gốc', desc: 'Lot number đầy đủ' },
              { icon: Truck, title: 'Giao hàng nhanh', desc: 'Giao trong 2 giờ nội thành' },
              { icon: Cog, title: 'Hệ thống ERP', desc: 'Đồng bộ dữ liệu thời gian thực' },
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-4 bg-slate-50 rounded-xl p-4 border border-slate-100"
              >
                <div className="w-12 h-12 rounded-lg bg-brand-secondary/10 flex items-center justify-center shrink-0">
                  <item.icon size={24} className="text-brand-secondary" />
                </div>
                <div>
                  <div className="font-semibold text-slate-800 text-[14px]">{item.title}</div>
                  <div className="text-slate-500 text-[12px]">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          8. WHO WE SERVE SECTION
      ============================================ */}
      <section className="py-14 lg:py-20 bg-slate-100">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-4 text-center tracking-tight">
            Đối tượng phục vụ
          </h2>
          <p className="text-slate-600 text-center max-w-xl mx-auto mb-12">
            Mecsu tự hào là đối tác tin cậy của các doanh nghiệp công nghiệp hàng đầu
            Việt Nam
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
            {industries.map((item, idx) => (
              <IndustryCard key={idx} icon={item.icon} title={item.title} description={item.desc} />
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          9. TESTIMONIALS SECTION
      ============================================ */}
      <section className="py-14 lg:py-20 bg-white">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-4 text-center tracking-tight">
            Khách hàng nói gì về Mecsu
          </h2>
          <p className="text-slate-600 text-center max-w-xl mx-auto mb-12">
            Những đánh giá từ các doanh nghiệp đã tin tưởng hợp tác với Mecsu
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((item, idx) => (
              <TestimonialCard
                key={idx}
                name={item.name}
                company={item.company}
                role={item.role}
                content={item.content}
                rating={item.rating}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          10. PARTNERS & BRANDS SECTION
      ============================================ */}
      <section className="py-14 lg:py-20 bg-slate-100">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-4 text-center tracking-tight">
            Được tin tưởng bởi các thương hiệu công nghiệp
          </h2>
          <p className="text-slate-600 text-center max-w-xl mx-auto mb-12">
            Hệ sinh thái đối tác đa dạng của Mecsu
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
            {partners.map((name, idx) => (
              <PartnerLogo key={idx} name={name} />
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          11. FINAL CTA SECTION
      ============================================ */}
      <section className="relative py-16 lg:py-24 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070&auto=format&fit=crop"
            alt="Industrial Background"
            className="w-full h-full object-cover brightness-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#163F78]/95 to-[#1a4a8a]/90" />
        </div>

        <div className="relative z-10 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-5 tracking-tight">
              Sẵn sàng tối ưu quy trình mua hàng công nghiệp?
            </h2>
            <p className="text-white/80 text-base max-w-xl mx-auto mb-8">
              Bắt đầu với Mecsu ngay hôm nay để trải nghiệm dịch vụ mua hàng vật tư
              công nghiệp chuyên nghiệp và hiệu quả
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#FFC928] hover:bg-[#e6b525] text-[#163F78] font-bold rounded-xl transition-colors text-[15px]"
              >
                <Package size={20} />
                Khám phá sản phẩm
              </Link>
              <Link
                to="/dich-vu-khach-hang"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/30 transition-colors text-[15px]"
              >
                <MessageCircle size={20} />
                Liên hệ tư vấn
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
