import React from 'react';
import { Headset, Tag, Truck, Warehouse, FileText, Briefcase } from 'lucide-react';

const FEATURES = [
  {
    icon: Headset,
    title: "Hỗ trợ tận tâm",
    description: "Đội ngũ hỗ trợ luôn sẵn sàng tư vấn sản phẩm và giải đáp nhanh chóng cho doanh nghiệp.",
  },
  {
    icon: Tag,
    title: "Giá minh bạch",
    description: "Giá cả cạnh tranh cùng thông tin sản phẩm rõ ràng giúp doanh nghiệp dễ dàng ra quyết định mua hàng.",
  },
  {
    icon: Truck,
    title: "Giao hàng toàn quốc",
    description: "Xử lý đơn nhanh và hỗ trợ giao hàng trên toàn quốc cho xưởng sản xuất và doanh nghiệp.",
  },
  {
    icon: Warehouse,
    title: "Kho hàng đa dạng",
    description: "Hàng ngàn sản phẩm kỹ thuật và vật tư công nghiệp luôn sẵn sàng phục vụ nhu cầu doanh nghiệp.",
  },
  {
    icon: FileText,
    title: "Thông số kỹ thuật rõ ràng",
    description: "Mọi sản phẩm đều được chuẩn hóa thông tin giúp kỹ sư dễ dàng tra cứu và lựa chọn.",
  },
  {
    icon: Briefcase,
    title: "Hỗ trợ doanh nghiệp",
    description: "Giải pháp phù hợp cho phòng mua hàng, kỹ sư và nhà máy với quy trình đặt hàng tối ưu.",
  }
];

export default function ValueProposition() {
  return (
    <section className="bg-[#264553] py-16">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURES.map((feature, idx) => (
            <div key={idx} className="flex gap-4">
              <div className="shrink-0">
                <feature.icon className="w-10 h-10 text-[#febd17]" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-slate-300 text-[15px] leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
