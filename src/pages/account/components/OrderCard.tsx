import React from 'react';
import { Eye, RefreshCw, Truck, MapPin, CreditCard, Calendar } from 'lucide-react';
import { Order, OrderStatus } from '../../../types';
import { Badge } from '../../../components/ui/Badge';
import { cn } from '../../../lib/utils';

interface OrderCardProps {
  order: Order;
  onViewDetails?: (orderId: string) => void;
  onReorder?: (orderId: string) => void;
  onTrackShipping?: (orderId: string) => void;
}

const statusConfig: Record<OrderStatus, { label: string; variant: 'success' | 'info' | 'warning' | 'danger' }> = {
  processing: { label: 'Đang xử lý', variant: 'warning' },
  shipping: { label: 'Đang giao', variant: 'info' },
  completed: { label: 'Hoàn tất', variant: 'success' },
  cancelled: { label: 'Đã huỷ', variant: 'danger' },
};

export const OrderCard: React.FC<OrderCardProps> = ({ 
  order, 
  onViewDetails, 
  onReorder, 
  onTrackShipping 
}) => {
  const status = statusConfig[order.status];

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('vi-VN', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price) + ' đ';
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E5EAF2] shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden min-w-0 w-full">
      {/* Card Header */}
      <div className="p-4 lg:p-6 border-b border-[#E5EAF2] bg-slate-50/50">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-4 min-w-0">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-sm text-slate-500">Mã đơn hàng</span>
              <span className="font-bold text-[#163F78] truncate">{order.orderCode}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-500 min-w-0">
              <Calendar size={14} className="flex-shrink-0" />
              <span className="text-sm whitespace-nowrap">{formatDate(order.orderDate)}</span>
            </div>
          </div>
          <Badge variant={status.variant} size="lg">
            {status.label}
          </Badge>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 lg:p-6 min-w-0">
        {/* Order Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="flex items-start gap-3 min-w-0">
            <CreditCard size={18} className="text-slate-400 mt-0.5 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-slate-500 mb-1">Phương thức thanh toán</p>
              <p className="text-sm font-medium text-slate-800 truncate">{order.paymentMethod}</p>
            </div>
          </div>
          <div className="flex items-start gap-3 min-w-0">
            <MapPin size={18} className="text-slate-400 mt-0.5 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-slate-500 mb-1">Địa chỉ giao hàng</p>
              <p className="text-sm font-medium text-slate-800 line-clamp-2">{order.shippingAddress}</p>
            </div>
          </div>
        </div>

        {/* Products */}
        <div className="border border-[#E5EAF2] rounded-xl overflow-hidden mb-6 min-w-0">
          <div className="p-3 lg:p-4 bg-slate-50 border-b border-[#E5EAF2]">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Sản phẩm ({order.items.length})
            </h4>
          </div>
          <div className="divide-y divide-[#E5EAF2] max-h-[240px] overflow-y-auto">
            {order.items.slice(0, 3).map((item) => (
              <div key={item.id} className="p-3 lg:p-4 flex items-center gap-3 lg:gap-4 min-w-0">
                <div className="w-12 h-12 lg:w-16 lg:h-16 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                  <div className="w-10 h-10 lg:w-12 lg:h-12 bg-slate-200 rounded" />
                </div>
                <div className="flex-1 min-w-0 overflow-hidden">
                  <h5 className="text-sm font-medium text-slate-800 line-clamp-1">
                    {item.name}
                  </h5>
                  <p className="text-xs text-slate-500 mt-0.5 truncate">SKU: {item.sku}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold text-[#163F78]">
                    {formatPrice(item.price)}
                  </p>
                  <p className="text-xs text-slate-500">x{item.quantity}</p>
                </div>
              </div>
            ))}
            {order.items.length > 3 && (
              <div className="p-3 text-center bg-slate-50">
                <span className="text-xs text-slate-500">
                  +{order.items.length - 3} sản phẩm khác
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Total & Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#E5EAF2]">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-sm text-slate-500">Tổng tiền:</span>
            <span className="text-lg lg:text-xl font-bold text-[#163F78]">{formatPrice(order.totalAmount)}</span>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onViewDetails?.(order.id)}
              className="flex items-center gap-1.5 lg:gap-2 px-3 lg:px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium text-xs lg:text-sm transition-colors"
            >
              <Eye size={14} />
              <span>Xem chi tiết</span>
            </button>
            
            <button
              onClick={() => onReorder?.(order.id)}
              className="flex items-center gap-1.5 lg:gap-2 px-3 lg:px-4 py-2 bg-[#FFC72C] hover:bg-[#E8B931] text-[#111827] rounded-xl font-bold text-xs lg:text-sm transition-colors"
            >
              <RefreshCw size={14} />
              <span>Mua lại</span>
            </button>
            
            {order.status === 'shipping' && (
              <button
                onClick={() => onTrackShipping?.(order.id)}
                className="flex items-center gap-1.5 lg:gap-2 px-3 lg:px-4 py-2 bg-[#163F78] hover:bg-[#1a4a8a] text-white rounded-xl font-bold text-xs lg:text-sm transition-colors"
              >
                <Truck size={14} />
                <span>Theo dõi</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
