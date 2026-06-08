import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Check, ImagePlus, Star, UploadCloud, X } from 'lucide-react';
import { AccountLayout } from './components/AccountLayout';
import { Toast } from '../../components/ui/Toast';
import { cn } from '../../lib/utils';

type RatingValue = 0 | 1 | 2 | 3 | 4 | 5;
type RatingMap = Record<string, RatingValue>;
type ValidationSection = 'shopping' | 'quotation' | 'support' | 'b2b' | 'nps';

interface RatingQuestion {
  key: string;
  label: string;
}

interface SurveySectionConfig {
  key: Exclude<ValidationSection, 'nps'>;
  title: string;
  subtitle: string;
  helper?: string;
  questions: RatingQuestion[];
}

const pageTheme = {
  navy: '#173E75',
  navyHover: '#0F2F5C',
  yellow: '#F6C343',
  background: '#F5F8FC',
  card: '#FFFFFF',
  border: '#E3EAF3',
  textPrimary: '#0F172A',
  textSecondary: '#64748B',
};

const shoppingQuestions: RatingQuestion[] = [
  { key: 'productPrice', label: 'Giá sản phẩm và chương trình ưu đãi' },
  { key: 'productInfo', label: 'Độ rõ ràng của thông tin sản phẩm' },
  { key: 'websiteOrdering', label: 'Thao tác đặt hàng trên website' },
  { key: 'checkout', label: 'Quy trình thanh toán' },
  { key: 'productQuality', label: 'Chất lượng sản phẩm khi nhận hàng' },
  { key: 'deliverySpeed', label: 'Tốc độ giao hàng' },
];

const quotationQuestions: RatingQuestion[] = [
  { key: 'responseSpeed', label: 'Tốc độ phản hồi báo giá' },
  { key: 'quotationAccuracy', label: 'Độ chính xác của thông tin báo giá' },
  { key: 'quotationClarity', label: 'Mức độ rõ ràng của giá và điều kiện mua hàng' },
  { key: 'alternativeSupport', label: 'Khả năng hỗ trợ sản phẩm thay thế' },
  { key: 'quotationManagement', label: 'Sự thuận tiện khi xem và quản lý báo giá' },
];

const supportQuestions: RatingQuestion[] = [
  { key: 'attitude', label: 'Thái độ tư vấn' },
  { key: 'expertise', label: 'Kiến thức chuyên môn về sản phẩm' },
  { key: 'supportSpeed', label: 'Tốc độ phản hồi khi cần hỗ trợ' },
  { key: 'problemSolving', label: 'Khả năng giải quyết vấn đề' },
  { key: 'proactiveUpdates', label: 'Sự chủ động trong việc cập nhật thông tin' },
];

const b2bQuestions: RatingQuestion[] = [
  { key: 'bulkSupply', label: 'Khả năng cung ứng hàng hóa số lượng lớn' },
  { key: 'orderAccuracy', label: 'Độ chính xác của đơn hàng' },
  { key: 'businessFlexibility', label: 'Sự linh hoạt trong xử lý yêu cầu doanh nghiệp' },
  { key: 'documentSupport', label: 'Hỗ trợ chứng từ, hóa đơn và thông tin thanh toán' },
  { key: 'afterSalesCare', label: 'Chất lượng chăm sóc sau bán hàng' },
];

const surveySections: SurveySectionConfig[] = [
  {
    key: 'shopping',
    title: 'Đánh giá trải nghiệm mua hàng',
    subtitle: 'Vui lòng đánh giá từ 1 đến 5 sao cho từng tiêu chí bên dưới.',
    helper: '1 = Rất không hài lòng · 5 = Rất hài lòng',
    questions: shoppingQuestions,
  },
  {
    key: 'quotation',
    title: 'Đánh giá dịch vụ báo giá',
    subtitle: 'Đánh giá trải nghiệm nhận báo giá và làm việc với MECSU.',
    questions: quotationQuestions,
  },
  {
    key: 'support',
    title: 'Đánh giá đội ngũ hỗ trợ',
    subtitle: 'Đánh giá chất lượng tư vấn và hỗ trợ trong quá trình mua hàng.',
    questions: supportQuestions,
  },
  {
    key: 'b2b',
    title: 'Đánh giá dịch vụ dành cho doanh nghiệp',
    subtitle: 'Các tiêu chí dành riêng cho khách hàng doanh nghiệp và đối tác mua hàng thường xuyên.',
    questions: b2bQuestions,
  },
];

