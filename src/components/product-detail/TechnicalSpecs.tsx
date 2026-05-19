import React from 'react';
import { Settings } from 'lucide-react';

interface SpecRow {
  label: string;
  value: string;
}

interface TechnicalSpecsProps {
  specs: SpecRow[];
}

export default function TechnicalSpecs({ specs }: TechnicalSpecsProps) {
  return (
    <section className="font-sans">
      <div className="flex items-center gap-4 mb-12">
        <h2 className="text-3xl font-display font-black text-brand-secondary tracking-tighter uppercase italic">
          THÔNG SỐ KỸ THUẬT CHI TIẾT
        </h2>
        <div className="flex-1 h-px bg-slate-200"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 bg-white border border-slate-200 shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {specs.map((row, i) => (
              <div key={i} className={`flex justify-between items-center p-6 border-b border-slate-100 ${i % 2 === 0 ? 'md:border-r' : ''} hover:bg-slate-50 transition-colors`}>
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{row.label}</span>
                <span className="text-[13px] font-black text-brand-secondary uppercase tracking-tight italic">{row.value}</span>
              </div>
            ))}
          </div>
          <div className="bg-white p-6 flex items-center justify-between">
             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tiêu chuẩn kiểm định</span>
             <div className="flex gap-4">
                {['ISO 9001', 'DIN 471', 'RoHS'].map(tag => (
                   <span key={tag} className="text-[10px] font-black text-brand-secondary border border-brand-secondary/20 px-3 py-1 rounded bg-white">{tag}</span>
                ))}
             </div>
          </div>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-6">
           <div className="bg-brand-secondary p-8 text-white relative overflow-hidden flex flex-col justify-end min-h-[300px] border border-white/10 group">
              <div className="relative z-10">
                 <h4 className="text-xl font-black italic tracking-tighter mb-4">HỖ TRỢ KỸ THUẬT</h4>
                 <p className="text-[11px] font-bold text-white/50 uppercase tracking-widest leading-relaxed mb-8">
                    Chuyên viên của chúng tôi sẵn sàng giải đáp các thắc mắc về lắp đặt và ứng dụng vật liệu.
                 </p>
                 <button className="w-full py-4 bg-brand-primary text-brand-secondary font-black text-[12px] uppercase tracking-[0.2em] hover:brightness-95 transition-all">
                    GỌI TƯ VẤN NGAY
                 </button>
              </div>
              <Settings size={150} className="absolute -top-10 -right-10 text-white/5 rotate-12 group-hover:rotate-45 transition-transform duration-1000" />
           </div>
           
           <div className="bg-white border border-slate-200 p-8 flex flex-col gap-6">
              <h5 className="text-[11px] font-black text-brand-secondary uppercase tracking-[0.2em]">Sản phẩm tương tự</h5>
              <div className="space-y-4">
                 {[1,2,3].map(i => (
                    <div key={i} className="flex gap-4 items-center group cursor-pointer">
                       <div className="w-12 h-12 bg-slate-50 border border-slate-100 flex items-center justify-center p-2">
                          <img src="https://image-cdn.mecsu.vn/assets/images/6dfdf7e1-88fc-419b-ab09-72c67de2af93.jpg" alt="Related" className="w-full h-full object-contain" />
                       </div>
                       <div className="flex flex-col">
                          <span className="text-[11px] font-bold text-slate-800 uppercase line-clamp-1 group-hover:text-brand-primary transition-colors">Phe Gài Trục Thép {30+i}</span>
                          <span className="text-[10px] font-black text-brand-accent uppercase italic">Xem ngay</span>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </section>
  );
}
