/**
 * authService.ts
 * 
 * Authentication service dùng localStorage
 * Không dùng Supabase - mock auth cho development
 */

import { User, Address, STORAGE_KEYS } from '../types/auth';

// ============================================
// CONSTANTS
// ============================================

// localStorage keys cho auth (bổ sung ngoài STORAGE_KEYS từ types)
const AUTH_KEYS = {
  USERS: 'mecsu_auth_users',
  OTP_PENDING: 'mecsu_auth_otp_pending',
} as const;

const OTP_EXPIRY_MINUTES = 5;

// ============================================
// TYPES
// ============================================

export interface AuthResult {
  success: boolean;
  error?: string;
  data?: {
    user: User;
    session: { token: string };
  };
}

interface StoredUser {
  id: string;
  email: string;
  passwordHash: string;
  fullName: string;
  phone: string;
  createdAt: string;
  emailConfirmed: boolean;
}

interface OtpPending {
  email: string;
  type: 'signup' | 'reset_password';
  otp: string;
  expiresAt: number;
  userData?: {
    password: string;
    fullName?: string;
  };
}

const MOCK_ADMIN_CREDENTIALS = {
  email: 'admin@gmail.com',
  password: '123456',
  fullName: 'Admin MECsu',
  phone: '0900000000',
} as const;

// ============================================
// UTILITY FUNCTIONS
// ============================================

function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
}

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function hashPassword(password: string): string {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return 'mecsu_' + Math.abs(hash).toString(16);
}

function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ============================================
// STORAGE FUNCTIONS
// ============================================

function getUsers(): Record<string, StoredUser> {
  try {
    const stored = localStorage.getItem(AUTH_KEYS.USERS);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

function saveUsers(users: Record<string, StoredUser>): void {
  localStorage.setItem(AUTH_KEYS.USERS, JSON.stringify(users));
}

function ensureMockAdminUser(users: Record<string, StoredUser>): Record<string, StoredUser> {
  if (users[MOCK_ADMIN_CREDENTIALS.email]) {
    return users;
  }

  const nextUsers = {
    ...users,
    [MOCK_ADMIN_CREDENTIALS.email]: {
      id: 'mock-admin-user',
      email: MOCK_ADMIN_CREDENTIALS.email,
      passwordHash: hashPassword(MOCK_ADMIN_CREDENTIALS.password),
      fullName: MOCK_ADMIN_CREDENTIALS.fullName,
      phone: MOCK_ADMIN_CREDENTIALS.phone,
      createdAt: new Date().toISOString(),
      emailConfirmed: true,
    },
  };

  saveUsers(nextUsers);
  return nextUsers;
}

function getCurrentUserFromStorage(): User | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

function setCurrentUser(user: User | null): void {
  if (user) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }
  window.dispatchEvent(new CustomEvent('mockAuthChange', { detail: user }));
}

function getPendingOtp(): OtpPending | null {
  try {
    const stored = localStorage.getItem(AUTH_KEYS.OTP_PENDING);
    if (!stored) return null;
    
    const otp: OtpPending = JSON.parse(stored);
    
    if (Date.now() > otp.expiresAt) {
      localStorage.removeItem(AUTH_KEYS.OTP_PENDING);
      return null;
    }
    
    return otp;
  } catch {
    return null;
  }
}

function setPendingOtp(otp: OtpPending | null): void {
  if (otp) {
    localStorage.setItem(AUTH_KEYS.OTP_PENDING, JSON.stringify(otp));
  } else {
    localStorage.removeItem(AUTH_KEYS.OTP_PENDING);
  }
}

// ============================================
// CONVERT STORED USER TO APP USER
// ============================================

function toAppUser(stored: StoredUser): User {
  return {
    id: stored.id,
    email: stored.email,
    fullName: stored.fullName,
    phone: stored.phone,
    addresses: [],
    createdAt: stored.createdAt,
    emailConfirmed: stored.emailConfirmed,
  };
}

// ============================================
// AUTH FUNCTIONS
// ============================================

/**
 * Đăng ký trực tiếp - không cần OTP
 */
export async function signUpDirect(
  email: string,
  password: string,
  fullName?: string
): Promise<AuthResult> {
  await delay(500);

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { success: false, error: 'Email không hợp lệ' };
  }

  if (!password || password.length < 6) {
    return { success: false, error: 'Mật khẩu phải có ít nhất 6 ký tự' };
  }

  const normalizedEmail = email.trim().toLowerCase();
  const users = getUsers();

  if (users[normalizedEmail]) {
    return { success: false, error: 'Email này đã được đăng ký' };
  }

  const newUser: StoredUser = {
    id: generateId(),
    email: normalizedEmail,
    passwordHash: hashPassword(password),
    fullName: fullName || '',
    phone: '',
    createdAt: new Date().toISOString(),
    emailConfirmed: true,
  };

  users[normalizedEmail] = newUser;
  saveUsers(users);

  const appUser = toAppUser(newUser);
  setCurrentUser(appUser);

  console.log('%c✅ ĐĂNG KÝ THÀNH CÔNG!', 'background: #4CAF50; color: white; font-size: 16px; padding: 8px; border-radius: 4px;');
  console.log(`%cXin chào ${appUser.fullName || appUser.email}!`, 'font-size: 14px;');

  return {
    success: true,
    data: {
      user: appUser,
      session: { token: generateId() },
    },
  };
}

