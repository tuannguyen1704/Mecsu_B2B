import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ChevronRight, 
  Home, 
  Package, 
  CheckCircle2,
  Upload,
  X,
  Phone,
  MessageCircle,
  AlertCircle,
  ChevronLeft,
  Info,
  FileImage,
  Search
} from 'lucide-react';
import { AccountLayout } from './components/AccountLayout';
import { cn } from '../../lib/utils';

interface Order {
  id: string;
  orderCode: string;
  date: string;
  status: string;
  statusLabel: string;
}

interface Product {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  price: number;
  image: string;
}

interface OrderOption extends Order {
  products: Product[];
}

const MOCK_ORDERS: OrderOption[] = [
  {
    id: "MEC2505100005",
    orderCode: "MEC2505100005",
    date: "10/05/2025",
    status: "completed",
    statusLabel: "Hoàn tất",
    products: [
      {
        id: "1",
        name: "Phe Gài Trục Thép 65Mn DIN471 D3x0.4 (50Cái/Bịch)",
        sku: "B01M1001035TH00",
        quantity: 10,
        price: 259200,
        image: ""
      },
      {
        id: "2",
        name: "Bulong Inox 304 DIN933 M3x20",
        sku: "B01M1001035TH01",
        quantity: 50,
        price: 34920,
        image: ""
      }
    ]
  },
  {
    id: "MEC2505080003",
    orderCode: "MEC2505080003",
    date: "08/05/2025",
    status: "completed",
    statusLabel: "Hoàn tất",
    products: [
      {
        id: "3",
        name: "Đai ốc Inox 304 DIN934 M6",
        sku: "B01M1001035TH02",
        quantity: 100,
        price: 8500,
        image: ""
      }
    ]
  }
];

const RETURN_REASONS = [
  "Sản phẩm không đúng mô tả",
  "Sản phẩm bị hỏng trong quá trình vận chuyển",
  "Giao sai sản phẩm",
  "Thiếu số lượng",
  "Muốn đổi sang sản phẩm khác",
  "Lý do khác"
];

const RETURN_TYPES = [
  { value: "exchange", label: "Đổi hàng" },
  { value: "return", label: "Trả hàng" },
  { value: "refund", label: "Hoàn tiền" }
];

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('vi-VN').format(price);
};

interface FormData {
  orderId: string;
  selectedProducts: { productId: string; quantity: number }[];
  returnType: string;
  reason: string;
  description: string;
  images: File[];
  contactName: string;
  contactPhone: string;
  contactEmail: string;
}

