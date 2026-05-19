import React from 'react';
import { Star, ThumbsUp, ThumbsDown, Film } from 'lucide-react';
import { cn } from '@utils';

export interface Review {
  id: string;
  userName: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  variant: string;
  verifiedPurchase: boolean;
  status: 'approved' | 'pending';
  media: string[];
  helpfulCount: number;
  notHelpfulCount: number;
}

interface ReviewCardProps {
  review: Review;
  onHelpful?: (id: string) => void;
  onNotHelpful?: (id: string) => void;
}

function getInitials(name: string): string {
  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

function getAvatarColor(name: string): string {
  const colors = [
    'bg-blue-100 text-blue-600',
    'bg-green-100 text-green-600',
    'bg-amber-100 text-amber-600',
    'bg-rose-100 text-rose-600',
    'bg-purple-100 text-purple-600',
    'bg-cyan-100 text-cyan-600',
    'bg-orange-100 text-orange-600',
    'bg-teal-100 text-teal-600',
  ];
  const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
  return colors[index];
}

export function ReviewCard({ review, onHelpful, onNotHelpful }: ReviewCardProps) {
  const initials = getInitials(review.userName);
  const avatarColor = getAvatarColor(review.userName);

  return (
    <div className="space-y-3 py-6 border-b border-slate-100 last:border-b-0">
      {/* Header: Avatar, Name, Rating */}
      <div className="flex items-start gap-3">
        <div
          className={cn(
            'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-[14px] font-semibold',
            avatarColor
          )}
        >
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[14px] font-medium text-[#0F1111]">{review.userName}</span>
            {review.status === 'pending' && (
              <span className="px-2 py-0.5 text-[11px] font-medium bg-amber-50 text-amber-600 border border-amber-200 rounded-full">
                Đang chờ duyệt
              </span>
            )}
          </div>

          {/* Rating Stars */}
          <div className="flex items-center gap-1.5 mt-1">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={14}
                  fill={star <= review.rating ? '#ed6c2d' : 'none'}
                  className={star <= review.rating ? 'text-[#ed6c2d]' : 'text-slate-300'}
                  strokeWidth={1.5}
                />
              ))}
            </div>
            <span className="text-[13px] font-bold text-[#0F1111]">{review.title}</span>
          </div>
        </div>
      </div>

      {/* Meta: Date and Variant */}
      <div className="flex items-center gap-2 text-[12px] text-[#565959] flex-wrap">
        <span>Đánh giá vào {review.date}</span>
        {review.variant && (
          <>
            <span className="text-slate-300">|</span>
            <span>{review.variant}</span>
          </>
        )}
        {review.verifiedPurchase && (
          <>
            <span className="text-slate-300">|</span>
            <span className="text-[#B12704] font-bold">Đã mua hàng</span>
          </>
        )}
      </div>

      {/* Comment Content */}
      <p className="text-[14px] text-[#0F1111] leading-relaxed">{review.comment}</p>

      {/* Media Preview */}
      {review.media && review.media.length > 0 && (
        <div className="flex gap-2 mt-2">
          {review.media.map((img, index) => (
            <div
              key={index}
              className="w-20 h-20 rounded-sm border border-slate-200 overflow-hidden cursor-zoom-in hover:border-[#ed6c2d] transition-colors"
            >
              <img
                src={img}
                alt={`Hình ảnh đánh giá ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center gap-4 pt-2">
        {review.status === 'approved' ? (
          <>
            <button
              onClick={() => onHelpful?.(review.id)}
              className={cn(
                'px-4 py-1.5 border rounded-lg text-[13px] transition-all duration-150',
                'hover:border-[#ed6c2d] hover:text-[#ed6c2d] hover:bg-[#ed6c2d]/5',
                'flex items-center gap-1.5'
              )}
            >
              <ThumbsUp size={14} />
              Hữu ích
              {review.helpfulCount > 0 && (
                <span className="text-[#565959]">({review.helpfulCount})</span>
              )}
            </button>
            <button
              onClick={() => onNotHelpful?.(review.id)}
              className={cn(
                'px-4 py-1.5 border border-slate-300 rounded-lg text-[13px] text-[#565959] transition-all duration-150',
                'hover:border-slate-400 hover:text-slate-600 hover:bg-slate-50',
                'flex items-center gap-1.5'
              )}
            >
              <ThumbsDown size={14} />
              Không hữu ích
              {review.notHelpfulCount > 0 && (
                <span className="text-slate-400">({review.notHelpfulCount})</span>
              )}
            </button>
          </>
        ) : (
          <span className="text-[12px] text-amber-600 italic">
            Đánh giá đang chờ kiểm duyệt
          </span>
        )}
      </div>
    </div>
  );
}
