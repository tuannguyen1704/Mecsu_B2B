import React, { useState, useEffect } from 'react';
import { X, Save, User } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { Toast } from '../../../components/ui/Toast';

export interface PersonalInfoData {
  fullName: string;
  email: string;
  phone: string;
  gender: 'male' | 'female' | 'other' | '';
  birthDate: string;
}

interface PersonalInfoEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: PersonalInfoData;
  onSave: (data: PersonalInfoData) => void;
}

export const PersonalInfoEditModal: React.FC<PersonalInfoEditModalProps> = ({
  isOpen,
  onClose,
  data,
  onSave,
}) => {
  const [formData, setFormData] = useState<PersonalInfoData>(data);
  const [showToast, setShowToast] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof PersonalInfoData, string>>>({});

  useEffect(() => {
    setFormData(data);
    setErrors({});
  }, [data, isOpen]);

  const handleChange = (field: keyof PersonalInfoData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof PersonalInfoData, string>> = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Vui lòng nhập họ tên';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }
    
    if (formData.phone && !/^[0-9]{10,11}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Số điện thoại không hợp lệ';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    onSave(formData);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      onClose();
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[400] transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-[401] flex items-center justify-center p-4">
        <div 
          className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden animate-fade-in"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5EAF2] bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#163F78]/10 flex items-center justify-center">
                <User size={20} className="text-[#163F78]" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Chỉnh sửa thông tin cá nhân</h2>
                <p className="text-xs text-slate-500">Cập nhật thông tin cá nhân của bạn</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X size={20} className="text-slate-500" />
            </button>
          </div>

          {/* Body */}
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Họ và tên <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={e => handleChange('fullName', e.target.value)}
                  className={cn(
                    'w-full px-4 py-2.5 rounded-xl border bg-white text-sm transition-colors',
                    'focus:outline-none focus:ring-2 focus:ring-[#163F78]/20 focus:border-[#163F78]',
                    errors.fullName ? 'border-red-400' : 'border-[#E5EAF2]'
                  )}
                  placeholder="Nhập họ và tên"
                />
                {errors.fullName && (
                  <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => handleChange('email', e.target.value)}
                  className={cn(
                    'w-full px-4 py-2.5 rounded-xl border bg-white text-sm transition-colors',
                    'focus:outline-none focus:ring-2 focus:ring-[#163F78]/20 focus:border-[#163F78]',
                    errors.email ? 'border-red-400' : 'border-[#E5EAF2]'
                  )}
                  placeholder="email@example.com"
                />
                {errors.email && (
                  <p className="text-xs text-red-500 mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={e => handleChange('phone', e.target.value)}
                  className={cn(
                    'w-full px-4 py-2.5 rounded-xl border border-[#E5EAF2] bg-white text-sm transition-colors',
                    'focus:outline-none focus:ring-2 focus:ring-[#163F78]/20 focus:border-[#163F78]',
                    errors.phone && 'border-red-400'
                  )}
                  placeholder="0xxx xxx xxx"
                />
                {errors.phone && (
                  <p className="text-xs text-red-500 mt-1">{errors.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Giới tính
                </label>
                <select
                  value={formData.gender}
                  onChange={e => handleChange('gender', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E5EAF2] bg-white text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#163F78]/20 focus:border-[#163F78]"
                >
                  <option value="">Chọn giới tính</option>
                  <option value="male">Nam</option>
                  <option value="female">Nữ</option>
                  <option value="other">Khác</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Ngày sinh
                </label>
                <input
                  type="date"
                  value={formData.birthDate}
                  onChange={e => handleChange('birthDate', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E5EAF2] bg-white text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#163F78]/20 focus:border-[#163F78]"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-[#E5EAF2]">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl border border-[#E5EAF2] text-slate-600 hover:bg-slate-100 text-sm font-medium transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#163F78] hover:bg-[#1a4a8a] text-white text-sm font-medium transition-colors shadow-sm"
              >
                <Save size={16} />
                <span>Lưu thay đổi</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {showToast && (
        <Toast
          message="Cập nhật thông tin cá nhân thành công!"
          type="success"
          onClose={() => setShowToast(false)}
        />
      )}
    </>
  );
};

export default PersonalInfoEditModal;
