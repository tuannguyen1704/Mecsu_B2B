import React, { useEffect, useState } from 'react';
import { X, Save, User, Building2 } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { Toast } from '../../../components/ui/Toast';

export interface UserProfileData {
  fullName: string;
  email: string;
  phone: string;
  gender: 'male' | 'female' | 'other' | '';
  birthDate: string;
  company: string;
  taxCode: string;
  companyAddress: string;
  companyRepresentative: string;
  customerGroup: string;
  currentDiscount: string;
}

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  userData: UserProfileData;
  onSave: (data: UserProfileData) => void;
}

export const ProfileEditModal: React.FC<ProfileEditModalProps> = ({
  isOpen,
  onClose,
  userData,
  onSave,
}) => {
  const [formData, setFormData] = useState<UserProfileData>(userData);
  const [showToast, setShowToast] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof UserProfileData, string>>>({});

  useEffect(() => {
    setFormData(userData);
    setErrors({});
  }, [userData, isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  const handleChange = (field: keyof UserProfileData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof UserProfileData, string>> = {};

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

    if (formData.taxCode && !/^[0-9]{10,14}$/.test(formData.taxCode)) {
      newErrors.taxCode = 'Mã số thuế không hợp lệ (10-14 số)';
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
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[400] transition-opacity" onClick={onClose} />

      <div className="fixed inset-0 z-[401] flex items-center justify-center p-4">
        <div
          className="w-full max-w-[720px] overflow-hidden rounded-[28px] border border-[#E5EAF2] bg-white shadow-[0_24px_70px_rgba(15,23,42,0.16)] animate-fade-in"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-start justify-between border-b border-[#E5EAF2] px-6 py-5 sm:px-7">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Chỉnh sửa thông tin tài khoản</h2>
              <p className="mt-1 text-sm text-slate-500">Cập nhật thông tin cá nhân và doanh nghiệp của bạn.</p>
            </div>
            <button
              onClick={onClose}
              className="rounded-xl p-2 text-slate-500 transition-colors hover:bg-slate-100"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="max-h-[calc(90vh-132px)] overflow-y-auto px-6 py-6 sm:px-7">
            <div className="space-y-8">
              <section className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#F3F7FC] text-[#163F78]">
                    <User size={18} />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-slate-900">Thông tin cá nhân</h3>
                    <p className="text-sm text-slate-500">Thông tin liên hệ chính cho tài khoản MECsu.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Họ tên <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => handleChange('fullName', e.target.value)}
                      className={cn(
                        'w-full rounded-xl border bg-white px-4 py-2.5 text-sm transition-colors',
                        'focus:border-[#163F78] focus:outline-none focus:ring-2 focus:ring-[#163F78]/20',
                        errors.fullName ? 'border-red-400' : 'border-[#E5EAF2]'
                      )}
                      placeholder="Nhập họ và tên"
                    />
                    {errors.fullName && <p className="mt-1 text-xs text-red-500">{errors.fullName}</p>}
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      className={cn(
                        'w-full rounded-xl border bg-white px-4 py-2.5 text-sm transition-colors',
                        'focus:border-[#163F78] focus:outline-none focus:ring-2 focus:ring-[#163F78]/20',
                        errors.email ? 'border-red-400' : 'border-[#E5EAF2]'
                      )}
                      placeholder="email@example.com"
                    />
                    {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">Điện thoại</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      className={cn(
                        'w-full rounded-xl border bg-white px-4 py-2.5 text-sm transition-colors',
                        'focus:border-[#163F78] focus:outline-none focus:ring-2 focus:ring-[#163F78]/20',
                        errors.phone ? 'border-red-400' : 'border-[#E5EAF2]'
                      )}
                      placeholder="0xxx xxx xxx"
                    />
                    {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">Giới tính</label>
                    <select
                      value={formData.gender}
                      onChange={(e) => handleChange('gender', e.target.value)}
                      className="w-full rounded-xl border border-[#E5EAF2] bg-white px-4 py-2.5 text-sm transition-colors focus:border-[#163F78] focus:outline-none focus:ring-2 focus:ring-[#163F78]/20"
                    >
                      <option value="">Chọn giới tính</option>
                      <option value="male">Nam</option>
                      <option value="female">Nữ</option>
                      <option value="other">Khác</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">Ngày sinh</label>
                    <input
                      type="date"
                      value={formData.birthDate}
                      onChange={(e) => handleChange('birthDate', e.target.value)}
                      className="w-full rounded-xl border border-[#E5EAF2] bg-white px-4 py-2.5 text-sm transition-colors focus:border-[#163F78] focus:outline-none focus:ring-2 focus:ring-[#163F78]/20"
                    />
                  </div>
                </div>
              </section>

              <section className="space-y-4 border-t border-[#E5EAF2] pt-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#F3F7FC] text-[#163F78]">
                    <Building2 size={18} />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-slate-900">Thông tin doanh nghiệp</h3>
                    <p className="text-sm text-slate-500">Thông tin xuất hóa đơn và phân loại khách hàng B2B.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">Công ty</label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => handleChange('company', e.target.value)}
                      className="w-full rounded-xl border border-[#E5EAF2] bg-white px-4 py-2.5 text-sm transition-colors focus:border-[#163F78] focus:outline-none focus:ring-2 focus:ring-[#163F78]/20"
                      placeholder="Tên công ty"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">MST</label>
                    <input
                      type="text"
                      value={formData.taxCode}
                      onChange={(e) => handleChange('taxCode', e.target.value)}
                      className={cn(
                        'w-full rounded-xl border bg-white px-4 py-2.5 text-sm transition-colors',
                        'focus:border-[#163F78] focus:outline-none focus:ring-2 focus:ring-[#163F78]/20',
                        errors.taxCode ? 'border-red-400' : 'border-[#E5EAF2]'
                      )}
                      placeholder="0123456789"
                    />
                    {errors.taxCode && <p className="mt-1 text-xs text-red-500">{errors.taxCode}</p>}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">Địa chỉ</label>
                    <input
                      type="text"
                      value={formData.companyAddress}
                      onChange={(e) => handleChange('companyAddress', e.target.value)}
                      className="w-full rounded-xl border border-[#E5EAF2] bg-white px-4 py-2.5 text-sm transition-colors focus:border-[#163F78] focus:outline-none focus:ring-2 focus:ring-[#163F78]/20"
                      placeholder="Địa chỉ đầy đủ của công ty"
                    />
                  </div>
                </div>
              </section>
            </div>
          </form>

          <div className="flex items-center justify-end gap-3 border-t border-[#E5EAF2] bg-slate-50/50 px-6 py-4 sm:px-7">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-[#E5EAF2] px-5 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100"
            >
              Hủy
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              className="inline-flex items-center gap-2 rounded-xl bg-[#163F78] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#1a4a8a]"
            >
              <Save size={16} />
              <span>Lưu thay đổi</span>
            </button>
          </div>
        </div>
      </div>

      {showToast && (
        <Toast
          message="Cập nhật thông tin thành công!"
          type="success"
          onClose={() => setShowToast(false)}
        />
      )}
    </>
  );
};

export default ProfileEditModal;
