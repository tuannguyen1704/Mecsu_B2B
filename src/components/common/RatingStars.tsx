import React from 'react';
import { Star, StarHalf } from 'lucide-react';
import { cn } from '@utils';

interface RatingStarsProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  className?: string;
}

export function RatingStars({
  rating,
  maxRating = 5,
  size = 'md',
  showValue = false,
  className,
}: RatingStarsProps) {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const iconSize = sizeClasses[size];

  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < maxRating; i++) {
      if (i < fullStars) {
        stars.push(
          <Star
            key={i}
            size={12}
            className={cn(iconSize, 'fill-yellow-400 text-yellow-400')}
          />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <StarHalf
            key={i}
            size={12}
            className={cn(iconSize, 'fill-yellow-400 text-yellow-400')}
          />
        );
      } else {
        stars.push(
          <Star
            key={i}
            size={12}
            className={cn(iconSize, 'fill-slate-200 text-slate-200')}
          />
        );
      }
    }

    return stars;
  };

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <div className="flex">{renderStars()}</div>
      {showValue && (
        <span className="text-sm font-medium text-slate-600 ml-1">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
