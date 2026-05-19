import { Order, ReorderItem, ReturnRequest, AccountUser, Product } from '../types';

// Mock user data
export const MOCK_USER: AccountUser = {
  id: 'user-001',
  name: 'Nguyễn Văn Minh',
  email: 'minh.nguyen@company.com',
  role: 'Khách hàng Mecsu'
};

// Mock orders data
export const MOCK_ORDERS: Order[] = [
  {
    id: 'order-001',
    orderCode: 'MEC2505180001',
    orderDate: '2025-05-15',
    status: 'completed',
    totalAmount: 2850000,
    paymentMethod: 'Thanh toán khi nhận hàng (COD)',
    shippingAddress: '123 Đường Nguyễn Trãi, Quận 1, TP.HCM',
    items: [
      {
        id: 'item-001',
        name: 'Phe Gài Trục Thép 65Mn DIN471 D3x0.4 (50Cái/Bịch)',
        sku: 'B01M1001035TH00',
        quantity: 10,
        price: 259200,
        image: '/assets/Phe Gài Trục Thép 65Mn DIN471 D3x0.4 (50Cái_Bịch).png'
      },
      {
        id: 'item-002',
        name: 'Bulong Inox 304 DIN933 M3x20',
        sku: 'B01M1001035TH01',
        quantity: 50,
        price: 34920,
        image: '/assets/Bulong Inox 304 DIN933 M3x20.jpg'
      }
    ]
  },
  {
    id: 'order-002',
    orderCode: 'MEC2505180002',
    orderDate: '2025-05-17',
    status: 'shipping',
    totalAmount: 1560000,
    paymentMethod: 'Chuyển khoản ngân hàng',
    shippingAddress: '456 Đường Lê Lợi, Quận 3, TP.HCM',
    items: [
      {
        id: 'item-003',
        name: 'Đai Ốc Inox 304 DIN934 M6',
        sku: 'B01M1001035TH02',
        quantity: 100,
        price: 1560000,
        image: '/assets/Dai Oc Inox 304 DIN934 M6.jpg'
      }
    ]
  },
  {
    id: 'order-003',
    orderCode: 'MEC2505180003',
    orderDate: '2025-05-18',
    status: 'processing',
    totalAmount: 4200000,
    paymentMethod: 'Thanh toán khi nhận hàng (COD)',
    shippingAddress: '789 Đường Cái Khế, Quận Ninh Kiều, Cần Thơ',
    items: [
      {
        id: 'item-004',
        name: 'Gioăng Cao Su Chịu Nhiệt 10x15x2mm',
        sku: 'B01M1001035TH03',
        quantity: 200,
        price: 2100000,
        image: '/assets/Gioang Cao Su Chiu Nhiet.jpg'
      },
      {
        id: 'item-005',
        name: 'Keo Dán Công Nghiệp 3M Scotch-Weld',
        sku: 'B01M1001035TH04',
        quantity: 5,
        price: 2100000,
        image: '/assets/Keo Dan CN.jpg'
      }
    ]
  },
  {
    id: 'order-004',
    orderCode: 'MEC2505180004',
    orderDate: '2025-05-10',
    status: 'cancelled',
    totalAmount: 890000,
    paymentMethod: 'Thanh toán khi nhận hàng (COD)',
    shippingAddress: '123 Đường Nguyễn Trãi, Quận 1, TP.HCM',
    items: [
      {
        id: 'item-006',
        name: 'Dây Cáp Thép Inox 304 3mm',
        sku: 'B01M1001035TH05',
        quantity: 10,
        price: 890000,
        image: '/assets/Day Cap Thep.jpg'
      }
    ]
  },
  {
    id: 'order-005',
    orderCode: 'MEC2505180005',
    orderDate: '2025-05-12',
    status: 'completed',
    totalAmount: 3200000,
    paymentMethod: 'Thanh toán khi nhận hàng (COD)',
    shippingAddress: '321 Đường Võ Văn Kiệt, Quận 5, TP.HCM',
    items: [
      {
        id: 'item-007',
        name: 'Phe Gài Trục Thép 65Mn DIN471 D4x0.4 (50Cái/Bịch)',
        sku: 'B01M1001035TH06',
        quantity: 20,
        price: 1600000,
        image: '/assets/Phe Gài D4.jpg'
      },
      {
        id: 'item-008',
        name: 'Then Chữ T 5x5x25mm',
        sku: 'B01M1001035TH07',
        quantity: 50,
        price: 800000,
        image: '/assets/Then Chu T.jpg'
      },
      {
        id: 'item-009',
        name: 'Đinh Tán Đồng 4x20mm (100Cái/Hộp)',
        sku: 'B01M1001035TH08',
        quantity: 10,
        price: 800000,
        image: '/assets/Dinh Tan Dong.jpg'
      }
    ]
  }
];

