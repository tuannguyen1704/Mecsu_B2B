import React from 'react';
import { Truck, ShieldCheck, RotateCcw, CheckCircle2 } from 'lucide-react';

const BENEFITS = [
  { icon: Truck, label: 'Vận chuyển 2h', desc: 'Hỏa tốc nội đô' },
  { icon: ShieldCheck, label: 'ISO Standard', desc: 'Kiểm định 100%' },
  { icon: RotateCcw, label: 'Bảo hành 1:1', desc: 'Lỗi nhà sản xuất' },
  { icon: CheckCircle2, label: 'Invoice VAT', desc: 'CO/CQ đầy đủ' },
];

export default function BenefitsList() {
  return (
    <div className="flex flex-col gap-4 border border-slate-300 rounded-lg p-4 bg-white shadow-sm">
      <h4 className="text-[14px] font-bold mb-1">Product Benefits</h4>
      <div className="grid grid-cols-1 gap-3">
        {BENEFITS.map((item, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-600 border border-slate-100">
              <item.icon size={16} />
            </div>
            <div>
              <div className="text-[12px] font-bold text-slate-800">{item.label}</div>
              <div className="text-[11px] text-slate-500">{item.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
