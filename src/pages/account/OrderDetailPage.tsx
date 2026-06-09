import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ChevronRight,
  Home,
  Package,
  Truck,
  MapPin,
  Phone,
  CreditCard,
  FileText,
  RefreshCw,
  RotateCcw,
  MessageCircle,
  Download,
  ShoppingCart,
  Copy,
  CheckCircle2,
  ArrowLeft,
  Star,
} from "lucide-react";
import { AccountLayout } from "./components/AccountLayout";
import { ProductReviewModal } from "./components/ProductReviewModal";
import { useAuth } from "../../hooks/useAuth";
import { orderStorage } from "../../services/orderStorage";
import { productService } from "../../features/products/services/productService";
import OrderTrackingMap from "../../components/OrderTrackingMap";
import { OrderStatusBar } from "../../components/ui/OrderStatusBar";

interface Product {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  price: number;
  image: string;
}

interface Order {
  id: string;
  status: "pending" | "processing" | "shipping" | "completed" | "cancelled";
  date: string;
  paymentMethod: string;
  paymentStatus: string;
  shippingAddress: string;
  recipientName: string;
  phone: string;
  products: Product[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  vat: number;
  total: number;
  shippingLat?: number;
  shippingLng?: number;
  timestamps?: string[];
}

const MOCK_ORDER: Order = {
  id: "MEC2505180001",
  status: "completed",
  date: "15/05/2025",
  paymentMethod: "Thanh toán khi nhận hàng (COD)",
  paymentStatus: "Đã thanh toán",
  shippingAddress: "123 Đường Nguyễn Trãi, Quận 1, TP.HCM",
  recipientName: "Nguyễn Văn Tuấn",
  phone: "0900000000",
  products: [
    {
      id: "0043170",
      name: "Phe Gài Trục Thép 65Mn DIN471 D3x0.4 (50Cái/Bịch)",
      sku: "B01M1001035TH00",
      quantity: 10,
      price: 259200,
      image: "",
    },
    {
      id: "bulong-inox-001293",
      name: "Bulong Inox 304 DIN933 M3x20",
      sku: "B01M1001035TH01",
      quantity: 50,
      price: 34920,
      image: "",
    },
  ],
  subtotal: 2500000,
  shippingFee: 0,
  discount: 0,
  vat: 350000,
  total: 2850000,
  timestamps: [
    "2025-05-15T09:37:00",
    "2025-05-15T09:38:00",
    "2025-05-15T09:45:00",
    "2025-05-15T10:05:00",
    "2025-05-15T10:30:00",
  ],
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("vi-VN").format(price);
};

const STATUS_LABELS: Record<string, string> = {
  pending: "Đã đặt hàng",
  processing: "Đang xử lý",
  shipping: "Đang giao hàng",
  completed: "Hoàn tất",
  cancelled: "Đã huỷ",
};

const STATUS_BADGE_CLASS: Record<string, string> = {
  pending: "bg-blue-100 text-blue-700",
  processing: "bg-amber-100 text-amber-700",
  shipping: "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

const OrderDetailPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Try to get order from localStorage first
  const storedOrder =
    user && orderId ? orderStorage.getOrderByCode(user.id, orderId) : null;

  // Transform stored order to match the display interface
  const transformedOrder = storedOrder
    ? {
        id: storedOrder.id,
        status: storedOrder.status,
        date: storedOrder.orderDate,
        paymentMethod: storedOrder.paymentMethod,
        paymentStatus: "Đã thanh toán",
        // Handle shippingAddress as object or string
        shippingAddress:
          typeof storedOrder.shippingAddress === "string"
            ? storedOrder.shippingAddress
            : (storedOrder.shippingAddress as any)?.fullAddress || "",
        // Get recipientName from shippingAddress object OR from storedOrder.recipientName
        recipientName:
          typeof storedOrder.shippingAddress === "object"
            ? (storedOrder.shippingAddress as any)?.receiverName ||
              (storedOrder.shippingAddress as any)?.name ||
              ""
            : storedOrder.recipientName || "",
        // Get phone from shippingAddress object OR from storedOrder.phone
        phone:
          typeof storedOrder.shippingAddress === "object"
            ? (storedOrder.shippingAddress as any)?.phone ||
              (storedOrder.shippingAddress as any)?.phoneNumber ||
              ""
            : storedOrder.phone || "",
        products: storedOrder.items,
        subtotal: storedOrder.totalAmount,
        shippingFee: 0,
        discount: 0,
        vat: 0,
        total: storedOrder.totalAmount,
        shippingLat: (storedOrder as any).shippingLat,
        shippingLng: (storedOrder as any).shippingLng,
        timestamps: (storedOrder as any).timestamps,
      }
    : null;

  // Use stored order or fallback to mock only if no stored order found
  const order = transformedOrder || MOCK_ORDER;

  // Show "not found" message if using mock
  const isMockOrder = !transformedOrder;

  const handleReorder = () => {
    console.log("Reorder:", order.id);
  };

  const handleProductClick = (product: Product) => {
    // Prefer id if it exists in PRODUCTS catalog; otherwise fall back to sku
    const idInCatalog = productService.getById(product.id || '');
    const skuInCatalog = productService.getBySku(product.sku || '');
    const targetId = idInCatalog ? product.id : (skuInCatalog ? product.sku : null);
    if (targetId) navigate(`/san-pham/${targetId}`);
  };

  const handleReorderProduct = (product: Product) => {
    const idInCatalog = productService.getById(product.id || '');
    const skuInCatalog = productService.getBySku(product.sku || '');
    const targetId = idInCatalog ? product.id : (skuInCatalog ? product.sku : null);
    if (targetId) navigate(`/san-pham/${targetId}`);
  };

  const handleRequestReturn = () => {
    console.log("Request return");
  };

  // Review state
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [reviewedProducts, setReviewedProducts] = useState<Set<string>>(new Set());
  const [productReviews, setProductReviews] = useState<Record<string, any>>({});

  const handleOpenReview = (product: Product) => {
    setSelectedProduct(product);
    setReviewModalOpen(true);
  };

  const handleCloseReview = () => {
    setReviewModalOpen(false);
    setSelectedProduct(null);
  };

  const handleSubmitReview = (productId: string, review: any) => {
    setReviewedProducts(prev => new Set([...prev, productId]));
    setProductReviews(prev => ({ ...prev, [productId]: review }));
  };

  const handleContactSupport = () => {
    console.log("Contact support");
  };

  return (
    <AccountLayout>
      <div className="space-y-4">
        {/* Breadcrumb */}
        <Link
          to="/tai-khoan/don-hang"
          className="flex items-center gap-1.5 text-slate-500 hover:text-[#163F78] transition-colors font-medium text-sm"
        >
          <ArrowLeft size={16} className="text-slate-400" />
          <span>Quay lại</span>
        </Link>

        {/* Mock Order Warning */}
        {isMockOrder && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <p className="text-amber-700 text-sm">
              Không tìm thấy đơn hàng này trong hệ thống. Hiển thị dữ liệu mẫu.
            </p>
          </div>
        )}

        {/* Page Header */}
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">
            Chi tiết đơn hàng
          </h1>
          <p className="text-slate-500 mt-1">
            Theo dõi trạng thái, sản phẩm và thông tin thanh toán của đơn hàng.
          </p>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Column - Content */}
          <div className="flex-1 min-w-0 space-y-6">
            {/* Order Status Timeline */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-[0_1px_2px_rgba(16,24,40,0.04)] p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-6">
                Trạng thái đơn hàng
              </h2>
              <OrderStatusBar status={order.status as any} size="md" timestamps={order.timestamps} />
            </div>

            {/* Products in Order */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-[0_1px_2px_rgba(16,24,40,0.04)] p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-4">
                Sản phẩm trong đơn hàng
              </h2>
              <div className="space-y-4">
                {order.products.map((product, index) => {
                  const isReviewed = reviewedProducts.has(product.id);
                  const review = productReviews[product.id];
                  return (
                    <div
                      key={index}
                      className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors"
                    >
                      <div className="w-20 h-20 bg-slate-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Package size={32} className="text-slate-300" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <button
                          onClick={() => handleProductClick(product)}
                          className="text-sm font-semibold text-[#163F78] hover:underline text-left line-clamp-2 cursor-pointer"
                        >
                          {product.name}
                        </button>
                        <p className="text-xs text-slate-500 mt-1">
                          SKU: {product.sku}
                        </p>
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-3">
                          <div>
                            <span className="text-xs text-slate-500">
                              Số lượng:{" "}
                            </span>
                            <span className="text-sm font-semibold text-slate-700">
                              {product.quantity}
                            </span>
                          </div>
                          <div>
                            <span className="text-xs text-slate-500">
                              Đơn giá:{" "}
                            </span>
                            <span className="text-sm font-semibold text-slate-700">
                              {formatPrice(product.price)} đ
                            </span>
                          </div>
                          <div>
                            <span className="text-xs text-slate-500">
                              Thành tiền:{" "}
                            </span>
                            <span className="text-sm font-bold text-[#163F78]">
                              {formatPrice(product.price * product.quantity)} đ
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2 self-start">
                        {isReviewed && review ? (
                          <div className="flex flex-col items-end gap-2">
                            <div className="flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-1.5 rounded-full text-xs font-medium">
                              <Star size={12} className="fill-[#F5B301] text-[#F5B301]" />
                              <span>Đã đánh giá</span>
                            </div>
                            <div className="flex items-center gap-1">
                              {[...Array(review.rating)].map((_, i) => (
                                <Star key={i} size={14} className="fill-[#F5B301] text-[#F5B301]" />
                              ))}
                            </div>
                            <button
                              onClick={() => handleOpenReview(product)}
                              className="text-xs text-[#163F78] hover:underline font-medium"
                            >
                              Chỉnh sửa đánh giá
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleOpenReview(product)}
                              className="flex items-center justify-center gap-1.5 px-4 py-2 bg-[#FFF8E1] hover:bg-[#E6C24A] border border-[#E6C24A] hover:border-[#E6C24A] text-[#B8860B] hover:text-white font-semibold text-sm rounded-xl transition-all"
                            >
                              <Star size={14} className="hover:fill-white" />
                              Đánh giá
                            </button>
                            <button
                              onClick={() => handleReorderProduct(product)}
                              className="flex items-center justify-center gap-2 px-4 py-2 bg-[#EABF3B] hover:bg-[#D9AF2F] text-[#1a1a1a] font-semibold text-sm rounded-xl transition-colors"
                            >
                              <ShoppingCart size={16} />
                              Mua lại
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Shipping Information */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-[0_1px_2px_rgba(16,24,40,0.04)] p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-4">
                Thông tin giao hàng
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center shrink-0">
                    <MapPin size={18} className="text-slate-500" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">
                      Địa chỉ giao hàng
                    </p>
                    <p className="text-sm font-medium text-slate-800">
                      {order.shippingAddress || "Chưa có địa chỉ giao hàng"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center shrink-0">
                    <Package size={18} className="text-slate-500" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Người nhận</p>
                    <p className="text-sm font-medium text-slate-800">
                      {order.recipientName || "Chưa có thông tin"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center shrink-0">
                    <Phone size={18} className="text-slate-500" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Số điện thoại</p>
                    <p className="text-sm font-medium text-slate-800">
                      {order.phone || "Chưa có số điện thoại"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center shrink-0">
                    <Truck size={18} className="text-slate-500" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">
                      Phương thức vận chuyển
                    </p>
                    <p className="text-sm font-medium text-slate-800">
                      Giao hàng nhanh 2h
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Tracking */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-[0_1px_2px_rgba(16,24,40,0.04)] overflow-hidden">
              <div className="px-6 pt-6 pb-4">
                <div className="flex items-center gap-3 mb-1">
                  <Truck size={20} style={{ color: "#173E75" }} />
                  <h2 className="text-lg font-bold text-slate-900">
                    Theo dõi giao hàng
                  </h2>
                </div>
                <p className="text-sm text-slate-500 pl-8">
                  Từ kho MECSU Bình Tân đến địa chỉ giao hàng
                </p>
              </div>
              <div className="px-6 pb-0">
                <OrderTrackingMap
                  shippingAddress={order.shippingAddress}
                  shippingLat={order.shippingLat}
                  shippingLng={order.shippingLng}
                  orderStatus={order.status}
                  standalone={true}
                />
              </div>
              <div className="h-6" />
            </div>

            {/* Payment Information */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-[0_1px_2px_rgba(16,24,40,0.04)] p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-4">
                Thông tin thanh toán
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CreditCard size={18} className="text-slate-500" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">
                      Phương thức thanh toán
                    </p>
                    <p className="text-sm font-medium text-slate-800">
                      {order.paymentMethod}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 size={18} className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">
                      Trạng thái thanh toán
                    </p>
                    <p className="text-sm font-medium text-green-700">
                      {order.paymentStatus}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 md:col-span-2">
                  <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText size={18} className="text-slate-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-slate-500 mb-1">Mã hóa đơn</p>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-slate-800">
                        INV-{order.id}
                      </p>
                      <button className="p-1 hover:bg-slate-100 rounded transition-colors">
                        <Copy size={14} className="text-slate-400" />
                      </button>
                      <button className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition-colors ml-2">
                        <Download size={14} />
                        Tải hóa đơn VAT
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Summary Panel */}
          <div className="w-full lg:w-[340px] flex-shrink-0">
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 sticky top-28">
              <h2 className="text-lg font-bold text-slate-900 mb-4">
                Tóm tắt đơn hàng
              </h2>

              {/* Order Info */}
              <div className="space-y-3 pb-4 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">Mã đơn hàng</span>
                  <span className="text-sm font-semibold text-[#163F78]">
                    {order.id}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">Ngày đặt</span>
                  <span className="text-sm font-medium text-slate-700">
                    {order.date}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">Trạng thái</span>
                  <span
                    className={`px-2 py-0.5 text-xs font-semibold rounded-full ${STATUS_BADGE_CLASS[order.status] || "bg-slate-100 text-slate-700"}`}
                  >
                    {STATUS_LABELS[order.status] || order.status}
                  </span>
                </div>
              </div>

              {/* Price Summary */}
              <div className="space-y-3 py-4 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">Tạm tính</span>
                  <span className="text-sm font-medium text-slate-700">
                    {formatPrice(order.subtotal)} đ
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">Phí vận chuyển</span>
                  <span className="text-sm font-medium text-slate-700">
                    {order.shippingFee === 0
                      ? "Miễn phí"
                      : `${formatPrice(order.shippingFee)} đ`}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">Giảm giá</span>
                  <span className="text-sm font-medium text-green-600">
                    {order.discount === 0
                      ? "-"
                      : `-${formatPrice(order.discount)} đ`}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">VAT (10%)</span>
                  <span className="text-sm font-medium text-slate-700">
                    {formatPrice(order.vat)} đ
                  </span>
                </div>
              </div>

              {/* Total */}
              <div className="flex items-center justify-between py-4">
                <span className="text-base font-bold text-slate-900">
                  Tổng thanh toán
                </span>
                <span className="text-xl font-bold text-[#163F78]">
                  {formatPrice(order.total)} đ
                </span>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-4 border-t border-slate-200">
                <button
                  onClick={handleReorder}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#EABF3B] hover:bg-[#D9AF2F] text-[#1a1a1a] font-semibold text-sm rounded-xl transition-colors"
                >
                  <RefreshCw size={16} />
                  Mua lại đơn hàng
                </button>
                <button
                  onClick={handleRequestReturn}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 font-medium text-sm rounded-xl transition-colors"
                >
                  <RotateCcw size={16} />
                  Yêu cầu đổi trả
                </button>
                <button
                  onClick={handleContactSupport}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 font-medium text-sm rounded-xl transition-colors"
                >
                  <MessageCircle size={16} />
                  Liên hệ hỗ trợ
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Review Modal */}
      <ProductReviewModal
        product={selectedProduct}
        isOpen={reviewModalOpen}
        onClose={handleCloseReview}
        onSubmit={handleSubmitReview}
      />
    </AccountLayout>
  );
};

export default OrderDetailPage;
