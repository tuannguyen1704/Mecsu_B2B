/**
 * authService.ts
 * 
 * Service layer cho Supabase Authentication
 * Dùng cho đăng nhập, đăng ký, quên mật khẩu, đặt lại mật khẩu
 * 
 * Hướng dẫn cài đặt:
 * 1. Tạo project Supabase tại https://supabase.com
 * 2. Bật Email Auth trong Supabase Dashboard > Authentication > Providers > Email
 * 3. Cấu hình SMTP (tùy chọn) để email xác minh đẹp hơn
 * 4. Thêm VITE_SUPABASE_URL và VITE_SUPABASE_ANON_KEY vào .env
 */

import { supabase } from '../lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

// ============================================
// KIỂU DỮ LIỆU (TYPES)
// ============================================

/** Kết quả trả về từ các function auth */
export interface AuthResult {
  success: boolean;
  error?: string;
  data?: User | Session;
}

/** Thông tin user sau khi đăng ký/signup */
export interface SignUpData {
  email: string;
  password: string;
  fullName?: string;
  phone?: string;
}

// ============================================
// CÁC FUNCTION AUTH CHÍNH
// ============================================

/**
 * Đăng nhập bằng email và password
 * 
 * @param email - Email của tài khoản
 * @param password - Mật khẩu
 * @returns AuthResult với success true nếu đăng nhập thành công
 * 
 * @example
 * ```ts
 * const result = await signInWithPassword('user@example.com', 'password123');
 * if (result.success) {
 *   console.log('Đăng nhập thành công:', result.data);
 * } else {
 *   console.log('Lỗi:', result.error);
 * }
 * ```
 */
export async function signInWithPassword(
  email: string,
  password: string
): Promise<AuthResult> {
  try {
    // Validate email format
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { success: false, error: 'Email không hợp lệ' };
    }

    // Validate password
    if (!password) {
      return { success: false, error: 'Vui lòng nhập mật khẩu' };
    }

    // Gọi Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password: password,
    });

    // Xử lý lỗi từ Supabase
    if (error) {
      return { success: false, error: mapSupabaseError(error.message) };
    }

    return { success: true, data };
  } catch (err) {
    console.error('[authService] signInWithPassword error:', err);
    return { success: false, error: 'Có lỗi xảy ra. Vui lòng thử lại.' };
  }
}

/**
 * Đăng ký tài khoản mới
 * 
 * @param email - Email cho tài khoản mới
 * @param password - Mật khẩu (ít nhất 6 ký tự)
 * @param fullName - Tên đầy đủ (tùy chọn)
 * @returns AuthResult với success true nếu đăng ký thành công
 * 
 * @example
 * ```ts
 * const result = await signUpWithPassword('user@example.com', 'password123', 'Nguyen Van A');
 * if (result.success) {
 *   // Supabase sẽ gửi email xác minh tự động
 * } else {
 *   console.log('Lỗi:', result.error);
 * }
 * ```
 */
export async function signUpWithPassword(
  email: string,
  password: string,
  fullName?: string
): Promise<AuthResult> {
  try {
    // Validate email
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { success: false, error: 'Email không hợp lệ' };
    }

    // Validate password
    if (!password) {
      return { success: false, error: 'Vui lòng nhập mật khẩu' };
    }

    if (password.length < 6) {
      return { success: false, error: 'Mật khẩu phải có ít nhất 6 ký tự' };
    }

    // Gọi Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password: password,
      options: {
        // Lưu thêm thông tin vào metadata
        data: {
          full_name: fullName || '',
        },
      },
    });

    // Xử lý lỗi
    if (error) {
      return { success: false, error: mapSupabaseError(error.message) };
    }

    // Kiểm tra user đã tồn tại nhưng chưa xác minh
    if (data.user && !data.session) {
      return { 
        success: true, 
        data: data.user,
        // Thông báo đã gửi email xác minh
        error: 'Đã gửi email xác minh. Vui lòng kiểm tra hộp thư để xác minh tài khoản.'
      };
    }

    return { success: true, data };
  } catch (err) {
    console.error('[authService] signUpWithPassword error:', err);
    return { success: false, error: 'Có lỗi xảy ra. Vui lòng thử lại.' };
  }
}

