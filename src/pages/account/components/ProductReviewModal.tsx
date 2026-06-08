import React, { useState, useRef, useCallback } from 'react';
import { Star, Camera, X } from 'lucide-react';
import { Modal } from '../../../components/ui/Modal';
import { cn } from '@utils';

interface Product {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  price: number;
  image: string;
}

interface ProductReviewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (productId: string, review: ReviewData) => void;
}

interface ReviewData {
  rating: number;
  tags: string[];
  text: string;
  images: string[];
  recommend: boolean | null;
  reviewedAt: string;
}

const FEEDBACK_TAGS = [
  'Chất lượng tốt',
  'Mô tả chính xác',
  'Bền bỉ',
  'Dễ lắp đặt',
  'Giao hàng nhanh',
  'Đóng gói kỹ',
  'Giá hợp lý',
  'Dịch vụ chuyên nghiệp',
];

const RATING_LABELS: Record<number, string> = {
  1: 'Rất không hài lòng',
  2: 'Không hài lòng',
  3: 'Bình thường',
  4: 'Hài lòng',
  5: 'Rất hài lòng',
};

export function ProductReviewModal({
  product,
  isOpen,
  onClose,
  onSubmit,
}: ProductReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [reviewText, setReviewText] = useState('');
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [recommend, setRecommend] = useState<boolean | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetForm = useCallback(() => {
    setRating(0);
    setHoverRating(0);
    setSelectedTags([]);
    setReviewText('');
    setUploadedImages([]);
    setRecommend(null);
  }, []);

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = () => {
    if (!product || rating === 0) return;
    onSubmit(product.id, {
      rating,
      tags: selectedTags,
      text: reviewText,
      images: uploadedImages,
      recommend,
      reviewedAt: new Date().toLocaleDateString('vi-VN'),
    });
    resetForm();
    onClose();
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;
    const remaining = 5 - uploadedImages.length;
    Array.from(files)
      .slice(0, remaining)
      .forEach(file => {
        const reader = new FileReader();
        reader.onload = e => {
          const result = e.target?.result as string;
          setUploadedImages(prev => [...prev, result]);
        };
        reader.readAsDataURL(file);
      });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const isValid = rating > 0;

  if (!product) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="lg"
      showCloseButton={true}
      closeOnOverlayClick={true}
      closeOnEscape={true}
    >
      {/* Header */}
      <div className="border-b border-slate-100 pb-4 mb-6">
        <h2 className="text-lg md:text-xl font-bold text-slate-900">
          Đánh giá sản phẩm
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Chia sẻ trải nghiệm của bạn để giúp khách hàng khác có quyết định tốt hơn
        </p>
      </div>

      {/* Product Info */}
      <div className="bg-slate-50 rounded-xl p-4 mb-6 flex items-center gap-4">
        <div className="w-16 h-16 bg-slate-100 rounded-xl flex items-center justify-center flex-shrink-0">
          {product.image ? (
            <img src={product.image} alt={product.name} className="w-full h-full object-cover rounded-xl" />
          ) : (
            <Camera size={24} className="text-slate-300" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-slate-900 text-sm line-clamp-2">{product.name}</h3>
          <p className="text-xs text-slate-500 mt-0.5">SKU: {product.sku}</p>
        </div>
      </div>

      {/* Star Rating */}
      <div className="text-center mb-6">
        <p className="text-sm font-medium text-slate-700 mb-3">
          Bạn hài lòng với sản phẩm này chứ?
        </p>
        <div className="flex items-center justify-center gap-1">
          {[1, 2, 3, 4, 5].map(star => (
            <button
              key={star}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setRating(star)}
              className="p-1 transition-transform hover:scale-110"
            >
              <Star
                size={36}
                className={cn(
                  'transition-colors',
                  (hoverRating || rating) >= star
                    ? 'fill-[#F5B301] text-[#F5B301]'
                    : 'text-slate-300'
                )}
              />
            </button>
          ))}
        </div>
        <p className="text-sm font-medium mt-2 min-h-[20px]">
          {(hoverRating || rating) > 0 ? (
            <span className="text-[#B8860B]">{RATING_LABELS[hoverRating || rating]}</span>
          ) : (
            <span className="text-slate-400">Chọn số sao</span>
          )}
        </p>
      </div>

      {/* Quick Feedback Tags */}
      <div className="mb-6">
        <p className="text-sm font-medium text-slate-700 mb-3">
          Bạn thích điều gì ở sản phẩm?
        </p>
        <div className="flex flex-wrap gap-2">
          {FEEDBACK_TAGS.map(tag => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={cn(
                'px-3 py-1.5 rounded-full text-sm font-medium transition-all border',
                selectedTags.includes(tag)
                  ? 'bg-[#E6C24A] border-[#E6C24A] text-[#173E75]'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
              )}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Review Text */}
      <div className="mb-6">
        <p className="text-sm font-medium text-slate-700 mb-3">
          Chi tiết đánh giá
        </p>
        <div className="relative">
          <textarea
            value={reviewText}
            onChange={e => setReviewText(e.target.value.slice(0, 1000))}
            placeholder="Chia sẻ về chất lượng sản phẩm, mức độ hữu ích, độ bền, đóng gói và trải nghiệm tổng thể của bạn..."
            className="w-full h-36 p-3 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder:text-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-[#173E75]/20 focus:border-[#173E75] transition-all"
          />
          <span className="absolute bottom-3 right-3 text-xs text-slate-400">
            {reviewText.length} / 1000
          </span>
        </div>
      </div>

      {/* Image Upload */}
      <div className="mb-6">
        <p className="text-sm font-medium text-slate-700 mb-3">
          Thêm hình ảnh (không bắt buộc)
        </p>
        <div
          onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            'border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all',
            isDragging
              ? 'border-[#173E75] bg-[#173E75]/5'
              : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
          )}
        >
          <Camera size={24} className="mx-auto text-slate-400 mb-2" />
          <p className="text-sm font-medium text-slate-600">
            Kéo thả hình ảnh vào đây hoặc click để tải lên
          </p>
          <p className="text-xs text-slate-400 mt-1">JPG / PNG, tối đa 5 hình</p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png"
          multiple
          onChange={e => handleFileSelect(e.target.files)}
          className="hidden"
        />
        {uploadedImages.length > 0 && (
          <div className="flex gap-3 mt-3 flex-wrap">
            {uploadedImages.map((img, idx) => (
              <div key={idx} className="relative group">
                <img
                  src={img}
                  alt={`Upload ${idx + 1}`}
                  className="w-20 h-20 object-cover rounded-xl border border-slate-200"
                />
                <button
                  onClick={() => removeImage(idx)}
                  className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recommendation */}
      <div className="mb-8">
        <p className="text-sm font-medium text-slate-700 mb-3">
          Bạn có giới thiệu sản phẩm này cho người khác không?
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => setRecommend(true)}
            className={cn(
              'flex-1 py-3 rounded-xl border-2 text-sm font-semibold transition-all',
              recommend === true
                ? 'border-[#173E75] bg-[#173E75]/5 text-[#173E75]'
                : 'border-slate-200 text-slate-500 hover:border-slate-300'
            )}
          >
            Có, chắc chắn rồi
          </button>
          <button
            onClick={() => setRecommend(false)}
            className={cn(
              'flex-1 py-3 rounded-xl border-2 text-sm font-semibold transition-all',
              recommend === false
                ? 'border-red-500 bg-red-50 text-red-600'
                : 'border-slate-200 text-slate-500 hover:border-slate-300'
            )}
          >
            Không
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
        <button
          onClick={handleClose}
          className="px-6 py-2.5 border border-slate-200 rounded-xl text-slate-700 font-medium hover:bg-slate-50 transition-colors"
        >
          Hủy
        </button>
        <button
          onClick={handleSubmit}
          disabled={!isValid}
          className={cn(
            'px-6 py-2.5 rounded-xl font-semibold transition-all',
            isValid
              ? 'bg-[#E6C24A] text-[#173E75] hover:bg-[#D4B13E]'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          )}
        >
          Gửi đánh giá
        </button>
      </div>
    </Modal>
  );
}
