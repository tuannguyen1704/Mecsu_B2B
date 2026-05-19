import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPin, 
  Plus, 
  Edit2, 
  Trash2, 
  Star, 
  X, 
  Building2,
  Phone,
  User,
  FileText,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { AccountLayout } from './components/AccountLayout';
import { useAuth } from '../../hooks/useAuth';
import { cn } from '../../lib/utils';

interface Address {
  id: string;
  recipientName: string;
  phone: string;
  companyName?: string;
  addressLine: string;
  ward: string;
  district: string;
  city: string;
  note?: string;
  isDefault: boolean;
}

interface AddressFormData {
  recipientName: string;
  phone: string;
  companyName: string;
  addressLine: string;
  ward: string;
  district: string;
  city: string;
  note: string;
  isDefault: boolean;
}

// Vietnamese provinces for demo
const PROVINCES = ["TP.HCM", "TP.Hà Nội", "TP.Đà Nẵng", "Bình Dương", "Đồng Nai"];
const DISTRICTS: Record<string, string[]> = {
  "TP.HCM": ["Quận 1", "Quận 3", "Quận 7", "Quận 9", "Quận Bình Thạnh", "Thủ Đức"],
  "TP.Hà Nội": ["Quận Ba Đình", "Quận Hoàn Kiếm", "Quận Đống Đa", "Quận Cầu Giấy"],
  "TP.Đà Nẵng": ["Quận Hải Châu", "Quận Thanh Khê", "Quận Liên Chiểu"],
  "Bình Dương": ["Thành phố Thủ Dầu Một", "Thuận An", "Dĩ An"],
  "Đồng Nai": ["TP.Biên Hòa", "Long Thành", "Trảng Bom"]
};
const WARDS = ["Phường 1", "Phường 2", "Phường 3", "Phường 4", "Phường 5"];

const initialFormData: AddressFormData = {
  recipientName: '',
  phone: '',
  companyName: '',
  addressLine: '',
  ward: '',
  district: '',
  city: '',
  note: '',
  isDefault: false
};

