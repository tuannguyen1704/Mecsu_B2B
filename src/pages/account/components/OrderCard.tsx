import React from 'react';
import { Calendar } from 'lucide-react';
import { Order } from '../../../types';
import { OrderCardStatusBar } from './OrderCardStatusBar';

interface OrderCardProps {
  order: Order;
  onViewDetails?: (orderId: string) => void;
  onReview?: (orderId: string) => void;
  reviewed?: boolean;
}

const STATUS_LABELS: Record<string, string> = {
  pending:    'Chờ xác nhận',
  processing: 'Đang xử lý',
  shipping:   'Đang giao hàng',
  completed:  'Hoàn tất',
  cancelled:  'Đã huỷ',
};

export const OrderCard: React.FC<OrderCardProps> = ({ 
  order, 
  onViewDetails, 
  onReview,
  reviewed = false,
}) => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('vi-VN', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onViewDetails?.(order.id)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onViewDetails?.(order.id);
        }
      }}
      className="w-full text-left bg-white rounded-2xl border border-[#E5EAF2] shadow-sm hover:shadow-lg hover:border-[#163F78]/20 transition-all duration-300 overflow-hidden min-w-0 group cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#163F78]/20 focus:border-[#163F78]"
    >
      {/* Card Header */}
      <div className="p-4 lg:p-5 border-b border-[#E5EAF2] bg-gradient-to-r from-slate-50/80 to-white">
        <div className="flex items-start justify-between gap-4">
          {/* Left side: Order info */}
          <div className="flex flex-col gap-1 min-w-0">
            {/* Order code with label on same line */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-medium uppercase tracking-wide">
                Mã đơn hàng
              </span>
              <span className="font-bold text-[#163F78] text-base tracking-tight group-hover:text-[#1e4a8a] transition-colors">
                {order.orderCode}
              </span>
            </div>
            
            {/* Date + Product count */}
            <div className="flex items-center gap-3 mt-1">
              <div className="flex items-center gap-1.5 text-slate-500">
                <Calendar size={13} className="flex-shrink-0 text-slate-400" />
                <span className="text-sm">{formatDate(order.orderDate)}</span>
              </div>
              <span className="text-slate-300">•</span>
              <span className="text-sm text-slate-500">{order.items.length} sản phẩm</span>
            </div>

            {/* Order status label (mobile) */}
            <div className="mt-2 lg:hidden">
              <span className={`
                inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold
                ${order.status === 'completed' ? 'bg-green-50 text-green-700' : ''}
                ${order.status === 'processing' ? 'bg-amber-50 text-amber-700' : ''}
                ${order.status === 'shipping' ? 'bg-blue-50 text-blue-700' : ''}
                ${order.status === 'pending' ? 'bg-slate-100 text-slate-600' : ''}
                ${order.status === 'cancelled' ? 'bg-red-50 text-red-600' : ''}
              `}>
                {STATUS_LABELS[order.status] || order.status}
              </span>
            </div>
          </div>

          {/* Right side: Status progress bar (desktop) */}
          <div className="hidden lg:flex items-center gap-3 flex-shrink-0 pt-1">
            <OrderCardStatusBar
              status={order.status}
              onReview={order.status === 'completed' ? () => onReview?.(order.id) : undefined}
              reviewed={reviewed}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