/**
 * Gửi email đặt lại mật khẩu
 * 
 * Supabase sẽ gửi email chứa link để đặt lại mật khẩu.
 * Link sẽ có dạng: {YOUR_SITE_URL}/reset-password?token=xxx&email=xxx
 * 
 * @param email - Email của tài khoản cần đặt lại mật khẩu
 * @returns AuthResult với success true nếu gửi email thành công
 * 
 * @example
 * ```ts
 * const result = await sendResetPasswordEmail('user@example.com');
 * if (result.success) {
 *   // Hiển thị thông báo "Đã gửi email đặt lại mật khẩu"
 * }
 * ```
 */
export async function sendResetPasswordEmail(email: string): Promise<AuthResult> {
  try {
    // Validate email
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { success: false, error: 'Email không hợp lệ' };
    }

    // URL để redirect sau khi click link trong email
    // Thay đổi URL này thành domain thật của bạn
    const redirectTo = `${window.location.origin}/reset-password`;

    // Gọi Supabase Auth
    const { error } = await supabase.auth.resetPasswordForEmail(
      email.trim().toLowerCase(),
      {
        redirectTo,
      }
    );

    // Xử lý lỗi
    if (error) {
      return { success: false, error: mapSupabaseError(error.message) };
    }

    return { success: true };
  } catch (err) {
    console.error('[authService] sendResetPasswordEmail error:', err);
    return { success: false, error: 'Có lỗi xảy ra. Vui lòng thử lại.' };
  }
}

/**
 * Cập nhật mật khẩu mới
 * 
 * Function này được gọi từ trang /reset-password sau khi user click link trong email.
 * Supabase sẽ xác minh token tự động từ URL.
 * 
 * @param newPassword - Mật khẩu mới (ít nhất 6 ký tự)
 * @returns AuthResult với success true nếu đổi mật khẩu thành công
 * 
 * @example
 * ```ts
 * const result = await updatePassword('newPassword123');
 * if (result.success) {
 *   // Chuyển hướng về trang đăng nhập
 * }
 * ```
 */
export async function updatePassword(newPassword: string): Promise<AuthResult> {
  try {
    // Validate password
    if (!newPassword) {
      return { success: false, error: 'Vui lòng nhập mật khẩu mới' };
    }

    if (newPassword.length < 6) {
      return { success: false, error: 'Mật khẩu phải có ít nhất 6 ký tự' };
    }

    // Gọi Supabase Auth để cập nhật mật khẩu
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    // Xử lý lỗi
    if (error) {
      return { success: false, error: mapSupabaseError(error.message) };
    }

    return { success: true, data };
  } catch (err) {
    console.error('[authService] updatePassword error:', err);
    return { success: false, error: 'Có lỗi xảy ra. Vui lòng thử lại.' };
  }
}

/**
 * Đăng xuất tài khoản
 * 
 * @returns AuthResult với success true nếu đăng xuất thành công
 * 
 * @example
 * ```ts
 * await signOut();
 * // Chuyển hướng về trang chủ
 * ```
 */
export async function signOut(): Promise<AuthResult> {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return { success: false, error: mapSupabaseError(error.message) };
    }

    return { success: true };
  } catch (err) {
    console.error('[authService] signOut error:', err);
    return { success: false, error: 'Có lỗi xảy ra. Vui lòng thử lại.' };
  }
}

