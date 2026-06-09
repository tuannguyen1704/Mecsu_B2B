import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { AccountSidebar } from './AccountSidebar';
import { useAuth } from '../../../hooks/useAuth';

interface AccountLayoutProps {
  children?: React.ReactNode;
}

export const AccountLayout: React.FC<AccountLayoutProps> = ({ children }) => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F6F8FB]">
      {/* Mobile Header */}
      <div className="lg:hidden sticky top-0 z-30 bg-white border-b border-[#E5EAF2] px-4 py-3">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 -ml-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <Menu size={24} className="text-slate-700" />
          </button>
          <h1 className="font-bold text-[#163F78]">Tài khoản</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="mx-auto px-2 lg:px-3 pt-1 pb-3 lg:pt-2 lg:pb-4">
        {/* Main Layout */}
        <div className="flex gap-4 lg:gap-4 items-start">
          {/* Desktop Sidebar - Sticky */}
          {user && (
            <div className="hidden lg:block w-[280px] flex-shrink-0 self-start sticky top-4 max-h-[calc(100vh-1rem)]">
              <AccountSidebar 
                user={{
                  id: user.id,
                  name: user.fullName,
                  email: user.email,
                  role: 'Khách hàng Mecsu'
                }}
              />
            </div>
          )}

          {/* Content */}
          <main className="flex-1 min-w-0 w-full">
            {children}
          </main>
        </div>
      </div>

      {/* Mobile Sidebar */}
      {user && (
        <AccountSidebar
          variant="mobile"
          user={{
            id: user.id,
            name: user.fullName,
            email: user.email,
            role: 'Khách hàng Mecsu'
          }}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AccountLayout;
