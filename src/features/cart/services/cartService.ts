import { CartItem } from '../hooks/useCart';
import { Product } from '@types';

/**
 * Cart service - handles cart-related data operations
 * This layer separates business logic from hooks/components
 * 
 * Storage structure:
 * - For logged-in users: 'mecsu_cart_{userId}'
 * - For anonymous users: 'mecsu_cart_anonymous_{deviceId}'
 * - Device ID is stored in 'mecsu_device_id'
 */
export const cartService = {
  // Storage key constants
  STORAGE_KEY_USER_PREFIX: 'mecsu_cart_',
  STORAGE_KEY_ANONYMOUS_PREFIX: 'mecsu_cart_anonymous_',
  DEVICE_ID_KEY: 'mecsu_device_id',

  /**
   * Get or create a unique device ID for anonymous users
   */
  getOrCreateDeviceId(): string {
    let deviceId = localStorage.getItem(this.DEVICE_ID_KEY);
    if (!deviceId) {
      deviceId = 'device_' + Math.random().toString(36).substring(2, 15);
      localStorage.setItem(this.DEVICE_ID_KEY, deviceId);
    }
    return deviceId;
  },

  /**
   * Get the storage key for a given user ID
   * @param userId - The user ID. If undefined/null, returns anonymous device key
   */
  getStorageKey(userId?: string): string {
    if (userId) {
      return `${this.STORAGE_KEY_USER_PREFIX}${userId}`;
    }
    return `${this.STORAGE_KEY_ANONYMOUS_PREFIX}${this.getOrCreateDeviceId()}`;
  },

  /**
   * Load cart from localStorage for a specific user or anonymous device
   * @param userId - The user ID. If undefined, uses anonymous device
   */
  loadFromStorage(userId?: string): CartItem[] {
    try {
      const storageKey = this.getStorageKey(userId);
      const stored = localStorage.getItem(storageKey);
      if (!stored) return [];
      return JSON.parse(stored);
    } catch (error) {
      console.warn('Failed to load cart from storage:', error);
      return [];
    }
  },

  /**
   * Save cart to localStorage for a specific user or anonymous device
   * @param items - Cart items to save
   * @param userId - The user ID. If undefined, uses anonymous device
   */
  saveToStorage(items: CartItem[], userId?: string): boolean {
    try {
      const storageKey = this.getStorageKey(userId);
      localStorage.setItem(storageKey, JSON.stringify(items));
      return true;
    } catch (error) {
      console.warn('Failed to save cart to storage:', error);
      return false;
    }
  },

  /**
   * Clear cart from localStorage for a specific user or anonymous device
   * @param userId - The user ID. If undefined, uses anonymous device
   */
  clearStorage(userId?: string): boolean {
    try {
      const storageKey = this.getStorageKey(userId);
      localStorage.removeItem(storageKey);
      return true;
    } catch (error) {
      console.warn('Failed to clear cart storage:', error);
      return false;
    }
  },

  /**
   * Add item to cart (returns new cart state)
   */
  addItem(items: CartItem[], product: Product, quantity: number): CartItem[] {
    const existingIndex = items.findIndex(
      (item) => item.product.id === product.id
    );

    if (existingIndex !== -1) {
      // Update quantity
      const updated = [...items];
      updated[existingIndex] = {
        ...updated[existingIndex],
        quantity: updated[existingIndex].quantity + quantity,
      };
      return updated;
    }

    // Add new item
    return [...items, { product, quantity }];
  },

  /**
   * Update item quantity (returns new cart state)
   */
  updateItemQuantity(
    items: CartItem[],
    productId: string,
    quantity: number
  ): CartItem[] {
    if (quantity < 1) return items;

    return items.map((item) =>
      item.product.id === productId ? { ...item, quantity } : item
    );
  },

  /**
   * Remove item from cart (returns new cart state)
   */
  removeItem(items: CartItem[], productId: string): CartItem[] {
    return items.filter((item) => item.product.id !== productId);
  },

  /**
   * Clear all items
   */
  clearCart(): CartItem[] {
    return [];
  },

  /**
   * Calculate cart subtotal
   */
  calculateSubtotal(items: CartItem[]): number {
    return items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
  },

  /**
   * Calculate total quantity of all items
   */
  calculateTotalQuantity(items: CartItem[]): number {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  },

  /**
   * Check if product is in cart
   */
  isInCart(items: CartItem[], productId: string): boolean {
    return items.some((item) => item.product.id === productId);
  },

  /**
   * Get item by product ID
   */
  getItem(items: CartItem[], productId: string): CartItem | undefined {
    return items.find((item) => item.product.id === productId);
  },

  /**
   * Get item total price
   */
  getItemTotal(items: CartItem[], productId: string): number {
    const item = items.find((item) => item.product.id === productId);
    if (!item) return 0;
    return item.product.price * item.quantity;
  },

  /**
   * Calculate totals with shipping and VAT
   */
  calculateTotals(
    items: CartItem[],
    options: {
      freeShippingThreshold?: number;
      standardShippingFee?: number;
      fastShippingFee?: number;
      vatRate?: number;
    } = {}
  ): {
    subtotal: number;
    shippingFee: number;
    vat: number;
    total: number;
    itemCount: number;
  } {
    const {
      freeShippingThreshold = 1000000,
      standardShippingFee = 35000,
      vatRate = 0.1,
    } = options;

    const subtotal = this.calculateSubtotal(items);
    const itemCount = items.length;
    const shippingFee =
      subtotal > freeShippingThreshold ? 0 : standardShippingFee;
    const vat = subtotal * vatRate;
    const total = subtotal + shippingFee + vat;

    return {
      subtotal,
      shippingFee,
      vat,
      total,
      itemCount,
    };
  },
};

