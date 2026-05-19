import React from 'react';
import { MapPin, Phone, User, ChevronDown } from 'lucide-react';
import { Address, PROVINCES, DISTRICTS, WARDS } from '../types/auth';

interface AddressFormProps {
  address: Address;
  onChange: (address: Address) => void;
  errors?: Record<string, string>;
  showRecipientFields?: boolean;
}

export default function AddressForm({ address, onChange, errors = {}, showRecipientFields = true }: AddressFormProps) {
  const [showProvinces, setShowProvinces] = React.useState(false);
  const [showDistricts, setShowDistricts] = React.useState(false);
  const [showWards, setShowWards] = React.useState(false);

  const provinceRef = React.useRef<HTMLDivElement>(null);
  const districtRef = React.useRef<HTMLDivElement>(null);
  const wardRef = React.useRef<HTMLDivElement>(null);

  const selectedProvince = PROVINCES.find(p => p.id === address.province);
  const districts = address.province ? DISTRICTS[address.province] || [] : [];
  const selectedDistrict = districts.find(d => d.id === address.district);
  const wards = address.district ? WARDS[address.district] || [] : [];

  // Close dropdowns on outside click
  React.useEffect(() => {
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

  const handleChange = (field: keyof Address, value: string) => {
    const updated = { ...address, [field]: value };
    
    // Reset dependent fields
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
      {/* Recipient Name & Phone Row - only show for guests */}
      {showRecipientFields && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-2">
              <User size={12} className="inline mr-1" />
              Tên người nhận
            </label>
            <input
              type="text"
              value={address.recipientName}
              onChange={(e) => handleChange('recipientName', e.target.value)}
              placeholder="Nguyễn Văn A"
              className={`w-full px-4 py-3 border rounded-xl text-sm transition-all
                ${errors.recipientName 
                  ? 'border-red-400 bg-red-50 focus:ring-2 focus:ring-red-200' 
                  : 'border-[#E2E8F0] bg-white hover:border-slate-300 focus:border-[#003B73] focus:ring-2 focus:ring-[#003B73]/10'
                }`}
            />
            {errors.recipientName && (
              <p className="text-xs text-red-500 mt-1">{errors.recipientName}</p>
            )}
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-2">
              <Phone size={12} className="inline mr-1" />
              Số điện thoại
            </label>
            <input
              type="tel"
              value={address.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="0901234567"
              className={`w-full px-4 py-3 border rounded-xl text-sm transition-all
                ${errors.phone 
                  ? 'border-red-400 bg-red-50 focus:ring-2 focus:ring-red-200' 
                  : 'border-[#E2E8F0] bg-white hover:border-slate-300 focus:border-[#003B73] focus:ring-2 focus:ring-[#003B73]/10'
                }`}
            />
            {errors.phone && (
              <p className="text-xs text-red-500 mt-1">{errors.phone}</p>
            )}
          </div>
        </div>
      )}

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
