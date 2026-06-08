import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Mail,
  MessageCircle,
  Phone,
  Search,
  SendHorizonal,
  ShieldCheck,
  Ticket,
  Truck,
} from 'lucide-react';
import { AccountLayout } from './components/AccountLayout';
import { Toast } from '../../components/ui/Toast';
import { cn } from '../../lib/utils';

type FaqCategory = 'all' | 'quotation' | 'orders' | 'payment' | 'shipping' | 'warranty';
type RequestType = 'quotation' | 'orders' | 'payment' | 'shipping' | 'warranty' | 'other';

interface QuickSupportChannel {
  id: string;
  title: string;
  description: string;
  buttonLabel: string;
  icon: React.ElementType;
  href?: string;
}

interface FaqItem {
  id: string;
  category: Exclude<FaqCategory, 'all'>;
  question: string;
  answer: string;
}

interface PolicyItem {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: React.ElementType;
}

interface RequestFormData {
  fullName: string;
  phone: string;
  email: string;
  requestType: RequestType | '';
  referenceCode: string;
  message: string;
}

interface FormErrors {
  fullName?: string;
  phone?: string;
  email?: string;
  requestType?: string;
  message?: string;
}

const heroSupportTags = ['Báo giá', 'Đơn hàng', 'Vận chuyển', 'Chính sách'];

const quickSupportChannels: QuickSupportChannel[] = [
  {
    id: 'hotline',
    title: 'Gọi hotline',
    description: 'Hỗ trợ nhanh trong giờ hành chính',
    buttonLabel: 'Gọi ngay',
    icon: Phone,
    href: 'tel:19009489',
  },
  {
    id: 'zalo',
    title: 'Zalo hỗ trợ',
    description: 'Trao đổi nhanh với nhân viên MECSU',
    buttonLabel: 'Mở Zalo',
    icon: MessageCircle,
    href: '#',
  },
  {
    id: 'ticket',
    title: 'Gửi yêu cầu',
    description: 'Tạo ticket để theo dõi tiến độ xử lý',
    buttonLabel: 'Tạo yêu cầu',
    icon: Ticket,
  },
  {
    id: 'email',
    title: 'Email hỗ trợ',
    description: 'Gửi thông tin chi tiết để được phản hồi',
    buttonLabel: 'Gửi email',
    icon: Mail,
    href: 'mailto:support@mecsu.vn',
  },
];

const faqCategories: { id: FaqCategory; label: string }[] = [
  { id: 'all', label: 'Tất cả' },
  { id: 'quotation', label: 'Báo giá' },
  { id: 'orders', label: 'Đơn hàng' },
  { id: 'payment', label: 'Thanh toán' },
  { id: 'shipping', label: 'Vận chuyển' },
  { id: 'warranty', label: 'Bảo hành' },
];

const faqItems: FaqItem[] = [
  {
    id: 'faq-quotation-request',
    category: 'quotation',
    question: 'Làm sao để yêu cầu báo giá?',
    answer:
      'Bạn có thể gửi yêu cầu báo giá trực tiếp từ trang sản phẩm, trung tâm báo giá hoặc form hỗ trợ bên phải. Hãy bổ sung mã sản phẩm, số lượng và thời gian cần hàng để MECSU phản hồi nhanh hơn.',
  },
  {
    id: 'faq-order-tracking',
    category: 'orders',
    question: 'Tôi có thể theo dõi trạng thái đơn hàng ở đâu?',
    answer:
      'Bạn có thể theo dõi tại mục Đơn hàng trong tài khoản hoặc nhập mã đơn hàng ở khối Theo dõi yêu cầu bên dưới. Với các đơn đang vận chuyển, trạng thái sẽ được cập nhật theo từng mốc xử lý.',
  },
  {
    id: 'faq-payment-methods',
    category: 'payment',
    question: 'MECSU hỗ trợ những hình thức thanh toán nào?',
    answer:
      'MECSU hỗ trợ chuyển khoản doanh nghiệp, thanh toán theo công nợ đã duyệt và một số phương thức thanh toán linh hoạt theo loại đơn hàng. Bộ phận chăm sóc khách hàng sẽ xác nhận phương án phù hợp sau khi tiếp nhận yêu cầu.',
  },
  {
    id: 'faq-shipping-time',
    category: 'shipping',
    question: 'Thời gian giao hàng dự kiến là bao lâu?',
    answer:
      'Thời gian giao hàng phụ thuộc vào tồn kho, địa điểm nhận hàng và phương án vận chuyển. Với các đơn nội thành hoặc hàng có sẵn, MECSU sẽ ưu tiên xử lý sớm và thông báo ETA cụ thể cho bạn.',
  },
  {
    id: 'faq-vat-invoice',
    category: 'orders',
    question: 'Tôi cần xuất hóa đơn VAT thì làm thế nào?',
    answer:
      'Bạn chỉ cần cung cấp thông tin doanh nghiệp, mã số thuế và email nhận hóa đơn trong quá trình đặt hàng hoặc qua form hỗ trợ. Đội ngũ MECSU sẽ xác nhận và gửi hóa đơn theo đúng quy trình.',
  },
  {
    id: 'faq-warranty-process',
    category: 'warranty',
    question: 'Khi cần bảo hành sản phẩm tôi cần chuẩn bị gì?',
    answer:
      'Bạn nên chuẩn bị mã đơn hàng, hình ảnh/video lỗi nếu có và mô tả ngắn về tình trạng sử dụng. Điều này giúp đội ngũ kỹ thuật phân loại nhanh và đề xuất phương án xử lý phù hợp.',
  },
];

