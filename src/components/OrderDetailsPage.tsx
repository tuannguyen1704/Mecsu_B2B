import React from 'react';
import { motion } from 'motion/react';
import { ChevronRight, Package, Truck, CheckCircle2, MapPin, Clock, ArrowLeft, ShieldCheck, PhoneCall, Copy, ExternalLink, Box } from 'lucide-react';

interface OrderDetailsPageProps {
  orderId: string;
  onBackToHome: () => void;
}

export default function OrderDetailsPage({ orderId, onBackToHome }: OrderDetailsPageProps) {
  // Mock data for the specific order
  const orderDetails = {
    id: orderId || 'MEC-2024-8891',
    date: '05/05/2026',
    status: 'Đang xử lý',
    total: 2450000,
    shippingFee: 30000,
    items: [
      { id: 1, name: 'Bulong lục giác chìm inox 304 M8x30', price: 15000, qty: 100, image: 'https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?w=200' },
      { id: 2, name: 'Vít bắn tôn tự khoan đầu lục giác 12-14x50', price: 2000, qty: 500, image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=200' }
    ],
    address: '2 Lê Hồng Phong, P. Tân Đông Hiệp, TP. Dĩ An, T. Bình Dương',
    customerName: 'Tuấn Nguyễn',
    phone: '098******12',
    tracking: [
      { status: 'Đặt hàng thành công', time: '14:20 - 05/05/2026', active: true, completed: true },
      { status: 'Duyệt đơn hàng', time: '14:45 - 05/05/2026', active: true, completed: true },
      { status: 'Đang chuẩn bị hàng', time: 'Dự kiến: 16:00 - 05/05/2026', active: true, completed: false },
      { status: 'Bàn giao vận chuyển', time: 'Dự kiến: 08:00 - 06/05/2026', active: false, completed: false },
      { status: 'Đang giao hàng', time: '-', active: false, completed: false },
      { status: 'Giao hàng thành công', time: '-', active: false, completed: false }
    ]
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-white min-h-screen pb-24"
    >
      <div className="bg-white border-b border-slate-100 sticky top-20 z-10">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4 flex items-center justify-between">
          <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
            <button onClick={onBackToHome} className="hover:text-blue-600 transition-colors">Trang Chủ</button>
            <ChevronRight size={12} className="text-slate-300" />
            <span className="text-slate-900 line-clamp-1">Chi tiết đơn hàng {orderDetails.id}</span>
          </nav>
          <button onClick={onBackToHome} className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-colors">
            <ArrowLeft size={16} />
            Quay lại
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header Card */}
            <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full -mr-16 -mt-16" />
              <div className="relative z-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                  <div>
                    <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-2">Đơn hàng {orderDetails.id}</h1>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Ngày đặt: {orderDetails.date}</p>
                  </div>
                  <div className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-blue-600/20">
                    {orderDetails.status}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-slate-50 pt-8">
                  <div className="space-y-4">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                       <MapPin size={14} className="text-blue-600" />
                       Địa chỉ nhận hàng
                    </h3>
                    <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                      <p className="text-[13px] font-bold text-slate-900 leading-relaxed">
                        {orderDetails.customerName}<br />
                        <span className="text-slate-500">{orderDetails.phone}</span><br />
                        {orderDetails.address}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                       <Truck size={14} className="text-orange-500" />
                       Hình thức vận chuyển
                    </h3>
                    <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                      <p className="text-[13px] font-bold text-slate-900">Mecsu Vận Chuyển</p>
                      <p className="text-[11px] font-bold text-slate-500 mt-1 uppercase tracking-widest italic">Nhận hàng trong vòng 24h</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tracking Status */}
            <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100">
              <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-10 text-slate-900 flex items-center gap-3">
                <Clock size={18} className="text-blue-600" />
                Tiền độ đơn hàng
              </h3>
              
              <div className="relative pl-8 border-l-2 border-slate-100 space-y-12 ml-4">
                {orderDetails.tracking.map((step, idx) => (
                  <div key={idx} className="relative">
                    <div className={`absolute -left-[41px] top-0 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center transition-all ${step.completed ? 'bg-green-500 text-white' : step.active ? 'bg-blue-600 text-white scale-110 shadow-xl shadow-blue-500/20' : 'bg-slate-200 text-slate-400'}`}>
                      {step.completed ? <CheckCircle2 size={16} /> : <div className="w-1.5 h-1.5 bg-current rounded-full" />}
                    </div>
                    <div className={step.active || step.completed ? 'opacity-100' : 'opacity-40'}>
                      <p className={`text-sm font-black uppercase tracking-widest ${step.active && !step.completed ? 'text-blue-600' : 'text-slate-900'}`}>
                        {step.status}
                      </p>
                      <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{step.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Items Card */}
            <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100">
              <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-8 text-slate-900 flex items-center gap-3">
                <Box size={18} className="text-blue-600" />
                Danh sách sản phẩm
              </h3>
              <div className="space-y-6">
                {orderDetails.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-6 p-4 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                    <div className="w-20 h-20 bg-white border border-slate-100 rounded-xl overflow-hidden shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-slate-900 truncate uppercase tracking-tight">{item.name}</h4>
                        <p className="text-xs text-slate-400 font-bold mt-1">SL: {item.qty} x {item.price.toLocaleString()}đ</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm font-black text-slate-900">{(item.qty * item.price).toLocaleString()}đ</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar - Summary */}
          <div className="space-y-8">
            <div className="bg-slate-900 rounded-[32px] p-8 text-white shadow-2xl">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] mb-8 text-blue-400">Tóm tắt thanh toán</h3>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center text-xs font-bold text-slate-400">
                  <span>Tạm tính</span>
                  <span className="text-white">{(orderDetails.total - orderDetails.shippingFee).toLocaleString()}đ</span>
                </div>
                <div className="flex justify-between items-center text-xs font-bold text-slate-400">
                  <span>Phí vận chuyển</span>
                  <span className="text-white">{orderDetails.shippingFee.toLocaleString()}đ</span>
                </div>
                <div className="flex justify-between items-center text-xs font-bold text-slate-400">
                  <span>Giảm giá</span>
                  <span className="text-green-400">0đ</span>
                </div>
                <div className="pt-4 border-t border-white/10 flex justify-between items-end">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Mecsu Total</span>
                  <span className="text-2xl font-black text-blue-400">{orderDetails.total.toLocaleString()}đ</span>
                </div>
              </div>
              
              <div className="p-4 bg-white/5 rounded-2xl space-y-3">
                 <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                   <ShieldCheck size={14} className="text-blue-500" />
                   Thanh toán an toàn
                 </div>
                 <p className="text-[11px] font-bold text-slate-500 italic uppercase">Chuyển khoản ngân hàng (Đã xác nhận)</p>
              </div>
            </div>

            <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm space-y-6">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Hỗ trợ đơn hàng</h3>
                <div className="space-y-4">
                    <button className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-blue-600 hover:text-white rounded-2xl transition-all group">
                        <div className="flex items-center gap-3">
                            <PhoneCall size={20} className="text-blue-600 group-hover:text-white" />
                            <span className="text-xs font-black uppercase">Gội tổng đài</span>
                        </div>
                        <ChevronRight size={16} />
                    </button>
                    <button className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-900 hover:text-white rounded-2xl transition-all group">
                        <div className="flex items-center gap-3">
                            <Copy size={20} className="text-slate-400 group-hover:text-white" />
                            <span className="text-xs font-black uppercase">Sao chép mã</span>
                        </div>
                        <ChevronRight size={16} />
                    </button>
                    <button className="w-full flex items-center justify-between p-4 bg-orange-50 hover:bg-orange-600 hover:text-white rounded-2xl transition-all group">
                        <div className="flex items-center gap-3">
                            <ExternalLink size={20} className="text-orange-600 group-hover:text-white" />
                            <span className="text-xs font-black uppercase">Huỷ đơn hàng</span>
                        </div>
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>
          </div>

        </div>
      </div>
    </motion.div>
  );
}
