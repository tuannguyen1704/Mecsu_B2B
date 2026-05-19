import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronLeft,
  CreditCard,
  Truck,
  MapPin,
  User,
  Phone,
  Mail,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Package,
  ChevronDown,
  Search,
  Building2,
  FileText,
  Upload,
  Lock,
  HeadphonesIcon,
  Receipt,
  Clock,
  Banknote,
  Handshake,
  Calendar,
  X,
  ShoppingCart,
  Info,
  AlertCircle,
  Plus,
} from 'lucide-react';
import { Product } from '../types';
import { useSupabaseImages } from '../hooks/useSupabaseImages';
import { useAuth } from '../hooks/useAuth';
import { Address, PROVINCES, DISTRICTS, WARDS } from '../types/auth';
import AddressCard from './ui/AddressCard';
import AddressPicker from './AddressPicker';
import AddressModal from './AddressModal';

const STORAGE_KEY = 'mecsu_checkout_form';

// Helper format address tránh undefined/null
const formatAddressLine = (addr: { streetAddress?: string; ward?: string; district?: string; province?: string } | null | undefined) => {
  if (!addr) return '';
  const province = PROVINCES.find(p => p.id === addr.province)?.name || addr.province || '';
  const district = DISTRICTS[addr.province]?.find(d => d.id === addr.district)?.name || addr.district || '';
  const ward = WARDS[addr.district]?.find(w => w.id === addr.ward)?.name || addr.ward || '';
  return [addr.streetAddress, ward, district, province].filter(Boolean).join(', ');
};

interface CartItem {
  product: Product;
  quantity: number;
}

interface Option {
  id: string;
  name: string;
}

type CustomerType = 'personal' | 'business';
type ShippingMethod = 'standard' | 'fast' | 'pickup';
type PaymentMethod = 'bank' | 'cod' | 'quotation' | 'netterms';

interface FormData {
  fullName: string;
  phone: string;
  email: string;
  companyName: string;
  taxCode: string;
  needVatInvoice: boolean;
  vatCompanyName: string;
  vatTaxCode: string;
  vatAddress: string;
  vatEmail: string;
  province: string;
  district: string;
  ward: string;
  address: string;
  deliveryNote: string;
  shippingMethod: ShippingMethod;
  paymentMethod: PaymentMethod;
  poNumber: string;
  internalCode: string;
  purchaseNote: string;
  purchaseOrderFile: File | null;
}

interface FormErrors {
  fullName?: string;
  phone?: string;
  email?: string;
  companyName?: string;
  taxCode?: string;
  vatCompanyName?: string;
  vatTaxCode?: string;
  address?: string;
}

const mecsuLogo = "/assets/mecsu.png";

const getInitialFormData = (): FormData => ({
  fullName: '',
  phone: '',
  email: '',
  companyName: '',
  taxCode: '',
  needVatInvoice: false,
  vatCompanyName: '',
  vatTaxCode: '',
  vatAddress: '',
  vatEmail: '',
  province: '',
  district: '',
  ward: '',
  address: '',
  deliveryNote: '',
  shippingMethod: 'standard',
  paymentMethod: 'bank',
  poNumber: '',
  internalCode: '',
  purchaseNote: '',
  purchaseOrderFile: null,
});

interface CustomSelectProps {
  label: string;
  options: Option[];
  value: string;
  onChange: (id: string) => void;
  placeholder: string;
  disabled?: boolean;
  error?: string;
}

function CustomSelect({ label, options, value, onChange, placeholder, disabled, error }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedOption = options.find(o => o.id === value);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const filteredOptions = options.filter(o =>
    o.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-2 relative" ref={dropdownRef}>
      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">{label}</label>
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`w-full px-4 py-3.5 bg-white border rounded-xl text-sm font-medium flex items-center justify-between transition-all outline-none ${
          error
            ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/10'
            : disabled
              ? 'opacity-50 cursor-not-allowed bg-slate-50 border-slate-200'
              : 'border-slate-200 hover:border-brand-secondary focus:border-brand-secondary focus:ring-2 focus:ring-brand-secondary/10'
        }`}
      >
        <span className={value ? 'text-slate-900' : 'text-slate-400'}>
          {selectedOption ? selectedOption.name : placeholder}
        </span>
        <ChevronDown size={16} className={`text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {error && <p className="text-[11px] text-red-500 ml-1 mt-1">{error}</p>}

      <AnimatePresence>
        {isOpen && !disabled && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute z-[300] top-full left-0 w-full mt-2 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden"
          >
            <div className="p-3 border-b border-slate-100 flex items-center gap-2 bg-slate-50/50">
              <Search size={14} className="text-slate-400" />
              <input
                ref={inputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm kiếm..."
                className="flex-1 bg-transparent border-none outline-none text-xs font-medium text-slate-900"
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm('')} className="text-slate-400 hover:text-slate-600">
                  <X size={14} />
                </button>
              )}
            </div>
            <div className="max-h-[200px] overflow-y-auto py-1">
              {filteredOptions.length > 0 ? (
                filteredOptions.map(option => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => {
                      onChange(option.id);
                      setIsOpen(false);
                      setSearchTerm('');
                    }}
                    className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors flex items-center justify-between ${
                      value === option.id ? 'bg-brand-secondary/5 text-brand-secondary' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>{option.name}</span>
                    {value === option.id && <CheckCircle2 size={14} className="text-brand-secondary" />}
                  </button>
                ))
              ) : (
                <div className="px-4 py-6 text-center text-xs font-medium text-slate-400">Không tìm thấy</div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface RadioCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  selected: boolean;
  onClick: () => void;
  badge?: string;
  helperText?: string;
  disabled?: boolean;
}

function RadioCard({ icon, title, description, selected, onClick, badge, helperText, disabled }: RadioCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`w-full p-4 rounded-xl border-2 text-left transition-all flex items-start gap-4 ${
        disabled
          ? 'opacity-50 cursor-not-allowed border-slate-100 bg-slate-50/50'
          : selected
            ? 'border-brand-secondary bg-brand-secondary/5'
            : 'border-slate-200 hover:border-slate-300 bg-white'
      }`}
    >
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
        disabled
          ? 'bg-slate-100 text-slate-400'
          : selected
            ? 'bg-brand-secondary text-white'
            : 'bg-slate-100 text-slate-500'
      }`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-sm font-bold ${disabled ? 'text-slate-400' : selected ? 'text-brand-secondary' : 'text-slate-900'}`}>
            {title}
          </span>
          {badge && (
            <span className="px-2 py-0.5 bg-brand-primary/20 text-brand-secondary text-[10px] font-bold rounded">
              {badge}
            </span>
          )}
        </div>
        <p className="text-xs text-slate-500 mt-0.5">{description}</p>
        {helperText && (
          <p className="text-[11px] text-slate-400 mt-1 italic">{helperText}</p>
        )}
      </div>
      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
        disabled
          ? 'border-slate-300 bg-slate-100'
          : selected
            ? 'border-brand-secondary'
            : 'border-slate-300'
      }`}>
        {selected && <div className="w-2.5 h-2.5 rounded-full bg-brand-secondary" />}
      </div>
    </button>
  );
}

