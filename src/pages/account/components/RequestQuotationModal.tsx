import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  FileText,
  Package,
  Info,
  User,
  Plus,
  Trash2,
  Upload,
  Send,
  Loader2,
  Clock,
  Phone,
  Mail,
  CheckCircle,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { ProductUnit, Priority, Quotation } from '../../../types/quotation';
import { createQuotationFromRequest } from '../quotationData';
import { cn } from '../../../lib/utils';

interface RequestQuotationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (quotation: Quotation) => void;
}

interface ProductItem {
  id: string;
  productName: string;
  productCode: string;
  quantity: number;
  unit: ProductUnit;
  notes?: string;
}

const createEmptyItem = (): ProductItem => ({
  id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  productName: '',
  productCode: '',
  quantity: 1,
  unit: 'cái',
  notes: '',
});

const unitOptions: { value: ProductUnit; label: string }[] = [
  { value: 'cái', label: 'cái' },
  { value: 'bộ', label: 'bộ' },
  { value: 'hộp', label: 'hộp' },
  { value: 'mét', label: 'mét' },
  { value: 'kg', label: 'kg' },
];

const priorityOptions: { value: Priority; label: string }[] = [
  { value: 'normal', label: 'Bình thường' },
  { value: 'urgent', label: 'Cần sớm' },
  { value: 'critical', label: 'Gấp' },
];

const mockProducts = [
  { name: 'SKF 6205 ZZ', sku: 'SKF6205ZZ', category: 'Vòng bi', unit: 'cái' as ProductUnit },
  { name: 'ABB Motor 3-Phase 1.5kW', sku: 'ABB3Motor15KW', category: 'Motor', unit: 'cái' as ProductUnit },
  { name: 'Mitsubishi PLC FX3U-32MT', sku: 'MTSFX3U32MT', category: 'PLC', unit: 'cái' as ProductUnit },
  { name: 'Siemens Contactor 3TF52', sku: 'SIE3TF52', category: 'Contactor', unit: 'cái' as ProductUnit },
  { name: 'Omron Sensor E3Z', sku: 'OMRE3Z', category: 'Cảm biến', unit: 'cái' as ProductUnit },
  { name: ' Schneider Circuit Breaker', sku: 'SCHLV', category: 'CB', unit: 'cái' as ProductUnit },
];

