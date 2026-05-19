import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  MapPin, 
  CreditCard, 
  Heart, 
  FileText, 
  RotateCcw,
  Shield, 
  User,
  HeadphonesIcon,
  Mail,
  LogOut,
  ChevronRight,
  X
} from 'lucide-react';
import { AccountUser } from '../../../types';
import { cn } from '../../../lib/utils';

interface AccountSidebarProps {
  user: AccountUser;
  isOpen?: boolean;
  onClose?: () => void;
  variant?: 'desktop' | 'mobile';
}

// Section data structure
interface MenuSection {
  id: string;
  label: string;
  items: {
    id: string;
    label: string;
    icon: React.ElementType;
    href: string;
  }[];
}

const menuSections: MenuSection[] = [
  {
    id: 'purchases',
    label: 'Mua hàng',
    items: [
      { id: 'overview', label: 'Tổng quan', icon: LayoutDashboard, href: '/tai-khoan' },
      { id: 'orders', label: 'Đơn hàng', icon: Package, href: '/tai-khoan/don-hang' },
      { id: 'quotes', label: 'Báo giá', icon: FileText, href: '/tai-khoan/bao-gia' },
      { id: 'wishlist', label: 'Danh sách yêu thích', icon: Heart, href: '/tai-khoan/danh-sach' },
    ],
  },
  {
    id: 'account',
    label: 'Tài khoản',
    items: [
      { id: 'addresses', label: 'Địa chỉ giao hàng', icon: MapPin, href: '/tai-khoan/dia-chi' },
      { id: 'payment', label: 'Phương thức thanh toán', icon: CreditCard, href: '/tai-khoan/thanh-toan' },
      { id: 'profile', label: 'Thông tin tài khoản', icon: User, href: '/tai-khoan/thong-tin-ca-nhan' },
      { id: 'security', label: 'Đăng nhập & bảo mật', icon: Shield, href: '/tai-khoan/bao-mat' },
    ],
  },
  {
    id: 'support',
    label: 'Hỗ trợ',
    items: [
      { id: 'support', label: 'Hỗ trợ khách hàng', icon: HeadphonesIcon, href: '/tai-khoan/ho-tro' },
      { id: 'marketing', label: 'Cài đặt email marketing', icon: Mail, href: '/tai-khoan/marketing-email' },
    ],
  },
];

const SidebarContent: React.FC<{ user: AccountUser; onClose?: () => void }> = ({ user, onClose }) => {
  const location = useLocation();
  
  const isActive = (href: string) => {
    // Exact match first
    if (location.pathname === href) return true;
    // For /tai-khoan, only match exact path (not sub-paths)
    if (href === '/tai-khoan') return false;
    // For other paths, match if pathname starts with href/
    return location.pathname.startsWith(href + '/');
  };
  
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <>
      {/* User Info */}
      <div className="p-6 border-b border-[#E5EAF2] bg-gradient-to-br from-[#163F78] to-[#1a4a8a]">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white font-bold text-lg flex-shrink-0 border-2 border-white/30">
            {getInitials(user.name)}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-white truncate">{user.name}</h3>
            <p className="text-sm text-white/80 truncate">{user.role}</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-3 overflow-y-auto">
        {menuSections.map((section) => (
          <div key={section.id} className="mb-3">
            {/* Section Label */}
            <div className="px-4 py-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              {section.label}
            </div>
            
            {/* Section Items */}
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                
                return (
                  <li key={item.id}>
                    <Link
                      to={item.href}
                      onClick={onClose}
                      className={cn(
                        "flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group",
                        active 
                          ? "bg-[#163F78] text-white" 
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      )}
                    >
                      <Icon 
                        size={18} 
                        className={cn(
                          "flex-shrink-0 transition-transform duration-200",
                          active ? "text-white" : "text-slate-400 group-hover:text-slate-600 group-hover:scale-110"
                        )} 
                      />
                      <span className="font-medium text-sm truncate">{item.label}</span>
                      {active && (
                        <ChevronRight size={14} className="ml-auto flex-shrink-0 text-white/70" />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}

        {/* Logout Button */}
        <div className="mt-4 pt-4 border-t border-[#E5EAF2]">
          <button
            className="flex items-center gap-3 px-4 py-2.5 w-full rounded-xl text-red-600 hover:bg-red-50 transition-all duration-200"
          >
            <LogOut size={18} className="flex-shrink-0" />
            <span className="font-medium text-sm">Đăng xuất</span>
          </button>
        </div>
      </nav>
    </>
  );
};

// Desktop Sidebar - always visible in the grid
export const DesktopSidebar: React.FC<{ user: AccountUser }> = ({ user }) => {
  return (
    <aside className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      <SidebarContent user={user} />
    </aside>
  );
};

// Mobile Sidebar - fixed overlay, only visible when isOpen
export const MobileSidebar: React.FC<{ user: AccountUser; isOpen: boolean; onClose: () => void }> = ({ user, isOpen, onClose }) => {
  if (!isOpen) return null;
  
  return (
    <>
      {/* Backdrop */}
      <div 
        className="lg:hidden fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <aside className="lg:hidden fixed inset-y-0 left-0 z-50 w-[280px] bg-white border-r border-slate-200">
        {/* Mobile Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#E5EAF2]">
          <span className="font-bold text-[#163F78]">Tài khoản</span>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X size={20} className="text-slate-600" />
          </button>
        </div>
        
        <SidebarContent user={user} onClose={onClose} />
      </aside>
    </>
  );
};

// Combined component for convenience
export const AccountSidebar: React.FC<AccountSidebarProps> = ({ user, isOpen, onClose, variant }) => {
  if (variant === 'desktop') {
    return <DesktopSidebar user={user} />;
  }
  if (variant === 'mobile') {
    return <MobileSidebar user={user} isOpen={isOpen || false} onClose={onClose || (() => {})} />;
  }
  
  // Default: return both
  return (
    <>
      <DesktopSidebar user={user} />
      <MobileSidebar user={user} isOpen={isOpen || false} onClose={onClose || (() => {})} />
    </>
  );
};

export default AccountSidebar;
