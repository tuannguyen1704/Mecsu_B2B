import { useState, useCallback } from 'react';
import { Product } from '@types';

export interface HeaderState {
  isCategoryOpen: boolean;
  hoveredCategoryIdx: number | null;
  selectedLocation: string;
  isLocationModalOpen: boolean;
  isSearchSticky: boolean;
  isSearchVisible: boolean;
}

export interface HeaderActions {
  setIsCategoryOpen: (open: boolean) => void;
  setHoveredCategoryIdx: (idx: number | null) => void;
  setSelectedLocation: (location: string) => void;
  setIsLocationModalOpen: (open: boolean) => void;
  setIsSearchSticky: (sticky: boolean) => void;
  toggleCategory: () => void;
  openCategory: () => void;
  closeCategory: () => void;
  openLocationModal: () => void;
  closeLocationModal: () => void;
}

export interface HeaderNotifications {
  notifications: Array<{
    id: string;
    type: 'order' | 'system' | 'shipping';
    message: string;
    time: string;
    read: boolean;
    orderId?: string;
    icon?: string;
  }>;
}

export interface CartPopupState {
  cartPopupItem: { product: Product; quantity: number } | null;
  cartPopupVisible: boolean;
}

export interface CartPopupActions {
  setCartPopupItem: (item: { product: Product; quantity: number } | null) => void;
  showCartPopup: (item: { product: Product; quantity: number }) => void;
  hideCartPopup: () => void;
}

/**
 * Hook for managing Header state
 */
export function useHeader() {
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [hoveredCategoryIdx, setHoveredCategoryIdx] = useState<number | null>(null);
  const [selectedLocation, setSelectedLocation] = useState('TP. Hồ Chí Minh');
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isSearchSticky, setIsSearchSticky] = useState(false);

  // Toggle category menu
  const toggleCategory = useCallback(() => {
    setIsCategoryOpen((prev) => !prev);
  }, []);

  const openCategory = useCallback(() => {
    setIsCategoryOpen(true);
  }, []);

  const closeCategory = useCallback(() => {
    setIsCategoryOpen(false);
    setHoveredCategoryIdx(null);
  }, []);

  const openLocationModal = useCallback(() => {
    setIsLocationModalOpen(true);
  }, []);

  const closeLocationModal = useCallback(() => {
    setIsLocationModalOpen(false);
  }, []);

  return {
    // State
    isCategoryOpen,
    hoveredCategoryIdx,
    selectedLocation,
    isLocationModalOpen,
    isSearchSticky,

    // Actions
    setIsCategoryOpen,
    setHoveredCategoryIdx,
    setSelectedLocation,
    setIsLocationModalOpen,
    setIsSearchSticky,
    toggleCategory,
    openCategory,
    closeCategory,
    openLocationModal,
    closeLocationModal,
  };
}

/**
 * Hook for managing Cart Popup state
 */
export function useCartPopup() {
  const [cartPopupItem, setCartPopupItem] = useState<{
    product: Product;
    quantity: number;
  } | null>(null);

  const showCartPopup = useCallback(
    (item: { product: Product; quantity: number }) => {
      setCartPopupItem(item);
    },
    []
  );

  const hideCartPopup = useCallback(() => {
    setCartPopupItem(null);
  }, []);

  return {
    cartPopupItem,
    setCartPopupItem,
    showCartPopup,
    hideCartPopup,
  };
}

/**
 * Hook for tracking notification state
 */
export function useHeaderNotifications(
  initialNotifications: Array<{
    id: string;
    type: 'order' | 'system' | 'shipping';
    message: string;
    time: string;
    read: boolean;
    orderId?: string;
    icon?: string;
  }> = []
) {
  const [notifications, setNotifications] = useState(initialNotifications);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const addNotification = useCallback(
    (notification: Omit<(typeof notifications)[0], 'id' | 'read'>) => {
      const newNotification = {
        ...notification,
        id: Date.now().toString(),
        read: false,
      };
      setNotifications((prev) => [newNotification, ...prev]);
    },
    []
  );

  const unreadCount = notifications.filter((n) => !n.read).length;

  return {
    notifications,
    setNotifications,
    markAllRead,
    addNotification,
    unreadCount,
  };
}
