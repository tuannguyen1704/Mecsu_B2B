import React, { useState, useEffect } from 'react';
import { Star, ChevronDown, ChevronLeft, ChevronRight, Lock } from 'lucide-react';
import { useSupabaseImages, useAuth } from '../../../hooks';
import { ReviewCard, Review, ReviewFormData } from './ReviewCard';
import { ReviewFormModal } from './ReviewFormModal';
import { orderStorage } from '../../../services/orderStorage';
import { cn } from '@utils';

interface CurrentUser {
  id: string;
  name: string;
  isLoggedIn: boolean;
}

interface RatingBarProps {
  label: string;
  percentage: number;
  onClick: (stars: number) => void;
}

const RatingBar = ({ label, percentage, onClick }: RatingBarProps) => {
  const starCount = parseInt(label.split(' ')[0]);

  return (
    <button
      onClick={() => onClick(starCount)}
      className="w-full flex items-center gap-4 text-[14px] text-[#007185] hover:underline cursor-pointer group"
    >
      <span className="w-12 text-left">{label}</span>
      <div className="flex-1 h-5 bg-white border border-slate-300 rounded-sm overflow-hidden min-w-[200px]">
        <div
          className="h-full bg-[#ed6c2d] rounded-sm transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="w-10 text-right">{percentage}%</span>
    </button>
  );
};

interface ProductReviewsProps {
  productName?: string;
  productVariant?: string;
  productId?: string;
  currentUser?: CurrentUser;
}