interface CollapsibleSectionProps {
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  isExpanded: boolean;
  onToggle: () => void;
  defaultExpanded?: boolean;
  children: React.ReactNode;
}

function CollapsibleSection({ title, subtitle, icon, isExpanded, onToggle, defaultExpanded = false, children }: CollapsibleSectionProps) {
  const [hasBeenExpanded, setHasBeenExpanded] = useState(defaultExpanded);
  const shouldShowContent = isExpanded || hasBeenExpanded;

  const handleToggle = () => {
    setHasBeenExpanded(true);
    onToggle();
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      <button
        type="button"
        onClick={handleToggle}
        className="w-full flex items-center justify-between p-6 hover:bg-slate-50/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-secondary/10 flex items-center justify-center">
            <span className="text-brand-secondary">{icon}</span>
          </div>
          <div className="text-left">
            <h2 className="text-lg font-bold text-slate-900">{title}</h2>
            {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
          </div>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={20} className="text-slate-400" />
        </motion.div>
      </button>
      <AnimatePresence>
        {shouldShowContent && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 border-t border-slate-100 pt-4">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface CheckoutPageProps {
  items: CartItem[];
  onBack: () => void;
  onOrderComplete: (orderData: any) => void;
}

export default function CheckoutPage({ items, onBack, onOrderComplete }: CheckoutPageProps) {
  const [step, setStep] = useState(1);
  const { getRandomImage } = useSupabaseImages();
  const { user, isLoggedIn, getDefaultAddress, addAddress, updateAddress, deleteAddress, setDefaultAddress } = useAuth();
  const [formData, setFormData] = useState<FormData>(getInitialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [fileName, setFileName] = useState<string | null>(null);
  const [b2bExpanded, setB2bExpanded] = useState(false);
  const [mobileSummaryOpen, setMobileSummaryOpen] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // New address management state
  const [showAddressPicker, setShowAddressPicker] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);

  // Auto-fill from user profile
  useEffect(() => {
    if (isLoggedIn && user) {
      // Auto-fill buyer info from user profile
      setFormData(prev => ({
        ...prev,
        fullName: prev.fullName || user.fullName,
        phone: prev.phone || user.phone,
        email: prev.email || user.email,
      }));

      // Also set touched and clear errors for auto-filled fields
      setTouched(prev => ({
        ...prev,
        fullName: true,
        phone: true,
        email: true,
      }));
      setErrors(prev => {
        const newErrors = { ...prev };
        if (!prev.fullName || !user.fullName) delete newErrors.fullName;
        if (!prev.phone || !user.phone) delete newErrors.phone;
        if (!prev.email || !user.email) delete newErrors.email;
        return newErrors;
      });

      // Auto-select default address
      const defaultAddr = getDefaultAddress();
      if (defaultAddr) {
        setSelectedAddress(defaultAddr);
        setFormData(prev => ({
          ...prev,
          province: prev.province || defaultAddr.province || '',
          district: prev.district || defaultAddr.district || '',
          ward: prev.ward || defaultAddr.ward || '',
          address: prev.address || defaultAddr.streetAddress || '',
          deliveryNote: prev.deliveryNote || defaultAddr.deliveryNote || '',
        }));
      } else if (user.addresses && user.addresses.length > 0) {
        // If no default, select first address
        setSelectedAddress(user.addresses[0]);
      }
    }
  }, [isLoggedIn, user, getDefaultAddress]);

  // Handle selecting an address from picker
  const handleSelectAddress = useCallback((address: Address) => {
    // Merge with user info for logged-in users
    const fullAddress: Address = {
      ...address,
      recipientName: isLoggedIn && user ? user.fullName : address.recipientName,
      phone: isLoggedIn && user ? user.phone : address.phone,
    };
    setSelectedAddress(fullAddress);
    setFormData(prev => ({
      ...prev,
      province: address.province,
      district: address.district,
      ward: address.ward,
      address: address.streetAddress,
      deliveryNote: address.deliveryNote,
    }));
    setShowAddressPicker(false);
  }, [isLoggedIn, user]);

  // Handle editing an address
  const handleEditAddress = useCallback((address: Address) => {
    setEditingAddress(address);
    setShowAddressModal(true);
  }, []);

  // Handle adding a new address
  const handleAddNewAddress = useCallback(() => {
    setEditingAddress(null);
    setShowAddressModal(true);
    setShowAddressPicker(false);
  }, []);

  // Handle saving address from modal
  const handleSaveAddress = useCallback((address: Address, saveToAccount: boolean) => {
    if (saveToAccount) {
      if (editingAddress) {
        updateAddress(editingAddress.id, address);
      } else {
        addAddress(address);
      }
    }
    
    // Luôn cập nhật selectedAddress với thông tin đầy đủ
    const fullAddress: Address = {
      ...address,
      recipientName: isLoggedIn && user ? user.fullName : address.recipientName,
      phone: isLoggedIn && user ? user.phone : address.phone,
    };
    setSelectedAddress(fullAddress);
    
    // Fill form
    setFormData(prev => ({
      ...prev,
      province: address.province,
      district: address.district,
      ward: address.ward,
      address: address.streetAddress,
      deliveryNote: address.deliveryNote,
    }));
    
    setEditingAddress(null);
  }, [editingAddress, updateAddress, addAddress, isLoggedIn, user]);

  // Handle deleting an address
  const handleDeleteAddress = useCallback((id: string) => {
    // If deleting the selected address, switch to another one
    if (selectedAddress?.id === id) {
      const remaining = user?.addresses?.filter(a => a.id !== id);
      if (remaining && remaining.length > 0) {
        const newSelected = remaining[0];
        setSelectedAddress({
          ...newSelected,
          recipientName: isLoggedIn && user ? user.fullName : newSelected.recipientName,
          phone: isLoggedIn && user ? user.phone : newSelected.phone,
        });
        setFormData(prev => ({
          ...prev,
          province: newSelected.province || '',
          district: newSelected.district || '',
          ward: newSelected.ward || '',
          address: newSelected.streetAddress || '',
          deliveryNote: newSelected.deliveryNote || '',
        }));
      } else {
        setSelectedAddress(null);
        setFormData(prev => ({
          ...prev,
          province: '',
          district: '',
          ward: '',
          address: '',
          deliveryNote: '',
        }));
      }
    }
    deleteAddress(id);
  }, [selectedAddress, user?.addresses, deleteAddress, isLoggedIn, user]);

  // Handle setting default address
  const handleSetDefaultAddress = useCallback((id: string) => {
    setDefaultAddress(id);
    // Also update selectedAddress to reflect the change
    const addr = user?.addresses?.find(a => a.id === id);
    if (addr) {
      setSelectedAddress({
        ...addr,
        recipientName: isLoggedIn && user ? user.fullName : addr.recipientName,
        phone: isLoggedIn && user ? user.phone : addr.phone,
      });
    }
  }, [setDefaultAddress, user?.addresses, isLoggedIn, user]);

  // Load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setFormData({ ...getInitialFormData(), ...parsed, purchaseOrderFile: null });
      }
    } catch (e) {
      console.warn('Failed to load checkout form from storage');
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    try {
      const toSave = { ...formData, purchaseOrderFile: null };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch (e) {
      console.warn('Failed to save checkout form to storage');
    }
  }, [formData]);

  // Calculations
  const subtotal = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const shippingFee = formData.shippingMethod === 'pickup' ? 0 : formData.shippingMethod === 'fast' ? 45000 : subtotal > 1000000 ? 0 : 35000;
  const isBusinessCustomer = !!formData.companyName?.trim();

  // B2B discount for orders > 5M with company name
  const b2bDiscount = isBusinessCustomer && subtotal > 5000000 ? subtotal * 0.05 : 0;
  const vatAmount = subtotal * 0.1;
  const grandTotal = subtotal + shippingFee + vatAmount - b2bDiscount;

  // Validation
  const validateField = useCallback((name: string, value: string): string | undefined => {
    switch (name) {
      case 'fullName':
        if (!value.trim()) return 'Vui lòng nhập họ tên';
        if (value.trim().length < 2) return 'Họ tên quá ngắn';
        return undefined;
      case 'phone':
        if (!value.trim()) return 'Vui lòng nhập số điện thoại';
        if (!/^[0-9]{9,11}$/.test(value.replace(/\s/g, ''))) return 'Số điện thoại không hợp lệ';
        return undefined;
      case 'email':
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Email không hợp lệ';
        return undefined;
      case 'companyName':
        if (isBusinessCustomer && !value.trim()) return 'Vui lòng nhập tên công ty';
        return undefined;
      case 'address':
        if (!value.trim()) return 'Vui lòng nhập địa chỉ chi tiết';
        return undefined;
      default:
        return undefined;
    }
  }, [isBusinessCustomer]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => {
      const newData = { ...prev, [name]: type === 'checkbox' ? checked : value };
      if (name === 'province') {
        newData.district = '';
        newData.ward = '';
      }
      if (name === 'district') {
        newData.ward = '';
      }
      return newData;
    });

    if (touched[name]) {
      const error = validateField(name, type === 'checkbox' ? String(checked) : value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (name: string) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, formData[name as keyof FormData] as string || '');
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      if (name === 'province') {
        newData.district = '';
        newData.ward = '';
      }
      if (name === 'district') {
        newData.ward = '';
      }
      return newData;
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setFormData(prev => ({ ...prev, purchaseOrderFile: file }));
    }
  };

  const removeFile = () => {
    setFileName(null);
    setFormData(prev => ({ ...prev, purchaseOrderFile: null }));
  };

  // Check if step 1 is valid
  const getStep1Validity = () => {
    // If NOT logged in, require buyer info fields
    if (!isLoggedIn) {
      const requiredFields = ['fullName', 'phone', 'province', 'district', 'ward', 'address'];
      if (isBusinessCustomer) {
        requiredFields.push('companyName');
      }

      for (const field of requiredFields) {
        const value = formData[field as keyof FormData];
        if (!value || (typeof value === 'string' && !value.trim())) {
          return false;
        }
      }

      // Check validation errors
      for (const field of requiredFields) {
        const error = validateField(field, formData[field as keyof FormData] as string || '');
        if (error) return false;
      }
    }

    // If logged in, require at least one address
    if (isLoggedIn && (!user?.addresses || user.addresses.length === 0)) {
      return false;
    }

    return true;
  };

  const handleNextStep = () => {
    if (step === 1) {
      // Touch all fields to show validation
      const newTouched: Record<string, boolean> = {};

      // Only touch guest fields if not logged in
      if (!isLoggedIn) {
        const requiredFields = ['fullName', 'phone', 'province', 'district', 'ward', 'address'];
        if (isBusinessCustomer) requiredFields.push('companyName');
        requiredFields.forEach(f => newTouched[f] = true);
      }

      setTouched(newTouched);

      if (!getStep1Validity()) return;
    }
    
    if (step < 3) setStep(step + 1);
    else handleSubmit();
  };

  const handlePrevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = () => {
    const provinceLabel = PROVINCES.find(p => p.id === formData.province)?.name || formData.province;
    const districtLabel = DISTRICTS[formData.province]?.find(d => d.id === formData.district)?.name || formData.district;
    const districtWards = WARDS[formData.district] || [];
    const wardLabel = districtWards.find(w => w.id === formData.ward)?.name || formData.ward;

    // Build full address string
    const fullAddress = [formData.address, wardLabel, districtLabel, provinceLabel].filter(Boolean).join(', ');

    // Debug log for selectedAddress
    console.log("selectedAddress before create order:", selectedAddress);
    console.log("currentUser:", user);

    // Create normalized shipping address - ALWAYS extract receiverName and phone
    const normalizedShippingAddress = {
      // receiverName: prioritize from selectedAddress, then formData
      receiverName:
        selectedAddress?.receiverName ||
        selectedAddress?.name ||
        selectedAddress?.fullName ||
        selectedAddress?.recipientName ||
        formData.fullName ||
        (isLoggedIn && user ? user.fullName : '') ||
        '',

      // phone: prioritize from selectedAddress, then formData
      phone:
        selectedAddress?.phone ||
        selectedAddress?.phoneNumber ||
        formData.phone ||
        (isLoggedIn && user ? user.phone : '') ||
        '',

      // Address fields
      street: selectedAddress?.streetAddress || selectedAddress?.street || formData.address || '',
      ward: wardLabel,
      district: districtLabel,
      province: provinceLabel,

      // Full address string
      fullAddress:
        selectedAddress?.fullAddress ||
        [
          selectedAddress?.streetAddress || selectedAddress?.street || formData.address,
          wardLabel,
          districtLabel,
          provinceLabel
        ].filter(Boolean).join(', ')
    };

    // Debug log
    console.log("Created order shippingAddress:", normalizedShippingAddress);

    // Clear storage on successful order
    localStorage.removeItem(STORAGE_KEY);

    onOrderComplete({
      ...formData,
      shippingAddress: normalizedShippingAddress,
      items,
      subtotal,
      shippingFee,
      b2bDiscount,
      vatAmount,
      total: grandTotal,
      orderId: 'MEC-' + Math.random().toString(36).substr(2, 9).toUpperCase()
    });
  };

  // Use shared address data from auth types
  const currentDistricts = formData.province ? (DISTRICTS[formData.province] || []) : [];
  const currentWards = formData.district ? (WARDS[formData.district] || []) : [];

  const steps = [
    { num: 0, label: 'Giỏ hàng', status: 'completed' },
    { num: 1, label: 'Thông tin', status: step >= 1 ? 'active' : 'pending' },
    { num: 2, label: 'Thanh toán', status: step >= 2 ? 'active' : 'pending' },
    { num: 3, label: 'Xác nhận', status: step >= 3 ? 'active' : 'pending' },
  ];

  const isStep1Valid = getStep1Validity();

  return (
    <div className="min-h-screen bg-slate-50 pb-20 lg:pb-0">
      {/* Minimal Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors">
              <ChevronLeft size={20} />
              <span className="text-sm font-medium hidden sm:block">Quay lại</span>
            </button>
            <div className="w-px h-6 bg-slate-200 mx-2 hidden sm:block" />
            <img src={mecsuLogo} alt="MECSU" className="h-7 sm:h-8" />
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            <div className="hidden sm:flex items-center gap-2 text-slate-500">
              <ShieldCheck size={16} className="text-green-600" />
              <span className="text-xs font-medium">Thanh toán bảo mật</span>
            </div>
            <div className="hidden md:flex items-center gap-2 text-slate-500">
              <HeadphonesIcon size={16} className="text-brand-secondary" />
              <span className="text-xs font-medium">Hỗ trợ: 1800 8137</span>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Indicator - Improved */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center justify-center gap-2 sm:gap-4">
            {steps.map((s, i) => (
              <React.Fragment key={s.num}>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold transition-colors ${
                    s.num < step
                      ? 'bg-green-500 text-white'
                      : s.num === step
                        ? 'bg-brand-secondary text-white'
                        : 'bg-slate-200 text-slate-500'
                  }`}>
                    {s.num < step ? <CheckCircle2 size={14} /> : s.num + 1}
                  </div>
                  <span className={`text-[11px] sm:text-xs font-medium hidden sm:block ${
                    s.num < step
                      ? 'text-green-600'
                      : s.num === step
                        ? 'text-brand-secondary'
                        : 'text-slate-400'
                  }`}>
                    {s.label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`w-6 sm:w-10 h-0.5 rounded ${
                    s.num < step ? 'bg-green-400' : 'bg-slate-200'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-6">
            <AnimatePresence mode="wait">
              {/* Step 1: Shipping Information */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4 sm:space-y-6"
                >
                  {/* Buyer Information - Only show for guests */}
                  {!isLoggedIn ? (
                    <CollapsibleSection
                      title="Thông tin người mua"
                      subtitle="Thông tin người đặt hàng"
                      icon={<User size={20} />}
                      isExpanded={true}
                      defaultExpanded={true}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className={`text-[10px] font-bold uppercase tracking-widest ml-1 ${
                            errors.fullName && touched.fullName ? 'text-red-500' : 'text-slate-500'
                          }`}>
                            Họ và tên *
                          </label>
                          <input
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            onBlur={() => handleBlur('fullName')}
                            placeholder="Nguyễn Văn A"
                            className={`w-full px-4 py-3.5 bg-white border rounded-xl text-sm font-medium outline-none transition-all ${
                              errors.fullName && touched.fullName
                                ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/10'
                                : 'border-slate-200 focus:border-brand-secondary focus:ring-2 focus:ring-brand-secondary/10'
                            }`}
                          />
                          {errors.fullName && touched.fullName && (
                            <p className="text-[11px] text-red-500 ml-1 flex items-center gap-1">
                              <AlertCircle size={12} /> {errors.fullName}
                            </p>
                          )}
                        </div>
                        <div className="space-y-1.5">
                          <label className={`text-[10px] font-bold uppercase tracking-widest ml-1 ${
                            errors.phone && touched.phone ? 'text-red-500' : 'text-slate-500'
                          }`}>
                            Số điện thoại *
                          </label>
                          <input
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            onBlur={() => handleBlur('phone')}
                            placeholder="090 123 4567"
                            className={`w-full px-4 py-3.5 bg-white border rounded-xl text-sm font-medium outline-none transition-all ${
                              errors.phone && touched.phone
                                ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/10'
                                : 'border-slate-200 focus:border-brand-secondary focus:ring-2 focus:ring-brand-secondary/10'
                            }`}
                          />
                          {errors.phone && touched.phone && (
                            <p className="text-[11px] text-red-500 ml-1 flex items-center gap-1">
                              <AlertCircle size={12} /> {errors.phone}
                            </p>
                          )}
                        </div>
                        <div className="space-y-1.5">
                          <label className={`text-[10px] font-bold uppercase tracking-widest ml-1 ${
                            errors.email && touched.email ? 'text-red-500' : 'text-slate-500'
                          }`}>
                            Email
                          </label>
                          <input
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            onBlur={() => handleBlur('email')}
                            placeholder="email@company.com"
                            className={`w-full px-4 py-3.5 bg-white border rounded-xl text-sm font-medium outline-none transition-all ${
                              errors.email && touched.email
                                ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/10'
                                : 'border-slate-200 focus:border-brand-secondary focus:ring-2 focus:ring-brand-secondary/10'
                            }`}
                          />
                          {errors.email && touched.email && (
                            <p className="text-[11px] text-red-500 ml-1 flex items-center gap-1">
                              <AlertCircle size={12} /> {errors.email}
                            </p>
                          )}
                        </div>
                        {formData.companyName && (
                        <>
                          <div className="space-y-1.5">
                            <label className={`text-[10px] font-bold uppercase tracking-widest ml-1 ${
                              errors.companyName && touched.companyName ? 'text-red-500' : 'text-slate-500'
                            }`}>
                              Tên công ty
                            </label>
                            <input
                              name="companyName"
                              value={formData.companyName}
                              onChange={handleInputChange}
                              onBlur={() => handleBlur('companyName')}
                              placeholder="Công ty TNHH ABC"
                              className={`w-full px-4 py-3.5 bg-white border rounded-xl text-sm font-medium outline-none transition-all ${
                                errors.companyName && touched.companyName
                                  ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/10'
                                  : 'border-slate-200 focus:border-brand-secondary focus:ring-2 focus:ring-brand-secondary/10'
                              }`}
                            />
                            {errors.companyName && touched.companyName && (
                              <p className="text-[11px] text-red-500 ml-1 flex items-center gap-1">
                                <AlertCircle size={12} /> {errors.companyName}
                              </p>
                            )}
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                              Mã số thuế
                            </label>
                            <input
                              name="taxCode"
                              value={formData.taxCode}
                              onChange={handleInputChange}
                              placeholder="0123456789"
                              className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:border-brand-secondary focus:ring-2 focus:ring-brand-secondary/10 outline-none transition-all"
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </CollapsibleSection>
                  ) : null}

                  {/* VAT Invoice Option - Checkbox Style */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-5">
                    <label className="flex items-start gap-4 cursor-pointer">
                      <div className="relative mt-0.5">
                        <input
                          type="checkbox"
                          name="needVatInvoice"
                          checked={formData.needVatInvoice}
                          onChange={handleInputChange}
                          className="sr-only peer"
                        />
                        <div className="w-5 h-5 border-2 rounded flex items-center justify-center transition-all
                          peer-checked:bg-brand-secondary peer-checked:border-brand-secondary
                          border-slate-300 peer-focus:ring-2 peer-focus:ring-brand-secondary/10
                          peer-checked:peer-disabled:bg-slate-300">
                          <CheckCircle2 size={14} className="text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Receipt size={18} className="text-brand-secondary" />
                          <span className="text-sm font-bold text-slate-900">Xuất hóa đơn VAT</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">Yêu cầu xuất hóa đơn giá trị gia tăng cho đơn hàng này</p>

                        <AnimatePresence>
                          {formData.needVatInvoice && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-100">
                                <div className="space-y-1.5 md:col-span-2">
                                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                                    Tên công ty trên hóa đơn
                                  </label>
                                  <input
                                    name="vatCompanyName"
                                    value={formData.vatCompanyName}
                                    onChange={handleInputChange}
                                    placeholder="Công ty TNHH ABC"
                                    className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:border-brand-secondary focus:ring-2 focus:ring-brand-secondary/10 outline-none transition-all"
                                  />
                                </div>
                                <div className="space-y-1.5">
                                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                                    Mã số thuế
                                  </label>
                                  <input
                                    name="vatTaxCode"
                                    value={formData.vatTaxCode}
                                    onChange={handleInputChange}
                                    placeholder="0123456789"
                                    className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:border-brand-secondary focus:ring-2 focus:ring-brand-secondary/10 outline-none transition-all"
                                  />
                                </div>
                                <div className="space-y-1.5">
                                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                                    Email nhận hóa đơn
                                  </label>
                                  <input
                                    name="vatEmail"
                                    type="email"
                                    value={formData.vatEmail}
                                    onChange={handleInputChange}
                                    placeholder="accounting@company.com"
                                    className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:border-brand-secondary focus:ring-2 focus:ring-brand-secondary/10 outline-none transition-all"
                                  />
                                </div>
                                <div className="space-y-1.5 md:col-span-2">
                                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                                    Địa chỉ công ty
                                  </label>
                                  <input
                                    name="vatAddress"
                                    value={formData.vatAddress}
                                    onChange={handleInputChange}
                                    placeholder="123 Đường ABC, Phường XYZ, Quận 1, TP.HCM"
                                    className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:border-brand-secondary focus:ring-2 focus:ring-brand-secondary/10 outline-none transition-all"
                                  />
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </label>
                  </div>

                  {/* Shipping Address */}
                  <CollapsibleSection
                    title="Địa chỉ giao hàng"
                    subtitle="Nơi nhận hàng"
                    icon={<MapPin size={20} />}
                    isExpanded={true}
                    defaultExpanded={true}
                  >
                    <div className="pt-4">
                      {/* Show logged-in badge */}
                      {isLoggedIn && (
                        <div className="bg-slate-50 rounded-xl p-4 mb-4">
                          <p className="text-sm text-slate-600">
                            <span className="font-medium">Đang đặt hàng bằng tài khoản:</span>{' '}
                            <span className="text-[#003B73]">{user?.email}</span>
                          </p>
                        </div>
                      )}

                      {/* TRƯỜNG HỢP 1: Đã đăng nhập + Có địa chỉ */}
                      {isLoggedIn && user?.addresses && user.addresses.length > 0 && selectedAddress && (
                        <div className="space-y-4">
                          {/* Show selected address as AddressCard with full actions */}
                          <AddressCard
                            address={selectedAddress}
                            isDefault={selectedAddress.isDefault}
                            showActions={true}
                            onEdit={() => handleEditAddress(selectedAddress)}
                            onDelete={() => handleDeleteAddress(selectedAddress.id)}
                            onSetDefault={() => handleSetDefaultAddress(selectedAddress.id)}
                          />

                          {/* Action buttons */}
                          <div className="flex flex-wrap gap-3">
                            <button
                              onClick={() => setShowAddressPicker(true)}
                              className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-[#003B73] bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
                            >
                              Đổi địa chỉ
                            </button>
                            <button
                              onClick={handleAddNewAddress}
                              className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-[#003B73] bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
                            >
                              <Plus size={16} />
                              Thêm địa chỉ mới
                            </button>
                          </div>
                        </div>
                      )}

                      {/* TRƯỜNG HỢP 2: Đã đăng nhập + CHƯA có địa chỉ */}
                      {isLoggedIn && (!user?.addresses || user.addresses.length === 0) && (
                        <div className="text-center py-8 bg-slate-50 rounded-xl">
                          <MapPin size={48} className="mx-auto text-slate-300 mb-3" />
                          <p className="font-semibold text-slate-700">Bạn chưa có địa chỉ giao hàng</p>
                          <p className="text-sm text-slate-500 mb-4">Vui lòng thêm địa chỉ để tiếp tục đặt hàng</p>
                          <button
                            onClick={handleAddNewAddress}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-[#003B73] text-white font-semibold text-sm rounded-xl hover:bg-[#002d5a] transition-colors"
                          >
                            <Plus size={18} />
                            Thêm địa chỉ giao hàng
                          </button>
                        </div>
                      )}

                      {/* TRƯỜNG HỢP 3: CHƯA đăng nhập - Show Address Form */}
                      {!isLoggedIn && (
                        /* Show AddressForm if no addresses */
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <CustomSelect
                            label="Tỉnh / Thành phố *"
                            options={PROVINCES}
                            value={formData.province}
                            onChange={(val) => handleSelectChange('province', val)}
                            placeholder="Chọn tỉnh/thành phố"
                          />
                          <CustomSelect
                            label="Quận / Huyện *"
                            options={currentDistricts}
                            value={formData.district}
                            onChange={(val) => handleSelectChange('district', val)}
                            placeholder="Chọn quận/huyện"
                            disabled={!formData.province}
                          />
                          <CustomSelect
                            label="Phường / Xã *"
                            options={currentWards}
                            value={formData.ward}
                            onChange={(val) => handleSelectChange('ward', val)}
                            placeholder="Chọn phường/xã"
                            disabled={!formData.district}
                          />
                          <div className="space-y-1.5">
                            <label className={`text-[10px] font-bold uppercase tracking-widest ml-1 ${
                              errors.address && touched.address ? 'text-red-500' : 'text-slate-500'
                            }`}>
                              Địa chỉ chi tiết *
                            </label>
                            <input
                              name="address"
                              value={formData.address}
                              onChange={handleInputChange}
                              onBlur={() => handleBlur('address')}
                              disabled={!formData.ward}
                              placeholder={formData.ward ? "Số nhà, tên đường..." : "Chọn phường/xã trước"}
                              className={`w-full px-4 py-3.5 bg-white border rounded-xl text-sm font-medium outline-none transition-all ${
                                errors.address && touched.address
                                  ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/10'
                                  : !formData.ward
                                    ? 'opacity-50 cursor-not-allowed border-slate-200'
                                    : 'border-slate-200 focus:border-brand-secondary focus:ring-2 focus:ring-brand-secondary/10'
                              }`}
                            />
                            {errors.address && touched.address && (
                              <p className="text-[11px] text-red-500 ml-1 flex items-center gap-1">
                                <AlertCircle size={12} /> {errors.address}
                              </p>
                            )}
                          </div>
                          <div className="space-y-1.5 md:col-span-2">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                              Ghi chú giao hàng
                            </label>
                            <textarea
                              name="deliveryNote"
                              value={formData.deliveryNote}
                              onChange={handleInputChange}
                              placeholder="Ví dụ: Giao giờ hành chính, gọi trước khi giao..."
                              rows={2}
                              className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:border-brand-secondary focus:ring-2 focus:ring-brand-secondary/10 outline-none transition-all resize-none"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </CollapsibleSection>

                  {/* Shipping Method */}
                  <CollapsibleSection
                    title="Phương thức vận chuyển"
                    subtitle="Chọn cách nhận hàng"
                    icon={<Truck size={20} />}
                    isExpanded={true}
                    defaultExpanded={true}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-4">
                      <RadioCard
                        icon={<Truck size={20} />}
                        title="Giao tiêu chuẩn"
                        description="2-5 ngày làm việc"
                        selected={formData.shippingMethod === 'standard'}
                        onClick={() => setFormData(prev => ({ ...prev, shippingMethod: 'standard' }))}
                        badge={subtotal > 1000000 ? 'Miễn phí' : undefined}
                      />
                      <RadioCard
                        icon={<Clock size={20} />}
                        title="Giao nhanh"
                        description="Giao trong ngày"
                        selected={formData.shippingMethod === 'fast'}
                        onClick={() => setFormData(prev => ({ ...prev, shippingMethod: 'fast' }))}
                        badge="+45.000đ"
                      />
                      <RadioCard
                        icon={<Building2 size={20} />}
                        title="Nhận tại kho"
                        description="TP. Hồ Chí Minh"
                        selected={formData.shippingMethod === 'pickup'}
                        onClick={() => setFormData(prev => ({ ...prev, shippingMethod: 'pickup' }))}
                        badge="Miễn phí"
                      />
                    </div>
                  </CollapsibleSection>
                </motion.div>
              )}

              {/* Step 2: Payment Method */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4 sm:space-y-6"
                >
                  {/* Payment Method */}
                  <CollapsibleSection
                    title="Phương thức thanh toán"
                    subtitle="Chọn cách thanh toán"
                    icon={<CreditCard size={20} />}
                    isExpanded={true}
                    defaultExpanded={true}
                  >
                    <div className="space-y-3 pt-4">
                      <RadioCard
                        icon={<Banknote size={20} />}
                        title="Chuyển khoản ngân hàng"
                        description="Chuyển khoản trước qua STK được gửi sau khi đặt hàng"
                        selected={formData.paymentMethod === 'bank'}
                        onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'bank' }))}
                      />
                      <RadioCard
                        icon={<Truck size={20} />}
                        title="Thanh toán khi nhận hàng (COD)"
                        description="Trả tiền mặt cho shipper khi nhận hàng"
                        selected={formData.paymentMethod === 'cod'}
                        onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'cod' }))}
                      />
                      <RadioCard
                        icon={<FileText size={20} />}
                        title="Yêu cầu báo giá chính thức"
                        description="Nhận báo giá PDF qua email để duyệt mua"
                        selected={formData.paymentMethod === 'quotation'}
                        onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'quotation' }))}
                        badge="B2B"
                      />
                      {isBusinessCustomer && (
                        <RadioCard
                          icon={<Handshake size={20} />}
                          title="Net terms (Mua chịu)"
                          description="Thanh toán cuối tháng theo hạn mức công ty"
                          helperText="Dành cho khách hàng doanh nghiệp đã được phê duyệt."
                          selected={formData.paymentMethod === 'netterms'}
                          onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'netterms' }))}
                          badge="VIP"
                        />
                      )}
                    </div>
                  </CollapsibleSection>

                  {/* B2B Fields - Collapsible */}
                  {isBusinessCustomer && (
                    <CollapsibleSection
                      title="Thông tin doanh nghiệp nâng cao"
                      subtitle="Tùy chọn - Hỗ trợ quy trình mua hàng nội bộ"
                      icon={<Building2 size={20} />}
                      isExpanded={b2bExpanded}
                      onToggle={() => setB2bExpanded(!b2bExpanded)}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                            Số PO (Purchase Order)
                          </label>
                          <input
                            name="poNumber"
                            value={formData.poNumber}
                            onChange={handleInputChange}
                            placeholder="PO-2024-001"
                            className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:border-brand-secondary focus:ring-2 focus:ring-brand-secondary/10 outline-none transition-all"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                            Mã yêu cầu nội bộ
                          </label>
                          <input
                            name="internalCode"
                            value={formData.internalCode}
                            onChange={handleInputChange}
                            placeholder="YC-ABC-123"
                            className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:border-brand-secondary focus:ring-2 focus:ring-brand-secondary/10 outline-none transition-all"
                          />
                        </div>
                        <div className="space-y-1.5 md:col-span-2">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                            Ghi chú mua hàng
                          </label>
                          <textarea
                            name="purchaseNote"
                            value={formData.purchaseNote}
                            onChange={handleInputChange}
                            placeholder="Yêu cầu đặc biệt cho đơn hàng này..."
                            rows={3}
                            className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:border-brand-secondary focus:ring-2 focus:ring-brand-secondary/10 outline-none transition-all resize-none"
                          />
                        </div>
                        <div className="space-y-1.5 md:col-span-2">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                            Đính kèm Purchase Order
                          </label>
                          <div className="relative">
                            <input
                              type="file"
                              id="file-upload"
                              onChange={handleFileChange}
                              accept=".pdf,.doc,.docx,.xls,.xlsx"
                              className="hidden"
                            />
                            {fileName ? (
                              <div className="flex items-center justify-between p-4 bg-brand-secondary/5 border border-brand-secondary/20 rounded-xl">
                                <div className="flex items-center gap-3">
                                  <FileText size={20} className="text-brand-secondary" />
                                  <span className="text-sm font-medium text-slate-900">{fileName}</span>
                                </div>
                                <button
                                  type="button"
                                  onClick={removeFile}
                                  className="p-1 hover:bg-brand-secondary/10 rounded-lg transition-colors"
                                >
                                  <X size={16} className="text-slate-500" />
                                </button>
                              </div>
                            ) : (
                              <label
                                htmlFor="file-upload"
                                className="flex items-center justify-center gap-3 p-6 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-brand-secondary hover:bg-brand-secondary/5 transition-all"
                              >
                                <Upload size={20} className="text-slate-400" />
                                <div className="text-center">
                                  <span className="text-sm font-medium text-slate-900">Kéo thả file hoặc </span>
                                  <span className="text-sm font-bold text-brand-secondary">chọn file</span>
                                  <p className="text-xs text-slate-400 mt-1">PDF, DOC, XLS (tối đa 10MB)</p>
                                </div>
                              </label>
                            )}
                          </div>
                        </div>
                      </div>
                    </CollapsibleSection>
                  )}
                </motion.div>
              )}

              {/* Step 3: Order Confirmation */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4 sm:space-y-6"
                >
                  {/* Order Summary Review */}
                  <CollapsibleSection
                    title="Xác nhận đơn hàng"
                    subtitle="Kiểm tra thông tin trước khi đặt"
                    icon={<CheckCircle2 size={20} />}
                    isExpanded={true}
                    defaultExpanded={true}
                  >
                    <div className="space-y-4 pt-4">
                      {/* Shipping Info */}
                      <div className="p-4 bg-slate-50 rounded-xl">
                        <div className="flex items-start gap-3">
                          <MapPin size={18} className="text-brand-secondary mt-0.5" />
                          <div>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Địa chỉ giao hàng</p>
                            {!selectedAddress ? (
                              <p className="text-sm text-amber-600 flex items-center gap-2">
                                <AlertCircle size={14} />
                                Vui lòng thêm địa chỉ giao hàng
                              </p>
                            ) : (
                              <>
                                <p className="text-sm font-medium text-slate-900">
                                  {isLoggedIn && user ? user.fullName : selectedAddress.recipientName} - {isLoggedIn && user ? user.phone : selectedAddress.phone}
                                </p>
                                <p className="text-sm text-slate-600">
                                  {formatAddressLine(selectedAddress)}
                                </p>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Shipping Method */}
                      <div className="p-4 bg-slate-50 rounded-xl">
                        <div className="flex items-start gap-3">
                          <Truck size={18} className="text-brand-secondary mt-0.5" />
                          <div>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Phương thức vận chuyển</p>
                            <p className="text-sm font-medium text-slate-900">
                              {formData.shippingMethod === 'standard' && 'Giao tiêu chuẩn (2-5 ngày)'}
                              {formData.shippingMethod === 'fast' && 'Giao nhanh (Trong ngày)'}
                              {formData.shippingMethod === 'pickup' && 'Nhận tại kho MECSU'}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Payment Method */}
                      <div className="p-4 bg-slate-50 rounded-xl">
                        <div className="flex items-start gap-3">
                          <CreditCard size={18} className="text-brand-secondary mt-0.5" />
                          <div>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Phương thức thanh toán</p>
                            <p className="text-sm font-medium text-slate-900">
                              {formData.paymentMethod === 'bank' && 'Chuyển khoản ngân hàng'}
                              {formData.paymentMethod === 'cod' && 'Thanh toán khi nhận hàng (COD)'}
                              {formData.paymentMethod === 'quotation' && 'Yêu cầu báo giá chính thức'}
                              {formData.paymentMethod === 'netterms' && 'Net terms (Mua chịu)'}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* VAT Info */}
                      {formData.needVatInvoice && (
                        <div className="p-4 bg-brand-secondary/5 rounded-xl border border-brand-secondary/20">
                          <div className="flex items-start gap-3">
                            <Receipt size={18} className="text-brand-secondary mt-0.5" />
                            <div>
                              <p className="text-[10px] font-bold text-brand-secondary uppercase tracking-wider mb-1">Xuất hóa đơn VAT</p>
                              <p className="text-sm font-medium text-slate-900">{formData.vatCompanyName}</p>
                              <p className="text-sm text-slate-600">MST: {formData.vatTaxCode}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* B2B Info */}
                      {isBusinessCustomer && (formData.poNumber || formData.internalCode) && (
                        <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                          <div className="flex items-start gap-3">
                            <Building2 size={18} className="text-blue-600 mt-0.5" />
                            <div>
                              <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-1">Thông tin doanh nghiệp</p>
                              {formData.poNumber && (
                                <p className="text-sm font-medium text-slate-900">PO: {formData.poNumber}</p>
                              )}
                              {formData.internalCode && (
                                <p className="text-sm text-slate-600">Mã nội bộ: {formData.internalCode}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </CollapsibleSection>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-4 pb-20 lg:pb-0">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="flex items-center gap-2 px-4 sm:px-6 py-3 text-slate-600 hover:text-slate-900 font-medium transition-colors"
                >
                  <ChevronLeft size={18} />
                  <span>Quay lại</span>
                </button>
              ) : (
                <div />
              )}

              <button
                type="button"
                onClick={handleNextStep}
                disabled={step === 1 && !isStep1Valid}
                className={`flex items-center gap-2 px-6 sm:px-8 py-3.5 rounded-xl font-bold text-sm transition-all ${
                  step === 1 && !isStep1Valid
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-brand-secondary text-white hover:bg-brand-secondary/90 shadow-lg shadow-brand-secondary/25'
                }`}
              >
                <span>{step === 3 ? 'Xác nhận đặt hàng' : 'Tiếp tục'}</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28 space-y-4">
              {/* Mobile Toggle */}
              <button
                onClick={() => setMobileSummaryOpen(!mobileSummaryOpen)}
                className="lg:hidden w-full bg-white rounded-xl border border-slate-200 p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <ShoppingCart size={20} className="text-brand-secondary" />
                  <span className="text-sm font-bold text-slate-900">
                    Tóm tắt đơn hàng ({items.length} sản phẩm)
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-lg font-black text-brand-secondary">
                    {grandTotal.toLocaleString('vi-VN')}đ
                  </span>
                  <ChevronDown
                    size={18}
                    className={`text-slate-400 transition-transform ${mobileSummaryOpen ? 'rotate-180' : ''}`}
                  />
                </div>
              </button>

              {/* Order Summary Card */}
              <AnimatePresence>
                {(!window.matchMedia('(max-width: 1023px)').matches || mobileSummaryOpen) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-white rounded-2xl border border-slate-200 overflow-hidden"
                  >
                    {/* Header */}
                    <div className="p-5 sm:p-6 border-b border-slate-100">
                      <div className="flex items-center justify-between">
                        <h2 className="text-base sm:text-lg font-bold text-slate-900">Tóm tắt đơn hàng</h2>
                        <span className="text-xs text-slate-500">{items.length} sản phẩm</span>
                      </div>
                    </div>

                    {/* Products */}
                    <div className="p-5 sm:p-6 max-h-[280px] overflow-y-auto space-y-4">
                      {items.map((item) => (
                        <div key={item.product.id} className="flex gap-3 sm:gap-4">
                          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-slate-50 rounded-lg flex items-center justify-center p-2 shrink-0">
                            <img
                              src={getRandomImage(item.product.id) || item.product.image || '/assets/placeholder.png'}
                              alt={item.product.name}
                              className="max-w-full max-h-full object-contain"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-slate-900 line-clamp-2">
                              {item.product.name}
                            </h4>
                            <div className="flex items-center justify-between mt-1">
                              <span className="text-xs text-slate-500">SL: {item.quantity}</span>
                              <span className="text-sm font-bold text-slate-900">
                                {(item.product.price * item.quantity).toLocaleString('vi-VN')}đ
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Pricing */}
                    <div className="p-5 sm:p-6 border-t border-slate-100 space-y-2.5 sm:space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Tạm tính</span>
                        <span className="font-medium text-slate-900">{subtotal.toLocaleString('vi-VN')}đ</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">VAT (10%)</span>
                        <span className="font-medium text-slate-900">{vatAmount.toLocaleString('vi-VN')}đ</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Phí vận chuyển</span>
                        <span className="font-medium text-slate-900">
                          {shippingFee === 0 ? 'Miễn phí' : shippingFee.toLocaleString('vi-VN') + 'đ'}
                        </span>
                      </div>
                      {b2bDiscount > 0 && (
                        <div className="flex justify-between text-sm text-green-600">
                          <span>Chiết khấu B2B (5%)</span>
                          <span className="font-bold">-{b2bDiscount.toLocaleString('vi-VN')}đ</span>
                        </div>
                      )}
                      <div className="h-px bg-slate-100 my-2" />
                      <div className="flex justify-between items-baseline">
                        <span className="text-sm sm:text-base font-bold text-slate-900">Tổng thanh toán</span>
                        <span className="text-xl sm:text-2xl font-black text-brand-secondary">
                          {grandTotal.toLocaleString('vi-VN')}đ
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 text-right">Đã bao gồm VAT</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Trust Notes */}
              <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-100">
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="flex items-start gap-2">
                    <Receipt size={14} className="text-brand-secondary mt-0.5 shrink-0" />
                    <p className="text-[11px] sm:text-xs text-slate-600 font-medium">Hỗ trợ xuất hóa đơn VAT</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <HeadphonesIcon size={14} className="text-brand-secondary mt-0.5 shrink-0" />
                    <p className="text-[11px] sm:text-xs text-slate-600 font-medium">Hỗ trợ kỹ thuật 24/7</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <ShieldCheck size={14} className="text-brand-secondary mt-0.5 shrink-0" />
                    <p className="text-[11px] sm:text-xs text-slate-600 font-medium">Giá minh bạch, không phí ẩn</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 size={14} className="text-brand-secondary mt-0.5 shrink-0" />
                    <p className="text-[11px] sm:text-xs text-slate-600 font-medium">Đơn hàng xác nhận bởi MECSU</p>
                  </div>
                </div>
              </div>

              {/* Security Badge */}
              <div className="flex items-center justify-center gap-2 py-2 text-slate-400">
                <ShieldCheck size={16} />
                <span className="text-[11px] font-medium">Thanh toán bảo mật 256-bit SSL</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky CTA */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 z-50">
        <button
          type="button"
          onClick={handleNextStep}
          disabled={step === 1 && !isStep1Valid}
          className={`w-full py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
            step === 1 && !isStep1Valid
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
              : 'bg-brand-secondary text-white hover:bg-brand-secondary/90'
          }`}
        >
          <Lock size={16} />
          <span>{step === 3 ? 'Xác nhận đặt hàng' : 'Tiếp tục thanh toán'}</span>
          <span className="font-black ml-2">{grandTotal.toLocaleString('vi-VN')}đ</span>
        </button>
      </div>

      {/* Address Picker Modal */}
      <AddressPicker
        isOpen={showAddressPicker}
        onClose={() => setShowAddressPicker(false)}
        addresses={user?.addresses || []}
        selectedId={selectedAddress?.id}
        onSelect={handleSelectAddress}
        onEdit={handleEditAddress}
        onAddNew={handleAddNewAddress}
      />

      {/* Address Modal */}
      <AddressModal
        isOpen={showAddressModal}
        onClose={() => {
          setShowAddressModal(false);
          setEditingAddress(null);
        }}
        address={editingAddress || undefined}
        onSave={handleSaveAddress}
        showSaveOption={isLoggedIn}
        isGuestMode={!isLoggedIn}
        currentUserName={user?.fullName}
        currentUserPhone={user?.phone}
      />
    </div>
  );
}
