import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Product } from "../types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Convert text to URL-friendly slug (e.g., "Phe Gài Trục Thép 65Mn DIN471 D3x0.4" -> "phe-gai-truc-thep-65mn-din471-d3x0-4")
export const toSlug = (text: string): string => {
  return text.toLowerCase().replace(/\s+/g, "-").replace(/[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/g, (char) => {
    const map: Record<string, string> = {
      'à': 'a', 'á': 'a', 'ạ': 'a', 'ả': 'a', 'ã': 'a',
      'â': 'a', 'ầ': 'a', 'ấ': 'a', 'ậ': 'a', 'ẩ': 'a', 'ẫ': 'a',
      'ă': 'a', 'ằ': 'a', 'ắ': 'a', 'ặ': 'a', 'ẳ': 'a', 'ẵ': 'a',
      'è': 'e', 'é': 'e', 'ẹ': 'e', 'ẻ': 'e', 'ẽ': 'e',
      'ê': 'e', 'ề': 'e', 'ế': 'e', 'ệ': 'e', 'ể': 'e', 'ễ': 'e',
      'ì': 'i', 'í': 'i', 'ị': 'i', 'ỉ': 'i', 'ĩ': 'i',
      'ò': 'o', 'ó': 'o', 'ọ': 'o', 'ỏ': 'o', 'õ': 'o',
      'ô': 'o', 'ồ': 'o', 'ố': 'o', 'ộ': 'o', 'ổ': 'o', 'ỗ': 'o',
      'ơ': 'o', 'ờ': 'o', 'ớ': 'o', 'ợ': 'o', 'ở': 'o', 'ỡ': 'o',
      'ù': 'u', 'ú': 'u', 'ụ': 'u', 'ủ': 'u', 'ũ': 'u',
      'ư': 'u', 'ừ': 'u', 'ứ': 'u', 'ự': 'u', 'ử': 'u', 'ữ': 'u',
      'ỳ': 'y', 'ý': 'y', 'ỵ': 'y', 'ỷ': 'y', 'ỹ': 'y',
      'đ': 'd'
    };
    return map[char] || char;
  });
};

// Generate SEO-friendly category URL
export const generateCategoryUrl = (category: { id: string; name?: string }): string => {
  // Use slug from name if available, otherwise use ID
  if (category.name) {
    return `/danh-muc/${toSlug(category.name)}`;
  }
  return `/danh-muc/${category.id}`;
};

// Generate product URL using just the ID (no slug needed)
export const generateProductUrl = (product: Product): string => {
  return `/san-pham/${product.id}`;
};

// Parse SKU from product URL
// Input: "phe-gai-truc-thep-65mn-din471-d3x0-4-p-0043170"
// Output: "0043170"
export const parseSkuFromUrl = (productSlug: string): string => {
  const parts = productSlug.split("-p-");
  return parts.length > 1 ? parts[parts.length - 1] : "";
};
