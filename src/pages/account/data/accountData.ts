import { LucideIcon } from 'lucide-react';
import { Package, CheckCircle, Heart, FileText, Truck, Receipt, Phone, Search } from 'lucide-react';

// Account Dashboard Stats
export interface AccountStats {
  openOrders: number;
  completedOrders: number;
  wishlistItems: number;
  quotes: number;
}

export const accountStats: AccountStats = {
  openOrders: 3,
  completedOrders: 47,
  wishlistItems: 12,
  quotes: 2,
};

// Quick Actions
export interface QuickAction {
  id: string;
  label: string;
  subtitle?: string;
  icon: LucideIcon;
  href: string;
  variant: 'primary' | 'secondary';
}

export const quickActions: QuickAction[] = [
  {
    id: 'track-order',
    label: 'Theo dõi đơn hàng',
    subtitle: 'Kiểm tra tình trạng giao hàng',
    icon: Truck,
    href: '/tai-khoan/don-hang',
    variant: 'primary',
  },
  {
    id: 'request-quote',
    label: 'Yêu cầu báo giá',
    subtitle: 'Nhận báo giá cho sản phẩm',
    icon: FileText,
    href: '/tai-khoan/bao-gia',
    variant: 'secondary',
  },
  {
    id: 'download-invoice',
    label: 'Tải hóa đơn VAT',
    subtitle: 'Xuất hóa đơn điện tử',
    icon: Receipt,
    href: '/tai-khoan/don-hang',
    variant: 'secondary',
  },
  {
    id: 'contact-support',
    label: 'Liên hệ hỗ trợ',
    subtitle: 'Chat hoặc gửi ticket',
    icon: Phone,
    href: '/tai-khoan/ho-tro',
    variant: 'secondary',
  },
];

// Quick Reorder Products
export interface QuickReorderProduct {
  id: string;
  name: string;
  sku: string;
  price: number;
  image: string;
  stock: number;
}

export const quickReorderProducts: QuickReorderProduct[] = [
  {
    id: 'qr-001',
    name: 'Phe Gài Trục Thép 65Mn DIN471 D3x0.4 (50Cái/Bịch)',
    sku: 'B01M1001035TH00',
    price: 259200,
    image: '/assets/Phe Gài Trục Thép 65Mn DIN471 D3x0.4 (50Cái_Bịch).png',
    stock: 863,
  },
  {
    id: 'qr-002',
    name: 'Bulong Inox 304 DIN933 M3x20',
    sku: 'B01M1001035TH01',
    price: 34920,
    image: '/assets/Bulong Inox 304 DIN933 M3x20.jpg',
    stock: 2469,
  },
  {
    id: 'qr-003',
    name: 'Đai Ốc Inox 304 DIN934 M6',
    sku: 'B01M1001035TH02',
    price: 15600,
    image: '/assets/Dai Oc Inox 304 DIN934 M6.jpg',
    stock: 1500,
  },
  {
    id: 'qr-004',
    name: 'Gioăng Cao Su Chịu Nhiệt 10x15x2mm',
    sku: 'B01M1001035TH03',
    price: 10500,
    image: '/assets/Gioang Cao Su Chiu Nhiet.jpg',
    stock: 500,
  },
];

// Account Modules for the grid
export interface AccountModule {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  iconColor: 'navy' | 'yellow' | 'green' | 'blue' | 'purple' | 'red';
}

export const accountModules: AccountModule[] = [
  {
    id: 'addresses',
    title: 'Địa chỉ giao hàng',
    description: 'Quản lý địa chỉ giao hàng của bạn',
    icon: Package,
    href: '/tai-khoan/dia-chi',
    iconColor: 'navy',
  },
  {
    id: 'payment',
    title: 'Thanh toán',
    description: 'Phương thức thanh toán và thông tin VAT',
    icon: CheckCircle,
    href: '/tai-khoan/thanh-toan',
    iconColor: 'green',
  },
  {
    id: 'security',
    title: 'Bảo mật',
    description: 'Đổi mật khẩu và bảo vệ tài khoản',
    icon: CheckCircle,
    href: '/tai-khoan/bao-mat',
    iconColor: 'purple',
  },
  {
    id: 'wishlist',
    title: 'Wishlist',
    description: 'Danh sách sản phẩm yêu thích',
    icon: Heart,
    href: '/tai-khoan/danh-sach',
    iconColor: 'red',
  },
  {
    id: 'quotes',
    title: 'Báo giá',
    description: 'Quản lý yêu cầu báo giá',
    icon: FileText,
    href: '/tai-khoan/bao-gia',
    iconColor: 'blue',
  },
  {
    id: 'returns',
    title: 'Đổi trả',
    description: 'Yêu cầu đổi trả sản phẩm',
    icon: Package,
    href: '/tai-khoan/doi-tra',
    iconColor: 'yellow',
  },
  {
    id: 'support',
    title: 'Hỗ trợ',
    description: 'Liên hệ và gửi ticket hỗ trợ',
    icon: Phone,
    href: '/tai-khoan/ho-tro',
    iconColor: 'green',
  },
  {
    id: 'marketing',
    title: 'Email Marketing',
    description: 'Cài đặt nhận email từ Mecsu',
    icon: Search,
    href: '/tai-khoan/marketing-email',
    iconColor: 'purple',
  },
];

// Order status configuration
export const orderStatusConfig = {
  processing: { label: 'Đang xử lý', variant: 'warning' as const, color: '#F59E0B' },
  shipping: { label: 'Đang giao', variant: 'info' as const, color: '#3B82F6' },
  completed: { label: 'Hoàn tất', variant: 'success' as const, color: '#10B981' },
  cancelled: { label: 'Đã huỷ', variant: 'danger' as const, color: '#EF4444' },
};

// Helper function to format price
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('vi-VN').format(price) + ' đ';
};

// Helper function to format date
export const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};
