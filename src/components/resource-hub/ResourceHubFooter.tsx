import React from 'react';
import { Link } from 'react-router-dom';

const mecsuLogo = '/assets/mecsu.png';

export default function ResourceHubFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Logo & About */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg overflow-hidden">
                <img
                  src={mecsuLogo}
                  alt="Mecsu Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <span className="text-lg font-bold text-white">Mecsu</span>
                <span className="text-sm text-slate-400 block">Resource Hub</span>
              </div>
            </Link>
            <p className="text-[13px] text-slate-400 leading-relaxed">
              Trung tâm tài nguyên kiến thức B2B công nghiệp - Hướng dẫn mua hàng, kiến thức kỹ thuật và xu hướng công nghiệp.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[13px] font-bold text-white uppercase tracking-wider mb-4">
              Chủ đề
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/resource-hub" className="text-[13px] text-slate-400 hover:text-white transition-colors">
                  Hướng dẫn mua hàng
                </Link>
              </li>
              <li>
                <Link to="/resource-hub" className="text-[13px] text-slate-400 hover:text-white transition-colors">
                  Kiến thức kỹ thuật
                </Link>
              </li>
              <li>
                <Link to="/resource-hub" className="text-[13px] text-slate-400 hover:text-white transition-colors">
                  Tin tức ngành
                </Link>
              </li>
              <li>
                <Link to="/resource-hub" className="text-[13px] text-slate-400 hover:text-white transition-colors">
                  So sánh sản phẩm
                </Link>
              </li>
              <li>
                <Link to="/resource-hub" className="text-[13px] text-slate-400 hover:text-white transition-colors">
                  Kho vận & chuỗi cung ứng
                </Link>
              </li>
            </ul>
          </div>

          {/* Mecsu Links */}
          <div>
            <h4 className="text-[13px] font-bold text-white uppercase tracking-wider mb-4">
              Mecsu.vn
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-[13px] text-slate-400 hover:text-white transition-colors">
                  Tìm sản phẩm
                </Link>
              </li>
              <li>
                <Link to="/dich-vu-khach-hang" className="text-[13px] text-slate-400 hover:text-white transition-colors">
                  Dịch vụ khách hàng
                </Link>
              </li>
              <li>
                <Link to="/gioi-thieu" className="text-[13px] text-slate-400 hover:text-white transition-colors">
                  Về chúng tôi
                </Link>
              </li>
              <li>
                <Link to="/faqs" className="text-[13px] text-slate-400 hover:text-white transition-colors">
                  FAQs
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[13px] font-bold text-white uppercase tracking-wider mb-4">
              Liên hệ
            </h4>
            <ul className="space-y-2">
              <li className="text-[13px] text-slate-400">
                Hotline: 1900 0000
              </li>
              <li className="text-[13px] text-slate-400">
                Email: contact@mecsu.vn
              </li>
              <li className="text-[13px] text-slate-400">
                TP. Hồ Chí Minh
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-[12px] text-slate-500">
              © {currentYear} Mecsu.vn - Giải pháp vật tư công nghiệp cho doanh nghiệp
            </p>
            <div className="flex items-center gap-6">
              <Link to="/" className="text-[12px] text-slate-500 hover:text-white transition-colors">
                Điều khoản sử dụng
              </Link>
              <Link to="/" className="text-[12px] text-slate-500 hover:text-white transition-colors">
                Chính sách bảo mật
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
