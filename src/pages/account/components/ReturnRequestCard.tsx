import React from 'react';
import { Eye, Package, ArrowRightLeft } from 'lucide-react';
import { ReturnRequest, ReturnStatus } from '../../../types';
import { Badge } from '../../../components/ui/Badge';
import { cn } from '../../../lib/utils';

interface ReturnRequestCardProps {
  request: ReturnRequest;
  onViewDetails?: (requestId: string) => void;
}

const statusConfig: Record<ReturnStatus, { label: string; variant: 'warning' | 'info' | 'success' | 'danger' }> = {
  reviewing: { label: 'Đang xem xét', variant: 'warning' },
  approved: { label: 'Đã duyệt', variant: 'info' },
  completed: { label: 'Hoàn tất', variant: 'success' },
  rejected: { label: 'Từ chối', variant: 'danger' },
};

export const ReturnRequestCard: React.FC<ReturnRequestCardProps> = ({ 
  request, 
  onViewDetails 
}) => {
  const status = statusConfig[request.status];

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('vi-VN', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E5EAF2] shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden min-w-0 w-full">
      {/* Card Header */}
      <div className="p-4 lg:p-6 border-b border-[#E5EAF2] bg-slate-50/50">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-4 min-w-0">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-sm text-slate-500">Mã yêu cầu</span>
              <span className="font-bold text-[#163F78] truncate">{request.returnCode}</span>
            </div>
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-sm text-slate-500">Mã đơn hàng</span>
              <span className="font-bold text-slate-700 truncate">{request.orderCode}</span>
            </div>
          </div>
          <Badge variant={status.variant} size="lg">
            {status.label}
          </Badge>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 lg:p-6 min-w-0">
        {/* Date & Reason */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="flex items-start gap-3 min-w-0">
            <Package size={18} className="text-slate-400 mt-0.5 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-slate-500 mb-1">Ngày tạo yêu cầu</p>
              <p className="text-sm font-medium text-slate-800">{formatDate(request.createdDate)}</p>
            </div>
          </div>
          <div className="flex items-start gap-3 min-w-0">
            <ArrowRightLeft size={18} className="text-slate-400 mt-0.5 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-slate-500 mb-1">Lý do đổi/trả</p>
              <p className="text-sm font-medium text-slate-800 line-clamp-2">{request.reason}</p>
            </div>
          </div>
        </div>

        {/* Action */}
        <div className="pt-4 border-t border-[#E5EAF2] flex justify-end">
          <button
            onClick={() => onViewDetails?.(request.id)}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#163F78] hover:bg-[#1a4a8a] text-white rounded-xl font-bold text-sm transition-colors"
          >
            <Eye size={16} />
            Xem chi tiết
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReturnRequestCard;
