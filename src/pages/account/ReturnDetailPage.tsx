import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ChevronRight, 
  Home, 
  Package, 
  Clock, 
  CheckCircle2, 
  MessageCircle,
  Phone,
  RotateCcw,
  ArrowLeft,
  AlertCircle,
  FileImage,
  XCircle,
  RefreshCw,
  DollarSign
} from 'lucide-react';
import { AccountLayout } from './components/AccountLayout';
import { cn } from '../../lib/utils';

interface Product {
  name: string;
  sku: string;
  quantity: number;
  returnQuantity: number;
  price: number;
  image: string;
  condition: string;
}

interface ReturnRequest {
  id: string;
  status: 'pending' | 'approved' | 'completed' | 'rejected';
  statusLabel: string;
  orderId: string;
  createdDate: string;
  reason: string;
  customerNote?: string;
  images: string[];
  products: Product[];
  type: 'exchange' | 'return' | 'refund';
  typeLabel: string;
  updates: {
    id: string;
    message: string;
    timestamp: string;
  }[];
}

const MOCK_RETURN: ReturnRequest = {
  id: "TRA2505120001",
  status: "pending",
  statusLabel: "Đang xem xét",
  orderId: "MEC2505100005",
  createdDate: "12/05/2025",
  reason: "Sản phẩm không đúng như mô tả trên website",
  customerNote: "Sản phẩm nhận được có màu sắc khác với hình ảnh trên website. Cụ thể: đã đặt màu xanh navy nhưng nhận được màu đen.",
  images: [],
  products: [
    {
      name: "Phe Gài Trục Thép 65Mn DIN471 D3x0.4 (50Cái/Bịch)",
      sku: "B01M1001035TH00",
      quantity: 10,
      returnQuantity: 2,
      price: 259200,
      image: "",
      condition: "Nguyên seal, chưa sử dụng"
    }
  ],
  type: "exchange",
  typeLabel: "Đổi hàng",
  updates: [
    { id: "1", message: "Yêu cầu đổi/trả đã được gửi thành công", timestamp: "12/05/2025 14:30" },
    { id: "2", message: "Mecsu đã nhận được yêu cầu và đang xem xét", timestamp: "12/05/2025 15:45" },
    { id: "3", message: "Nhân viên đang kiểm tra thông tin và hình ảnh", timestamp: "13/05/2025 09:00" }
  ]
};

const TIMELINE_STEPS = [
  { id: 'submitted', label: 'Đã gửi yêu cầu', icon: Package },
  { id: 'reviewing', label: 'Mecsu xem xét', icon: Clock },
  { id: 'approved', label: 'Đã duyệt yêu cầu', icon: CheckCircle2 },
  { id: 'processing', label: 'Đang xử lý', icon: RefreshCw },
  { id: 'completed', label: 'Hoàn tất', icon: DollarSign },
];

const getCurrentStepIndex = (status: ReturnRequest['status']) => {
  switch (status) {
    case 'pending': return 1;
    case 'approved': return 2;
    case 'completed': return 3;
    case 'rejected': return -1;
    default: return 0;
  }
};

const getStatusBadge = (status: ReturnRequest['status'], label: string) => {
  const config: Record<string, { bg: string; text: string }> = {
    pending: { bg: 'bg-amber-100', text: 'text-amber-700' },
    approved: { bg: 'bg-blue-100', text: 'text-blue-700' },
    completed: { bg: 'bg-green-100', text: 'text-green-700' },
    rejected: { bg: 'bg-red-100', text: 'text-red-700' },
  };
  const { bg, text } = config[status] || config.pending;
  return { bg, text, label };
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('vi-VN').format(price);
};

