/**
 * ResetPasswordPage.tsx
 *
 * Trang đặt lại mật khẩu bằng OTP
 * User nhập email -> OTP gửi qua console -> Nhập OTP + mật khẩu mới
 * Trang này có thể truy cập trực tiếp hoặc từ LoginModal forgot flow
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Lock, Eye, EyeOff, ArrowLeft, CheckCircle, Loader2 } from 'lucide-react';
import { sendResetPasswordEmail, resetPasswordWithOtp, getPendingOtpInfo } from '../services/authService';

// ============================================
// TYPES
// ============================================

type Status = 'idle' | 'loading' | 'success' | 'error';
type Step = 'email' | 'otp' | 'password' | 'success';

// ============================================
// COMPONENT
// ============================================

export default function ResetPasswordPage() {
  const navigate = useNavigate();

  // State
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(5);

  // ============================================
  // HANDLERS
  // ============================================

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Vui lòng nhập email hợp lệ');
      return;
    }

    setError('');
    setStatus('loading');

    try {
      const result = await sendResetPasswordEmail(email.trim());
      if (result.success) {
        setStep('otp');
        setStatus('idle');
      } else {
        setStatus('error');
        setError(result.error || 'Có lỗi xảy ra.');
      }
    } catch {
      setStatus('error');
      setError('Có lỗi xảy ra. Vui lòng thử lại.');
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!otp || otp.length !== 6) {
      setError('Vui lòng nhập mã OTP 6 số');
      return;
    }

    setError('');
    setStatus('loading');

    try {
      const info = getPendingOtpInfo();
      if (!info || info.otp !== otp || info.email !== email.trim().toLowerCase()) {
        setStatus('error');
        setError('Mã OTP không đúng hoặc đã hết hạn');
        return;
      }

      // OTP verified - go to password step
      setStep('password');
      setStatus('idle');
    } catch {
      setStatus('error');
      setError('Có lỗi xảy ra. Vui lòng thử lại.');
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPassword || newPassword.length < 6) {
      setError('Mật khẩu mới phải có ít nhất 6 ký tự');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    setError('');
    setStatus('loading');

    try {
      const result = await resetPasswordWithOtp(email.trim(), otp, newPassword);
      if (result.success) {
        setStep('success');
        setStatus('success');

        // Countdown to redirect
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
      } else {
        setStatus('error');
        setError(result.error || 'Mã OTP không hợp lệ hoặc đã hết hạn.');
      }
    } catch {
      setStatus('error');
      setError('Có lỗi xảy ra. Vui lòng thử lại.');
    }
  };

  const handleGoBackToEmail = () => {
    setStep('email');
    setStatus('idle');
    setError('');
    setOtp('');
  };

  const handleGoBackToOtp = () => {
    setStep('otp');
    setStatus('idle');
    setError('');
    setNewPassword('');
    setConfirmPassword('');
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
              {step === 'success' ? 'Đặt lại mật khẩu thành công' : 'Khôi phục mật khẩu'}
            </h1>
            <p className="text-sm text-slate-500">
              {step === 'success'
                ? 'Mật khẩu của bạn đã được thay đổi thành công.'
                : step === 'otp'
                ? `Nhập mã OTP đã gửi đến ${email}`
                : step === 'password'
                ? 'Nhập mật khẩu mới'
                : 'Nhập email đã đăng ký để nhận mã OTP'}
            </p>
          </div>

          {/* Content */}
          <div className="px-8 pb-8">
            {/* ============================================ */}
            {/* SUCCESS STATE */}
            {/* ============================================ */}
            {step === 'success' && (
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
            {/* STEP: ENTER EMAIL */}
            {/* ============================================ */}
            {step === 'email' && (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <p className="text-xs text-slate-500 text-center mb-2">
                  Mở DevTools Console (F12) để xem mã OTP
                </p>

                {/* Email */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-2">
                    Email đã đăng ký
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(''); }}
                    placeholder="nguyen@example.com"
                    className="w-full px-4 py-3.5 border border-[#E2E8F0] rounded-xl text-sm
                      bg-white hover:border-slate-300 focus:border-[#003B73] focus:ring-2 focus:ring-[#003B73]/10
                      transition-all outline-none"
                    autoFocus
                  />
                </div>

                {/* Error */}
                {error && (
                  <p className="text-sm text-red-500 bg-red-50 px-4 py-2 rounded-lg">{error}</p>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full py-3.5 bg-[#003B73] text-white font-bold text-sm uppercase tracking-wider
                    rounded-xl hover:bg-[#002d5a] transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {status === 'loading' ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Đang gửi...
                    </>
                  ) : (
                    'Gửi mã OTP'
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

            {/* ============================================ */}
            {/* STEP: ENTER OTP */}
            {/* ============================================ */}
            {step === 'otp' && (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                {/* Back Button */}
                <button
                  type="button"
                  onClick={handleGoBackToEmail}
                  className="flex items-center gap-1 text-sm text-slate-500 hover:text-[#003B73] transition-colors mb-2"
                >
                  <ArrowLeft size={14} />
                  Nhập lại email
                </button>

                {/* OTP Info */}
                <div className="bg-[#003B73]/5 rounded-xl p-3 text-center">
                  <p className="text-xs text-slate-500">
                    Mở DevTools Console (F12) để xem mã OTP
                  </p>
                </div>

                {/* OTP */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-2">
                    Mã OTP (6 số)
                  </label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                      setOtp(value);
                      setError('');
                    }}
                    placeholder="000000"
                    maxLength={6}
                    className="w-full px-4 py-4 text-center text-2xl tracking-[0.5em] border border-[#E2E8F0] rounded-xl
                      bg-white hover:border-slate-300 focus:border-[#003B73] focus:ring-2 focus:ring-[#003B73]/10
                      transition-all outline-none font-mono"
                    autoFocus
                  />
                </div>

                {/* Error */}
                {error && (
                  <p className="text-sm text-red-500 bg-red-50 px-4 py-2 rounded-lg">{error}</p>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full py-3.5 bg-[#003B73] text-white font-bold text-sm uppercase tracking-wider
                    rounded-xl hover:bg-[#002d5a] transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {status === 'loading' ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Đang xác minh...
                    </>
                  ) : (
                    'Xác minh OTP'
                  )}
                </button>

                {/* Back to Home */}
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="w-full py-3 text-slate-500 font-medium text-sm hover:text-slate-700 transition-colors"
                >
                  Quay về trang chủ
                </button>
              </form>
            )}

            {/* ============================================ */}
            {/* STEP: ENTER NEW PASSWORD */}
            {/* ============================================ */}
            {step === 'password' && (
              <form onSubmit={handleResetPassword} className="space-y-4">
                {/* Back Button */}
                <button
                  type="button"
                  onClick={handleGoBackToOtp}
                  className="flex items-center gap-1 text-sm text-slate-500 hover:text-[#003B73] transition-colors mb-2"
                >
                  <ArrowLeft size={14} />
                  Nhập lại OTP
                </button>

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
                      onChange={(e) => { setNewPassword(e.target.value); setError(''); }}
                      placeholder="Ít nhất 6 ký tự"
                      className="w-full pl-11 pr-12 py-3.5 border border-[#E2E8F0] rounded-xl text-sm
                        bg-white hover:border-slate-300 focus:border-[#003B73] focus:ring-2 focus:ring-[#003B73]/10
                        transition-all outline-none"
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
                      onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }}
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

                {/* Error */}
                {error && (
                  <p className="text-sm text-red-500 bg-red-50 px-4 py-2 rounded-lg">{error}</p>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full py-3.5 bg-[#FFC72C] text-[#111827] font-bold text-sm uppercase tracking-wider
                    rounded-xl hover:bg-[#E8B931] transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
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
