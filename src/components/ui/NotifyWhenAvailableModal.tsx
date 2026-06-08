import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Bell, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product } from '../../types';
import { useSupabaseImages } from '../../hooks/useSupabaseImages';
import { useAuth } from '../../hooks/useAuth';

interface NotifyWhenAvailableModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onSuccess?: () => void;
}

export const NotifyWhenAvailableModal: React.FC<NotifyWhenAvailableModalProps> = ({
  isOpen,
  onClose,
  product,
  onSuccess,
}) => {
  const [email, setEmail] = useState('');
  const [sendEmail, setSendEmail] = useState(true);
  const [emailError, setEmailError] = useState('');
  const { user, isLoggedIn } = useAuth();
  const { getRandomImage } = useSupabaseImages();

  // Prefill email if logged in
  useEffect(() => {
    if (isLoggedIn && user?.email) {
      setEmail(user.email);
    }
  }, [isLoggedIn, user]);

  // Prevent scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Close on ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setEmailError('Vui lòng nhập email');
      return;
    }
    
    if (!validateEmail(email)) {
      setEmailError('Email không hợp lệ');
      return;
    }
    
    setEmailError('');
    
    // Save notification to localStorage (mock backend)
    const notifications = JSON.parse(localStorage.getItem('productNotifications') || '[]');
    const newNotification = {
      id: Date.now(),
      productId: product?.id,
      productName: product?.name,
      productSku: product?.sku,
      email,
      createdAt: new Date().toISOString(),
    };
    notifications.push(newNotification);
    localStorage.setItem('productNotifications', JSON.stringify(notifications));
    
    onSuccess?.();
    onClose();
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  if (!product) return null;

  const imageUrl = getRandomImage(product.name || product.id);

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleOverlayClick}
          className="fixed inset-0 z-[400] flex items-center justify-center p-4 bg-[#0F172A]/45 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            className="relative z-[401] w-full max-w-[420px] bg-white rounded-[20px] border border-[#E5E7EB] shadow-[0_24px_80px_rgba(15,23,42,0.22)] overflow-hidden"
          >
            {/* Header */}
            <div className="px-6 pt-6 pb-4 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#173E75]/10 flex items-center justify-center">
                  <Bell size={20} className="text-[#173E75]" />
                </div>
                <div>
                  <h2 className="text-[18px] font-bold text-[#111827] tracking-tight">
                    Nhắc khi có hàng
                  </h2>
                  <p className="text-[13px] text-[#64748B] mt-0.5">
                    Chúng tôi sẽ thông báo khi sản phẩm được nhập lại.
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors shrink-0"
              >
                <X size={18} className="text-[#64748B]" />
              </button>
            </div>

            {/* Product Preview */}
            <div className="mx-6 p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl">
              <div className="flex items-start gap-3">
                <div className="w-16 h-16 bg-white rounded-lg border border-[#E2E8F0] flex items-center justify-center p-1 overflow-hidden shrink-0">
                  <img
                    src={imageUrl || product.image}
                    alt={product.name}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-[13px] font-semibold text-[#111827] line-clamp-2 leading-snug">
                    {product.name}
                  </h3>
                  <p className="text-[11px] text-[#64748B] mt-1">
                    SKU: {product.sku}
                  </p>
                  <span className="inline-block mt-2 px-2 py-1 bg-[#FFF7ED] text-[#C2410C] text-[10px] font-bold border border-[#FED7AA] rounded">
                    Hết hàng
                  </span>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <form onSubmit={handleSubmit} className="px-6 py-4">
              <div className="mb-4">
                <label className="block text-[12px] font-semibold text-[#111827] mb-2">
                  Email nhận thông báo
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailError('');
                  }}
                  placeholder="Nhập email của bạn"
                  className={`w-full px-4 py-3 text-[13px] border rounded-xl outline-none transition-colors ${
                    emailError
                      ? 'border-red-400 bg-red-50 focus:border-red-500'
                      : 'border-[#E2E8F0] focus:border-[#173E75] focus:ring-2 focus:ring-[#173E75]/10'
                  }`}
                />
                {emailError && (
                  <p className="text-[11px] text-red-500 mt-1.5">{emailError}</p>
                )}
              </div>

              <label className="flex items-center gap-3 mb-6 cursor-pointer group">
                <div
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                    sendEmail
                      ? 'bg-[#173E75] border-[#173E75]'
                      : 'border-[#CBD5E1] group-hover:border-slate-400'
                  }`}
                  onClick={() => setSendEmail(!sendEmail)}
                >
                  {sendEmail && (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path
                        d="M2 6L5 9L10 3"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
                <span
                  className="text-[12px] text-[#64748B] cursor-pointer select-none"
                  onClick={() => setSendEmail(!sendEmail)}
                >
                  Gửi thông báo qua email khi có hàng
                </span>
              </label>

              {/* Footer Actions */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-3 text-[13px] font-semibold text-[#64748B] bg-white border border-[#E2E8F0] rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 text-[13px] font-semibold text-white bg-[#173E75] rounded-xl hover:bg-[#0F2F5A] transition-colors"
                >
                  Đăng ký nhắc
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default NotifyWhenAvailableModal;
