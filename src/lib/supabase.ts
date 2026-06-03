/**
 * supabase.ts
 * 
 * Supabase Client Configuration
 * Dùng chung cho tất cả các module cần truy cập Supabase
 */

import { createClient } from '@supabase/supabase-js';

// ============================================
// CẤU HÌNH SUPABASE
// ============================================

// Lấy credentials từ environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// Validate credentials
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '[Supabase] Thiếu credentials. Vui lòng thêm vào .env:\n' +
    'VITE_SUPABASE_URL=your_supabase_url\n' +
    'VITE_SUPABASE_ANON_KEY=your_supabase_anon_key'
  );
}

// ============================================
// TẠO SUPABASE CLIENT
// ============================================

/**
 * Supabase client instance
 * Dùng cho tất cả các module auth, database, storage
 */
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      // Tự động refresh session mỗi 10 phút
      autoRefreshToken: true,
      // Persist session vào localStorage
      persistSession: true,
      // Detect session từ URL (cho OAuth callback)
      detectSessionInUrl: true,
    },
  }
);

// ============================================
// HÀM TIỆN ÍCH
// ============================================

/**
 * Kiểm tra Supabase đã được cấu hình chưa
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl && supabaseAnonKey);
}

/**
 * Lấy URL hiện tại (dùng cho redirect)
 */
export function getCurrentUrl(): string {
  return window.location.origin;
}