/**
 * Đăng ký - gửi OTP đến console (giữ lại để tương thích)
 */
export async function signUpWithPassword(
  email: string,
  password: string,
  fullName?: string
): Promise<AuthResult> {
  await delay(500);

  // Validate
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { success: false, error: 'Email không hợp lệ' };
  }

  if (!password || password.length < 6) {
    return { success: false, error: 'Mật khẩu phải có ít nhất 6 ký tự' };
  }

  const normalizedEmail = email.trim().toLowerCase();
  const users = getUsers();

  if (users[normalizedEmail]) {
    return { success: false, error: 'Email này đã được đăng ký' };
  }

  // Generate OTP
  const otp = generateOtp();
  const expiresAt = Date.now() + (OTP_EXPIRY_MINUTES * 60 * 1000);

  const otpPending: OtpPending = {
    email: normalizedEmail,
    type: 'signup',
    otp,
    expiresAt,
    userData: {
      password,
      fullName,
    },
  };
  setPendingOtp(otpPending);

  // Log OTP to console with styling
  console.log('%c📧 MÃ XÁC MINH ĐĂNG KÝ', 'background: #4CAF50; color: white; font-size: 16px; padding: 8px; border-radius: 4px;');
  console.log(`%cEmail: ${normalizedEmail}`, 'font-size: 14px;');
  console.log(`%c🔐 Mã OTP: ${otp}`, 'font-size: 24px; font-weight: bold; color: #E53935;');
  console.log(`%c⏰ Hết hạn sau: ${OTP_EXPIRY_MINUTES} phút`, 'font-size: 12px; color: #666;');
  console.log('%c⚠️ Copy mã này và nhập vào ứng dụng!', 'font-size: 14px; color: #FF9800; font-weight: bold;');

  return {
    success: true,
    error: `Mã OTP: ${otp}`,
  };
}

/**
 * Xác minh OTP và hoàn tất đăng ký
 */
