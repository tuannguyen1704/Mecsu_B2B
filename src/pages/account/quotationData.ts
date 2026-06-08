import { Quotation, QuotationItem, Priority } from '../../types/quotation';

interface CreateQuotationParams {
  requestName: string;
  desiredDeadline?: string;
  priority: Priority;
  items: {
    productName: string;
    productCode: string;
    quantity: number;
    unit: string;
    notes?: string;
  }[];
  generalNotes?: string;
}

// Generate random quotation code
const generateQuotationCode = (): string => {
  const num = Math.floor(Math.random() * 900000) + 100000;
  return `BG-2026-${num}`;
};

// Convert item from request to QuotationItem
const createQuotationItem = (
  item: CreateQuotationParams['items'][0],
  index: number
): QuotationItem => ({
  id: `qi-new-${Date.now()}-${index}`,
  image: '/assets/default-product.png',
  name: item.productName,
  sku: item.productCode || `SKU-${Date.now()}`,
  quantity: item.quantity,
  unit: item.unit,
  unitPrice: 0,
  discount: 0,
  vat: 0,
  lineTotal: 0,
});

// Create quotation from request
export const createQuotationFromRequest = (
  params: CreateQuotationParams
): Quotation => {
  const now = new Date();
  const expiryDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  return {
    id: `q-new-${Date.now()}`,
    code: generateQuotationCode(),
    status: 'pending',
    requestDate: now.toLocaleDateString('vi-VN'),
    quotationDate: '',
    expiryDate: expiryDate.toLocaleDateString('vi-VN'),
    productCount: params.items.length,
    subtotal: 0,
    discountTotal: 0,
    vatTotal: 0,
    shippingFee: 0,
    total: 0,
    items: params.items.map(createQuotationItem),
    salesRep: {
      name: 'MECSU Sales Team',
      role: 'Đội ngũ kinh doanh',
    },
    requestName: params.requestName,
    priority: params.priority,
    generalNotes: params.generalNotes,
  };
};

// Add quotation to the beginning of the list
export const addQuotation = (quotation: Quotation): void => {
  mockQuotations.unshift(quotation);
};

const mockImages = [
  '/assets/Phe Gài Trục Thép 65Mn DIN471 D3x0.4 (50Cái_Bịch).png',
  '/assets/Bulong Inox 304 DIN933 M3x20.jpg',
  '/assets/Dai Oc Inox 304 DIN934 M6.jpg',
  '/assets/Gioang Cao Su Chiu Nhiet.jpg',
  '/assets/Keo Dan CN.jpg',
];

