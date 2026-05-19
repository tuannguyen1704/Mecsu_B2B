import React from 'react';
import { Plus, PackageSearch } from 'lucide-react';
import { ReturnRequest } from '../../../types';
import { ReturnRequestCard } from './ReturnRequestCard';
import { BestSellersSlider } from './BestSellersSlider';
import { MOCK_BEST_SELLERS } from '../../../data/mockAccountData';

interface ReturnsTabProps {
  requests: ReturnRequest[];
  onViewDetails?: (requestId: string) => void;
  onCreateRequest?: (requestId: string) => void;
}

export const ReturnsTab: React.FC<ReturnsTabProps> = ({
  requests,
  onViewDetails,
  onCreateRequest,
}) => {
  const hasRequests = requests.length > 0;

  return (
    <div className="space-y-5 w-full max-w-full">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-[#E5EAF2] p-4 lg:p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="min-w-0">
            <h3 className="text-lg font-bold text-slate-800">Yêu cầu đổi/trả hàng</h3>
            <p className="text-sm text-slate-500 mt-1">
              {hasRequests 
                ? `Bạn có ${requests.length} yêu cầu đổi/trả`
                : 'Quản lý các yêu cầu đổi/trả hàng của bạn'
              }
            </p>
          </div>
          <button
            onClick={() => onCreateRequest?.('')}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#163F78] hover:bg-[#1a4a8a] text-white rounded-xl font-bold text-sm transition-colors whitespace-nowrap"
          >
            <Plus size={18} />
            Tạo yêu cầu đổi trả
          </button>
        </div>
      </div>

      {/* Content */}
      {hasRequests ? (
        <div className="space-y-4 w-full max-w-full">
          {requests.map((request) => (
            <ReturnRequestCard
              key={request.id}
              request={request}
              onViewDetails={onViewDetails}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#E5EAF2] p-8 lg:p-12">
          <div className="max-w-md mx-auto text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <PackageSearch size={40} className="text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-3">
              Bạn chưa có yêu cầu đổi trả nào
            </h3>
            <p className="text-slate-500 mb-6">
              Nếu bạn cần đổi hoặc trả sản phẩm từ đơn hàng đã nhận, hãy tạo yêu cầu đổi/trả tại đây.
            </p>
            <button
              onClick={() => onCreateRequest?.('')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#FFC72C] hover:bg-[#E8B931] text-[#111827] rounded-xl font-bold text-sm transition-colors"
            >
              <Plus size={18} />
              Tạo yêu cầu đổi trả
            </button>
          </div>
        </div>
      )}

      {/* Best Sellers Section */}
      <BestSellersSlider products={MOCK_BEST_SELLERS} />
    </div>
  );
};

export default ReturnsTab;