export const RequestQuotationModal: React.FC<RequestQuotationModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Form state
  const [requestName, setRequestName] = useState('');
  const [desiredDeadline, setDesiredDeadline] = useState('');
  const [priority, setPriority] = useState<Priority>('normal');
  const [items, setItems] = useState<ProductItem[]>([createEmptyItem()]);
  const [generalNotes, setGeneralNotes] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [submittedQuotation, setSubmittedQuotation] = useState<Quotation | null>(null);

  // Autocomplete state
  const [showSuggestions, setShowSuggestions] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<typeof mockProducts>([]);

  const markDirty = () => {
    if (!isDirty) setIsDirty(true);
  };

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setRequestName('');
      setDesiredDeadline('');
      setPriority('normal');
      setItems([createEmptyItem()]);
      setGeneralNotes('');
      setFiles([]);
      setErrors({});
      setIsSubmitting(false);
      setIsDirty(false);
      setSubmittedQuotation(null);
      setShowSuggestions(null);
    }
  }, [isOpen]);

  // ESC key handler
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleClose = () => {
    if (isDirty && !submittedQuotation) {
      const confirmed = window.confirm('Bạn có chắc muốn đóng? Dữ liệu chưa được lưu sẽ bị mất.');
      if (!confirmed) return;
    }
    onClose();
  };

  const handleAddItem = () => {
    markDirty();
    setItems([...items, createEmptyItem()]);
  };

  const handleRemoveItem = (id: string) => {
    markDirty();
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id));
    }
  };

  const handleUpdateItem = (id: string, field: keyof ProductItem, value: string | number) => {
    markDirty();
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const handleProductNameChange = (id: string, value: string) => {
    markDirty();
    handleUpdateItem(id, 'productName', value);

    if (value.length >= 2) {
      const filtered = mockProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(value.toLowerCase()) ||
          p.sku.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(id);
    } else {
      setShowSuggestions(null);
    }
  };

  const handleSelectProduct = (itemId: string, product: typeof mockProducts[0]) => {
    markDirty();
    handleUpdateItem(itemId, 'productName', product.name);
    handleUpdateItem(itemId, 'productCode', product.sku);
    handleUpdateItem(itemId, 'unit', product.unit);
    setShowSuggestions(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    validateAndAddFiles(newFiles);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    validateAndAddFiles(droppedFiles);
  };

  const validateAndAddFiles = (newFiles: File[]) => {
    markDirty();
    const maxSize = 10 * 1024 * 1024;
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'image/png',
      'image/jpeg',
    ];

    const validFiles: File[] = [];
    const invalidFiles: string[] = [];

    newFiles.forEach((file) => {
      if (file.size > maxSize) {
        invalidFiles.push(`${file.name} (quá 10MB)`);
      } else if (!allowedTypes.includes(file.type)) {
        invalidFiles.push(`${file.name} (định dạng không hỗ trợ)`);
      } else {
        validFiles.push(file);
      }
    });

    if (invalidFiles.length > 0) {
      setErrors({ files: `Không thể tải: ${invalidFiles.join(', ')}` });
    } else {
      setErrors((prev) => ({ ...prev, files: '' }));
      setFiles((prev) => [...prev, ...validFiles]);
    }
  };

  const handleRemoveFile = (index: number) => {
    markDirty();
    setFiles(files.filter((_, i) => i !== index));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!requestName.trim()) {
      newErrors.requestName = 'Vui lòng nhập tên yêu cầu';
    }

    items.forEach((item, index) => {
      if (!item.productName.trim()) {
        newErrors[`item_${index}_name`] = 'Vui lòng nhập tên sản phẩm';
      }
      if (!item.quantity || item.quantity < 1) {
        newErrors[`item_${index}_qty`] = 'Số lượng phải lớn hơn 0';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const newQuotation = createQuotationFromRequest({
        requestName,
        desiredDeadline,
        priority,
        items: items.map((item) => ({
          productName: item.productName,
          productCode: item.productCode,
          quantity: item.quantity,
          unit: item.unit,
          notes: item.notes,
        })),
        generalNotes,
      });

      setSubmittedQuotation(newQuotation);
      onSuccess?.(newQuotation);
    } catch (error) {
      setErrors({ submit: 'Không thể gửi yêu cầu. Vui lòng thử lại.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateNew = () => {
    setSubmittedQuotation(null);
    setRequestName('');
    setItems([createEmptyItem()]);
    setFiles([]);
    setGeneralNotes('');
    setDesiredDeadline('');
    setPriority('normal');
    setIsDirty(false);
  };

  // Computed summary
  const summary = {
    lineCount: items.length,
    totalQuantity: items.reduce((sum, item) => sum + item.quantity, 0),
    fileCount: files.length,
    priority: priorityOptions.find((p) => p.value === priority)?.label || 'Bình thường',
  };

  if (!isOpen) return null;

  // Success State
  if (submittedQuotation) {
    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[400] flex items-center justify-center p-4"
          >
            {/* Backdrop with blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-slate-900/20 backdrop-blur-md"
            />

            <motion.div
              initial={{ scale: 0.96, opacity: 0, y: 8 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0, y: 8 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="relative w-[calc(100vw-32px)] max-w-[520px] bg-white rounded-[22px] shadow-[0_28px_80px_rgba(15,23,42,0.22)] border border-[#E5EAF2] overflow-hidden"
              style={{
                maxHeight: 'calc(100vh - 48px)',
              }}
            >
              <div className="overflow-y-auto max-h-[calc(100vh-48px)] p-8">
                <div className="flex flex-col items-center text-center py-8">
                  {/* Success Icon */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
                    className="w-20 h-20 rounded-full bg-[#ECFDF5] flex items-center justify-center mb-6"
                  >
                    <CheckCircle size={40} color="#16A34A" />
                  </motion.div>

                  <h2
                    style={{
                      fontSize: '22px',
                      fontWeight: 800,
                      color: '#173E75',
                      marginBottom: '8px',
                    }}
                  >
                    Yêu cầu báo giá đã được gửi thành công
                  </h2>

                  <p
                    style={{
                      fontSize: '14px',
                      color: '#64748B',
                      maxWidth: '360px',
                      marginBottom: '24px',
                    }}
                  >
                    Đội ngũ MECSU đã nhận được yêu cầu của bạn và sẽ phản hồi trong thời gian sớm nhất.
                  </p>

                  {/* Request Code */}
                  <div
                    className="bg-[#F8FAFD] rounded-[12px] px-6 py-4 mb-6"
                    style={{ border: '1px solid #E5EAF2' }}
                  >
                    <p style={{ fontSize: '12px', color: '#64748B', marginBottom: '4px' }}>
                      Mã yêu cầu
                    </p>
                    <p
                      style={{
                        fontSize: '20px',
                        fontWeight: 700,
                        color: '#173E75',
                      }}
                    >
                      {submittedQuotation.code}
                    </p>
                  </div>

                  {/* Assigned Team */}
                  <div
                    className="flex items-center gap-2 mb-8"
                    style={{ fontSize: '13px', color: '#64748B' }}
                  >
                    <span>Phụ trách:</span>
                    <span style={{ fontWeight: 500, color: '#173E75' }}>
                      {submittedQuotation.salesRep.name}
                    </span>
                  </div>

                  {/* Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 w-full max-w-[320px]">
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        navigate(`/tai-khoan/bao-gia/chi-tiet/${submittedQuotation.id}`);
                      }}
                      className="flex-1 h-[44px] bg-[#F4C84A] border border-[#E8B93A] rounded-[14px] text-[#173E75] font-extrabold hover:bg-[#E8B93A] transition-colors"
                    >
                      Xem chi tiết yêu cầu
                    </button>
                    <button
                      type="button"
                      onClick={handleCreateNew}
                      className="flex-1 h-[44px] bg-white border border-[#DDE5F0] rounded-[14px] text-[#334155] font-medium hover:bg-[#F6F8FC] transition-colors"
                    >
                      Tạo yêu cầu mới
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  // Form State
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[400] flex items-center justify-center p-4"
        >
          {/* Backdrop with blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-slate-900/20 backdrop-blur-md"
            onClick={onClose}
          />

          <motion.div
            initial={{ scale: 0.96, opacity: 0, y: 8 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: 8 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="relative w-[calc(100vw-32px)] max-w-[720px] bg-white rounded-[22px] shadow-[0_28px_80px_rgba(15,23,42,0.22)] border border-[#E5EAF2] overflow-hidden"
            style={{
              maxHeight: 'calc(100vh - 48px)',
            }}
          >
              <div className="overflow-y-auto max-h-[calc(100vh-48px)]">
              {/* Header */}
              <div style={{ padding: '24px 28px 18px' }}>
                <div className="flex items-start justify-between">
                  <div>
                    <h2
                      style={{
                        fontSize: '22px',
                        fontWeight: 800,
                        color: '#173E75',
                      }}
                    >
                      Yêu cầu báo giá mới
                    </h2>
                    <p
                      style={{
                        fontSize: '14px',
                        color: '#64748B',
                        marginTop: '6px',
                      }}
                    >
                      Gửi danh sách sản phẩm cần báo giá, đội ngũ MECSU sẽ phản hồi
                      trong thời gian sớm nhất.
                    </p>
                  </div>

                  <button
                    type="button"
                    className="w-[40px] h-[40px] rounded-[12px] bg-[#F6F8FC] hover:bg-[#EEF3FA] flex items-center justify-center transition-colors flex-shrink-0"
                    onClick={handleClose}
                  >
                    <X size={18} color="#64748B" />
                  </button>
                </div>
              </div>

              {/* Response Time Card */}
              <div style={{ margin: '0 28px 20px' }}>
                <div
                  className="flex items-start gap-3 p-4 rounded-[14px]"
                  style={{ background: '#F8FAFD', border: '1px solid #D9E5F6' }}
                >
                  <Clock size={20} color="#4F7FC3" className="flex-shrink-0 mt-0.5" />
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: 600, color: '#173E75' }}>
                      Thời gian phản hồi dự kiến
                    </p>
                    <p style={{ fontSize: '13px', color: '#64748B', marginTop: '4px' }}>
                      Đội ngũ MECSU sẽ phản hồi yêu cầu báo giá trong vòng 4–24 giờ làm việc.
                    </p>
                  </div>
                </div>
              </div>

              {/* Error Alert */}
              {errors.submit && (
                <div style={{ padding: '0 28px 16px' }}>
                  <div
                    className="p-4 bg-red-50 rounded-xl"
                    style={{ border: '1px solid #FECACA' }}
                  >
                    <p
                      style={{ fontSize: '14px', color: '#DC2626' }}
                      className="flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                      {errors.submit}
                    </p>
                  </div>
                </div>
              )}

              {/* Body */}
              <div style={{ padding: '0 28px 24px' }}>
                {/* Section 1: Thông tin yêu cầu */}
                    <div style={{ marginBottom: '24px' }}>
                      <div className="flex items-center gap-2 mb-4">
                        <FileText size={16} color="#4F7FC3" />
                        <h3
                          style={{
                            fontSize: '15px',
                            fontWeight: 700,
                            color: '#173E75',
                          }}
                        >
                          Thông tin yêu cầu
                        </h3>
                      </div>

                      <div className="grid grid-cols-[2fr_1fr_1fr] gap-3">
                        <div>
                          <input
                            type="text"
                            placeholder="VD: Báo giá linh kiện điện tử tháng 6"
                            value={requestName}
                            onChange={(e) => {
                              markDirty();
                              setRequestName(e.target.value);
                            }}
                            className={cn(
                              'w-full h-[44px] px-[14px] border rounded-[12px] bg-white text-sm outline-none transition-all placeholder:text-[#94A3B8]',
                              errors.requestName
                                ? 'border-[#EF4444] focus:border-[#EF4444] focus:ring-4 focus:ring-red-100 text-[#173E75]'
                                : 'border-[#DDE5F0] focus:border-[#4F7FC3] focus:ring-4 focus:ring-[rgba(79,127,195,0.12)] text-[#173E75]'
                            )}
                          />
                          {errors.requestName && (
                            <span
                              style={{
                                display: 'block',
                                marginTop: '4px',
                                fontSize: '13px',
                                color: '#DC2626',
                              }}
                            >
                              {errors.requestName}
                            </span>
                          )}
                        </div>

                        <div>
                          <input
                            type="date"
                            value={desiredDeadline}
                            onChange={(e) => {
                              markDirty();
                              setDesiredDeadline(e.target.value);
                            }}
                            className="w-full h-[44px] px-[14px] border border-[#DDE5F0] rounded-[12px] bg-white text-[#173E75] text-sm outline-none transition-all focus:border-[#4F7FC3] focus:ring-4 focus:ring-[rgba(79,127,195,0.12)]"
                          />
                        </div>

                        <div>
                          <select
                            value={priority}
                            onChange={(e) => {
                              markDirty();
                              setPriority(e.target.value as Priority);
                            }}
                            className="w-full h-[44px] px-[14px] border border-[#DDE5F0] rounded-[12px] bg-white text-[#173E75] text-sm outline-none transition-all focus:border-[#4F7FC3] focus:ring-4 focus:ring-[rgba(79,127,195,0.12)]"
                          >
                            {priorityOptions.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Section 2: Danh sách sản phẩm */}
                    <div style={{ marginBottom: '24px' }}>
                      <div className="flex items-center gap-2 mb-2">
                        <Package size={16} color="#4F7FC3" />
                        <h3
                          style={{
                            fontSize: '15px',
                            fontWeight: 700,
                            color: '#173E75',
                          }}
                        >
                          Sản phẩm cần báo giá
                        </h3>
                      </div>

                      <p
                        style={{
                          fontSize: '13px',
                          color: '#64748B',
                          marginBottom: '16px',
                        }}
                      >
                        Thêm từng sản phẩm, số lượng và thông tin kỹ thuật nếu có.
                      </p>

                      {/* Product List */}
                      <div className="space-y-4">
                        {items.map((item, index) => (
                          <div
                            key={item.id}
                            className="bg-[#F8FAFD] border border-[#E5EAF2] rounded-[16px] p-4 transition-shadow hover:shadow-md"
                          >
                            {/* Card Header */}
                            <div className="flex items-center justify-between mb-4">
                              <span
                                style={{
                                  fontSize: '14px',
                                  fontWeight: 600,
                                  color: '#173E75',
                                }}
                              >
                                Sản phẩm #{index + 1}
                              </span>
                              {items.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => handleRemoveItem(item.id)}
                                  className="w-[32px] h-[32px] rounded-[8px] border border-[#E5EAF2] bg-white flex items-center justify-center hover:bg-red-50 transition-colors"
                                >
                                  <Trash2 size={14} color="#EF4444" />
                                </button>
                              )}
                            </div>

                            {/* Product Name with Autocomplete */}
                            <div className="relative mb-3">
                              <input
                                type="text"
                                placeholder="Nhập tên hoặc mã sản phẩm"
                                value={item.productName}
                                onChange={(e) =>
                                  handleProductNameChange(item.id, e.target.value)
                                }
                                className={cn(
                                  'w-full h-[44px] px-[14px] border rounded-[12px] bg-white text-sm outline-none transition-all placeholder:text-[#94A3B8]',
                                  errors[`item_${index}_name`]
                                    ? 'border-[#EF4444] focus:border-[#EF4444] focus:ring-4 focus:ring-red-100 text-[#173E75]'
                                    : 'border-[#DDE5F0] focus:border-[#4F7FC3] focus:ring-4 focus:ring-[rgba(79,127,195,0.12)] text-[#173E75]'
                                )}
                              />
                              {showSuggestions === item.id && suggestions.length > 0 && (
                                <div
                                  className="absolute z-20 mt-1 w-full bg-white border border-[#E5EAF2] rounded-[12px] shadow-lg max-h-[200px] overflow-y-auto"
                                  style={{ top: '100%' }}
                                >
                                  {suggestions.map((product, idx) => (
                                    <div
                                      key={idx}
                                      className="flex items-center gap-3 px-4 py-3 hover:bg-[#F8FAFD] cursor-pointer border-b border-[#F1F5F9] last:border-0 transition-colors"
                                      onClick={() =>
                                        handleSelectProduct(item.id, product)
                                      }
                                    >
                                      <div className="w-10 h-10 bg-[#F8FAFD] rounded-[8px] flex items-center justify-center flex-shrink-0">
                                        <Package size={16} color="#4F7FC3" />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <p
                                          style={{
                                            fontSize: '13px',
                                            fontWeight: 500,
                                            color: '#173E75',
                                          }}
                                        >
                                          {product.name}
                                        </p>
                                        <p
                                          style={{
                                            fontSize: '11px',
                                            color: '#64748B',
                                          }}
                                        >
                                          SKU: {product.sku} • {product.category}
                                        </p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                              {errors[`item_${index}_name`] && (
                                <span
                                  style={{
                                    display: 'block',
                                    marginTop: '4px',
                                    fontSize: '13px',
                                    color: '#DC2626',
                                  }}
                                >
                                  {errors[`item_${index}_name`]}
                                </span>
                              )}
                            </div>

                            {/* Quantity + Unit - Fixed widths, aligned left */}
                            <div className="flex items-center gap-3">
                              <div className="w-[140px]">
                                <input
                                  type="number"
                                  min="1"
                                  value={item.quantity}
                                  onChange={(e) =>
                                    handleUpdateItem(
                                      item.id,
                                      'quantity',
                                      parseInt(e.target.value) || 1
                                    )
                                  }
                                  className={cn(
                                    'w-full h-[44px] px-[14px] border rounded-[12px] bg-white text-sm outline-none transition-all',
                                    errors[`item_${index}_qty`]
                                      ? 'border-[#EF4444] focus:border-[#EF4444] focus:ring-4 focus:ring-red-100 text-[#173E75]'
                                      : 'border-[#DDE5F0] focus:border-[#4F7FC3] focus:ring-4 focus:ring-[rgba(79,127,195,0.12)] text-[#173E75]'
                                  )}
                                />
                                {errors[`item_${index}_qty`] && (
                                  <span
                                    style={{
                                      display: 'block',
                                      marginTop: '4px',
                                      fontSize: '13px',
                                      color: '#DC2626',
                                    }}
                                  >
                                    {errors[`item_${index}_qty`]}
                                  </span>
                                )}
                              </div>

                              <div className="w-[140px]">
                                <select
                                  value={item.unit}
                                  onChange={(e) =>
                                    handleUpdateItem(item.id, 'unit', e.target.value)
                                  }
                                  className="w-full h-[44px] px-[14px] border border-[#DDE5F0] rounded-[12px] bg-white text-[#173E75] text-sm outline-none transition-all focus:border-[#4F7FC3] focus:ring-4 focus:ring-[rgba(79,127,195,0.12)]"
                                >
                                  {unitOptions.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                      {opt.label}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>

                            {/* Technical requirements */}
                            <div className="mt-3">
                              <input
                                type="text"
                                placeholder="Thương hiệu, model, xuất xứ, thông số kỹ thuật..."
                                value={item.notes}
                                onChange={(e) =>
                                  handleUpdateItem(item.id, 'notes', e.target.value)
                                }
                                className="w-full h-[44px] px-[14px] border border-[#DDE5F0] rounded-[12px] bg-white text-[#173E75] text-sm outline-none transition-all focus:border-[#4F7FC3] focus:ring-4 focus:ring-[rgba(79,127,195,0.12)] placeholder:text-[#94A3B8]"
                              />
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Add Product Button */}
                      <button
                        type="button"
                        onClick={handleAddItem}
                        className="mt-4 w-full h-[42px] bg-white border border-[#D9E5F6] rounded-[12px] text-[#173E75] font-semibold flex items-center justify-center gap-2 hover:bg-[#F6F8FC] transition-colors"
                      >
                        <Plus size={16} />
                        Thêm sản phẩm
                      </button>
                    </div>

                    {/* Section 3: Thông tin bổ sung */}
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <Info size={16} color="#4F7FC3" />
                        <h3
                          style={{
                            fontSize: '15px',
                            fontWeight: 700,
                            color: '#173E75',
                          }}
                        >
                          Thông tin bổ sung
                        </h3>
                      </div>

                      {/* Ghi chú chung */}
                      <div className="mb-4">
                        <textarea
                          placeholder="Nhập yêu cầu đặc biệt, thời gian giao hàng, điều kiện thanh toán..."
                          rows={4}
                          value={generalNotes}
                          onChange={(e) => {
                            markDirty();
                            setGeneralNotes(e.target.value);
                          }}
                          className="w-full px-[14px] py-3 border border-[#DDE5F0] rounded-[12px] bg-white text-[#173E75] text-sm outline-none transition-all focus:border-[#4F7FC3] focus:ring-4 focus:ring-[rgba(79,127,195,0.12)] resize-none placeholder:text-[#94A3B8]"
                          style={{
                            height: '110px',
                          }}
                        />
                      </div>

                      {/* File đính kèm */}
                      <div className="mb-4">
                        <div
                          className={cn(
                            'bg-[#F8FAFD] border rounded-[16px] p-6 text-center cursor-pointer transition-colors',
                            isDragging
                              ? 'border-[#4F7FC3] bg-blue-50'
                              : 'border-dashed border-[#BFD3F2] hover:border-[#4F7FC3] hover:bg-[#FAFBFD]'
                          )}
                          onDragOver={handleDragOver}
                          onDragLeave={handleDragLeave}
                          onDrop={handleDrop}
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <input
                            type="file"
                            ref={fileInputRef}
                            multiple
                            accept=".pdf,.xlsx,.xls,.doc,.docx,.png,.jpg,.jpeg"
                            onChange={handleFileChange}
                            className="hidden"
                          />
                          <Upload
                            size={24}
                            color="#4F7FC3"
                            className="mx-auto mb-2"
                          />
                          <p
                            style={{
                              fontSize: '14px',
                              color: '#64748B',
                            }}
                          >
                            Kéo thả file hoặc bấm để tải lên
                          </p>
                          <p
                            style={{
                              fontSize: '12px',
                              color: '#94A3B8',
                              marginTop: '4px',
                            }}
                          >
                            PDF, Excel, Word, PNG, JPG (tối đa 10MB)
                          </p>
                        </div>

                        {/* Uploaded files */}
                        {files.length > 0 && (
                          <div className="mt-4">
                            <p
                              style={{
                                fontSize: '12px',
                                color: '#64748B',
                                marginBottom: '8px',
                              }}
                            >
                              {files.length} tệp đã tải lên
                            </p>
                            <div className="space-y-2">
                              {files.map((file, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-center justify-between bg-white border border-[#E5EAF2] rounded-[10px] px-4 py-3 transition-shadow hover:shadow-sm"
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-[#F8FAFD] rounded-[8px] flex items-center justify-center flex-shrink-0">
                                      <FileText size={18} color="#4F7FC3" />
                                    </div>
                                    <div>
                                      <p
                                        style={{
                                          fontSize: '13px',
                                          fontWeight: 500,
                                          color: '#173E75',
                                        }}
                                        className="truncate max-w-[180px]"
                                      >
                                        {file.name}
                                      </p>
                                      <p
                                        style={{
                                          fontSize: '11px',
                                          color: '#94A3B8',
                                        }}
                                      >
                                        {(file.size / 1024 / 1024).toFixed(2)} MB
                                      </p>
                                    </div>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveFile(idx)}
                                    className="w-[28px] h-[28px] rounded-[6px] hover:bg-red-50 flex items-center justify-center transition-colors"
                                  >
                                    <X size={14} color="#EF4444" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {errors.files && (
                          <p
                            style={{
                              display: 'block',
                              marginTop: '4px',
                              fontSize: '13px',
                              color: '#DC2626',
                            }}
                          >
                            {errors.files}
                          </p>
                        )}
                      </div>

                      {/* Thông tin liên hệ - Compact layout */}
                      <div
                        className="bg-[#F8FAFD] border border-[#E5EAF2] rounded-[16px] p-5"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <User size={16} color="#4F7FC3" />
                            <span
                              style={{
                                fontSize: '14px',
                                fontWeight: 600,
                                color: '#173E75',
                              }}
                            >
                              Thông tin liên hệ
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              handleClose();
                              navigate('/tai-khoan/thong-tin-ca-nhan');
                            }}
                            className="text-[13px] text-[#4F7FC3] hover:underline"
                          >
                            Chỉnh sửa
                          </button>
                        </div>

                        <div className="flex items-center gap-3">
                          {/* Avatar */}
                          <div className="w-12 h-12 rounded-full bg-[#4F7FC3] flex items-center justify-center text-white text-lg font-bold flex-shrink-0">
                            {user?.fullName?.charAt(0) || 'K'}
                          </div>

                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span
                                style={{
                                  fontSize: '14px',
                                  fontWeight: 600,
                                  color: '#173E75',
                                }}
                              >
                                {user?.fullName || 'Koti'}
                              </span>
                              <span
                                className="px-2 py-0.5 bg-[#F4C84A] text-[#173E75] text-[10px] font-semibold rounded-full"
                              >
                                VIP
                              </span>
                            </div>

                            <div
                              className="flex items-center gap-3"
                              style={{ fontSize: '12px', color: '#64748B' }}
                            >
                              <span className="flex items-center gap-1">
                                <Phone size={12} />
                                {user?.phone || '0778297750'}
                              </span>
                              <span className="flex items-center gap-1">
                                <Mail size={12} />
                                {user?.email || 'koti@gmail.com'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
              </div>

              {/* Summary Bar */}
              <div
                style={{
                  background: '#F8FAFD',
                  borderTop: '1px solid #E5EAF2',
                  padding: '10px 28px',
                }}
              >
                <p
                  style={{
                    fontSize: '13px',
                    color: '#64748B',
                    textAlign: 'center',
                  }}
                >
                  {summary.lineCount} sản phẩm • {summary.totalQuantity} số lượng • {summary.fileCount} tệp đính kèm • Ưu tiên: {summary.priority}
                </p>
              </div>

              {/* Footer (Sticky) */}
              <div
                className="sticky bottom-0 bg-white border-t border-[#E5EAF2]"
                style={{ padding: '14px 28px' }}
              >
                <div className="flex items-center justify-between gap-4">
                  {/* Helper text */}
                  <p
                    className="max-w-[360px]"
                    style={{
                      fontSize: '12px',
                      color: '#64748B',
                    }}
                  >
                    MECSU sẽ phản hồi báo giá qua email hoặc số điện thoại đã đăng ký.
                  </p>

                  {/* Right: Buttons */}
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <button
                      type="button"
                      onClick={handleClose}
                      disabled={isSubmitting}
                      className="h-[44px] px-[20px] bg-white border border-[#DDE5F0] rounded-[12px] text-[#334155] font-medium hover:bg-[#F6F8FC] transition-colors disabled:opacity-50"
                    >
                      Hủy
                    </button>

                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="h-[44px] px-[20px] bg-[#F4C84A] border border-[#E8B93A] rounded-[12px] text-[#173E75] font-bold flex items-center gap-2 hover:bg-[#E8B93A] transition-colors disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          Đang gửi...
                        </>
                      ) : (
                        <>
                          <Send size={16} />
                          Gửi yêu cầu
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RequestQuotationModal;
