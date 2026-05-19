import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  Package,
  History,
  FileText,
  HelpCircle,
  RefreshCw,
  Edit,
  Download,
  Headphones,
  MessageCircle,
  Phone,
  Mail,
  Clock,
  ChevronRight,
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  FileCheck,
  Wrench,
  Truck,
  Quote,
  Building2,
  Users,
  BadgeCheck,
  Send,
  BookOpen,
} from 'lucide-react';
import { motion } from 'motion/react';
import { Breadcrumb } from './common/Breadcrumb';

// Action Card Interface
interface ActionCardProps {
  icon: React.ReactNode;
  title: string;
  onClick?: () => void;
  href?: string;
  isHighlighted?: boolean;
}

const ActionCard: React.FC<ActionCardProps> = ({ icon, title, onClick, href, isHighlighted }) => {
  const content = (
    <motion.div
      whileHover={{ y: -2, scale: 1.005 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      className={`
        group relative bg-white rounded-lg border cursor-pointer
        transition-all duration-150 ease-out
        ${isHighlighted 
          ? 'border-brand-secondary/40 bg-gradient-to-r from-brand-secondary/5 to-transparent hover:bg-brand-secondary/8 hover:border-brand-secondary/60 hover:shadow-brand-secondary/20 hover:shadow-md' 
          : 'border-slate-200 hover:border-brand-secondary/50 hover:bg-blue-50/30 hover:shadow-sm'
        }
      `}
    >
      <div className="flex items-center gap-3 p-3.5 lg:p-3">
        <div className={`
          w-9 h-9 rounded-md flex items-center justify-center shrink-0 transition-colors duration-150
          ${isHighlighted 
            ? 'bg-brand-secondary/12 group-hover:bg-brand-secondary/20' 
            : 'bg-slate-100 group-hover:bg-brand-secondary/10'
          }
        `}>
          <div className={`transition-colors duration-150 ${isHighlighted ? 'text-brand-secondary' : 'text-slate-500 group-hover:text-brand-secondary'}`}>
            {icon}
          </div>
        </div>
        <span className={`
          text-[13px] font-semibold transition-colors duration-150 leading-tight
          ${isHighlighted ? 'text-brand-secondary' : 'text-slate-600 group-hover:text-slate-800'}
        `}>
          {title}
        </span>
        <ChevronRight 
          size={16} 
          className={`
            ml-auto opacity-0 group-hover:opacity-100 transition-all duration-150
            ${isHighlighted ? 'text-brand-secondary' : 'text-slate-400'}
          `} 
        />
      </div>
    </motion.div>
  );

  if (href) {
    return <Link to={href}>{content}</Link>;
  }

  return (
    <div onClick={onClick}>
      {content}
    </div>
  );
};

// Topic Card Interface
interface TopicCardProps {
  title: string;
  questions: string[];
  icon: React.ReactNode;
  href: string;
}

const TopicCard: React.FC<TopicCardProps> = ({ title, questions, icon, href }) => {
  return (
    <motion.div
      whileHover={{ y: -1 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      className="bg-white rounded-lg border border-slate-200 overflow-hidden
                 hover:border-slate-300 hover:shadow-sm transition-all duration-150"
    >
      <div className="bg-slate-50/80 px-4 py-3 border-b border-slate-200">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-md bg-white border border-slate-200 
                        flex items-center justify-center shrink-0">
            <div className="text-brand-secondary">
              {icon}
            </div>
          </div>
          <h3 className="text-[13px] font-bold text-slate-700">{title}</h3>
        </div>
      </div>
      <div className="p-4">
        <ul className="flex flex-col gap-2 mb-3">
          {questions.map((q, idx) => (
            <li key={idx}>
              <a 
                href={href} 
                className="text-[12px] text-slate-500 hover:text-brand-secondary 
                          transition-colors duration-150 flex items-start gap-2 group"
              >
                <span className="text-slate-300 group-hover:text-brand-secondary/40 mt-0.5 shrink-0">•</span>
                <span>{q}</span>
              </a>
            </li>
          ))}
        </ul>
        <Link 
          to={href} 
          className="text-[12px] font-semibold text-brand-secondary hover:text-brand-primary 
                    transition-colors duration-150 inline-flex items-center gap-1 group"
        >
          Xem tất cả
          <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </motion.div>
  );
};

// Benefit Card Interface
interface BenefitCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const BenefitCard: React.FC<BenefitCardProps> = ({ icon, title, description }) => {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      className="bg-white rounded-lg border border-slate-200 p-5
                 hover:shadow-md hover:border-brand-secondary/30 transition-all duration-150"
    >
      <div className="w-11 h-11 rounded-md bg-brand-secondary/8 
                    flex items-center justify-center mb-3">
        <div className="text-brand-secondary">
          {icon}
        </div>
      </div>
      <h3 className="text-[13px] font-bold text-slate-800 mb-1.5 leading-snug">{title}</h3>
      <p className="text-[12px] text-slate-500 leading-relaxed">{description}</p>
    </motion.div>
  );
};

export default function CustomerServicePage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const breadcrumbItems = [
    { label: 'Trang chủ', href: '/' },
    { label: 'Dịch vụ khách hàng' },
  ];

  // Highlighted actions - most popular
  const highlightedActions = [
    { icon: <Package size={18} strokeWidth={1.8} />, title: 'Theo dõi đơn hàng', href: '/tai-khoan/don-hang' },
    { icon: <Quote size={18} strokeWidth={1.8} />, title: 'Yêu cầu báo giá', href: '/tai-khoan/bao-gia' },
    { icon: <RefreshCw size={18} strokeWidth={1.8} />, title: 'Đổi/trả hàng', href: '/tai-khoan/don-hang/doi-tra' },
  ];

  const actionCards = [
    { icon: <History size={18} strokeWidth={1.8} />, title: 'Lịch sử mua hàng', href: '/tai-khoan/don-hang' },
    { icon: <HelpCircle size={18} strokeWidth={1.8} />, title: 'Hỗ trợ sản phẩm', href: '#' },
    { icon: <Edit size={18} strokeWidth={1.8} />, title: 'Hủy/chỉnh sửa đơn', href: '/tai-khoan/don-hang' },
    { icon: <Download size={18} strokeWidth={1.8} />, title: 'Tải hóa đơn', href: '/tai-khoan/don-hang' },
    { icon: <Headphones size={18} strokeWidth={1.8} />, title: 'Tư vấn kỹ thuật', href: '#' },
  ];

  const topicCards = [
    {
      title: 'Đặt hàng',
      icon: <ClipboardList size={16} strokeWidth={1.8} />,
      href: '/faqs/dat-hang',
      questions: [
        'Cách đặt hàng trên Mecsu?',
        'Đặt hàng không cần tài khoản?',
      ],
    },
    {
      title: 'Thanh toán',
      icon: <FileCheck size={16} strokeWidth={1.8} />,
      href: '/faqs/thanh-toan',
      questions: [
        'Mecsu hỗ trợ thanh toán nào?',
        'Khi nào nhận được hóa đơn?',
      ],
    },
    {
      title: 'Giao hàng',
      icon: <Truck size={16} strokeWidth={1.8} />,
      href: '/faqs/giao-hang',
      questions: [
        'Thời gian giao hàng?',
        'Thay đổi địa chỉ giao hàng?',
      ],
    },
    {
      title: 'Đổi trả & bảo hành',
      icon: <RefreshCw size={16} strokeWidth={1.8} />,
      href: '/faqs/doi-tra-bao-hanh',
      questions: [
        'Chính sách đổi trả?',
        'Sản phẩm lỗi kỹ thuật?',
      ],
    },
    {
      title: 'Tài khoản',
      icon: <Building2 size={16} strokeWidth={1.8} />,
      href: '/faqs/tai-khoan',
      questions: [
        'Tạo tài khoản Mecsu?',
        'Quên mật khẩu?',
      ],
    },
    {
      title: 'Thông tin sản phẩm',
      icon: <FileText size={16} strokeWidth={1.8} />,
      href: '/faqs/thong-tin-san-pham',
      questions: [
        'Kiểm tra thông số kỹ thuật?',
        'Hình ảnh không đúng thực tế?',
      ],
    },
    {
      title: 'Báo giá & sỉ',
      icon: <Quote size={16} strokeWidth={1.8} />,
      href: '/faqs/bao-gia-doanh-nghiep',
      questions: [
        'Yêu cầu báo giá?',
        'Giá sỉ cho doanh nghiệp?',
      ],
    },
    {
      title: 'Hóa đơn & chứng từ',
      icon: <Download size={16} strokeWidth={1.8} />,
      href: '/faqs/hoa-don-chung-tu',
      questions: [
        'Xuất hóa đơn VAT?',
        'Tải lại hóa đơn cũ?',
      ],
    },
    {
      title: 'Tư vấn kỹ thuật',
      icon: <Wrench size={16} strokeWidth={1.8} />,
      href: '/faqs/tu-van-ky-thuat',
      questions: [
        'Chọn đúng sản phẩm?',
        'Gửi hình/mã để tư vấn?',
      ],
    },
  ];

  const benefitCards = [
    {
      icon: <Quote size={20} strokeWidth={1.8} />,
      title: 'Báo giá nhanh cho đơn lớn',
      description: 'Gửi danh sách mã hàng, Mecsu hỗ trợ báo giá phù hợp cho doanh nghiệp.',
    },
    {
      icon: <FileCheck size={20} strokeWidth={1.8} />,
      title: 'Hóa đơn VAT & chứng từ',
      description: 'Hỗ trợ xuất hóa đơn và lưu trữ chứng từ mua hàng đầy đủ.',
    },
    {
      icon: <Wrench size={20} strokeWidth={1.8} />,
      title: 'Tư vấn chọn sản phẩm',
      description: 'Kiểm tra thông số, quy cách, vật liệu và mã tương đương.',
    },
    {
      icon: <Package size={20} strokeWidth={1.8} />,
      title: 'Theo dõi đơn rõ ràng',
      description: 'Dễ dàng kiểm tra trạng thái xử lý, giao hàng và lịch sử mua.',
    },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section - COMPACT */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-5 lg:py-6">
          {/* Breadcrumb - smaller margin */}
          <div className="mb-4">
            <Breadcrumb items={breadcrumbItems} />
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-5">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl lg:text-[26px] font-bold text-slate-900 mb-1.5 tracking-tight">
                Dịch vụ khách hàng
              </h1>
              <p className="text-[13px] text-slate-500 max-w-2xl leading-snug">
                Mecsu hỗ trợ bạn từ tìm sản phẩm, đặt hàng, thanh toán đến giao hàng và đổi trả.
              </p>
            </div>

            {/* Search Box - SMALLER & MORE SUBTLE */}
            <div className="w-full lg:w-[360px] shrink-0">
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <Search 
                    size={16} 
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" 
                  />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tìm kiếm trong trung tâm hỗ trợ Mecsu..."
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg
                             text-[13px] text-slate-700 placeholder:text-slate-400
                             focus:outline-none focus:border-brand-secondary focus:ring-2 focus:ring-brand-secondary/15
                             transition-all duration-200"
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Section 1: Action Cards - COMPACT */}
      <section className="py-6 lg:py-8">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-[15px] lg:text-base font-bold text-slate-800 mb-4 tracking-tight uppercase">
            Bạn muốn thực hiện việc gì?
          </h2>
          
          {/* Highlighted Actions - Horizontal compact layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mb-3">
            {highlightedActions.map((card, idx) => (
              <ActionCard
                key={`highlight-${idx}`}
                icon={card.icon}
                title={card.title}
                href={card.href}
                isHighlighted={true}
              />
            ))}
          </div>

          {/* Other Actions - smaller gap */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            {actionCards.map((card, idx) => (
              <ActionCard
                key={`action-${idx}`}
                icon={card.icon}
                title={card.title}
                href={card.href}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Section 2: Help Topics - COMPACT with subtle background */}
      <section className="py-6 lg:py-8 bg-slate-100/60 border-y border-slate-200">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-[15px] lg:text-base font-bold text-slate-800 mb-4 tracking-tight uppercase">
            Chủ đề hỗ trợ
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {topicCards.map((card, idx) => (
              <TopicCard
                key={idx}
                title={card.title}
                icon={card.icon}
                questions={card.questions}
                href={card.href}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: Contact Support - DARK COMPACT */}
      <section className="py-8 lg:py-10 bg-gradient-to-br from-[#163F78] to-[#1a4a8a]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
            {/* Left Content */}
            <div className="flex-1">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                  <Users size={20} className="text-brand-primary" />
                </div>
                <h2 className="text-xl lg:text-[22px] font-bold text-white tracking-tight">
                  Hỗ trợ từ đội ngũ Mecsu
                </h2>
              </div>
              <p className="text-[13px] text-white/70 leading-relaxed max-w-lg">
                Mecsu hỗ trợ bạn từ tìm đúng mã sản phẩm, kiểm tra thông số kỹ thuật, 
                báo giá số lượng lớn đến xử lý đơn hàng và đổi trả.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 rounded-md text-white text-[11px] font-medium">
                  <BadgeCheck size={14} />
                  Đội ngũ chuyên nghiệp
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 rounded-md text-white text-[11px] font-medium">
                  <Clock size={14} />
                  Phản hồi nhanh
                </span>
              </div>
            </div>

            {/* Right Contact Card */}
            <div className="w-full lg:w-[340px] shrink-0">
              <div className="bg-white rounded-xl p-5 shadow-xl">
                <h3 className="text-[14px] font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Headphones size={18} className="text-brand-secondary" />
                  Liên hệ Mecsu
                </h3>
                
                <div className="flex flex-col gap-2.5 mb-4">
                  {/* Chat */}
                  <a 
                    href="#" 
                    className="flex items-center gap-3 p-2.5 rounded-lg bg-blue-50 hover:bg-blue-100 
                             transition-colors group"
                  >
                    <div className="w-9 h-9 rounded-md bg-brand-secondary/10 flex items-center justify-center
                                  group-hover:bg-brand-secondary/15 transition-colors">
                      <MessageCircle size={16} className="text-brand-secondary" />
                    </div>
                    <div>
                      <div className="text-[12px] font-semibold text-slate-800">Chat với tư vấn viên</div>
                      <div className="text-[11px] text-slate-500">Phản hồi trong vài phút</div>
                    </div>
                  </a>

                  {/* Phone */}
                  <a 
                    href="tel:18008137" 
                    className="flex items-center gap-3 p-2.5 rounded-lg bg-blue-50 hover:bg-blue-100 
                             transition-colors group"
                  >
                    <div className="w-9 h-9 rounded-md bg-brand-secondary/10 flex items-center justify-center
                                  group-hover:bg-brand-secondary/15 transition-colors">
                      <Phone size={16} className="text-brand-secondary" />
                    </div>
                    <div>
                      <div className="text-[12px] font-semibold text-slate-800">Gọi hotline</div>
                      <div className="text-[13px] font-bold text-brand-secondary">[Hotline Mecsu]</div>
                    </div>
                  </a>

                  {/* Email */}
                  <a 
                    href="mailto:support@mecsu.vn" 
                    className="flex items-center gap-3 p-2.5 rounded-lg bg-blue-50 hover:bg-blue-100 
                             transition-colors group"
                  >
                    <div className="w-9 h-9 rounded-md bg-brand-secondary/10 flex items-center justify-center
                                  group-hover:bg-brand-secondary/15 transition-colors">
                      <Mail size={16} className="text-brand-secondary" />
                    </div>
                    <div>
                      <div className="text-[12px] font-semibold text-slate-800">Gửi email hỗ trợ</div>
                      <div className="text-[13px] font-bold text-brand-secondary">[Email hỗ trợ Mecsu]</div>
                    </div>
                  </a>
                </div>

                {/* Working Hours */}
                <div className="border-t border-slate-200 pt-4">
                  <div className="flex items-start gap-2 mb-2">
                    <Clock size={14} className="text-slate-400 mt-0.5" />
                    <div>
                      <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-0.5">
                        Thời gian hỗ trợ
                      </div>
                      <div className="text-[12px] text-slate-700">
                        Thứ 2 - Thứ 6, 8:00 - 17:30
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Clock size={14} className="text-slate-400 mt-0.5" />
                    <div>
                      <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-0.5">
                        Ngoài giờ làm việc
                      </div>
                      <div className="text-[12px] text-slate-500">
                        Gửi yêu cầu, Mecsu phản hồi sớm nhất
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Business Benefits - COMPACT */}
      <section className="py-6 lg:py-8 bg-white">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-5">
            <h2 className="text-[15px] lg:text-base font-bold text-slate-800 mb-2 tracking-tight uppercase">
              Lợi ích cho khách hàng doanh nghiệp
            </h2>
            <p className="text-[13px] text-slate-500 max-w-lg mx-auto">
              Mecsu đồng hành cùng doanh nghiệp tối ưu quy trình mua sắm vật tư công nghiệp.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {benefitCards.map((card, idx) => (
              <BenefitCard
                key={idx}
                icon={card.icon}
                title={card.title}
                description={card.description}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - COMPACT */}
      <section className="py-6 lg:py-8 bg-slate-50 border-t border-slate-200">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-xl mx-auto text-center">
            <div className="w-11 h-11 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-4">
              <HelpCircle size={22} className="text-brand-primary" />
            </div>
            <h2 className="text-[15px] lg:text-base font-bold text-slate-900 mb-2 tracking-tight">
              Chưa tìm thấy câu trả lời?
            </h2>
            <p className="text-[13px] text-slate-500 mb-5 leading-snug">
              Gửi yêu cầu hỗ trợ, đội ngũ Mecsu sẽ liên hệ xử lý cho bạn.
            </p>
            <div className="flex flex-col sm:flex-row gap-2.5 justify-center">
              <a 
                href="#" 
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 
                         bg-[#C55A2B] hover:bg-[#a84a22] text-white rounded-lg
                         text-[13px] font-bold transition-colors shadow-sm"
              >
                <Send size={14} />
                Gửi yêu cầu hỗ trợ
              </a>
              <a 
                href="/faqs" 
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 
                         bg-white border border-slate-200 hover:border-brand-secondary
                         text-slate-600 hover:text-brand-secondary rounded-lg
                         text-[13px] font-semibold transition-colors"
              >
                <BookOpen size={14} />
                Xem câu hỏi thường gặp
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