// Mock reorder items data
export const MOCK_REORDER_ITEMS: ReorderItem[] = [
  {
    id: 'reorder-001',
    name: 'Phe Gài Trục Thép 65Mn DIN471 D3x0.4 (50Cái/Bịch)',
    sku: 'B01M1001035TH00',
    lastPurchased: '2025-05-15',
    lastPrice: 259200,
    quantity: 10,
    image: '/assets/Phe Gài Trục Thép 65Mn DIN471 D3x0.4 (50Cái_Bịch).png',
    stock: 863
  },
  {
    id: 'reorder-002',
    name: 'Bulong Inox 304 DIN933 M3x20',
    sku: 'B01M1001035TH01',
    lastPurchased: '2025-05-15',
    lastPrice: 34920,
    quantity: 50,
    image: '/assets/Bulong Inox 304 DIN933 M3x20.jpg',
    stock: 2469
  },
  {
    id: 'reorder-003',
    name: 'Đai Ốc Inox 304 DIN934 M6',
    sku: 'B01M1001035TH02',
    lastPurchased: '2025-05-10',
    lastPrice: 15600,
    quantity: 100,
    image: '/assets/Dai Oc Inox 304 DIN934 M6.jpg',
    stock: 1500
  },
  {
    id: 'reorder-004',
    name: 'Gioăng Cao Su Chịu Nhiệt 10x15x2mm',
    sku: 'B01M1001035TH03',
    lastPurchased: '2025-05-08',
    lastPrice: 10500,
    quantity: 200,
    image: '/assets/Gioang Cao Su Chiu Nhiet.jpg',
    stock: 500
  },
  {
    id: 'reorder-005',
    name: 'Keo Dán Công Nghiệp 3M Scotch-Weld',
    sku: 'B01M1001035TH04',
    lastPurchased: '2025-05-05',
    lastPrice: 420000,
    quantity: 5,
    image: '/assets/Keo Dan CN.jpg',
    stock: 45
  },
  {
    id: 'reorder-006',
    name: 'Dây Cáp Thép Inox 304 3mm',
    sku: 'B01M1001035TH05',
    lastPurchased: '2025-04-28',
    lastPrice: 89000,
    quantity: 10,
    image: '/assets/Day Cap Thep.jpg',
    stock: 200
  },
  {
    id: 'reorder-007',
    name: 'Phe Gài Trục Thép 65Mn DIN471 D4x0.4 (50Cái/Bịch)',
    sku: 'B01M1001035TH06',
    lastPurchased: '2025-04-25',
    lastPrice: 80000,
    quantity: 20,
    image: '/assets/Phe Gài D4.jpg',
    stock: 420
  },
  {
    id: 'reorder-008',
    name: 'Then Chữ T 5x5x25mm',
    sku: 'B01M1001035TH07',
    lastPurchased: '2025-04-20',
    lastPrice: 16000,
    quantity: 50,
    image: '/assets/Then Chu T.jpg',
    stock: 800
  }
];

// Mock return requests data
export const MOCK_RETURN_REQUESTS: ReturnRequest[] = [
  {
    id: 'return-001',
    returnCode: 'TRA2505120001',
    orderCode: 'MEC2505100005',
    createdDate: '2025-05-12',
    status: 'reviewing',
    reason: 'Sản phẩm không đúng như mô tả trên website'
  },
  {
    id: 'return-002',
    returnCode: 'TRA2505050002',
    orderCode: 'MEC2505030010',
    createdDate: '2025-05-05',
    status: 'approved',
    reason: 'Sản phẩm bị hỏng trong quá trình vận chuyển'
  },
  {
    id: 'return-003',
    returnCode: 'TRA2504200003',
    orderCode: 'MEC2504180008',
    createdDate: '2025-04-20',
    status: 'completed',
    reason: 'Đổi sang sản phẩm có kích thước khác'
  }
];

