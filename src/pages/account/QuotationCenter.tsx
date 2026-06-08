import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Search,
  FileText,
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  Clock,
  Package,
  Users,
  CheckCircle,
  XCircle,
  ArrowRight,
} from 'lucide-react';
import { AccountLayout } from './components/AccountLayout';
import { RequestQuotationModal } from './components/RequestQuotationModal';
import { Quotation, QuotationStatus, quotationStatusConfig } from '../../types/quotation';
import { mockQuotations, addQuotation } from './quotationData';
import { cn } from '../../lib/utils';
import { Toast } from '../../components/ui/Toast';

type FilterStatus = 'all' | QuotationStatus;
type SortOption = 'newest' | 'oldest';

const filterOptions: { value: FilterStatus; label: string }[] = [
  { value: 'all', label: 'Tất cả trạng thái' },
  { value: 'pending', label: 'Đang xử lý' },
  { value: 'processing', label: 'Chờ phản hồi' },
  { value: 'sent', label: 'Đã gửi' },
  { value: 'accepted', label: 'Đã chấp nhận' },
  { value: 'expired', label: 'Hết hạn' },
];

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'newest', label: 'Mới nhất' },
  { value: 'oldest', label: 'Cũ nhất' },
];

const statusBadgeStyles: Record<QuotationStatus, { bg: string; color: string }> = {
  pending: { bg: 'bg-[#FFF7D6]', color: 'text-[#9A6A00]' },
  processing: { bg: 'bg-[#FFF7D6]', color: 'text-[#9A6A00]' },
  sent: { bg: 'bg-[#E8F1FB]', color: 'text-[#163F78]' },
  accepted: { bg: 'bg-[#DCFCE7]', color: 'text-[#166534]' },
  expired: { bg: 'bg-[#FEE2E2]', color: 'text-[#991B1B]' },
};

interface StatCardProps {
  icon: React.ReactNode;
  value: number;
  label: string;
  variant?: 'default' | 'processing' | 'responded' | 'expired';
}

const StatCard: React.FC<StatCardProps> = ({ icon, value, label, variant = 'default' }) => {
  const variantStyles = {
    default: 'text-[#163F78]',
    processing: 'text-[#9A6A00]',
    responded: 'text-[#163F78]',
    expired: 'text-[#991B1B]',
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E5EAF2] p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className={cn('text-3xl font-bold mb-1', variantStyles[variant])}>{value}</p>
          <p className="text-sm text-slate-500">{label}</p>
        </div>
        <div className={cn('p-2.5 rounded-lg', variant === 'default' ? 'bg-[#F6F8FB]' : variant === 'processing' ? 'bg-[#FFF7D6]' : variant === 'responded' ? 'bg-[#E8F1FB]' : 'bg-[#FEE2E2]')}>
          {icon}
        </div>
      </div>
    </div>
  );
};

interface QuotationCardProps {
  quotation: Quotation;
  onViewDetails: (id: string) => void;
}

