import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Heart,
  Trash2,
  ShoppingCart,
  FileText,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Check,
  Calendar,
  Package,
  Tag,
  AlertCircle,
} from 'lucide-react';
import { AccountLayout } from './components/AccountLayout';
import { WishlistItem, wishlistStorage } from '../../services/wishlistStorage';
import { cn } from '../../lib/utils';
import { Toast } from '../../components/ui/Toast';

type FilterChip = 'all' | 'in_stock' | 'out_of_stock' | 'has_discount';
type SortOption = 'newest' | 'oldest' | 'name_asc' | 'name_desc';

const filterChips: { value: FilterChip; label: string }[] = [
  { value: 'all', label: 'Tất cả' },
  { value: 'in_stock', label: 'Còn hàng' },
  { value: 'out_of_stock', label: 'Hết hàng' },
  { value: 'has_discount', label: 'Có giá' },
];

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'newest', label: 'Mới lưu nhất' },
  { value: 'oldest', label: 'Cũ nhất' },
  { value: 'name_asc', label: 'Tên A-Z' },
  { value: 'name_desc', label: 'Tên Z-A' },
];

// ─── StatCard ───────────────────────────────────────────────────────────────
interface StatCardProps {
  icon: React.ReactNode;
  value: number;
  label: string;
  accentColor: string;
  bgColor: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, value, label, accentColor, bgColor }) => (
  <div className="bg-white rounded-2xl border border-[#E5EAF2] p-4 hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between">
      <div>
        <p className={cn('text-3xl font-bold mb-1', accentColor)}>{value}</p>
        <p className="text-sm text-slate-500">{label}</p>
      </div>
      <div className={cn('p-2.5 rounded-lg', bgColor)}>{icon}</div>
    </div>
  </div>
);

// ─── WishlistCard ───────────────────────────────────────────────────────────
interface WishlistCardProps {
  item: WishlistItem;
  isSelected: boolean;
  multiSelectMode: boolean;
  onSelect: (id: string) => void;
  onRemove: (productId: string) => void;
  onAddToCart: (item: WishlistItem) => void;
  onRequestQuote: (item: WishlistItem) => void;
}

