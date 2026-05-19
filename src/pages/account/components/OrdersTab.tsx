import React, { useState, useMemo } from 'react';
import { Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { Order, OrderStatus } from '../../../types';
import { OrderCard } from './OrderCard';
import { BestSellersSlider } from './BestSellersSlider';
import { MOCK_BEST_SELLERS } from '../../../data/mockAccountData';
import { cn } from '../../../lib/utils';

interface OrdersTabProps {
  orders: Order[];
  onViewDetails?: (orderId: string) => void;
  onReorder?: (orderId: string) => void;
  onTrackShipping?: (orderId: string) => void;
}

type FilterStatus = 'all' | OrderStatus;

const filterOptions: { value: FilterStatus; label: string }[] = [
  { value: 'all', label: 'Tất cả' },
  { value: 'processing', label: 'Đang xử lý' },
  { value: 'shipping', label: 'Đang giao' },
  { value: 'completed', label: 'Hoàn tất' },
  { value: 'cancelled', label: 'Đã huỷ' },
];

export const OrdersTab: React.FC<OrdersTabProps> = ({
  orders,
  onViewDetails,
  onReorder,
  onTrackShipping,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterStatus>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredOrders = useMemo(() => {
    let result = orders;
    
    // Filter by status
    if (activeFilter !== 'all') {
      result = result.filter(order => order.status === activeFilter);
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(order => 
        order.orderCode.toLowerCase().includes(query) ||
        order.items.some(item => item.name.toLowerCase().includes(query))
      );
    }
    
    return result;
  }, [orders, activeFilter, searchQuery]);

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleFilterChange = (filter: FilterStatus) => {
    setActiveFilter(filter);
    setCurrentPage(1);
  };

  const getStatusCount = (status: FilterStatus) => {
    if (status === 'all') return orders.length;
    return orders.filter(order => order.status === status).length;
  };

  return (
    <div className="space-y-5 w-full max-w-full">
      {/* Search & Filter */}
      <div className="bg-white rounded-2xl border border-[#E5EAF2] p-4 lg:p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1 min-w-0">
            <div className="relative">
              <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm theo mã đơn hàng, sản phẩm..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full min-w-0 pl-12 pr-4 py-3 bg-slate-50 border border-[#E5EAF2] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#163F78]/20 focus:border-[#163F78] transition-all"
              />
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            {filterOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleFilterChange(option.value)}
                className={cn(
                  "px-3 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap",
                  activeFilter === option.value
                    ? "bg-[#163F78] text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                )}
              >
                {option.label}
                <span className="ml-1.5 text-xs opacity-70">({getStatusCount(option.value)})</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Orders List */}
      {paginatedOrders.length > 0 ? (
        <div className="space-y-4 w-full max-w-full">
          {paginatedOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onViewDetails={onViewDetails}
              onReorder={onReorder}
              onTrackShipping={onTrackShipping}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#E5EAF2] p-8 lg:p-12 text-center">
          <Filter size={48} className="mx-auto text-slate-300 mb-4" />
          <h3 className="text-lg font-bold text-slate-700 mb-2">Không tìm thấy đơn hàng</h3>
          <p className="text-sm text-slate-500">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-between gap-4 bg-white rounded-2xl border border-[#E5EAF2] px-4 lg:px-6 py-4">
          <p className="text-sm text-slate-500">
            Hiển thị {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredOrders.length)} của {filteredOrders.length} đơn hàng
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={20} className="text-slate-600" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={cn(
                  "w-10 h-10 rounded-lg text-sm font-medium transition-colors",
                  currentPage === page
                    ? "bg-[#163F78] text-white"
                    : "text-slate-600 hover:bg-slate-100"
                )}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={20} className="text-slate-600" />
            </button>
          </div>
        </div>
      )}

      {/* Best Sellers Section */}
      <BestSellersSlider products={MOCK_BEST_SELLERS} />
    </div>
  );
};

export default OrdersTab;