/**
 * Lấy thông tin user hiện tại
 * 
 * Kiểm tra xem có user đang đăng nhập không.
 * Nếu có session còn hiệu lực, trả về thông tin user.
 * 
 * @returns User hiện tại hoặc null nếu chưa đăng nhập
 * 
 * @example
 * ```ts
 * const user = await getCurrentUser();
 * if (user) {
 *   console.log('User đang đăng nhập:', user.email);
 * } else {
 *   console.log('Chưa đăng nhập');
 * }
 * ```
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    // Lấy session hiện tại từ localStorage
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error) {
      console.error('[authService] getCurrentUser error:', error);
      return null;
    }

    return session?.user ?? null;
  } catch (err) {
    console.error('[authService] getCurrentUser error:', err);
    return null;
  }
}

/**
 * Lắng nghe thay đổi trạng thái auth
 * 
 * Dùng để theo dõi khi user đăng nhập/đăng xuất từ tab khác.
 * 
 * @param callback - Function được gọi khi có thay đổi
 * @returns Hàm cleanup để unmount listener
 * 
 * @example
 * ```ts
 * // Trong useEffect
 * const unsubscribe = onAuthStateChange((user) => {
 *   setUser(user);
 * });
 * 
 * // Cleanup
 * return () => unsubscribe();
 * ```
 */
export function onAuthStateChange(callback: (user: User | null) => void): () => void {
  const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
    callback(session?.user ?? null);
  });

  return () => subscription.unsubscribe();
}

// ============================================
// HÀM HỖ TRỢ
// ============================================

/**
 * Chuyển đổi error message từ Supabase sang tiếng Việt
 * 
 * @param message - Error message từ Supabase
 * @returns Error message đã được dịch sang tiếng Việt
 */
function mapSupabaseError(message: string): string {
  const errorMap: Record<string, string> = {
    'Invalid login credentials': 'Email hoặc mật khẩu không đúng',
    'Email not confirmed': 'Email chưa được xác minh. Vui lòng kiểm tra hộp thư.',
    'User already registered': 'Email này đã được đăng ký',
    'Invalid email': 'Email không hợp lệ',
    'Password should be at least 6 characters': 'Mật khẩu phải có ít nhất 6 ký tự',
    'To reset your password, check your email for a confirmation link': 
      'Đã gửi email đặt lại mật khẩu. Vui lòng kiểm tra hộp thư.',
    'Your new password is the same as the current password': 
      'Mật khẩu mới không được trùng với mật khẩu cũ',
    'Unable to validate email address: Invalid format': 
      'Địa chỉ email không hợp lệ',
    'Signup requires a valid password': 
      'Vui lòng nhập mật khẩu hợp lệ (ít nhất 6 ký tự)',
    'User not found': 
      'Không tìm thấy tài khoản với email này',
    // Rate limit error
    'email rate limit exceeded': 
      'Bạn đã gửi quá nhiều email. Vui lòng đợi 1 tiếng hoặc thử lại sau.',
  };

  // Kiểm tra exact match trước
  if (errorMap[message]) {
    return errorMap[message];
  }

  // Kiểm tra partial match
  const lowerMessage = message.toLowerCase();
  if (lowerMessage.includes('email') && lowerMessage.includes('already')) {
    return 'Email này đã được đăng ký';
  }
  if (lowerMessage.includes('password') && lowerMessage.includes('incorrect')) {
    return 'Mật khẩu không đúng';
  }
  if (lowerMessage.includes('no user') || lowerMessage.includes('invalid')) {
    return 'Email hoặc mật khẩu không đúng';
  }

  // Trả về message gốc nếu không có trong map
  console.warn('[authService] Unknown error:', message);
  return message || 'Có lỗi xảy ra. Vui lòng thử lại.';
}

/**
 * Lấy user metadata (thông tin bổ sung)
 * 
 * @param user - User object từ Supabase
 * @param key - Key của metadata cần lấy
 * @returns Giá trị của metadata hoặc undefined
 * 
 * @example
 * ```ts
 * const user = await getCurrentUser();
 * const fullName = getUserMetadata(user, 'full_name');
 * ```
 */
export function getUserMetadata<T = string>(user: User | null, key: string): T | undefined {
  if (!user?.user_metadata) return undefined;
  return user.user_metadata[key] as T;
}
