import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronRight, Bell, Package, CheckCircle2, Truck, User, LogIn, LogOut, Settings, FileText, LayoutDashboard } from 'lucide-react';

interface Notification {
  id: string;
  type: 'order' | 'system' | 'shipping';
  message: string;
  time: string;
  read: boolean;
  orderId?: string;
  icon?: string;
}

interface ProfilePopupProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  onMarkAllRead: () => void;
  onLoginClick?: () => void;
  onLogout?: () => void;
  userName?: string;
}

export default function ProfilePopup({ isOpen, onClose, notifications, onMarkAllRead, onLoginClick, onLogout, userName }: ProfilePopupProps) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'all' | 'order'>('all');

  const filteredNotifications = activeTab === 'all' 
    ? notifications 
    : notifications.filter(n => n.type === 'order');

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop for mobile or just to close on click outside */}
          <div 
            className="fixed inset-0 z-[290] bg-black/5" 
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 top-[calc(100%+10px)] w-[380px] bg-white rounded-[24px] shadow-2xl z-[300] border border-slate-100 overflow-hidden"
          >
            {/* User Info Header (shown when logged in) */}
            {userName && (
              <div className="px-6 py-5 bg-gradient-to-b from-slate-50 to-white border-b border-slate-100">
                {/* Profile Area - Clickable */}
                <div 
                  className="flex items-center gap-4 cursor-pointer hover:bg-slate-100/50 -mx-2 px-2 py-2 rounded-xl transition-colors"
                  onClick={() => {
                    navigate('/tai-khoan');
                    onClose();
                  }}
                >
                  <div className="w-12 h-12 rounded-full bg-[#003B73] text-white flex items-center justify-center font-bold text-lg">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-slate-800">{userName}</p>
                    <p className="text-xs text-slate-400">Khách hàng Mecsu</p>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <button 
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#003B73] text-white text-xs font-bold rounded-xl hover:bg-[#002d5a] transition-colors"
                    onClick={() => {
                      navigate('/tai-khoan/don-hang');
                      onClose();
                    }}
                  >
                    <Package size={14} />
                    Đơn hàng
                  </button>
                  <button 
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-50 transition-colors"
                    onClick={() => {
                      navigate('/tai-khoan');
                      onClose();
                    }}
                  >
                    <LayoutDashboard size={14} />
                    Tổng quan
                  </button>
                </div>
              </div>
            )}

            {/* Login prompt (shown when not logged in) */}
            {!userName && (
              <div className="px-6 py-5 bg-gradient-to-b from-slate-50 to-white border-b border-slate-100">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
                    <User size={32} className="text-slate-400" />
                  </div>
                  <p className="text-sm text-slate-500 mb-4">Đăng nhập để xem đơn hàng và ưu đãi</p>
                  <button 
                    onClick={() => onLoginClick?.()}
                    className="w-full py-3 bg-[#003B73] text-white font-bold text-sm rounded-xl hover:bg-[#002d5a] transition-colors"
                  >
                    Đăng nhập / Đăng ký
                  </button>
                </div>
              </div>
            )}

            {/* Notifications Content */}
            <div className="px-6 py-4 flex items-center justify-between border-b border-slate-50">
              <h3 className="text-base font-bold text-slate-900">Thông báo</h3>
              {unreadCount > 0 && (
                <button 
                  onClick={onMarkAllRead}
                  className="text-xs font-bold text-[#003B73] hover:underline"
                >
                  Đánh dấu đã đọc tất cả ({unreadCount})
                </button>
              )}
            </div>

            {/* Tabs */}
            <div className="px-6 py-3 flex gap-2">
              <button 
                onClick={() => setActiveTab('all')}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${activeTab === 'all' ? 'bg-[#003B73] text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
              >
                Tất cả
              </button>
              <button 
                onClick={() => setActiveTab('order')}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${activeTab === 'order' ? 'bg-[#003B73] text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
              >
                Đơn hàng
              </button>
            </div>

            {/* Notification List */}
            <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
              {filteredNotifications.length > 0 ? (
                filteredNotifications.map((n) => (
                  <div 
                    key={n.id}
                    className={`px-6 py-5 border-b border-slate-50 flex gap-4 transition-colors hover:bg-slate-50 ${!n.read ? 'bg-blue-50/30' : ''}`}
                  >
                    <div className="shrink-0 relative">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${n.type === 'order' ? 'bg-orange-100 text-orange-600' : n.icon === 'success' ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-500'}`}>
                        {n.type === 'order' ? <Package size={22} /> : n.icon === 'success' ? <Truck size={22} /> : <Bell size={22} />}
                      </div>
                      {!n.read && <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />}
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-[13px] font-medium text-slate-800 leading-snug">
                        {n.message.split(n.orderId || '').map((part, i, arr) => (
                          <React.Fragment key={i}>
                            {part}
                            {i < arr.length - 1 && <span className="font-black text-slate-900">{n.orderId}</span>}
                          </React.Fragment>
                        ))}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-[11px] text-slate-400 font-bold">{n.time}</span>
                        <button 
                          onClick={() => {
                            const code = n.orderCode || n.orderId;
                            if (code) {
                              navigate(`/tai-khoan/don-hang/${code}`);
                              onClose();
                            }
                          }}
                          className="text-[11px] font-black text-blue-600 hover:underline uppercase tracking-widest"
                        >
                          Xem chi tiết
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-20 text-center px-8">
                  <Bell size={40} className="mx-auto text-slate-200 mb-4" />
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Không có thông báo nào</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-100">
              {userName ? (
                <button 
                  onClick={() => onLogout?.()}
                  className="w-full flex items-center justify-center gap-2 py-3 text-sm font-bold text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                >
                  <LogOut size={16} />
                  Đăng xuất
                </button>
              ) : (
                <button 
                  onClick={onClose}
                  className="w-full py-3 text-sm font-black text-slate-500 uppercase tracking-widest hover:bg-slate-50 rounded-xl transition-all"
                >
                  Đóng
                </button>
              )}
            </div>

            {/* Arrow Pointer */}
            <div className="absolute -top-2 right-10 w-4 h-4 bg-white rotate-45 border-l border-t border-slate-100" />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
