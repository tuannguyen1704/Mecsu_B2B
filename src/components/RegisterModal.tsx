/**
 * RegisterModal.tsx
 * 
 * Modal đăng ký với Supabase Auth
 * Giữ nguyên UI hiện tại, chỉ thay đổi logic xử lý
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Lock, Eye, EyeOff, User, ChevronDown, ArrowLeft, Check, MapPin, Phone, Edit2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Address, PROVINCES, DISTRICTS, WARDS } from '../types/auth';

// ============================================
// TYPES
// ============================================

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

// Các bước của form đăng ký
type Step = 'account' | 'address';

// ============================================
// COMPONENT
// ============================================

export default function RegisterModal({ isOpen, onClose, onSuccess }: RegisterModalProps) {
  const { register, addAddress } = useAuth();

  // ============================================
  // STATE
  // ============================================

  const [step, setStep] = useState<Step>('account');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [address, setAddress] = useState({
    province: '',
    district: '',
    ward: '',
    streetAddress: '',
    deliveryNote: '',
  });
  
  // Custom receiver state
  const [useCustomReceiver, setUseCustomReceiver] = useState(false);
  const [customReceiverName, setCustomReceiverName] = useState('');
  const [customReceiverPhone, setCustomReceiverPhone] = useState('');
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [globalError, setGlobalError] = useState('');

  // ============================================
  // RESET FORM
  // ============================================

  const resetForm = () => {
    setStep('account');
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    });
    setAddress({
      province: '',
      district: '',
      ward: '',
      streetAddress: '',
      deliveryNote: '',
    });
    setUseCustomReceiver(false);
    setCustomReceiverName('');
    setCustomReceiverPhone('');
    setErrors({});
    setGlobalError('');
    setIsLoading(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  // ============================================
  // VALIDATION
  // ============================================

  const validateAccountStep = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Full Name
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Vui lòng nhập họ tên';
    }

    // Email
    if (!formData.email.trim()) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    // Phone (optional for registration, but validate if provided)
    if (formData.phone.trim() && !/^0[0-9]{9}$/.test(formData.phone)) {
      newErrors.phone = 'Số điện thoại không hợp lệ (phải có 10 số, bắt đầu bằng 0)';
    }

    // Password
    if (!formData.password) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }

    // Confirm Password
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu không khớp';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateAddressStep = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Address fields are optional - only validate if user filled any address field
    const hasAddress = address.province || address.streetAddress;

    if (hasAddress) {
      // Validate custom receiver if user chose to use custom receiver
      if (useCustomReceiver) {
        if (!customReceiverName.trim()) {
          newErrors.customReceiverName = 'Vui lòng nhập tên người nhận';
        }
        if (!customReceiverPhone.trim()) {
          newErrors.customReceiverPhone = 'Vui lòng nhập số điện thoại';
        } else if (!/^0[0-9]{9}$/.test(customReceiverPhone)) {
          newErrors.customReceiverPhone = 'Số điện thoại không hợp lệ';
        }
      }

      if (!address.province) {
        newErrors.province = 'Vui lòng chọn tỉnh/thành phố';
      }

      if (!address.district) {
        newErrors.district = 'Vui lòng chọn quận/huyện';
      }

      if (!address.ward) {
        newErrors.ward = 'Vui lòng chọn phường/xã';
      }

      if (!address.streetAddress.trim()) {
        newErrors.streetAddress = 'Vui lòng nhập địa chỉ cụ thể';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ============================================
  // HANDLERS
  // ============================================

  const handleNextStep = () => {
    if (validateAccountStep()) {
      setStep('address');
    }
  };

  const handleSkipAddress = () => {
    handleSubmit();
  };

  const handleSubmit = async () => {
    setGlobalError('');
    setIsLoading(true);

    try {
      // Đăng ký với Supabase Auth
      const result = await register(formData.email.trim(), formData.password, formData.fullName);

      if (!result.success) {
        setGlobalError(result.error || 'Đăng ký thất bại');
        setIsLoading(false);
        return;
      }

      // Nếu có thông báo xác minh email (Supabase gửi email xác minh)
      if (result.error && result.error.includes('xác minh')) {
        // Đăng ký thành công nhưng cần xác minh email
        onSuccess?.();
        handleClose();
        return;
      }

      // Đăng ký thành công - thêm address nếu có
      const hasAddress = address.province || address.streetAddress;
      if (hasAddress && validateAddressStep()) {
        const receiverName = useCustomReceiver ? customReceiverName : formData.fullName;
        const receiverPhone = useCustomReceiver ? customReceiverPhone : formData.phone;

        const newAddress: Address = {
          id: Math.random().toString(36).substring(2, 15),
          recipientName: receiverName,
          phone: receiverPhone,
          province: address.province,
          district: address.district,
          ward: address.ward,
          streetAddress: address.streetAddress,
          deliveryNote: address.deliveryNote,
          isDefault: true,
        };

        addAddress(newAddress);
      }

      onSuccess?.();
      handleClose();
    } catch (err) {
      setGlobalError('Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrevStep = () => {
    setStep('account');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && step === 'account') {
      handleNextStep();
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
              <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl pointer-events-auto overflow-hidden max-h-[90vh] flex flex-col">
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

                  {/* Progress Steps */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className={`flex items-center gap-2 ${step === 'account' ? 'text-[#003B73]' : 'text-green-600'}`}>
                      {step === 'address' ? (
                        <div className="w-6 h-6 rounded-full bg-green-600 text-white flex items-center justify-center">
                          <Check size={14} />
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full border-2 border-current flex items-center justify-center text-xs font-bold">
                          1
                        </div>
                      )}
                      <span className="text-sm font-semibold">Tài khoản</span>
                    </div>
                    <div className="flex-1 h-px bg-slate-200" />
                    <div className={`flex items-center gap-2 ${step === 'address' ? 'text-[#003B73]' : 'text-slate-400'}`}>
                      <div className="w-6 h-6 rounded-full border-2 border-current flex items-center justify-center text-xs font-bold">
                        2
                      </div>
                      <span className="text-sm font-semibold">Địa chỉ</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h2 className="text-2xl font-bold text-slate-800 mb-1">
                    {step === 'account' ? 'Tạo tài khoản' : 'Địa chỉ giao hàng'}
                  </h2>
                  <p className="text-sm text-slate-500">
                    {step === 'account'
                      ? 'Nhập thông tin để đăng ký tài khoản'
                      : 'Thêm địa chỉ giao hàng (tùy chọn)'
                    }
                  </p>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto px-8 pb-8">
                  <AnimatePresence mode="wait">
                    {/* ============================================ */}
                    {/* STEP 1: ACCOUNT INFO */}
                    {/* ============================================ */}
                    {step === 'account' && (
                      <motion.div
                        key="account"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="space-y-4"
                        onKeyPress={handleKeyPress}
                      >
                        {/* Full Name */}
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-2">
                            Họ và tên
                          </label>
                          <div className="relative">
                            <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                              type="text"
                              value={formData.fullName}
                              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                              placeholder="Nguyễn Văn A"
                              className={`w-full pl-11 pr-4 py-3.5 border rounded-xl text-sm transition-all outline-none
                                ${errors.fullName 
                                  ? 'border-red-400 bg-red-50 focus:ring-2 focus:ring-red-200' 
                                  : 'border-[#E2E8F0] bg-white hover:border-slate-300 focus:border-[#003B73] focus:ring-2 focus:ring-[#003B73]/10'
                                }`}
                            />
                          </div>
                          {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>}
                        </div>

                        {/* Email */}
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-2">
                            Email
                          </label>
                          <div className="relative">
                            <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                              type="email"
                              value={formData.email}
                              onChange={(e) => {
                                setFormData({ ...formData, email: e.target.value });
                                if (errors.email) {
                                  setErrors(prev => {
                                    const newErrors = { ...prev };
                                    delete newErrors.email;
                                    return newErrors;
                                  });
                                }
                              }}
                              placeholder="nguyen@example.com"
                              className={`w-full pl-11 pr-4 py-3.5 border rounded-xl text-sm transition-all outline-none
                                ${errors.email
                                  ? 'border-red-400 bg-red-50 focus:ring-2 focus:ring-red-200'
                                  : 'border-[#E2E8F0] bg-white hover:border-slate-300 focus:border-[#003B73] focus:ring-2 focus:ring-[#003B73]/10'
                                }`}
                            />
                          </div>
                          {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                        </div>

                        {/* Phone (Optional) */}
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-2">
                            Số điện thoại (tùy chọn)
                          </label>
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">+84</span>
                            <input
                              type="tel"
                              value={formData.phone}
                              onChange={(e) => {
                                setFormData({ ...formData, phone: e.target.value });
                                if (errors.phone) {
                                  setErrors(prev => {
                                    const newErrors = { ...prev };
                                    delete newErrors.phone;
                                    return newErrors;
                                  });
                                }
                              }}
                              placeholder="901234567"
                              className={`w-full pl-14 pr-4 py-3.5 border rounded-xl text-sm transition-all outline-none
                                ${errors.phone
                                  ? 'border-red-400 bg-red-50 focus:ring-2 focus:ring-red-200'
                                  : 'border-[#E2E8F0] bg-white hover:border-slate-300 focus:border-[#003B73] focus:ring-2 focus:ring-[#003B73]/10'
                                }`}
                            />
                          </div>
                          {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                        </div>

                        {/* Password */}
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-2">
                            Mật khẩu
                          </label>
                          <div className="relative">
                            <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                              type={showPassword ? 'text' : 'password'}
                              value={formData.password}
                              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                              placeholder="Ít nhất 6 ký tự"
                              className={`w-full pl-11 pr-12 py-3.5 border rounded-xl text-sm transition-all outline-none
                                ${errors.password 
                                  ? 'border-red-400 bg-red-50 focus:ring-2 focus:ring-red-200' 
                                  : 'border-[#E2E8F0] bg-white hover:border-slate-300 focus:border-[#003B73] focus:ring-2 focus:ring-[#003B73]/10'
                                }`}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            >
                              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                          </div>
                          {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
                        </div>

                        {/* Confirm Password */}
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-2">
                            Xác nhận mật khẩu
                          </label>
                          <div className="relative">
                            <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                              type={showConfirmPassword ? 'text' : 'password'}
                              value={formData.confirmPassword}
                              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                              placeholder="Nhập lại mật khẩu"
                              className={`w-full pl-11 pr-12 py-3.5 border rounded-xl text-sm transition-all outline-none
                                ${errors.confirmPassword 
                                  ? 'border-red-400 bg-red-50 focus:ring-2 focus:ring-red-200' 
                                  : 'border-[#E2E8F0] bg-white hover:border-slate-300 focus:border-[#003B73] focus:ring-2 focus:ring-[#003B73]/10'
                                }`}
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            >
                              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                          </div>
                          {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>}
                        </div>

                        {/* Global Error */}
                        {globalError && (
                          <p className="text-sm text-red-500 bg-red-50 px-4 py-2 rounded-lg">{globalError}</p>
                        )}
                      </motion.div>
                    )}

                    {/* ============================================ */}
                    {/* STEP 2: ADDRESS */}
                    {/* ============================================ */}
                    {step === 'address' && (
                      <motion.div
                        key="address"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="space-y-4"
                      >
                        {/* Default Receiver Info */}
                        <div className="bg-slate-50 rounded-xl p-4 mb-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-xs text-slate-500 mb-1">Người nhận</p>
                              <p className="font-semibold text-slate-800">
                                {formData.fullName} {formData.phone && `- +84${formData.phone}`}
                              </p>
                            </div>
                            {!useCustomReceiver ? (
                              <button
                                onClick={() => setUseCustomReceiver(true)}
                                className="text-[#003B73] hover:text-[#002d5a] text-sm font-medium flex items-center gap-1"
                              >
                                <Edit2 size={14} />
                                Đổi người nhận
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  setUseCustomReceiver(false);
                                  setCustomReceiverName('');
                                  setCustomReceiverPhone('');
                                }}
                                className="text-slate-500 hover:text-slate-700 text-sm font-medium"
                              >
                                Hủy
                              </button>
                            )}
                          </div>

                          {/* Custom Receiver Fields */}
                          {useCustomReceiver && (
                            <div className="mt-4 pt-4 border-t border-slate-200 grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-2">
                                  <User size={12} className="inline mr-1" />
                                  Tên người nhận
                                </label>
                                <input
                                  type="text"
                                  value={customReceiverName}
                                  onChange={(e) => setCustomReceiverName(e.target.value)}
                                  placeholder="Nguyễn Văn B"
                                  className={`w-full px-4 py-3 border rounded-xl text-sm transition-all outline-none
                                    ${errors.customReceiverName
                                      ? 'border-red-400 bg-red-50'
                                      : 'border-[#E2E8F0] bg-white hover:border-slate-300 focus:border-[#003B73] focus:ring-2 focus:ring-[#003B73]/10'
                                    }`}
                                />
                                {errors.customReceiverName && (
                                  <p className="text-xs text-red-500 mt-1">{errors.customReceiverName}</p>
                                )}
                              </div>
                              <div>
                                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-2">
                                  <Phone size={12} className="inline mr-1" />
                                  Số điện thoại
                                </label>
                                <div className="relative">
                                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">+84</span>
                                  <input
                                    type="tel"
                                    value={customReceiverPhone}
                                    onChange={(e) => setCustomReceiverPhone(e.target.value)}
                                    placeholder="901234567"
                                    className={`w-full pl-14 pr-4 py-3 border rounded-xl text-sm transition-all outline-none
                                      ${errors.customReceiverPhone
                                        ? 'border-red-400 bg-red-50'
                                        : 'border-[#E2E8F0] bg-white hover:border-slate-300 focus:border-[#003B73] focus:ring-2 focus:ring-[#003B73]/10'
                                      }`}
                                  />
                                </div>
                                {errors.customReceiverPhone && (
                                  <p className="text-xs text-red-500 mt-1">{errors.customReceiverPhone}</p>
                                )}
                              </div>
                            </div>
                          )}
                        </div>

                        <p className="text-xs text-slate-400 -mt-2 mb-2">
                          Bạn có thể bỏ qua bước này và thêm địa chỉ sau
                        </p>

                        {/* Address Fields */}
                        <AddressFieldsForm
                          address={address}
                          onChange={setAddress}
                          errors={errors}
                        />

                        {/* Global Error */}
                        {globalError && (
                          <p className="text-sm text-red-500 bg-red-50 px-4 py-2 rounded-lg">{globalError}</p>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Footer */}
                <div className="px-8 py-4 bg-slate-50 border-t border-[#E2E8F0] flex gap-3">
                  {step === 'address' && (
                    <button
                      onClick={handlePrevStep}
                      className="px-4 py-3.5 text-slate-500 font-semibold text-sm rounded-xl hover:bg-white transition-colors flex items-center gap-1"
                    >
                      <ArrowLeft size={16} />
                      Quay lại
                    </button>
                  )}
                  {step === 'address' && (
                    <button
                      onClick={handleSkipAddress}
                      className="flex-1 py-3.5 text-slate-500 font-semibold text-sm rounded-xl hover:bg-white transition-colors"
                    >
                      Bỏ qua
                    </button>
                  )}
                  <button
                    onClick={step === 'account' ? handleNextStep : handleSubmit}
                    disabled={isLoading}
                    className={`flex-1 py-3.5 font-bold text-sm uppercase tracking-wider rounded-xl transition-colors disabled:opacity-60
                      ${step === 'account'
                        ? 'bg-[#003B73] text-white hover:bg-[#002d5a]'
                        : 'bg-[#FFC72C] text-[#111827] hover:bg-[#E8B931]'
                      }`}
                  >
                    {isLoading ? 'Đang xử lý...' : (step === 'account' ? 'Tiếp tục' : 'Hoàn tất đăng ký')}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

// ============================================
// ADDRESS FIELDS FORM
// ============================================

interface AddressFieldsFormProps {
  address: {
    province: string;
    district: string;
    ward: string;
    streetAddress: string;
    deliveryNote: string;
  };
  onChange: (address: any) => void;
  errors: Record<string, string>;
}

function AddressFieldsForm({ address, onChange, errors }: AddressFieldsFormProps) {
  const [showProvinces, setShowProvinces] = useState(false);
  const [showDistricts, setShowDistricts] = useState(false);
  const [showWards, setShowWards] = useState(false);

  const provinceRef = useRef<HTMLDivElement>(null);
  const districtRef = useRef<HTMLDivElement>(null);
  const wardRef = useRef<HTMLDivElement>(null);

  const selectedProvince = PROVINCES.find(p => p.id === address.province);
  const districts = address.province ? DISTRICTS[address.province] || [] : [];
  const selectedDistrict = districts.find(d => d.id === address.district);
  const wards = address.district ? WARDS[address.district] || [] : [];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (provinceRef.current && !provinceRef.current.contains(event.target as Node)) {
        setShowProvinces(false);
      }
      if (districtRef.current && !districtRef.current.contains(event.target as Node)) {
        setShowDistricts(false);
      }
      if (wardRef.current && !wardRef.current.contains(event.target as Node)) {
        setShowWards(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleChange = (field: string, value: string) => {
    const updated = { ...address, [field]: value };
    if (field === 'province') {
      updated.district = '';
      updated.ward = '';
    } else if (field === 'district') {
      updated.ward = '';
    }
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      {/* Province/City */}
      <div ref={provinceRef} className="relative">
        <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-2">
          <MapPin size={12} className="inline mr-1" />
          Tỉnh/Thành phố
        </label>
        <button
          type="button"
          onClick={() => setShowProvinces(!showProvinces)}
          className={`w-full px-4 py-3 border rounded-xl text-sm text-left flex items-center justify-between transition-all
            ${errors.province
              ? 'border-red-400 bg-red-50'
              : 'border-[#E2E8F0] bg-white hover:border-slate-300'
            }`}
        >
          <span className={selectedProvince ? 'text-slate-800' : 'text-slate-400'}>
            {selectedProvince?.name || 'Chọn Tỉnh/Thành phố'}
          </span>
          <ChevronDown size={16} className={`text-slate-400 transition-transform ${showProvinces ? 'rotate-180' : ''}`} />
        </button>

        {showProvinces && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-[#E2E8F0] rounded-xl shadow-lg max-h-60 overflow-auto">
            {PROVINCES.map((province) => (
              <button
                key={province.id}
                type="button"
                onClick={() => {
                  handleChange('province', province.id);
                  setShowProvinces(false);
                }}
                className={`w-full px-4 py-3 text-sm text-left hover:bg-slate-50 transition-colors
                  ${address.province === province.id ? 'bg-[#003B73]/5 text-[#003B73] font-medium' : 'text-slate-700'}`}
              >
                {province.name}
              </button>
            ))}
          </div>
        )}
        {errors.province && (
          <p className="text-xs text-red-500 mt-1">{errors.province}</p>
        )}
      </div>

      {/* District */}
      <div ref={districtRef} className="relative">
        <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-2">
          <MapPin size={12} className="inline mr-1" />
          Quận/Huyện
        </label>
        <button
          type="button"
          onClick={() => setShowDistricts(!showDistricts)}
          disabled={!address.province}
          className={`w-full px-4 py-3 border rounded-xl text-sm text-left flex items-center justify-between transition-all
            ${!address.province ? 'bg-slate-100 cursor-not-allowed opacity-60' : ''}
            ${errors.district
              ? 'border-red-400 bg-red-50'
              : 'border-[#E2E8F0] bg-white hover:border-slate-300'
            }`}
        >
          <span className={selectedDistrict ? 'text-slate-800' : 'text-slate-400'}>
            {selectedDistrict?.name || (address.province ? 'Chọn Quận/Huyện' : 'Chọn Tỉnh trước')}
          </span>
          <ChevronDown size={16} className={`text-slate-400 transition-transform ${showDistricts ? 'rotate-180' : ''}`} />
        </button>

        {showDistricts && districts.length > 0 && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-[#E2E8F0] rounded-xl shadow-lg max-h-60 overflow-auto">
            {districts.map((district) => (
              <button
                key={district.id}
                type="button"
                onClick={() => {
                  handleChange('district', district.id);
                  setShowDistricts(false);
                }}
                className={`w-full px-4 py-3 text-sm text-left hover:bg-slate-50 transition-colors
                  ${address.district === district.id ? 'bg-[#003B73]/5 text-[#003B73] font-medium' : 'text-slate-700'}`}
              >
                {district.name}
              </button>
            ))}
          </div>
        )}
        {errors.district && (
          <p className="text-xs text-red-500 mt-1">{errors.district}</p>
        )}
      </div>

      {/* Ward */}
      <div ref={wardRef} className="relative">
        <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-2">
          <MapPin size={12} className="inline mr-1" />
          Phường/Xã
        </label>
        <button
          type="button"
          onClick={() => setShowWards(!showWards)}
          disabled={!address.district}
          className={`w-full px-4 py-3 border rounded-xl text-sm text-left flex items-center justify-between transition-all
            ${!address.district ? 'bg-slate-100 cursor-not-allowed opacity-60' : ''}
            ${errors.ward
              ? 'border-red-400 bg-red-50'
              : 'border-[#E2E8F0] bg-white hover:border-slate-300'
            }`}
        >
          <span className={address.ward ? 'text-slate-800' : 'text-slate-400'}>
            {address.ward
              ? wards.find(w => w.id === address.ward)?.name || address.ward
              : (address.district ? 'Chọn Phường/Xã' : 'Chọn Quận trước')
            }
          </span>
          <ChevronDown size={16} className={`text-slate-400 transition-transform ${showWards ? 'rotate-180' : ''}`} />
        </button>

        {showWards && wards.length > 0 && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-[#E2E8F0] rounded-xl shadow-lg max-h-60 overflow-auto">
            {wards.map((ward) => (
              <button
                key={ward.id}
                type="button"
                onClick={() => {
                  handleChange('ward', ward.id);
                  setShowWards(false);
                }}
                className={`w-full px-4 py-3 text-sm text-left hover:bg-slate-50 transition-colors
                  ${address.ward === ward.id ? 'bg-[#003B73]/5 text-[#003B73] font-medium' : 'text-slate-700'}`}
              >
                {ward.name}
              </button>
            ))}
          </div>
        )}
        {errors.ward && (
          <p className="text-xs text-red-500 mt-1">{errors.ward}</p>
        )}
      </div>

      {/* Street Address */}
      <div>
        <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-2">
          <MapPin size={12} className="inline mr-1" />
          Địa chỉ cụ thể
        </label>
        <input
          type="text"
          value={address.streetAddress}
          onChange={(e) => handleChange('streetAddress', e.target.value)}
          placeholder="123 Đường ABC, Phường XYZ"
          className={`w-full px-4 py-3 border rounded-xl text-sm transition-all
            ${errors.streetAddress
              ? 'border-red-400 bg-red-50 focus:ring-2 focus:ring-red-200'
              : 'border-[#E2E8F0] bg-white hover:border-slate-300 focus:border-[#003B73] focus:ring-2 focus:ring-[#003B73]/10'
            }`}
        />
        {errors.streetAddress && (
          <p className="text-xs text-red-500 mt-1">{errors.streetAddress}</p>
        )}
      </div>

      {/* Delivery Note */}
      <div>
        <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-2">
          Ghi chú giao hàng (tùy chọn)
        </label>
        <textarea
          value={address.deliveryNote}
          onChange={(e) => handleChange('deliveryNote', e.target.value)}
          placeholder="Giao giờ hành chính, gọi trước khi giao..."
          rows={2}
          className="w-full px-4 py-3 border border-[#E2E8F0] rounded-xl text-sm transition-all
            bg-white hover:border-slate-300 focus:border-[#003B73] focus:ring-2 focus:ring-[#003B73]/10
            resize-none"
        />
      </div>
    </div>
  );
}
