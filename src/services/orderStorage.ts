import { Order } from '../types';

const STORAGE_PREFIX = 'mecsu_orders_';

export const orderStorage = {
  /**
   * Get orders for a specific user from localStorage
   */
  getOrders(userId: string): Order[] {
    if (!userId) return [];
    const stored = localStorage.getItem(STORAGE_PREFIX + userId);
    return stored ? JSON.parse(stored) : [];
  },

  /**
   * Save orders for a specific user to localStorage
   */
  saveOrders(userId: string, orders: Order[]): void {
    if (!userId) return;
    localStorage.setItem(STORAGE_PREFIX + userId, JSON.stringify(orders));
  },

  /**
   * Add a new order for a user
   */
  addOrder(userId: string, order: Order): void {
    const orders = this.getOrders(userId);
    orders.unshift(order);
    this.saveOrders(userId, orders);
  },

  /**
   * Get all purchased SKUs for a user (unique)
   */
  getPurchasedSkus(userId: string): string[] {
    const orders = this.getOrders(userId);
    const skus = orders.flatMap((o) => o.items.map((i) => i.sku));
    return [...new Set(skus)];
  },

  /**
   * Check if user has purchased a specific product by SKU
   */
  hasPurchased(userId: string, sku: string): boolean {
    const skus = this.getPurchasedSkus(userId);
    return skus.includes(sku);
  },

  /**
   * Get reorder items from completed orders
   */
  getReorderItems(userId: string): {
    id: string;
    name: string;
    sku: string;
    lastPurchased: string;
    lastPrice: number;
    quantity: number;
    image: string;
    stock: number;
  }[] {
    const orders = this.getOrders(userId).filter((o) => o.status === 'completed');
    const itemsMap = new Map<string, {
      id: string;
      name: string;
      sku: string;
      lastPurchased: string;
      lastPrice: number;
      quantity: number;
      image: string;
      stock: number;
    }>();

    orders.forEach((order) => {
      order.items.forEach((item) => {
        itemsMap.set(item.sku, {
          id: `reorder-${item.sku}`,
          name: item.name,
          sku: item.sku,
          lastPurchased: order.orderDate,
          lastPrice: item.price,
          quantity: item.quantity,
          image: item.image || '',
          stock: 500, // Default stock, would come from product API
        });
      });
    });

    return Array.from(itemsMap.values());
  },

  /**
   * Initialize demo orders for a new user
   */
  initDemoOrders(userId: string, userName: string): void {
    const existingOrders = this.getOrders(userId);
    if (existingOrders.length > 0) return;

    const demoOrders: Order[] = [
      {
        id: `order-demo-1-${Date.now()}`,
        orderCode: `MEC${new Date().toISOString().slice(0, 10).replace(/-/g, '')}001`,
        orderDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'completed',
        totalAmount: 2850000,
        paymentMethod: 'Thanh toán khi nhận hàng (COD)',
        shippingAddress: '123 Đường Nguyễn Trãi, Quận 1, TP.HCM',
        recipientName: userName || 'Nguyễn Văn Tuấn',
        phone: '0900000000',
        items: [
          {
            id: 'item-001',
            name: 'Phe Gài Trục Thép 65Mn DIN471 D3x0.4 (50Cái/Bịch)',
            sku: 'B01M1001035TH00',
            quantity: 10,
            price: 259200,
            image: '/assets/Phe Gài Trục Thép 65Mn DIN471 D3x0.4 (50Cái_Bịch).png',
          },
          {
            id: 'item-002',
            name: 'Bulong Inox 304 DIN933 M3x20',
            sku: 'B01M1001035TH01',
            quantity: 50,
            price: 34920,
            image: '/assets/Bulong Inox 304 DIN933 M3x20.jpg',
          },
        ],
      },
      {
        id: `order-demo-2-${Date.now()}`,
        orderCode: `MEC${new Date().toISOString().slice(0, 10).replace(/-/g, '')}002`,
        orderDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'shipping',
        totalAmount: 1560000,
        paymentMethod: 'Chuyển khoản ngân hàng',
        shippingAddress: '456 Đường Lê Lợi, Quận 3, TP.HCM',
        recipientName: userName || 'Trần Thị B',
        phone: '0912345678',
        items: [
          {
            id: 'item-003',
            name: 'Đai Ốc Inox 304 DIN934 M6',
            sku: 'B01M1001035TH02',
            quantity: 100,
            price: 1560000,
            image: '/assets/Dai Oc Inox 304 DIN934 M6.jpg',
          },
        ],
      },
      {
        id: `order-demo-3-${Date.now()}`,
        orderCode: `MEC${new Date().toISOString().slice(0, 10).replace(/-/g, '')}003`,
        orderDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'processing',
        totalAmount: 4200000,
        paymentMethod: 'Thanh toán khi nhận hàng (COD)',
        shippingAddress: '789 Đường Cái Khế, Quận Ninh Kiều, Cần Thơ',
        recipientName: userName || 'Lê Văn C',
        phone: '0932123456',
        items: [
          {
            id: 'item-004',
            name: 'Gioăng Cao Su Chịu Nhiệt 10x15x2mm',
            sku: 'B01M1001035TH03',
            quantity: 200,
            price: 2100000,
            image: '/assets/Gioang Cao Su Chiu Nhiet.jpg',
          },
          {
            id: 'item-005',
            name: 'Keo Dán Công Nghiệp 3M Scotch-Weld',
            sku: 'B01M1001035TH04',
            quantity: 5,
            price: 2100000,
            image: '/assets/Keo Dan CN.jpg',
          },
        ],
      },
    ];

    this.saveOrders(userId, demoOrders);
  },

  /**
   * Get a specific order by orderCode for a user
   */
  getOrderByCode(userId: string, orderCode: string): Order | null {
    const orders = this.getOrders(userId);
    return orders.find(o => o.orderCode === orderCode) || null;
  },

  /**
   * Format payment method code to display string
   */
  formatPaymentMethod(method: string): string {
    const methods: Record<string, string> = {
      bank: 'Chuyển khoản ngân hàng',
      cod: 'Thanh toán khi nhận hàng (COD)',
      quotation: 'Yêu cầu báo giá chính thức',
      netterms: 'Net terms (Mua chịu)',
    };
    return methods[method] || method;
  },

  /**
   * Create and return an order from checkout data
   */
  createOrderFromCheckout(checkoutData: {
    orderId: string;
    shippingAddress: { 
      fullAddress?: string; 
      street?: string; 
      ward?: string; 
      district?: string; 
      province?: string;
      receiverName?: string;
      phone?: string;
      phoneNumber?: string;
      name?: string;
      fullName?: string;
    };
    items: { sku: string; name: string; price: number; quantity: number; image: string }[];
    subtotal: number;
    shippingFee: number;
    b2bDiscount: number;
    vatAmount: number;
    total: number;
    paymentMethod: string;
    recipientName?: string;
    phone?: string;
  }): Order {
    const shippingAddr = checkoutData.shippingAddress;
    
    // Extract receiverName from shippingAddress object
    const receiverName = shippingAddr?.receiverName || 
      shippingAddr?.name || 
      shippingAddr?.fullName || 
      checkoutData.recipientName || 
      '';
    
    // Extract phone from shippingAddress object
    const phone = shippingAddr?.phone || 
      shippingAddr?.phoneNumber || 
      checkoutData.phone || 
      '';
    
    // Build full address
    const fullAddress = shippingAddr?.fullAddress ||
      [shippingAddr?.street, shippingAddr?.ward, shippingAddr?.district, shippingAddr?.province]
        .filter(Boolean).join(', ');

    const order: Order = {
      id: checkoutData.orderId,
      orderCode: checkoutData.orderId,
      orderDate: new Date().toISOString().split('T')[0],
      status: 'completed',
      totalAmount: checkoutData.total,
      paymentMethod: this.formatPaymentMethod(checkoutData.paymentMethod),
      shippingAddress: fullAddress,
      recipientName: receiverName,
      phone: phone,
      items: checkoutData.items.map((item, index) => ({
        id: `${checkoutData.orderId}-item-${index}`,
        name: item.name,
        sku: item.sku,
        quantity: item.quantity,
        price: item.price,
        image: item.image || '',
      })),
    };

    return order;
  },
};
