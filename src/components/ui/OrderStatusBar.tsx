import React from 'react';
import { motion } from 'framer-motion';
import { Package, CheckCircle2, Settings, Truck, BadgeCheck } from 'lucide-react';
import { OrderStatus } from '../../types';
import { cn } from '../../lib/utils';

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

interface OrderStatusBarProps {
  status: OrderStatus;
  size?: 'sm' | 'md';
  timestamps?: string[];
  accentColor?: string;
  glowColor?: string;
}

const formatTimestamp = (iso: string): string => {
  const d = new Date(iso);
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const MM = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${hh}:${mm} • ${dd}/${MM}/${yyyy}`;
};

export const OrderStatusBar: React.FC<OrderStatusBarProps> = ({
  status,
  size = 'md',
  timestamps = [],
  accentColor = '#48c774',
  glowColor = 'rgba(72, 199, 116, 0.3)',
}) => {
  const currentStepIndex = STATUS_ORDER_STEP_INDEX[status] ?? 0;
  const isCancelled = status === 'cancelled';

  const circleHeight = size === 'sm' ? 40 : 48;
  const circleWidth = size === 'sm' ? 40 : 48;
  const lineHeight = size === 'sm' ? 6 : 8;
  const lineTop = circleHeight / 2 - lineHeight / 2;

  if (isCancelled) {
    return (
      <div className={cn('flex items-center gap-2 text-red-500', size === 'sm' ? 'text-xs' : 'text-sm')}>
        <span className={cn('flex items-center gap-1.5 font-semibold', size === 'sm' ? 'text-xs' : 'text-sm')}>
          <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
          Đã huỷ
        </span>
      </div>
    );
  }

  const getIconClass = (isLit: boolean) => {
    return isLit
      ? 'w-6 h-6 md:w-7 md:h-7 text-white stroke-[2.2]'
      : 'w-6 h-6 md:w-7 md:h-7 text-slate-400 stroke-[2.2]';
  };

  return (
    <div className="w-full relative px-2">
      {/* Full-width progress line track - sits behind circles */}
      <div className="absolute left-0 right-0 z-[1]" style={{ top: lineTop, height: lineHeight }}>
        {/* Background gray line */}
        <div className="absolute inset-0 bg-slate-200 rounded-full" />

        {/* Completed + running segments */}
        {TIMELINE_STEPS.slice(0, -1).map((_, index) => {
          const isCompleted = index < currentStepIndex;
          const isRunning = index === currentStepIndex - 1;
          const isCompletedOrder = status === 'completed';

          if (!isCompleted && !isRunning) return null;

          return (
            <div
              key={`segment-${index}`}
              className="absolute top-0 h-full rounded-full overflow-hidden"
              style={{
                left: `${index * (100 / (TIMELINE_STEPS.length - 1))}%`,
                width: `${100 / (TIMELINE_STEPS.length - 1)}%`,
              }}
            >
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  backgroundColor: accentColor,
                  boxShadow: `0 0 8px ${accentColor}`,
                }}
              />

              {isRunning && !isCompletedOrder && (
                <motion.div
                  className="absolute inset-0 opacity-40 bg-repeat-x"
                  style={{
                    backgroundImage: `linear-gradient(45deg, rgba(255,255,255,0.4) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0.4) 75%, transparent 75%, transparent)`,
                    backgroundSize: '14px 14px',
                  }}
                  animate={{ backgroundPositionX: ['0px', '-28px'] }}
                  transition={{ ease: 'linear', duration: 1.2, repeat: Infinity }}
                />
              )}
              {isRunning && !isCompletedOrder && (
                <motion.div
                  className="absolute top-0 bottom-0 w-12 blur-[4px] opacity-80"
                  style={{
                    background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.9), transparent)`,
                  }}
                  animate={{ x: ['-100%', '300%'] }}
                  transition={{ ease: 'linear', duration: 1.8, repeat: Infinity }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Step items container */}
      <div className="relative flex justify-between items-start z-10">
        {TIMELINE_STEPS.map((step, index) => {
          const isCompleted = index < currentStepIndex;
          const isActive = index === currentStepIndex;
          const { Icon } = step;
          const timestamp = timestamps[index];

          return (
            <div
              key={step.id}
              className="flex flex-col items-center"
              style={{ width: circleWidth }}
            >
              {/* Icon area with fixed height */}
              <div
                className="relative flex items-center justify-center flex-shrink-0"
                style={{ height: circleHeight, width: circleWidth }}
              >
                {/* Main circle button */}
                <motion.div
                  className={cn(
                    'rounded-full flex items-center justify-center border-4 transition-all duration-300 relative',
                    isCompleted || isActive
                      ? 'text-white border-white shadow-md'
                      : 'bg-white text-slate-300 shadow-sm',
                  )}
                  style={{
                    width: circleWidth,
                    height: circleHeight,
                    backgroundColor: (isCompleted || isActive) ? accentColor : undefined,
                    boxShadow: isCompleted
                      ? `0 6px 16px ${glowColor}, inset 0 2px 4px rgba(255,255,255,0.2)`
                      : isActive
                        ? `0 10px 25px ${glowColor}, 0 0 0 3px ${accentColor}`
                        : '0 2px 6px rgba(0,0,0,0.08)',
                    zIndex: 10,
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.92 }}
                >
                  <Icon className={getIconClass(isCompleted || isActive)} />
                </motion.div>
              </div>

              {/* Labels + Timestamp below */}
              <div className="mt-3 flex flex-col items-center">
                <p
                  className="text-[13px] font-medium leading-4 text-center whitespace-nowrap transition-colors duration-300"
                  style={{
                    color: isCompleted ? accentColor : isActive ? '#0F172A' : '#64748B',
                  }}
                >
                  {step.label}
                </p>

                <p
                  className="text-[11px] leading-3 mt-1.5 text-center font-mono"
                  style={{ color: '#94A3B8' }}
                >
                  {isActive
                    ? 'Đang thực hiện'
                    : timestamp
                      ? formatTimestamp(timestamp)
                      : '--'}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderStatusBar;
