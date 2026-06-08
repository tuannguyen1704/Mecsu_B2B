/**
 * LoginModal.tsx
 *
 * Modal đăng nhập với localStorage auth
 * Flow: Nhập email + password -> Đăng nhập
 * Quên mật khẩu: gửi OTP qua console
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Lock, Eye, EyeOff, ArrowLeft, Sparkles, CheckCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { sendResetPasswordEmail, resetPasswordWithOtp, getPendingOtpInfo } from '../services/authService';
import RegisterModal from './RegisterModal';

// ============================================
// TYPES
// ============================================

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Các bước (steps) của modal
type Step =
  | 'login'           // Đăng nhập (email + password)
  | 'forgot_email'    // Quên mật khẩu - nhập email
  | 'forgot_otp'      // Nhập OTP để xác minh
  | 'forgot_password' // Nhập mật khẩu mới
  | 'forgot_success'  // Đã reset password thành công
  | 'register_prompt'; // User mới - mời đăng ký

// ============================================
// COMPONENT
// ============================================

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { login } = useAuth();

  // ============================================
  // STATE
  // ============================================

  const [step, setStep] = useState<Step>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  // Forgot password state
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [otpInfo, setOtpInfo] = useState<{ email: string; expiresAt: number; otp: string } | null>(null);

  // ============================================
  // RESET FORM
  // ============================================

  const resetForm = () => {
    setStep('login');
    setEmail('');
    setPassword('');
    setError('');
    setIsLoading(false);
    setOtp('');
    setNewPassword('');
    setConfirmNewPassword('');
    setShowNewPassword(false);
    setOtpInfo(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  // ============================================
  // XỬ LÝ ĐĂNG NHẬP
  // ============================================

  const handleLogin = async () => {
    // Validate
    if (!email.trim()) {
      setError('Vui lòng nhập email');
      return;
    }

    // Kiểm tra định dạng email
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    if (!isEmail) {
      setError('Vui lòng nhập email hợp lệ');
      return;
    }

    if (!password) {
      setError('Vui lòng nhập mật khẩu');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const result = await login(email.trim(), password);

      if (result.success) {
        handleClose();
      } else {
        const errorMsg = result.error || '';

        // Tài khoản không tồn tại -> mời đăng ký
        if (errorMsg.includes('không tồn tại')) {
          setStep('register_prompt');
          setError('');
        } else {
          // Mật khẩu không đúng hoặc lỗi khác -> hiện thông báo lỗi
          setError(result.error || 'Đăng nhập thất bại');
        }
      }
    } catch (err) {
      setError('Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================
  // XỬ LÝ QUÊN MẬT KHẨU (OTP)
  // ============================================

  const handleForgotPasswordClick = () => {
    setError('');
    setStep('forgot_email');
  };

  const handleSendResetEmail = async () => {
    // Validate email
    if (!email.trim()) {
      setError('Vui lòng nhập email');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Email không hợp lệ');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const result = await sendResetPasswordEmail(email.trim());

      if (result.success) {
        // Get OTP info and show OTP step
        const info = getPendingOtpInfo();
        setOtpInfo(info);
        setStep('forgot_otp');
      } else {
        setError(result.error || 'Không thể gửi OTP. Vui lòng thử lại.');
      }
    } catch (err) {
      setError('Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    // Validate OTP only
    if (!otp || otp.length !== 6) {
      setError('Vui lòng nhập mã OTP 6 số');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      // Get pending OTP info and verify
      const info = getPendingOtpInfo();
      if (!info || info.otp !== otp || info.email !== email.trim().toLowerCase()) {
        setError('Mã OTP không đúng hoặc đã hết hạn');
        setIsLoading(false);
        return;
      }

      // OTP verified - go to password step
      setStep('forgot_password');
      setIsLoading(false);
    } catch (err) {
      setError('Có lỗi xảy ra. Vui lòng thử lại.');
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    // Validate passwords
    if (!newPassword || newPassword.length < 6) {
      setError('Mật khẩu mới phải có ít nhất 6 ký tự');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const result = await resetPasswordWithOtp(email.trim(), otp, newPassword);

      if (result.success) {
        setStep('forgot_success');
      } else {
        setError(result.error || 'Không thể đặt lại mật khẩu.');
      }
    } catch (err) {
      setError('Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    setStep('login');
    setError('');
    setOtp('');
    setNewPassword('');
    setConfirmNewPassword('');
    setOtpInfo(null);
  };

  const handleBackToForgotEmail = () => {
    setStep('forgot_email');
    setError('');
    setOtp('');
  };

  const handleBackToForgotOtp = () => {
    setStep('forgot_otp');
    setError('');
    setNewPassword('');
    setConfirmNewPassword('');
  };

  // ============================================
  // XỬ LÝ PHÍM ENTER
  // ============================================

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (step === 'login') {
        handleLogin();
      } else if (step === 'forgot_email') {
        handleSendResetEmail();
      } else if (step === 'forgot_otp') {
        handleVerifyOtp();
      } else if (step === 'forgot_password') {
        handleResetPassword();
      }
    }
  };

  // ============================================
  // RENDER TIÊU ĐỀ
  // ============================================

  const getTitle = () => {
    switch (step) {
      case 'login': return 'Chào mừng trở lại';
      case 'forgot_email': return 'Khôi phục mật khẩu';
      case 'forgot_otp': return 'Xác minh OTP';
      case 'forgot_password': return 'Đặt lại mật khẩu';
      case 'forgot_success': return 'Thành công';
      case 'register_prompt': return 'Tài khoản mới';
    }
  };

  const getSubtitle = () => {
    switch (step) {
      case 'login': return 'Đăng nhập để tiếp tục mua sắm';
      case 'forgot_email': return 'Nhập email đã đăng ký để nhận mã OTP';
      case 'forgot_otp': return `Nhập mã OTP đã gửi đến ${email}`;
      case 'forgot_password': return 'Nhập mật khẩu mới cho tài khoản của bạn';
      case 'forgot_success': return 'Bạn có thể đăng nhập với mật khẩu mới ngay bây giờ.';
      case 'register_prompt': return 'Tạo tài khoản để không bỏ lỡ ưu đãi';
    }
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[400]"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-0 z-[400] flex items-center justify-center p-4 pointer-events-none"
            >
              <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl pointer-events-auto overflow-hidden">
                {/* Header */}
                <div className="relative px-8 pt-8 pb-6 bg-gradient-to-b from-slate-50 to-white">
                  <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 transition-colors"
                  >
                    <X size={20} className="text-slate-400" />
                  </button>

                  {/* Logo */}
                  <div className="flex items-center gap-2 mb-6">
                    <div className="bg-[#003B73] text-[#FFC72C] font-black text-lg w-10 h-10 flex items-center justify-center rounded-lg">
                      M
                    </div>
                    <span className="font-black text-xl text-[#003B73] italic tracking-tighter">MECSU</span>
                  </div>

                  {/* Title */}
                  <h2 className="text-2xl font-bold text-slate-800 mb-1">
                    {getTitle()}
                  </h2>
                  <p className="text-sm text-slate-500">
                    {getSubtitle()}
                  </p>
                </div>

                {/* Content */}
                <div className="px-8 pb-8">
                  <AnimatePresence mode="wait">
                    {/* ============================================ */}
                    {/* STEP: LOGIN (ĐĂNG NHẬP) */}
                    {/* ============================================ */}
                    {step === 'login' && (
                      <motion.div
                        key="login"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="space-y-4"
                      >
                        {/* Email Input */}
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-2">
                            Email
                          </label>
                          <div className="relative">
                            <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                              type="email"
                              value={email}
                              onChange={(e) => {
                                setEmail(e.target.value);
                                setError('');
                              }}
                              onKeyPress={handleKeyPress}
                              placeholder="nguyen@example.com"
                              className="w-full pl-11 pr-4 py-3.5 border border-[#E2E8F0] rounded-xl text-sm
                                bg-white hover:border-slate-300 focus:border-[#003B73] focus:ring-2 focus:ring-[#003B73]/10
                                transition-all outline-none"
                              autoFocus
                            />
                          </div>
                        </div>

                        {/* Password Input */}
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-2">
                            Mật khẩu
                          </label>
                          <div className="relative">
                            <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                              type={showPassword ? 'text' : 'password'}
                              value={password}
                              onChange={(e) => {
                                setPassword(e.target.value);
                                setError('');
                              }}
                              onKeyPress={handleKeyPress}
                              placeholder="Nhập mật khẩu"
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

                        {/* Error Message */}
                        {error && (
                          <p className="text-sm text-red-500 bg-red-50 px-4 py-2 rounded-lg">{error}</p>
                        )}

                        {/* Login Button */}
                        <button
                          onClick={handleLogin}
                          disabled={isLoading}
                          className="w-full py-3.5 bg-[#003B73] text-white font-bold text-sm uppercase tracking-wider
                            rounded-xl hover:bg-[#002d5a] transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                        >
                          {isLoading ? (
                            <>
                              <Loader2 size={18} className="animate-spin" />
                              Đang đăng nhập...
                            </>
                          ) : (
                            'Đăng nhập'
                          )}
                        </button>

                        {/* Forgot Password Link */}
                        <p className="text-center">
                          <button
                            onClick={handleForgotPasswordClick}
                            className="text-sm text-[#003B73] font-semibold hover:underline"
                          >
                            Quên mật khẩu?
                          </button>
                        </p>

                        {/* Register Link */}
                        <p className="text-center text-xs text-slate-400 mt-4">
                          Chưa có tài khoản?{' '}
                          <button
                            onClick={() => setIsRegisterOpen(true)}
                            className="text-[#003B73] font-semibold hover:underline"
                          >
                            Đăng ký ngay
                          </button>
                        </p>
                      </motion.div>
                    )}

                    {/* ============================================ */}
                    {/* STEP: FORGOT EMAIL (NHẬP EMAIL) */}
                    {/* ============================================ */}
                    {step === 'forgot_email' && (
                      <motion.div
                        key="forgot_email"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="space-y-4"
                      >
                        {/* Back Button */}
                        <button
                          onClick={handleBackToLogin}
                          className="flex items-center gap-1 text-sm text-slate-500 hover:text-[#003B73] transition-colors mb-2"
                        >
                          <ArrowLeft size={14} />
                          Quay lại đăng nhập
                        </button>

                        {/* Email Input */}
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-2">
                            Email đã đăng ký
                          </label>
                          <div className="relative">
                            <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                              type="email"
                              value={email}
                              onChange={(e) => {
                                setEmail(e.target.value);
                                setError('');
                              }}
                              onKeyPress={handleKeyPress}
                              placeholder="nguyen@example.com"
                              className="w-full pl-11 pr-4 py-3.5 border border-[#E2E8F0] rounded-xl text-sm
                                bg-white hover:border-slate-300 focus:border-[#003B73] focus:ring-2 focus:ring-[#003B73]/10
                                transition-all outline-none"
                              autoFocus
                            />
                          </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                          <p className="text-sm text-red-500 bg-red-50 px-4 py-2 rounded-lg">{error}</p>
                        )}

                        {/* Send Reset Email Button */}
                        <button
                          onClick={handleSendResetEmail}
                          disabled={isLoading}
                          className="w-full py-3.5 bg-[#003B73] text-white font-bold text-sm uppercase tracking-wider
                            rounded-xl hover:bg-[#002d5a] transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                        >
                          {isLoading ? (
                            <>
                              <Loader2 size={18} className="animate-spin" />
                              Đang gửi...
                            </>
                          ) : (
                            'Gửi mã OTP'
                          )}
                        </button>

                        {/* Help Text */}
                        <p className="text-xs text-slate-400 text-center mt-4">
                          Chúng tôi sẽ gửi mã OTP 6 số đến email của bạn.
                          <br />
                          Mở DevTools Console (F12) để xem mã OTP.
                        </p>
                      </motion.div>
                    )}

                    {/* ============================================ */}
                    {/* STEP: FORGOT OTP (CHỈ NHẬP OTP) */}
                    {/* ============================================ */}
                    {step === 'forgot_otp' && (
                      <motion.div
                        key="forgot_otp"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="space-y-4"
                      >
                        {/* Back Button */}
                        <button
                          onClick={handleBackToForgotEmail}
                          className="flex items-center gap-1 text-sm text-slate-500 hover:text-[#003B73] transition-colors mb-2"
                        >
                          <ArrowLeft size={14} />
                          Quay lại
                        </button>

                        {/* OTP Info */}
                        <div className="bg-[#003B73]/5 rounded-xl p-4 text-center">
                          <p className="text-sm text-slate-600 mb-2">
                            Mã OTP đã được gửi đến:
                          </p>
                          <p className="font-semibold text-[#003B73]">{email}</p>
                          <p className="text-xs text-slate-500 mt-2">
                            Mở DevTools Console (F12) để xem mã OTP
                          </p>
                        </div>

                        {/* OTP Input */}
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
                              if (error) setError('');
                            }}
                            onKeyPress={handleKeyPress}
                            placeholder="000000"
                            maxLength={6}
                            className="w-full px-4 py-4 text-center text-2xl tracking-[0.5em] border border-[#E2E8F0] rounded-xl
                              bg-white hover:border-slate-300 focus:border-[#003B73] focus:ring-2 focus:ring-[#003B73]/10
                              transition-all outline-none font-mono"
                            autoFocus
                          />
                        </div>

                        {/* Error Message */}
                        {error && (
                          <p className="text-sm text-red-500 bg-red-50 px-4 py-2 rounded-lg">{error}</p>
                        )}

                        {/* Submit Button */}
                        <button
                          onClick={handleVerifyOtp}
                          disabled={isLoading}
                          className="w-full py-3.5 bg-[#003B73] text-white font-bold text-sm uppercase tracking-wider
                            rounded-xl hover:bg-[#002d5a] transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                        >
                          {isLoading ? (
                            <>
                              <Loader2 size={18} className="animate-spin" />
                              Đang xử lý...
                            </>
                          ) : (
                            'Xác minh OTP'
                          )}
                        </button>
                      </motion.div>
                    )}

                    {/* ============================================ */}
                    {/* STEP: FORGOT PASSWORD (NHẬP MẬT KHẨU MỚI) */}
                    {/* ============================================ */}
                    {step === 'forgot_password' && (
                      <motion.div
                        key="forgot_password"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="space-y-4"
                      >
                        {/* Back Button */}
                        <button
                          onClick={handleBackToForgotOtp}
                          className="flex items-center gap-1 text-sm text-slate-500 hover:text-[#003B73] transition-colors mb-2"
                        >
                          <ArrowLeft size={14} />
                          Quay lại
                        </button>

                        {/* New Password */}
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-2">
                            Mật khẩu mới
                          </label>
                          <div className="relative">
                            <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                              type={showNewPassword ? 'text' : 'password'}
                              value={newPassword}
                              onChange={(e) => {
                                setNewPassword(e.target.value);
                                if (error) setError('');
                              }}
                              onKeyPress={handleKeyPress}
                              placeholder="Ít nhất 6 ký tự"
                              className="w-full pl-11 pr-12 py-3.5 border border-[#E2E8F0] rounded-xl text-sm
                                bg-white hover:border-slate-300 focus:border-[#003B73] focus:ring-2 focus:ring-[#003B73]/10
                                transition-all outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => setShowNewPassword(!showNewPassword)}
                              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            >
                              {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                          </div>
                        </div>

                        {/* Confirm New Password */}
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-2">
                            Xác nhận mật khẩu mới
                          </label>
                          <div className="relative">
                            <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                              type={showNewPassword ? 'text' : 'password'}
                              value={confirmNewPassword}
                              onChange={(e) => {
                                setConfirmNewPassword(e.target.value);
                                if (error) setError('');
                              }}
                              onKeyPress={handleKeyPress}
                              placeholder="Nhập lại mật khẩu mới"
                              className="w-full pl-11 pr-12 py-3.5 border border-[#E2E8F0] rounded-xl text-sm
                                bg-white hover:border-slate-300 focus:border-[#003B73] focus:ring-2 focus:ring-[#003B73]/10
                                transition-all outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => setShowNewPassword(!showNewPassword)}
                              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            >
                              {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                          </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                          <p className="text-sm text-red-500 bg-red-50 px-4 py-2 rounded-lg">{error}</p>
                        )}

                        {/* Submit Button */}
                        <button
                          onClick={handleResetPassword}
                          disabled={isLoading}
                          className="w-full py-3.5 bg-[#FFC72C] text-[#111827] font-bold text-sm uppercase tracking-wider
                            rounded-xl hover:bg-[#E8B931] transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                        >
                          {isLoading ? (
                            <>
                              <Loader2 size={18} className="animate-spin" />
                              Đang xử lý...
                            </>
                          ) : (
                            'Đặt lại mật khẩu'
                          )}
                        </button>
                      </motion.div>
                    )}

                    {/* ============================================ */}
                    {/* STEP: FORGOT SUCCESS */}
                    {/* ============================================ */}
                    {step === 'forgot_success' && (
                      <motion.div
                        key="forgot_success"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="space-y-4"
                      >
                        {/* Success Icon */}
                        <div className="text-center py-6">
                          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                            <CheckCircle size={40} className="text-green-600" />
                          </div>
                          <p className="text-lg font-semibold text-[#003B73] mb-2">
                            Đặt lại mật khẩu thành công!
                          </p>
                          <p className="text-sm text-slate-500 mb-4">
                            Bạn có thể đăng nhập với mật khẩu mới ngay bây giờ.
                          </p>
                        </div>

                        {/* Back to Login */}
                        <button
                          onClick={handleBackToLogin}
                          className="w-full py-3 bg-[#003B73] text-white font-bold text-sm uppercase tracking-wider
                            rounded-xl hover:bg-[#002d5a] transition-colors"
                        >
                          Đăng nhập ngay
                        </button>
                      </motion.div>
                    )}

                    {/* ============================================ */}
                    {/* STEP: REGISTER PROMPT (USER MỚI) */}
                    {/* ============================================ */}
                    {step === 'register_prompt' && (
                      <motion.div
                        key="register_prompt"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="space-y-4"
                      >
                        {/* Back Button */}
                        <button
                          onClick={handleBackToLogin}
                          className="flex items-center gap-1 text-sm text-slate-500 hover:text-[#003B73] transition-colors mb-2"
                        >
                          <ArrowLeft size={14} />
                          Quay lại đăng nhập
                        </button>

                        {/* New User Prompt */}
                        <div className="text-center py-4">
                          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#FFC72C]/10 flex items-center justify-center">
                            <Sparkles size={28} className="text-[#FFC72C]" />
                          </div>
                          <h3 className="text-lg font-bold text-slate-800 mb-2">
                            Looks like you're new to Mecsu!
                          </h3>
                          <p className="text-sm text-slate-500">
                            Tạo tài khoản với <span className="font-semibold text-[#003B73]">{email}</span> để nhận ưu đãi dành riêng cho khách hàng mới.
                          </p>
                        </div>

                        {/* Create Account Button */}
                        <button
                          onClick={() => setIsRegisterOpen(true)}
                          className="w-full py-3.5 bg-[#FFC72C] text-[#111827] font-bold text-sm uppercase tracking-wider
                            rounded-xl hover:bg-[#E8B931] transition-colors"
                        >
                          Tạo tài khoản
                        </button>

                        {/* Forgot Password Link */}
                        <p className="text-center">
                          <button
                            onClick={handleForgotPasswordClick}
                            className="text-sm text-[#003B73] font-semibold hover:underline"
                          >
                            Quên mật khẩu?
                          </button>
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Footer */}
                <div className="px-8 py-4 bg-slate-50 border-t border-[#E2E8F0]">
                  <p className="text-xs text-slate-400 text-center">
                    Bằng việc đăng nhập, bạn đồng ý với{' '}
                    <a href="#" className="text-[#003B73] hover:underline">Điều khoản sử dụng</a>
                    {' '}và{' '}
                    <a href="#" className="text-[#003B73] hover:underline">Chính sách bảo mật</a>
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Register Modal */}
      <RegisterModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onSuccess={handleClose}
      />
    </>
  );
}
