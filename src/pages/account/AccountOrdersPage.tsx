import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { DesktopSidebar, MobileSidebar } from './components/AccountSidebar';
import { Breadcrumbs } from './components/Breadcrumbs';
import { OrderTabs } from './components/OrderTabs';
import { OrdersTab } from './components/OrdersTab';
import { ReorderItemsTab } from './components/ReorderItemsTab';
import { ReturnsTab } from './components/ReturnsTab';
import { useAuth } from '../../hooks/useAuth';
import { orderStorage } from '../../services/orderStorage';
import { Order, ReorderItem, ReturnRequest } from '../../types';

type TabId = 'orders' | 'reorder' | 'returns';

const AccountOrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabId>('orders');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();

  // Load orders from localStorage
  const [orders, setOrders] = useState<Order[]>([]);
  const [reorderItems, setReorderItems] = useState<ReorderItem[]>([]);

  useEffect(() => {
    if (user) {
      // Initialize demo orders if user has no orders yet
      orderStorage.initDemoOrders(user.id, user.fullName);
      setOrders(orderStorage.getOrders(user.id));
      setReorderItems(orderStorage.getReorderItems(user.id));
    } else {
      setOrders([]);
      setReorderItems([]);
    }
  }, [user]);

  // Demo return requests (static for now, would come from API)
  const returnRequests: ReturnRequest[] = [];

  const handleViewOrderDetails = (orderId: string) => {
    navigate(`/tai-khoan/don-hang/${orderId}`);
  };

  const handleReorder = (orderId: string) => {
    console.log('Reorder:', orderId);
  };

  const handleTrackShipping = (orderId: string) => {
    console.log('Track:', orderId);
  };

  const handleAddToCart = (item: ReorderItem) => {
    console.log('Add to cart:', item);
  };

  const handleViewReturnDetails = (requestId: string) => {
    console.log('View return:', requestId);
  };

  const handleCreateReturn = () => {
    console.log('Create return request');
  };

  const counts = {
    orders: orders.length,
    reorder: reorderItems.length,
    returns: returnRequests.length,
  };

  const breadcrumbsItems = [
    { label: 'Trang chủ', href: '/' },
    { label: 'Tài khoản', href: '/tai-khoan' },
    { label: 'Đơn hàng' },
  ];

  // Build user info for sidebar from auth
  const userInfo = user
    ? { id: user.id, name: user.fullName, email: user.email, role: 'Khách hàng Mecsu' }
    : { id: '', name: 'Guest', email: '', role: 'Guest' };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile Header */}
      <div className="lg:hidden sticky top-0 z-30 bg-white border-b border-[#E5EAF2] px-4 py-3">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 -ml-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <Menu size={24} className="text-slate-700" />
          </button>
          <h1 className="font-bold text-[#163F78]">Đơn hàng của tôi</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 lg:px-6 py-6 lg:py-8">
        {/* Breadcrumbs */}
        <div className="mb-6">
          <Breadcrumbs items={breadcrumbsItems} />
        </div>

        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-2">
            Đơn hàng của tôi
          </h1>
          <p className="text-slate-500">
            Theo dõi đơn hàng, mua lại sản phẩm và quản lý đổi trả dễ dàng.
          </p>
        </div>

        {/* Main Layout - Flex */}
        <div className="flex gap-6 lg:gap-8 items-start">
          {/* Desktop Sidebar - always visible on lg+ */}
          <DesktopSidebar user={userInfo} />

          {/* Content - takes remaining space */}
          <main className="flex-1 min-w-0 w-full">
            {/* Tabs */}
            <div className="mb-6">
              <OrderTabs 
                activeTab={activeTab} 
                onTabChange={setActiveTab}
                counts={counts}
              />
            </div>

            {/* Tab Content */}
            {activeTab === 'orders' && (
              <OrdersTab
                orders={orders}
                onViewDetails={handleViewOrderDetails}
                onReorder={handleReorder}
                onTrackShipping={handleTrackShipping}
              />
            )}
            {activeTab === 'reorder' && (
              <ReorderItemsTab
                items={reorderItems}
                onAddToCart={handleAddToCart}
                onReorder={handleReorder}
              />
            )}
            {activeTab === 'returns' && (
              <ReturnsTab
                requests={returnRequests}
                onViewDetails={handleViewReturnDetails}
                onCreateRequest={handleCreateReturn}
              />
            )}
          </main>
        </div>
      </div>

      {/* Mobile Sidebar - only rendered when isOpen */}
      <MobileSidebar 
        user={userInfo} 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />
    </div>
  );
};

export default AccountOrdersPage;
