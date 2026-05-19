import React, { useState } from 'react';
import { Facebook, Twitter, Youtube, Phone, Mail, MapPin, ChevronsUp } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'motion/react';

interface FooterProps {
  onBlogClick?: () => void;
  isCartDrawerOpen?: boolean;
  isCategoryOpen?: boolean;
  onCustomerServiceClick?: () => void;
}

export default function Footer({ onBlogClick, isCartDrawerOpen, isCategoryOpen, onCustomerServiceClick }: FooterProps) {
  const [showScroll, setShowScroll] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 300) {
      setShowScroll(true);
    } else {
      setShowScroll(false);
    }
  });

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-brand-secondary text-slate-300 font-sans border-t-[8px] border-brand-primary">
      
      {/* Footer Main - 4 Columns Grid Layout */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          
          {/* Column 1: Brand & Contact Highlight */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-brand-primary text-white font-black text-lg w-10 h-10 flex items-center justify-center rounded">M</div>
              <h3 className="text-white font-black text-lg uppercase tracking-tight italic">MECSU</h3>
            </div>
            
            <p className="text-[13px] text-slate-400 leading-relaxed mb-4">
              Giải pháp vật tư công nghiệp tiêu chuẩn quốc tế.
            </p>
            
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center gap-2.5">
                <Phone size={15} className="text-brand-primary flex-shrink-0" />
                <a href="tel:18008137" className="text-[15px] text-white font-bold hover:text-yellow-300 transition-colors">
                  1800 8137
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail size={15} className="text-brand-primary flex-shrink-0" />
                <a href="mailto:sales@mecsu.vn" className="text-[13px] text-slate-400 hover:text-white transition-colors">
                  sales@mecsu.vn
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: VỀ MECSU */}
          <div className="flex flex-col">
            <h3 className="text-white font-bold text-[11px] uppercase tracking-[0.12em] mb-5 pb-3 border-b border-white/[0.08]">
              Về Mecsu
            </h3>
            <ul className="flex flex-col gap-3 text-[13px]">
              <li>
                <a href="/gioi-thieu" className="text-slate-400 hover:text-white transition-colors duration-200">Giới thiệu công ty</a>
              </li>
              <li>
                <button onClick={onBlogClick} className="text-slate-400 hover:text-white transition-colors duration-200 cursor-pointer text-left">
                  Blog kỹ thuật
                </button>
              </li>
              <li>
                <a href="/resource-hub" className="text-slate-400 hover:text-white transition-colors duration-200">Trung tâm tài nguyên</a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-white transition-colors duration-200">Khách hàng VIP</a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-white transition-colors duration-200">Chính sách bảo mật</a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-white transition-colors duration-200">Liên hệ</a>
              </li>
            </ul>
          </div>

          {/* Column 3: HỖ TRỢ KHÁCH HÀNG */}
          <div className="flex flex-col">
            <h3 className="text-white font-bold text-[11px] uppercase tracking-[0.12em] mb-5 pb-3 border-b border-white/[0.08]">
              Hỗ trợ khách hàng
            </h3>
            <ul className="flex flex-col gap-3 text-[13px]">
              <li>
                <a href="/faqs" className="text-slate-400 hover:text-white transition-colors duration-200">Câu hỏi thường gặp</a>
              </li>
              <li>
                <a href="/faqs/dat-hang" className="text-slate-400 hover:text-white transition-colors duration-200">Hướng dẫn mua hàng</a>
              </li>
              <li>
                <a href="/faqs/thanh-toan" className="text-slate-400 hover:text-white transition-colors duration-200">Hướng dẫn thanh toán</a>
              </li>
              <li>
                <button 
                  onClick={onCustomerServiceClick}
                  className="text-slate-400 hover:text-white transition-colors duration-200 cursor-pointer text-left"
                >
                  Dịch vụ khách hàng
                </button>
              </li>
              <li>
                <a href="/faqs" className="text-slate-400 hover:text-white transition-colors duration-200">FAQs</a>
              </li>
              <li>
                <a href="/faqs/giao-hang" className="text-slate-400 hover:text-white transition-colors duration-200">Phương thức giao hàng</a>
              </li>
              <li>
                <a href="/faqs/tai-khoan" className="text-slate-400 hover:text-white transition-colors duration-200">Hướng dẫn tạo tài khoản</a>
              </li>
            </ul>
          </div>

          {/* Column 4: KẾT NỐI VỚI MECSU */}
          <div className="flex flex-col">
            <h3 className="text-white font-bold text-[11px] uppercase tracking-[0.12em] mb-5 pb-3 border-b border-white/[0.08]">
              Kết nối với Mecsu
            </h3>
            
            {/* Social Icons */}
            <div className="flex gap-2.5 mb-5">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 bg-white rounded-full flex items-center justify-center text-[#1a3c5e] hover:bg-[#1a3c5e] hover:text-white transition-all duration-200"
                aria-label="Facebook"
              >
                <Facebook size={16} strokeWidth={2} />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 bg-white rounded-full flex items-center justify-center text-[#1a3c5e] hover:bg-[#1a3c5e] hover:text-white transition-all duration-200"
                aria-label="Twitter"
              >
                <Twitter size={16} strokeWidth={2} />
              </a>
              <a 
                href="https://pinterest.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 bg-white rounded-full flex items-center justify-center text-[#1a3c5e] hover:bg-[#1a3c5e] hover:text-white transition-all duration-200"
                aria-label="Pinterest"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
                </svg>
              </a>
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 bg-white rounded-full flex items-center justify-center text-[#1a3c5e] hover:bg-[#1a3c5e] hover:text-white transition-all duration-200"
                aria-label="YouTube"
              >
                <Youtube size={16} strokeWidth={2} />
              </a>
              <a 
                href="https://zalo.me" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 bg-white rounded-full flex items-center justify-center text-[#1a3c5e] hover:bg-[#1a3c5e] hover:text-white transition-all duration-200"
                aria-label="Zalo"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 16.25c-.021.327-.327.567-.655.567h-1.474c-.327 0-.572-.24-.572-.568v-1.965c0-.104-.063-.198-.146-.25l-.354-.188c-.25-.104-.354-.271-.25-.5l.271-.594c.021-.063.063-.104.104-.146l.333-.25c.313-.271.688-.583.938-.938.042-.083.083-.146.083-.25v-.042c0-.292-.25-.542-.563-.542-.083 0-.146.021-.23.042-.49.146-.896.292-1.407.354-.5.063-.876.292-1.093.771-.25.542-.521 1.084-.771 1.646-.25.521-.563.771-1.093.771-.083 0-.188-.021-.27-.042a.49.49 0 01-.292-.396c-.021-.146-.063-.271-.063-.396 0-.146 0-.271.021-.417 0-.188.021-.375.042-.563 0-.104.021-.188.021-.292.021-.167.083-.292.25-.333.604-.167 1.187-.417 1.729-.729.021-.021.042-.021.063-.021.073-.021.135-.01.188.021l.25.125c.229.104.333.271.229.5-.042.104-.083.188-.125.271-.146.25-.292.48-.459.709-.229.25-.48.459-.75.667a2.8 2.8 0 01-.854.479c-.063.021-.125.063-.167.104-.021.021-.042.042-.042.063v.104c0 .021-.021.042-.021.063l-.083.104c-.021.021-.042.042-.042.063v.188c0 .021.021.042.021.063v.021c.125.167.292.25.5.25h.063c.063-.021.125-.042.188-.063.146-.042.271-.083.396-.146.479-.208.938-.479 1.407-.771.063-.042.146-.063.229-.063.417 0 .771.375.771.813v.063c0 .021.021.042.021.063v.021c0 .354-.063.667-.167.959a3.9 3.9 0 01-.479.875 7.5 7.5 0 01-.729.833 9 9 0 01-.875.771c-.354.292-.75.563-1.187.792-.667.333-1.375.604-2.104.813-.021 0-.063.021-.083.042-.438.125-.875.229-1.333.292-.375.042-.75.083-1.125.083-.146 0-.292 0-.438-.021-.188-.021-.375-.063-.563-.125-.021 0-.042 0-.063-.021-.083-.021-.146-.021-.188-.021-.167-.042-.313-.188-.313-.375 0-.042.021-.083.021-.125v-.083c0-.104.083-.188.188-.188h.021l.125.042c.438.104.896.167 1.375.167.563 0 1.125-.063 1.688-.188.75-.167 1.479-.396 2.187-.688.167-.063.333-.146.5-.229.229-.104.396-.146.625-.042l.021.021c.25.146.521.292.792.396.167.063.313.146.48.208.125.042.271.063.417.084.438.042.854-.063 1.25-.333.167-.104.313-.25.459-.396l.125-.125c.083-.104.146-.146.25-.125h.042c.125.021.25.042.375.042h.354c.188 0 .354-.083.479-.188.104-.104.188-.25.188-.417v-.583z"/>
                </svg>
              </a>
            </div>

            {/* Contact Info */}
            <p className="text-[13px] text-slate-400 mb-4">
              Cần hỗ trợ hãy liên hệ với Mecsu.
            </p>
            
            <ul className="flex flex-col gap-2.5 text-[13px]">
              <li className="flex items-start gap-2.5">
                <Phone size={14} className="text-brand-primary mt-0.5 flex-shrink-0" />
                <span className="text-slate-400">Tổng đài CSKH: <strong className="text-white font-semibold">18008137</strong></span>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail size={14} className="text-brand-primary mt-0.5 flex-shrink-0" />
                <span className="text-slate-400">
                  <a href="mailto:sales@mecsu.vn" className="hover:text-white transition-colors">sales@mecsu.vn</a>
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin size={14} className="text-brand-primary mt-1 flex-shrink-0" />
                <span className="text-slate-400 leading-snug">B28/i - B29/i, Đường Số 2B, Bình Hưng Hòa B, Bình Tân, TP.HCM</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-white/[0.06]"></div>

      {/* Footer Bottom - Copyright & Legal - Zoro Style */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5">
          
          {/* Left: Copyright & Certifications */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
              © 2026. Công ty cổ phần Mecsu. Giấy chứng nhận ĐKKD số 0313039340 do Sở KH&ĐT TP.HCM cấp ngày 23/05/2016
            </p>
            <div className="flex items-center gap-3">
              <a 
                href="http://online.gov.vn/Home/WebDetails/71868?AspxAutoDetectCookieSupport=1" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block"
              >
                <img src="/assets/logoSaleNoti.png" alt="Bộ Công Thương" className="h-9" />
              </a>
              <a 
                href="https://www.dmca.com/Protection/Status.aspx?ID=be7aa439-eb56-4e40-8cad-5071286d26d5&refurl=https://mecsu.vn/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block"
              >
                <img src="/assets/dmca.png" alt="DMCA" className="h-9" />
              </a>
            </div>
          </div>

          {/* Right: Legal Links */}
          <div className="flex items-center gap-5">
            <a href="#" className="text-[11px] font-semibold text-slate-500 hover:text-white transition-colors uppercase tracking-wide">Site map</a>
            <span className="text-white/10">|</span>
            <a href="#" className="text-[11px] font-semibold text-slate-500 hover:text-white transition-colors uppercase tracking-wide">Privacy</a>
            <span className="text-white/10">|</span>
            <a href="#" className="text-[11px] font-semibold text-slate-500 hover:text-white transition-colors uppercase tracking-wide">Cookies</a>
          </div>
        </div>
      </div>

      {/* Floating Actions Container */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-[100] items-end">
        <AnimatePresence>
          {showScroll && !isCartDrawerOpen && !isCategoryOpen && (
            <motion.button 
              initial={{ opacity: 0, x: 20, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.8 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={scrollToTop}
              className="flex items-center gap-2 px-5 py-2.5 bg-brand-secondary text-white rounded-2xl shadow-xl border border-white/10 group overflow-hidden"
            >
              <span className="font-bold text-sm tracking-tight">Lên đầu</span>
              <ChevronsUp size={20} className="group-hover:-translate-y-0.5 transition-transform" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </footer>
  );
}