const QuotationCard: React.FC<QuotationCardProps> = ({ quotation, onViewDetails }) => {
  const config = quotationStatusConfig[quotation.status];
  const badgeStyle = statusBadgeStyles[quotation.status];

  const productSummary = quotation.items.slice(0, 2).map((item) => item.name).join(', ');
  const moreProducts = quotation.items.length > 2 ? `...+${quotation.items.length - 2} sản phẩm` : '';
  const totalQuantity = quotation.items.reduce((sum, item) => sum + item.quantity, 0);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price);
  };

  return (
    <div
      className="bg-white rounded-2xl border border-[#E5EAF2] p-4 lg:p-5 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 cursor-pointer group"
      onClick={() => onViewDetails(quotation.id)}
    >
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-3 lg:gap-4">
        {/* Left Content */}
        <div className="space-y-3">
          {/* Header: Code + Date */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-semibold text-[#163F78]">{quotation.code}</span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <Calendar size={12} />
              {quotation.requestDate}
            </span>
          </div>

          {/* Product Summary */}
          <div>
            <div className="flex items-start gap-2">
              <Package size={16} className="text-slate-400 mt-0.5 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-800 line-clamp-2">
                  {productSummary}
                  {moreProducts && <span className="text-slate-400 ml-1">{moreProducts}</span>}
                </p>
              </div>
            </div>
          </div>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
            <span>{quotation.items.length} sản phẩm</span>
            <span className="w-1 h-1 rounded-full bg-slate-300" />
            <span>{totalQuantity} số lượng</span>
            {quotation.expiryDate && (
              <>
                <span className="w-1 h-1 rounded-full bg-slate-300" />
                <span className="flex items-center gap-1">
                  <Clock size={12} />
                  Hạn: {quotation.expiryDate}
                </span>
              </>
            )}
          </div>

          {/* Sales Rep & Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#E8F1FB] flex items-center justify-center">
                <Users size={14} className="text-[#163F78]" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-700">{quotation.salesRep.name}</p>
                <p className="text-[10px] text-slate-400">{quotation.salesRep.role}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Content - Status & Actions */}
        <div className="flex flex-col items-end justify-between gap-3 lg:min-w-[180px]">
          {/* Status Badge */}
          <span className={cn('px-3 py-1.5 rounded-lg text-xs font-medium', badgeStyle.bg, badgeStyle.color)}>
            {config.label}
          </span>

          {/* Total */}
          {quotation.total > 0 && (
            <div className="text-right">
              <p className="text-xs text-slate-400">Tổng tiền</p>
              <p className="text-sm font-bold text-slate-800">{formatPrice(quotation.total)}đ</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2 w-full lg:flex-col lg:items-end">
            <div className="flex items-center gap-2 w-full lg:w-auto">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onViewDetails(quotation.id);
                }}
                className="flex-1 lg:flex-none h-9 px-4 bg-[#163F78] hover:bg-[#1a4a8a] text-white rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
              >
                <Eye size={14} />
                <span>Xem chi tiết</span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  // Download PDF action
                }}
                className="h-9 w-9 lg:w-auto lg:px-4 border border-[#E5EAF2] hover:bg-slate-50 rounded-xl text-slate-600 flex items-center justify-center transition-colors"
                title="Tải PDF"
              >
                <Download size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function QuotationCenter() {
  const navigate = useNavigate();
  const [quotations, setQuotations] = useState<Quotation[]>(mockQuotations);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [dateFilter, setDateFilter] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
    show: false,
    message: '',
    type: 'success',
  });

  const itemsPerPage = 6;

  const filteredQuotations = useMemo(() => {
    let result = [...quotations];

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (q) =>
          q.code.toLowerCase().includes(query) ||
          q.items.some((item) => item.name.toLowerCase().includes(query) || item.sku.toLowerCase().includes(query)) ||
          q.requestName?.toLowerCase().includes(query)
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      result = result.filter((q) => q.status === statusFilter);
    }

    // Sort
    result.sort((a, b) => {
      const dateA = new Date(a.requestDate.split('/').reverse().join('-')).getTime();
      const dateB = new Date(b.requestDate.split('/').reverse().join('-')).getTime();
      return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [quotations, searchQuery, statusFilter, sortBy]);

  const totalPages = Math.ceil(filteredQuotations.length / itemsPerPage);
  const paginatedQuotations = filteredQuotations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const stats = useMemo(() => {
    return {
      total: quotations.length,
      processing: quotations.filter((q) => q.status === 'pending' || q.status === 'processing').length,
      responded: quotations.filter((q) => q.status === 'sent' || q.status === 'accepted').length,
      expired: quotations.filter((q) => q.status === 'expired').length,
    };
  }, [quotations]);

  const handleViewDetails = (id: string) => {
    navigate(`/tai-khoan/bao-gia/${id}`);
  };

  const handleQuotationSuccess = (newQuotation: Quotation) => {
    addQuotation(newQuotation);
    setQuotations([newQuotation, ...quotations]);
    setIsModalOpen(false);
    setToast({ show: true, message: 'Gửi yêu cầu báo giá thành công', type: 'success' });
  };

  const handleCloseToast = () => {
    setToast((prev) => ({ ...prev, show: false }));
  };

  return (
    <AccountLayout>
      <div className="space-y-3">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">Báo giá</h1>
            <p className="text-sm text-slate-500 mt-1">
              Quản lý yêu cầu báo giá, theo dõi trạng thái và phản hồi từ MECsu.
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#163F78] hover:bg-[#1a4a8a] text-white rounded-xl px-5 py-2.5 flex items-center justify-center gap-2 font-medium transition-colors w-full sm:w-auto"
          >
            <Plus size={18} />
            <span>Tạo yêu cầu báo giá</span>
          </button>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard
            icon={<FileText size={20} className="text-[#163F78]" />}
            value={stats.total}
            label="Tất cả báo giá"
            variant="default"
          />
          <StatCard
            icon={<Clock size={20} className="text-[#9A6A00]" />}
            value={stats.processing}
            label="Đang xử lý"
            variant="processing"
          />
          <StatCard
            icon={<CheckCircle size={20} className="text-[#163F78]" />}
            value={stats.responded}
            label="Đã phản hồi"
            variant="responded"
          />
          <StatCard
            icon={<XCircle size={20} className="text-[#991B1B]" />}
            value={stats.expired}
            label="Hết hạn"
            variant="expired"
          />
        </div>

        {/* Filter/Search Bar */}
        <div className="bg-white rounded-2xl border border-[#E5EAF2] p-3 lg:p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Search Input */}
            <div className="relative md:col-span-2 lg:col-span-1">
              <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm theo mã báo giá, sản phẩm..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-[#E5EAF2] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3d82c4]/20 focus:border-[#3d82c4] transition-all"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value as FilterStatus);
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-2.5 bg-slate-50 border border-[#E5EAF2] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3d82c4]/20 focus:border-[#3d82c4] transition-all appearance-none cursor-pointer pr-10"
              >
                {filterOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>

            {/* Date Filter */}
            <div className="relative">
              <Calendar size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => {
                  setDateFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-[#E5EAF2] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3d82c4]/20 focus:border-[#3d82c4] transition-all cursor-pointer"
              />
            </div>

            {/* Sort */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-[#E5EAF2] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3d82c4]/20 focus:border-[#3d82c4] transition-all appearance-none cursor-pointer pr-10"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Quotation List */}
        {paginatedQuotations.length > 0 ? (
          <>
            <div className="space-y-3">
              {paginatedQuotations.map((quotation) => (
                <QuotationCard
                  key={quotation.id}
                  quotation={quotation}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-wrap items-center justify-between gap-4 bg-white rounded-2xl border border-[#E5EAF2] px-4 lg:px-5 py-3">
                <p className="text-sm text-slate-500">
                  Hiển thị {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredQuotations.length)} của {filteredQuotations.length} báo giá
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
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
                        'w-10 h-10 rounded-lg text-sm font-medium transition-colors border',
                        currentPage === page
                          ? 'bg-[#163F78] text-white border-[#D9E5F6]'
                          : 'text-slate-600 hover:bg-slate-100 border-transparent'
                      )}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight size={20} className="text-slate-600" />
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          /* Empty State */
          <div className="bg-white rounded-2xl border border-[#E5EAF2] p-8 lg:p-10 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
              <FileText size={32} className="text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-700 mb-2">Chưa có yêu cầu báo giá</h3>
            <p className="text-sm text-slate-500 mb-5 max-w-md mx-auto">
              Tạo yêu cầu báo giá để MECsu hỗ trợ bạn nhanh hơn.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-[#163F78] hover:bg-[#1a4a8a] text-white rounded-xl px-6 py-2.5 inline-flex items-center gap-2 font-medium transition-colors"
            >
              <Plus size={18} />
              <span>Tạo yêu cầu báo giá</span>
            </button>
          </div>
        )}

        {/* Request Quotation Modal */}
        <RequestQuotationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleQuotationSuccess}
        />

        {/* Toast Notification */}
        {toast.show && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={handleCloseToast}
          />
        )}
      </div>
    </AccountLayout>
  );
}