export async function verifyOtp(email: string, otp: string): Promise<AuthResult> {
  await delay(500);

  const normalizedEmail = email.trim().toLowerCase();
  const pendingOtp = getPendingOtp();

  if (!pendingOtp) {
    return { success: false, error: 'Không có mã OTP nào được gửi. Vui lòng đăng ký lại.' };
  }

  if (pendingOtp.email !== normalizedEmail) {
    return { success: false, error: 'Email không khớp với mã OTP đã gửi.' };
  }

  if (pendingOtp.otp !== otp) {
    return { success: false, error: 'Mã OTP không đúng. Vui lòng thử lại.' };
  }

  // Create user
  const users = getUsers();
  const newUser: StoredUser = {
    id: generateId(),
    email: normalizedEmail,
    passwordHash: hashPassword(pendingOtp.userData!.password),
    fullName: pendingOtp.userData?.fullName || '',
    phone: '',
    createdAt: new Date().toISOString(),
    emailConfirmed: true,
  };

  users[normalizedEmail] = newUser;
  saveUsers(users);
  setPendingOtp(null);

  const appUser = toAppUser(newUser);
  setCurrentUser(appUser);

  console.log('%c✅ ĐĂNG KÝ THÀNH CÔNG!', 'background: #4CAF50; color: white; font-size: 16px; padding: 8px; border-radius: 4px;');
  console.log(`%cXin chào ${appUser.fullName || appUser.email}!`, 'font-size: 14px;');

  return {
    success: true,
    data: {
      user: appUser,
      session: { token: generateId() },
    },
  };
}

/**
 * Đăng nhập
 */
export async function signInWithPassword(
  email: string,
  password: string
): Promise<AuthResult> {
  await delay(500);

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { success: false, error: 'Email không hợp lệ' };
  }

  if (!password) {
    return { success: false, error: 'Vui lòng nhập mật khẩu' };
  }

  const normalizedEmail = email.trim().toLowerCase();
  const users = ensureMockAdminUser(getUsers());
  const user = users[normalizedEmail];

  if (!verifyPassword(password, user.passwordHash)) {
    return { success: false, error: 'Mật khẩu không đúng' };
  }

  const appUser = toAppUser(user);
  setCurrentUser(appUser);

  console.log('%c🔓 ĐĂNG NHẬP THÀNH CÔNG!', 'background: #2196F3; color: white; font-size: 16px; padding: 8px; border-radius: 4px;');
  console.log(`%cXin chào ${appUser.fullName || appUser.email}!`, 'font-size: 14px;');

  return {
    success: true,
    data: {
      user: appUser,
      session: { token: generateId() },
    },
  };
}

/**
 * Đăng xuất
 */
export async function signOut(): Promise<{ success: boolean; error?: string }> {
  await delay(200);
  setCurrentUser(null);
  console.log('%c👋 ĐĂNG XUẤT THÀNH CÔNG!', 'background: #FF9800; color: white; font-size: 16px; padding: 8px; border-radius: 4px;');
  return { success: true };
}

/**
 * Quên mật khẩu - gửi OTP đến console
 */
export async function sendResetPasswordEmail(email: string): Promise<{ success: boolean; error?: string }> {
  await delay(500);

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { success: false, error: 'Email không hợp lệ' };
  }

  const normalizedEmail = email.trim().toLowerCase();
  const users = getUsers();
  const user = users[normalizedEmail];

  if (!user) {
    console.log(`%c📧 Đã gửi email reset password đến: ${normalizedEmail}`, 'font-size: 12px; color: #666;');
    return { success: true };
  }

  // Generate OTP
  const otp = generateOtp();
  const expiresAt = Date.now() + (OTP_EXPIRY_MINUTES * 60 * 1000);

  const otpPending: OtpPending = {
    email: normalizedEmail,
    type: 'reset_password',
    otp,
    expiresAt,
  };
  setPendingOtp(otpPending);

  console.log('%c🔑 MÃ ĐẶT LẠI MẬT KHẨU', 'background: #FF5722; color: white; font-size: 16px; padding: 8px; border-radius: 4px;');
  console.log(`%cEmail: ${normalizedEmail}`, 'font-size: 14px;');
  console.log(`%c🔐 Mã OTP: ${otp}`, 'font-size: 24px; font-weight: bold; color: #E53935;');
  console.log(`%c⏰ Hết hạn sau: ${OTP_EXPIRY_MINUTES} phút`, 'font-size: 12px; color: #666;');

  return { success: true };
}

/**
 * Xác minh OTP và đặt lại mật khẩu
 */
