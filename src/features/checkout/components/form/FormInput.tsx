import React from 'react';
import { cn } from '@utils';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
}

export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, hint, required, className, id, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              'text-[10px] font-bold uppercase tracking-widest ml-1',
              error ? 'text-red-500' : 'text-slate-500'
            )}
          >
            {label}
            {required && <span className="text-red-500 ml-0.5">*</span>}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full px-4 py-3.5 bg-white border rounded-xl text-sm font-medium outline-none transition-all',
            error
              ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/10'
              : 'border-slate-200 focus:border-brand-secondary focus:ring-2 focus:ring-brand-secondary/10',
            props.disabled && 'opacity-50 cursor-not-allowed bg-slate-50',
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-[11px] text-red-500 ml-1 flex items-center gap-1">
            {error}
          </p>
        )}
        {hint && !error && (
          <p className="text-[11px] text-slate-400 ml-1">{hint}</p>
        )}
      </div>
    );
  }
);

FormInput.displayName = 'FormInput';

/**
 * Textarea variant
 */
interface FormTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
}

export const FormTextarea = React.forwardRef<
  HTMLTextAreaElement,
  FormTextareaProps
>(
  (
    { label, error, hint, required, className, id, ...props },
    ref
  ) => {
    const textareaId =
      id || `textarea-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={textareaId}
            className={cn(
              'text-[10px] font-bold uppercase tracking-widest ml-1',
              error ? 'text-red-500' : 'text-slate-500'
            )}
          >
            {label}
            {required && <span className="text-red-500 ml-0.5">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            'w-full px-4 py-3.5 bg-white border rounded-xl text-sm font-medium outline-none transition-all resize-none',
            error
              ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/10'
              : 'border-slate-200 focus:border-brand-secondary focus:ring-2 focus:ring-brand-secondary/10',
            props.disabled && 'opacity-50 cursor-not-allowed bg-slate-50',
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-[11px] text-red-500 ml-1 flex items-center gap-1">
            {error}
          </p>
        )}
        {hint && !error && (
          <p className="text-[11px] text-slate-400 ml-1">{hint}</p>
        )}
      </div>
    );
  }
);

FormTextarea.displayName = 'FormTextarea';
