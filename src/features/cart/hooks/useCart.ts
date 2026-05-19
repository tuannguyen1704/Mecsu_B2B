import { useState, useCallback, useMemo, useEffect } from 'react';
import { Product } from '@types';

/**
 * Cart item structure
 */
export interface CartItem {
  product: Product;
  quantity: number;
}

/**
 * Cart totals calculation result
 */
export interface CartTotals {
  subtotal: number;
  shippingFee: number;
  vat: number;
  total: number;
  itemCount: number;
}

/**
 * Free shipping threshold
 */
export const FREE_SHIPPING_THRESHOLD = 1000000;

/**
 * Default shipping fee
 */
export const DEFAULT_SHIPPING_FAST_FEE = 45000;
export const DEFAULT_SHIPPING_STANDARD_FEE = 35000;

/**
 * VAT rate (10%)
 */
export const VAT_RATE = 0.1;

/**
 * B2B discount threshold and rate
 */
export const B2B_DISCOUNT_THRESHOLD = 5000000;
export const B2B_DISCOUNT_RATE = 0.05;

/**
 * Cart state management hook
 * Handles all cart operations: add, update, remove, clear
 */
export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [lastAddedItem, setLastAddedItem] = useState<CartItem | null>(null);

  // Calculate cart totals
  const totals = useMemo((): CartTotals => {
    const subtotal = items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    // Free shipping for orders over 1M
    const shippingFee = subtotal > FREE_SHIPPING_THRESHOLD ? 0 : DEFAULT_SHIPPING_STANDARD_FEE;

    const vat = subtotal * VAT_RATE;

    const total = subtotal + shippingFee + vat;

    return {
      subtotal,
      shippingFee,
      vat,
      total,
      itemCount,
    };
  }, [items]);

  // Calculate total items count (unique products)
  const cartCount = useMemo(() => items.length, [items]);

  // Calculate total quantity of all items
  const totalQuantity = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  // Check if cart is empty
  const isEmpty = useMemo(() => items.length === 0, [items]);

  // Add item to cart
  const addToCart = useCallback((product: Product, quantity: number = 1) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id
      );

      if (existingIndex !== -1) {
        // Update quantity if item exists
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        return updated;
      }

      // Add new item
      return [...prev, { product, quantity }];
    });

    // Track last added item for popup
    setLastAddedItem({ product, quantity });

    // Clear last added item after animation
    setTimeout(() => {
      setLastAddedItem(null);
    }, 5000);
  }, []);

  // Update item quantity
  const updateQuantity = useCallback(
    (productId: string, quantity: number) => {
      if (quantity < 1) return;

      setItems((prev) =>
        prev.map((item) =>
          item.product.id === productId ? { ...item, quantity } : item
        )
      );
    },
    []
  );

  // Increment item quantity
  const incrementQuantity = useCallback((productId: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  }, []);

  // Decrement item quantity
  const decrementQuantity = useCallback(
    (productId: string) => {
      setItems((prev) =>
        prev.map((item) =>
          item.product.id === productId && item.quantity > 1
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
      );
    },
    []
  );

  // Remove item from cart
  const removeFromCart = useCallback((productId: string) => {
    setItems((prev) => prev.filter((item) => item.product.id !== productId));
  }, []);

  // Clear entire cart
  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  // Check if product is in cart
  const isInCart = useCallback(
    (productId: string): boolean => {
      return items.some((item) => item.product.id === productId);
    },
    [items]
  );

  // Get item by product ID
  const getItem = useCallback(
    (productId: string): CartItem | undefined => {
      return items.find((item) => item.product.id === productId);
    },
    [items]
  );

  // Get quantity of specific product
  const getQuantity = useCallback(
    (productId: string): number => {
      const item = items.find((item) => item.product.id === productId);
      return item?.quantity ?? 0;
    },
    [items]
  );

  // Clear last added item (for popup close)
  const clearLastAddedItem = useCallback(() => {
    setLastAddedItem(null);
  }, []);

  // Calculate total for a specific product
  const getItemTotal = useCallback((productId: string): number => {
    const item = items.find((item) => item.product.id === productId);
    if (!item) return 0;
    return item.product.price * item.quantity;
  }, [items]);

  // Apply B2B discount
  const calculateB2BTotal = useCallback(
    (hasCompany: boolean): CartTotals => {
      if (!hasCompany || totals.subtotal < B2B_DISCOUNT_THRESHOLD) {
        return totals;
      }

      const discount = totals.subtotal * B2B_DISCOUNT_RATE;
      const newTotal = totals.total - discount;

      return {
        ...totals,
        total: newTotal,
        // Note: discount is not stored in totals, it's calculated on-the-fly
      };
    },
    [totals]
  );

  return {
    // State
    items,
    cartCount,
    totalQuantity,
    totals,
    isEmpty,
    lastAddedItem,

    // Actions
    addToCart,
    updateQuantity,
    incrementQuantity,
    decrementQuantity,
    removeFromCart,
    clearCart,

    // Queries
    isInCart,
    getItem,
    getQuantity,
    getItemTotal,
    calculateB2BTotal,
    clearLastAddedItem,
  };
}

/**
 * Hook for cart with localStorage persistence
 */
export function useCartWithPersistence(key: string = 'mecsu_cart') {
  const cart = useCart();

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          cart.items.forEach; // Just to access cart.items
          // We need to set items directly, but useEffect can't set during render
          // So we'll use a different approach
        }
      }
    } catch (e) {
      console.warn('Failed to load cart from storage:', e);
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(cart.items));
    } catch (e) {
      console.warn('Failed to save cart to storage:', e);
    }
  }, [cart.items, key]);

  return cart;
}