const requestTypeOptions: { value: RequestType; label: string }[] = [
  { value: 'quotation', label: 'Báo giá' },
  { value: 'orders', label: 'Đơn hàng' },
  { value: 'payment', label: 'Thanh toán' },
  { value: 'shipping', label: 'Vận chuyển' },
  { value: 'warranty', label: 'Bảo hành' },
  { value: 'other', label: 'Khác' },
];

const policyItems: PolicyItem[] = [
  {
    id: 'return-policy',
    title: 'Chính sách đổi trả',
    description: 'Xem điều kiện, thời gian và quy trình đổi trả dành cho khách hàng doanh nghiệp.',
    href: '#',
    icon: ShieldCheck,
  },
  {
    id: 'warranty-policy',
    title: 'Chính sách bảo hành',
    description: 'Tổng hợp phạm vi bảo hành, hồ sơ cần chuẩn bị và thời gian xử lý dự kiến.',
    href: '#',
    icon: CheckCircle2,
  },
  {
    id: 'shipping-policy',
    title: 'Chính sách vận chuyển',
    description: 'Thông tin về giao hàng, thời gian dự kiến và các hỗ trợ cho từng khu vực nhận hàng.',
    href: '#',
    icon: Truck,
  },
];

const initialFormData: RequestFormData = {
  fullName: '',
  phone: '',
  email: '',
  requestType: '',
  referenceCode: '',
  message: '',
};

const getTrackingStepIndex = (status: TrackingStatus) =>
  trackingSteps.findIndex((step) => step.id === status);

const getChannelButtonClasses = (channelId: string) => {
  if (channelId === 'ticket') {
    return 'bg-[#173E75] text-white hover:bg-[#0F2F5C]';
  }

  return 'bg-[#F7FAFC] text-[#173E75] hover:bg-[#EAF2FB]';
};

const CustomerSupportPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<FaqCategory>('all');
  const [expandedFaqId, setExpandedFaqId] = useState<string>(faqItems[0]?.id ?? '');
  const [formData, setFormData] = useState<RequestFormData>(initialFormData);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
    show: false,
    message: '',
    type: 'success',
  });

  const filteredFaqItems = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return faqItems.filter((item) => {
      const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
      const matchesQuery =
        !normalizedQuery ||
        item.question.toLowerCase().includes(normalizedQuery) ||
        item.answer.toLowerCase().includes(normalizedQuery);

      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, searchQuery]);

  const handleSearch = () => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    if (!normalizedQuery) {
      setActiveCategory('all');
      setExpandedFaqId(faqItems[0]?.id ?? '');
      return;
    }

    const firstMatch = faqItems.find(
      (item) =>
        item.question.toLowerCase().includes(normalizedQuery) ||
        item.answer.toLowerCase().includes(normalizedQuery)
    );

    if (firstMatch) {
      setActiveCategory(firstMatch.category);
      setExpandedFaqId(firstMatch.id);
    }
  };

  const handleCategoryChange = (categoryId: FaqCategory) => {
    setActiveCategory(categoryId);
    const nextFaq = faqItems.find((item) => categoryId === 'all' || item.category === categoryId);
    setExpandedFaqId(nextFaq?.id ?? '');
  };

  const handleQuickActionClick = (channelId: string) => {
    if (channelId === 'ticket') {
      const requestSection = document.getElementById('support-request-form');
      requestSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    if (channelId === 'zalo') {
      window.open('https://zalo.me', '_blank', 'noopener,noreferrer');
    }
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setFormErrors((prev) => ({
      ...prev,
      [name]: undefined,
    }));
  };

  const validateForm = () => {
    const nextErrors: FormErrors = {};

    if (!formData.fullName.trim()) {
      nextErrors.fullName = 'Vui lòng nhập họ và tên';
    }

    if (!formData.phone.trim()) {
      nextErrors.phone = 'Vui lòng nhập số điện thoại';
    }

    if (!formData.email.trim()) {
      nextErrors.email = 'Vui lòng nhập email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      nextErrors.email = 'Email chưa đúng định dạng';
    }

    if (!formData.requestType) {
      nextErrors.requestType = 'Vui lòng chọn loại yêu cầu';
    }

    if (!formData.message.trim()) {
      nextErrors.message = 'Vui lòng nhập nội dung cần hỗ trợ';
    }

    setFormErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmitRequest = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setFormData(initialFormData);
    setToast({
      show: true,
      message: 'Yêu cầu hỗ trợ đã được gửi thành công',
      type: 'success',
    });
  };

  return (
    <AccountLayout>
      <div className="space-y-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 lg:text-3xl">Hỗ trợ khách hàng</h1>
          <p className="mt-1 text-sm leading-6 text-slate-500 lg:text-base">
            Tìm hỗ trợ nhanh cho báo giá, đơn hàng, vận chuyển và các chính sách mua hàng.
          </p>
        </div>

        <section className="overflow-hidden rounded-[24px] bg-gradient-to-r from-[#173E75] to-[#245A9C] px-5 py-4 text-white shadow-[0_20px_50px_rgba(23,62,117,0.18)] sm:px-6 lg:px-8 lg:py-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-center lg:gap-8">
            <div className="lg:col-span-7">
              <div className="max-w-2xl space-y-4">
                <span className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold tracking-[0.16em] text-white/85 uppercase">
                  Trung tâm hỗ trợ
                </span>
                <div className="space-y-3">
                  <h2 className="max-w-xl text-[28px] font-bold leading-tight text-white sm:text-[32px] lg:text-[38px]">
                    Trung tâm hỗ trợ khách hàng
                  </h2>
                  <p className="max-w-2xl text-sm leading-6 text-white/78 sm:text-[15px] lg:text-base">
                    MECSU luôn sẵn sàng hỗ trợ báo giá, đơn hàng, vận chuyển và chính sách mua hàng.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2.5 pt-1">
                  {heroSupportTags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/12 bg-white/10 px-3 py-1.5 text-xs font-medium text-white/92"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-[20px] border border-white/12 bg-white/10 p-3 backdrop-blur-sm sm:p-4">
                <div className="rounded-[16px] bg-white p-2 shadow-[0_10px_30px_rgba(15,23,42,0.12)]">
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <div className="relative flex-1">
                      <Search
                        size={18}
                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(event) => setSearchQuery(event.target.value)}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter') {
                            handleSearch();
                          }
                        }}
                        placeholder="Tìm kiếm câu hỏi, mã đơn hàng, báo giá…"
                        className="h-12 w-full rounded-[14px] border border-[#E3EAF3] bg-white pl-11 pr-4 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#173E75]/20 focus:border-[#173E75] transition-all"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleSearch}
                      className="inline-flex h-12 items-center justify-center rounded-[14px] bg-[#F6C343] px-5 text-sm font-semibold text-[#173E75] transition-colors hover:bg-[#f0bb31] sm:min-w-[130px]"
                    >
                      Tìm kiếm
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
          {quickSupportChannels.map((channel) => {
            const Icon = channel.icon;
            const buttonContent = (
              <>
                <span>{channel.buttonLabel}</span>
                <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-0.5" />
              </>
            );

            return (
              <article
                key={channel.id}
                className="group rounded-[18px] border border-[#E3EAF3] bg-white p-4 shadow-[0_8px_24px_rgba(15,23,42,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_32px_rgba(15,23,42,0.08)]"
              >
                <div className="flex h-full flex-col gap-3">
                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-[#EAF2FB] text-[#173E75]">
                      <Icon size={18} />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-base font-semibold text-[#0F172A]">{channel.title}</h3>
                      <p className="text-sm leading-5 text-[#64748B]">{channel.description}</p>
                    </div>
                  </div>

                  {channel.href ? (
                    <a
                      href={channel.href}
                      target={channel.id === 'zalo' ? '_blank' : undefined}
                      rel={channel.id === 'zalo' ? 'noopener noreferrer' : undefined}
                      className={cn(
                        'group inline-flex w-fit items-center gap-1 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors',
                        getChannelButtonClasses(channel.id)
                      )}
                    >
                      {buttonContent}
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleQuickActionClick(channel.id)}
                      className={cn(
                        'group inline-flex w-fit items-center gap-1 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors',
                        getChannelButtonClasses(channel.id)
                      )}
                    >
                      {buttonContent}
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </section>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(320px,0.9fr)] xl:items-start">
          <div className="rounded-[20px] border border-[#E5EAF2] bg-white p-4 shadow-[0_8px_24px_rgba(15,23,42,0.04)] lg:p-5">
            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-lg font-bold text-[#0F172A] lg:text-xl">Câu hỏi thường gặp</h2>
                <p className="mt-1 text-sm leading-5 text-[#64748B]">
                  Chọn chủ đề để xem nhanh câu trả lời phù hợp với nhu cầu của bạn.
                </p>
              </div>
            </div>

            <div className="mb-4 flex flex-wrap gap-2">
              {faqCategories.map((category) => {
                const isActive = category.id === activeCategory;
                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => handleCategoryChange(category.id)}
                    className={cn(
                      'rounded-full px-3 py-1.5 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-[#173E75] text-white shadow-[0_10px_20px_rgba(23,62,117,0.18)]'
                        : 'bg-[#F3F6FA] text-[#334155] hover:bg-[#EAF2FB] hover:text-[#173E75]'
                    )}
                  >
                    {category.label}
                  </button>
                );
              })}
            </div>

            <div className="space-y-2">
              {filteredFaqItems.length > 0 ? (
                filteredFaqItems.map((item) => {
                  const isExpanded = expandedFaqId === item.id;

                  return (
                    <div
                      key={item.id}
                      className="overflow-hidden rounded-2xl border border-[#E8EEF5] bg-[#FCFDFE] transition-colors hover:border-[#D8E3F0]"
                    >
                      <button
                        type="button"
                        onClick={() => setExpandedFaqId(isExpanded ? '' : item.id)}
                        className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left sm:px-4"
                      >
                        <span className="text-[14px] font-semibold leading-5 text-[#0F172A]">
                          {item.question}
                        </span>
                        <ChevronDown
                          size={16}
                          className={cn(
                            'mt-0.5 flex-shrink-0 text-[#64748B] transition-transform duration-200',
                            isExpanded && 'rotate-180 text-[#173E75]'
                          )}
                        />
                      </button>

                      <div
                        className={cn(
                          'grid transition-all duration-300 ease-out',
                          isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                        )}
                      >
                        <div className="overflow-hidden">
                          <div className="border-t border-[#E8EEF5] px-4 py-3.5 text-sm leading-5 text-[#64748B]">
                            {item.answer}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="rounded-2xl border border-dashed border-[#D8E3F0] bg-[#F8FBFE] px-5 py-6 text-center">
                  <p className="text-sm text-[#64748B]">
                    Chưa tìm thấy câu hỏi phù hợp. Bạn có thể gửi yêu cầu hỗ trợ trực tiếp để MECSU phản hồi chi tiết hơn.
                  </p>
                </div>
              )}
            </div>
          </div>

          <aside
            id="support-request-form"
            className="rounded-[20px] border border-[#E5EAF2] bg-white p-4 shadow-[0_8px_24px_rgba(15,23,42,0.04)] xl:sticky xl:top-24 lg:p-5"
          >
            <div className="mb-4 space-y-1">
              <h2 className="text-lg font-bold text-[#0F172A]">Gửi yêu cầu hỗ trợ</h2>
              <p className="text-sm leading-5 text-[#64748B]">
                Mô tả vấn đề của bạn, MECSU sẽ phản hồi sớm nhất.
              </p>
            </div>

            <form className="space-y-3" onSubmit={handleSubmitRequest}>
              <div className="space-y-1.5">
                <label htmlFor="fullName" className="text-sm font-medium text-[#0F172A]">
                  Họ và tên
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className={cn(
                    'h-11 w-full rounded-xl border px-4 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#173E75]/15 transition-all',
                    formErrors.fullName ? 'border-amber-300 bg-amber-50/40' : 'border-[#E5EAF2] bg-white focus:border-[#173E75]'
                  )}
                  placeholder="Nhập họ và tên"
                />
                {formErrors.fullName && <p className="text-xs text-[#9A6A00]">{formErrors.fullName}</p>}
              </div>

              <div className="space-y-1.5">
                <label htmlFor="phone" className="text-sm font-medium text-[#0F172A]">
                  Số điện thoại
                </label>
                <input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={cn(
                    'h-11 w-full rounded-xl border px-4 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#173E75]/15 transition-all',
                    formErrors.phone ? 'border-amber-300 bg-amber-50/40' : 'border-[#E5EAF2] bg-white focus:border-[#173E75]'
                  )}
                  placeholder="Nhập số điện thoại"
                />
                {formErrors.phone && <p className="text-xs text-[#9A6A00]">{formErrors.phone}</p>}
              </div>

              <div className="space-y-1.5">
                <label htmlFor="email" className="text-sm font-medium text-[#0F172A]">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={cn(
                    'h-11 w-full rounded-xl border px-4 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#173E75]/15 transition-all',
                    formErrors.email ? 'border-amber-300 bg-amber-50/40' : 'border-[#E5EAF2] bg-white focus:border-[#173E75]'
                  )}
                  placeholder="Nhập email"
                />
                {formErrors.email && <p className="text-xs text-[#9A6A00]">{formErrors.email}</p>}
              </div>

              <div className="space-y-1.5">
                <label htmlFor="requestType" className="text-sm font-medium text-[#0F172A]">
                  Loại yêu cầu
                </label>
                <div className="relative">
                  <select
                    id="requestType"
                    name="requestType"
                    value={formData.requestType}
                    onChange={handleInputChange}
                    className={cn(
                      'h-11 w-full appearance-none rounded-xl border bg-white px-4 pr-10 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#173E75]/15 transition-all',
                      formErrors.requestType
                        ? 'border-amber-300 bg-amber-50/40'
                        : 'border-[#E5EAF2] focus:border-[#173E75]'
                    )}
                  >
                    <option value="">Chọn loại yêu cầu</option>
                    {requestTypeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={16}
                    className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                </div>
                {formErrors.requestType && <p className="text-xs text-[#9A6A00]">{formErrors.requestType}</p>}
              </div>

              <div className="space-y-1.5">
                <label htmlFor="referenceCode" className="text-sm font-medium text-[#0F172A]">
                  Mã đơn hàng / mã báo giá <span className="text-slate-400">(tuỳ chọn)</span>
                </label>
                <input
                  id="referenceCode"
                  name="referenceCode"
                  value={formData.referenceCode}
                  onChange={handleInputChange}
                  className="h-11 w-full rounded-xl border border-[#E5EAF2] bg-white px-4 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#173E75]/15 focus:border-[#173E75] transition-all"
                  placeholder="Ví dụ: SO-240126 hoặc Q-240523"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="message" className="text-sm font-medium text-[#0F172A]">
                  Nội dung cần hỗ trợ
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleInputChange}
                  className={cn(
                    'w-full resize-none rounded-xl border px-4 py-3 text-sm leading-6 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#173E75]/15 transition-all',
                    formErrors.message ? 'border-amber-300 bg-amber-50/40' : 'border-[#E5EAF2] bg-white focus:border-[#173E75]'
                  )}
                  placeholder="Mô tả chi tiết vấn đề, nhu cầu hoặc thông tin bạn cần MECSU hỗ trợ"
                />
                {formErrors.message && <p className="text-xs text-[#9A6A00]">{formErrors.message}</p>}
              </div>

              <button
                type="submit"
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#173E75] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#0F2F5C]"
              >
                <SendHorizonal size={16} />
                <span>Gửi yêu cầu</span>
              </button>

              <p className="text-xs leading-5 text-[#64748B]">
                Thời gian phản hồi dự kiến: trong vòng 24 giờ làm việc.
              </p>
            </form>
          </aside>
        </section>

        <section className="space-y-3">
          <div>
            <h2 className="text-lg font-bold text-[#0F172A] lg:text-xl">Chính sách hỗ trợ</h2>
            <p className="mt-1 text-sm leading-5 text-[#64748B]">
              Các thông tin quan trọng giúp doanh nghiệp dễ theo dõi quy trình mua hàng và hậu mãi.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
            {policyItems.map((policy) => {
              const Icon = policy.icon;

              return (
                <article
                  key={policy.id}
                  className="group rounded-[20px] border border-[#E5EAF2] bg-white p-4 shadow-[0_8px_24px_rgba(15,23,42,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_32px_rgba(15,23,42,0.08)]"
                >
                  <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#EAF2FB] text-[#173E75]">
                    <Icon size={18} />
                  </div>
                  <div className="space-y-2.5">
                    <h3 className="text-base font-semibold text-[#0F172A]">{policy.title}</h3>
                    <p className="text-sm leading-6 text-[#64748B]">{policy.description}</p>
                    <Link
                      to={policy.href}
                      className="inline-flex items-center gap-1 text-sm font-semibold text-[#173E75] transition-colors hover:text-[#0F2F5C]"
                    >
                      Xem chi tiết
                      <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-0.5" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {toast.show && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast((prev) => ({ ...prev, show: false }))}
          />
        )}
      </div>
    </AccountLayout>
  );
};

export default CustomerSupportPage;
