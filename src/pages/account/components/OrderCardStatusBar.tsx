import React from 'react';
import { Package, CheckCircle2, Settings, Truck, BadgeCheck, XCircle, Star, CheckCheck } from 'lucide-react';
import { OrderStatus } from '../../../types';
import { cn } from '../../../lib/utils';

const TIMELINE_STEPS = [
  { id: 0, label: 'Đã đặt', Icon: Package },
  { id: 1, label: 'Xác nhận', Icon: CheckCircle2 },
  { id: 2, label: 'Xử lý', Icon: Settings },
  { id: 3, label: 'Giao hàng', Icon: Truck },
  { id: 4, label: 'Hoàn tất', Icon: BadgeCheck },
];

const STATUS_ORDER_STEP_INDEX: Record<OrderStatus, number> = {
  pending:    0,
  processing: 2,
  shipping:   3,
  completed:  4,
  cancelled: -1,
};

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending:    'Đã đặt hàng',
  processing: 'Đang xử lý',
  shipping:   'Đang giao hàng',
  completed:  'Hoàn tất',
  cancelled:  'Đã huỷ',
};

const STATUS_TEXT_COLORS: Record<OrderStatus, string> = {
  pending:    'text-blue-600',
  processing: 'text-amber-600',
  shipping:   'text-blue-600',
  completed:  'text-green-600',
  cancelled:  'text-red-600',
};

interface OrderCardStatusBarProps {
  status: OrderStatus;
  accentColor?: string;
  onReview?: () => void;
  reviewed?: boolean;
}

export const OrderCardStatusBar: React.FC<OrderCardStatusBarProps> = ({
  status,
  accentColor = '#48c774',
  onReview,
  reviewed = false,
}) => {
  const currentStepIndex = STATUS_ORDER_STEP_INDEX[status] ?? 0;
  const isCancelled = status === 'cancelled';

  const circleSize = 24;
  const lineHeight = 3;
  const lineWidth = 20;

  if (isCancelled) {
    return (
      <div className="flex flex-col items-end gap-1.5">
        <span className={cn('text-xs font-semibold tracking-wide uppercase', STATUS_TEXT_COLORS[status])}>
          {STATUS_LABELS[status]}
        </span>
        <div className="flex items-center gap-2 text-slate-500">
          <XCircle size={18} className="text-red-400" strokeWidth={2} />
          <div className="w-16 h-1 rounded-full bg-slate-200" />
          <div className="w-16 h-1 rounded-full bg-slate-200" />
          <div className="w-16 h-1 rounded-full bg-slate-200" />
          <div className="w-16 h-1 rounded-full bg-slate-200" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-end gap-2">
      {/* Status text and review button */}
      <div className="flex items-center gap-4 -translate-x-2">
        {status === 'completed' && (
          reviewed ? (
            <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold
              bg-[#EAF8EF] text-[#36A853] border border-[#BFE8CC]">
              <CheckCheck size={14} strokeWidth={2.5} />
              Đã đánh giá
            </span>
          ) : onReview ? (
            <button
              onClick={(e) => { e.stopPropagation(); onReview(); }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold
                bg-[#FFF8E1] text-[#B88700] border border-[#F5D97A]
                hover:bg-[#FFF3C4] hover:border-[#EAB308] hover:-translate-y-px
                active:scale-[0.98] transition-all duration-200 shadow-sm"
            >
              <Star size={14} strokeWidth={2.5} />
              Đánh giá
            </button>
          ) : null
        )}
        <span className={cn('text-xs font-semibold tracking-wide uppercase', STATUS_TEXT_COLORS[status])}>
          {STATUS_LABELS[status]}
        </span>
      </div>

      {/* Progress stepper */}
      <div className="flex items-center gap-1">
        {TIMELINE_STEPS.map((step, index) => {
          const isCompleted = index < currentStepIndex;
          const isActive = index === currentStepIndex;
          const { Icon } = step;

          return (
            <React.Fragment key={step.id}>
              {/* Circle indicator */}
              <div
                className="flex items-center justify-center rounded-full transition-all duration-300 flex-shrink-0"
                style={{
                  width: circleSize,
                  height: circleSize,
                  backgroundColor: isCompleted ? accentColor : isActive ? accentColor : '#F1F5F9',
                  boxShadow: isCompleted
                    ? `0 2px 8px rgba(72, 199, 116, 0.35)`
                    : isActive
                      ? `0 0 0 3px rgba(72, 199, 116, 0.2), 0 2px 8px rgba(72, 199, 116, 0.25)`
                      : 'inset 0 1px 2px rgba(0,0,0,0.06)',
                }}
              >
                {isCompleted ? (
                  <CheckCircle2 size={14} className="text-white" strokeWidth={2.5} />
                ) : (
                  <Icon
                    size={12}
                    className={isActive ? 'text-white' : 'text-slate-400'}
                    strokeWidth={2.5}
                  />
                )}
              </div>

              {/* Line connector (except after last step) */}
              {index < TIMELINE_STEPS.length - 1 && (
                <div
                  className="rounded-full flex-shrink-0"
                  style={{
                    height: lineHeight,
                    width: lineWidth,
                    backgroundColor: index < currentStepIndex ? accentColor : '#E2E8F0',
                    transition: 'background-color 0.3s ease',
                  }}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default OrderCardStatusBar;
