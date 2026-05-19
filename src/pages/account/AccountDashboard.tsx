import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Package, 
  CheckCircle, 
  Heart, 
  FileText,
  Truck,
  Receipt,
  Phone,
  ShoppingCart,
  Eye,
  ArrowRight,
  Plus
} from 'lucide-react';
import { AccountLayout } from './components/AccountLayout';
import { Breadcrumbs } from './components/Breadcrumbs';
import { StatCard } from './components/StatCard';
import { AccountCard } from './components/AccountCard';
import { Badge } from '../../components/ui/Badge';
import { useAuth } from '../../hooks/useAuth';
import { orderStorage } from '../../services/orderStorage';
import { 
  accountStats, 
  quickActions, 
  quickReorderProducts, 
  accountModules,
  orderStatusConfig,
  formatPrice,
  formatDate 
} from './data/accountData';
import { cn } from '../../lib/utils';

const AccountDashboard: React.FC = () => {
  const { user } = useAuth();
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      orderStorage.initDemoOrders(user.id, user.fullName);
      const orders = orderStorage.getOrders(user.id);
      setRecentOrders(orders.slice(0, 3));
    }
  }, [user]);

  // Build user info from auth
  const userInfo = user
    ? { id: user.id, name: user.fullName, email: user.email, role: 'Khách hàng Mecsu' }
    : null;

  return (
    <AccountLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <Breadcrumbs />
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 mt-2">
            Tài khoản của tôi
          </h1>
          <p className="text-slate-500 mt-1">
            Quản lý đơn hàng, báo giá, địa chỉ giao hàng và thông tin doanh nghiệp.
          </p>
        </div>

        {/* Stats Overview Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={Package}
            value={accountStats.openOrders}
            label="Đơn hàng đang xử lý"
            iconColor="yellow"
          />
          <StatCard
            icon={CheckCircle}
            value={accountStats.completedOrders}
            label="Đơn hàng hoàn tất"
            iconColor="green"
            trend={{ value: 12, isPositive: true }}
          />
          <StatCard
            icon={Heart}
            value={accountStats.wishlistItems}
            label="Sản phẩm yêu thích"
            iconColor="red"
          />
          <StatCard
            icon={FileText}
            value={accountStats.quotes}
            label="Báo giá"
            iconColor="blue"
          />
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl border border-[#E5EAF2] p-5">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Thao tác nhanh</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.id}
                  to={action.href}
                  className={cn(
                    "flex flex-col items-center gap-2 p-4 rounded-xl border border-[#E5EAF2] hover:border-[#163F78]/30 transition-all duration-300 group text-center",
                    action.variant === 'primary'
                      ? "bg-[#163F78] border-[#163F78] hover:bg-[#1a4a8a]"
                      : "bg-white hover:border-[#163F78]/30"
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110",
                    action.variant === 'primary'
                      ? "bg-white/20 text-white"
                      : "bg-slate-100 text-slate-600 group-hover:bg-[#163F78]/10 group-hover:text-[#163F78]"
                  )}>
                    <Icon size={20} />
                  </div>
                  <div className="space-y-0.5">
                    <span className={cn(
                      "block text-sm font-medium line-clamp-2",
                      action.variant === 'primary' ? "text-white" : "text-slate-700"
                    )}>
                      {action.label}
                    </span>
                    {action.subtitle && (
                      <span className={cn(
                        "block text-[11px] line-clamp-1",
                        action.variant === 'primary' ? "text-white/70" : "text-slate-400"
                      )}>
                        {action.subtitle}
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-2xl border border-[#E5EAF2] p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900">Đơn hàng gần đây</h2>
            <Link 
              to="/tai-khoan/don-hang"
              className="flex items-center gap-1 text-sm font-medium text-[#163F78] hover:text-[#1a4a8a] transition-colors"
            >
              Xem tất cả
              <ArrowRight size={16} />
            </Link>
          </div>
          
          <div className="space-y-4">
            {recentOrders.map((order) => {
              const status = orderStatusConfig[order.status];
              return (
                <div 
                  key={order.id}
                  className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl border border-[#E5EAF2] hover:border-[#163F78]/30 transition-all"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
                      <Package size={20} className="text-slate-400" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900">{order.orderCode}</span>
                        <Badge 
                          variant={status.variant}
                          className="text-xs"
                          style={{ backgroundColor: `${status.color}20`, color: status.color }}
                        >
                          {status.label}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-500 mt-0.5">
                        {formatDate(order.orderDate)} • {order.items.length} sản phẩm
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-[#163F78] text-lg">
                      {formatPrice(order.totalAmount)}
                    </span>
                    <Link
                      to={`/don-hang/${order.id}`}
                      className="flex items-center gap-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-sm font-medium text-slate-700 transition-colors"
                    >
                      <Eye size={16} />
                      Chi tiết
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Reorder */}
        <div className="bg-white rounded-2xl border border-[#E5EAF2] p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900">Mua lại nhanh</h2>
            <Link 
              to="/tai-khoan/don-hang?tab=reorder"
              className="flex items-center gap-1 text-sm font-medium text-[#163F78] hover:text-[#1a4a8a] transition-colors"
            >
              Xem tất cả
              <ArrowRight size={16} />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {quickReorderProducts.map((product) => (
              <div 
                key={product.id}
                className="group rounded-xl border border-[#E5EAF2] overflow-hidden hover:border-[#163F78]/30 transition-all duration-300"
              >
                <div className="aspect-square bg-slate-50 relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-slate-200 rounded-lg" />
                  </div>
                  <div className="absolute top-2 right-2">
                    <span className={cn(
                      "px-2 py-1 text-xs font-semibold rounded-full",
                      product.stock > 100 
                        ? "bg-green-100 text-green-600"
                        : product.stock > 0
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-red-100 text-red-600"
                    )}>
                      {product.stock > 0 ? 'Còn hàng' : 'Hết hàng'}
                    </span>
                  </div>
                </div>
                <div className="p-3">
                  <h4 className="text-sm font-medium text-slate-900 line-clamp-2 group-hover:text-[#163F78] transition-colors">
                    {product.name}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">SKU: {product.sku}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="font-bold text-[#163F78]">
                      {formatPrice(product.price)}
                    </span>
                    <button
                      className="p-2 bg-[#FFC72C] hover:bg-[#E8B931] rounded-lg transition-colors"
                      title="Thêm vào giỏ"
                    >
                      <ShoppingCart size={16} className="text-[#111827]" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Account Modules Grid */}
        <div className="bg-white rounded-2xl border border-[#E5EAF2] p-5">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Quản lý tài khoản</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {accountModules.map((module) => (
              <AccountCard
                key={module.id}
                icon={module.icon}
                title={module.title}
                description={module.description}
                href={module.href}
                iconColor={module.iconColor}
              />
            ))}
          </div>
        </div>
      </div>
    </AccountLayout>
  );
};

export default AccountDashboard;
