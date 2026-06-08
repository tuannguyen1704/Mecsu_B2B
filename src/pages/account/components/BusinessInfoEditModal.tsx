import React, { useState, useEffect } from 'react';
import { X, Save, Building2 } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { Toast } from '../../../components/ui/Toast';

export interface BusinessInfoData {
  company: string;
  taxCode: string;
  companyAddress: string;
}

interface BusinessInfoEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: BusinessInfoData;
  onSave: (data: BusinessInfoData) => void;
}

export const BusinessInfoEditModal: React.FC<BusinessInfoEditModalProps> = ({
  isOpen,
  onClose,
  data,
  onSave,
}) => {
  const [formData, setFormData] = useState<BusinessInfoData>(data);
  const [showToast, setShowToast] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof BusinessInfoData, string>>>({});

  useEffect(() => {
    setFormData(data);
    setErrors({});
  }, [data, isOpen]);

  const handleChange = (field: keyof BusinessInfoData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof BusinessInfoData, string>> = {};
    
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
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                <Building2 size={20} className="text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Chỉnh sửa thông tin doanh nghiệp</h2>
                <p className="text-xs text-slate-500">Cập nhật thông tin công ty của bạn</p>
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
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Tên công ty
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={e => handleChange('company', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E5EAF2] bg-white text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#163F78]/20 focus:border-[#163F78]"
                  placeholder="Tên công ty"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Mã số thuế
                </label>
                <input
                  type="text"
                  value={formData.taxCode}
                  onChange={e => handleChange('taxCode', e.target.value)}
                  className={cn(
                    'w-full px-4 py-2.5 rounded-xl border bg-white text-sm transition-colors',
                    'focus:outline-none focus:ring-2 focus:ring-[#163F78]/20 focus:border-[#163F78]',
                    errors.taxCode ? 'border-red-400' : 'border-[#E5EAF2]'
                  )}
                  placeholder="0123456789"
                />
                {errors.taxCode && (
                  <p className="text-xs text-red-500 mt-1">{errors.taxCode}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Địa chỉ công ty
                </label>
                <input
                  type="text"
                  value={formData.companyAddress}
                  onChange={e => handleChange('companyAddress', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E5EAF2] bg-white text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#163F78]/20 focus:border-[#163F78]"
                  placeholder="Địa chỉ đầy đủ của công ty"
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
          message="Cập nhật thông tin doanh nghiệp thành công!"
          type="success"
          onClose={() => setShowToast(false)}
        />
      )}
    </>
  );
};

export default BusinessInfoEditModal;
