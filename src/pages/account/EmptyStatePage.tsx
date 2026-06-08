import React from 'react';
import { LucideIcon, FileText, MapPin, CreditCard, Heart, RotateCcw } from 'lucide-react';
import { AccountLayout } from './components/AccountLayout';

interface EmptyStatePageProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

// Icon mapping for different page types
const iconMap: Record<string, LucideIcon> = {
  quotes: FileText,
  addresses: MapPin,
  payment: CreditCard,
  wishlist: Heart,
  returns: RotateCcw,
};

export const EmptyStatePage: React.FC<EmptyStatePageProps> = ({ 
  icon: Icon, 
  title, 
  description
}) => {
  return (
    <AccountLayout>
      <div className="flex flex-col items-center justify-center py-8 lg:py-12">
        {/* Empty State Icon */}
        <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-4">
          <Icon size={40} className="text-slate-300" />
        </div>
        
        {/* Title */}
        <h2 className="text-xl lg:text-2xl font-bold text-slate-900 mb-2">
          {title}
        </h2>
        
        {/* Description */}
        <p className="text-slate-500 text-center max-w-md mb-6">
          {description}
        </p>
        
        {/* Decorative dots */}
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#163F78]/20" />
          <span className="w-2 h-2 rounded-full bg-[#FFC72C]/40" />
          <span className="w-2 h-2 rounded-full bg-[#163F78]/20" />
        </div>
      </div>
    </AccountLayout>
  );
};

// Page component creators for each route
export const QuotesPage = () => (
  <EmptyStatePage
    icon={FileText}
    title="Báo giá"
    description="Tính năng báo giá đang được phát triển. Bạn có thể liên hệ bộ phận kinh doanh để nhận báo giá chi tiết."
  />
);

export const PaymentMethodsPage = () => (
  <EmptyStatePage
    icon={CreditCard}
    title="Phương thức thanh toán"
    description="Thêm và quản lý các phương thức thanh toán của bạn để mua sắm thuận tiện hơn."
  />
);

export const WishlistPage = () => (
  <EmptyStatePage
    icon={Heart}
    title="Danh sách yêu thích"
    description="Lưu các sản phẩm bạn quan tâm để mua sắm nhanh hơn trong tương lai."
  />
);

export const ReturnsPage = () => (
  <EmptyStatePage
    icon={RotateCcw}
    title="Đổi trả"
    description="Yêu cầu đổi trả sản phẩm. Liên hệ hỗ trợ nếu bạn cần hướng dẫn chi tiết."
  />
);

export default EmptyStatePage;