export const mockQuotations: Quotation[] = [
  {
    id: 'q1',
    code: 'BG-2026-000145',
    status: 'sent',
    requestDate: '01/06/2026',
    quotationDate: '03/06/2026',
    expiryDate: '10/06/2026',
    productCount: 3,
    subtotal: 11500000,
    discountTotal: 500000,
    vatTotal: 1050000,
    shippingFee: 0,
    total: 12500000,
    items: [
      {
        id: 'qi-1',
        image: mockImages[0],
        name: 'Phe Gài Trục Thép 65Mn DIN471 D3x0.4 (50Cái/Bịch)',
        sku: 'B01M1001035TH00',
        quantity: 10,
        unit: 'bịch',
        unitPrice: 259200,
        discount: 0,
        vat: 259200,
        lineTotal: 2592000,
      },
      {
        id: 'qi-2',
        image: mockImages[1],
        name: 'Bulong Inox 304 DIN933 M3x20',
        sku: 'B01M1001035TH01',
        quantity: 50,
        unit: 'cái',
        unitPrice: 34920,
        discount: 0,
        vat: 349200,
        lineTotal: 1746000,
      },
      {
        id: 'qi-3',
        image: mockImages[2],
        name: 'Đai Ốc Inox 304 DIN934 M6',
        sku: 'B01M1001035TH02',
        quantity: 100,
        unit: 'cái',
        unitPrice: 15600,
        discount: 15600,
        vat: 280800,
        lineTotal: 821400,
      },
    ],
    salesRep: {
      name: 'Nguyễn Văn A',
      role: 'Chuyên viên kinh doanh',
      avatar: '',
      phone: '0912345678',
      email: 'nguyenvana@mecsu.vn',
    },
  },
  {
    id: 'q2',
    code: 'BG-2026-000146',
    status: 'processing',
    requestDate: '02/06/2026',
    quotationDate: '',
    expiryDate: '11/06/2026',
    productCount: 2,
    subtotal: 8900000,
    discountTotal: 0,
    vatTotal: 979000,
    shippingFee: 0,
    total: 9879000,
    items: [
      {
        id: 'qi-4',
        image: mockImages[3],
        name: 'Gioăng Cao Su Chịu Nhiệt 10x15x2mm',
        sku: 'B01M1001035TH03',
        quantity: 200,
        unit: 'cái',
        unitPrice: 21000,
        discount: 0,
        vat: 420000,
        lineTotal: 4620000,
      },
      {
        id: 'qi-5',
        image: mockImages[4],
        name: 'Keo Dán Công Nghiệp 3M Scotch-Weld',
        sku: 'B01M1001035TH04',
        quantity: 5,
        unit: 'cái',
        unitPrice: 2100000,
        discount: 0,
        vat: 210000,
        lineTotal: 2310000,
      },
    ],
    salesRep: {
      name: 'Trần Thị B',
      role: 'Chuyên viên kinh doanh',
      phone: '0923456789',
      email: 'tranthib@mecsu.vn',
    },
  },
  {
    id: 'q3',
    code: 'BG-2026-000147',
    status: 'accepted',
    requestDate: '28/05/2026',
    quotationDate: '29/05/2026',
    expiryDate: '05/06/2026',
    productCount: 1,
    subtotal: 24800000,
    discountTotal: 1200000,
    vatTotal: 2368000,
    shippingFee: 350000,
    total: 26288000,
    items: [
      {
        id: 'qi-6',
        image: mockImages[0],
        name: 'Phe Gài Trục Thép 65Mn DIN471 D3x0.4 (50Cái/Bịch)',
        sku: 'B01M1001035TH00',
        quantity: 50,
        unit: 'bịch',
        unitPrice: 259200,
        discount: 259200,
        vat: 466560,
        lineTotal: 11865600,
      },
    ],
    salesRep: {
      name: 'Lê Văn C',
      role: 'Trưởng nhóm kinh doanh',
      phone: '0934567890',
      email: 'levanc@mecsu.vn',
    },
  },
  {
    id: 'q4',
    code: 'BG-2026-000148',
    status: 'pending',
    requestDate: '03/06/2026',
    quotationDate: '',
    expiryDate: '12/06/2026',
    productCount: 1,
    subtotal: 5400000,
    discountTotal: 0,
    vatTotal: 594000,
    shippingFee: 0,
    total: 5994000,
    items: [
      {
        id: 'qi-7',
        image: mockImages[1],
        name: 'Bulong Inox 304 DIN933 M3x20',
        sku: 'B01M1001035TH01',
        quantity: 120,
        unit: 'cái',
        unitPrice: 34920,
        discount: 0,
        vat: 418800,
        lineTotal: 4606800,
      },
    ],
    salesRep: {
      name: 'Phạm Thị D',
      role: 'Chuyên viên kinh doanh',
      phone: '0945678901',
      email: 'phamthid@mecsu.vn',
    },
  },
  {
    id: 'q5',
    code: 'BG-2026-000149',
    status: 'expired',
    requestDate: '15/05/2026',
    quotationDate: '16/05/2026',
    expiryDate: '02/06/2026',
    productCount: 1,
    subtotal: 6700000,
    discountTotal: 200000,
    vatTotal: 702000,
    shippingFee: 150000,
    total: 7252000,
    items: [
      {
        id: 'qi-8',
        image: mockImages[2],
        name: 'Đai Ốc Inox 304 DIN934 M6',
        sku: 'B01M1001035TH02',
        quantity: 300,
        unit: 'cái',
        unitPrice: 15600,
        discount: 200000,
        vat: 702000,
        lineTotal: 7200000,
      },
    ],
    salesRep: {
      name: 'Hoàng Văn E',
      role: 'Chuyên viên kinh doanh',
      phone: '0956789012',
      email: 'hoangvane@mecsu.vn',
    },
  },
];
