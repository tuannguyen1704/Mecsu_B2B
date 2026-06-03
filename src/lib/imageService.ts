/**
 * imageService.ts
 * 
 * Service để lấy images từ Supabase storage
 * Tách riêng để supabase.ts chỉ chứa client configuration
 */

import { supabase } from './supabase';

// ============================================
// CACHE
// ============================================

let cachedImages: string[] | null = null;
let fetchPromise: Promise<string[]> | null = null;

// ============================================
// HÀM CHÍNH
// ============================================

/**
 * Lấy danh sách images từ Supabase
 * Có cache để tránh fetch nhiều lần
 * 
 * @param tableName - Tên bảng chứa images (mặc định: 'crawled_images')
 * @returns Mảng URL strings
 */
export async function getProjectImages(tableName: string = 'crawled_images'): Promise<string[]> {
  // Trả về cache nếu có
  if (cachedImages) return cachedImages;
  if (fetchPromise) return fetchPromise;

  fetchPromise = (async () => {
    // Thử nhiều tên bảng khác nhau
    const tableNames = [
      tableName,
      'images',
      'project_images',
      'crawled_images',
      'scraped_images',
      'product_images'
    ];
    
    for (const name of tableNames) {
      try {
        const { data, error } = await supabase
          .from(name)
          .select('*')
          .limit(30);
        
        if (error || !data || data.length === 0) {
          console.log(`Table ${name} check failed or empty:`, error?.message);
          continue;
        }
        
        console.log(`Successfully fetched ${data.length} images from table: ${name}`);
        
        // Trích xuất URLs từ data
        const urls = data.map(item => {
          // Thử tìm bất kỳ column nào chứa URL/Path
          const path = item.storage_url || 
                       item.file_path || 
                       item.url || 
                       item.path || 
                       item.image_url || 
                       item.src || 
                       item.link;
          
          if (!path) return null;
          
          // Nếu đã là full URL, trả về luôn
          if (typeof path === 'string' && (path.startsWith('http') || path.startsWith('https'))) {
            return path;
          }
          
          // Nếu là storage path, thử lấy public URL
          const bucket = item.bucket_name || 'images' || 'project_images' || 'product-images';
          try {
            const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(path);
            return publicUrl;
          } catch {
            return path; // Trả về path nếu không lấy được publicUrl
          }
        }).filter((url): url is string => Boolean(url));

        cachedImages = urls;
        return urls;
      } catch (err) {
        console.error(`Error trying table ${name}:`, err);
      }
    }
    
    // Không tìm được images
    cachedImages = [];
    return [];
  })();

  return fetchPromise;
}

/**
 * Clear cache để fetch lại images
 */
export function clearImageCache(): void {
  cachedImages = null;
  fetchPromise = null;
}
