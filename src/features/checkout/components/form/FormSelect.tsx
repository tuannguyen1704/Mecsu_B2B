import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Search, X, CheckCircle2 } from 'lucide-react';
import { cn } from '@utils';

export interface SelectOption {
  id: string;
  name: string;
}

interface FormSelectProps {
  label?: string;
  options: SelectOption[];
  value: string;
  onChange: (id: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  searchable?: boolean;
  required?: boolean;
}

export function FormSelect({
  label,
  options,
  value,
  onChange,
  placeholder = 'Chọn...',
  disabled = false,
  error,
  searchable = true,
  required,
}: FormSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedOption = options.find((o) => o.id === value);

  // Filter options based on search
  const filteredOptions = options.filter((o) =>
    o.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Close on escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen]);

  const handleSelect = useCallback(
    (optionId: string) => {
      onChange(optionId);
      setIsOpen(false);
      setSearchTerm('');
    },
    [onChange]
  );

  return (
    <div className="space-y-2 relative" ref={dropdownRef}>
      {label && (
        <label
          className={cn(
            'text-[10px] font-bold uppercase tracking-widest ml-1',
            error ? 'text-red-500' : 'text-slate-500'
          )}
        >
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={cn(
          'w-full px-4 py-3.5 bg-white border rounded-xl text-sm font-medium flex items-center justify-between transition-all outline-none',
          error
            ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/10'
            : disabled
              ? 'opacity-50 cursor-not-allowed bg-slate-50 border-slate-200'
              : 'border-slate-200 hover:border-brand-secondary focus:border-brand-secondary focus:ring-2 focus:ring-brand-secondary/10'
        )}
      >
        <span className={value ? 'text-slate-900' : 'text-slate-400'}>
          {selectedOption ? selectedOption.name : placeholder}
        </span>
        <ChevronDown
          size={16}
          className={cn(
            'text-slate-400 transition-transform duration-200',
            isOpen ? 'rotate-180' : ''
          )}
        />
      </button>

      {error && <p className="text-[11px] text-red-500 ml-1">{error}</p>}

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && !disabled && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute z-[300] top-full left-0 w-full mt-2 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden"
          >
            {/* Search */}
            {searchable && (
              <div className="p-3 border-b border-slate-100 flex items-center gap-2 bg-slate-50/50">
                <Search size={14} className="text-slate-400" />
                <input
                  ref={inputRef}
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Tìm kiếm..."
                  className="flex-1 bg-transparent border-none outline-none text-xs font-medium text-slate-900"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            )}

            {/* Options List */}
            <div className="max-h-[200px] overflow-y-auto py-1">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => handleSelect(option.id)}
                    className={cn(
                      'w-full text-left px-4 py-2.5 text-sm font-medium transition-colors flex items-center justify-between',
                      value === option.id
                        ? 'bg-brand-secondary/5 text-brand-secondary'
                        : 'text-slate-700 hover:bg-slate-50'
                    )}
                  >
                    <span>{option.name}</span>
                    {value === option.id && (
                      <CheckCircle2 size={14} className="text-brand-secondary" />
                    )}
                  </button>
                ))
              ) : (
                <div className="px-4 py-6 text-center text-xs font-medium text-slate-400">
                  Không tìm thấy
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