/**
 * Build order payload from cart items
 */
export function buildOrderPayload(
  items: CartItem[],
  formData: {
    fullName: string;
    phone: string;
    email: string;
    address: string;
    ward: string;
    district: string;
    province: string;
    shippingMethod: 'standard' | 'fast' | 'pickup';
    paymentMethod: 'bank' | 'cod' | 'quotation' | 'netterms';
    needVatInvoice: boolean;
    vatCompanyName?: string;
    vatTaxCode?: string;
    vatAddress?: string;
    vatEmail?: string;
    companyName?: string;
    taxCode?: string;
    poNumber?: string;
    internalCode?: string;
    purchaseNote?: string;
  },
  totals: {
    subtotal: number;
    shippingFee: number;
    vat: number;
    total: number;
  }
): Record<string, any> {
  return {
    // Customer info
    customer: {
      fullName: formData.fullName,
      phone: formData.phone,
      email: formData.email,
      companyName: formData.companyName,
      taxCode: formData.taxCode,
    },

    // Shipping info
    shipping: {
      address: formData.address,
      ward: formData.ward,
      district: formData.district,
      province: formData.province,
      method: formData.shippingMethod,
    },

    // Payment info
    payment: {
      method: formData.paymentMethod,
      poNumber: formData.poNumber,
      internalCode: formData.internalCode,
      purchaseNote: formData.purchaseNote,
    },

    // VAT invoice
    vatInvoice: formData.needVatInvoice
      ? {
          companyName: formData.vatCompanyName,
          taxCode: formData.vatTaxCode,
          address: formData.vatAddress,
          email: formData.vatEmail,
        }
      : null,

    // Order items
    items: items.map((item) => ({
      productId: item.product.id,
      productCode: item.product.sku,
      productName: item.product.name,
      quantity: item.quantity,
      unitPrice: item.product.price,
      totalPrice: item.product.price * item.quantity,
    })),

    // Totals
    pricing: {
      subtotal: totals.subtotal,
      shippingFee: totals.shippingFee,
      vat: totals.vat,
      total: totals.total,
    },

    // Metadata
    orderId: 'MEC-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
    createdAt: new Date().toISOString(),
  };
}
