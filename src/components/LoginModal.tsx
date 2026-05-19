import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Lock, Eye, EyeOff, User, ChevronDown, ArrowLeft, Sparkles } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import RegisterModal from './RegisterModal';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { login, accountExists } = useAuth();
  
  // Step: 'email' | 'password' | 'register_prompt'
  const [step, setStep] = useState<'email' | 'password' | 'register_prompt'>('email');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const resetForm = () => {
    setStep('email');
    setEmailOrPhone('');
    setPassword('');
    setError('');
    setIsLoading(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleEmailSubmit = async () => {
    if (!emailOrPhone.trim()) {
      setError('Vui lòng nhập email hoặc số điện thoại');
      return;
    }

    setError('');
    setIsLoading(true);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    if (accountExists(emailOrPhone)) {
      setStep('password');
    } else {
      setStep('register_prompt');
    }

    setIsLoading(false);
  };

  const handlePasswordSubmit = async () => {
    if (!password) {
      setError('Vui lòng nhập mật khẩu');
      return;
    }

    setError('');
    setIsLoading(true);

    const result = await login(emailOrPhone, password);
    
    setIsLoading(false);

    if (result.success) {
      handleClose();
    } else {
      setError(result.error || 'Đăng nhập thất bại');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (step === 'email') {
        handleEmailSubmit();
      } else if (step === 'password') {
        handlePasswordSubmit();
      }
    }
  };

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
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />
            
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
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
                    {step === 'email' && 'Chào mừng trở lại'}
                    {step === 'password' && 'Nhập mật khẩu'}
                    {step === 'register_prompt' && 'Tài khoản mới'}
                  </h2>
                  <p className="text-sm text-slate-500">
                    {step === 'email' && 'Đăng nhập để tiếp tục mua sắm'}
                    {step === 'password' && `Đăng nhập với ${emailOrPhone}`}
                    {step === 'register_prompt' && 'Tạo tài khoản để không bỏ lỡ ưu đãi'}
                  </p>
                </div>

                {/* Content */}
                <div className="px-8 pb-8">
                  <AnimatePresence mode="wait">
                    {/* Step: Email Input */}
                    {step === 'email' && (
                      <motion.div
                        key="email"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="space-y-4"
                      >
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-2">
                            Email hoặc Số điện thoại
                          </label>
                          <div className="relative">
                            <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                              type="text"
                              value={emailOrPhone}
                              onChange={(e) => setEmailOrPhone(e.target.value)}
                              onKeyPress={handleKeyPress}
                              placeholder="nguyen@example.com"
                              className="w-full pl-11 pr-4 py-3.5 border border-[#E2E8F0] rounded-xl text-sm
                                bg-white hover:border-slate-300 focus:border-[#003B73] focus:ring-2 focus:ring-[#003B73]/10
                                transition-all outline-none"
                              autoFocus
                            />
                          </div>
                        </div>

                        {error && (
                          <p className="text-sm text-red-500 bg-red-50 px-4 py-2 rounded-lg">{error}</p>
                        )}

                        <button
                          onClick={handleEmailSubmit}
                          disabled={isLoading}
                          className="w-full py-3.5 bg-[#003B73] text-white font-bold text-sm uppercase tracking-wider
                            rounded-xl hover:bg-[#002d5a] transition-colors disabled:opacity-60"
                        >
                          {isLoading ? 'Đang kiểm tra...' : 'Tiếp tục'}
                        </button>

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

                    {/* Step: Password Input */}
                    {step === 'password' && (
                      <motion.div
                        key="password"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="space-y-4"
                      >
                        <button
                          onClick={() => setStep('email')}
                          className="flex items-center gap-1 text-sm text-slate-500 hover:text-[#003B73] transition-colors mb-2"
                        >
                          <ArrowLeft size={14} />
                          Thay đổi email
                        </button>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-2">
                            Mật khẩu
                          </label>
                          <div className="relative">
                            <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                              type={showPassword ? 'text' : 'password'}
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              onKeyPress={handleKeyPress}
                              placeholder="Nhập mật khẩu"
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

                        {error && (
                          <p className="text-sm text-red-500 bg-red-50 px-4 py-2 rounded-lg">{error}</p>
                        )}

                        <button
                          onClick={handlePasswordSubmit}
                          disabled={isLoading}
                          className="w-full py-3.5 bg-[#003B73] text-white font-bold text-sm uppercase tracking-wider
                            rounded-xl hover:bg-[#002d5a] transition-colors disabled:opacity-60"
                        >
                          {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                        </button>

                        <p className="text-center">
                          <button className="text-sm text-[#003B73] font-semibold hover:underline">
                            Quên mật khẩu?
                          </button>
                        </p>
                      </motion.div>
                    )}

                    {/* Step: New User Prompt */}
                    {step === 'register_prompt' && (
                      <motion.div
                        key="register_prompt"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="space-y-4"
                      >
                        <div className="text-center py-6">
                          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#FFC72C]/10 flex items-center justify-center">
                            <Sparkles size={28} className="text-[#FFC72C]" />
                          </div>
                          <h3 className="text-lg font-bold text-slate-800 mb-2">
                            Looks like you're new to Mecsu!
                          </h3>
                          <p className="text-sm text-slate-500">
                            Tạo tài khoản với <span className="font-semibold text-[#003B73]">{emailOrPhone}</span> để nhận ưu đãi dành riêng cho khách hàng mới.
                          </p>
                        </div>

                        <button
                          onClick={() => setIsRegisterOpen(true)}
                          className="w-full py-3.5 bg-[#FFC72C] text-[#111827] font-bold text-sm uppercase tracking-wider
                            rounded-xl hover:bg-[#E8B931] transition-colors"
                        >
                          Tạo tài khoản
                        </button>

                        <button
                          onClick={() => setStep('email')}
                          className="w-full py-3 text-slate-500 font-medium text-sm hover:text-slate-700 transition-colors"
                        >
                          Thử email khác
                        </button>
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
        prefilledEmail={step === 'register_prompt' ? emailOrPhone : ''}
        onSuccess={handleClose}
      />
    </>
  );
}
