/**
 * Checkout form types
 */
export type ShippingMethod = 'standard' | 'fast' | 'pickup';
export type PaymentMethod = 'bank' | 'cod' | 'quotation' | 'netterms';
export type CustomerType = 'personal' | 'business';

export interface CheckoutFormData {
  // Customer info
  fullName: string;
  phone: string;
  email: string;
  companyName: string;
  taxCode: string;

  // VAT Invoice
  needVatInvoice: boolean;
  vatCompanyName: string;
  vatTaxCode: string;
  vatAddress: string;
  vatEmail: string;

  // Shipping address
  province: string;
  district: string;
  ward: string;
  address: string;
  deliveryNote: string;

  // Shipping & Payment
  shippingMethod: ShippingMethod;
  paymentMethod: PaymentMethod;

  // B2B fields
  poNumber: string;
  internalCode: string;
  purchaseNote: string;
  purchaseOrderFile: File | null;
}

export interface CheckoutFormErrors {
  fullName?: string;
  phone?: string;
  email?: string;
  companyName?: string;
  taxCode?: string;
  address?: string;
  vatCompanyName?: string;
  vatTaxCode?: string;
}

export interface CheckoutTotals {
  subtotal: number;
  shippingFee: number;
  vatAmount: number;
  b2bDiscount: number;
  grandTotal: number;
}

export const SHIPPING_METHODS = {
  standard: {
    id: 'standard' as ShippingMethod,
    name: 'Giao tiêu chuẩn',
    description: '2-5 ngày làm việc',
    fee: 35000,
    freeThreshold: 1000000,
  },
  fast: {
    id: 'fast' as ShippingMethod,
    name: 'Giao nhanh',
    description: 'Giao trong ngày',
    fee: 45000,
    freeThreshold: 0,
  },
  pickup: {
    id: 'pickup' as ShippingMethod,
    name: 'Nhận tại kho',
    description: 'TP. Hồ Chí Minh',
    fee: 0,
    freeThreshold: 0,
  },
} as const;

export const PAYMENT_METHODS = {
  bank: {
    id: 'bank' as PaymentMethod,
    name: 'Chuyển khoản ngân hàng',
    description: 'Chuyển khoản trước qua STK được gửi sau khi đặt hàng',
  },
  cod: {
    id: 'cod' as PaymentMethod,
    name: 'Thanh toán khi nhận hàng (COD)',
    description: 'Trả tiền mặt cho shipper khi nhận hàng',
  },
  quotation: {
    id: 'quotation' as PaymentMethod,
    name: 'Yêu cầu báo giá chính thức',
    description: 'Nhận báo giá PDF qua email để duyệt mua',
    badge: 'B2B',
  },
  netterms: {
    id: 'netterms' as PaymentMethod,
    name: 'Net terms (Mua chịu)',
    description: 'Thanh toán cuối tháng theo hạn mức công ty',
    badge: 'VIP',
    helperText: 'Dành cho khách hàng doanh nghiệp đã được phê duyệt.',
  },
} as const;

export const CHECKOUT_STEPS = [
  { num: 0, label: 'Giỏ hàng', status: 'completed' },
  { num: 1, label: 'Thông tin', status: 'active' },
  { num: 2, label: 'Thanh toán', status: 'pending' },
  { num: 3, label: 'Xác nhận', status: 'pending' },
] as const;
