export type QuotationStatus = 'pending' | 'processing' | 'sent' | 'accepted' | 'expired';

// Đơn vị sản phẩm
export type ProductUnit = 'cái' | 'bộ' | 'hộp' | 'mét' | 'kg';

// Mức độ ưu tiên
export type Priority = 'normal' | 'urgent' | 'critical';

// Item trong yêu cầu báo giá
export interface QuotationRequestItem {
  id: string;
  productName: string;
  productCode: string;
  quantity: number;
  unit: ProductUnit;
  notes?: string;
}

// Payload gửi đi
export interface QuotationRequestPayload {
  requestName: string;
  desiredDeadline?: string;
  priority: Priority;
  items: QuotationRequestItem[];
  generalNotes?: string;
  attachments?: File[];
  contactInfo: {
    name: string;
    phone: string;
    email: string;
  };
}

export interface QuotationItem {
  id: string;
  image: string;
  name: string;
  sku: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  discount: number;
  vat: number;
  lineTotal: number;
}

export interface Quotation {
  id: string;
  code: string;
  status: QuotationStatus;
  requestDate: string;
  quotationDate: string;
  expiryDate: string;
  productCount: number;
  subtotal: number;
  discountTotal: number;
  vatTotal: number;
  shippingFee: number;
  total: number;
  items: QuotationItem[];
  salesRep: {
    name: string;
    role: string;
    avatar?: string;
    phone?: string;
    email?: string;
  };
  // Thêm trường cho yêu cầu báo giá mới
  requestName?: string;
  priority?: Priority;
  generalNotes?: string;
}

export const quotationStatusConfig: Record<
  QuotationStatus,
  { label: string; bg: string; color: string }
> = {
  pending: {
    label: 'Đang xử lý',
    bg: '#FFF7E6',
    color: '#D97706',
  },
  processing: {
    label: 'Chờ phản hồi',
    bg: '#EFF6FF',
    color: '#2563EB',
  },
  sent: {
    label: 'Đã gửi',
    bg: '#E0F2FE',
    color: '#0369A1',
  },
  accepted: {
    label: 'Đã chấp nhận',
    bg: '#ECFDF5',
    color: '#16A34A',
  },
  expired: {
    label: 'Hết hạn',
    bg: '#FEF2F2',
    color: '#DC2626',
  },
};

export const quotationTimelineSteps = [
  { id: 0, label: 'Yêu cầu báo giá', iconKey: 'clipboard-list' },
  { id: 1, label: 'Đang xử lý', iconKey: 'settings' },
  { id: 2, label: 'Đã gửi báo giá', iconKey: 'send' },
  { id: 3, label: 'Khách xác nhận', iconKey: 'user-check' },
  { id: 4, label: 'Tạo đơn hàng', iconKey: 'check-circle-2' },
] as const;

export const quotationStatusTimelineIndex: Record<QuotationStatus, number> = {
  pending: 0,
  processing: 1,
  sent: 2,
  accepted: 3,
  expired: 4,
};