const ReturnDetailPage: React.FC = () => {
  const { returnId } = useParams<{ returnId: string }>();
  const navigate = useNavigate();
  
  const returnRequest = MOCK_RETURN;
  const currentStepIndex = getCurrentStepIndex(returnRequest.status);
  const statusBadge = getStatusBadge(returnRequest.status, returnRequest.statusLabel);

  const handleBackToList = () => {
    navigate('/tai-khoan/don-hang');
  };

  const handleContactSupport = () => {
    console.log('Contact support');
  };

  const handleCancelRequest = () => {
    console.log('Cancel request');
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
          <span className="text-[#163F78] font-semibold">{returnId}</span>
        </nav>

        {/* Page Header */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">
              Chi tiết yêu cầu đổi/trả
            </h1>
            <p className="text-slate-500 mt-1">
              Theo dõi trạng thái xử lý yêu cầu đổi/trả của bạn.
            </p>
          </div>
          <span className={cn("px-3 py-1.5 text-sm font-semibold rounded-full", statusBadge.bg, statusBadge.text)}>
            {statusBadge.label}
          </span>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Column - Content */}
          <div className="flex-1 min-w-0 space-y-6">
            {/* Return Status Timeline */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-[0_1px_2px_rgba(16,24,40,0.04)] p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-6">Trạng thái yêu cầu</h2>
              {returnRequest.status === 'rejected' ? (
                <div className="flex items-center gap-4 p-4 bg-red-50 rounded-xl border border-red-100">
                  <XCircle size={32} className="text-red-500 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-red-700">Yêu cầu bị từ chối</p>
                    <p className="text-sm text-red-600 mt-1">Vui lòng liên hệ bộ phận hỗ trợ để được giải đáp.</p>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  {/* Progress Line */}
                  <div className="absolute top-5 left-5 w-[calc(100%-40px)] h-0.5 bg-slate-200" />
                  <div 
                    className="absolute top-5 left-5 h-0.5 bg-[#163F78] transition-all"
                    style={{ width: `${(currentStepIndex / (TIMELINE_STEPS.length - 1)) * 100}%` }}
                  />
                  
                  {/* Timeline Steps */}
                  <div className="flex justify-between relative">
                    {TIMELINE_STEPS.map((step, index) => {
                      const isCompleted = index <= currentStepIndex;
                      const isCurrent = index === currentStepIndex;
                      const Icon = step.icon;
                      
                      return (
                        <div key={step.id} className="flex flex-col items-center">
                          <div 
                            className={cn(
                              "w-10 h-10 rounded-full flex items-center justify-center z-10 transition-all",
                              isCompleted 
                                ? isCurrent
                                  ? "bg-[#163F78] text-white"
                                  : "bg-[#163F78]/80 text-white"
                                : "bg-slate-100 text-slate-400"
                            )}
                          >
                            <Icon size={18} />
                          </div>
                          <div className="mt-3 text-center max-w-[100px]">
                            <p className={cn(
                              "text-xs font-medium",
                              isCompleted ? "text-slate-900" : "text-slate-400"
                            )}>
                              {step.label}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Request Information */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-[0_1px_2px_rgba(16,24,40,0.04)] p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Thông tin yêu cầu</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Mã yêu cầu</p>
                  <p className="text-sm font-semibold text-[#163F78]">{returnRequest.id}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Mã đơn hàng liên quan</p>
                  <Link 
                    to={`/tai-khoan/don-hang/${returnRequest.orderId}`}
                    className="text-sm font-medium text-[#163F78] hover:underline"
                  >
                    {returnRequest.orderId}
                  </Link>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Ngày tạo yêu cầu</p>
                  <p className="text-sm font-medium text-slate-700">{returnRequest.createdDate}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Loại yêu cầu</p>
                  <p className="text-sm font-medium text-slate-700">{returnRequest.typeLabel}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-xs text-slate-500 mb-1">Lý do đổi/trả</p>
                  <p className="text-sm font-medium text-slate-700">{returnRequest.reason}</p>
                </div>
                {returnRequest.customerNote && (
                  <div className="md:col-span-2">
                    <p className="text-xs text-slate-500 mb-1">Ghi chú của bạn</p>
                    <p className="text-sm font-medium text-slate-700">{returnRequest.customerNote}</p>
                  </div>
                )}
                {returnRequest.images.length > 0 && (
                  <div className="md:col-span-2">
                    <p className="text-xs text-slate-500 mb-2">Hình ảnh minh chứng</p>
                    <div className="flex flex-wrap gap-2">
                      {returnRequest.images.map((img, i) => (
                        <div key={i} className="w-20 h-20 bg-slate-100 rounded-lg flex items-center justify-center">
                          <FileImage size={24} className="text-slate-400" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Products */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-[0_1px_2px_rgba(16,24,40,0.04)] p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Sản phẩm đổi/trả</h2>
              <div className="space-y-4">
                {returnRequest.products.map((product, index) => (
                  <div 
                    key={index}
                    className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors"
                  >
                    <div className="w-20 h-20 bg-slate-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Package size={32} className="text-slate-300" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-slate-900 line-clamp-2">
                        {product.name}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">SKU: {product.sku}</p>
                      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-3">
                        <div>
                          <span className="text-xs text-slate-500">SL đã mua: </span>
                          <span className="text-sm font-semibold text-slate-700">{product.quantity}</span>
                        </div>
                        <div>
                          <span className="text-xs text-slate-500">SL đổi/trả: </span>
                          <span className="text-sm font-semibold text-red-600">{product.returnQuantity}</span>
                        </div>
                        <div>
                          <span className="text-xs text-slate-500">Đơn giá: </span>
                          <span className="text-sm font-semibold text-slate-700">{formatPrice(product.price)} đ</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <span className="text-xs text-slate-500">Tình trạng:</span>
                      <p className="text-xs font-medium text-slate-700 mt-0.5">{product.condition}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Updates Timeline */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-[0_1px_2px_rgba(16,24,40,0.04)] p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Cập nhật từ Mecsu</h2>
              <div className="space-y-4">
                {returnRequest.updates.map((update, index) => (
                  <div key={update.id} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center",
                        index === 0 ? "bg-[#163F78] text-white" : "bg-slate-100 text-slate-400"
                      )}>
                        {index === 0 ? <CheckCircle2 size={16} /> : <Clock size={16} />}
                      </div>
                      {index < returnRequest.updates.length - 1 && (
                        <div className="w-px h-full min-h-[24px] bg-slate-200 mt-2" />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <p className="text-sm font-medium text-slate-700">{update.message}</p>
                      <p className="text-xs text-slate-500 mt-1">{update.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Summary Panel */}
          <div className="w-full lg:w-[340px] flex-shrink-0">
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 sticky top-28">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Thông tin yêu cầu</h2>
              
              {/* Request Info */}
              <div className="space-y-3 pb-4 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">Mã yêu cầu</span>
                  <span className="text-sm font-semibold text-[#163F78]">{returnRequest.id}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">Trạng thái</span>
                  <span className={cn("px-2 py-0.5 text-xs font-semibold rounded-full", statusBadge.bg, statusBadge.text)}>
                    {statusBadge.label}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">Mã đơn hàng</span>
                  <span className="text-sm font-medium text-slate-700">{returnRequest.orderId}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">Ngày gửi</span>
                  <span className="text-sm font-medium text-slate-700">{returnRequest.createdDate}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">Loại yêu cầu</span>
                  <span className="text-sm font-medium text-slate-700">{returnRequest.typeLabel}</span>
                </div>
              </div>

              {/* Related Order */}
              <div className="py-4 border-b border-slate-200">
                <p className="text-xs text-slate-500 mb-2">Đơn hàng liên quan</p>
                <Link 
                  to={`/tai-khoan/don-hang/${returnRequest.orderId}`}
                  className="flex items-center gap-2 text-sm font-medium text-[#163F78] hover:underline"
                >
                  <Package size={14} />
                  {returnRequest.orderId}
                </Link>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-4">
                <button
                  onClick={handleContactSupport}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#163F78] hover:bg-[#1a4a8a] text-white font-medium text-sm rounded-xl transition-colors"
                >
                  <MessageCircle size={16} />
                  Liên hệ hỗ trợ
                </button>
                <button
                  onClick={handleBackToList}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 font-medium text-sm rounded-xl transition-colors"
                >
                  <ArrowLeft size={16} />
                  Quay lại danh sách
                </button>
                {returnRequest.status === 'pending' && (
                  <button
                    onClick={handleCancelRequest}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border border-red-200 hover:border-red-300 text-red-600 font-medium text-sm rounded-xl transition-colors"
                  >
                    <XCircle size={16} />
                    Hủy yêu cầu
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AccountLayout>
  );
};

export default ReturnDetailPage;
