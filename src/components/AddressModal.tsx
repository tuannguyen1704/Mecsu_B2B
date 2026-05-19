import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check } from 'lucide-react';
import { Address } from '../types/auth';
import AddressForm from './AddressForm';

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  address?: Address;
  onSave: (address: Address, saveToAccount: boolean) => void;
  showSaveOption?: boolean;
  isGuestMode?: boolean;
  currentUserName?: string;
  currentUserPhone?: string;
}

const generateId = () => Math.random().toString(36).substring(2, 15);

export default function AddressModal({
  isOpen,
  onClose,
  address,
  onSave,
  showSaveOption = true,
  isGuestMode = false,
  currentUserName,
  currentUserPhone,
}: AddressModalProps) {
  const isEditing = !!address;

  const [formData, setFormData] = useState<Address>(() => {
    if (address) {
      return { ...address };
    }
    return {
      id: '',
      recipientName: isGuestMode ? '' : (currentUserName || ''),
      phone: isGuestMode ? '' : (currentUserPhone || ''),
      province: '',
      district: '',
      ward: '',
      streetAddress: '',
      deliveryNote: '',
      isDefault: true,
    };
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saveToAccount, setSaveToAccount] = useState(true);

  // Reinitialize form when modal opens with new props
  React.useEffect(() => {
    if (isOpen) {
      if (address) {
        setFormData({ ...address });
      } else {
        setFormData({
          id: '',
          recipientName: isGuestMode ? '' : (currentUserName || ''),
          phone: isGuestMode ? '' : (currentUserPhone || ''),
          province: '',
          district: '',
          ward: '',
          streetAddress: '',
          deliveryNote: '',
          isDefault: true,
        });
      }
      setErrors({});
      setSaveToAccount(true);
    }
  }, [isOpen, address, isGuestMode, currentUserName, currentUserPhone]);

  const handleChange = (newAddress: Address) => {
    setFormData(newAddress);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Chỉ validate recipientName/phone khi là guest
    if (isGuestMode) {
      if (!formData.recipientName.trim()) {
        newErrors.recipientName = 'Vui lòng nhập tên người nhận';
      }

      if (!formData.phone.trim()) {
        newErrors.phone = 'Vui lòng nhập số điện thoại';
      } else if (!/^[0-9]{10,11}$/.test(formData.phone.replace(/\s/g, ''))) {
        newErrors.phone = 'Số điện thoại không hợp lệ';
      }
    }

    if (!formData.province) {
      newErrors.province = 'Vui lòng chọn tỉnh/thành phố';
    }

    if (!formData.district) {
      newErrors.district = 'Vui lòng chọn quận/huyện';
    }

    if (!formData.ward) {
      newErrors.ward = 'Vui lòng chọn phường/xã';
    }

    if (!formData.streetAddress.trim()) {
      newErrors.streetAddress = 'Vui lòng nhập địa chỉ cụ thể';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const addressToSave = {
      ...formData,
      id: formData.id || generateId(),
    };

    onSave(addressToSave, showSaveOption && saveToAccount);
    onClose();
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  return (
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
              <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {isEditing ? 'Chỉnh sửa địa chỉ' : 'Thêm địa chỉ mới'}
                  </h3>
                  <p className="text-sm text-slate-500 mt-0.5">
                    {isEditing
                      ? 'Cập nhật thông tin địa chỉ giao hàng'
                      : 'Nhập thông tin địa chỉ giao hàng mới'}
                  </p>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 rounded-full hover:bg-slate-100 transition-colors"
                >
                  <X size={20} className="text-slate-400" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <AddressForm
                  address={formData}
                  onChange={handleChange}
                  errors={errors}
                  showRecipientFields={isGuestMode}
                />

                {showSaveOption && (
                  <div className="mt-4">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={saveToAccount}
                          onChange={(e) => setSaveToAccount(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-5 h-5 border-2 rounded flex items-center justify-center transition-all
                          peer-checked:bg-[#003B73] peer-checked:border-[#003B73]
                          border-slate-300 peer-focus:ring-2 peer-focus:ring-[#003B73]/10">
                          <Check size={14} className="text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                        </div>
                      </div>
                      <span className="text-sm text-slate-600">Lưu vào tài khoản</span>
                    </label>
                    {!saveToAccount && (
                      <p className="text-xs text-slate-400 mt-2 ml-8">
                        Địa chỉ này sẽ chỉ được dùng cho đơn hàng hiện tại
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex gap-3">
                <button
                  onClick={handleClose}
                  className="flex-1 py-3.5 border border-[#E2E8F0] text-slate-700 font-bold text-sm rounded-xl hover:bg-white transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 py-3.5 bg-[#003B73] text-white font-bold text-sm rounded-xl hover:bg-[#002d5a] transition-colors"
                >
                  Lưu
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
