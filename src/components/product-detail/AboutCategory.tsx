import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AboutCategoryProps {
  title: string;
}

export default function AboutCategory({ title }: AboutCategoryProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section className="pt-12 pb-4 border-t border-slate-200 bg-white">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
        <h2 className="text-[28px] font-bold text-[#222] mb-6">{title}</h2>
        
        <div className="relative">
          <motion.div 
            initial={false}
            animate={{ height: isExpanded ? 'auto' : 120 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="text-[15px] leading-[1.6] text-slate-700 space-y-4">
              <p>
                Bu lông là một trong những chi tiết cơ khí quan trọng và được sử dụng rộng rãi trong ngành công nghiệp, xây dựng, cơ khí chế tạo, lắp ráp máy móc và nhiều ứng dụng dân dụng khác. Khi kết hợp cùng đai ốc và long đền, bu lông giúp liên kết các chi tiết một cách chắc chắn, ổn định và dễ dàng tháo lắp khi cần bảo trì hoặc thay thế.
              </p>
              <p>
                Tại Mecsu, bạn có thể tìm thấy đa dạng các loại bu lông với nhiều kích thước, vật liệu và tiêu chuẩn khác nhau như inox, thép mạ kẽm, thép cường lực… phù hợp cho từ công trình dân dụng đến môi trường công nghiệp khắt khe. Chúng tôi cung cấp sản phẩm từ các thương hiệu uy tín, đảm bảo độ bền, khả năng chịu lực và tính ổn định cao trong quá trình sử dụng.
              </p>
              <p>
                Dù bạn đang thi công công trình, lắp ráp thiết bị, sửa chữa máy móc hay sản xuất công nghiệp, Mecsu luôn sẵn sàng đáp ứng nhu cầu vật tư cơ khí với mức giá cạnh tranh và nguồn hàng ổn định.
              </p>
            </div>
          </motion.div>
          
          <AnimatePresence>
            {!isExpanded && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" 
              />
            )}
          </AnimatePresence>
        </div>

        <div className="mt-4 flex justify-center">
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="group relative flex items-center gap-1.5 px-4 py-1.5 text-[15px] font-medium text-[#2071a7] rounded-sm transition-all overflow-hidden"
          >
            {/* Background Hover Effect */}
            <div className="absolute inset-0 bg-[#f0f7ff] opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            
            {/* Click Ripple-like Effect */}
            <div className="absolute inset-0 bg-blue-100 opacity-0 active:opacity-100 scale-0 active:scale-150 transition-all duration-300 rounded-full" />

            <span className="relative z-10 flex items-center gap-1.5 transition-transform active:scale-95">
              {isExpanded ? (
                <>
                  See Less <ChevronUp size={18} className="translate-y-[0.5px]" />
                </>
              ) : (
                <>
                  See More <ChevronDown size={18} className="translate-y-[0.5px]" />
                </>
              )}
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
