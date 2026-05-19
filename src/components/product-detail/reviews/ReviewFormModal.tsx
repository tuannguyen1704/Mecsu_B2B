import React, { useState } from 'react';
import { Modal } from '@components/ui/Modal';
import { StarRatingInput } from './StarRatingInput';
import { ReviewMediaUploader } from './ReviewMediaUploader';
import { cn } from '@utils';

interface ReviewFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ReviewFormData) => void;
  productName?: string;
  isVerifiedPurchase?: boolean;
  userName?: string;
}

export interface ReviewFormData {
  rating: number;
  title: string;
  comment: string;
  media: Array<{ file: File; preview: string; type: 'image' | 'video' }>;
}

interface FormErrors {
  rating?: string;
  comment?: string;
}

export function ReviewFormModal({
  isOpen,
  onClose,
  onSubmit,
  productName = 'Sản phẩm này',
  isVerifiedPurchase = false,
  userName = 'Khách hàng',
}: ReviewFormModalProps) {
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [media, setMedia] = useState<Array<{ file: File; preview: string; type: 'image' | 'video' }>>([]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (rating === 0) {
      newErrors.rating = 'Vui lòng chọn số sao đánh giá';
    }

    if (comment.trim().length < 20) {
      newErrors.comment = 'Nội dung đánh giá phải có ít nhất 20 ký tự';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    onSubmit({
      rating,
      title: title.trim() || 'Không có tiêu đề',
      comment: comment.trim(),
      media,
    });

    // Reset form
    setRating(0);
    setTitle('');
    setComment('');
    setMedia([]);
    setErrors({});
    setIsSubmitting(false);
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setRating(0);
      setTitle('');
      setComment('');
      setMedia([]);
      setErrors({});
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Viết đánh giá sản phẩm"
      size="xl"
      showCloseButton
      closeOnOverlayClick={!isSubmitting}
      closeOnEscape={!isSubmitting}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* User and Product Info */}
        <div className="pb-4 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <p className="text-[14px] text-[#565959]">
              Đánh giá cho:{' '}
              <span className="font-medium text-[#0F1111]">{productName}</span>
            </p>
            {isVerifiedPurchase && (
              <span className="text-[12px] text-[#B12704] font-medium bg-red-50 px-2 py-1 rounded">
                Đã mua hàng
              </span>
            )}
          </div>
        </div>

        {/* Star Rating */}
        <div>
          <label className="block text-[14px] font-medium text-[#0F1111] mb-2">
            Xếp hạng của bạn <span className="text-red-500">*</span>
          </label>
          <StarRatingInput
            value={rating}
            onChange={setRating}
            error={errors.rating}
            size="lg"
          />
        </div>

        {/* Review Title */}
        <div>
          <label
            htmlFor="review-title"
            className="block text-[14px] font-medium text-[#0F1111] mb-2"
          >
            Tiêu đề đánh giá
          </label>
          <input
            id="review-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Tóm tắt trải nghiệm của bạn"
            maxLength={200}
            className={cn(
              'w-full px-4 py-2.5 border rounded-lg text-[14px] transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-[#ed6c2d]/30 focus:border-[#ed6c2d]',
              'placeholder:text-slate-400',
              errors.title ? 'border-red-400' : 'border-slate-300 hover:border-slate-400'
            )}
          />
          <p className="text-[11px] text-[#767676] mt-1">
            {title.length}/200 ký tự
          </p>
        </div>

        {/* Review Comment */}
        <div>
          <label
            htmlFor="review-comment"
            className="block text-[14px] font-medium text-[#0F1111] mb-2"
          >
            Nội dung đánh giá <span className="text-red-500">*</span>
          </label>
          <textarea
            id="review-comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
            rows={5}
            maxLength={2000}
            className={cn(
              'w-full px-4 py-3 border rounded-lg text-[14px] resize-none transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-[#ed6c2d]/30 focus:border-[#ed6c2d]',
              'placeholder:text-slate-400',
              errors.comment ? 'border-red-400 bg-red-50' : 'border-slate-300 hover:border-slate-400'
            )}
          />
          <div className="flex justify-between items-center mt-1">
            {errors.comment ? (
              <p className="text-[13px] text-red-500 flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {errors.comment}
              </p>
            ) : (
              <p className="text-[11px] text-[#767676]">
                Tối thiểu 20 ký tự
              </p>
            )}
            <p className="text-[11px] text-[#767676]">
              {comment.length}/2000 ký tự
            </p>
          </div>
        </div>

        {/* Media Uploader */}
        <div>
          <label className="block text-[14px] font-medium text-[#0F1111] mb-2">
            Hình ảnh / Video
            <span className="font-normal text-[#565959] ml-1">(tùy chọn)</span>
          </label>
          <ReviewMediaUploader
            media={media}
            onChange={setMedia}
            maxFiles={5}
          />
        </div>

        {/* Guidelines Notice */}
        <div className="bg-slate-50 rounded-lg p-4">
          <p className="text-[12px] text-[#565959] leading-relaxed">
            <strong className="text-[#0F1111]">Lưu ý:</strong> Đánh giá của bạn sẽ được kiểm
            duyệt trước khi hiển thị. Vui lòng không sử dụng từ ngữ tục, phản đồ,
            hoặc thông tin cá nhân của người khác.
          </p>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className={cn(
              'px-6 py-2.5 border border-slate-300 rounded-lg text-[14px] font-medium',
              'hover:bg-slate-50 transition-colors',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={cn(
              'px-8 py-2.5 bg-[#ed6c2d] text-white rounded-lg text-[14px] font-medium',
              'hover:bg-[#d65a1f] transition-colors',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'flex items-center gap-2'
            )}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Đang gửi...
              </>
            ) : (
              'Gửi đánh giá'
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
