import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@utils';

interface StarRatingInputProps {
  value: number;
  onChange: (rating: number) => void;
  error?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeConfig = {
  sm: { star: 20, gap: 1 },
  md: { star: 28, gap: 2 },
  lg: { star: 36, gap: 3 },
};

export function StarRatingInput({
  value,
  onChange,
  error,
  size = 'md',
}: StarRatingInputProps) {
  const [hoverValue, setHoverValue] = useState(0);
  const config = sizeConfig[size];

  const handleClick = (rating: number) => {
    onChange(rating);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight' && value < 5) {
      onChange(value + 1);
    } else if (e.key === 'ArrowLeft' && value > 1) {
      onChange(value - 1);
    }
  };

  return (
    <div className="space-y-2">
      <div
        className="flex items-center gap-1 w-fit"
        onMouseLeave={() => setHoverValue(0)}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="slider"
        aria-valuenow={value}
        aria-valuemin={1}
        aria-valuemax={5}
        aria-label="Chọn số sao đánh giá"
      >
        {[1, 2, 3, 4, 5].map((star) => {
          const isActive = hoverValue ? star <= hoverValue : star <= value;
          return (
            <button
              key={star}
              type="button"
              onClick={() => handleClick(star)}
              onMouseEnter={() => setHoverValue(star)}
              className={cn(
                'p-1 rounded transition-all duration-150',
                'hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#ed6c2d]/30',
                isActive ? 'text-[#ed6c2d]' : 'text-slate-300'
              )}
              style={{ transition: 'transform 0.15s ease' }}
            >
              <Star
                size={config.star}
                fill={isActive ? 'currentColor' : 'none'}
                strokeWidth={1.5}
              />
            </button>
          );
        })}
      </div>
      <p className="text-[13px] text-[#565959]">
        {value === 0 && !hoverValue && 'Chọn số sao để đánh giá'}
        {hoverValue === 1 && 'Không hài lòng'}
        {hoverValue === 2 && 'Không hài lòng'}
        {hoverValue === 3 && 'Bình thường'}
        {hoverValue === 4 && 'Hài lòng'}
        {hoverValue === 5 && 'Rất hài lòng'}
        {value > 0 && !hoverValue && (
          <span className="text-[#ed6c2d] font-medium">
            {value === 1 && ' - Không hài lòng'}
            {value === 2 && ' - Không hài lòng'}
            {value === 3 && ' - Bình thường'}
            {value === 4 && ' - Hài lòng'}
            {value === 5 && ' - Rất hài lòng'}
          </span>
        )}
      </p>
      {error && (
        <p className="text-[13px] text-red-500 flex items-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}
