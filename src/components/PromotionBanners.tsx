import React from 'react';
import { motion } from 'motion/react';

const PROMOTIONS = [
  {
    title: 'Giảm 15% Vật Liệu\nSắt Thép Xây Dựng.*',
    image: '/assets/NhaMay.png',
    disclaimer: '*Áp dụng cho đơn hàng dự án. Kết thúc ngày 25/05/26.',
    link: '#'
  },
  {
    title: 'Ưu Đãi 20%\nBulong & Ốc Vít\nCông Trình.*',
    image: '/assets/NhaMay01.png',
    disclaimer: '*Áp dụng thương hiệu đạt chuẩn ISO. Kết thúc ngày 17/05/26.',
    link: '#'
  },
  {
    title: 'Tặng Bộ Công Cụ\nKhi Mua Máy Thi\nCông.*',
    image: '/assets/NhaMay02.png',
    disclaimer: '*Áp dụng dòng máy DEWALT & Milwaukee. Kết thúc ngày 28/06/26.',
    link: '#'
  },
  {
    title: 'Combo Bảo Hộ\nLao Động Công\nTrường.*',
    image: '/assets/NhaMay03.jpg',
    disclaimer: '*Giảm thêm 10% khi mua theo nhóm. Kết thúc ngày 17/05/26.',
    link: '#'
  }
];

const PromotionBanners = () => {
  return (
    <section className="bg-white pt-[14px] pb-0 border-b border-slate-100">
      <div className="max-w-[1600px] mx-auto px-4 lg:px-8 py-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6">
        {PROMOTIONS.map((promo, idx) => {
          const displayImage = promo.image;
          
          return (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className={`flex flex-col gap-3 ${idx === 0 ? 'lg:col-span-2' : 'lg:col-span-1'}`}
            >
              <div className="group relative h-[240px] lg:h-[260px] overflow-hidden rounded-md flex flex-col justify-between p-6 cursor-pointer transition-all duration-500">
                {/* Background Image */}
                <div className="absolute inset-0">
                  <img 
                    src={displayImage} 
                    alt={promo.title} 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-500" />
                </div>

                {/* Content */}
                <div className="relative z-10 w-full">
                  <h3 className="text-[26px] font-bold text-white leading-[1.1] tracking-tight drop-shadow-md whitespace-pre-line">
                    {promo.title}
                  </h3>
                </div>

                <div className="relative z-10">
                  <span className="text-white text-[15px] font-bold capitalize underline underline-offset-4 decoration-white hover:text-slate-200 transition-colors">
                    Mua ngay
                  </span>
                </div>
              </div>
              {/* Disclaimer */}
              <p className="text-[12px] text-slate-500 leading-snug">
                {promo.disclaimer}
              </p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default PromotionBanners;
