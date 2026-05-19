import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Search, Truck, Package, CheckCircle2, Clock, SlidersHorizontal } from 'lucide-react';

interface OrderTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function OrderTrackingModal({ isOpen, onClose }: OrderTrackingModalProps) {
  const [activeTab, setActiveTab] = React.useState<'tracking' | 'calculator' | 'policy'>('tracking');
  const [orderId, setOrderId] = React.useState('');
  const [isSearching, setIsSearching] = React.useState(false);
  const [showResult, setShowResult] = React.useState(false);

  // Calculator State
  const [weight, setWeight] = React.useState('1');
  const [province, setProvince] = React.useState('');
  const [shippingFee, setShippingFee] = React.useState<number | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId) return;
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
      setShowResult(true);
    }, 1200);
  };

  const calculateFee = () => {
    if (!province) return;
    const base = province === 'hcm' || province === 'hn' ? 30000 : 50000;
    const added = (Number(weight) - 1) * 5000;
    setShippingFee(base + (added > 0 ? added : 0));
  };

  const steps = [
    { label: 'Đã nhận đơn', status: 'completed', date: '04/05/2026 09:00', icon: Clock },
    { label: 'Đang đóng gói', status: 'completed', date: '04/05/2026 10:30', icon: Package },
    { label: 'Đang vận chuyển', status: 'current', date: '05/05/2026 04:54', icon: Truck },
    { label: 'Giao hàng thành công', status: 'pending', date: '--/--/----', icon: CheckCircle2 },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100"
          >
            {/* Header with Tabs */}
            <div className="bg-slate-50 border-b border-slate-100">
              <div className="p-6 pb-2 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
                    <Truck size={20} />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight">Trung Tâm Vận Chuyển</h2>
                    <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Hỗ trợ khách hàng 24/7</p>
                  </div>
                </div>
                <button 
                  onClick={onClose}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:bg-white hover:text-slate-900 transition-all shadow-sm"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex px-4 gap-1 pb-1">
                {[
                  { id: 'tracking', label: 'Tra cứu đơn', icon: Search },
                  { id: 'calculator', label: 'Tính phí ship', icon: SlidersHorizontal },
                  { id: 'policy', label: 'Chính sách', icon: CheckCircle2 },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 px-2 text-[10px] font-black uppercase tracking-widest border-b-2 transition-all ${
                      activeTab === tab.id 
                        ? 'border-blue-500 text-blue-600 bg-white rounded-t-xl' 
                        : 'border-transparent text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    <tab.icon size={14} />
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-8">
              {activeTab === 'tracking' && (
                <div>
                  {!showResult ? (
                    <form onSubmit={handleSearch} className="space-y-6">
                      <div className="text-center mb-6">
                        <div className="text-4xl mb-4">📦</div>
                        <h3 className="text-xl font-bold text-slate-900">Kiểm tra đơn hàng của bạn</h3>
                        <p className="text-sm text-slate-500 mt-2">Nhập mã vận đơn (VD: ORD123456)</p>
                      </div>

                      <div className="relative">
                        <input 
                          type="text"
                          value={orderId}
                          onChange={(e) => setOrderId(e.target.value)}
                          placeholder="Mã đơn hàng..."
                          className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:border-blue-500 focus:outline-none font-bold text-slate-800 transition-all"
                        />
                        <button 
                          type="submit"
                          disabled={isSearching}
                          className="absolute right-2 top-2 bottom-2 px-6 bg-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-all disabled:bg-slate-400"
                        >
                          {isSearching ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Tra cứu'}
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-6">
                      <div className="p-5 bg-blue-50 rounded-2xl border border-blue-100 flex justify-between items-center">
                        <div>
                          <div className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Đơn hàng #ORD992837</div>
                          <div className="text-sm font-bold text-slate-900 mt-1">Đang vận chuyển từ Kho Tổng</div>
                        </div>
                        <CheckCircle2 className="text-blue-500" />
                      </div>
                      
                      <div className="relative pl-8 space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                        {steps.map((step, idx) => (
                          <div key={idx} className="relative">
                            <div className={`absolute -left-[3px] w-2 h-2 rounded-full border-2 border-white ring-4 ${
                              step.status === 'completed' ? 'bg-blue-500 ring-blue-50' : 
                              step.status === 'current' ? 'bg-orange-500 ring-orange-100 animate-pulse' : 'bg-slate-200 ring-slate-50'
                            }`} />
                            <div className="flex justify-between items-start">
                              <span className={`text-[11px] font-black uppercase ${step.status === 'pending' ? 'text-slate-300' : 'text-slate-800'}`}>{step.label}</span>
                              <span className="text-[9px] font-medium text-slate-400 italic">{step.date}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      <button onClick={() => setShowResult(false)} className="w-full py-4 text-slate-500 text-[10px] font-black uppercase tracking-widest bg-slate-50 rounded-xl hover:bg-slate-100 transition-all">Quay lại</button>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'calculator' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tỉnh/Thành phố</label>
                      <select 
                        value={province}
                        onChange={(e) => setProvince(e.target.value)}
                        className="w-full p-4 bg-slate-50 border-2 border-slate-200 rounded-xl font-bold text-slate-800 focus:border-blue-500 outline-none"
                      >
                        <option value="">Chọn khu vực...</option>
                        <option value="hcm">TP. Hồ Chí Minh</option>
                        <option value="hn">Hà Nội</option>
                        <option value="khac">Các tỉnh khác</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Khối lượng (kg)</label>
                      <input 
                        type="number"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        className="w-full p-4 bg-slate-50 border-2 border-slate-200 rounded-xl font-bold text-slate-800 focus:border-blue-500 outline-none"
                      />
                    </div>
                  </div>

                  <button 
                    onClick={calculateFee}
                    className="w-full py-4 bg-blue-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all"
                  >
                    Tính phí dự kiến
                  </button>

                  {shippingFee !== null && (
                    <motion.div 
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="p-6 bg-green-50 rounded-2xl border border-green-100 text-center"
                    >
                      <div className="text-[10px] font-black text-green-600 uppercase tracking-widest mb-1">Cước phí ước tính</div>
                      <div className="text-3xl font-black text-green-700">{shippingFee.toLocaleString()}đ</div>
                      <p className="text-[9px] text-green-600 mt-2 font-medium italic">* Phí thực tế có thể thay đổi tùy theo kích thước kiện hàng.</p>
                    </motion.div>
                  )}
                </div>
              )}

              {activeTab === 'policy' && (
                <div className="space-y-4">
                  {[
                    { title: 'Miễn phí vận chuyển', content: 'Đơn từ 2.000.000đ trong nội thành. Đơn ngoại tỉnh từ 5.000.000đ (Dưới 30kg).' },
                    { title: 'Thời gian giao hàng', content: 'Sáng đặt chiều giao (nội thành). Các tỉnh thành khác từ 1-3 ngày làm việc.' },
                    { title: 'Kiểm tra hàng', content: 'Khách hàng luôn được đồng kiểm trước khi nhận đơn hàng và thanh toán.' },
                    { title: 'Hình thức vận chuyển', content: 'Viettel Post, GHTK, Xe tải chuyên dụng cho đơn hàng số lượng lớn.' },
                  ].map((p, i) => (
                    <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <h4 className="text-[11px] font-black text-slate-800 uppercase flex items-center gap-2 mb-1">
                        <CheckCircle2 size={14} className="text-green-500" />
                        {p.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 leading-normal">{p.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

