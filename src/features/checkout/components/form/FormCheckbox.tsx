import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { cn } from '@utils';

interface FormCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string | React.ReactNode;
  description?: string;
  disabled?: boolean;
  className?: string;
}

export function FormCheckbox({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  className,
}: FormCheckboxProps) {
  return (
    <label
      className={cn(
        'flex items-start gap-3 cursor-pointer',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      <div className="relative mt-0.5">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => !disabled && onChange(e.target.checked)}
          className="sr-only peer"
          disabled={disabled}
        />
        <div
          className={cn(
            'w-5 h-5 border-2 rounded flex items-center justify-center transition-all',
            checked
              ? 'bg-brand-secondary border-brand-secondary'
              : 'border-slate-300',
            disabled && 'bg-slate-300'
          )}
        >
          <CheckCircle2
            size={14}
            className={cn(
              'text-white transition-opacity',
              checked ? 'opacity-100' : 'opacity-0'
            )}
          />
        </div>
      </div>
      <div className="flex-1">
        {typeof label === 'string' ? (
          <span className="text-sm font-medium text-slate-900">{label}</span>
        ) : (
          label
        )}
        {description && (
          <p className="text-xs text-slate-500 mt-0.5">{description}</p>
        )}
      </div>
    </label>
  );
}

/**
 * Switch variant
 */
interface FormSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  className?: string;
}

export function FormSwitch({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  className,
}: FormSwitchProps) {
  return (
    <label
      className={cn(
        'flex items-start gap-3 cursor-pointer',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      <div className="relative mt-0.5">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => !disabled && onChange(e.target.checked)}
          className="sr-only peer"
          disabled={disabled}
        />
        <div
          className={cn(
            'w-10 h-6 rounded-full transition-colors relative',
            checked ? 'bg-brand-secondary' : 'bg-slate-300',
            disabled && 'bg-slate-200'
          )}
        >
          <div
            className={cn(
              'absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform',
              checked ? 'translate-x-4' : 'translate-x-0.5'
            )}
          />
        </div>
      </div>
      <div className="flex-1">
        {label && (
          <span className="text-sm font-medium text-slate-900">{label}</span>
        )}
        {description && (
          <p className="text-xs text-slate-500 mt-0.5">{description}</p>
        )}
      </div>
    </label>
  );
}
