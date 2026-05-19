import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FAQItemProps {
  question: string;
  answer: React.ReactNode;
}

const FAQItem = ({ question, answer }: FAQItemProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-4 bg-white border border-slate-200 rounded-sm overflow-hidden transition-all duration-200 hover:border-slate-300">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between text-left group transition-colors hover:bg-slate-50/50"
      >
        <span className="text-[16px] font-bold text-[#1a1a1a] group-hover:text-[#2071a7] transition-colors pr-8">
          {question}
        </span>
        <div className={`shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          <ChevronDown size={20} className="text-slate-400 group-hover:text-[#2071a7]" />
        </div>
      </button>
      
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="px-6 pb-6 text-[15px] leading-[1.6] text-slate-700 border-t border-slate-100 mt-0 pt-4">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function CategoryFAQ() {
  const faqs = [
    {
      question: "Bu lông là gì?",
      answer: (
        <p> Bu lông là chi tiết cơ khí có ren ngoài, thường được sử dụng cùng đai ốc để tạo liên kết giữa hai hoặc nhiều bộ phận. Bu lông có khả năng chịu lực tốt, dễ tháo lắp và được ứng dụng phổ biến trong xây dựng, cơ khí, nội thất, điện công nghiệp và nhiều lĩnh vực khác.</p>
      )
    },
    {
      question: "Có những loại bu lông nào phổ biến?",
      answer: (
        <div className="space-y-4">
          <p>Hiện nay có nhiều loại bu lông khác nhau để phù hợp với từng nhu cầu sử dụng, bao gồm:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Bu lông lục giác ngoài</li>
            <li>Bu lông lục giác chìm</li>
            <li>Bu lông đầu tròn cổ vuông</li>
            <li>Bu lông nở</li>
            <li>Bu lông hóa chất</li>
            <li>Bu lông inox</li>
            <li>Bu lông cường lực</li>
          </ul>
          <p>Mỗi loại sẽ có thiết kế, cấp bền và khả năng chịu tải riêng, phù hợp với từng môi trường và mục đích sử dụng khác nhau.</p>
        </div>
      )
    },
    {
      question: "Nên chọn bu lông inox hay bu lông thép?",
      answer: (
        <p>Bu lông inox có ưu điểm chống gỉ sét tốt, phù hợp với môi trường ngoài trời, ẩm ướt hoặc hóa chất. Trong khi đó, bu lông thép có khả năng chịu lực cao và chi phí tối ưu hơn cho các ứng dụng thông thường. Tùy theo môi trường làm việc và yêu cầu kỹ thuật, bạn có thể lựa chọn loại phù hợp nhất.</p>
      )
    },
    {
      question: "Làm sao để chọn đúng kích thước bu lông?",
      answer: (
        <div className="space-y-4">
          <p>Khi chọn bu lông, bạn nên quan tâm đến:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Đường kính ren</li>
            <li>Chiều dài bu lông</li>
            <li>Bước ren</li>
            <li>Cấp bền</li>
            <li>Loại vật liệu</li>
            <li>Môi trường sử dụng</li>
          </ul>
          <p>Việc chọn đúng thông số giúp đảm bảo độ an toàn, khả năng chịu lực và tuổi thọ của hệ thống lắp ráp.</p>
        </div>
      )
    },
    {
      question: "Bu lông có tiêu chuẩn nào phổ biến?",
      answer: (
        <div className="space-y-4">
          <p>Các tiêu chuẩn bu lông thông dụng hiện nay gồm:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>DIN</li>
            <li>ISO</li>
            <li>ASTM</li>
            <li>JIS</li>
          </ul>
          <p>Mỗi tiêu chuẩn sẽ quy định về kích thước, vật liệu, cấp bền và kiểu ren khác nhau để phù hợp với từng ngành công nghiệp và thị trường sử dụng.</p>
        </div>
      )
    }
  ];

  return (
    <section className="pt-4 pb-12 bg-white">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
        <h2 className="text-[28px] font-bold text-[#222] mb-8">Câu hỏi thường gặp</h2>
        <div className="max-w-7xl">
          {faqs.map((faq, index) => (
            <FAQItem 
              key={index} 
              question={faq.question} 
              answer={faq.answer} 
            />
          ))}
        </div>
      </div>
    </section>
  );
}
