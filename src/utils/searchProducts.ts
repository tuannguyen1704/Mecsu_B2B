import { Product } from '../types';

/**
 * Normalize Vietnamese string by removing diacritical marks
 * Converts "cờ lê" to "co le" for matching purposes
 */
export function normalizeVietnamese(str: string): string {
  if (!str) return '';
  
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/đ/g, 'd') // Convert đ to d
    .replace(/Đ/g, 'd') // Convert Đ to D
    .trim();
}

/**
 * Check if text contains keyword (handles Vietnamese diacritics)
 */
function containsKeyword(text: string, keyword: string): boolean {
  if (!text || !keyword) return false;
  
  const normalizedText = normalizeVietnamese(text);
  const normalizedKeyword = normalizeVietnamese(keyword);
  
  return normalizedText.includes(normalizedKeyword);
}

/**
 * Search products by keyword across multiple fields
 * @param products - Array of products to search
 * @param keyword - Search keyword (supports Vietnamese with/without diacritics)
 * @returns Filtered array of matching products
 */
export function searchProducts(products: Product[], keyword: string): Product[] {
  if (!products || !keyword || keyword.trim() === '') {
    return [];
  }

  const searchTerm = keyword.trim();
  
  return products.filter(product => {
    // Search in name
    if (containsKeyword(product.name, searchTerm)) {
      return true;
    }
    
    // Search in category
    if (containsKeyword(product.category, searchTerm)) {
      return true;
    }
    
    // Search in brand
    if (containsKeyword(product.brand, searchTerm)) {
      return true;
    }
    
    // Search in tags
    if (product.tags && Array.isArray(product.tags)) {
      for (const tag of product.tags) {
        if (containsKeyword(tag, searchTerm)) {
          return true;
        }
      }
    }
    
    // Search in sku
    if (containsKeyword(product.sku, searchTerm)) {
      return true;
    }
    
    return false;
  });
}

/**
 * Get search suggestions for autocomplete
 * Returns a limited number of results suitable for dropdown display
 * @param products - Array of products to search
 * @param keyword - Search keyword
 * @param limit - Maximum number of suggestions (default 6)
 */
export function getSearchSuggestions(
  products: Product[], 
  keyword: string, 
  limit: number = 6
): Product[] {
  const results = searchProducts(products, keyword);
  return results.slice(0, limit);
}

/**
 * Calculate relevance score for sorting search results
 * Higher score = more relevant
 */
export function calculateRelevance(product: Product, keyword: string): number {
  let score = 0;
  const normalizedKeyword = normalizeVietnamese(keyword);
  
  // Exact match in name gets highest score
  const normalizedName = normalizeVietnamese(product.name);
  if (normalizedName === normalizedKeyword) {
    score += 100;
  } else if (normalizedName.startsWith(normalizedKeyword)) {
    score += 50;
  } else if (normalizedName.includes(normalizedKeyword)) {
    score += 25;
  }
  
  // Match in brand
  if (containsKeyword(product.brand, keyword)) {
    score += 15;
  }
  
  // Match in category
  if (containsKeyword(product.category, keyword)) {
    score += 10;
  }
  
  // Match in tags
  if (product.tags) {
    product.tags.forEach(tag => {
      if (containsKeyword(tag, keyword)) {
        score += 5;
      }
    });
  }
  
  return score;
}

/**
 * Sort search results by relevance
 */
export function sortByRelevance(products: Product[], keyword: string): Product[] {
  return [...products].sort((a, b) => {
    const scoreA = calculateRelevance(a, keyword);
    const scoreB = calculateRelevance(b, keyword);
    return scoreB - scoreA;
  });
}