const WishlistCard: React.FC<WishlistCardProps> = ({
  item,
  isSelected,
  multiSelectMode,
  onSelect,
  onRemove,
  onAddToCart,
  onRequestQuote,
}) => {
  const stockConfig = {
    in_stock: { label: 'Còn hàng', bg: 'bg-emerald-50', color: 'text-emerald-700', dot: 'bg-emerald-500' },
    out_of_stock: { label: 'Hết hàng', bg: 'bg-red-50', color: 'text-red-600', dot: 'bg-red-400' },
    limited: { label: 'Sắp hết', bg: 'bg-amber-50', color: 'text-amber-700', dot: 'bg-amber-400' },
  };
  const stock = stockConfig[item.stockStatus] || stockConfig['in_stock'];

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('vi-VN').format(price);

  return (
    <div
      className={cn(
        'bg-white rounded-2xl border p-5 transition-all duration-200',
        'hover:-translate-y-0.5 hover:shadow-lg',
        isSelected ? 'border-[#173E75] ring-1 ring-[#173E75]/20' : 'border-[#E5EAF2]'
      )}
    >
      <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr_auto] gap-4 lg:gap-5">
        {/* Checkbox (multi-select mode) */}
        <div className="flex items-start pt-1">
          <button
            onClick={() => onSelect(item.productId)}
            className={cn(
              'w-5 h-5 rounded border-2 flex items-center justify-center transition-all',
              multiSelectMode
                ? isSelected
                  ? 'bg-[#173E75] border-[#173E75]'
                  : 'border-gray-300 hover:border-[#173E75]'
                : 'opacity-0 pointer-events-none'
            )}
          >
            {isSelected && <Check size={12} className="text-white" />}
          </button>
        </div>

        {/* Product Image */}
        <div className="flex gap-4">
          <div className="w-24 h-24 lg:w-28 lg:h-28 rounded-xl bg-slate-50 border border-slate-100 overflow-hidden flex-shrink-0">
            {item.image ? (
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package size={32} className="text-slate-300" />
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="min-w-0 flex-1 space-y-2">
            <h3 className="text-sm font-medium text-slate-800 line-clamp-2 leading-snug">
              {item.name}
            </h3>
            <div className="space-y-1 text-xs text-slate-500">
              <p>SKU: <span className="font-medium text-slate-700">{item.sku}</span></p>
              <p>Nhà sản xuất: <span className="font-medium text-slate-700">{item.brand}</span></p>
              <p className="flex items-center gap-1">
                <Calendar size={11} />
                Đã lưu: {item.savedDate}
              </p>
              <span className={cn('inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium', stock.bg, stock.color)}>
                <span className={cn('w-1.5 h-1.5 rounded-full', stock.dot)} />
                {stock.label}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex lg:flex-col items-start lg:items-end justify-between lg:justify-start gap-3 lg:min-w-[180px]">
          {/* Price */}
          <div className="text-right lg:w-full">
            {item.originalPrice && item.originalPrice > item.price ? (
              <>
                <p className="text-xs text-slate-400 line-through">
                  {formatPrice(item.originalPrice)}đ
                </p>
                <p className="text-base font-bold text-[#173E75]">
                  {formatPrice(item.price)}đ
                </p>
                <span className="inline-block mt-0.5 px-1.5 py-0.5 bg-red-50 text-red-600 text-[10px] font-semibold rounded">
                  -{item.discount}%
                </span>
              </>
            ) : (
              <p className="text-xs text-slate-500">Giá: <span className="font-semibold text-slate-700">Liên hệ</span></p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex lg:flex-col items-center gap-2 w-full lg:w-auto">
            <button
              onClick={() => onAddToCart(item)}
              disabled={item.stockStatus === 'out_of_stock'}
              className={cn(
                'flex-1 lg:w-full h-11 px-4 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-colors',
                item.stockStatus === 'out_of_stock'
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-[#173E75] hover:bg-[#1a4a8a] text-white'
              )}
            >
              <ShoppingCart size={14} />
              Thêm vào giỏ
            </button>
            <button
              onClick={() => onRequestQuote(item)}
              className="flex-1 lg:w-full h-11 px-4 rounded-lg text-xs font-medium border border-[#173E75] text-[#173E75] hover:bg-blue-50 transition-colors flex items-center justify-center gap-1.5"
            >
              <FileText size={14} />
              Yêu cầu báo giá
            </button>
          </div>

          {/* Icon actions */}
          <div className="flex items-center gap-1 lg:hidden">
            <button
              onClick={() => onRemove(item.productId)}
              className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
              title="Xóa khỏi yêu thích"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Desktop icon actions — below */}
      <div className="hidden lg:flex justify-end mt-3 pt-3 border-t border-slate-100">
        <button
          onClick={() => onRemove(item.productId)}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors"
        >
          <Trash2 size={14} />
          Xóa
        </button>
      </div>
    </div>
  );
};

// ─── Sticky Action Bar ──────────────────────────────────────────────────────
interface StickyActionBarProps {
  selectedCount: number;
  onAddToCart: () => void;
  onRequestQuote: () => void;
  onRemove: () => void;
  onClearSelection: () => void;
}

const StickyActionBar: React.FC<StickyActionBarProps> = ({
  selectedCount,
  onAddToCart,
  onRequestQuote,
  onRemove,
  onClearSelection,
}) => (
  <div className="sticky bottom-4 z-10 mx-auto max-w-3xl">
    <div className="bg-white rounded-2xl border border-[#E5EAF2] shadow-lg px-4 py-3">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-sm font-medium text-slate-700">
          <span className="font-bold text-[#173E75]">{selectedCount}</span> sản phẩm đã chọn
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            onClick={onAddToCart}
            className="h-10 px-4 bg-[#173E75] hover:bg-[#1a4a8a] text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <ShoppingCart size={14} />
            Thêm vào giỏ
          </button>
          <button
            onClick={onRequestQuote}
            className="h-10 px-4 bg-white border border-[#173E75] text-[#173E75] hover:bg-blue-50 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <FileText size={14} />
            Yêu cầu báo giá
          </button>
          <button
            onClick={onRemove}
            className="h-10 px-4 bg-white border border-red-200 text-red-500 hover:bg-red-50 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <Trash2 size={14} />
            Xóa
          </button>
          <button
            onClick={onClearSelection}
            className="h-10 px-3 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg text-xs font-medium transition-colors"
          >
            Hủy
          </button>
        </div>
      </div>
    </div>
  </div>
);

// ─── Main Page ──────────────────────────────────────────────────────────────
export default function WishlistPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterChip, setFilterChip] = useState<FilterChip>('all');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [multiSelectMode, setMultiSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' as 'success' | 'error' });

  const userId = 'demo-user'; // replace with real user id from useAuth

  useEffect(() => {
    wishlistStorage.initDemoWishlist(userId);
    setItems(wishlistStorage.getWishlist(userId));
  }, []);

  const itemsPerPage = 8;

  const filteredItems = useMemo(() => {
    let result = [...items];

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.sku.toLowerCase().includes(q) ||
          item.brand.toLowerCase().includes(q)
      );
    }

    // Filter chip
    if (filterChip === 'in_stock') {
      result = result.filter((item) => item.stockStatus === 'in_stock' || item.stockStatus === 'limited');
    } else if (filterChip === 'out_of_stock') {
      result = result.filter((item) => item.stockStatus === 'out_of_stock');
    } else if (filterChip === 'has_discount') {
      result = result.filter((item) => Boolean(item.discount));
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.savedDate).getTime() - new Date(a.savedDate).getTime();
      } else if (sortBy === 'oldest') {
        return new Date(a.savedDate).getTime() - new Date(b.savedDate).getTime();
      } else if (sortBy === 'name_asc') {
        return a.name.localeCompare(b.name, 'vi');
      } else {
        return b.name.localeCompare(a.name, 'vi');
      }
    });

    return result;
  }, [items, searchQuery, filterChip, sortBy]);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const stats = useMemo(() => {
    return {
      total: items.length,
      inStock: items.filter((i) => i.stockStatus === 'in_stock' || i.stockStatus === 'limited').length,
      hasDiscount: items.filter((i) => Boolean(i.discount)).length,
    };
  }, [items]);

  const handleRemove = (productId: string) => {
    wishlistStorage.removeFromWishlist(userId, productId);
    setItems((prev) => prev.filter((i) => i.productId !== productId));
    setToast({ show: true, message: 'Đã xóa sản phẩm khỏi danh sách yêu thích', type: 'success' });
  };

  const handleAddToCart = (item: WishlistItem) => {
    if (item.stockStatus === 'out_of_stock') return;
    setToast({ show: true, message: `${item.name} đã được thêm vào giỏ hàng`, type: 'success' });
  };

  const handleRequestQuote = (item: WishlistItem) => {
    navigate('/tai-khoan/bao-gia');
  };

  const handleAddAllToCart = () => {
    const available = items.filter((i) => i.stockStatus !== 'out_of_stock');
    if (available.length === 0) return;
    setToast({ show: true, message: `${available.length} sản phẩm đã được thêm vào giỏ hàng`, type: 'success' });
  };

  const toggleMultiSelect = () => {
    if (multiSelectMode) {
      setSelectedIds(new Set());
    }
    setMultiSelectMode((prev) => !prev);
  };

  const handleSelectItem = (productId: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(productId)) {
        next.delete(productId);
      } else {
        next.add(productId);
      }
      return next;
    });
  };

  const handleRemoveSelected = () => {
    wishlistStorage.removeMultipleFromWishlist(userId, Array.from(selectedIds));
    setItems((prev) => prev.filter((i) => !selectedIds.has(i.productId)));
    setSelectedIds(new Set());
    setMultiSelectMode(false);
    setToast({ show: true, message: 'Đã xóa các sản phẩm đã chọn', type: 'success' });
  };

  const handleAddSelectedToCart = () => {
    const available = items.filter(
      (i) => selectedIds.has(i.productId) && i.stockStatus !== 'out_of_stock'
    );
    if (available.length === 0) {
      setToast({ show: true, message: 'Không có sản phẩm nào có thể thêm vào giỏ', type: 'error' });
      return;
    }
    setToast({ show: true, message: `${available.length} sản phẩm đã được thêm vào giỏ hàng`, type: 'success' });
    setSelectedIds(new Set());
    setMultiSelectMode(false);
  };

  const handleRequestQuoteSelected = () => {
    navigate('/tai-khoan/bao-gia');
  };

  const handleCloseToast = () => setToast((prev) => ({ ...prev, show: false }));

  return (
    <AccountLayout>
      <div className="space-y-3">
        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">
              Danh sách yêu thích
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Theo dõi các sản phẩm bạn quan tâm và thêm nhanh vào giỏ hàng hoặc yêu cầu báo giá.
            </p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={toggleMultiSelect}
              className={cn(
                'flex-1 sm:flex-none h-11 px-4 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-colors',
                multiSelectMode
                  ? 'bg-slate-100 text-slate-700 border border-gray-300'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-slate-50'
              )}
            >
              {multiSelectMode ? 'Hủy chọn' : 'Chọn nhiều'}
            </button>
            <button
              onClick={handleAddAllToCart}
              disabled={items.length === 0}
              className="flex-1 sm:flex-none h-11 px-5 bg-[#173E75] hover:bg-[#1a4a8a] text-white rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingCart size={16} />
              Thêm tất cả vào giỏ
            </button>
          </div>
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <StatCard
            icon={<Heart size={20} className="text-[#173E75]" />}
            value={stats.total}
            label="Sản phẩm đã lưu"
            accentColor="text-[#173E75]"
            bgColor="bg-[#F6F8FB]"
          />
          <StatCard
            icon={<Package size={20} className="text-emerald-600" />}
            value={stats.inStock}
            label="Có sẵn hàng"
            accentColor="text-emerald-600"
            bgColor="bg-emerald-50"
          />
          <StatCard
            icon={<Tag size={20} className="text-red-500" />}
            value={stats.hasDiscount}
            label="Có giá ưu đãi"
            accentColor="text-red-500"
            bgColor="bg-red-50"
          />
        </div>

        {/* ── Search & Filter Bar ── */}
        <div className="bg-white rounded-2xl border border-[#E5EAF2] p-3 lg:p-4">
          <div className="flex flex-col lg:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm yêu thích..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-[#E5EAF2] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3d82c4]/20 focus:border-[#3d82c4] transition-all"
              />
            </div>

            {/* Filter chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0">
              {filterChips.map((chip) => (
                <button
                  key={chip.value}
                  onClick={() => {
                    setFilterChip(chip.value);
                    setCurrentPage(1);
                  }}
                  className={cn(
                    'px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-colors',
                    filterChip === chip.value
                      ? 'bg-[#173E75] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  )}
                >
                  {chip.label}
                </button>
              ))}
            </div>

            {/* Sort */}
            <div className="relative min-w-[160px]">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-[#E5EAF2] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3d82c4]/20 focus:border-[#3d82c4] transition-all appearance-none cursor-pointer pr-10"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* ── Product List ── */}
        {filteredItems.length > 0 ? (
          <>
            <div className="space-y-3">
              {paginatedItems.map((item) => (
                <WishlistCard
                  key={item.id}
                  item={item}
                  isSelected={selectedIds.has(item.productId)}
                  multiSelectMode={multiSelectMode}
                  onSelect={handleSelectItem}
                  onRemove={handleRemove}
                  onAddToCart={handleAddToCart}
                  onRequestQuote={handleRequestQuote}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-wrap items-center justify-between gap-4 bg-white rounded-2xl border border-[#E5EAF2] px-4 lg:px-5 py-3">
                <p className="text-sm text-slate-500">
                  Hiển thị {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredItems.length)} của {filteredItems.length} sản phẩm
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
                          ? 'bg-[#173E75] text-white border-[#D9E5F6]'
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
          <div className="bg-white rounded-2xl border border-[#E5EAF2] p-10 lg:p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
              <Heart size={32} className="text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-700 mb-2">
              {searchQuery || filterChip !== 'all'
                ? 'Không tìm thấy sản phẩm'
                : 'Bạn chưa có sản phẩm yêu thích'}
            </h3>
            <p className="text-sm text-slate-500 mb-6 max-w-md mx-auto">
              {searchQuery || filterChip !== 'all'
                ? 'Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc.'
                : 'Lưu sản phẩm để theo dõi giá, tồn kho và gửi báo giá nhanh hơn.'}
            </p>
            {searchQuery || filterChip !== 'all' ? (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setFilterChip('all');
                }}
                className="h-11 px-6 bg-[#173E75] hover:bg-[#1a4a8a] text-white rounded-xl text-sm font-medium transition-colors"
              >
                Xóa bộ lọc
              </button>
            ) : (
              <button
                onClick={() => navigate('/')}
                className="h-11 px-6 bg-[#173E75] hover:bg-[#1a4a8a] text-white rounded-xl text-sm font-medium transition-colors"
              >
                Khám phá sản phẩm
              </button>
            )}
          </div>
        )}

        {/* ── Sticky Action Bar ── */}
        {multiSelectMode && selectedIds.size > 0 && (
          <StickyActionBar
            selectedCount={selectedIds.size}
            onAddToCart={handleAddSelectedToCart}
            onRequestQuote={handleRequestQuoteSelected}
            onRemove={handleRemoveSelected}
            onClearSelection={() => {
              setSelectedIds(new Set());
              setMultiSelectMode(false);
            }}
          />
        )}

        {/* ── Toast ── */}
        {toast.show && (
          <Toast message={toast.message} type={toast.type} onClose={handleCloseToast} />
        )}
      </div>
    </AccountLayout>
  );
}