const AddressesPage: React.FC = () => {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>(() => {
    // Initialize from user data
    if (user?.addresses && user.addresses.length > 0) {
      return user.addresses.map(addr => ({
        id: addr.id,
        recipientName: addr.recipientName,
        phone: addr.phone,
        companyName: '',
        addressLine: addr.streetAddress,
        ward: addr.ward,
        district: addr.district,
        city: addr.province,
        note: addr.deliveryNote,
        isDefault: addr.isDefault,
      }));
    }
    return [];
  });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Address | null>(null);
  const [formData, setFormData] = useState<AddressFormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<Record<keyof AddressFormData, string>>>({});

  const hasAddresses = addresses.length > 0;

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof AddressFormData, string>> = {};
    
    if (!formData.recipientName.trim()) {
      newErrors.recipientName = 'Vui lòng nhập họ tên người nhận';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Vui lòng nhập số điện thoại';
    } else if (!/^[0-9]{10,11}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Số điện thoại không hợp lệ';
    }
    if (!formData.city) {
      newErrors.city = 'Vui lòng chọn Tỉnh/Thành phố';
    }
    if (!formData.district) {
      newErrors.district = 'Vui lòng chọn Quận/Huyện';
    }
    if (!formData.ward) {
      newErrors.ward = 'Vui lòng chọn Phường/Xã';
    }
    if (!formData.addressLine.trim()) {
      newErrors.addressLine = 'Vui lòng nhập địa chỉ cụ thể';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOpenAdd = () => {
    setEditingAddress(null);
    setFormData(initialFormData);
    setErrors({});
    setIsFormOpen(true);
  };

  const handleOpenEdit = (address: Address) => {
    setEditingAddress(address);
    setFormData({
      recipientName: address.recipientName,
      phone: address.phone,
      companyName: address.companyName || '',
      addressLine: address.addressLine,
      ward: address.ward,
      district: address.district,
      city: address.city,
      note: address.note || '',
      isDefault: address.isDefault
    });
    setErrors({});
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingAddress(null);
    setFormData(initialFormData);
    setErrors({});
  };

  const handleSave = () => {
    if (!validateForm()) return;

    const newAddress: Address = {
      id: editingAddress?.id || `addr-${Date.now()}`,
      recipientName: formData.recipientName,
      phone: formData.phone,
      companyName: formData.companyName || undefined,
      addressLine: formData.addressLine,
      ward: formData.ward,
      district: formData.district,
      city: formData.city,
      note: formData.note || undefined,
      isDefault: formData.isDefault
    };

    let updatedAddresses: Address[];
    
    if (editingAddress) {
      updatedAddresses = addresses.map(addr => 
        addr.id === editingAddress.id ? newAddress : addr
      );
    } else {
      if (formData.isDefault) {
        updatedAddresses = [
          ...addresses.map(addr => ({ ...addr, isDefault: false })),
          newAddress
        ];
      } else {
        updatedAddresses = [...addresses, newAddress];
      }
    }

    if (formData.isDefault && !editingAddress?.isDefault) {
      updatedAddresses = updatedAddresses.map(addr => ({
        ...addr,
        isDefault: addr.id === newAddress.id
      }));
    }

    setAddresses(updatedAddresses);
    handleCloseForm();
  };

  const handleDelete = () => {
    if (!deleteConfirm) return;

    let updatedAddresses = addresses.filter(addr => addr.id !== deleteConfirm.id);
    
    // If deleted address was default and there are other addresses, set first as default
    if (deleteConfirm.isDefault && updatedAddresses.length > 0) {
      updatedAddresses = updatedAddresses.map((addr, index) => ({
        ...addr,
        isDefault: index === 0
      }));
    }

    setAddresses(updatedAddresses);
    setDeleteConfirm(null);
  };

  const handleSetDefault = (address: Address) => {
    const updatedAddresses = addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === address.id
    }));
    setAddresses(updatedAddresses);
  };

  const formatAddress = (address: Address) => {
    const parts = [
      address.addressLine,
      address.ward,
      address.district,
      address.city
    ].filter(Boolean);
    return parts.join(', ');
  };

  return (
    <AccountLayout>
      <div className="space-y-6">
        {/* Breadcrumb */}
        <nav className="flex items-center text-sm">
          <Link to="/" className="text-slate-500 hover:text-[#163F78] transition-colors flex items-center gap-1">
            Trang chủ
          </Link>
          <span className="mx-2 text-slate-400">›</span>
          <Link to="/tai-khoan" className="text-slate-500 hover:text-[#163F78] transition-colors">
            Tài khoản
          </Link>
          <span className="mx-2 text-slate-400">›</span>
          <span className="text-[#163F78] font-semibold">Địa chỉ giao hàng</span>
        </nav>

        {/* Page Header */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">
              Địa chỉ giao hàng
            </h1>
            <p className="text-slate-500 mt-1">
              Quản lý địa chỉ nhận hàng để thanh toán và giao hàng nhanh hơn.
            </p>
          </div>
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#163F78] hover:bg-[#1a4a8a] text-white font-semibold text-sm rounded-xl transition-colors"
          >
            <Plus size={18} />
            Thêm địa chỉ mới
          </button>
        </div>

        {/* Content */}
        {hasAddresses ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addresses.map((address) => (
              <div
                key={address.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 hover:border-slate-300 transition-colors"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex-1 min-w-0">
                    {address.isDefault && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full mb-2">
                        <Star size={10} />
                        Mặc định
                      </span>
                    )}
                    <h3 className="font-bold text-slate-900">{address.recipientName}</h3>
                    <p className="text-sm text-slate-600 mt-0.5">{address.phone}</p>
                  </div>
                </div>

                {address.companyName && (
                  <div className="flex items-center gap-2 mb-2">
                    <Building2 size={14} className="text-slate-400" />
                    <span className="text-sm text-slate-600">{address.companyName}</span>
                  </div>
                )}

                <div className="flex items-start gap-2 mb-2">
                  <MapPin size={14} className="text-slate-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-slate-600">{formatAddress(address)}</p>
                </div>

                {address.note && (
                  <div className="flex items-start gap-2 mb-4">
                    <FileText size={14} className="text-slate-400 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-slate-500 italic">{address.note}</p>
                  </div>
                )}

                <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                  <button
                    onClick={() => handleOpenEdit(address)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-slate-600 hover:text-[#163F78] hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <Edit2 size={14} />
                    Sửa
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(address)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={14} />
                    Xóa
                  </button>
                  {!address.isDefault && (
                    <button
                      onClick={() => handleSetDefault(address)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-slate-600 hover:text-[#163F78] hover:bg-slate-100 rounded-lg transition-colors ml-auto"
                    >
                      <Star size={14} />
                      Đặt mặc định
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 lg:p-12">
            <div className="max-w-md mx-auto text-center">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <MapPin size={40} className="text-slate-300" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">
                Bạn chưa có địa chỉ giao hàng
              </h3>
              <p className="text-slate-500 mb-6">
                Thêm địa chỉ để Mecsu có thể giao hàng nhanh và chính xác hơn.
              </p>
              <button
                onClick={handleOpenAdd}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#EABF3B] hover:bg-[#D9AF2F] text-[#1a1a1a] rounded-xl font-bold text-sm transition-colors"
              >
                <Plus size={18} />
                Thêm địa chỉ mới
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Address Form Modal */}
      {isFormOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-40"
            onClick={handleCloseForm}
          />
          <div className="fixed inset-y-0 right-0 w-full max-w-lg bg-white shadow-xl z-50 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h2 className="text-xl font-bold text-slate-900">
                {editingAddress ? 'Sửa địa chỉ' : 'Thêm địa chỉ mới'}
              </h2>
              <button
                onClick={handleCloseForm}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-slate-500" />
              </button>
            </div>

            {/* Form Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* Recipient Name */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Họ tên người nhận <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={formData.recipientName}
                    onChange={(e) => setFormData(prev => ({ ...prev, recipientName: e.target.value }))}
                    placeholder="Nhập họ tên người nhận"
                    className={cn(
                      "w-full pl-10 pr-4 py-3 bg-white border rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#163F78]/20 focus:border-[#163F78] transition-all",
                      errors.recipientName ? "border-red-400" : "border-slate-200"
                    )}
                  />
                </div>
                {errors.recipientName && (
                  <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle size={12} />
                    {errors.recipientName}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Số điện thoại <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="Nhập số điện thoại"
                    className={cn(
                      "w-full pl-10 pr-4 py-3 bg-white border rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#163F78]/20 focus:border-[#163F78] transition-all",
                      errors.phone ? "border-red-400" : "border-slate-200"
                    )}
                  />
                </div>
                {errors.phone && (
                  <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle size={12} />
                    {errors.phone}
                  </p>
                )}
              </div>

              {/* Company Name */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Tên công ty / doanh nghiệp <span className="text-slate-400">(tùy chọn)</span>
                </label>
                <div className="relative">
                  <Building2 size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                    placeholder="Nhập tên công ty (nếu có)"
                    className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#163F78]/20 focus:border-[#163F78] transition-all"
                  />
                </div>
              </div>

              {/* Province/City */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Tỉnh/Thành phố <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.city}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    city: e.target.value,
                    district: '',
                    ward: ''
                  }))}
                  className={cn(
                    "w-full px-4 py-3 bg-white border rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#163F78]/20 focus:border-[#163F78] transition-all",
                    errors.city ? "border-red-400" : "border-slate-200"
                  )}
                >
                  <option value="">Chọn Tỉnh/Thành phố</option>
                  {PROVINCES.map(province => (
                    <option key={province} value={province}>{province}</option>
                  ))}
                </select>
                {errors.city && (
                  <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle size={12} />
                    {errors.city}
                  </p>
                )}
              </div>

              {/* District */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Quận/Huyện <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.district}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    district: e.target.value,
                    ward: ''
                  }))}
                  disabled={!formData.city}
                  className={cn(
                    "w-full px-4 py-3 bg-white border rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#163F78]/20 focus:border-[#163F78] transition-all",
                    errors.district ? "border-red-400" : "border-slate-200",
                    !formData.city && "bg-slate-50 cursor-not-allowed"
                  )}
                >
                  <option value="">Chọn Quận/Huyện</option>
                  {formData.city && DISTRICTS[formData.city]?.map(district => (
                    <option key={district} value={district}>{district}</option>
                  ))}
                </select>
                {errors.district && (
                  <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle size={12} />
                    {errors.district}
                  </p>
                )}
              </div>

              {/* Ward */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Phường/Xã <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.ward}
                  onChange={(e) => setFormData(prev => ({ ...prev, ward: e.target.value }))}
                  disabled={!formData.district}
                  className={cn(
                    "w-full px-4 py-3 bg-white border rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#163F78]/20 focus:border-[#163F78] transition-all",
                    errors.ward ? "border-red-400" : "border-slate-200",
                    !formData.district && "bg-slate-50 cursor-not-allowed"
                  )}
                >
                  <option value="">Chọn Phường/Xã</option>
                  {formData.district && WARDS.map(ward => (
                    <option key={ward} value={ward}>{ward}</option>
                  ))}
                </select>
                {errors.ward && (
                  <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle size={12} />
                    {errors.ward}
                  </p>
                )}
              </div>

              {/* Address Line */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Địa chỉ cụ thể <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <MapPin size={18} className="absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    value={formData.addressLine}
                    onChange={(e) => setFormData(prev => ({ ...prev, addressLine: e.target.value }))}
                    placeholder="Số nhà, tên đường,..."
                    className={cn(
                      "w-full pl-10 pr-4 py-3 bg-white border rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#163F78]/20 focus:border-[#163F78] transition-all",
                      errors.addressLine ? "border-red-400" : "border-slate-200"
                    )}
                  />
                </div>
                {errors.addressLine && (
                  <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle size={12} />
                    {errors.addressLine}
                  </p>
                )}
              </div>

              {/* Note */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Ghi chú giao hàng <span className="text-slate-400">(tùy chọn)</span>
                </label>
                <div className="relative">
                  <FileText size={18} className="absolute left-3 top-3 text-slate-400" />
                  <textarea
                    value={formData.note}
                    onChange={(e) => setFormData(prev => ({ ...prev, note: e.target.value }))}
                    placeholder="Ví dụ: Giao giờ hành chính, gọi trước khi giao,..."
                    rows={2}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#163F78]/20 focus:border-[#163F78] transition-all resize-none"
                  />
                </div>
              </div>

              {/* Set as Default */}
              <label className="flex items-center gap-3 cursor-pointer">
                <div 
                  className={cn(
                    "w-5 h-5 rounded border-2 flex items-center justify-center transition-all",
                    formData.isDefault 
                      ? "bg-[#163F78] border-[#163F78]" 
                      : "border-slate-300 hover:border-slate-400"
                  )}
                  onClick={() => setFormData(prev => ({ ...prev, isDefault: !prev.isDefault }))}
                >
                  {formData.isDefault && <CheckCircle2 size={14} className="text-white" />}
                </div>
                <span className="text-sm text-slate-700">Đặt làm địa chỉ mặc định</span>
              </label>
            </div>

            {/* Footer */}
            <div className="flex items-center gap-3 p-6 border-t border-slate-200 bg-slate-50">
              <button
                onClick={handleCloseForm}
                className="flex-1 px-4 py-3 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 font-medium text-sm rounded-xl transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleSave}
                className="flex-1 px-4 py-3 bg-[#163F78] hover:bg-[#1a4a8a] text-white font-semibold text-sm rounded-xl transition-colors"
              >
                Lưu địa chỉ
              </button>
            </div>
          </div>
        </>
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setDeleteConfirm(null)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 size={24} className="text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 text-center mb-2">
                Xóa địa chỉ
              </h3>
              <p className="text-sm text-slate-600 text-center mb-6">
                Bạn có chắc muốn xóa địa chỉ này không?
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 px-4 py-2.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 font-medium text-sm rounded-xl transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold text-sm rounded-xl transition-colors"
                >
                  Xóa
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </AccountLayout>
  );
};

export default AddressesPage;
