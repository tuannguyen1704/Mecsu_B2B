import React from 'react';

const INDUSTRIES = [
  "Cơ khí chính xác",
  "Tự động hóa",
  "Thiết bị khí nén",
  "Công cụ cầm tay",
  "Bảo trì công nghiệp",
  "Vật liệu phụ trợ"
];

const BRANDS = [
  { name: "BOSCH", prefix: <div className="w-8 h-8 rounded-full border-2 border-slate-500 flex items-center justify-center mr-2"><div className="w-4 h-5 border-x-2 border-slate-500 rounded-sm"></div></div>, color: "text-[#e22739]", weight: "font-black text-2xl sm:text-3xl tracking-tighter flex items-center" },
  { name: "SATA", prefix: <div className="w-8 h-8 mr-2 flex flex-col justify-center items-center text-[#296a4b]"><svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8"><path d="M12 2l8.66 5v10L12 22l-8.66-5V7L12 2zm0 3.5L5.93 9v6L12 18.5l6.07-3.5v-6L12 5.5zM12 8l4.33 2.5v5L12 18l-4.33-2.5v-5L12 8z" fillRule="evenodd"/></svg></div>, color: "text-[#296a4b]", weight: "font-black text-[22px] sm:text-[28px] tracking-tight flex items-center" },
  { name: "PISCO", color: "text-[#28479e]", weight: "font-black text-2xl sm:text-3xl tracking-wider" },
  { name: "CDC", suffix: <div className="ml-2 text-[8px] sm:text-[10px] text-black font-sans leading-none flex flex-col justify-center font-bold tracking-normal not-italic mt-1"><span>씨디씨뉴매틱</span><span>PNEUMATICS CORP.</span></div>, color: "text-[#1a4798]", weight: "font-black text-2xl sm:text-[28px] tracking-tighter italic flex items-center" },
  { name: "SELLEYS", color: "text-white bg-[#273a8a] px-2 py-0.5 sm:px-3 sm:py-1", weight: "font-black text-xl sm:text-[22px] italic tracking-wider" },
  { name: "KST", color: "text-[#c63d35]", weight: "font-black text-2xl sm:text-3xl" },
  { name: "NACHI", color: "text-[#df3634]", weight: "font-medium text-2xl sm:text-3xl tracking-widest" },
  { name: "SKF", color: "text-[#0d4f9b]", weight: "font-black text-2xl sm:text-3xl tracking-tighter" },
];

export default function BrandsYouTrust() {
  return (
    <section className="bg-white pt-2 pb-10">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
        <div className="flex items-baseline gap-4 mb-6">
          <h2 className="text-[32px] font-bold text-slate-900 tracking-tight">Brands you trust</h2>
          <a href="#" className="text-[#326295] text-[15px] font-medium hover:underline">See more</a>
        </div>

        <div className="flex flex-wrap items-center gap-3 mb-12">
          <button className="bg-[#264553] text-white px-5 py-1.5 rounded-full text-[14px] font-bold">
            Trusted brands
          </button>
          
          <div className="w-[1px] h-6 bg-slate-300 mx-2"></div>
          
          <span className="text-[16px] font-bold text-slate-800 mr-2">By industry</span>
          
          <div className="flex flex-wrap gap-3">
            {INDUSTRIES.map((industry) => (
              <button 
                key={industry}
                className="border border-slate-200 bg-white text-slate-700 hover:border-[#264553] hover:text-[#264553] px-5 py-2 rounded-full text-[14px] font-medium transition-all duration-200"
              >
                {industry}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-8 opacity-95">
          {BRANDS.map((brand, idx) => (
            <div key={idx} className={`uppercase ${brand.weight} ${brand.color} select-none p-4 rounded-xl transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:bg-white`}>
              {brand.prefix}
              {brand.name}
              {brand.suffix}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
