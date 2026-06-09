import React, { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  CircleAlert,
  Clock3,
  Download,
  FileText,
  MessageCircle,
  Package,
  Printer,
  RotateCcw,
  ShoppingBag,
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
import { Product } from '../../types/types';

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
  processing: 'Chờ phản hồi',
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
    3: quotation.status === 'completed' ? `${quotation.quotationDate || quotation.requestDate} • 17:00` : '',
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

function toProduct(quotationItem: QuotationItem): Product {
  return {
    id: quotationItem.id,
    sku: quotationItem.sku,
    name: quotationItem.name,
    slug: quotationItem.sku.toLowerCase().replace(/\s+/g, '-'),
    category: 'Báo giá',
    categorySlug: 'bao-gia',
    brand: 'MECsu',
    price: quotationItem.unitPrice,
    tax: quotationItem.vat / quotationItem.lineTotal,
    stock: 9999,
    unit: quotationItem.unit,
    delivery: 'Sẵn hàng',
    image: 'https://placehold.co/200x200/f6f8fb/163F78?text=' + encodeURIComponent(quotationItem.name.slice(0, 10)),
    tags: ['bao-gia'],
  };
}

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

export default function QuotationDetailPage({ onAddToCart }: { onAddToCart?: (product: Product, quantity: number) => void }) {
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

  const handlePlaceOrder = () => {
    quotation.items.forEach((item) => {
      onAddToCart?.(toProduct(item), item.quantity);
    });
    navigate('/gio-hang');
  };

  const infoItems = [
    { label: 'Mã báo giá', value: `#${quotation.code}` },
    { label: 'Ngày tạo', value: quotation.requestDate },
    { label: 'Ngày phản hồi', value: quotation.quotationDate || 'Đang cập nhật' },
    { label: 'Hiệu lực đến', value: quotation.expiryDate || 'Đang cập nhật' },
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

  return (
    <AccountLayout>
      <div className="max-w-screen-xl mx-auto space-y-3 bg-[#F6F8FB] pb-4 px-0 xl:px-4">
      <div className="flex flex-col gap-4 rounded-[20px] border border-[#E5EAF2] bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-col gap-2">
            <Link
              to="/tai-khoan/bao-gia"
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition-colors hover:text-[#163F78]"
            >
              <ArrowLeft size={16} />
              <span>Quay lại</span>
            </Link>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-900 lg:text-3xl">Chi tiết báo giá</h1>
              <span
                className={cn(
                  'inline-flex items-center justify-center rounded-xl px-3 py-2 text-sm font-semibold',
                  statusStyles[quotation.status],
                )}
              >
                {statusLabels[quotation.status]}
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-3">{renderHeaderActions()}</div>
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_340px] xl:items-stretch">
          <section className={cn(cardClass, 'p-5 flex flex-col')}>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Thông tin báo giá</h2>
              <span className="text-xs font-medium uppercase tracking-[0.14em] text-[#3678ba]">Quotation overview</span>
            </div>

            <div className="mt-auto grid grid-cols-2 gap-3">
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

          <section className={cn(cardClass, 'p-5')}>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Tiến trình báo giá</h2>
              <Clock3 size={18} className="text-[#3678ba]" />
            </div>

            <div className="mt-4 space-y-0">
              {quotationTimelineSteps.map((step, index) => {
                const isCompleted = index <= currentTimelineIndex;
                const isLast = index === 3;
                return (
                  <div key={step} className="relative flex items-start gap-3">
                    {!isLast && (
                      <div
                        className={cn(
                          'absolute left-[15px] top-8 h-[calc(100%-32px)] w-[2px]',
                          isCompleted ? 'bg-[#163F78]' : 'bg-[#E5EAF2]',
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
                        {step.label}
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
        </div>

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

              <div className="hidden xl:block">
                <table className="min-w-full border-separate border-spacing-0">
                  <thead>
                    <tr className="bg-[#F8FAFC] text-left text-xs uppercase tracking-[0.08em] text-slate-500">
                      <th className="px-6 py-4 font-semibold">Mã hàng</th>
                      <th className="px-6 py-4 font-semibold">Sản phẩm</th>
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
                          <td className="border-t border-[#E5EAF2] px-6 py-5 text-sm font-medium text-slate-700">{item.sku}</td>
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
                            <p className="mt-1 text-xs text-slate-500">{item.sku}</p>
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
                {/* Row 1: Ghi chú yêu cầu (left) + Tổng cộng (right) */}
                <div className="flex flex-col gap-5 sm:flex-row-reverse sm:items-start sm:justify-between mb-4">
                  {/* Tổng cộng */}
                  <div className="sm:w-1/2">
                    <div className="flex items-center justify-between gap-4 mb-1">
                      <span className="text-base font-semibold text-slate-900">Tổng cộng</span>
                      <span className="text-2xl font-bold text-[#163F78]">{formatPrice(quotation.total)}đ</span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-sm text-slate-600">
                        <span>Tạm tính</span>
                        <span className="font-medium text-slate-900">{formatPrice(quotation.subtotal)}đ</span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-slate-600">
                        <span>VAT</span>
                        <span className="font-medium text-slate-900">{formatPrice(quotation.vatTotal)}đ</span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-slate-600">
                        <span>Phí vận chuyển</span>
                        <span className="font-medium text-slate-900">{quotation.shippingFee > 0 ? `${formatPrice(quotation.shippingFee)}đ` : 'Miễn phí'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Ghi chú yêu cầu */}
                  <div className="flex-1">
                    <p className="text-xs font-medium uppercase tracking-[0.08em] text-slate-400 mb-2">Ghi chú yêu cầu</p>
                    <textarea
                      className="w-full resize-none rounded-xl border border-[#D9E2EC] bg-white px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-[#163F78] focus:outline-none focus:ring-2 focus:ring-[#163F78]/20"
                      rows={3}
                      placeholder="Nhập ghi chú yêu cầu của bạn..."
                      defaultValue={quotation.generalNotes || ''}
                    />
                  </div>
                </div>

                {/* Row 2: Buttons */}
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  {quotation.status === 'sent' && (
                    <>
                      <ActionButton variant="accent" onClick={handlePlaceOrder} icon={<CheckCircle2 size={16} />}>
                        Đặt đơn hàng
                      </ActionButton>
                      <ActionButton variant="secondary" onClick={handleDownloadPdf} icon={<Download size={16} />}>
                        Tải PDF
                      </ActionButton>
                    </>
                  )}
                  {quotation.status === 'expired' ? (
                    <ActionButton variant="secondary" onClick={() => setToast({ show: true, message: 'Báo giá đã hết hạn. Vui lòng liên hệ MECsu để được tạo báo giá mới.', type: 'info' })} icon={<CircleAlert size={16} />}>
                      Báo giá hết hạn
                    </ActionButton>
                  ) : null}
                </div>
              </div>
            </section>
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
