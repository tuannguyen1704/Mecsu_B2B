import React, { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleAlert,
  Clock3,
  Download,
  FileText,
  Mail,
  MessageCircle,
  Package,
  Phone,
  Printer,
  RotateCcw,
  Send,
  ShoppingBag,
  User,
  X,
} from 'lucide-react';
import { AccountLayout } from './components/AccountLayout';
import {
  Quotation,
  QuotationStatus,
  quotationStatusTimelineIndex,
  quotationTimelineSteps,
} from '../../types/quotation';
import { mockQuotations } from './quotationData';
import { cn } from '../../lib/utils';
import { Toast } from '../../components/ui/Toast';

const formatPrice = (price: number) => new Intl.NumberFormat('vi-VN').format(price);

const cardClass =
  'bg-white rounded-[20px] border border-[#E5EAF2] shadow-[0_8px_24px_rgba(15,23,42,0.04)]';

const statusStyles: Record<QuotationStatus, string> = {
  pending: 'bg-[#FFF7D6] text-[#9A6A00]',
  processing: 'bg-[#FFF7D6] text-[#9A6A00]',
  sent: 'bg-[#E8F1FB] text-[#163F78]',
  accepted: 'bg-[#DCFCE7] text-[#166534]',
  expired: 'bg-[#FEE2E2] text-[#991B1B]',
};

const statusLabels: Record<QuotationStatus, string> = {
  pending: 'Đang xử lý',
  processing: 'Đang xử lý',
  sent: 'Đã phản hồi',
  accepted: 'Đã chấp nhận',
  expired: 'Hết hạn',
};

type ToastState = {
  show: boolean;
  message: string;
  type: 'success' | 'error';
};

type StockBadge = {
  label: string;
  className: string;
};

function getStockBadge(index: number): StockBadge {
  const badges: StockBadge[] = [
    { label: 'Có hàng', className: 'bg-[#DCFCE7] text-[#166534]' },
    { label: 'Cần đặt hàng', className: 'bg-[#FFF7D6] text-[#9A6A00]' },
    { label: 'Hết hàng', className: 'bg-[#FEE2E2] text-[#991B1B]' },
  ];

  return badges[index % badges.length];
}

function getTimelineDates(quotation: Quotation) {
  return {
    0: `${quotation.requestDate} • 08:30`,
    1: `${quotation.requestDate} • 10:15`,
    2: quotation.quotationDate ? `${quotation.quotationDate} • 14:30` : '',
    3: quotation.status === 'accepted' ? `${quotation.quotationDate || quotation.requestDate} • 16:00` : '',
  } as Record<number, string>;
}

interface ActionButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent';
  onClick?: () => void;
  icon?: React.ReactNode;
  className?: string;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  children,
  variant = 'secondary',
  onClick,
  icon,
  className,
}) => {
  const variantClass =
    variant === 'primary'
      ? 'bg-[#163F78] hover:bg-[#1a4a8a] text-white border-transparent'
      : variant === 'accent'
        ? 'bg-[#FFC72C] hover:bg-[#f1bb24] text-[#1f2937] border-transparent'
        : 'bg-white border border-[#E5EAF2] text-[#163F78] hover:bg-[#F8FAFC]';

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors',
        variantClass,
        className,
      )}
    >
      {icon}
      <span>{children}</span>
    </button>
  );
};

interface ModalShellProps {
  title: string;
  description: string;
  onClose: () => void;
  children: React.ReactNode;
  footer: React.ReactNode;
}

const ModalShell: React.FC<ModalShellProps> = ({ title, description, onClose, children, footer }) => {
  return (
    <div className="fixed inset-0 z-[400] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
      <div className="relative z-[401] w-full max-w-xl rounded-[24px] bg-white shadow-[0_20px_50px_rgba(15,23,42,0.16)]">
        <div className="flex items-start justify-between gap-4 border-b border-[#E5EAF2] px-6 py-5">
          <div>
            <h3 className="text-xl font-bold text-slate-900">{title}</h3>
            <p className="mt-1 text-sm text-slate-500">{description}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
          >
            <X size={18} />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
        <div className="flex flex-col-reverse gap-3 border-t border-[#E5EAF2] px-6 py-5 sm:flex-row sm:justify-end">
          {footer}
        </div>
      </div>
    </div>
  );
};

