import React, { useState } from 'react';
import { X, ImagePlus, Star, ThumbsUp } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { Order, OrderItem } from '../../../types';

export interface ProductReview {
  itemId: string;
  rating: number;
  comment: string;
  images: string[];
}

export interface OverallReview {
  rating: number;
  comment: string;
}

interface OverallReview {
  rating: number;
  comment: string;
}

interface OrderReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  onSubmit: (reviews: ProductReview[], overallReview: OverallReview) => void;
}

const RATING_LABELS = ['Rất tệ', 'Tạm ổn', 'Bình thường', 'Tốt', 'Rất tốt'];

const StarRating: React.FC<{
  value: number;
  onChange: (rating: number) => void;
  size?: number;
}> = ({ value, onChange, size = 28 }) => {
  const [hoverValue, setHoverValue] = useState(0);

  return (
    <div className="space-y-2">
      <div
        className="flex items-center gap-1 w-fit"
        onMouseLeave={() => setHoverValue(0)}
      >
        {[1, 2, 3, 4, 5].map((star) => {
          const isActive = hoverValue ? star <= hoverValue : star <= value;
          return (
            <button
              key={star}
              type="button"
              onClick={() => onChange(star)}
              onMouseEnter={() => setHoverValue(star)}
              className="p-0.5 rounded transition-all duration-150 hover:scale-[1.12]"
              style={{ transition: 'transform 0.18s ease' }}
            >
              <Star
                size={size}
                className={isActive ? 'text-[#F6B800]' : 'text-[#D8DEE8]'}
                fill={isActive ? '#F6B800' : 'none'}
                strokeWidth={1.5}
              />
            </button>
          );
        })}
      </div>
      <p className="text-[13px] text-[#7B8BA5]">
        {hoverValue ? RATING_LABELS[hoverValue - 1] : value > 0 ? RATING_LABELS[value - 1] : ''}
      </p>
    </div>
  );
};

const ProductReviewCard: React.FC<{
  item: OrderItem;
  review: ProductReview;
  onChange: (review: ProductReview) => void;
}> = ({ item, review, onChange }) => {
  const [imagePreviews, setImagePreviews] = useState<string[]>(review.images);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newPreviews: string[] = [];
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result as string);
        if (newPreviews.length === files.length) {
          const updated = [...imagePreviews, ...newPreviews].slice(0, 5);
          setImagePreviews(updated);
          onChange({ ...review, images: updated });
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    const updated = imagePreviews.filter((_, i) => i !== index);
    setImagePreviews(updated);
    onChange({ ...review, images: updated });
  };

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-[18px] p-5 shadow-[0_8px_24px_rgba(23,62,117,0.06)]">
      {/* Product Info Row */}
      <div className="flex items-center gap-4 mb-5">
        {/* Thumbnail */}
        <div className="w-16 h-16 rounded-[14px] bg-[#F5F7FB] border border-[#EDF1F7] overflow-hidden flex-shrink-0">
          <img
            src={item.image || 'https://placehold.co/64x64/F5F7FB/7B8BA5?text=SP'}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Product details */}
        <div className="flex-1 min-w-0">
          <p className="text-[15px] font-bold text-[#243B5A] truncate">{item.name}</p>
          <p className="text-[13px] text-[#7B8BA5]">SKU: {item.sku}</p>
        </div>

        {/* Quantity badge */}
        <span className="px-[10px] py-1 bg-[#EEF4FF] text-[#173E75] text-[12px] font-semibold rounded-full whitespace-nowrap">
          x{item.quantity}
        </span>
      </div>

      {/* Star Rating */}
      <div className="mb-4">
        <StarRating value={review.rating} onChange={(r) => onChange({ ...review, rating: r })} size={28} />
      </div>

      {/* Textarea */}
      <div className="mb-4">
        <textarea
          placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
          value={review.comment}
          onChange={(e) => onChange({ ...review, comment: e.target.value })}
          className="w-full h-[88px] bg-white border border-[#E2E8F0] rounded-[14px] p-3 text-[#243B5A] text-[14px] placeholder:text-[#A0AEC0] resize-none transition-all focus:outline-none focus:border-[#4F7FC2] focus:shadow-[0_0_0_4px_rgba(79,127,194,0.12)]"
        />
      </div>

      {/* Image Upload */}
      <div className="space-y-2">
        {imagePreviews.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {imagePreviews.map((preview, idx) => (
              <div key={idx} className="relative w-16 h-16 rounded-lg overflow-hidden border border-[#E2E8F0]">
                <img src={preview} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#E5484D] text-white rounded-full flex items-center justify-center"
                >
                  <X size={10} strokeWidth={3} />
                </button>
              </div>
            ))}
          </div>
        )}
        {imagePreviews.length < 5 && (
          <label className="flex items-center justify-center gap-2 h-10 bg-[#FFF8DF] border border-dashed border-[#F2C94C] text-[#9A6A00] rounded-[12px] cursor-pointer hover:bg-[#FFF1BF] transition-colors">
            <ImagePlus size={16} className="text-[#F6B800]" />
            <span className="text-[13px] font-medium">Thêm hình ảnh</span>
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleImageUpload}
            />
          </label>
        )}
      </div>
    </div>
  );
};

