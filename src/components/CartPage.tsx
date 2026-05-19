import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight,
  ShieldCheck,
  Truck,
  CreditCard,
  ChevronDown,
  ChevronUp,
  HeadphonesIcon,
  Tag,
  Zap,
  Building2,
  X
} from 'lucide-react';
import { Product } from '../types';
import { HEADER_CATEGORIES } from '../constants';
import { useSupabaseImages } from '../hooks/useSupabaseImages';
import { OptimizedImage } from './ui/OptimizedImage';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Address } from '../types/auth';
import AddressModal from './AddressModal';
import { toSlug, generateCategoryUrl } from '../lib/utils';

const BRANDS = [
  { name: "BOSCH", prefix: <div className="w-8 h-8 rounded-full border-2 border-slate-500 flex items-center justify-center mr-2"><div className="w-4 h-5 border-x-2 border-slate-500 rounded-sm"></div></div>, color: "text-[#e22739]", weight: "font-black text-2xl sm:text-3xl tracking-tighter flex items-center" },
  { name: "SATA", prefix: <div className="w-8 h-8 mr-2 flex flex-col justify-center items-center text-[#296a4b]"><svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8"><path d="M12 2l8.66 5v10L12 22l-8.66-5V7L12 2zm0 3.5L5.93 9v6L12 18.5l6.07-3.5v-6L12 5.5zM12 8l4.33 2.5v5L12 18l-4.33-2.5v-5L12 8z" fillRule="evenodd"/></svg></div>, color: "text-[#296a4b]", weight: "font-black text-[22px] sm:text-[28px] tracking-tight flex items-center" },
  { name: "PISCO", color: "text-[#28479e]", weight: "font-black text-2xl sm:text-3xl tracking-wider" },
  { name: "CDC", suffix: <div className="ml-2 text-[8px] sm:text-[10px] text-black font-sans leading-none flex flex-col justify-center font-bold tracking-normal mt-1 text-left"><span>씨디씨뉴매틱</span><span>PNEUMATICS CORP.</span></div>, color: "text-[#1a4798]", weight: "font-black text-2xl sm:text-[28px] tracking-tighter italic flex items-center" },
  { name: "SELLEYS", color: "text-white bg-[#273a8a] px-2 py-0.5 sm:px-3 sm:py-1", weight: "font-black text-xl sm:text-[22px] italic tracking-wider" },
  { name: "KST", color: "text-[#c63d35]", weight: "font-black text-2xl sm:text-3xl" },
  { name: "NACHI", color: "text-[#df3634]", weight: "font-medium text-2xl sm:text-3xl tracking-widest" },
  { name: "SKF", color: "text-[#0d4f9b]", weight: "font-black text-2xl sm:text-3xl tracking-tighter" },
];

interface CartItem {
  product: Product;
  quantity: number;
}

interface CartPageProps {
  items: CartItem[];
  onBack: () => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onCheckout: () => void;
}

export default function CartPage({ items, onBack, onUpdateQuantity, onRemoveItem, onCheckout }: CartPageProps) {
  const { getRandomImage } = useSupabaseImages();
  const { isLoggedIn, addAddress } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);

  const handleSaveAddress = (address: Address, saveToAccount: boolean) => {
    if (saveToAccount && isLoggedIn) {
      addAddress(address);
    }
  };

  const subtotal = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const shipping = subtotal > 1000000 ? 0 : 35000;
  const total = subtotal + shipping;

  const RenderLowerSections = () => (
    <>
        <div className="bg-[#f2f2f2] w-full py-12 px-6 lg:px-12 flex justify-center flex-1">
          <div className="w-full max-w-[1400px]">
            <h3 className="text-[27px] font-bold text-[#1a1a1a] mb-6 tracking-tight">Shop Categories</h3>
            <div className={`relative ${isExpanded ? 'mb-12' : ''}`}>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                {(isExpanded ? HEADER_CATEGORIES : HEADER_CATEGORIES.slice(0, 12)).map((cat) => (
                  <Link 
                    key={cat.id}
                    to={generateCategoryUrl(cat)}
                    className="bg-white rounded p-4 flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <div className="w-12 h-12 shrink-0 flex items-center justify-center">
                      <OptimizedImage 
                        src={getRandomImage(cat.name) || undefined}
                        alt={cat.name}
                        className="max-w-full max-h-full object-contain mix-blend-multiply"
                      />
                    </div>
                    <span className="text-[14px] text-slate-700 font-medium leading-tight line-clamp-2">
                      {cat.name}
                    </span>
                  </Link>
                ))}
              </div>
              {!isExpanded && <div className="absolute bottom-0 left-0 right-0 h-[120px] bg-linear-to-t from-[#f2f2f2] via-[#f2f2f2]/80 to-transparent pointer-events-none" />}
              <div className={`absolute ${isExpanded ? '-bottom-12' : '-bottom-6'} left-0 right-0 flex justify-center`}>
                <button 
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-[#2071a7] text-[13px] font-bold hover:bg-[#e6f0f5] px-4 py-2 rounded transition-colors inline-flex items-center gap-1"
                >
                   {isExpanded ? 'See Less' : 'See More'} 
                   {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white w-full py-[15px] px-6 lg:px-12 flex justify-center border-t border-slate-100">
          <div className="w-full max-w-[1400px]">
            <div className="flex items-baseline gap-2 mb-8">
              <h3 className="text-[27px] font-bold text-[#1a1a1a] tracking-tight">Brands We Carry</h3>
              <span className="text-slate-600 text-[14px] ml-2">Thousands of brands!</span>
              <a href="#" className="text-[#2071a7] text-[14px] hover:underline ml-1">See more</a>
            </div>
            <div className="flex flex-wrap items-center gap-2 opacity-95 -mx-4 mt-2">
              {BRANDS.map((brand, idx) => (
                <div 
                  key={idx} 
                  className={`uppercase ${brand.weight} ${brand.color} select-none transition-all duration-300 px-4 py-3 rounded-xl border border-transparent hover:border-slate-100 hover:shadow-xl hover:-translate-y-1 bg-transparent hover:bg-white cursor-pointer flex items-center justify-center`}
                >
                  {brand.prefix}
                  {brand.name}
                  {brand.suffix}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-[#f8f9fa] w-full py-[44px] pl-[49px] pr-6 lg:pr-12 flex justify-center border-t border-slate-100">
          <div className="w-full max-w-[1400px]">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#2071a7] mb-4 shadow-sm border border-slate-100">
                  <HeadphonesIcon size={24} />
                </div>
                <h4 className="font-bold text-[#1a1a1a] mb-2 text-[15px]">Hỗ trợ khách hàng tận tâm</h4>
                <p className="text-slate-500 text-[13px] leading-relaxed">Đội ngũ tư vấn chuyên nghiệp, luôn sẵn sàng hỗ trợ nhanh chóng và hiệu quả.</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#2071a7] mb-4 shadow-sm border border-slate-100">
                  <Tag size={24} />
                </div>
                <h4 className="font-bold text-[#1a1a1a] mb-2 text-[15px]">Giá tốt mỗi ngày</h4>
                <p className="text-slate-500 text-[13px] leading-relaxed">Cung cấp mức giá cạnh tranh cho các sản phẩm và vật tư bạn sử dụng thường xuyên.</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#2071a7] mb-4 shadow-sm border border-slate-100">
                  <Truck size={24} />
                </div>
                <h4 className="font-bold text-[#1a1a1a] mb-2 text-[15px]">Giao hàng toàn quốc</h4>
                <p className="text-slate-500 text-[13px] leading-relaxed">Hỗ trợ giao hàng nhanh trên toàn quốc với nhiều phương thức vận chuyển linh hoạt.</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#2071a7] mb-4 shadow-sm border border-slate-100">
                  <Zap size={24} />
                </div>
                <h4 className="font-bold text-[#1a1a1a] mb-2 text-[15px]">Xử lý đơn nhanh chóng</h4>
                <p className="text-slate-500 text-[13px] leading-relaxed">Đơn hàng được xác nhận và xử lý nhanh giúp đảm bảo tiến độ công việc của bạn.</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#2071a7] mb-4 shadow-sm border border-slate-100">
                  <Building2 size={24} />
                </div>
                <h4 className="font-bold text-[#1a1a1a] mb-2 text-[15px]">Hỗ trợ công nợ doanh nghiệp</h4>
                <p className="text-slate-500 text-[13px] leading-relaxed">Chính sách công nợ linh hoạt dành cho khách hàng và doanh nghiệp đủ điều kiện.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white w-full flex justify-center border-t border-slate-100 pb-12">
          <div className="w-full max-w-[1400px]">
            <div className={`relative px-6 py-12 lg:px-12 flex flex-col items-start text-left ${isDescriptionExpanded ? 'pb-24' : ''}`}>
              <h3 className="text-2xl font-bold text-[#1a1a1a] tracking-tight mb-4">Điểm đến đáng tin cậy cho vật tư, thiết bị và dụng cụ công nghiệp</h3>
              
              <div className={`relative overflow-hidden transition-all duration-300 w-full text-slate-600 text-[15px] space-y-4 ${isDescriptionExpanded ? 'max-h-[1000px]' : 'max-h-[140px]'}`}>
                <p>Mua sắm tại Mecsu và khám phá hàng ngàn sản phẩm chất lượng từ nhiều thương hiệu uy tín trong lĩnh vực cơ khí, công nghiệp và xây dựng. Chúng tôi cung cấp đa dạng vật tư và thiết bị như bu lông, ốc vít, dụng cụ cầm tay, thiết bị điện, vật tư khí nén, thiết bị an toàn lao động và nhiều sản phẩm công nghiệp khác giúp doanh nghiệp vận hành hiệu quả hơn mỗi ngày.</p>
                
                <p>Mecsu mang đến trải nghiệm mua sắm trực tuyến tiện lợi với thông tin sản phẩm rõ ràng, tìm kiếm nhanh chóng, giá cả cạnh tranh và nguồn hàng ổn định. Dù bạn là xưởng cơ khí, nhà máy sản xuất, đơn vị thi công hay doanh nghiệp thương mại, bạn đều có thể dễ dàng tìm thấy sản phẩm phù hợp với nhu cầu sử dụng thực tế.</p>
                
                <p>Là đơn vị hoạt động trong lĩnh vực vật tư công nghiệp và MRO (Maintenance, Repair & Operations), Mecsu cung cấp các sản phẩm và linh kiện phục vụ cho bảo trì, sửa chữa và vận hành hệ thống sản xuất. Chúng tôi hỗ trợ từ nhu cầu cơ bản đến chuyên sâu với đa dạng danh mục như:</p>
                
                <ul className="list-disc pl-6 space-y-1">
                  <li>Bu lông, ốc vít và phụ kiện liên kết</li>
                  <li>Dụng cụ cầm tay và dụng cụ điện</li>
                  <li>Thiết bị khí nén và thủy lực</li>
                  <li>Vật tư điện công nghiệp</li>
                  <li>Thiết bị an toàn lao động</li>
                  <li>Vòng bi, bạc đạn và linh kiện cơ khí</li>
                  <li>Thiết bị hàn cắt và phụ kiện</li>
                  <li>Vật tư nhà xưởng và bảo trì</li>
                </ul>
                
                <p>Với danh mục sản phẩm liên tục được mở rộng, Mecsu giúp doanh nghiệp dễ dàng tìm đúng sản phẩm cần thiết, tiết kiệm thời gian tìm kiếm và đảm bảo tiến độ công việc với dịch vụ hỗ trợ nhanh chóng và giao hàng toàn quốc.</p>
                
                {!isDescriptionExpanded && <div className="absolute bottom-0 left-0 right-0 h-[80px] bg-linear-to-t from-white to-transparent pointer-events-none" />}
              </div>

              <div className={`absolute ${isDescriptionExpanded ? 'bottom-8' : 'bottom-2'} left-0 right-0 flex justify-center z-10`}>
                <button 
                  onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                  className="text-[#2071a7] text-[13px] font-bold hover:bg-[#e6f0f5] px-4 py-2 rounded transition-colors inline-flex items-center gap-1 bg-white border border-transparent hover:border-slate-100"
                >
                   {isDescriptionExpanded ? 'See Less' : 'See More'} 
                   {isDescriptionExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
              </div>
            </div>
          </div>
        </div>
    </>
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-[60vh] flex flex-col w-full"
    >
        {items.length === 0 ? (
          <div className="bg-white w-full py-16 px-6 lg:px-12 flex justify-center border-b border-slate-100">
              <div className="w-full max-w-[1400px]">
                  <h2 className="text-[28px] font-bold text-[#1a1a1a] mb-6">Your cart is empty</h2>
                  <button 
                    onClick={onBack}
                    className="bg-[#264553] text-white px-6 py-2.5 rounded font-bold text-[14px] hover:bg-[#1a323d] transition-colors"
                  >
                    Continue Shopping
                  </button>
              </div>
          </div>
        ) : (
          <div className="max-w-[1400px] mx-auto px-4 py-8 font-sans w-full">
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-premium-border">
              <h1 className="text-3xl font-bold text-text-navy flex items-center gap-3">
                <ShoppingBag className="text-brand-primary" />
                Giỏ hàng (Industrial)
              </h1>
              <button onClick={onBack} className="text-text-dim hover:text-text-navy font-semibold underline">
                Tiếp tục mua sắm
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-3">
                {items.map((item) => (
                  <div 
                    key={item.product.id} 
                    className="bg-white p-5 rounded-lg border border-slate-200/80 flex gap-5 items-center relative group hover:border-slate-300 hover:shadow-sm transition-all duration-200"
                  >
                    {/* Remove Button - Top Right */}
                    <button 
                      onClick={() => onRemoveItem(item.product.id)}
                      className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1.5 rounded opacity-0 group-hover:opacity-100 transition-all duration-150"
                      aria-label="Remove item"
                    >
                      <X size={16} strokeWidth={2} />
                    </button>
                    
                    {/* Product Image */}
                    <div className="w-20 h-20 border border-slate-200 rounded-lg p-2 shrink-0 bg-slate-50/50">
                      <OptimizedImage 
                        src={getRandomImage(item.product.name) || item.product.image} 
                        alt={item.product.name} 
                        className="w-full h-full object-contain" 
                      />
                    </div>
                    
                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <span className="font-semibold text-[#111111] text-[15px] leading-snug mb-1.5 pr-8 block">
                        {item.product.name}
                      </span>
                      <div className="flex items-center gap-x-4 gap-y-1 flex-wrap">
                        <span className="text-[12px] text-slate-500 font-medium">
                          SKU: <span className="text-slate-700">{item.product.sku}</span>
                        </span>
                        <span className="text-[12px] text-slate-400">|</span>
                        <span className="text-[12px] text-slate-500 font-medium">
                          {item.product.brand}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="inline-flex items-center text-[11px] font-semibold text-emerald-700 bg-emerald-50/80 px-2 py-0.5 rounded border border-emerald-100">
                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1.5"></span>
                          Còn hàng
                        </span>
                        <span className="text-[11px] text-slate-400">Giao: 2-3 ngày</span>
                      </div>
                    </div>
                    
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-4 shrink-0">
                      <div className="flex items-center border border-slate-200 rounded-md overflow-hidden bg-white">
                        <button 
                          onClick={() => onUpdateQuantity(item.product.id, Math.max(1, item.quantity - 1))} 
                          className="w-8 h-8 flex items-center justify-center hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors border-r border-slate-200"
                        >
                          <Minus size={14} strokeWidth={2} />
                        </button>
                        <span className="w-10 h-8 flex items-center justify-center font-semibold text-[13px] text-[#111111] bg-slate-50/50 border-r border-slate-200">
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)} 
                          className="w-8 h-8 flex items-center justify-center hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors"
                        >
                          <Plus size={14} strokeWidth={2} />
                        </button>
                      </div>
                      
                      {/* Price */}
                      <div className="text-right min-w-[120px]">
                        <div className="font-bold text-[#111111] text-[16px] leading-none">
                          {(item.product.price * item.quantity).toLocaleString()}đ
                        </div>
                        {item.quantity > 1 && (
                          <div className="text-[11px] text-slate-400 mt-0.5">
                            {item.product.price.toLocaleString()}đ / cái
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="lg:col-span-1">
                <div className="bg-white p-6 rounded-lg border border-slate-200/80 sticky top-24">
                  <h2 className="text-[15px] font-bold text-[#111111] uppercase tracking-wide mb-5 pb-3 border-b border-slate-100">Tóm tắt đơn hàng</h2>
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span className="text-text-dim">Tạm tính:</span>
                      <span className="font-semibold">{subtotal.toLocaleString()}đ</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-dim">VAT:</span>
                      <span className="font-semibold">{(subtotal * 0.1).toLocaleString()}đ</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg border-t pt-3">
                      <span>Tổng cộng:</span>
                      <span className="text-text-navy">{(total * 1.1).toLocaleString()}đ</span>
                    </div>
                  </div>
                  <button onClick={onCheckout} className="w-full bg-brand-primary text-text-navy font-bold py-4 rounded text-lg hover:bg-brand-primary/90 flex items-center justify-center gap-2">
                    <Building2 size={20} />
                    Chuyển tới thanh toán
                  </button>
                  <button className="w-full mt-4 text-brand-secondary font-semibold border-2 border-brand-secondary py-3 rounded hover:bg-premium-hover">
                    Yêu cầu báo giá (Bulk Order)
                  </button>
                  {isLoggedIn && (
                    <button 
                      onClick={() => setShowAddressModal(true)}
                      className="w-full mt-4 text-[#003B73] font-semibold border-2 border-[#003B73] py-3 rounded hover:bg-[#003B73]/5 flex items-center justify-center gap-2"
                    >
                      <Plus size={18} />
                      Thêm địa chỉ giao hàng
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        <RenderLowerSections />

        <AddressModal
          isOpen={showAddressModal}
          onClose={() => setShowAddressModal(false)}
          onSave={handleSaveAddress}
          showSaveOption={true}
        />
    </motion.div>
  );
}
