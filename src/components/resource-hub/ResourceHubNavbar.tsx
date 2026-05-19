import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { motion } from 'motion/react';

const mecsuLogo = '/assets/mecsu.png';

interface DropdownItem {
  label: string;
  description?: string;
}

interface NavItem {
  label: string;
  dropdown: DropdownItem[];
}

const navItems: NavItem[] = [
  {
    label: 'Hướng dẫn mua hàng',
    dropdown: [
      { label: 'Chọn bu lông', description: 'Vật liệu, cấp bền, tiêu chuẩn' },
      { label: 'Chọn đai ốc', description: 'Kích thước, loại ren, ứng dụng' },
      { label: 'Chọn vòng đệm', description: 'Phẳng, vênh, xẻ rãnh' },
      { label: 'Chọn dụng cụ cầm tay', description: 'Tô-vít, cờ-lê, búa' },
      { label: 'Checklist mua vật tư', description: 'Danh sách cần thiết cho nhà máy' },
    ],
  },
  {
    label: 'Kiến thức kỹ thuật',
    dropdown: [
      { label: 'Tiêu chuẩn DIN / ISO / JIS', description: 'Sự khác nhau và ứng dụng' },
      { label: 'Cấp bền bu lông', description: '4.8, 8.8, 10.9, 12.9' },
      { label: 'Vật liệu Inox 304 / 316', description: 'Thành phần và độ bền' },
      { label: 'Ren hệ mét', description: 'ISO metric thread' },
      { label: 'Bảng tra kỹ thuật', description: 'Thông số chi tiết' },
    ],
  },
  {
    label: 'Tin tức ngành',
    dropdown: [
      { label: 'Xu hướng công nghiệp', description: 'Cập nhật ngành sản xuất' },
      { label: 'Tự động hóa', description: 'Công nghệ mới trong nhà máy' },
      { label: 'Chuỗi cung ứng', description: 'Logistics và sourcing' },
      { label: 'Sản xuất tại Việt Nam', description: 'Cơ hội và thách thức' },
    ],
  },
  {
    label: 'So sánh sản phẩm',
    dropdown: [
      { label: 'Inox 304 vs 316', description: 'Loại nào phù hợp hơn?' },
      { label: 'Bosch vs Stanley', description: 'Dụng cụ cầm tay' },
      { label: 'SKF vs NTN', description: 'Vòng bi công nghiệp' },
      { label: 'Bu lông lục giác vs chìm', description: 'Loại đầu bu lông' },
    ],
  },
  {
    label: 'Kho vận',
    dropdown: [
      { label: 'Tồn kho minh bạch', description: 'Quản lý kho hiệu quả' },
      { label: 'ERP & xử lý đơn hàng', description: 'Hệ thống quản lý' },
      { label: 'Giao hàng nhanh', description: 'Delivery tối ưu' },
      { label: 'Giảm lead time', description: 'Tối ưu chuỗi cung ứng' },
    ],
  },
];

