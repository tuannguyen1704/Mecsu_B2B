import React from 'react';

const REAL_IMAGES = [
  'https://images.unsplash.com/photo-1542013936693-884638332954?w=1200',
  'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200',
  'https://images.unsplash.com/photo-1530124560676-4fbc91848b9b?w=1200',
  'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=1200'
];

export default function RealImages() {
  return (
    <section className="font-sans">
      <div className="flex items-center gap-4 mb-12">
        <h2 className="text-3xl font-display font-black text-brand-secondary tracking-tighter uppercase italic">
          HÌNH ẢNH THỰC TẾ TẠI KHO
        </h2>
        <div className="flex-1 h-px bg-slate-200"></div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {REAL_IMAGES.map((img, i) => (
          <div key={i} className="group relative aspect-square overflow-hidden bg-slate-100 border border-slate-200 shadow-sm cursor-zoom-in">
            <img 
              src={img} 
              alt="Mecsu Real Storage" 
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
            />
            <div className="absolute inset-0 bg-brand-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
               <span className="text-[10px] font-black text-white uppercase tracking-widest border border-white/40 px-4 py-2 backdrop-blur-sm">Phóng to</span>
            </div>
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center translate-y-10 group-hover:translate-y-0 transition-transform duration-500">
               <span className="text-[9px] font-black text-white uppercase tracking-[0.2em] drop-shadow-md">Batch: MC-2026-X</span>
            </div>
          </div>
        ))}
      </div>
      <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-8 text-center">
        * Hình ảnh được chụp trực tiếp tại kho vận MECSU Logistics Center. Sản phẩm thực tế có thể thay đổi nhẹ về màu sắc do ánh sáng.
      </p>
    </section>
  );
}
