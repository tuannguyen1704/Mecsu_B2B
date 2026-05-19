// Authentication types for Mecsu
export interface Address {
  id: string;
  recipientName: string;
  phone: string;
  province: string;
  district: string;
  ward: string;
  streetAddress: string;
  deliveryNote: string;
  isDefault: boolean;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  password: string;
  addresses: Address[];
  createdAt: string;
}

export interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
}

export const STORAGE_KEYS = {
  USERS: 'mecsu_users',
  CURRENT_USER: 'mecsu_current_user',
} as const;

export const PROVINCES = [
  { id: 'hcm', name: 'TP. Hồ Chí Minh' },
  { id: 'hn', name: 'Hà Nội' },
  { id: 'dn', name: 'Đà Nẵng' },
  { id: 'cantho', name: 'Cần Thơ' },
  { id: 'hue', name: 'Huế' },
  { id: 'dongnai', name: 'Đồng Nai' },
  { id: 'binhduong', name: 'Bình Dương' },
];

export const DISTRICTS: Record<string, { id: string; name: string }[]> = {
  hcm: [
    { id: 'quan1', name: 'Quận 1' },
    { id: 'quan3', name: 'Quận 3' },
    { id: 'quan5', name: 'Quận 5' },
    { id: 'quan7', name: 'Quận 7' },
    { id: 'quan10', name: 'Quận 10' },
    { id: 'phunhuan', name: 'Phú Nhuận' },
    { id: 'tanbinh', name: 'Tân Bình' },
    { id: 'binhthanh', name: 'Bình Thạnh' },
    { id: 'go vap', name: 'Gò Vấp' },
    { id: 'twp', name: 'Thủ Đức' },
  ],
  hn: [
    { id: 'hoankiem', name: 'Hoàn Kiếm' },
    { id: 'badinh', name: 'Ba Đình' },
    { id: 'dongda', name: 'Đống Đa' },
    { id: 'hai ba trung', name: 'Hai Bà Trưng' },
    { id: 'thanh xuan', name: 'Thanh Xuân' },
    { id: 'cau giay', name: 'Cầu Giấy' },
    { id: 'tu liem', name: 'Từ Liêm' },
  ],
  dn: [
    { id: 'hai chau', name: 'Hải Châu' },
    { id: 'thanh khe', name: 'Thanh Khê' },
    { id: 'son tra', name: 'Sơn Trà' },
    { id: 'ngu hanh son', name: 'Ngũ Hành Sơn' },
  ],
};

export const WARDS: Record<string, { id: string; name: string }[]> = {
  quan1: [
    { id: 'ben nghe', name: 'Bến Nghé' },
    { id: 'ben nghe 2', name: 'Bến Nghé 2' },
    { id: 'co giang', name: 'Cô Giang' },
    { id: 'cong truong', name: 'Công Trường' },
    { id: 'da kao', name: 'Đa Kao' },
  ],
  quan3: [
    { id: 'pham ngu lao', name: 'Phạm Ngũ Lão' },
    { id: '1', name: 'Phường 1' },
    { id: '2', name: 'Phường 2' },
    { id: '3', name: 'Phường 3' },
  ],
  quan5: [
    { id: '1', name: 'Phường 1' },
    { id: '2', name: 'Phường 2' },
    { id: '3', name: 'Phường 3' },
  ],
  quan7: [
    { id: 'tan thuan dong', name: 'Tân Thuận Đông' },
    { id: 'tan thuan tay', name: 'Tân Thuận Tây' },
    { id: 'tan phu', name: 'Tân Phú' },
  ],
};
