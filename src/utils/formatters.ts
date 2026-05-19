/**
 * Format a number as Vietnamese currency
 */
export function formatPrice(price: number, currency = 'VND'): string {
  return new Intl.NumberFormat('vi-VN').format(price) + (currency === 'VND' ? 'đ' : '');
}

/**
 * Format price without currency symbol
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('vi-VN').format(num);
}

/**
 * Format a date string to Vietnamese locale
 */
export function formatDate(
  date: string | Date,
  locale = 'vi-VN',
  options?: Intl.DateTimeFormatOptions
): string {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    ...options,
  };
  return new Intl.DateTimeFormat(locale, defaultOptions).format(new Date(date));
}

/**
 * Format relative time (e.g., "2 tháng trước")
 */
export function formatRelativeTime(date: string | Date, locale = 'vi-VN'): string {
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'Vừa xong';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} phút trước`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} giờ trước`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays} ngày trước`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} tháng trước`;
  }

  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears} năm trước`;
}

/**
 * Format phone number for display (adds spaces)
 */
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;
  }
  return phone;
}

/**
 * Format address parts into a single string
 */
export function formatAddress(parts: {
  streetAddress?: string;
  ward?: string;
  district?: string;
  province?: string;
}): string {
  const { streetAddress, ward, district, province } = parts;
  const partsList = [streetAddress, ward, district, province].filter(Boolean);
  return partsList.join(', ');
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Format percentage
 */
export function formatPercentage(value: number, decimals = 0): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

/**
 * Format discount percentage (e.g., 19 -> "-19%")
 */
export function formatDiscount(discount: number): string {
  return `-${discount}%`;
}

/**
 * Format order ID for display
 */
export function formatOrderId(id: string, prefix = 'MEC'): string {
  return `${prefix}-${id.toUpperCase()}`;
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

/**
 * Generate SKU from product code
 */
export function formatSKU(code: string, maxLength = 6): string {
  return code.slice(-maxLength).toUpperCase();
}
