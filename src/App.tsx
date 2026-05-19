/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, Suspense, lazy } from 'react';
import { Routes, Route, useNavigate, useLocation, useParams, Navigate } from 'react-router-dom';
import Header from './components/Header';
import { PRODUCTS, BLOG_POSTS } from './constants';
import { motion, AnimatePresence } from 'motion/react';
import { useScroll } from 'motion/react';
import { Product, BlogPost } from './types';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { cartService } from './features/cart/services/cartService';
import { orderStorage } from './services/orderStorage';
import { generateProductUrl, toSlug, parseSkuFromUrl } from './lib/utils';

// Lazy loaded components
const Home = lazy(() => import('./pages/Home'));
const ProductPage = lazy(() => import('./components/ProductPage'));
const CartPage = lazy(() => import('./components/CartPage'));
const CheckoutPage = lazy(() => import('./components/CheckoutPage'));
const CategoriesPage = lazy(() => import('./components/CategoriesPage'));
const BlogPage = lazy(() => import('./components/BlogPage'));
const BlogPostDetailPage = lazy(() => import('./components/BlogPostDetailPage'));
const CustomerServicePage = lazy(() => import('./components/CustomerServicePage'));
const FAQDetailPage = lazy(() => import('./components/FAQDetailPage'));
const AboutUsPage = lazy(() => import('./components/AboutUsPage'));
const ResourceHubPage = lazy(() => import('./components/ResourceHubPage'));
const ResourceHubNavbar = lazy(() => import('./components/resource-hub/ResourceHubNavbar'));
const ResourceHubFooter = lazy(() => import('./components/resource-hub/ResourceHubFooter'));
const Footer = lazy(() => import('./components/Footer'));
const OrderTrackingModal = lazy(() => import('./components/OrderTrackingModal'));
const CategoryPage = lazy(() => import('./pages/CategoryPage'));
const SubcategoryPage = lazy(() => import('./pages/SubcategoryPage'));
const SearchResults = lazy(() => import('./pages/SearchResults'));
const QuickViewModal = lazy(() => import('./components/QuickViewModal'));
const AccountOrdersPage = lazy(() => import('./pages/account/AccountOrdersPage'));
const AccountDashboard = lazy(() => import('./pages/account/AccountDashboard'));
const OrdersPage = lazy(() => import('./pages/account/OrdersPage'));
const OrderDetailPage = lazy(() => import('./pages/account/OrderDetailPage'));
const ReturnDetailPage = lazy(() => import('./pages/account/ReturnDetailPage'));
const CreateReturnPage = lazy(() => import('./pages/account/CreateReturnPage'));
const AddressesPage = lazy(() => import('./pages/account/AddressesPage'));
const QuotesPage = lazy(() => import('./pages/account/EmptyStatePage').then(m => ({ default: m.QuotesPage })));
const PaymentMethodsPage = lazy(() => import('./pages/account/EmptyStatePage').then(m => ({ default: m.PaymentMethodsPage })));
const WishlistPage = lazy(() => import('./pages/account/EmptyStatePage').then(m => ({ default: m.WishlistPage })));
const ReturnsPage = lazy(() => import('./pages/account/EmptyStatePage').then(m => ({ default: m.ReturnsPage })));

// UI Components
import OrderSuccessPage from './components/OrderSuccessPage';

interface CartItem {
  product: Product;
  quantity: number;
}

interface Notification {
  id: string;
  type: 'order' | 'system' | 'shipping';
  message: string;
  time: string;
  read: boolean;
  orderId?: string;
  orderCode?: string; // orderCode for navigating to order detail
  icon?: string;
}

const ScrollToTop = () => {
  const { pathname } = useLocation();

  React.useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'auto'
    });
  }, [pathname]);

  return null;
};