export default function QuotationDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [quotation, setQuotation] = useState<Quotation>(
    () => mockQuotations.find((item) => item.id === id) || mockQuotations[0],
  );
  const [toast, setToast] = useState<ToastState>({ show: false, message: '', type: 'success' });
  const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);
  const [isRevisionModalOpen, setIsRevisionModalOpen] = useState(false);
  const [revisionNote, setRevisionNote] = useState('');

  const timelineDates = useMemo(() => getTimelineDates(quotation), [quotation]);
  const currentTimelineIndex = quotationStatusTimelineIndex[quotation.status];

  const infoItems = [
    { label: 'Mã báo giá', value: `#${quotation.code}` },
    { label: 'Ngày tạo', value: quotation.requestDate },
    { label: 'Ngày phản hồi', value: quotation.quotationDate || 'Đang cập nhật' },
    { label: 'Hiệu lực đến', value: quotation.expiryDate || 'Đang cập nhật' },
    { label: 'Người yêu cầu', value: quotation.requestName || 'Khách hàng MECsu' },
    { label: 'Trạng thái', value: statusLabels[quotation.status], isBadge: true },
  ];

  const handleDownloadPdf = () => {
    setToast({ show: true, message: `Đang chuẩn bị file PDF cho ${quotation.code}`, type: 'success' });
  };

  const handleAcceptQuotation = () => {
    const updatedQuotation = { ...quotation, status: 'accepted' as QuotationStatus };
    setQuotation(updatedQuotation);
    const target = mockQuotations.find((item) => item.id === quotation.id);
    if (target) target.status = 'accepted';
    setIsAcceptModalOpen(false);
    setToast({ show: true, message: 'Đã chấp nhận báo giá thành công', type: 'success' });
  };

  const handleSubmitRevision = () => {
    if (!revisionNote.trim()) {
      setToast({ show: true, message: 'Vui lòng nhập nội dung cần điều chỉnh', type: 'error' });
      return;
    }

    setIsRevisionModalOpen(false);
    setRevisionNote('');
    setToast({ show: true, message: 'Đã gửi yêu cầu điều chỉnh báo giá', type: 'success' });
  };

  const handleSupport = () => {
    setToast({ show: true, message: 'Đã mở kênh hỗ trợ cho báo giá này', type: 'success' });
  };

  const renderHeaderActions = () => {
    switch (quotation.status) {
      case 'sent':
        return (
          <>
            <ActionButton variant="secondary" onClick={handleDownloadPdf} icon={<Download size={16} />}>
              Tải PDF
            </ActionButton>
            <ActionButton
              variant="primary"
              onClick={() => setIsAcceptModalOpen(true)}
              icon={<CheckCircle2 size={16} />}
            >
              Chấp nhận báo giá
            </ActionButton>
          </>
        );
      case 'pending':
      case 'processing':
        return (
          <>
            <ActionButton variant="secondary" onClick={handleSupport} icon={<MessageCircle size={16} />}>
              Nhắn hỗ trợ
            </ActionButton>
            <ActionButton
              variant="secondary"
              onClick={() => setToast({ show: true, message: 'Đã ghi nhận yêu cầu hủy báo giá', type: 'success' })}
              icon={<CircleAlert size={16} />}
            >
              Hủy yêu cầu
            </ActionButton>
          </>
        );
      case 'expired':
        return (
          <>
            <ActionButton variant="secondary" onClick={() => setToast({ show: true, message: 'Đã gửi lại yêu cầu báo giá', type: 'success' })} icon={<RotateCcw size={16} />}>
              Gửi lại yêu cầu
            </ActionButton>
            <ActionButton variant="primary" onClick={() => navigate('/tai-khoan/bao-gia')} icon={<ShoppingBag size={16} />}>
              Tạo báo giá mới
            </ActionButton>
          </>
        );
      case 'accepted':
      default:
        return (
          <>
            <ActionButton variant="secondary" onClick={handleDownloadPdf} icon={<Download size={16} />}>
              Tải PDF
            </ActionButton>
            <ActionButton variant="primary" onClick={handleSupport} icon={<MessageCircle size={16} />}>
              Nhắn hỗ trợ
            </ActionButton>
          </>
        );
    }
  };

  const renderSideActions = () => {
    if (quotation.status === 'sent') {
      return (
        <div className="space-y-3 border-t border-[#E5EAF2] pt-5">
          <ActionButton
            variant="accent"
            className="w-full"
            onClick={() => setIsAcceptModalOpen(true)}
            icon={<CheckCircle2 size={16} />}
          >
            Chấp nhận báo giá
          </ActionButton>
          <ActionButton
            variant="secondary"
            className="w-full"
            onClick={handleDownloadPdf}
            icon={<Download size={16} />}
          >
            Tải PDF
          </ActionButton>
          <ActionButton
            variant="secondary"
            className="w-full"
            onClick={() => setIsRevisionModalOpen(true)}
            icon={<FileText size={16} />}
          >
            Gửi yêu cầu chỉnh sửa
          </ActionButton>
        </div>
      );
    }

    if (quotation.status === 'pending' || quotation.status === 'processing') {
      return (
        <div className="space-y-3 border-t border-[#E5EAF2] pt-5">
          <ActionButton
            variant="secondary"
            className="w-full"
            onClick={() => setToast({ show: true, message: 'Đã ghi nhận yêu cầu hủy báo giá', type: 'success' })}
            icon={<CircleAlert size={16} />}
          >
            Hủy yêu cầu
          </ActionButton>
          <ActionButton
            variant="primary"
            className="w-full"
            onClick={handleSupport}
            icon={<MessageCircle size={16} />}
          >
            Nhắn hỗ trợ
          </ActionButton>
        </div>
      );
    }

    if (quotation.status === 'expired') {
      return (
        <div className="space-y-3 border-t border-[#E5EAF2] pt-5">
          <ActionButton
            variant="secondary"
            className="w-full"
            onClick={() => setToast({ show: true, message: 'Đã gửi lại yêu cầu báo giá', type: 'success' })}
            icon={<RotateCcw size={16} />}
          >
            Gửi lại yêu cầu
          </ActionButton>
          <ActionButton
            variant="primary"
            className="w-full"
            onClick={() => navigate('/tai-khoan/bao-gia')}
            icon={<ShoppingBag size={16} />}
          >
            Tạo báo giá mới
          </ActionButton>
        </div>
      );
    }

    return (
      <div className="space-y-3 border-t border-[#E5EAF2] pt-5">
        <ActionButton variant="secondary" className="w-full" onClick={handleDownloadPdf} icon={<Printer size={16} />}>
          Tải PDF báo giá
        </ActionButton>
        <ActionButton variant="primary" className="w-full" onClick={handleSupport} icon={<MessageCircle size={16} />}>
          Nhắn hỗ trợ
        </ActionButton>
      </div>
    );
  };

  return (
    <AccountLayout>
      <div className="space-y-3 bg-[#F6F8FB] pb-4">
      <div className="flex flex-col gap-4 rounded-[20px] border border-[#E5EAF2] bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)] lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-3">
            <Link
              to="/tai-khoan/bao-gia"
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition-colors hover:text-[#163F78]"
            >
              <ArrowLeft size={16} />
              <span>Quay lại</span>
            </Link>

            <div>
              <h1 className="text-2xl font-bold text-slate-900 lg:text-3xl">Chi tiết báo giá</h1>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                <span className="font-semibold text-[#163F78]">#{quotation.code}</span>
                <span className="h-1 w-1 rounded-full bg-slate-300" />
                <span className="inline-flex items-center gap-1.5">
                  <Calendar size={14} />
                  Ngày tạo {quotation.requestDate}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-stretch gap-3 lg:items-end">
            <span
              className={cn(
                'inline-flex items-center justify-center rounded-xl px-3 py-2 text-sm font-semibold',
                statusStyles[quotation.status],
              )}
            >
              {statusLabels[quotation.status]}
            </span>
            <div className="flex flex-wrap gap-3">{renderHeaderActions()}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-4">
            <section className={cn(cardClass, 'p-5')}>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900">Thông tin báo giá</h2>
                <span className="text-xs font-medium uppercase tracking-[0.14em] text-[#3678ba]">Quotation overview</span>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {infoItems.map((item) => (
                  <div key={item.label} className="rounded-2xl border border-[#E5EAF2] bg-[#F8FAFC] px-4 py-3">
                    <p className="text-xs font-medium uppercase tracking-[0.08em] text-slate-400">{item.label}</p>
                    {item.isBadge ? (
                      <span
                        className={cn(
                          'mt-2 inline-flex rounded-lg px-3 py-1.5 text-sm font-semibold',
                          statusStyles[quotation.status],
                        )}
                      >
                        {item.value}
                      </span>
                    ) : (
                      <p className="mt-2 text-sm font-semibold text-slate-800">{item.value}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>

            <section className={cn(cardClass, 'overflow-hidden')}>
              <div className="border-b border-[#E5EAF2] px-6 py-5">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">Sản phẩm trong báo giá</h2>
                    <p className="mt-1 text-sm text-slate-500">Bảng giá chi tiết theo từng mã hàng và tình trạng cung ứng.</p>
                  </div>
                  <span className="inline-flex items-center gap-2 rounded-full bg-[#E8F1FB] px-3 py-1 text-sm font-semibold text-[#163F78]">
                    <Package size={14} />
                    {quotation.items.length} sản phẩm
                  </span>
                </div>
              </div>

              <div className="hidden overflow-x-auto lg:block">
                <table className="min-w-full border-separate border-spacing-0">
                  <thead>
                    <tr className="bg-[#F8FAFC] text-left text-xs uppercase tracking-[0.08em] text-slate-500">
                      <th className="px-6 py-4 font-semibold">Sản phẩm</th>
                      <th className="px-6 py-4 font-semibold">Mã hàng</th>
                      <th className="px-6 py-4 font-semibold text-right">Số lượng</th>
                      <th className="px-6 py-4 font-semibold">Đơn vị</th>
                      <th className="px-6 py-4 font-semibold text-right">Đơn giá</th>
                      <th className="px-6 py-4 font-semibold text-right">Thành tiền</th>
                      <th className="px-6 py-4 font-semibold">Trạng thái hàng</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quotation.items.map((item, index) => {
                      const stock = getStockBadge(index);
                      return (
                        <tr key={item.id} className="transition-colors hover:bg-[#F8FAFC]">
                          <td className="border-t border-[#E5EAF2] px-6 py-5 align-top">
                            <div className="flex items-start gap-3">
                              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F6F8FB] text-[#163F78]">
                                <Package size={20} />
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-slate-900">{item.name}</p>
                                <p className="mt-1 text-xs text-slate-500">Giải pháp phù hợp cho nhu cầu mua hàng B2B số lượng lớn.</p>
                              </div>
                            </div>
                          </td>
                          <td className="border-t border-[#E5EAF2] px-6 py-5 text-sm font-medium text-slate-700">{item.sku}</td>
                          <td className="border-t border-[#E5EAF2] px-6 py-5 text-right text-sm font-semibold text-slate-900">{item.quantity}</td>
                          <td className="border-t border-[#E5EAF2] px-6 py-5 text-sm text-slate-700">{item.unit}</td>
                          <td className="border-t border-[#E5EAF2] px-6 py-5 text-right text-sm font-medium text-slate-700">{formatPrice(item.unitPrice)}đ</td>
                          <td className="border-t border-[#E5EAF2] px-6 py-5 text-right text-sm font-bold text-[#163F78]">{formatPrice(item.lineTotal)}đ</td>
                          <td className="border-t border-[#E5EAF2] px-6 py-5">
                            <span className={cn('inline-flex rounded-lg px-3 py-1.5 text-xs font-semibold', stock.className)}>
                              {stock.label}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="space-y-4 p-4 lg:hidden">
                {quotation.items.map((item, index) => {
                  const stock = getStockBadge(index);
                  return (
                    <div key={item.id} className="rounded-2xl border border-[#E5EAF2] p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F6F8FB] text-[#163F78]">
                            <Package size={20} />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-900">{item.name}</p>
                            <p className="mt-1 text-xs text-slate-500">SKU: {item.sku}</p>
                          </div>
                        </div>
                        <span className={cn('inline-flex rounded-lg px-2.5 py-1 text-xs font-semibold', stock.className)}>
                          {stock.label}
                        </span>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-xs text-slate-400">Số lượng</p>
                          <p className="mt-1 font-semibold text-slate-800">{item.quantity}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-400">Đơn vị</p>
                          <p className="mt-1 font-semibold text-slate-800">{item.unit}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-400">Đơn giá</p>
                          <p className="mt-1 font-semibold text-slate-800">{formatPrice(item.unitPrice)}đ</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-400">Thành tiền</p>
                          <p className="mt-1 font-bold text-[#163F78]">{formatPrice(item.lineTotal)}đ</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-[#E5EAF2] bg-[#F8FAFC] px-6 py-5">
                <div className="ml-auto max-w-md space-y-3">
                  <div className="flex items-center justify-between text-sm text-slate-600">
                    <span>Tạm tính</span>
                    <span className="font-semibold text-slate-900">{formatPrice(quotation.subtotal)}đ</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-slate-600">
                    <span>VAT</span>
                    <span className="font-semibold text-slate-900">{formatPrice(quotation.vatTotal)}đ</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-slate-600">
                    <span>Phí vận chuyển</span>
                    <span className="font-semibold text-slate-900">{quotation.shippingFee > 0 ? `${formatPrice(quotation.shippingFee)}đ` : 'Miễn phí'}</span>
                  </div>
                  <div className="border-t border-[#D9E2EC] pt-3">
                    <div className="flex items-center justify-between">
                      <span className="text-base font-semibold text-slate-900">Tổng cộng</span>
                      <span className="text-2xl font-bold text-[#163F78]">{formatPrice(quotation.total)}đ</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className={cn(cardClass, 'p-6')}>
              <h2 className="text-lg font-bold text-slate-900">Ghi chú yêu cầu</h2>
              <div className="mt-4 rounded-2xl border border-dashed border-[#D9E2EC] bg-[#F8FAFC] p-5">
                <p className="text-sm leading-7 text-slate-600">
                  {quotation.generalNotes || 'Không có ghi chú.'}
                </p>
              </div>
            </section>
          </div>

          <div className="space-y-4">
            <section className={cn(cardClass, 'p-5')}>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900">Tiến trình báo giá</h2>
                <Clock3 size={18} className="text-[#3678ba]" />
              </div>

              <div className="mt-4 space-y-0">
                {quotationTimelineSteps.slice(0, 4).map((step, index) => {
                  const isCompleted = index <= currentTimelineIndex;
                  const isLast = index === 3;
                  const timelineLabel =
                    index === 0
                      ? 'Đã gửi yêu cầu'
                      : index === 1
                        ? 'MECsu đang xử lý'
                        : index === 2
                          ? 'Đã phản hồi báo giá'
                          : 'Khách hàng xác nhận';

                  return (
                    <div key={step.id} className="relative flex gap-4 pb-6 last:pb-0">
                      {!isLast && (
                        <div
                          className={cn(
                            'absolute left-[15px] top-8 h-[calc(100%-0.5rem)] w-0.5',
                            isCompleted ? 'bg-[#163F78]' : 'bg-[#CBD5E1]',
                          )}
                        />
                      )}
                      <div
                        className={cn(
                          'relative z-10 flex h-8 w-8 items-center justify-center rounded-full border text-xs font-bold',
                          isCompleted
                            ? 'border-[#163F78] bg-[#163F78] text-white'
                            : 'border-[#CBD5E1] bg-white text-slate-400',
                        )}
                      >
                        {isCompleted ? <Check size={14} /> : index + 1}
                      </div>
                      <div className="min-w-0 pt-0.5">
                        <p className={cn('text-sm font-semibold', isCompleted ? 'text-slate-900' : 'text-slate-400')}>
                          {timelineLabel}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {isCompleted && timelineDates[index]
                            ? timelineDates[index]
                            : 'Đang chờ cập nhật'}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className={cn(cardClass, 'p-6')}>
              <h2 className="text-lg font-bold text-slate-900">Nhân viên phụ trách</h2>
              <div className="mt-5 flex items-start gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#E8F1FB] text-[#163F78]">
                  <User size={24} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-base font-bold text-slate-900">{quotation.salesRep.name}</p>
                  <p className="mt-1 text-sm text-slate-500">{quotation.salesRep.role || 'Sales Executive'}</p>
                  <div className="mt-4 space-y-2 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <Phone size={15} className="text-[#3678ba]" />
                      <span>{quotation.salesRep.phone || '0912 345 678'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail size={15} className="text-[#3678ba]" />
                      <span>{quotation.salesRep.email || 'sales@mecsu.vn'}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <ActionButton variant="primary" onClick={() => window.open(`tel:${quotation.salesRep.phone || '0912345678'}`)} icon={<Phone size={16} />}>
                  Gọi ngay
                </ActionButton>
                <ActionButton variant="secondary" onClick={handleSupport} icon={<MessageCircle size={16} />}>
                  Nhắn hỗ trợ
                </ActionButton>
              </div>
            </section>

            <section className={cn(cardClass, 'p-6')}>
              <h2 className="text-lg font-bold text-slate-900">Thông tin thanh toán</h2>
              <div className="mt-5 space-y-4">
                <div className="rounded-2xl border border-[#E5EAF2] bg-[#F8FAFC] p-4">
                  <p className="text-xs font-medium uppercase tracking-[0.08em] text-slate-400">Hình thức thanh toán</p>
                  <p className="mt-1 text-sm font-semibold text-slate-800">{quotation.total > 15000000 ? 'Công nợ' : 'Chuyển khoản'}</p>
                </div>
                <div className="rounded-2xl border border-[#E5EAF2] bg-[#F8FAFC] p-4">
                  <p className="text-xs font-medium uppercase tracking-[0.08em] text-slate-400">Thời gian giao hàng dự kiến</p>
                  <p className="mt-1 text-sm font-semibold text-slate-800">3 - 5 ngày làm việc tại TP.HCM và khu vực lân cận</p>
                </div>
                <div className="rounded-2xl border border-[#E5EAF2] bg-[#F8FAFC] p-4">
                  <p className="text-xs font-medium uppercase tracking-[0.08em] text-slate-400">Điều kiện bảo hành</p>
                  <p className="mt-1 text-sm font-semibold text-slate-800">Bảo hành theo tiêu chuẩn nhà sản xuất và chính sách MECsu</p>
                </div>
                <div className="rounded-2xl border border-[#E5EAF2] bg-[#F8FAFC] p-4">
                  <p className="text-xs font-medium uppercase tracking-[0.08em] text-slate-400">Hiệu lực báo giá</p>
                  <p className="mt-1 text-sm font-semibold text-slate-800">Đến hết ngày {quotation.expiryDate || 'được cập nhật sau'}</p>
                </div>
              </div>

              {renderSideActions()}
            </section>
          </div>
        </div>

        {isAcceptModalOpen && (
          <ModalShell
            title="Xác nhận chấp nhận báo giá?"
            description="Sau khi xác nhận, MECsu sẽ tiến hành xử lý đơn hàng theo báo giá này."
            onClose={() => setIsAcceptModalOpen(false)}
            footer={
              <>
                <ActionButton variant="secondary" onClick={() => setIsAcceptModalOpen(false)}>
                  Hủy
                </ActionButton>
                <ActionButton variant="primary" onClick={handleAcceptQuotation}>
                  Xác nhận
                </ActionButton>
              </>
            }
          >
            <div className="rounded-2xl border border-[#E5EAF2] bg-[#F8FAFC] p-4">
              <p className="text-sm text-slate-600">
                Báo giá <span className="font-semibold text-slate-900">#{quotation.code}</span> sẽ được chuyển sang trạng thái đã chấp nhận.
              </p>
            </div>
          </ModalShell>
        )}

        {isRevisionModalOpen && (
          <ModalShell
            title="Gửi yêu cầu chỉnh sửa báo giá"
            description="Mô tả rõ nội dung cần điều chỉnh để MECsu cập nhật báo giá nhanh hơn."
            onClose={() => setIsRevisionModalOpen(false)}
            footer={
              <>
                <ActionButton variant="secondary" onClick={() => setIsRevisionModalOpen(false)}>
                  Hủy
                </ActionButton>
                <ActionButton variant="primary" onClick={handleSubmitRevision}>
                  Gửi yêu cầu
                </ActionButton>
              </>
            }
          >
            <div className="space-y-3">
              <label htmlFor="revision-note" className="text-sm font-semibold text-slate-800">
                Nội dung điều chỉnh
              </label>
              <textarea
                id="revision-note"
                value={revisionNote}
                onChange={(event) => setRevisionNote(event.target.value)}
                rows={5}
                placeholder="Ví dụ: vui lòng điều chỉnh số lượng, cập nhật đơn giá hoặc thời gian giao hàng."
                className="w-full rounded-2xl border border-[#D9E2EC] px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-[#3678ba] focus:ring-4 focus:ring-[#3678ba]/10"
              />
            </div>
          </ModalShell>
        )}

        {toast.show && <Toast message={toast.message} type={toast.type} onClose={() => setToast((prev) => ({ ...prev, show: false }))} />}
      </div>
    </AccountLayout>
  );
}