// Mock best sellers products
export const MOCK_BEST_SELLERS: Product[] = [
  {
    id: 'bs-001',
    sku: 'B01M1001035TH00',
    slug: 'phe-gai-truc-thep-65mn-din471-d3x0-4',
    name: 'Phe Gài Trục Thép 65Mn DIN471 D3x0.4 (50Cái/Bịch)',
    category: 'Phe Gài',
    categorySlug: 'phe-gai',
    brand: 'MS-PRO',
    price: 259200,
    originalPrice: 320000,
    discount: 19,
    tax: 192,
    stock: 863,
    unit: 'Bịch',
    delivery: 'Xuất kho trong ngày',
    image: '/assets/Phe Gài Trục Thép 65Mn DIN471 D3x0.4 (50Cái_Bịch).png',
    rating: 5.0,
    isInstallment: false,
    origin: 'Việt Nam'
  },
  {
    id: 'bs-002',
    sku: 'B01M1001035TH01',
    slug: 'bulong-inox-304-din933-m3x20',
    name: 'Bulong Inox 304 DIN933 M3x20',
    category: 'Bulong',
    categorySlug: 'bulong',
    brand: 'INOX 304',
    price: 34920,
    originalPrice: 45000,
    discount: 22,
    tax: 0,
    stock: 2469,
    unit: 'Cái',
    delivery: 'Xuất kho trong ngày',
    image: '/assets/Bulong Inox 304 DIN933 M3x20.jpg',
    rating: 5.0,
    isInstallment: false,
    origin: 'Nhật Bản'
  },
  {
    id: 'bs-003',
    sku: 'B01M1001035TH02',
    slug: 'dai-oc-inox-304-din934-m6',
    name: 'Đai Ốc Inox 304 DIN934 M6',
    category: 'Đai Ốc',
    categorySlug: 'dai-oc',
    brand: 'INOX 304',
    price: 15600,
    originalPrice: 18000,
    discount: 13,
    tax: 0,
    stock: 1500,
    unit: 'Cái',
    delivery: 'Xuất kho trong ngày',
    image: '/assets/Dai Oc Inox 304 DIN934 M6.jpg',
    rating: 4.8,
    isInstallment: false,
    origin: 'Nhật Bản'
  },
  {
    id: 'bs-004',
    sku: 'B01M1001035TH03',
    slug: 'gioang-cao-su-chiu-nhiet-10x15x2mm',
    name: 'Gioăng Cao Su Chịu Nhiệt 10x15x2mm',
    category: 'Gioăng',
    categorySlug: 'gioang',
    brand: 'VITON',
    price: 10500,
    originalPrice: 12000,
    discount: 12,
    tax: 0,
    stock: 500,
    unit: 'Cái',
    delivery: 'Xuất kho trong ngày',
    image: '/assets/Gioang Cao Su Chiu Nhiet.jpg',
    rating: 4.9,
    isInstallment: false,
    origin: 'Đức'
  },
  {
    id: 'bs-005',
    sku: 'B01M1001035TH04',
    slug: 'keo-dan-cong-nghiep-3m-scotch-weld',
    name: 'Keo Dán Công Nghiệp 3M Scotch-Weld',
    category: 'Keo Dán',
    categorySlug: 'keo-dan',
    brand: '3M',
    price: 420000,
    originalPrice: 480000,
    discount: 12,
    tax: 0,
    stock: 45,
    unit: 'Hộp',
    delivery: '2-3 ngày',
    image: '/assets/Keo Dan CN.jpg',
    rating: 4.7,
    isInstallment: false,
    origin: 'Mỹ'
  },
  {
    id: 'bs-006',
    sku: 'B01M1001035TH05',
    slug: 'day-cap-thep-inox-304-3mm',
    name: 'Dây Cáp Thép Inox 304 3mm',
    category: 'Dây Cáp',
    categorySlug: 'day-cap',
    brand: 'SALES',
    price: 89000,
    originalPrice: 95000,
    discount: 6,
    tax: 0,
    stock: 200,
    unit: 'Mét',
    delivery: 'Xuất kho trong ngày',
    image: '/assets/Day Cap Thep.jpg',
    rating: 4.6,
    isInstallment: false,
    origin: 'Hàn Quốc'
  },
  {
    id: 'bs-007',
    sku: 'B01M1001035TH06',
    slug: 'phe-gai-truc-thep-65mn-din471-d4x0-4',
    name: 'Phe Gài Trục Thép 65Mn DIN471 D4x0.4 (50Cái/Bịch)',
    category: 'Phe Gài',
    categorySlug: 'phe-gai',
    brand: 'MS-PRO',
    price: 80000,
    originalPrice: 95000,
    discount: 16,
    tax: 192,
    stock: 420,
    unit: 'Bịch',
    delivery: 'Xuất kho trong ngày',
    image: '/assets/Phe Gài D4.jpg',
    rating: 4.9,
    isInstallment: false,
    origin: 'Việt Nam'
  },
  {
    id: 'bs-008',
    sku: 'B01M1001035TH07',
    slug: 'then-chu-t-5x5x25mm',
    name: 'Then Chữ T 5x5x25mm',
    category: 'Then',
    categorySlug: 'then',
    brand: 'MS-PRO',
    price: 16000,
    originalPrice: 18000,
    discount: 11,
    tax: 0,
    stock: 800,
    unit: 'Cái',
    delivery: 'Xuất kho trong ngày',
    image: '/assets/Then Chu T.jpg',
    rating: 4.8,
    isInstallment: false,
    origin: 'Việt Nam'
  }
];

// Filter status labels
export const ORDER_STATUS_LABELS: Record<string, string> = {
  all: 'Tất cả',
  processing: 'Đang xử lý',
  shipping: 'Đang giao',
  completed: 'Hoàn tất',
  cancelled: 'Đã huỷ'
};

export const RETURN_STATUS_LABELS: Record<string, string> = {
  reviewing: 'Đang xem xét',
  approved: 'Đã duyệt',
  completed: 'Hoàn tất',
  rejected: 'Từ chối'
};