// Unified route handler - decides which page to render based on URL
// All URLs except defined routes fall through to category/subcategory listing
const UnifiedRouteHandler = ({ onBack, onAddToCart, onSelectRelated }: any) => {
  const { categorySlug, subcategorySlug, subSubcategorySlug } = useParams();

  // If URL has sub-subcategory: /:categorySlug/:subcategorySlug/:subSubcategorySlug
  if (subcategorySlug && subSubcategorySlug) {
    return <SubcategoryPage onAddToCart={onAddToCart} />;
  }

  // If URL has subcategory: /:categorySlug/:subcategorySlug
  if (subcategorySlug) {
    return <SubcategoryPage onAddToCart={onAddToCart} />;
  }

  // If URL has category: /:categorySlug
  if (categorySlug) {
    return <CategoryPage />;
  }

  // Fallback to home
  return <Navigate to="/" />;
};

const BlogPostPageRoute = ({ onBack }: any) => {
  const { id } = useParams();
  const post = BLOG_POSTS.find(p => p.id === id);
  if (!post) return <Navigate to="/blog-ky-thuat" />;
  return <BlogPostDetailPage post={post} onBack={onBack} />;
};

const ProductDetailRoute = ({ onBack, onAddToCart, onSelectRelated }: any) => {
  const { productId } = useParams();
  // First try to find product in static PRODUCTS array
  let product = PRODUCTS.find(p => p.id === productId);
  
  // If not found, try to get from sessionStorage (for mock products)
  if (!product) {
    try {
      const stored = sessionStorage.getItem('selectedProduct');
      if (stored) {
        product = JSON.parse(stored);
        // Verify the ID matches
        if (product.id !== productId) {
          product = null;
        }
      }
    } catch (e) {
      console.log('[DEBUG] Error parsing stored product:', e);
    }
  }
  
  console.log('[DEBUG] productId:', productId);
  console.log('[DEBUG] found product:', product?.name);
  if (!product) return <Navigate to="/" />;
  return (
    <ProductPage
      product={product}
      onBack={onBack}
      onAddToCart={onAddToCart}
      onSelectRelated={onSelectRelated}
    />
  );
};


import { PageSkeleton } from './components/PageSkeleton';

