import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Menu } from 'lucide-react';
import { AccountLayout } from './components/AccountLayout';
import { Breadcrumbs } from './components/Breadcrumbs';
import { OrderTabs } from './components/OrderTabs';
import { OrdersTab } from './components/OrdersTab';
import { ReorderItemsTab } from './components/ReorderItemsTab';
import { ReturnsTab } from './components/ReturnsTab';
import { useAuth } from '../../hooks/useAuth';
import { orderStorage } from '../../services/orderStorage';
import { Order, ReorderItem, ReturnRequest } from '../../types';
import { cn } from '../../lib/utils';

type TabId = 'orders' | 'reorder' | 'returns';

const OrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabId>('orders');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSticky, setIsSticky] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  // Track scroll position for sticky effect
  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setIsSticky(rect.top <= 0);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Load orders from localStorage
  const [orders, setOrders] = useState<Order[]>([]);
  const [reorderItems, setReorderItems] = useState<ReorderItem[]>([]);

  useEffect(() => {
    if (user) {
      orderStorage.initDemoOrders(user.id, user.fullName);
      setOrders(orderStorage.getOrders(user.id));
      setReorderItems(orderStorage.getReorderItems(user.id));
    } else {
      setOrders([]);
      setReorderItems([]);
    }
  }, [user]);

  // Demo return requests (static for now)
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
    navigate(`/tai-khoan/don-hang/doi-tra/${requestId}`);
  };

  const handleCreateReturn = (orderId?: string) => {
    navigate('/tai-khoan/don-hang/doi-tra/tao-moi');
  };

  const counts = {
    orders: orders.length,
    reorder: reorderItems.length,
    returns: returnRequests.length,
  };

  return (
    <AccountLayout>
      <div className="space-y-6" ref={containerRef}>
        {/* Page Header */}
        <div>
          <Breadcrumbs items={[{ label: 'Đơn hàng' }]} />
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 mt-2">
            Đơn hàng của tôi
          </h1>
          <p className="text-slate-500 mt-1">
            Theo dõi đơn hàng, mua lại sản phẩm và quản lý đổi trả dễ dàng.
          </p>
        </div>

        {/* Sticky Tabs + Search Container */}
        <div className={cn(
          "bg-slate-50 -mx-4 lg:-mx-6 px-4 lg:px-6 py-4 transition-all duration-300 z-10",
          isSticky && "sticky top-[60px] lg:top-[72px] shadow-sm border-b border-[#E5EAF2]"
        )}>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            {/* Tabs */}
            <OrderTabs 
              activeTab={activeTab} 
              onTabChange={setActiveTab}
              counts={counts}
            />
            
            {/* Search Bar */}
            <div className="relative w-full sm:w-64 lg:w-72">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm kiếm đơn hàng..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E5EAF2] rounded-xl text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#163F78]/20 focus:border-[#163F78] transition-all"
              />
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div>
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
        </div>
      </div>
    </AccountLayout>
  );
};

export default OrdersPage;
