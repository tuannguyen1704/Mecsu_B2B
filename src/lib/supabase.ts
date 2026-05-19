import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseInstance: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (supabaseInstance) return supabaseInstance;

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase credentials are missing. Please check your .env file.');
    return null;
  }

  if (typeof supabaseUrl !== 'string' || !supabaseUrl.startsWith('http')) {
    console.warn('Supabase URL is invalid.');
    return null;
  }

  try {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
    return supabaseInstance;
  } catch (err) {
    console.error('Failed to initialize Supabase client:', err);
    return null;
  }
}

let cachedImages: string[] | null = null;
let fetchPromise: Promise<string[]> | null = null;

export async function getProjectImages(tableName: string = 'crawled_images'): Promise<string[]> {
  if (cachedImages) return cachedImages;
  if (fetchPromise) return fetchPromise;

  const client = getSupabaseClient();
  if (!client) {
    console.warn('Supabase credentials missing or invalid. Images will not be loaded.');
    return [];
  }

  fetchPromise = (async () => {
    const tableNames = [tableName, 'images', 'project_images', 'crawled_images', 'scraped_images', 'product_images'];
    
    for (const name of tableNames) {
      try {
        const { data, error } = await client
          .from(name)
          .select('*')
          .limit(30);
        
        if (error || !data || data.length === 0) {
           console.log(`Table ${name} check failed or empty:`, error?.message);
           continue;
        };
        
        console.log(`Successfully fetched ${data.length} images from table: ${name}`);
        
        const urls = data.map(item => {
          // Try to find any column that looks like a URL or Path
          const path = item.storage_url || item.file_path || item.url || item.path || item.image_url || item.src || item.link;
          if (!path) return null;
          
          // If it's already a full URL, return it
          if (typeof path === 'string' && (path.startsWith('http') || path.startsWith('https'))) {
            return path;
          }
          
          // If it looks like a storage path, try to guess public URL
          const bucket = item.bucket_name || 'images' || 'project_images' || 'product-images';
          const { data: { publicUrl } } = client.storage.from(bucket).getPublicUrl(path);
          return publicUrl;
        }).filter((url): url is string => Boolean(url));

        cachedImages = urls;
        return urls;
      } catch (err) {
        console.error(`Error trying table ${name}:`, err);
      }
    }
    
    cachedImages = [];
    return [];
  })();

  return fetchPromise;
}
