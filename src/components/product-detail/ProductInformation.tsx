import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronUp, ChevronDown, Star } from 'lucide-react';
import { useSupabaseImages } from '../../hooks/useSupabaseImages';

interface InfoRowProps {
  label: string;
  value: React.ReactNode;
}

const InfoRow = ({ label, value }: InfoRowProps) => (
  <div className="grid grid-cols-[1fr_1fr] border-b border-slate-200 py-2 last:border-0">
    <div className="text-[13px] font-bold text-[#0F1111]">{label}</div>
    <div className="text-[13px] text-[#0F1111]">{value}</div>
  </div>
);

interface InfoSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const InfoSection = ({ title, children, defaultOpen = false }: InfoSectionProps) => {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  return (
    <div className="mb-4">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-2.5 px-4 bg-[#092b34] border border-[#092b34] rounded-sm hover:bg-[#0c3a45] transition-colors cursor-pointer"
      >
        <span className="text-[17px] font-bold text-white">{title}</span>
        <motion.div
          animate={{ rotate: isOpen ? 0 : 180 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronUp size={20} className="text-white" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-3 py-2">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function ProductInformation() {
  const { getRandomImage, loading } = useSupabaseImages();

  return (
    <div className="font-sans max-w-7xl mx-auto py-4 px-4 border-t border-slate-200">
      <h2 className="text-[24px] font-bold text-[#0F1111] mb-4">Thông tin sản phẩm</h2>
      
      <div className="space-y-4">
        <InfoSection title="Hình ảnh thực tế">
          <div className="grid grid-cols-4 gap-2 mt-2">
            {loading ? (
              Array(4).fill(0).map((_, i) => (
                <div key={i} className="aspect-square bg-slate-100 animate-pulse rounded-sm" />
              ))
            ) : (
              [1, 2, 3, 4].map((i) => {
                const img = getRandomImage(`real_img_${i}`);
                return img ? (
                  <div key={i} className="aspect-square overflow-hidden bg-slate-50 border border-slate-100 rounded-sm">
                    <img 
                      src={img} 
                      alt={`Real image ${i}`} 
                      className="w-full h-full object-cover transition-transform hover:scale-105 duration-500" 
                    />
                  </div>
                ) : (
                   <div key={i} className="aspect-square bg-slate-100 rounded-sm flex items-center justify-center text-[10px] text-slate-400">
                     No Image
                   </div>
                );
              })
            )}
          </div>
        </InfoSection>

        <InfoSection title="Chi tiết sản phẩm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-0.5">
              <InfoRow label="Dùng Cho Trục" value="36 mm" />
              <InfoRow label="Vật Liệu" value="Thép 65Mn" />
              <InfoRow label="Bề Rộng Rãnh Sử Dụng" value="1.85 mm" />
              <InfoRow label="Đường Kính Rãnh Sử Dụng" value="34 mm" />
              <InfoRow label="Đường Kính Trong" value="33.2 mm" />
              <InfoRow label="Độ Dày" value="1.75 mm" />
              <InfoRow label="Tiêu Chuẩn" value="DIN 471" />
              <InfoRow label="Thương Hiệu" value="MS-PRO" />
            </div>
            <div className="flex items-center justify-center bg-white p-4 rounded-sm border border-slate-100 self-start">
              <img 
                src="/assets/ThongSoKyThuan.png" 
                alt="Thông số kỹ thuật" 
                className="max-w-full h-auto object-contain"
              />
            </div>
          </div>
        </InfoSection>
      </div>

      {/* Warranty & Support */}
      <div className="mt-6">
        <h3 className="text-[13px] font-bold text-[#0F1111] mb-2">Bảo hành & Hỗ trợ</h3>
        <p className="text-[13px] text-[#0F1111] leading-normal mb-4">
          Chính sách đổi trả của MECSU: <span className="font-bold">Đảm bảo đổi trả tự nguyện trong 30 ngày:</span> Bạn có thể đổi trả nhiều mặt hàng đã mua trong vòng 30 ngày kể từ ngày giao hàng. Đảm bảo đổi trả tự nguyện của chúng tôi không ảnh hưởng đến quyền hủy bỏ hợp pháp của bạn dưới bất kỳ hình thức nào. Bạn có thể tìm hiểu thêm về các ngoại lệ và điều kiện <span className="text-[#007185] hover:underline cursor-pointer">tại đây</span>.
        </p>
        <p className="text-[13px] text-[#0F1111]">
          <span className="font-bold">Bảo hành sản phẩm:</span> Để biết thông tin bảo hành về sản phẩm này, vui lòng <span className="text-[#007185] hover:underline cursor-pointer">nhấn vào đây</span>
        </p>
      </div>

      {/* Feedback */}
      <div className="mt-6 border-t border-slate-200 pt-4">
        <h3 className="text-[13px] font-bold text-[#0F1111] mb-2 uppercase">Phản hồi</h3>
        <button className="flex items-center gap-1 text-[#007185] hover:underline text-[14px]">
          Bạn có muốn <span className="font-bold">thông báo cho chúng tôi về một mức giá thấp hơn?</span>
          <ChevronDown size={14} />
        </button>
      </div>
    </div>
  );
}