export default function ResourceHubNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [expandedMobileItem, setExpandedMobileItem] = useState<string | null>(null);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMouseEnter = (label: string) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setActiveDropdown(label);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  const toggleMobileItem = (label: string) => {
    setExpandedMobileItem(expandedMobileItem === label ? null : label);
  };

  return (
    <nav
      className={`sticky top-0 z-50 bg-white transition-shadow duration-200 ${
        isScrolled ? 'shadow-md' : 'border-b border-[#E5E7EB]'
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Navbar - Height 72px */}
        <div className="h-[72px] flex items-center justify-between gap-12">
          {/* Logo - Left */}
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <div className="w-11 h-11 rounded-xl overflow-hidden shadow-sm flex items-center justify-center">
              <img
                src={mecsuLogo}
                alt="Mecsu Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-[18px] font-bold text-[#14213D] leading-tight tracking-tight">
                Mecsu
              </span>
              <span className="text-[11px] text-slate-400 font-medium leading-none">
                Resource Hub
              </span>
            </div>
          </Link>

          {/* Center Nav Items - Desktop */}
          <div className="hidden lg:flex items-center justify-center flex-1 gap-2">
            {navItems.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => handleMouseEnter(item.label)}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  className={`relative px-4 py-2 text-[15px] font-semibold transition-all duration-200 group whitespace-nowrap ${
                    activeDropdown === item.label
                      ? 'text-[#163F78]'
                      : 'text-[#14213D] hover:text-[#163F78] hover:-translate-y-[1px]'
                  }`}
                >
                  {item.label}
                  <ChevronDown
                    size={14}
                    className={`inline-block ml-1 transition-transform duration-200 ${
                      activeDropdown === item.label ? 'rotate-180' : ''
                    }`}
                  />
                  {/* Yellow underline animation */}
                  <span
                    className={`absolute bottom-0 left-4 right-4 h-[2px] bg-[#FFC928] transition-transform duration-300 origin-left ${
                      activeDropdown === item.label
                        ? 'scale-x-100'
                        : 'scale-x-0 group-hover:scale-x-100'
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                {activeDropdown === item.label && (
                  <div
                    className="absolute top-full left-1/2 -translate-x-1/2 pt-2"
                    onMouseEnter={() => handleMouseEnter(item.label)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.15 }}
                      className="bg-white rounded-2xl shadow-xl border border-[#E5E7EB] w-[280px] p-4"
                    >
                      <div className="space-y-1">
                        {item.dropdown.map((dropdownItem, idx) => (
                          <Link
                            key={idx}
                            to="/resource-hub"
                            className="flex items-start gap-3 px-3 py-3 rounded-xl hover:bg-slate-50 transition-colors group/item"
                          >
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-[14px] font-semibold text-[#14213D] group-hover/item:text-[#163F78] transition-colors">
                                  {dropdownItem.label}
                                </span>
                                <span className="opacity-0 group-hover/item:opacity-100 transition-opacity">
                                  <span className="w-1.5 h-1.5 bg-[#FFC928] rounded-full" />
                                </span>
                              </div>
                              {dropdownItem.description && (
                                <p className="text-[12px] text-slate-400 mt-0.5">
                                  {dropdownItem.description}
                                </p>
                              )}
                            </div>
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right - Actions - Desktop */}
          <div className="hidden lg:flex items-center gap-6 shrink-0">
            {/* Subscribe Button */}
            <button className="px-5 py-2.5 text-[14px] font-semibold bg-[#14213D] text-white rounded-xl hover:bg-[#163F78] transition-all duration-200 hover:-translate-y-[1px] hover:shadow-md">
              Đăng ký
            </button>

            {/* About Link */}
            <Link
              to="/"
              className="text-[14px] font-medium text-slate-500 hover:text-[#163F78] transition-colors"
            >
              Về Mecsu
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-2 lg:hidden">
            {/* Hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2.5 text-[#14213D] hover:text-[#163F78] transition-colors"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-[#E5E7EB]">
          <div className="max-w-[1440px] mx-auto px-4 py-6">
            {/* Mobile Nav Items - Accordion */}
            <div className="space-y-2">
              {navItems.map((item) => {
                const isExpanded = expandedMobileItem === item.label;
                return (
                  <div key={item.label} className="border-b border-[#E5E7EB] last:border-b-0">
                    <button
                      onClick={() => toggleMobileItem(item.label)}
                      className="w-full flex items-center justify-between py-4 text-[15px] font-semibold text-[#14213D]"
                    >
                      <span>{item.label}</span>
                      <ChevronDown
                        size={18}
                        className={`text-slate-400 transition-transform duration-200 ${
                          isExpanded ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {/* Expanded Dropdown */}
                    {isExpanded && (
                      <div className="pb-4">
                        <div className="space-y-1 pl-4 border-l-2 border-[#FFC928]/30">
                          {item.dropdown.map((dropdownItem, idx) => (
                            <Link
                              key={idx}
                              to="/resource-hub"
                              className="flex flex-col py-2.5 text-[14px] text-slate-600 hover:text-[#163F78] transition-colors"
                            >
                              <span className="font-medium">{dropdownItem.label}</span>
                              {dropdownItem.description && (
                                <span className="text-[12px] text-slate-400">
                                  {dropdownItem.description}
                                </span>
                              )}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Mobile Actions */}
            <div className="flex flex-col gap-3 mt-6 pt-6 border-t border-[#E5E7EB]">
              <button className="w-full px-5 py-3.5 text-[14px] font-semibold bg-[#14213D] text-white rounded-xl hover:bg-[#163F78] transition-colors">
                Đăng ký nhận tin
              </button>
              <Link
                to="/"
                className="w-full text-center px-4 py-3 text-[14px] font-medium text-slate-500 hover:text-[#163F78] transition-colors"
              >
                Về Mecsu
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