const improvementOptions = [
  'Theo dõi đơn hàng realtime',
  'Tải báo giá PDF',
  'So sánh sản phẩm',
  'Danh sách sản phẩm yêu thích',
  'Đặt hàng nhanh bằng file Excel',
  'Quản lý nhiều địa chỉ giao hàng',
  'Cải thiện tốc độ phản hồi báo giá',
  'Giao hàng nhanh hơn',
  'Hỗ trợ kỹ thuật chuyên sâu hơn',
  'Thêm nhiều phương thức thanh toán',
];

const emptyRatings = (questions: RatingQuestion[]): RatingMap =>
  questions.reduce<RatingMap>((acc, question) => {
    acc[question.key] = 0;
    return acc;
  }, {});

const sectionBaseClass =
  'rounded-[22px] border p-6 shadow-[0_12px_28px_rgba(15,23,42,0.05)] transition-colors duration-200';

const MarketingEmailSettingsPage: React.FC = () => {
  const [shoppingRatings, setShoppingRatings] = useState<RatingMap>(() => emptyRatings(shoppingQuestions));
  const [quotationRatings, setQuotationRatings] = useState<RatingMap>(() => emptyRatings(quotationQuestions));
  const [supportRatings, setSupportRatings] = useState<RatingMap>(() => emptyRatings(supportQuestions));
  const [b2bRatings, setB2bRatings] = useState<RatingMap>(() => emptyRatings(b2bQuestions));
  const [ratingHover, setRatingHover] = useState<Record<string, number>>({});
  const [improvementSelections, setImprovementSelections] = useState<string[]>([]);
  const [npsScore, setNpsScore] = useState<number | null>(null);
  const [additionalFeedback, setAdditionalFeedback] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Partial<Record<ValidationSection, string>>>({});
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' as 'success' | 'error' });
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const shoppingRef = useRef<HTMLElement | null>(null);
  const quotationRef = useRef<HTMLElement | null>(null);
  const supportRef = useRef<HTMLElement | null>(null);
  const b2bRef = useRef<HTMLElement | null>(null);
  const npsRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!selectedImage) {
      setImagePreview(null);
      return;
    }

    const nextPreview = URL.createObjectURL(selectedImage);
    setImagePreview(nextPreview);

    return () => {
      URL.revokeObjectURL(nextPreview);
    };
  }, [selectedImage]);

  const sectionRefs: Record<ValidationSection, React.RefObject<HTMLElement | null>> = {
    shopping: shoppingRef,
    quotation: quotationRef,
    support: supportRef,
    b2b: b2bRef,
    nps: npsRef,
  };

  const ratingStateMap: Record<Exclude<ValidationSection, 'nps'>, RatingMap> = {
    shopping: shoppingRatings,
    quotation: quotationRatings,
    support: supportRatings,
    b2b: b2bRatings,
  };

  const hasChanges = useMemo(
    () =>
      Object.values(shoppingRatings).some(Boolean) ||
      Object.values(quotationRatings).some(Boolean) ||
      Object.values(supportRatings).some(Boolean) ||
      Object.values(b2bRatings).some(Boolean) ||
      improvementSelections.length > 0 ||
      npsScore !== null ||
      additionalFeedback.trim().length > 0 ||
      !!selectedImage,
    [shoppingRatings, quotationRatings, supportRatings, b2bRatings, improvementSelections, npsScore, additionalFeedback, selectedImage]
  );

  const resetForm = () => {
    setShoppingRatings(emptyRatings(shoppingQuestions));
    setQuotationRatings(emptyRatings(quotationQuestions));
    setSupportRatings(emptyRatings(supportQuestions));
    setB2bRatings(emptyRatings(b2bQuestions));
    setRatingHover({});
    setImprovementSelections([]);
    setNpsScore(null);
    setAdditionalFeedback('');
    setSelectedImage(null);
    setValidationErrors({});
  };

  const updateRating = (
    section: Exclude<ValidationSection, 'nps'>,
    questionKey: string,
    value: RatingValue
  ) => {
    const setterMap = {
      shopping: setShoppingRatings,
      quotation: setQuotationRatings,
      support: setSupportRatings,
      b2b: setB2bRatings,
    };

    setterMap[section]((prev) => ({ ...prev, [questionKey]: value }));
    setValidationErrors((prev) => ({ ...prev, [section]: undefined }));
  };

  const toggleImprovement = (option: string) => {
    setImprovementSelections((prev) =>
      prev.includes(option) ? prev.filter((item) => item !== option) : [...prev, option]
    );
  };

  const validateSections = () => {
    const nextErrors: Partial<Record<ValidationSection, string>> = {};
    const orderedSections: ValidationSection[] = ['shopping', 'quotation', 'support', 'b2b', 'nps'];

    for (const section of orderedSections) {
      if (section === 'nps') {
        if (npsScore === null) {
          nextErrors.nps = 'Vui lòng hoàn tất phần đánh giá này.';
        }
        continue;
      }

      const hasMissing = Object.values(ratingStateMap[section]).some((value) => value === 0);
      if (hasMissing) {
        nextErrors[section] = 'Vui lòng hoàn tất phần đánh giá này.';
      }
    }

    setValidationErrors(nextErrors);

    const firstErrorSection = orderedSections.find((section) => nextErrors[section]);
    if (firstErrorSection) {
      sectionRefs[firstErrorSection].current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return false;
    }

    return true;
  };

  const handleSubmit = () => {
    if (!validateSections()) return;

    setToast({
      show: true,
      message: 'Cảm ơn Quý khách đã gửi đánh giá. MECSU sẽ tiếp nhận và cải thiện dịch vụ tốt hơn.',
      type: 'success',
    });
    resetForm();
  };

  const handleSelectImage = (file: File | undefined) => {
    if (!file) return;
    setSelectedImage(file);
  };

  const renderRatingRow = (
    sectionKey: Exclude<ValidationSection, 'nps'>,
    question: RatingQuestion,
    value: RatingValue
  ) => {
    const hoverKey = `${sectionKey}-${question.key}`;
    const activeLevel = ratingHover[hoverKey] || value;

    return (
      <div
        key={question.key}
        className="mb-3 rounded-2xl border border-[#EEF2F7] bg-[#F8FAFC] p-4 last:mb-0"
      >
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-6">
          <p className="text-sm font-medium leading-6 md:w-[60%]" style={{ color: pageTheme.textPrimary }}>
            {question.label}
          </p>
          <div className="flex items-center gap-1 md:w-[40%] md:justify-end">
            {Array.from({ length: 5 }, (_, index) => {
              const starValue = (index + 1) as RatingValue;
              const active = starValue <= activeLevel;

              return (
                <button
                  key={starValue}
                  type="button"
                  onMouseEnter={() => setRatingHover((prev) => ({ ...prev, [hoverKey]: starValue }))}
                  onMouseLeave={() => setRatingHover((prev) => ({ ...prev, [hoverKey]: 0 }))}
                  onClick={() => updateRating(sectionKey, question.key, starValue)}
                  className="rounded-full p-1 transition-transform duration-150 hover:-translate-y-0.5"
                  aria-label={`${question.label} - ${starValue} sao`}
                >
                  <Star
                    size={26}
                    className={cn(
                      'transition-colors duration-150',
                      active ? 'fill-[#F6C343] text-[#F6C343]' : 'text-[#CBD5E1]'
                    )}
                  />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderSurveySection = (section: SurveySectionConfig, ref: React.RefObject<HTMLElement | null>) => {
    const hasError = !!validationErrors[section.key];
    const currentRatings = ratingStateMap[section.key];

    return (
      <section
        key={section.key}
        ref={ref}
        className={sectionBaseClass}
        style={{
          background: pageTheme.card,
          borderColor: hasError ? pageTheme.yellow : pageTheme.border,
        }}
      >
        <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
          <div>
            <h2 className="text-xl font-bold" style={{ color: pageTheme.textPrimary }}>
              {section.title}
            </h2>
            <p className="mt-1 text-sm leading-6" style={{ color: pageTheme.textSecondary }}>
              {section.subtitle}
            </p>
          </div>
          {section.helper && (
            <p className="text-xs font-medium md:pt-1" style={{ color: pageTheme.textSecondary }}>
              {section.helper}
            </p>
          )}
        </div>

        <div className="mt-5">
          {section.questions.map((question) => renderRatingRow(section.key, question, currentRatings[question.key]))}
        </div>

        {hasError && (
          <p className="mt-4 text-sm font-medium" style={{ color: '#A16207' }}>
            {validationErrors[section.key]}
          </p>
        )}
      </section>
    );
  };

  return (
    <AccountLayout>
      <div className="mx-auto w-full max-w-[1120px] space-y-3 px-0 lg:px-0" style={{ background: pageTheme.background }}>
        <section
          className="rounded-[20px] px-[18px] py-[18px] text-white shadow-[0_16px_40px_rgba(23,62,117,0.18)] md:px-6 md:py-6"
          style={{ background: 'linear-gradient(135deg, #173E75 0%, #245A9C 100%)' }}
        >
          <div className="max-w-3xl">
            <div
              className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold tracking-[0.08em]"
              style={{
                background: 'rgba(255,255,255,0.14)',
                borderColor: 'rgba(255,255,255,0.22)',
              }}
            >
              Khảo sát trải nghiệm
            </div>
            <h1 className="mt-4 text-[24px] font-bold leading-[1.2] md:text-[28px]">Góp ý & Đánh giá</h1>
            <p className="mt-2 text-sm leading-7 text-white/85 md:text-[15px]">
              Ý kiến của Quý khách giúp MECSU cải thiện chất lượng sản phẩm, báo giá, giao hàng và dịch vụ hỗ trợ tốt hơn mỗi ngày.
            </p>
            <p className="mt-3 text-sm font-medium text-white/80">Thời gian hoàn thành khoảng 2 phút.</p>
          </div>
        </section>

        {renderSurveySection(surveySections[0], shoppingRef)}
        {renderSurveySection(surveySections[1], quotationRef)}
        {renderSurveySection(surveySections[2], supportRef)}
        {renderSurveySection(surveySections[3], b2bRef)}

        <section
          className={sectionBaseClass}
          style={{ background: pageTheme.card, borderColor: pageTheme.border }}
        >
          <h2 className="text-xl font-bold" style={{ color: pageTheme.textPrimary }}>
            MECSU nên cải thiện điều gì?
          </h2>
          <p className="mt-1 text-sm leading-6" style={{ color: pageTheme.textSecondary }}>
            Chọn một hoặc nhiều nội dung mà Quý khách quan tâm.
          </p>

          <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
            {improvementOptions.map((option) => {
              const selected = improvementSelections.includes(option);
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => toggleImprovement(option)}
                  className={cn(
                    'flex items-center gap-3 rounded-2xl border px-4 py-4 text-left transition-colors duration-150',
                    selected ? 'border-[#173E75] bg-[#F0F6FF]' : 'border-[#E3EAF3] bg-[#F8FAFC]'
                  )}
                >
                  <span
                    className={cn(
                      'flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md border transition-colors duration-150',
                      selected ? 'border-[#173E75] bg-[#173E75]/10 text-[#173E75]' : 'border-[#CBD5E1] text-transparent'
                    )}
                  >
                    <Check size={14} />
                  </span>
                  <span
                    className={cn('text-sm leading-6', selected ? 'font-semibold text-[#0F172A]' : 'font-medium text-[#0F172A]')}
                  >
                    {option}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <section
          ref={npsRef}
          className={sectionBaseClass}
          style={{
            background: pageTheme.card,
            borderColor: validationErrors.nps ? pageTheme.yellow : pageTheme.border,
          }}
        >
          <h2 className="text-xl font-bold" style={{ color: pageTheme.textPrimary }}>
            Khả năng Quý khách giới thiệu MECSU
          </h2>
          <p className="mt-1 text-sm leading-6" style={{ color: pageTheme.textSecondary }}>
            Trên thang điểm từ 0 đến 10, Quý khách có sẵn sàng giới thiệu MECSU cho đồng nghiệp hoặc doanh nghiệp khác không?
          </p>

          <div className="mt-5 flex flex-wrap gap-2.5">
            {Array.from({ length: 11 }, (_, index) => {
              const selected = npsScore === index;
              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => {
                    setNpsScore(index);
                    setValidationErrors((prev) => ({ ...prev, nps: undefined }));
                  }}
                  className={cn(
                    'h-11 w-11 rounded-xl border text-sm font-semibold transition-colors duration-150',
                    selected
                      ? 'border-[#173E75] bg-[#173E75] text-white'
                      : 'border-[#CBD5E1] bg-white text-[#334155] hover:border-[#173E75] hover:bg-[#F0F6FF]'
                  )}
                >
                  {index}
                </button>
              );
            })}
          </div>

          <div className="mt-4 flex items-center justify-between gap-4 text-xs sm:text-sm" style={{ color: pageTheme.textSecondary }}>
            <span>Không sẵn sàng</span>
            <span>Rất sẵn sàng</span>
          </div>

          {validationErrors.nps && (
            <p className="mt-4 text-sm font-medium" style={{ color: '#A16207' }}>
              {validationErrors.nps}
            </p>
          )}
        </section>

        <section
          className={sectionBaseClass}
          style={{ background: pageTheme.card, borderColor: pageTheme.border }}
        >
          <h2 className="text-xl font-bold" style={{ color: pageTheme.textPrimary }}>
            Ý kiến đóng góp thêm
          </h2>
          <p className="mt-1 text-sm leading-6" style={{ color: pageTheme.textSecondary }}>
            Quý khách có thể chia sẻ thêm góp ý, vấn đề gặp phải hoặc đề xuất để MECSU cải thiện tốt hơn.
          </p>

          <div className="relative mt-5">
            <textarea
              value={additionalFeedback}
              maxLength={1000}
              onChange={(e) => setAdditionalFeedback(e.target.value)}
              placeholder="Nhập nội dung góp ý của Quý khách…"
              className="min-h-[160px] w-full rounded-2xl border px-4 py-4 pb-10 text-sm text-slate-700 transition-colors focus:outline-none focus:ring-4 focus:ring-[#DCE8F8]"
              style={{ borderColor: '#CBD5E1' }}
            />
            <span className="absolute bottom-4 right-4 text-xs" style={{ color: pageTheme.textSecondary }}>
              {additionalFeedback.length}/1000
            </span>
          </div>
        </section>

        <section
          className={sectionBaseClass}
          style={{ background: pageTheme.card, borderColor: pageTheme.border }}
        >
          <h2 className="text-xl font-bold" style={{ color: pageTheme.textPrimary }}>
            Đính kèm hình ảnh
          </h2>
          <p className="mt-1 text-sm leading-6" style={{ color: pageTheme.textSecondary }}>
            Có thể gửi ảnh lỗi giao diện, ảnh sản phẩm hoặc tài liệu liên quan nếu cần.
          </p>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="mt-5 w-full rounded-[18px] border border-dashed bg-[#F8FAFC] px-6 py-7 text-center transition-colors duration-150 hover:border-[#173E75] hover:bg-[#F0F6FF]"
            style={{ borderColor: '#CBD5E1' }}
          >
            <div className="flex flex-col items-center justify-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm text-[#173E75]">
                <UploadCloud size={24} />
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: pageTheme.textPrimary }}>
                  Kéo thả hình ảnh vào đây hoặc bấm để tải lên
                </p>
                <p className="mt-1 text-xs" style={{ color: pageTheme.textSecondary }}>
                  PNG, JPG, WEBP · Tối đa 5MB
                </p>
              </div>
            </div>
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/webp"
            className="hidden"
            onChange={(e) => handleSelectImage(e.target.files?.[0])}
          />

          {selectedImage && imagePreview && (
            <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-[#E3EAF3] bg-[#FCFDFE] p-4 sm:flex-row sm:items-center">
              <img src={imagePreview} alt={selectedImage.name} className="h-20 w-20 rounded-2xl object-cover" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold" style={{ color: pageTheme.textPrimary }}>
                  {selectedImage.name}
                </p>
                <p className="mt-1 text-xs" style={{ color: pageTheme.textSecondary }}>
                  {(selectedImage.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <div className="flex items-center gap-2 self-start sm:self-center">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F0F6FF] text-[#173E75]">
                  <ImagePlus size={18} />
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedImage(null)}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#E3EAF3] bg-white text-slate-500 transition-colors hover:border-[#173E75] hover:text-[#173E75]"
                  aria-label="Xóa hình ảnh"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
          )}
        </section>

        <section
          className="mt-6 rounded-[18px] border bg-white px-4 py-4 shadow-[0_12px_28px_rgba(15,23,42,0.06)] md:px-5"
          style={{ borderColor: pageTheme.border }}
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold" style={{ color: pageTheme.textPrimary }}>
                Vui lòng hoàn tất các câu hỏi bắt buộc trước khi gửi.
              </p>
              <p className="mt-1 text-xs leading-5" style={{ color: pageTheme.textSecondary }}>
                Đánh giá của Quý khách sẽ được bảo mật và chỉ dùng để cải thiện dịch vụ.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row md:flex-shrink-0">
              <button
                type="button"
                onClick={resetForm}
                disabled={!hasChanges}
                className="h-11 rounded-xl border border-[#CBD5E1] bg-white px-5 text-sm font-medium text-[#334155] transition-colors duration-150 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="h-11 rounded-xl bg-[#173E75] px-6 text-sm font-semibold text-white transition-colors duration-150 hover:bg-[#0F2F5C]"
              >
                Gửi đánh giá
              </button>
            </div>
          </div>
        </section>
      </div>

      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast((prev) => ({ ...prev, show: false }))}
        />
      )}
    </AccountLayout>
  );
};

export default MarketingEmailSettingsPage;
