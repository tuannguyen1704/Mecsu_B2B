/**
 * ResetPasswordPage.tsx
 * 
 * Trang đặt lại mật khẩu mới
 * User sẽ đến trang này khi click link trong email
 * URL sẽ có dạng: /reset-password?token=xxx&email=xxx
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { updatePassword } from '../services/authService';

// ============================================
// TYPES
// ============================================

type Status = 'idle' | 'loading' | 'success' | 'error';

// ============================================
// COMPONENT
// ============================================

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Lấy token và email từ URL (Supabase truyền vào)
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  // State
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(5);

  // ============================================
  // VALIDATION
  // ============================================

  const validatePassword = useCallback((password: string): string | null => {
    if (!password) {
      return 'Vui lòng nhập mật khẩu mới';
    }
    if (password.length < 6) {
      return 'Mật khẩu phải có ít nhất 6 ký tự';
    }
    return null;
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate
    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Mật khẩu không khớp');
      return;
    }

    // Kiểm tra token
    if (!token) {
      setError('Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn');
      return;
    }

    setError('');
    setStatus('loading');

    try {
      const result = await updatePassword(newPassword);

      if (result.success) {
        setStatus('success');
        
        // Countdown để chuyển hướng
        const timer = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              navigate('/');
              return 0;
            }
            return prev - 1;
          });
        }, 1000);

        return () => clearInterval(timer);
      } else {
        setStatus('error');
        setError(result.error || 'Có lỗi xảy ra. Vui lòng thử lại.');
      }
    } catch (err) {
      setStatus('error');
      setError('Có lỗi xảy ra. Vui lòng thử lại.');
    }
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        {/* Card Container */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="relative px-8 pt-8 pb-6 bg-gradient-to-b from-slate-50 to-white">
            {/* Logo */}
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-[#003B73] text-[#FFC72C] font-black text-lg w-10 h-10 flex items-center justify-center rounded-lg">
                M
              </div>
              <span className="font-black text-xl text-[#003B73] italic tracking-tighter">MECSU</span>
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold text-slate-800 mb-2">
              {status === 'success' ? 'Đặt lại mật khẩu thành công' : 'Tạo mật khẩu mới'}
            </h1>
            <p className="text-sm text-slate-500">
              {status === 'success' 
                ? 'Mật khẩu của bạn đã được thay đổi thành công.'
                : 'Nhập mật khẩu mới cho tài khoản của bạn.'
              }
            </p>
          </div>

          {/* Content */}
          <div className="px-8 pb-8">
            {/* ============================================ */}
            {/* SUCCESS STATE */}
            {/* ============================================ */}
            {status === 'success' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                {/* Success Icon */}
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle size={40} className="text-green-600" />
                </div>

                <p className="text-slate-600 mb-6">
                  Bạn có thể đăng nhập với mật khẩu mới ngay bây giờ.
                </p>

                {/* Redirect Info */}
                <p className="text-sm text-slate-400">
                  Chuyển hướng về trang chủ sau <span className="font-semibold text-[#003B73]">{countdown}</span> giây...
                </p>

                {/* Manual Redirect */}
                <button
                  onClick={() => navigate('/')}
                  className="mt-4 text-sm text-[#003B73] font-semibold hover:underline"
                >
                  Quay về trang chủ ngay
                </button>
              </motion.div>
            )}

            {/* ============================================ */}
            {/* FORM STATE */}
            {/* ============================================ */}
            {status !== 'success' && (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Token Warning */}
                {!token && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-amber-800">Link không hợp lệ</p>
                        <p className="text-xs text-amber-600 mt-1">
                          Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn. 
                          Vui lòng yêu cầu gửi lại email đặt lại mật khẩu.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* New Password */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-2">
                    Mật khẩu mới
                  </label>
                  <div className="relative">
                    <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => {
                        setNewPassword(e.target.value);
                        setError('');
                      }}
                      placeholder="Ít nhất 6 ký tự"
                      className="w-full pl-11 pr-12 py-3.5 border border-[#E2E8F0] rounded-xl text-sm
                        bg-white hover:border-slate-300 focus:border-[#003B73] focus:ring-2 focus:ring-[#003B73]/10
                        transition-all outline-none"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-2">
                    Xác nhận mật khẩu mới
                  </label>
                  <div className="relative">
                    <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        setError('');
                      }}
                      placeholder="Nhập lại mật khẩu mới"
                      className="w-full pl-11 pr-12 py-3.5 border border-[#E2E8F0] rounded-xl text-sm
                        bg-white hover:border-slate-300 focus:border-[#003B73] focus:ring-2 focus:ring-[#003B73]/10
                        transition-all outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50 border border-red-200 rounded-xl p-4"
                  >
                    <div className="flex items-start gap-3">
                      <AlertCircle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-red-600">{error}</p>
                    </div>
                  </motion.div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={status === 'loading' || !token}
                  className="w-full py-3.5 bg-[#FFC72C] text-[#111827] font-bold text-sm uppercase tracking-wider
                    rounded-xl hover:bg-[#E8B931] transition-colors disabled:opacity-60 disabled:cursor-not-allowed
                    flex items-center justify-center gap-2"
                >
                  {status === 'loading' ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Đang xử lý...
                    </>
                  ) : (
                    'Đặt lại mật khẩu'
                  )}
                </button>

                {/* Back to Login */}
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="w-full py-3 text-slate-500 font-medium text-sm hover:text-slate-700 transition-colors"
                >
                  Quay về trang chủ
                </button>
              </form>
            )}
          </div>

          {/* Footer */}
          <div className="px-8 py-4 bg-slate-50 border-t border-[#E2E8F0]">
            <p className="text-xs text-slate-400 text-center">
              Bằng việc tiếp tục, bạn đồng ý với{' '}
              <a href="#" className="text-[#003B73] hover:underline">Điều khoản sử dụng</a>
              {' '}và{' '}
              <a href="#" className="text-[#003B73] hover:underline">Chính sách bảo mật</a>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