const CreateReturnPage: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [step, setStep] = useState(1);
  const [showOrderDropdown, setShowOrderDropdown] = useState(false);
  const [orderSearch, setOrderSearch] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    orderId: '',
    selectedProducts: [],
    returnType: '',
    reason: '',
    description: '',
    images: [],
    contactName: 'Nguyễn Văn Tuấn',
    contactPhone: '0900000000',
    contactEmail: 'tuan.nguyen@email.com'
  });

  const filteredOrders = MOCK_ORDERS.filter(order => 
    order.orderCode.toLowerCase().includes(orderSearch.toLowerCase())
  );

  const selectedOrder = MOCK_ORDERS.find(o => o.id === formData.orderId);

  const handleSelectOrder = (order: OrderOption) => {
    setFormData(prev => ({
      ...prev,
      orderId: order.id,
      selectedProducts: order.products.map(p => ({ productId: p.id, quantity: 1 }))
    }));
    setShowOrderDropdown(false);
    setOrderSearch('');
  };

  const handleProductQuantityChange = (productId: string, quantity: number) => {
    const product = selectedOrder?.products.find(p => p.id === productId);
    if (!product) return;
    
    const validQuantity = Math.min(Math.max(1, quantity), product.quantity);
    
    setFormData(prev => ({
      ...prev,
      selectedProducts: prev.selectedProducts.map(p => 
        p.productId === productId ? { ...p, quantity: validQuantity } : p
      )
    }));
  };

  const handleRemoveProduct = (productId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedProducts: prev.selectedProducts.filter(p => p.productId !== productId)
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...files]
    }));
  };

  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const isStepValid = () => {
    switch (step) {
      case 1: return !!formData.orderId;
      case 2: return formData.selectedProducts.length > 0 && formData.selectedProducts.every(p => p.quantity > 0);
      case 3: return !!formData.returnType;
      case 4: return !!formData.reason;
      case 5: return formData.description.trim().length >= 10;
      case 6: return true; // Images optional
      case 7: return formData.contactName && formData.contactPhone;
      default: return false;
    }
  };

  const handleNext = () => {
    if (isStepValid() && step < 7) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    if (!isStepValid()) return;
    
    setIsSubmitting(true);
    
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Navigate to success page
    navigate('/tai-khoan/don-hang/doi-tra/TRA2505180001');
  };

  const handleCancel = () => {
    navigate('/tai-khoan/don-hang');
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center gap-2 mb-8">
      {[1, 2, 3, 4, 5, 6, 7].map((s) => (
        <React.Fragment key={s}>
          <div 
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all",
              s === step 
                ? "bg-[#163F78] text-white"
                : s < step
                  ? "bg-green-500 text-white"
                  : "bg-slate-100 text-slate-400"
            )}
          >
            {s < step ? <CheckCircle2 size={16} /> : s}
          </div>
          {s < 7 && (
            <div className={cn(
              "w-8 h-0.5 rounded",
              s < step ? "bg-green-500" : "bg-slate-200"
            )} />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-slate-900">Chọn đơn hàng</h3>
      <p className="text-sm text-slate-500">Tìm và chọn đơn hàng bạn muốn yêu cầu đổi/trả.</p>
      
      {/* Order Search/Select */}
      <div className="relative">
        <div 
          className={cn(
            "w-full p-4 bg-white border rounded-xl cursor-pointer transition-all",
            showOrderDropdown ? "border-[#163F78] ring-2 ring-[#163F78]/20" : "border-slate-200 hover:border-slate-300"
          )}
          onClick={() => setShowOrderDropdown(!showOrderDropdown)}
        >
          {selectedOrder ? (
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-[#163F78]">{selectedOrder.orderCode}</p>
                <p className="text-sm text-slate-500">Ngày đặt: {selectedOrder.date} • {selectedOrder.products.length} sản phẩm</p>
              </div>
              <span className={cn(
                "px-2 py-0.5 text-xs font-medium rounded-full",
                selectedOrder.status === 'completed' ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"
              )}>
                {selectedOrder.statusLabel}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-slate-400">
              <Search size={18} />
              <span>Chọn đơn hàng...</span>
            </div>
          )}
        </div>

        {showOrderDropdown && (
          <div className="absolute z-20 w-full mt-2 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden">
            <div className="p-3 border-b border-slate-100">
              <input
                type="text"
                placeholder="Tìm mã đơn hàng..."
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#163F78]"
              />
            </div>
            <div className="max-h-64 overflow-y-auto">
              {filteredOrders.map(order => (
                <div
                  key={order.id}
                  className="p-4 hover:bg-slate-50 cursor-pointer border-b border-slate-50 last:border-0"
                  onClick={() => handleSelectOrder(order)}
                >
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-slate-800">{order.orderCode}</p>
                    <span className="text-xs text-slate-500">{order.date}</span>
                  </div>
                  <p className="text-sm text-slate-500 mt-1">{order.products.length} sản phẩm</p>
                </div>
              ))}
              {filteredOrders.length === 0 && (
                <div className="p-4 text-center text-slate-500 text-sm">
                  Không tìm thấy đơn hàng
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {selectedOrder && (
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
          <p className="text-xs text-slate-500 mb-2">Sản phẩm trong đơn hàng</p>
          {selectedOrder.products.map(product => (
            <div key={product.id} className="flex items-center gap-3 py-2">
              <div className="w-10 h-10 bg-slate-200 rounded-lg flex items-center justify-center">
                <Package size={18} className="text-slate-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-800 truncate">{product.name}</p>
                <p className="text-xs text-slate-500">SKU: {product.sku}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-slate-900">Chọn sản phẩm cần đổi/trả</h3>
      <p className="text-sm text-slate-500">Chọn sản phẩm và số lượng bạn muốn yêu cầu.</p>
      
      <div className="space-y-3">
        {selectedOrder?.products.map(product => {
          const selectedProduct = formData.selectedProducts.find(p => p.productId === product.id);
          const isSelected = !!selectedProduct;
          const returnQuantity = selectedProduct?.quantity || 0;
          
          return (
            <div 
              key={product.id}
              className={cn(
                "p-4 rounded-xl border transition-all cursor-pointer",
                isSelected 
                  ? "border-[#163F78] bg-blue-50/30" 
                  : "border-slate-200 hover:border-slate-300 bg-white"
              )}
              onClick={() => {
                if (isSelected) {
                  handleRemoveProduct(product.id);
                } else {
                  setFormData(prev => ({
                    ...prev,
                    selectedProducts: [...prev.selectedProducts, { productId: product.id, quantity: 1 }]
                  }));
                }
              }}
            >
              <div className="flex items-start gap-4">
                <div className={cn(
                  "w-6 h-6 rounded-md border-2 flex items-center justify-center flex-shrink-0 mt-1",
                  isSelected 
                    ? "bg-[#163F78] border-[#163F78]" 
                    : "border-slate-300"
                )}>
                  {isSelected && <CheckCircle2 size={14} className="text-white" />}
                </div>
                
                <div className="w-16 h-16 bg-slate-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Package size={28} className="text-slate-300" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-slate-900 line-clamp-2">
                    {product.name}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">SKU: {product.sku}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-xs text-slate-500">Đã mua: {product.quantity}</span>
                    <span className="text-sm font-semibold text-[#163F78]">{formatPrice(product.price)} đ</span>
                  </div>
                </div>
                
                {isSelected && (
                  <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                    <button
                      onClick={() => handleProductQuantityChange(product.id, returnQuantity - 1)}
                      className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold transition-colors"
                    >
                      -
                    </button>
                    <span className="w-10 text-center font-semibold">{returnQuantity}</span>
                    <button
                      onClick={() => handleProductQuantityChange(product.id, returnQuantity + 1)}
                      disabled={returnQuantity >= product.quantity}
                      className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold transition-colors disabled:opacity-50"
                    >
                      +
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-slate-900">Loại yêu cầu</h3>
      <p className="text-sm text-slate-500">Chọn loại yêu cầu đổi/trả phù hợp với nhu cầu của bạn.</p>
      
      <div className="space-y-3">
        {RETURN_TYPES.map(type => (
          <div
            key={type.value}
            className={cn(
              "p-4 rounded-xl border cursor-pointer transition-all",
              formData.returnType === type.value
                ? "border-[#163F78] bg-blue-50/30"
                : "border-slate-200 hover:border-slate-300 bg-white"
            )}
            onClick={() => setFormData(prev => ({ ...prev, returnType: type.value }))}
          >
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                formData.returnType === type.value
                  ? "border-[#163F78] bg-[#163F78]"
                  : "border-slate-300"
              )}>
                {formData.returnType === type.value && (
                  <div className="w-2 h-2 rounded-full bg-white" />
                )}
              </div>
              <span className="font-medium text-slate-800">{type.label}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-slate-900">Lý do đổi/trả</h3>
      <p className="text-sm text-slate-500">Chọn lý do chính cho yêu cầu của bạn.</p>
      
      <select
        value={formData.reason}
        onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
        className="w-full p-4 bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-[#163F78] focus:ring-2 focus:ring-[#163F78]/20"
      >
        <option value="">Chọn lý do...</option>
        {RETURN_REASONS.map(reason => (
          <option key={reason} value={reason}>{reason}</option>
        ))}
      </select>

      {formData.reason === "Lý do khác" && (
        <textarea
          placeholder="Vui lòng mô tả lý do của bạn..."
          className="w-full p-4 bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-[#163F78] focus:ring-2 focus:ring-[#163F78]/20 resize-none"
          rows={3}
          onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
        />
      )}
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-slate-900">Mô tả chi tiết</h3>
      <p className="text-sm text-slate-500">Mô tả ngắn gọn vấn đề bạn gặp phải để Mecsu hỗ trợ tốt hơn.</p>
      
      <textarea
        placeholder="Ví dụ: Sản phẩm nhận được có màu sắc khác với hình ảnh trên website..."
        value={formData.description}
        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
        className="w-full p-4 bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-[#163F78] focus:ring-2 focus:ring-[#163F78]/20 resize-none"
        rows={5}
      />
      <p className="text-xs text-slate-400">
        {formData.description.length}/500 ký tự (tối thiểu 10 ký tự)
      </p>
    </div>
  );

  const renderStep6 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-slate-900">Hình ảnh minh chứng</h3>
      <p className="text-sm text-slate-500">Đính kèm hình ảnh để giúp Mecsu xử lý nhanh hơn.</p>
      
      {/* Upload Area */}
      <div
        className={cn(
          "border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all",
          "hover:border-[#163F78] hover:bg-blue-50/20"
        )}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png"
          multiple
          className="hidden"
          onChange={handleImageUpload}
        />
        <Upload size={40} className="mx-auto text-slate-300 mb-3" />
        <p className="text-sm font-medium text-slate-600">Kéo thả ảnh vào đây hoặc bấm để chọn</p>
        <p className="text-xs text-slate-400 mt-2">Hỗ trợ JPG, PNG (tối đa 5MB/ảnh)</p>
      </div>

      {/* Image Previews */}
      {formData.images.length > 0 && (
        <div className="grid grid-cols-4 gap-3">
          {formData.images.map((file, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square bg-slate-100 rounded-lg flex items-center justify-center overflow-hidden">
                <img 
                  src={URL.createObjectURL(file)} 
                  alt={`Upload ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                onClick={() => handleRemoveImage(index)}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-lg border border-amber-100">
        <Info size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-amber-700">
          Ảnh giúp Mecsu xử lý yêu cầu nhanh hơn. Đặc biệt quan trọng nếu sản phẩm bị lỗi hoặc hư hỏng.
        </p>
      </div>
    </div>
  );

  const renderStep7 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-slate-900">Thông tin liên hệ</h3>
      <p className="text-sm text-slate-500">Cung cấp thông tin để Mecsu có thể liên hệ khi cần.</p>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Họ và tên</label>
          <input
            type="text"
            value={formData.contactName}
            onChange={(e) => setFormData(prev => ({ ...prev, contactName: e.target.value }))}
            className="w-full p-3 bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-[#163F78] focus:ring-2 focus:ring-[#163F78]/20"
            placeholder="Nhập họ và tên..."
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Số điện thoại</label>
          <input
            type="tel"
            value={formData.contactPhone}
            onChange={(e) => setFormData(prev => ({ ...prev, contactPhone: e.target.value }))}
            className="w-full p-3 bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-[#163F78] focus:ring-2 focus:ring-[#163F78]/20"
            placeholder="Nhập số điện thoại..."
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
          <input
            type="email"
            value={formData.contactEmail}
            onChange={(e) => setFormData(prev => ({ ...prev, contactEmail: e.target.value }))}
            className="w-full p-3 bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-[#163F78] focus:ring-2 focus:ring-[#163F78]/20"
            placeholder="Nhập email..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Địa chỉ nhận hàng đổi/trả (nếu cần)</label>
          <input
            type="text"
            className="w-full p-3 bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-[#163F78] focus:ring-2 focus:ring-[#163F78]/20"
            placeholder="Địa chỉ mặc định: 123 Đường Nguyễn Trãi, Quận 1, TP.HCM"
          />
        </div>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (step) {
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderStep3();
      case 4: return renderStep4();
      case 5: return renderStep5();
      case 6: return renderStep6();
      case 7: return renderStep7();
      default: return null;
    }
  };

  return (
    <AccountLayout>
      <div className="space-y-6">
        {/* Breadcrumb */}
        <nav className="flex items-center text-sm">
          <Link to="/" className="text-slate-500 hover:text-[#163F78] transition-colors flex items-center gap-1">
            <Home size={14} />
            Trang chủ
          </Link>
          <ChevronRight size={14} className="mx-2 text-slate-400" />
          <Link to="/tai-khoan" className="text-slate-500 hover:text-[#163F78] transition-colors">
            Tài khoản
          </Link>
          <ChevronRight size={14} className="mx-2 text-slate-400" />
          <Link to="/tai-khoan/don-hang" className="text-slate-500 hover:text-[#163F78] transition-colors">
            Đơn hàng
          </Link>
          <ChevronRight size={14} className="mx-2 text-slate-400" />
          <Link to="/tai-khoan/don-hang" className="text-slate-500 hover:text-[#163F78] transition-colors">
            Đổi trả
          </Link>
          <ChevronRight size={14} className="mx-2 text-slate-400" />
          <span className="text-[#163F78] font-semibold">Tạo yêu cầu</span>
        </nav>

        {/* Page Header */}
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">
            Tạo yêu cầu đổi/trả
          </h1>
          <p className="text-slate-500 mt-1">
            Chọn đơn hàng, sản phẩm và cung cấp thông tin để Mecsu hỗ trợ xử lý.
          </p>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Form */}
          <div className="flex-1 min-w-0">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-[0_1px_2px_rgba(16,24,40,0.04)] p-6">
              {renderStepIndicator()}
              {renderCurrentStep()}

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-200">
                <button
                  onClick={handleBack}
                  disabled={step === 1}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2.5 font-medium text-sm rounded-xl transition-colors",
                    step === 1
                      ? "text-slate-300 cursor-not-allowed"
                      : "text-slate-600 hover:bg-slate-100"
                  )}
                >
                  <ChevronLeft size={16} />
                  Quay lại
                </button>

                {step < 7 ? (
                  <button
                    onClick={handleNext}
                    disabled={!isStepValid()}
                    className={cn(
                      "flex items-center gap-2 px-6 py-2.5 font-semibold text-sm rounded-xl transition-colors",
                      isStepValid()
                        ? "bg-[#163F78] hover:bg-[#1a4a8a] text-white"
                        : "bg-slate-100 text-slate-300 cursor-not-allowed"
                    )}
                  >
                    Tiếp tục
                    <ChevronRight size={16} />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={!isStepValid() || isSubmitting}
                    className={cn(
                      "flex items-center gap-2 px-6 py-2.5 font-semibold text-sm rounded-xl transition-colors",
                      isStepValid() && !isSubmitting
                        ? "bg-[#EABF3B] hover:bg-[#D9AF2F] text-[#1a1a1a]"
                        : "bg-slate-100 text-slate-300 cursor-not-allowed"
                    )}
                  >
                    {isSubmitting ? (
                      <>Đang gửi...</>
                    ) : (
                      <>
                        Gửi yêu cầu đổi/trả
                        <CheckCircle2 size={16} />
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Cancel Button */}
            <div className="mt-4 text-center">
              <button
                onClick={handleCancel}
                className="text-sm text-slate-500 hover:text-slate-700 transition-colors"
              >
                Hủy và quay lại
              </button>
            </div>
          </div>

          {/* Help Panel */}
          <div className="w-full lg:w-[340px] flex-shrink-0">
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 sticky top-28">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <AlertCircle size={18} className="text-[#163F78]" />
                Chính sách đổi/trả
              </h3>
              
              <div className="space-y-3 mb-6">
                <p className="text-sm font-medium text-slate-700">Điều kiện hỗ trợ:</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm text-slate-600">
                    <CheckCircle2 size={16} className="text-green-500 flex-shrink-0 mt-0.5" />
                    Sản phẩm còn trong thời hạn hỗ trợ (7 ngày)
                  </li>
                  <li className="flex items-start gap-2 text-sm text-slate-600">
                    <CheckCircle2 size={16} className="text-green-500 flex-shrink-0 mt-0.5" />
                    Có hình ảnh minh chứng nếu sản phẩm lỗi
                  </li>
                  <li className="flex items-start gap-2 text-sm text-slate-600">
                    <CheckCircle2 size={16} className="text-green-500 flex-shrink-0 mt-0.5" />
                    Sản phẩm chưa qua sử dụng sai cách
                  </li>
                  <li className="flex items-start gap-2 text-sm text-slate-600">
                    <CheckCircle2 size={16} className="text-green-500 flex-shrink-0 mt-0.5" />
                    Còn đầy đủ phụ kiện và bao bì
                  </li>
                </ul>
              </div>

              <a 
                href="#" 
                className="block text-sm text-[#163F78] hover:underline mb-6"
              >
                Xem chi tiết chính sách đổi/trả
              </a>

              {/* Support Box */}
              <div className="p-4 bg-white rounded-xl border border-slate-200">
                <p className="text-sm font-medium text-slate-700 mb-3">Cần hỗ trợ?</p>
                <div className="space-y-2">
                  <a 
                    href="tel:19001234" 
                    className="flex items-center gap-2 text-sm text-slate-600 hover:text-[#163F78] transition-colors"
                  >
                    <Phone size={16} className="text-[#163F78]" />
                    1900 1234
                  </a>
                  <button className="flex items-center gap-2 text-sm text-slate-600 hover:text-[#163F78] transition-colors">
                    <MessageCircle size={16} className="text-[#163F78]" />
                    Chat với Mecsu
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AccountLayout>
  );
};

export default CreateReturnPage;
