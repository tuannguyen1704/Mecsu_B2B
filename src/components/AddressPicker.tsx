import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus } from 'lucide-react';
import { Address } from '../types/auth';
import AddressCard from './ui/AddressCard';

interface AddressPickerProps {
  isOpen: boolean;
  onClose: () => void;
  addresses: Address[];
  selectedId?: string;
  onSelect: (address: Address) => void;
  onEdit: (address: Address) => void;
  onAddNew: () => void;
}

export default function AddressPicker({
  isOpen,
  onClose,
  addresses,
  selectedId,
  onSelect,
  onEdit,
  onAddNew,
}: AddressPickerProps) {
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  if (!isOpen) return null;

  const handleSelect = (address: Address) => {
    onSelect(address);
    onClose();
  };

  const handleEdit = (address: Address) => {
    setEditingAddress(address);
  };

  const handleEditComplete = () => {
    setEditingAddress(null);
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
              onClick={onClose}
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
                    <h3 className="text-lg font-bold text-slate-900">Chọn địa chỉ giao hàng</h3>
                    <p className="text-sm text-slate-500 mt-0.5">
                      {addresses.length} địa chỉ đã lưu
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-full hover:bg-slate-100 transition-colors"
                  >
                    <X size={20} className="text-slate-400" />
                  </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-3">
                  {addresses.map((address) => (
                    <AddressCard
                      key={address.id}
                      address={address}
                      isDefault={address.isDefault}
                      selectable
                      selected={selectedId === address.id}
                      onSelect={() => handleSelect(address)}
                      onEdit={() => handleEdit(address)}
                      showActions={true}
                    />
                  ))}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-slate-200 bg-slate-50">
                  <button
                    onClick={onAddNew}
                    className="w-full py-3.5 bg-white border-2 border-dashed border-slate-300 text-slate-600 font-semibold text-sm rounded-xl hover:border-[#003B73] hover:text-[#003B73] transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus size={18} />
                    Thêm địa chỉ mới
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
