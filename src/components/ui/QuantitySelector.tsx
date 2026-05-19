import React from 'react';
import { Plus, Minus } from 'lucide-react';
import { cn } from '@utils';

interface QuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 9999,
  disabled = false,
  size = 'md',
  showLabel = false,
  className,
}: QuantitySelectorProps) {
  const handleDecrement = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  const handleIncrement = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value, 10);
    if (!isNaN(newValue) && newValue >= min && newValue <= max) {
      onChange(newValue);
    } else if (e.target.value === '') {
      onChange(min);
    }
  };

  const sizeClasses = {
    sm: {
      button: 'w-7 h-7',
      input: 'w-10 h-7 text-xs',
      icon: 12,
    },
    md: {
      button: 'w-8 h-8',
      input: 'w-12 h-8 text-sm',
      icon: 14,
    },
    lg: {
      button: 'w-10 h-10',
      input: 'w-14 h-10 text-base',
      icon: 16,
    },
  };

  const classes = sizeClasses[size];

  return (
    <div className={cn('flex items-center', className)}>
      {showLabel && (
        <span className="text-sm font-medium text-slate-700 mr-3">Số lượng:</span>
      )}
      <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white">
        {/* Decrement Button */}
        <button
          onClick={handleDecrement}
          disabled={disabled || value <= min}
          className={cn(
            classes.button,
            'flex items-center justify-center hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors border-r border-slate-200 disabled:opacity-50 disabled:cursor-not-allowed'
          )}
          aria-label="Decrease quantity"
        >
          <Minus size={classes.icon} strokeWidth={2} />
        </button>

        {/* Input */}
        <input
          type="text"
          value={value}
          onChange={handleInputChange}
          disabled={disabled}
          className={cn(
            classes.input,
            'flex items-center justify-center font-semibold text-center text-slate-900 bg-slate-50/50 border-none outline-none focus:bg-white disabled:opacity-50 disabled:cursor-not-allowed'
          )}
        />

        {/* Increment Button */}
        <button
          onClick={handleIncrement}
          disabled={disabled || value >= max}
          className={cn(
            classes.button,
            'flex items-center justify-center hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors border-l border-slate-200 disabled:opacity-50 disabled:cursor-not-allowed'
          )}
          aria-label="Increase quantity"
        >
          <Plus size={classes.icon} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}

/**
 * Compact quantity selector for inline use
 */
export function InlineQuantitySelector({
  value,
  onChange,
  min = 1,
  max = 9999,
}: Omit<QuantitySelectorProps, 'size' | 'showLabel' | 'disabled'>) {
  return (
    <QuantitySelector
      value={value}
      onChange={onChange}
      min={min}
      max={max}
      size="sm"
      showLabel={false}
    />
  );
}
