import React from 'react';
import { LucideIcon, Package, ShoppingCart, FileX, AlertTriangle } from 'lucide-react';
import { cn } from '@utils';
import Button from './Button';

interface EmptyStateProps {
  icon?: LucideIcon;
  iconComponent?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'outline';
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({
  icon: Icon,
  iconComponent,
  title,
  description,
  action,
  secondaryAction,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-12 px-4', className)}>
      {/* Icon */}
      <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-6">
        {iconComponent ? (
          iconComponent
        ) : Icon ? (
          <Icon size={40} className="text-slate-400" />
        ) : (
          <Package size={40} className="text-slate-400" />
        )}
      </div>

      {/* Title */}
      <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>

      {/* Description */}
      {description && (
        <p className="text-sm text-slate-500 text-center max-w-md mb-6">
          {description}
        </p>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        {action && (
          <Button
            variant={action.variant || 'primary'}
            onClick={action.onClick}
          >
            {action.label}
          </Button>
        )}
        {secondaryAction && (
          <Button
            variant="outline"
            onClick={secondaryAction.onClick}
          >
            {secondaryAction.label}
          </Button>
        )}
      </div>
    </div>
  );
}

/**
 * Empty cart specific component
 */
export function EmptyCartState({
  onContinueShopping,
  onBrowseCatalog,
}: {
  onContinueShopping: () => void;
  onBrowseCatalog?: () => void;
}) {
  return (
    <EmptyState
      icon={ShoppingCart}
      title="Giỏ hàng trống"
      description="Bạn chưa thêm sản phẩm nào vào giỏ hàng. Hãy tiếp tục mua sắm để tìm sản phẩm phù hợp."
      action={{
        label: 'Tiếp tục mua sắm',
        onClick: onContinueShopping,
        variant: 'primary',
      }}
      secondaryAction={
        onBrowseCatalog
          ? {
              label: 'Xem danh mục sản phẩm',
              onClick: onBrowseCatalog,
            }
          : undefined
      }
    />
  );
}

/**
 * No results state for search/filter
 */
export function NoResultsState({
  searchQuery,
  onClearFilters,
}: {
  searchQuery?: string;
  onClearFilters: () => void;
}) {
  return (
    <EmptyState
      icon={FileX}
      title={searchQuery ? `Không tìm thấy kết quả cho "${searchQuery}"` : 'Không có kết quả'}
      description={
        searchQuery
          ? 'Thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc để xem tất cả sản phẩm.'
          : 'Hãy thử điều chỉnh bộ lọc hoặc tìm kiếm với từ khóa khác.'
      }
      action={{
        label: 'Xóa bộ lọc',
        onClick: onClearFilters,
        variant: 'outline',
      }}
    />
  );
}

/**
 * Error state component
 */
interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = 'Đã xảy ra lỗi',
  message = 'Vui lòng thử lại sau hoặc liên hệ bộ phận hỗ trợ.',
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-12 px-4', className)}>
      {/* Icon */}
      <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mb-6">
        <AlertTriangle size={40} className="text-red-400" />
      </div>

      {/* Title */}
      <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>

      {/* Message */}
      {message && (
        <p className="text-sm text-slate-500 text-center max-w-md mb-6">{message}</p>
      )}

      {/* Retry Button */}
      {onRetry && (
        <Button variant="outline" onClick={onRetry}>
          Thử lại
        </Button>
      )}
    </div>
  );
}