const OverallOrderReviewSection: React.FC<{
  review: OverallReview;
  onChange: (review: OverallReview) => void;
}> = ({ review, onChange }) => {
  return (
    <div className="bg-gradient-to-b from-white to-[#F8FAFD] border border-[#E2E8F0] rounded-[18px] p-5">
      <h3 className="text-[16px] font-bold text-[#173E75] mb-1">Đánh giá trải nghiệm đơn hàng</h3>
      <p className="text-[13px] text-[#7B8BA5] mb-4">
        Chia sẻ cảm nhận tổng quan về quá trình đặt hàng và giao hàng
      </p>

      {/* Overall stars */}
      <div className="mb-3">
        <StarRating value={review.rating} onChange={(r) => onChange({ ...review, rating: r })} size={28} />
      </div>

      {/* Comment */}
      <textarea
        placeholder="Ví dụ: Giao hàng nhanh, đóng gói cẩn thận, nhân viên tư vấn nhiệt tình..."
        value={review.comment}
        onChange={(e) => onChange({ ...review, comment: e.target.value })}
        className="w-full h-[88px] bg-white border border-[#E2E8F0] rounded-[14px] p-3 text-[#243B5A] text-[14px] placeholder:text-[#A0AEC0] resize-none transition-all focus:outline-none focus:border-[#4F7FC2] focus:shadow-[0_0_0_4px_rgba(79,127,194,0.12)]"
      />
    </div>
  );
};

export const OrderReviewModal: React.FC<OrderReviewModalProps> = ({
  isOpen,
  onClose,
  order,
  onSubmit,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [productReviews, setProductReviews] = useState<ProductReview[]>([]);
  const [overallReview, setOverallReview] = useState<OverallReview>({ rating: 0, comment: '' });

  React.useEffect(() => {
    if (order && isOpen) {
      const initialReviews: ProductReview[] = order.items.map((item) => ({
        itemId: item.id,
        rating: 0,
        comment: '',
        images: [],
      }));
      setProductReviews(initialReviews);
      setOverallReview({ rating: 0, comment: '' });
    }
  }, [order, isOpen]);

  // Lock body scroll when modal is open
  React.useEffect(() => {
    const body = document.body;
    if (isOpen) {
      const scrollY = window.scrollY;
      body.classList.add('modal-open');
      body.style.position = 'fixed';
      body.style.top = `-${scrollY}px`;
      body.style.width = '100%';
    } else {
      const scrollY = parseInt(body.style.top || '0', 10) * -1;
      body.classList.remove('modal-open');
      body.style.position = '';
      body.style.top = '';
      body.style.width = '';
      window.scrollTo(0, scrollY);
    }
    return () => {
      body.classList.remove('modal-open');
      body.style.position = '';
      body.style.top = '';
      body.style.width = '';
    };
  }, [isOpen]);

  if (!isOpen || !order) return null;

  const handleProductReviewChange = (index: number, review: ProductReview) => {
    const updated = [...productReviews];
    updated[index] = review;
    setProductReviews(updated);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    onSubmit(productReviews, overallReview);
    setIsSubmitting(false);
    onClose();
  };

  const hasAnyRating = productReviews.some((r) => r.rating > 0) || overallReview.rating > 0;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  return (
    <div
      className="fixed inset-0 z-[400] overflow-hidden"
      style={{ backgroundColor: 'rgba(15, 23, 42, 0.38)', backdropFilter: 'blur(6px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="relative mx-auto mt-[80px] w-full max-w-[760px] max-h-[calc(100vh-120px)] bg-white rounded-[24px] shadow-[0_24px_80px_rgba(23,62,117,0.18)] border border-[#E2E8F0] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-[#EDF1F7] px-7 py-6 flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="text-[22px] font-bold text-[#173E75]">Đánh giá đơn hàng</h2>
            <p className="text-[14px] font-medium text-[#7B8BA5] mt-0.5">
              Mã đơn hàng {order.orderCode} • {formatDate(order.orderDate)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#F5F7FB] text-[#7B8BA5] hover:bg-[#EEF4FF] hover:text-[#173E75] flex items-center justify-center transition-all flex-shrink-0"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-7 bg-[#F8FAFD] space-y-4 overscroll-behavior-contain">
          {/* Product review cards */}
          {order.items.map((item, index) => (
            <ProductReviewCard
              key={item.id}
              item={item}
              review={productReviews[index] || { itemId: item.id, rating: 0, comment: '', images: [] }}
              onChange={(r) => handleProductReviewChange(index, r)}
            />
          ))}

          {/* Overall order review */}
          <OverallOrderReviewSection review={overallReview} onChange={setOverallReview} />
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 z-10 bg-white border-t border-[#EDF1F7] px-7 py-[18px] flex items-center justify-end gap-3 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="h-11 px-5 bg-[#F5F7FB] text-[#243B5A] border border-[#E2E8F0] rounded-[14px] text-[14px] font-medium hover:bg-[#EEF4FF] transition-colors"
          >
            Để sau
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting || !hasAnyRating}
            className={cn(
              'h-11 px-6 text-white rounded-[14px] text-[14px] font-bold transition-colors flex items-center gap-2',
              hasAnyRating
                ? 'bg-[#173E75] hover:bg-[#0F2F5D]'
                : 'bg-[#CBD5E1] cursor-not-allowed'
            )}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Đang gửi...
              </>
            ) : (
              <>
                <ThumbsUp size={16} />
                Gửi đánh giá
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderReviewModal;
