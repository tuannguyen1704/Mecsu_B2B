import React from 'react';
import ReactMarkdown from 'react-markdown';
import { CheckCircle2 } from 'lucide-react';

interface ProductDescriptionProps {
  content: string;
}

export default function ProductDescription({ content }: ProductDescriptionProps) {
  return (
    <section className="font-sans">
      <div className="flex items-center gap-4 mb-12">
        <h2 className="text-3xl font-display font-black text-brand-secondary tracking-tighter uppercase italic">
          MÔ TẢ CHI TIẾT SẢN PHẨM
        </h2>
        <div className="flex-1 h-px bg-slate-200"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8">
           <div className="bg-white border border-slate-200 p-10 lg:p-16">
              <div className="markdown-body prose prose-slate max-w-none 
                prose-h1:text-3xl prose-h1:font-black prose-h1:text-brand-secondary prose-h1:uppercase prose-h1:italic prose-h1:tracking-tighter 
                prose-h2:text-2xl prose-h2:font-black prose-h2:text-brand-secondary prose-h2:uppercase prose-h2:italic prose-h2:tracking-tighter prose-h2:mt-12 prose-h2:pb-4 prose-h2:border-b-2 prose-h2:border-brand-primary
                prose-p:text-slate-600 prose-p:text-sm prose-p:leading-loose prose-p:font-medium
                prose-li:text-slate-600 prose-li:text-sm prose-li:font-medium 
                prose-strong:text-brand-secondary prose-strong:font-black">
                <ReactMarkdown>
                  {content}
                </ReactMarkdown>
              </div>
           </div>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-8">
           <div className="bg-white border border-slate-200 p-8 shadow-sm">
              <h3 className="text-[11px] font-black text-brand-secondary uppercase tracking-[0.2em] mb-8 border-b border-slate-200 pb-4">Tài liệu kỹ thuật</h3>
              <div className="space-y-4">
                 <button className="w-full flex items-center justify-between p-4 bg-white border border-slate-200 hover:border-brand-primary transition-all group">
                    <span className="text-[11px] font-black text-slate-600 uppercase tracking-widest">Catalog Sản Phẩm (.PDF)</span>
                    <div className="w-8 h-8 bg-slate-50 flex items-center justify-center text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-all">
                       <CheckCircle2 size={14} />
                    </div>
                 </button>
                 <button className="w-full flex items-center justify-between p-4 bg-white border border-slate-200 hover:border-brand-primary transition-all group">
                    <span className="text-[11px] font-black text-slate-600 uppercase tracking-widest">Bản Vẽ 3D (.STEP)</span>
                    <div className="w-8 h-8 bg-slate-50 flex items-center justify-center text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-all">
                       <CheckCircle2 size={14} />
                    </div>
                 </button>
              </div>
           </div>

           <div className="bg-brand-primary p-8 text-brand-secondary border border-brand-primary shadow-xl">
              <h3 className="text-[11px] font-black uppercase tracking-[0.2em] mb-4">Mecsu Enterprise</h3>
              <p className="text-[14px] font-black italic tracking-tighter leading-tight mb-8">
                 DỊCH VỤ CUNG ỨNG VẬT TƯ CHO DOANH NGHIỆP TRỌN GÓI
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  'Báo giá nhanh trong 30 phút',
                  'Hỗ trợ công nợ lên đến 90 ngày',
                  'Giao hàng hỏa tốc trong 2h',
                  'Đổi trả 100% nếu lỗi kỹ thuật'
                ].map(li => (
                  <li key={li} className="flex items-center gap-3 text-[11px] font-black uppercase">
                    <CheckCircle2 size={14} strokeWidth={3} />
                    {li}
                  </li>
                ))}
              </ul>
              <button className="w-full py-4 bg-brand-secondary text-white font-black text-[12px] uppercase tracking-[0.2em] hover:brightness-110 transition-all">
                ĐĂNG KÝ DOANH NGHIỆP
              </button>
           </div>
        </div>
      </div>
    </section>
  );
}
