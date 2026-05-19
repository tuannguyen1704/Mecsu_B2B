/**
 * Storage utilities for localStorage and sessionStorage operations
 */

// Generic storage interface
interface StorageData<T> {
  data: T;
  timestamp: number;
  expires?: number;
}

// Storage keys enum
export const StorageKeys = {
  CART: 'mecsu_cart',
  CHECKOUT_FORM: 'mecsu_checkout_form',
  CURRENT_USER: 'mecsu_current_user',
  USERS: 'mecsu_users',
  SEARCH_HISTORY: 'mecsu_search_history',
  RECENTLY_VIEWED: 'mecsu_recently_viewed',
  USER_PREFERENCES: 'mecsu_user_preferences',
} as const;

// Default expiration time (7 days in ms)
const DEFAULT_EXPIRATION = 7 * 24 * 60 * 60 * 1000;

/**
 * Save data to localStorage with optional expiration
 */
export function saveToStorage<T>(
  key: string,
  data: T,
  expiresInMs?: number
): boolean {
  try {
    const storageData: StorageData<T> = {
      data,
      timestamp: Date.now(),
      expires: expiresInMs ?? DEFAULT_EXPIRATION,
    };
    localStorage.setItem(key, JSON.stringify(storageData));
    return true;
  } catch (error) {
    console.warn(`Error saving to localStorage (${key}):`, error);
    return false;
  }
}

/**
 * Load data from localStorage with expiration check
 */
export function loadFromStorage<T>(
  key: string,
  defaultValue?: T
): T | null {
  try {
    const stored = localStorage.getItem(key);
    if (!stored) return defaultValue ?? null;

    const parsed: StorageData<T> = JSON.parse(stored);

    // Check expiration
    if (parsed.expires) {
      const age = Date.now() - parsed.timestamp;
      if (age > parsed.expires) {
        removeFromStorage(key);
        return defaultValue ?? null;
      }
    }

    return parsed.data;
  } catch (error) {
    console.warn(`Error loading from localStorage (${key}):`, error);
    return defaultValue ?? null;
  }
}

/**
 * Remove data from localStorage
 */
export function removeFromStorage(key: string): boolean {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.warn(`Error removing from localStorage (${key}):`, error);
    return false;
  }
}

/**
 * Clear all MECSU-related data from localStorage
 */
export function clearAllStorage(): void {
  Object.values(StorageKeys).forEach((key) => {
    removeFromStorage(key);
  });
}

/**
 * Check if localStorage is available
 */
export function isStorageAvailable(): boolean {
  try {
    const testKey = '__storage_test__';
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get storage size info
 */
export function getStorageInfo(): { used: number; keys: number } {
  let totalSize = 0;
  let keyCount = 0;

  for (const key in localStorage) {
    if (Object.prototype.hasOwnProperty.call(localStorage, key)) {
      totalSize += localStorage.getItem(key)?.length ?? 0;
      keyCount++;
    }
  }

  return {
    used: totalSize * 2, // UTF-16 = 2 bytes per char
    keys: keyCount,
  };
}

/**
 * Save cart to storage
 */
export function saveCart<T extends { product: { id: string }; quantity: number }>(
  items: T[]
): boolean {
  return saveToStorage(StorageKeys.CART, items);
}

/**
 * Load cart from storage
 */
export function loadCart<T>(): T[] {
  return loadFromStorage<T[]>(StorageKeys.CART, []) ?? [];
}

/**
 * Save checkout form to storage
 */
export function saveCheckoutForm<T>(formData: T): boolean {
  // Don't save File objects
  const { purchaseOrderFile, ...safeData } = formData as any;
  return saveToStorage(StorageKeys.CHECKOUT_FORM, safeData);
}

/**
 * Load checkout form from storage
 */
export function loadCheckoutForm<T>(): T | null {
  return loadFromStorage<T>(StorageKeys.CHECKOUT_FORM);
}

/**
 * Clear checkout form from storage
 */
export function clearCheckoutForm(): boolean {
  return removeFromStorage(StorageKeys.CHECKOUT_FORM);
}

/**
 * Add item to recently viewed
 */
export function addToRecentlyViewed<T extends { id: string }>(
  item: T,
  maxItems = 20
): void {
  const recent = loadFromStorage<T[]>(StorageKeys.RECENTLY_VIEWED, []) ?? [];
  const filtered = recent.filter((i) => i.id !== item.id);
  const updated = [item, ...filtered].slice(0, maxItems);
  saveToStorage(StorageKeys.RECENTLY_VIEWED, updated);
}

/**
 * Get recently viewed items
 */
export function getRecentlyViewed<T>(): T[] {
  return loadFromStorage<T[]>(StorageKeys.RECENTLY_VIEWED, []) ?? [];
}

/**
 * Add search query to search history
 */
export function addToSearchHistory(query: string, maxItems = 10): void {
  const history = loadFromStorage<string[]>(StorageKeys.SEARCH_HISTORY, []) ?? [];
  const filtered = history.filter((q) => q.toLowerCase() !== query.toLowerCase());
  const updated = [query, ...filtered].slice(0, maxItems);
  saveToStorage(StorageKeys.SEARCH_HISTORY, updated);
}

/**
 * Get search history
 */
export function getSearchHistory(): string[] {
  return loadFromStorage<string[]>(StorageKeys.SEARCH_HISTORY, []) ?? [];
}

/**
 * Clear search history
 */
export function clearSearchHistory(): boolean {
  return removeFromStorage(StorageKeys.SEARCH_HISTORY);
}