export function ProductReviews({
  productName = 'Phe gài trục 65Mn MS-PRO',
  productVariant = 'Size: 36mm | Material: Steel 65Mn',
  productId = 'product-001',
  currentUser = { id: 'u001', name: 'Tuan Anh', isLoggedIn: true },
}: ProductReviewsProps) {
  const { getRandomImage } = useSupabaseImages();
  const { user, isLoggedIn } = useAuth();
  const [purchasedSkus, setPurchasedSkus] = useState<string[]>([]);
  const [userOrders, setUserOrders] = useState<any[]>([]);

  // Load purchased SKUs and orders from localStorage
  useEffect(() => {
    if (user) {
      orderStorage.initDemoOrders(user.id, user.fullName);
      const orders = orderStorage.getOrders(user.id);
      const skus = orderStorage.getPurchasedSkus(user.id);
      setUserOrders(orders);
      setPurchasedSkus(skus);
    } else {
      setUserOrders([]);
      setPurchasedSkus([]);
    }
  }, [user]);

  // Logic canReview - check order status and product match
  const canReview = React.useMemo(() => {
    if (!isLoggedIn || !user) return false;
    
    // Check xem user có order completed/delivered chứa product này không
    return userOrders.some(order => {
      const isCompleted = 
        order.status === 'completed' ||
        order.status === 'delivered';
      
      if (!isCompleted) return false;
      
      const hasProduct = order.items?.some((item: any) => 
        item.sku === productId
      );
      
      return hasProduct;
    });
  }, [isLoggedIn, user, userOrders, productId]);

  const [reviews, setReviews] = useState<Review[]>([
    {
      id: '1',
      userName: 'Tuan Anh',
      rating: 5,
      title: 'Chất lượng tuyệt vời, đúng mô tả',
      comment: 'Sản phẩm thép 65Mn rất cứng cáp, mình dùng cho trục 36mm thấy khớp hoàn toàn. Giao hàng nhanh và đóng gói kỹ. Rất tin tưởng thương hiệu MS-PRO.',
      date: '10 tháng 5, 2026',
      variant: 'Size: 36mm | Steel 65Mn',
      verifiedPurchase: true,
      status: 'approved',
      media: [getRandomImage('review_1')].filter(Boolean),
      helpfulCount: 24,
      notHelpfulCount: 2,
    },
    {
      id: '2',
      userName: 'Minh Duc',
      rating: 4,
      title: 'Dùng tốt cho cơ khí chính xác',
      comment: 'Độ dày 1.75mm đúng chuẩn DIN 471. Tuy nhiên bề mặt hơi dầu một chút, cần lau qua trước khi lắp. Tổng quan là rất tốt trong tầm giá.',
      date: '29 tháng 3, 2026',
      variant: 'Size: 36mm | Steel 65Mn',
      verifiedPurchase: true,
      status: 'approved',
      media: [],
      helpfulCount: 12,
      notHelpfulCount: 0,
    },
    {
      id: '3',
      userName: 'Hoang Nam',
      rating: 5,
      title: 'Phù hợp tiêu chuẩn kỹ thuật',
      comment: 'Tôi đã đặt hàng số lượng lớn cho xưởng. Sản phẩm đồng đều, không bị lỗi biến dạng. Rất hài lòng với dịch vụ hỗ trợ của bên bán.',
      date: '15 tháng 4, 2026',
      variant: 'Size: 36mm | Steel 65Mn',
      verifiedPurchase: true,
      status: 'approved',
      media: [getRandomImage('review_3')].filter(Boolean),
      helpfulCount: 8,
      notHelpfulCount: 1,
    },
    {
      id: '4',
      userName: 'Khanh Vy',
      rating: 4,
      title: 'Giá cả cạnh tranh, chất lượng ổn',
      comment: 'Tìm mãi mới thấy loại phe gài có độ dày chuẩn như này. Shop tư vấn nhiệt tình, đóng gói chắc chắn. Sẽ tiếp tục ủng hộ.',
      date: '2 tháng 5, 2026',
      variant: 'Size: 36mm | Steel 65Mn',
      verifiedPurchase: true,
      status: 'approved',
      media: [],
      helpfulCount: 5,
      notHelpfulCount: 0,
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showLoginToast, setShowLoginToast] = useState(false);
  const [showApprovedToast, setShowApprovedToast] = useState(false);
  const [filterStars, setFilterStars] = useState<number | null>(null);
  const [imageIndex, setImageIndex] = useState(0);
  const [showTooltip, setShowTooltip] = useState(false);

  const reviewImages = [
    getRandomImage('review_thumb_1'),
    getRandomImage('review_thumb_2'),
    getRandomImage('review_thumb_3'),
    getRandomImage('review_thumb_4'),
    getRandomImage('review_thumb_5'),
    getRandomImage('review_thumb_6'),
  ];

  const filteredReviews = filterStars
    ? reviews.filter((r) => r.rating === filterStars && r.status === 'approved')
    : reviews.filter((r) => r.status === 'approved');

  const averageRating =
    reviews.filter((r) => r.status === 'approved').length > 0
      ? (
          reviews
            .filter((r) => r.status === 'approved')
            .reduce((sum, r) => sum + r.rating, 0) /
          reviews.filter((r) => r.status === 'approved').length
        ).toFixed(1)
      : '0';

  const getStarPercentages = () => {
    const approvedReviews = reviews.filter((r) => r.status === 'approved');
    if (approvedReviews.length === 0) return { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    approvedReviews.forEach((r) => {
      counts[r.rating as keyof typeof counts]++;
    });

    return {
      5: Math.round((counts[5] / approvedReviews.length) * 100),
      4: Math.round((counts[4] / approvedReviews.length) * 100),
      3: Math.round((counts[3] / approvedReviews.length) * 100),
      2: Math.round((counts[2] / approvedReviews.length) * 100),
      1: Math.round((counts[1] / approvedReviews.length) * 100),
    };
  };

  const starPercentages = getStarPercentages();

  const handleSubmitReview = (data: ReviewFormData) => {
    const today = new Date();
    const dateStr = `${today.getDate()} tháng ${today.getMonth() + 1}, ${today.getFullYear()}`;

    const newReview: Review = {
      id: `review-${Date.now()}`,
      userName: user?.fullName || currentUser?.name || 'Khách hàng',
      rating: data.rating,
      title: data.title,
      comment: data.comment,
      date: dateStr,
      variant: productVariant,
      verifiedPurchase: canReview,
      status: canReview ? 'approved' : 'pending',
      media: data.media.map((m) => m.preview),
      helpfulCount: 0,
      notHelpfulCount: 0,
    };

    setReviews((prev) => [newReview, ...prev]);
    setIsModalOpen(false);
    setShowApprovedToast(true);
  };

  useEffect(() => {
    if (showLoginToast) {
      const timer = setTimeout(() => setShowLoginToast(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [showLoginToast]);

  useEffect(() => {
    if (showApprovedToast) {
      const timer = setTimeout(() => setShowApprovedToast(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [showApprovedToast]);

  const handleHelpful = (id: string) => {
    setReviews((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, helpfulCount: r.helpfulCount + 1 } : r
      )
    );
  };

  const handleNotHelpful = (id: string) => {
    setReviews((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, notHelpfulCount: r.notHelpfulCount + 1 } : r
      )
    );
  };

  return (
    <>
      {/* Login Required Toast */}
      <div
        className={cn(
          'fixed bottom-6 left-1/2 -translate-x-1/2 z-[10000] transition-all duration-300',
          showLoginToast
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-4 pointer-events-none'
        )}
      >
        <div className="bg-blue-600 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-3">
          <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z"
              clipRule="evenodd"
            />
          </svg>
          <p className="text-[14px] font-medium">
            Vui lòng đăng nhập để đánh giá sản phẩm.
          </p>
        </div>
      </div>

      {/* Approved Review Toast */}
      <div
        className={cn(
          'fixed bottom-6 left-1/2 -translate-x-1/2 z-[10000] transition-all duration-300',
          showApprovedToast
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-4 pointer-events-none'
        )}
      >
        <div className="bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-3">
          <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <p className="text-[14px] font-medium">
            Cảm ơn bạn! Đánh giá của bạn đã được đăng.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-4 border-t border-slate-200 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Summary */}
        <div className="lg:col-span-4 space-y-6">
          <div>
            <h2 className="text-[24px] font-bold text-[#0F1111]">Đánh giá khách hàng</h2>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex text-[#ed6c2d]">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    size={20}
                    fill={i <= Math.round(parseFloat(averageRating)) ? 'currentColor' : 'none'}
                    className={i <= Math.round(parseFloat(averageRating)) ? '' : 'text-slate-300'}
                  />
                ))}
              </div>
              <span className="text-[18px] font-medium text-[#0F1111]">
                {averageRating} trên 5
              </span>
            </div>
            <div className="text-[14px] text-[#565959] mt-1">
              {reviews.filter((r) => r.status === 'approved').length} đánh giá
            </div>
          </div>

          {/* Rating Filter Bars */}
          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map((stars) => (
              <RatingBar
                key={stars}
                label={`${stars} sao`}
                percentage={starPercentages[stars as keyof typeof starPercentages]}
                onClick={(s) => setFilterStars(filterStars === s ? null : s)}
              />
            ))}
            {filterStars && (
              <button
                onClick={() => setFilterStars(null)}
                className="text-[13px] text-[#007185] hover:text-[#C7511F] hover:underline"
              >
                Xóa bộ lọc
              </button>
            )}
          </div>

          <button className="flex items-center gap-1 text-[14px] text-[#007185] hover:underline hover:text-[#C7511F] transition-colors">
            Cách thức đánh giá và xếp hạng hoạt động <ChevronDown size={14} />
          </button>

          <div className="pt-8 border-t border-slate-200">
            <h3 className="text-[18px] font-bold text-[#0F1111] mb-2">Đánh giá sản phẩm này</h3>
            <p className="text-[14px] text-[#0F1111] mb-6">
              Chia sẻ trải nghiệm của bạn với khách hàng khác
            </p>

            {/* Review Button with Tooltip */}
            <div className="relative">
              <button
                onClick={() => {
                  if (!isLoggedIn) {
                    setShowLoginToast(true);
                  } else if (canReview) {
                    setIsModalOpen(true);
                  }
                }}
                disabled={!canReview}
                onMouseEnter={() => !canReview && setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                className={cn(
                  'w-full py-2.5 px-4 rounded-lg text-[14px] font-medium transition-colors flex items-center justify-center gap-2',
                  canReview
                    ? 'border border-slate-300 shadow-sm hover:bg-slate-50 hover:border-slate-400 cursor-pointer'
                    : 'border border-slate-200 bg-neutral-100 text-slate-400 cursor-not-allowed opacity-60 hover:bg-neutral-100 hover:border-slate-200'
                )}
              >
                {canReview ? (
                  'Viết đánh giá sản phẩm'
                ) : (
                  <>
                    <Lock size={14} />
                    Viết đánh giá sản phẩm
                  </>
                )}
              </button>

              {/* Tooltip */}
              {showTooltip && !canReview && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-[12px] rounded-lg whitespace-nowrap z-50 shadow-lg">
                  {!isLoggedIn
                    ? 'Đăng nhập để đánh giá sản phẩm'
                    : 'Chỉ khách hàng đã mua sản phẩm mới có thể đánh giá'}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Detailed Reviews */}
        <div className="lg:col-span-8 space-y-10">
          {/* Images section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[18px] font-bold text-[#0F1111]">Hình ảnh từ đánh giá</h3>
              <button className="text-[14px] text-[#007185] hover:underline hover:text-[#C7511F] transition-colors">
                Xem tất cả ảnh
              </button>
            </div>
            <div className="relative group">
              <div className="flex gap-2 overflow-hidden">
                {reviewImages.slice(imageIndex, imageIndex + 5).map((img, i) => (
                  <div
                    key={i}
                    className="w-[120px] aspect-square bg-slate-50 border border-slate-200 rounded-sm overflow-hidden flex-none"
                  >
                    {img ? (
                      <img
                        src={img}
                        alt={`Hình ảnh đánh giá ${i + 1}`}
                        className="w-full h-full object-cover hover:opacity-90 transition-opacity cursor-pointer"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-400">
                        Đang tải...
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {imageIndex > 0 && (
                <button
                  onClick={() => setImageIndex((prev) => Math.max(0, prev - 1))}
                  className="absolute left-[-20px] top-1/2 -translate-y-1/2 w-10 h-10 bg-white border border-slate-300 rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-slate-50"
                >
                  <ChevronLeft size={20} />
                </button>
              )}
              {imageIndex + 5 < reviewImages.length && (
                <button
                  onClick={() => setImageIndex((prev) => Math.min(reviewImages.length - 5, prev + 1))}
                  className="absolute right-[-20px] top-1/2 -translate-y-1/2 w-10 h-10 bg-white border border-slate-300 rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-slate-50"
                >
                  <ChevronRight size={20} />
                </button>
              )}
            </div>
          </div>

          {/* All Reviews */}
          <div className="border-t border-slate-200">
            <h3 className="text-[18px] font-bold text-[#0F1111] mt-8 mb-4">
              {filterStars
                ? `Đánh giá ${filterStars} sao (${filteredReviews.length})`
                : 'Đánh giá hàng đầu'}
            </h3>
            <div className="divide-y divide-slate-100">
              {filteredReviews.map((review) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  onHelpful={handleHelpful}
                  onNotHelpful={handleNotHelpful}
                />
              ))}
            </div>
            {filteredReviews.length === 0 && filterStars && (
              <p className="text-[14px] text-[#565959] py-8 text-center">
                Không có đánh giá {filterStars} sao nào.
              </p>
            )}
            {filteredReviews.length > 0 && (
              <div className="pt-4 border-t border-slate-100">
                <button className="flex items-center gap-1 text-[14px] text-[#007185] font-bold hover:underline hover:text-[#C7511F] transition-colors">
                  Xem thêm đánh giá <ChevronRight size={14} className="mt-0.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Review Form Modal */}
      <ReviewFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitReview}
        productName={productName}
        isVerifiedPurchase={canReview}
        userName={user?.fullName || currentUser?.name}
      />
    </>
  );
}
