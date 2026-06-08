import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Menu } from 'lucide-react';
import { AccountLayout } from './components/AccountLayout';
import { OrderTabs } from './components/OrderTabs';
import { OrdersTab } from './components/OrdersTab';
import { ReorderItemsTab } from './components/ReorderItemsTab';
import { ReturnsTab } from './components/ReturnsTab';
import { useAuth } from '../../hooks/useAuth';
import { orderStorage } from '../../services/orderStorage';
import { Order, ReorderItem, ReturnRequest } from '../../types';

type TabId = 'orders' | 'reorder' | 'returns';

const OrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabId>('orders');
  const { user } = useAuth();

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
      <div className="space-y-4">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">
            Đơn hàng của tôi
          </h1>
          <p className="text-slate-500 mt-1">
            Theo dõi đơn hàng, mua lại sản phẩm và quản lý đổi trả dễ dàng.
          </p>
        </div>

        {/* Tabs */}
        <div>
          <OrderTabs 
            activeTab={activeTab} 
            onTabChange={setActiveTab}
            counts={counts}
          />
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
