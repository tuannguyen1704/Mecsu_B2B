import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronRight, Bell, Package, CheckCircle2, Truck, User, LogIn, ArrowRight, FileText } from 'lucide-react';

interface Notification {
  id: string;
  type: 'order' | 'system' | 'shipping' | 'quotation';
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

type TabType = 'all' | 'order' | 'quotation';

export default function ProfilePopup({ isOpen, onClose, notifications, onMarkAllRead, onLoginClick, onLogout, userName }: ProfilePopupProps) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('all');

  const filteredNotifications = (() => {
    switch (activeTab) {
      case 'order':
        return notifications.filter(n => n.type === 'order' || n.type === 'shipping');
      case 'quotation':
        return notifications.filter(n => n.type === 'quotation' || n.type === 'system');
      default:
        return notifications;
    }
  })();

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-[290]"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="fixed right-6 top-[72px] z-[300] bg-white rounded-[20px] border border-[#E5E7EB] shadow-[0_20px_60px_rgba(15,23,42,0.18)] overflow-hidden w-[380px] max-w-[calc(100vw-24px)] max-h-[min(620px,calc(100vh-32px))] flex flex-col"
          >
            {/* Account Card */}
            {userName ? (
              <div
                className="flex items-center gap-3 px-4 py-3 bg-[#F8FAFC] border border-[#DCE7F5] rounded-[14px] mx-4 mt-4 cursor-pointer hover:bg-[#EFF6FF] hover:border-[#BFD4F2] transition-all group"
                style={{ minHeight: 56 }}
                onClick={() => {
                  navigate('/tai-khoan');
                  onClose();
                }}
              >
                <div className="w-9 h-9 rounded-full bg-[#173E75] text-white flex items-center justify-center font-bold text-[15px] shrink-0">
                  {userName.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-bold text-[#173E75] leading-tight truncate">{userName}</p>
                  <p className="text-[12px] text-[#6B7280] font-medium leading-tight">Truy cập tài khoản MECSU</p>
                </div>
                <ChevronRight size={16} className="text-[#173E75] shrink-0 group-hover:translate-x-0.5 transition-transform" />
              </div>
            ) : (
              <div
                className="flex items-center gap-3 px-4 py-3 bg-[#F8FAFC] border border-[#DCE7F5] rounded-[14px] mx-4 mt-4 cursor-pointer hover:bg-[#EFF6FF] hover:border-[#BFD4F2] transition-all group"
                style={{ minHeight: 56 }}
                onClick={() => {
                  onLoginClick?.();
                }}
              >
                <div className="w-9 h-9 rounded-full bg-[#E5E7EB] text-[#6B7280] flex items-center justify-center shrink-0">
                  <User size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-bold text-[#173E75] leading-tight">Đăng nhập MECSU</p>
                  <p className="text-[12px] text-[#6B7280] font-medium leading-tight">Đăng nhập để xem đơn hàng</p>
                </div>
                <ChevronRight size={16} className="text-[#173E75] shrink-0 group-hover:translate-x-0.5 transition-transform" />
              </div>
            )}

            {/* Title Row */}
            <div className="flex items-center justify-between px-5 pt-4 pb-3">
              <h3 className="text-[18px] font-bold text-[#111827]" style={{ lineHeight: 1.2 }}>Thông báo</h3>
              {unreadCount > 0 && (
                <button
                  onClick={onMarkAllRead}
                  className="text-[13px] font-medium text-[#2563EB] hover:text-[#1D4ED8] transition-colors"
                >
                  Đánh dấu đã đọc tất cả
                </button>
              )}
            </div>

            {/* Tabs */}
            <div className="flex gap-2 px-5 pb-3">
              {(['all', 'order', 'quotation'] as TabType[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 rounded-md text-[13px] font-medium transition-all ${
                    activeTab === tab
                      ? 'bg-[#173E75] text-white border border-[#173E75]'
                      : 'bg-white text-[#475569] border border-[#CBD5E1] hover:border-[#94A3B8]'
                  }`}
                >
                  {tab === 'all' ? 'Tất cả' : tab === 'order' ? 'Đơn hàng' : 'Báo giá'}
                </button>
              ))}
            </div>

            {/* Notification List */}
            <div className="flex-shrink-0 overflow-y-auto flex flex-col" style={{
              height: 360,
              minHeight: 360,
              scrollbarWidth: 'thin',
              scrollbarColor: '#CBD5E1 transparent',
            }}>
              <style>{`
                .notif-scroll::-webkit-scrollbar { width: 4px; }
                .notif-scroll::-webkit-scrollbar-track { background: transparent; }
                .notif-scroll::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 99px; }
                .notif-scroll::-webkit-scrollbar-thumb:hover { background: #94A3B8; }
              `}</style>
              {filteredNotifications.length > 0 ? (
                filteredNotifications.map((n) => {
                  const iconBg = n.type === 'shipping' || n.icon === 'success'
                    ? 'bg-[#ECFDF3]'
                    : n.type === 'quotation'
                    ? 'bg-[#F0F9FF]'
                    : 'bg-[#EFF6FF]';
                  const iconColor = n.type === 'shipping' || n.icon === 'success'
                    ? '#16A34A'
                    : n.type === 'quotation'
                    ? '#0369A1'
                    : '#173E75';
                  const Icon = n.type === 'shipping' || n.icon === 'success'
                    ? CheckCircle2
                    : n.type === 'quotation'
                    ? FileText
                    : n.type === 'order'
                    ? Package
                    : Bell;

                  return (
                    <div
                      key={n.id}
                      className={`mb-2 last:mb-0 py-4 border border-[#F1F5F9] flex gap-3 cursor-pointer transition-colors hover:bg-[#F8FAFC] rounded-md ${!n.read ? 'bg-[#F8FBFF]' : ''}`}
                      onClick={() => {
                        if (n.orderId) {
                          navigate(`/tai-khoan/don-hang/${n.orderId}`);
                          onClose();
                        }
                      }}
                    >
                      {/* Icon */}
                      <div className={`w-[38px] h-[38px] rounded-lg flex items-center justify-center shrink-0 ${iconBg}`}>
                        <Icon size={18} color={iconColor} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        {/* Unread dot */}
                        {!n.read && (
                          <span className="inline-block w-2 h-2 rounded-full bg-[#173E75] mb-0.5" />
                        )}

                        <p className="text-[13px] text-[#374151] leading-[18px]">
                          {n.message.split(n.orderId || '').map((part, i, arr) => (
                            <React.Fragment key={i}>
                              {part}
                              {i < arr.length - 1 && n.orderId && (
                                <span className="font-bold text-[#1F2937]">{n.orderId}</span>
                              )}
                            </React.Fragment>
                          ))}
                        </p>

                        {/* Time + Action Row */}
                        <div className="flex items-center justify-between mt-1.5">
                          <span className="text-[12px] text-[#94A3B8]">{n.time}</span>
                          {n.orderId && (
                            <span className="text-[12px] font-semibold text-[#2563EB]">Xem chi tiết</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <Bell size={36} className="mx-auto text-[#E5E7EB] mb-3" />
                    <p className="text-[13px] font-medium text-[#94A3B8]">Không có thông báo nào</p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="shrink-0 border-t border-[#E5E7EB]">
              {userName ? (
                <button
                  onClick={() => onLogout?.()}
                  className="w-full flex items-center justify-center gap-2 h-14 text-[15px] font-bold text-[#DC2626] hover:bg-[#F8FAFC] transition-colors"
                >
                  <LogIn size={16} className="rotate-180" />
                  Đăng xuất
                </button>
              ) : (
                <button
                  onClick={onClose}
                  className="w-full h-14 text-[15px] font-bold text-[#173E75] hover:bg-[#F8FAFC] transition-colors"
                >
                  Đóng
                </button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
