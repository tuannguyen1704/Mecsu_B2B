export interface HeaderCategory {
  id: string;
  name: string;
  icon: string;
  subcategories: string[];
}

export const HEADER_CATEGORIES: HeaderCategory[] = [
  {
    id: '1',
    name: 'Linh Kiện Lắp Ghép',
    icon: 'Blocks',
    subcategories: [
      'Phe Gài', 'Ren Cấy', 'Bulong', 'Bulong Cổ Vuông', 'Bulong Đầu Bông',
      'Bulong Cánh Chuồn', 'Bulong Mắt', 'Bulong Hàn', 'Bulong Chữ T', 'Bulong Pake',
      'Bulong Vai', 'Bulong Dẫn Hướng', 'Lục Giác Chìm', 'Các Loại Bulong Khác',
      'Vít Trí', 'Tán', 'Đai Ốc', 'Lông Đền', 'Vít Tự Khoan', 'Ty Ren',
      'Guzong', 'Tắc Kê', 'Rivet', 'Cùm U', 'Chốt', 'Then Định Vị',
      'Keo Khóa Ren', 'Dây Rút', 'Cable Tie'
    ],
  },
  {
    id: '2',
    name: 'Phụ Kiện Nâng Hạ',
    icon: 'ArrowUpCircle',
    subcategories: ['Tăng Đơ Cáp', 'Ma Ní Chống Xoắn', 'Bẹn Lót Cáp', 'Ốc Siết Cáp', 'Tán Vòng', 'Tai Cẩu', 'Móc Cẩu'],
  },
  {
    id: '3',
    name: 'Vật Tư Đường Ống',
    icon: 'Database',
    subcategories: ['Đai Siết Ống', 'Cùm Omega', 'Đai Kẹp Ống Không Chân Inox 304', 'Đai Kẹp Ống Có Chân Hàn Inox 304', 'Đai Treo Ống Hai Mảnh', 'Ốc Nhét Nước', 'Ron', 'Cao Su Non'],
  },
  {
    id: '4',
    name: 'Linh Kiện Truyền Động',
    icon: 'Settings',
    subcategories: ['Vòng Bi Bạc Đạn', 'Gối Đỡ Vòng Bi', 'Seal', 'Phốt', 'Oring', 'Dây Curoa', 'Puly', 'Xích Truyền Động', 'Càng Bánh Xe', 'Lò Xo', 'Con Lăn (Ball Roller)', 'Khớp Nối Trục', 'Phụ Kiện Bơm Mỡ', 'Phụ Kiện Kiểm Tra'],
  },
  {
    id: '5',
    name: 'Vật Tư Gia Công',
    icon: 'PenTool',
    subcategories: ['Mũi Khoan', 'Mũi Doa', 'Mũi Taro Ren', 'Dao Phay', 'Mũi Vát', 'Mũi Đục', 'Mũi Khoan Từ', 'Cây Định Tâm', 'Mũi Khoét', 'Đầu Kẹp Và Phụ Kiện', 'Lưỡi Cưa', 'Đá Mài', 'Đá Cắt', 'Đá Nhám Xếp', 'Đĩa Phá Sơn', 'Giấy Nhám', 'Đế Chà Nhám', 'Miếng Đánh Bóng'],
  },
  {
    id: '6',
    name: 'Máy Gia Công',
    icon: 'Monitor',
    subcategories: ['Máy Khoan', 'Máy Mài', 'Máy Đục Bê Tông', 'Máy Cưa', 'Máy Cắt', 'Máy Siết Bulong', 'Máy Thổi Hơi Nóng', 'Máy Đánh Bóng', 'Máy Đánh Cạnh', 'Máy Chà Nhám', 'Máy Phay', 'Máy Vặn Vít', 'Máy Bào', 'Máy Hàn', 'Chổi Than', 'Mũi Khò', 'Máy Hỗ Trợ Dọn Vệ Sinh', 'Máy Bơm Hơi', 'Phụ Kiện Cho Máy Gia Công'],
  },
  {
    id: '7',
    name: 'Phụ Kiện Khí Nén',
    icon: 'Wind',
    subcategories: ['Đầu Nối Nhanh Khí Nén', 'Khớp Nối Nhanh Khí Nén Bi', 'Van Khí Nén', 'Ống Khí Nén', 'Súng Xịt Hơi', 'Giảm Thanh Khí Nén', 'Xi Lanh Khí Nén', 'Dụng Cụ Bơm Xe', 'Thiết Bị Hút Chân Không'],
  },
  {
    id: '8',
    name: 'Dụng Cụ Cầm Tay',
    icon: 'Wrench',
    subcategories: ['Cờ Lê', 'Mỏ Lết', 'Cờ Lê Lực', 'Tay Vặn', 'Đầu Tuýp', 'Bộ Dụng Cụ', 'Tua Vít', 'Mũi Vít', 'Cây Vặn Lục Giác', 'Ống Điếu', 'Kìm', 'Dụng Cụ Cắt', 'Mài (Búa, Đục, Xà Beng)', 'Dụng Cụ Rút Rivet', 'Dụng Cụ Xử Lý Đường Ống', 'Cảo', 'Hộp Đồ Nghề', 'Nhíp'],
  },
  {
    id: '9',
    name: 'Phụ Kiện Cửa',
    icon: 'DoorOpen',
    subcategories: ['Bản Lề', 'Chốt Cửa', 'Tay Nắm Cửa Công Nghiệp', 'Núm Vặn', 'Tay Siết', 'Tay Cầm', 'Ty Hơi', 'Linh Kiện Ty Hơi', 'Miếng Đệm Cửa', 'Thanh Ray Trượt Ngăn Kéo', 'Nam Châm'],
  },
  {
    id: '10',
    name: 'Thiết Bị Điện',
    icon: 'Zap',
    subcategories: ['Đầu Cosse Nối Dây Điện', 'Dây Rút', 'Ốc Siết Cáp Điện', 'Ống Luồn', 'Đầu Nối', 'Ổ Cắm', 'Phích Cắm', 'Thiết Bị Chiếu Sáng', 'Điện Điều Khiển'],
  },
  {
    id: '11',
    name: 'Dụng Cụ Đo',
    icon: 'Ruler',
    subcategories: ['Thước Đo', 'Panme', 'Đồng Hồ Đo', 'Ê Ke', 'Thước Thủy', 'Nivo', 'Dụng Cụ Đánh Dấu', 'Giá Đỡ Dụng Cụ Đo', 'Dụng Cụ Đo Nhiệt Độ', 'Độ Ẩm', 'Dụng Cụ Đo Khoảng Cách', 'Dụng Cụ Đo Điện'],
  },
  {
    id: '12',
    name: 'Sơn - Keo - Bôi Trơn',
    icon: 'Droplet',
    subcategories: ['Màng Co', 'Băng Keo', 'Dung Dịch Tẩy Rửa', 'Chống Gỉ Sét', 'Sơn', 'Keo Dán', 'Con Lăn Sơn'],
  },
  {
    id: '13',
    name: 'Vật Tư Nhà Xưởng',
    icon: 'Factory',
    subcategories: ['Xe Đẩy Hàng', 'Đèn Pin', 'Phụ Kiện Bảo Hộ (Găng Tay Bảo Hộ)', 'Quạt Gia Dụng'],
  },
];

export const HEADER_LOCATIONS = [
  'TP. Hồ Chí Minh',
  'Hà Nội',
  'Đà Nẵng',
  'Bình Dương',
  'Đồng Nai',
  'Hải Phòng',
  'Bắc Ninh',
];
