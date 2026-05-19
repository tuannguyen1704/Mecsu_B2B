import React from 'react';
import { MapPin, Phone, User, Pencil, Trash2, Check, Star } from 'lucide-react';
import { Address, PROVINCES, DISTRICTS, WARDS } from '../../types/auth';

interface AddressCardProps {
  address: Address;
  isDefault?: boolean;
  onEdit: () => void;
  onDelete?: () => void;
  onSetDefault?: () => void;
  compact?: boolean;
  selectable?: boolean;
  selected?: boolean;
  onSelect?: () => void;
  showActions?: boolean;
  showDefaultButton?: boolean;
}

export default function AddressCard({
  address,
  isDefault = false,
  onEdit,
  onDelete,
  onSetDefault,
  compact = false,
  selectable = false,
  selected = false,
  onSelect,
  showActions = true,
  showDefaultButton = true,
}: AddressCardProps) {
  // Get address labels
  const province = PROVINCES.find(p => p.id === address.province);
  const districts = address.province ? DISTRICTS[address.province] || [] : [];
  const district = districts.find(d => d.id === address.district);
  const wards = address.district ? WARDS[address.district] || [] : [];
  const ward = wards.find(w => w.id === address.ward);

  const fullAddress = [
    address.streetAddress,
    ward?.name,
    district?.name,
    province?.name,
  ].filter(Boolean).join(', ');

  if (selectable) {
    return (
      <button
        onClick={onSelect}
        className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
          selected
            ? 'border-brand-secondary bg-brand-secondary/5'
            : 'border-slate-200 hover:border-slate-300 bg-white'
        } ${compact ? '' : 'p-5'}`}
      >
        <div className="flex items-start gap-3">
          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
            selected
              ? 'border-brand-secondary bg-brand-secondary'
              : 'border-slate-300'
          }`}>
            {selected && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
          </div>
          <div className="flex-1">
            {isDefault && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#FFC72C]/20 text-[#003B73] text-[10px] font-bold rounded mb-2">
                <Check size={10} />
                Mặc định
              </span>
            )}
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-slate-900">{address.recipientName}</span>
              <span className="text-slate-300">|</span>
              <span className="text-slate-600 text-sm">{address.phone}</span>
            </div>
            <p className="text-sm text-slate-500">{fullAddress}</p>
          </div>
        </div>
      </button>
    );
  }

  return (
    <div className={`bg-white rounded-xl border border-slate-200 overflow-hidden ${
      compact ? 'p-4' : 'p-5'
    }`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            {isDefault && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#FFC72C]/20 text-[#003B73] text-[10px] font-bold rounded">
                <Star size={10} />
                Mặc định
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mb-1">
            <User size={14} className="text-slate-400" />
            <span className="font-semibold text-slate-900">{address.recipientName}</span>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <Phone size={14} className="text-slate-400" />
            <span className="text-sm text-slate-600">{address.phone}</span>
          </div>
          <div className="flex items-start gap-2">
            <MapPin size={14} className="text-slate-400 mt-0.5 shrink-0" />
            <p className="text-sm text-slate-500">{fullAddress}</p>
          </div>
          {address.deliveryNote && (
            <p className="text-xs text-slate-400 mt-2 pl-6 italic">
              Ghi chú: {address.deliveryNote}
            </p>
          )}
        </div>

        {showActions && (
          <div className="flex flex-col gap-1 shrink-0">
            <button
              onClick={onEdit}
              className="p-2 rounded-lg text-slate-400 hover:text-[#003B73] hover:bg-slate-100 transition-colors"
              title="Sửa"
            >
              <Pencil size={16} />
            </button>
            {onDelete && (
              <button
                onClick={onDelete}
                className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                title="Xóa"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        )}
      </div>

      {showDefaultButton && showActions && (
        <div className="mt-4 pt-4 border-t border-slate-100 flex gap-3">
          {onSetDefault && !isDefault && (
            <button
              onClick={onSetDefault}
              className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-500 hover:text-[#003B73] hover:bg-slate-50 rounded-lg transition-colors"
            >
              <Check size={14} />
              Đặt làm mặc định
            </button>
          )}
        </div>
      )}
    </div>
  );
}