export async function resetPasswordWithOtp(
  email: string,
  otp: string,
  newPassword: string
): Promise<{ success: boolean; error?: string }> {
  await delay(500);

  if (!newPassword || newPassword.length < 6) {
    return { success: false, error: 'Mật khẩu phải có ít nhất 6 ký tự' };
  }

  const normalizedEmail = email.trim().toLowerCase();
  const pendingOtp = getPendingOtp();

  if (!pendingOtp || pendingOtp.email !== normalizedEmail || pendingOtp.otp !== otp) {
    return { success: false, error: 'Mã OTP không hợp lệ hoặc đã hết hạn.' };
  }

  const users = getUsers();
  if (users[normalizedEmail]) {
    users[normalizedEmail].passwordHash = hashPassword(newPassword);
    saveUsers(users);
  }

  setPendingOtp(null);

  console.log('%c🔑 ĐẶT LẠI MẬT KHẨU THÀNH CÔNG!', 'background: #4CAF50; color: white; font-size: 16px; padding: 8px; border-radius: 4px;');

  return { success: true };
}

/**
 * Lấy user hiện tại
 */
export function getCurrentUser(): User | null {
  return getCurrentUserFromStorage();
}

/**
 * Lấy pending OTP info
 */
export function getPendingOtpInfo(): { email: string; expiresAt: number; otp: string } | null {
  const pending = getPendingOtp();
  if (!pending) return null;
  return {
    email: pending.email,
    expiresAt: pending.expiresAt,
    otp: pending.otp,
  };
}

/**
 * Kiểm tra có pending OTP không
 */
export function hasPendingOtp(): boolean {
  return getPendingOtp() !== null;
}

/**
 * Lắng nghe thay đổi trạng thái auth
 * 
 * Dùng để theo dõi khi user đăng nhập/đăng xuất.
 * Hỗ trợ cả cross-tab (storage event) và same-tab (custom event).
 * 
 * @param callback - Function được gọi khi có thay đổi
 * @returns Hàm cleanup để unmount listener
 */
export function onAuthStateChange(callback: (user: User | null) => void): () => void {
  const handleStorageChange = (e: StorageEvent) => {
    if (e.key === STORAGE_KEYS.CURRENT_USER) {
      const user = e.newValue ? JSON.parse(e.newValue) : null;
      callback(user);
    }
  };

  const handleCustomChange = (e: Event) => {
    const customEvent = e as CustomEvent<User | null>;
    callback(customEvent.detail);
  };

  window.addEventListener('storage', handleStorageChange);
  window.addEventListener('mockAuthChange', handleCustomChange as EventListener);

  return () => {
    window.removeEventListener('storage', handleStorageChange);
    window.removeEventListener('mockAuthChange', handleCustomChange as EventListener);
  };
}

// ============================================
// DEBUG HELPERS - Expose to window for DevTools
// ============================================

if (typeof window !== 'undefined') {
  (window as any).listAuthUsers = () => {
    const users = getUsers();
    console.log('%c👥 Tất cả users trong localStorage:', 'font-size: 14px; font-weight: bold;');
    Object.values(users).forEach((u: StoredUser) => {
      console.log(`  - ${u.email} (${u.fullName || 'No name'})`);
    });
  };
  (window as any).getCurrentAuthOtp = () => {
    const pending = getPendingOtp();
    if (pending) {
      console.log(`%c🔐 OTP hiện tại: ${pending.otp}`, 'font-size: 16px; font-weight: bold; color: #E53935;');
      return pending.otp;
    }
    console.log('%cKhông có OTP nào đang chờ', 'color: #666;');
    return null;
  };
  (window as any).clearAuthData = () => {
    localStorage.removeItem(AUTH_KEYS.USERS);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    localStorage.removeItem(AUTH_KEYS.OTP_PENDING);
    console.log('%c🗑️ Đã xóa tất cả auth data!', 'background: #f44336; color: white; padding: 8px; border-radius: 4px;');
  };
}