// Cart management component that needs access to Auth context
const CartApp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { scrollY } = useScroll();
  const { isLoggedIn, user } = useAuth();
  const [isAtTop, setIsAtTop] = useState(true);

  // Use ref to track previous login state
  const prevIsLoggedInRef = React.useRef(isLoggedIn);

  // Initialize cart from localStorage based on user context
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    return cartService.loadFromStorage(user?.id);
  });

  // Load cart when user login state changes
  React.useEffect(() => {
    const items = cartService.loadFromStorage(user?.id);
    setCartItems(items);
  }, [isLoggedIn, user?.id]);

  // Save cart to localStorage whenever it changes
  React.useEffect(() => {
    cartService.saveToStorage(cartItems, user?.id);
  }, [cartItems, user?.id]);

  // Clear cart from localStorage when user logs out
  React.useEffect(() => {
    const prevIsLoggedIn = prevIsLoggedInRef.current;
    
    if (prevIsLoggedIn && !isLoggedIn) {
      // User just logged out - clear their cart from localStorage
      if (user) {
        cartService.clearStorage(user.id);
      }
      setCartItems([]);
    }
    
    prevIsLoggedInRef.current = isLoggedIn;
  }, [isLoggedIn, user]);

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '2',
      type: 'shipping',
      message: 'Đơn hàng 01175S2509001043 vừa được giao thành công. Cảm ơn bạn đã đặt hàng tại Mecsu.',
      time: '2 tháng trước',
      read: true,
      icon: 'success'
    }
  ]);

  React.useEffect(() => {
    const unsubscribe = scrollY.on("change", (latest) => {
      const isTop = latest < 50;
      setIsAtTop(prev => prev !== isTop ? isTop : prev);
    });
    return () => unsubscribe();
  }, [scrollY]);

  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [isSearchSticky, setIsSearchSticky] = useState(false);
  const [lastOrder, setLastOrder] = useState<any>(null);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [cartPopupItem, setCartPopupItem] = useState<{ product: Product, quantity: number } | null>(null);
  const [orderJustCompleted, setOrderJustCompleted] = useState(false);
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);

  React.useEffect(() => {
    if (cartPopupItem) {
      const timer = setTimeout(() => {
        setCartPopupItem(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [cartPopupItem]);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  const handleNavigateToCart = React.useCallback(() => {
    navigate('/gio-hang');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [navigate]);

  const handleAddToCart = React.useCallback((product: Product, quantity: number) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + quantity } 
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    setCartPopupItem({ product, quantity });
  }, []);

  const handleUpdateCartQuantity = React.useCallback((productId: string, quantity: number) => {
    setCartItems(prev => prev.map(item => 
      item.product.id === productId ? { ...item, quantity } : item
    ));
  }, []);

  const handleRemoveFromCart = React.useCallback((productId: string) => {
    setCartItems(prev => prev.filter(item => item.product.id !== productId));
  }, []);

  const handleQuickView = React.useCallback((product: Product) => {
    setSelectedProduct(product);
    setIsQuickViewOpen(true);
  }, []);

  const handleNavigateToDetails = React.useCallback((product: Product) => {
    // Store product data in sessionStorage for the detail page
    sessionStorage.setItem('selectedProduct', JSON.stringify(product));
    setIsQuickViewOpen(false);
    // Navigate to the product detail page using proper routing
    const url = `/san-pham/${product.id}`;
    navigate(url);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [navigate]);

  const handleNavigateToCheckout = React.useCallback(() => {
    navigate('/thanh-toan');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [navigate]);

  const handleOrderComplete = (orderData: any) => {
    // Debug log for selectedAddress data
    console.log("selectedAddress before create order:", orderData.shippingAddress);
    console.log("currentUser:", user);

    // Save order to orderStorage if user is logged in
    if (user) {
      // Normalize shippingAddress - get receiverName and phone from shippingAddress object
      const normalizedShippingAddress = orderData.shippingAddress || {};
      const receiverName = normalizedShippingAddress.receiverName ||
        normalizedShippingAddress.name ||
        normalizedShippingAddress.fullName ||
        user.fullName ||
        orderData.fullName ||
        "";

      const phone = normalizedShippingAddress.phone ||
        normalizedShippingAddress.phoneNumber ||
        user.phone ||
        orderData.phone ||
        "";

      const order = orderStorage.createOrderFromCheckout({
        orderId: orderData.orderId,
        shippingAddress: normalizedShippingAddress,
        items: orderData.items,
        subtotal: orderData.subtotal,
        shippingFee: orderData.shippingFee,
        b2bDiscount: orderData.b2bDiscount,
        vatAmount: orderData.vatAmount,
        total: orderData.total,
        paymentMethod: orderData.paymentMethod,
        recipientName: receiverName,
        phone: phone,
      });
      orderStorage.addOrder(user.id, order);
      console.log("Order saved to storage:", order);
    }

    setLastOrder(orderData);
    setCartItems([]);
    setOrderJustCompleted(true);
    navigate('/thanh-cong');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const newNotification: Notification = {
      id: Date.now().toString(),
      type: 'order',
      message: `Cảm ơn bạn đã đặt hàng. Đơn hàng ${orderData.orderId} của bạn đang được xử lý.`,
      time: 'Vừa xong',
      read: false,
      orderId: orderData.orderId,
      orderCode: orderData.orderId,
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const handleNavigateToCategories = React.useCallback(() => {
    navigate('/danh-muc-san-pham');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [navigate]);

  const handleSelectCategory = React.useCallback((category: any) => {
    setSelectedCategory(category);
    navigate('/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [navigate]);

  const handleNavigateToBlog = React.useCallback(() => {
    navigate('/blog-ky-thuat');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [navigate]);

  const handleNavigateToCustomerService = React.useCallback(() => {
    navigate('/dich-vu-khach-hang');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [navigate]);

  const handleNavigateToBlogDetail = React.useCallback((post: BlogPost) => {
    navigate(`/blog-ky-thuat/${post.id}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [navigate]);

  const handleBackToHome = React.useCallback(() => {
    navigate('/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [navigate]);

  const filteredProducts = React.useMemo(() => {
    return selectedCategory 
      ? PRODUCTS.filter(p => p.category === selectedCategory.name)
      : PRODUCTS;
  }, [selectedCategory]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  React.useEffect(() => {
    setCurrentPage(1); // reset when category changes
  }, [selectedCategory]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const displayedProducts = React.useMemo(() => {
    return filteredProducts.slice(
      0,
      currentPage * itemsPerPage
    );
  }, [filteredProducts, currentPage, itemsPerPage]);

const isResourceHubRoute = location.pathname.startsWith('/resource-hub');
const isBlogRoute = location.pathname.startsWith('/blog');
const isCartView = false; // Always render Header and Footer

  return (
    <div className="min-h-screen flex flex-col font-sans bg-premium-bg">
      <ScrollToTop />
      {!isBlogRoute && !isResourceHubRoute && (
        <Header 
          onLogoClick={handleBackToHome} 
          onCartClick={handleNavigateToCart}
          cartCount={cartCount} 
          cartTotal={cartTotal}
          isCartView={isCartView}
          isSearchSticky={isSearchSticky}
          notifications={notifications}
          onMarkAllRead={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
          isCategoryOpen={isCategoryOpen}
          setIsCategoryOpen={setIsCategoryOpen}
          cartPopupItem={cartPopupItem}
          onCloseCartPopup={() => setCartPopupItem(null)}
          onNavigateToCheckout={handleNavigateToCheckout}
          onAddToCart={handleAddToCart}
          isHomePage={location.pathname === '/'}
          orderJustCompleted={orderJustCompleted}
          onOrderAnimationComplete={() => setOrderJustCompleted(false)}
        />
      )}

      {/* Resource Hub Navbar */}
      {isResourceHubRoute && (
        <Suspense fallback={<div className="h-16 bg-white border-b border-slate-100" />}>
          <ResourceHubNavbar onLogoClick={handleBackToHome} />
        </Suspense>
      )}

      <AnimatePresence>
        <Suspense fallback={<PageSkeleton />}>
          {activeProduct ? (
            <ProductPage
              product={activeProduct}
              onBack={() => setActiveProduct(null)}
              onAddToCart={handleAddToCart}
              onSelectRelated={handleNavigateToDetails}
            />
          ) : (
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={
              <Home 
                displayedProducts={displayedProducts}
                filteredProducts={filteredProducts}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                itemsPerPage={itemsPerPage}
                totalPages={totalPages}
                handleAddToCart={handleAddToCart}
                handleQuickView={handleQuickView}
                handleNavigateToDetails={handleNavigateToDetails}
                handleNavigateToCategories={handleNavigateToCategories}
                setIsTrackingOpen={setIsTrackingOpen}
                setIsSearchSticky={setIsSearchSticky}
              />
            } />

            <Route path="/gio-hang" element={
              <CartPage 
                items={cartItems}
                onBack={handleBackToHome}
                onUpdateQuantity={handleUpdateCartQuantity}
                onRemoveItem={handleRemoveFromCart}
                onCheckout={handleNavigateToCheckout}
              />
            } />
  
            <Route path="/thanh-toan" element={
              <CheckoutPage 
                items={cartItems}
                onBack={handleNavigateToCart}
                onOrderComplete={handleOrderComplete}
              />
            }             />
  
            <Route path="/blog-ky-thuat" element={
              <BlogPage 
                onBackToHome={handleBackToHome}
                onPostClick={handleNavigateToBlogDetail}
              />
            } />
  
            <Route path="/blog-ky-thuat/:id" element={
              <BlogPostPageRoute 
                onBack={handleNavigateToBlog}
              />
            } />
  
            <Route path="/thanh-cong" element={
              lastOrder ? (
                <OrderSuccessPage lastOrder={lastOrder} />
              ) : (
                <Navigate to="/" />
              )
            } />

            <Route path="/danh-muc/:categoryId" element={
              <CategoryPage />
            } />

            <Route path="/danh-muc/:categoryId/:subSlug" element={
              <SubcategoryPage onAddToCart={handleAddToCart} />
            } />

            <Route path="/search" element={
              <SearchResults onAddToCart={handleAddToCart} />
            } />

            <Route path="/dich-vu-khach-hang" element={
              <CustomerServicePage />
            } />

            <Route path="/gioi-thieu" element={
              <AboutUsPage />
            } />

            <Route path="/resource-hub" element={
              <ResourceHubPage />
            } />

            <Route path="/faqs" element={
              <FAQDetailPage />
            } />

            <Route path="/faqs/:categoryId" element={
              <FAQDetailPage />
            } />

            <Route path="/tai-khoan" element={
              <AccountDashboard />
            } />

            <Route path="/tai-khoan/don-hang" element={
              <OrdersPage />
            } />

            <Route path="/tai-khoan/don-hang/:orderId" element={
              <OrderDetailPage />
            } />

            <Route path="/tai-khoan/don-hang/doi-tra" element={
              <ReturnDetailPage />
            } />

            <Route path="/tai-khoan/don-hang/doi-tra/:returnId" element={
              <ReturnDetailPage />
            } />

            <Route path="/tai-khoan/don-hang/doi-tra/tao-moi" element={
              <CreateReturnPage />
            } />

            <Route path="/tai-khoan/dia-chi" element={
              <AddressesPage />
            } />

            <Route path="/tai-khoan/bao-gia" element={
              <QuotesPage />
            } />

            <Route path="/tai-khoan/dia-chi" element={
              <AddressesPage />
            } />

            <Route path="/tai-khoan/thanh-toan" element={
              <PaymentMethodsPage />
            } />

            <Route path="/tai-khoan/danh-sach" element={
              <WishlistPage />
            } />

            <Route path="/tai-khoan/doi-tra" element={
              <ReturnsPage />
            } />

            <Route path="/san-pham/:productId" element={
              <ProductDetailRoute
                onBack={handleBackToHome}
                onAddToCart={handleAddToCart}
                onSelectRelated={handleNavigateToDetails}
              />
            } />
            
            <Route path="*" element={
              <UnifiedRouteHandler 
                onBack={handleBackToHome}
                onAddToCart={handleAddToCart}
                onSelectRelated={handleNavigateToDetails}
              />
            } />
          </Routes>
          )}
        </Suspense>
      </AnimatePresence>

      <QuickViewModal 
        product={selectedProduct} 
        isOpen={isQuickViewOpen} 
        onClose={() => {
          setIsQuickViewOpen(false);
          setSelectedProduct(null);
        }} 
        onAddToCart={handleAddToCart}
      />

      <OrderTrackingModal 
        isOpen={isTrackingOpen} 
        onClose={() => setIsTrackingOpen(false)} 
      />

      {!isBlogRoute && !isResourceHubRoute && (
        <Footer 
          onBlogClick={handleNavigateToBlog}
          onCustomerServiceClick={handleNavigateToCustomerService}
          isCategoryOpen={isCategoryOpen}
        />
      )}

      {/* Resource Hub Footer */}
      {isResourceHubRoute && (
        <Suspense fallback={null}>
          <ResourceHubFooter />
        </Suspense>
      )}
    </div>
  );
}

// Main App component that wraps CartApp with AuthProvider
export default function App() {
  return (
    <AuthProvider>
      <CartApp />
    </AuthProvider>
  );
}
