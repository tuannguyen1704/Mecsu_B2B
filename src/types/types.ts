// Type definitions
export interface Product {
  id: string;
  sku: string;
  name: string;
  slug: string;
  category: string;
  categorySlug: string;
  brand: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  tax: number;
  stock: number;
  unit: string;
  delivery: string;
  image: string;
  tags?: string[];
  rating?: number;
  isInstallment?: boolean;
  offers?: string[];
  extraInfo?: string;
  origin?: string;
  material?: string;
}

export interface Category {
  id: string;
  name: string;
  count: number;
  icon?: string;
  subcategories?: string[];
  relatedItems?: string[];
  sections?: { title: string; items: string[] }[];
}

export interface Brand {
  id: string;
  name: string;
  count: number;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content?: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  image: string;
}

// Order types
export type OrderStatus = 'processing' | 'shipping' | 'completed' | 'cancelled';
export type ReturnStatus = 'reviewing' | 'approved' | 'completed' | 'rejected';

export interface ShippingAddress {
  receiverName?: string;
  phone?: string;
  street?: string;
  ward?: string;
  district?: string;
  province?: string;
  fullAddress?: string;
}

export interface OrderItem {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  price: number;
  image: string;
}

export interface Order {
  id: string;
  orderCode: string;
  orderDate: string;
  status: OrderStatus;
  totalAmount: number;
  paymentMethod: string;
  shippingAddress: string | ShippingAddress;
  recipientName?: string;
  phone?: string;
  items: OrderItem[];
}

export interface ReorderItem {
  id: string;
  name: string;
  sku: string;
  lastPurchased: string;
  lastPrice: number;
  quantity: number;
  image: string;
  stock: number;
}

export interface ReturnRequest {
  id: string;
  returnCode: string;
  orderCode: string;
  createdDate: string;
  status: ReturnStatus;
  reason: string;
}

export interface AccountUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
}
