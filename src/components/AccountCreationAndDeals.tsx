import React from 'react';
import { Truck, CalendarDays, ShoppingCart } from 'lucide-react';

export default function AccountCreationAndDeals() {
  return (
    <section className="bg-white pt-2 pb-4 font-sans">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch min-h-[380px]">
          
          {/* Left Box: Create an account */}
          <div className="border border-slate-400 p-8 lg:p-10 flex flex-col justify-between">
            <div>
              <h2 className="text-[32px] font-bold text-slate-900 mb-8 font-display tracking-tight leading-none">
                Create an account
              </h2>
              
              <ul className="space-y-5 mb-6">
                <li className="flex items-center gap-4 text-slate-800">
                  <Truck size={28} className="text-[#264553]" strokeWidth={1.5} />
                  <span className="text-[17px] font-medium">Free shipping $50+</span>
                </li>
                <li className="flex items-center gap-4 text-slate-800">
                  <CalendarDays size={28} className="text-[#264553]" strokeWidth={1.5} />
                  <span className="text-[17px] font-medium">Access to Net 30 terms</span>
                </li>
                <li className="flex items-center gap-4 text-slate-800">
                  <ShoppingCart size={28} className="text-[#264553]" strokeWidth={1.5} />
                  <span className="text-[17px] font-medium">Easy reordering</span>
                </li>
              </ul>
              
              <p className="text-sm text-slate-700 mb-8 font-medium">Terms apply</p>
            </div>
            
            <button className="w-full bg-[#264553] hover:bg-[#1a313b] transition-colors text-white font-bold text-[16px] py-4">
              Create Account
            </button>
          </div>

          {/* Right Box: Special Deals */}
          <div className="bg-[#264553] p-8 lg:p-10 flex flex-col justify-between relative overflow-hidden group cursor-pointer">
            {/* Background Text */}
            <div className="absolute right-0 bottom-[-40px] select-none pointer-events-none">
              <h3 className="text-[130px] leading-[0.8] font-black text-[#1d3540] tracking-tight text-right uppercase">
                <span className="block capitalize mr-8 tracking-tighter">Special</span>
                <span className="block capitalize tracking-tighter">deals</span>
              </h3>
            </div>

            <div className="relative z-10 mt-2">
              <h2 className="text-[36px] font-bold text-white mb-4 leading-none tracking-tight">Special Deals</h2>
              <p className="text-white text-[22px] font-medium max-w-[340px] leading-[1.3]">
                Limited-time savings on<br />brands you count on.
              </p>
            </div>

            <div className="relative z-10 pb-2">
              <span className="text-white font-bold text-[18px] hover:underline underline-offset-4 decoration-2">
                Shop Now
              </span>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
