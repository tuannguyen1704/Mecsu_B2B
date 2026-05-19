import React, { useState, useMemo, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
  Search,
  ChevronRight,
  ChevronDown,
  MessageCircle,
  Phone,
  Mail,
  Clock,
  HelpCircle,
  Package,
  FileCheck,
  Truck,
  RefreshCw,
  Building2,
  FileText,
  Quote,
  Download,
  Wrench,
  ArrowRight,
  Headphones,
  ClipboardList,
  Send,
  Calendar,
  TrendingUp,
  Bookmark,
  CheckCircle,
  ExternalLink,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Breadcrumb } from './common/Breadcrumb';

// FAQ Data Type
interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

interface FAQCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  faqs: FAQItem[];
}

// FAQ Categories Data
const FAQ_CATEGORIES: FAQCategory[] = [
  {
    id: 'dat-hang',
    name: 'Đặt hàng',
    icon: <Package size={16} strokeWidth={1.8} />,
    description: 'Hướng dẫn các cách đặt hàng trên Mecsu',
    faqs: [
      {
        id: 'dh-1',
        question: 'Làm sao để đặt hàng trên Mecsu?',
        answer: 'Bạn có thể đặt hàng trên Mecsu bằng nhiều cách: (1) Tìm kiếm sản phẩm qua thanh tìm kiếm hoặc danh mục, chọn sản phẩm, điều chỉnh số lượng và nhấn "Thêm vào giỏ hàng", sau đó tiến hành thanh toán. (2) Đặt hàng trực tiếp bằng mã sản phẩm nếu bạn đã biết mã. (3) Gửi danh sách mã hàng qua email hoặc chat để được hỗ trợ đặt hàng nhanh chóng.',
      },
      {
        id: 'dh-2',
        question: 'Tôi có thể đặt hàng khi chưa có tài khoản không?',
        answer: 'Có, bạn có thể đặt hàng với tư cách khách hàng vãng lai. Tuy nhiên, việc tạo tài khoản sẽ giúp bạn: theo dõi đơn hàng dễ dàng hơn, xem lịch sử mua hàng, lưu thông tin giao hàng, và nhận các ưu đãi dành riêng cho thành viên.',
      },
      {
        id: 'dh-3',
        question: 'Làm sao để hủy đơn hàng?',
        answer: 'Bạn có thể hủy đơn hàng trong các trường hợp: (1) Đơn hàng chưa được xác nhận: Liên hệ hotline 1800 8137 hoặc chat với tư vấn viên ngay để hủy. (2) Đơn hàng đang xử lý: Liên hệ càng sớm càng tốt, nếu chưa xuất kho thì có thể hủy được. Lưu ý: Đơn hàng đã xuất kho không thể hủy, bạn có thể từ chối nhận hàng và yêu cầu đổi/trả.',
      },
      {
        id: 'dh-4',
        question: 'Tôi có thể chỉnh sửa đơn hàng sau khi đặt không?',
        answer: 'Bạn có thể chỉnh sửa đơn hàng nếu đơn hàng chưa được xác nhận xuất kho. Các thông tin có thể chỉnh sửa bao gồm: địa chỉ giao hàng, số lượng sản phẩm, hoặc thêm/sửa sản phẩm. Để chỉnh sửa, hãy liên hệ hotline 1800 8137 hoặc chat với tư vấn viên ngay.',
      },
      {
        id: 'dh-5',
        question: 'Làm sao để yêu cầu báo giá trước khi mua?',
        answer: 'Bạn có thể yêu cầu báo giá bằng cách: (1) Gửi danh sách mã sản phẩm và số lượng cần mua qua email sales@mecsu.vn. (2) Sử dụng chức năng "Yêu cầu báo giá" trong trang Dịch vụ khách hàng. (3) Chat trực tiếp với tư vấn viên để được báo giá nhanh.',
      },
      {
        id: 'dh-6',
        question: 'Tôi có thể mua số lượng lớn cho doanh nghiệp không?',
        answer: 'Có, Mecsu hỗ trợ mua số lượng lớn cho doanh nghiệp với: (1) Giá cả cạnh tranh cho đơn hàng số lượng lớn. (2) Báo giá chi tiết theo danh sách mã hàng của bạn. (3) Giao hàng theo lịch trình nếu cần. Hãy gửi danh sách nhu cầu qua email hoặc chat với tư vấn viên.',
      },
      {
        id: 'dh-7',
        question: 'Làm sao để kiểm tra trạng thái đơn hàng?',
        answer: 'Bạn có thể kiểm tra trạng thái đơn hàng bằng cách: (1) Đăng nhập vào tài khoản Mecsu, vào mục "Đơn hàng" để xem chi tiết. (2) Sử dụng mã đơn hàng để tra cứu nhanh. (3) Liên hệ hotline 1800 8137 và cung cấp mã đơn hàng để được hỗ trợ.',
      },
      {
        id: 'dh-8',
        question: 'Tôi có thể đặt hàng bằng mã sản phẩm hoặc hình ảnh không?',
        answer: 'Có, bạn có thể đặt hàng bằng: (1) Mã sản phẩm: Nhập trực tiếp mã sản phẩm vào thanh tìm kiếm để tìm và đặt hàng nhanh. (2) Hình ảnh: Gửi hình ảnh sản phẩm qua chat hoặc email, đội ngũ Mecsu sẽ hỗ trợ tìm sản phẩm tương tự và báo giá cho bạn.',
      },
      {
        id: 'dh-9',
        question: 'Mecsu có hỗ trợ tìm sản phẩm tương đương không?',
        answer: 'Có, đội ngũ kỹ thuật Mecsu hỗ trợ tìm sản phẩm tương đương (equivalent) khi sản phẩm bạn cần không có sẵn. Chúng tôi có kinh nghiệm với các tiêu chuẩn ISO, DIN, JIS và nhiều tiêu chuẩn quốc tế khác.',
      },
      {
        id: 'dh-10',
        question: 'Tôi có thể đặt lại sản phẩm đã mua trước đó không?',
        answer: 'Có, bạn có thể đặt lại sản phẩm đã mua trước đó bằng cách: (1) Truy cập "Lịch sử mua hàng" trong tài khoản, tìm sản phẩm và nhấn "Mua lại". (2) Sử dụng chức năng "Đặt lại" trong chi tiết đơn hàng cũ.',
      },
    ],
  },
  {
    id: 'thanh-toan',
    name: 'Thanh toán',
    icon: <FileCheck size={16} strokeWidth={1.8} />,
    description: 'Thông tin về các phương thức thanh toán',
    faqs: [
      {
        id: 'tt-1',
        question: 'Mecsu hỗ trợ những phương thức thanh toán nào?',
        answer: 'Mecsu hỗ trợ các phương thức thanh toán: (1) Thanh toán khi nhận hàng (COD). (2) Chuyển khoản ngân hàng. (3) Thẻ tín dụng/ghi nợ (Visa, Mastercard). (4) Ví điện tử (MoMo, ZaloPay, VNPay). Đơn hàng có giá trị lớn có thể được xem xét thanh toán theo điều kiện riêng.',
      },
      {
        id: 'tt-2',
        question: 'Khi nào tôi nhận được hóa đơn?',
        answer: 'Hóa đơn sẽ được xuất trong các trường hợp: (1) Hóa đơn điện tử (VAT) được gửi qua email ngay sau khi đơn hàng được xác nhận thanh toán. (2) Hóa đơn giấy được đính kèm trong kiện hàng. (3) Bạn có thể tải hóa đơn từ trang chi tiết đơn hàng trong tài khoản.',
      },
      {
        id: 'tt-3',
        question: 'Tôi có thể thanh toán bằng thẻ doanh nghiệp không?',
        answer: 'Có, Mecsu chấp nhận thanh toán bằng thẻ doanh nghiệp (Corporate Card) và thẻ tín dụng cá nhân. Đối với doanh nghiệp cần thanh toán qua tài khoản công ty hoặc hạn mức tín dụng riêng, vui lòng liên hệ bộ phận kinh doanh để được tư vấn.',
      },
      {
        id: 'tt-4',
        question: 'Làm sao để xuất hóa đơn VAT cho doanh nghiệp?',
        answer: 'Để xuất hóa đơn VAT, bạn cần cung cấp: Tên công ty, địa chỉ, mã số thuế, và email nhận hóa đơn khi đặt hàng. Hóa đơn VAT sẽ được gửi qua email sau khi đơn hàng được thanh toán.',
      },
      {
        id: 'tt-5',
        question: 'Chính sách thanh toán cho đơn hàng số lượng lớn?',
        answer: 'Đối với đơn hàng số lượng lớn, Mecsu có các phương thức thanh toán linh hoạt: (1) Thanh toán theo đợt giao hàng. (2) Thanh toán sau khi nhận đủ hàng. (3) Hợp đồng với điều khoản thanh toán cho doanh nghiệp.',
      },
    ],
  },
  {
    id: 'giao-hang',
    name: 'Giao hàng',
    icon: <Truck size={16} strokeWidth={1.8} />,
    description: 'Thông tin về vận chuyển và giao hàng',
    faqs: [
      {
        id: 'gh-1',
        question: 'Thời gian giao hàng dự kiến là bao lâu?',
        answer: 'Thời gian giao hàng phụ thuộc vào khu vực và sản phẩm: (1) Khu vực TP.HCM và lân cận: 1-2 ngày làm việc. (2) Khu vực miền Nam: 2-3 ngày làm việc. (3) Khu vực miền Trung: 3-5 ngày làm việc. (4) Khu vực miền Bắc: 4-7 ngày làm việc.',
      },
      {
        id: 'gh-2',
        question: 'Tôi có thể thay đổi địa chỉ giao hàng không?',
        answer: 'Bạn có thể thay đổi địa chỉ giao hàng nếu đơn hàng chưa được xuất kho. Để thay đổi, hãy liên hệ hotline 1800 8137 ngay khi phát hiện sai địa chỉ hoặc chat với tư vấn viên để cập nhật địa chỉ mới.',
      },
      {
        id: 'gh-3',
        question: 'Mecsu có giao hàng vào cuối tuần không?',
        answer: 'Mecsu hỗ trợ giao hàng vào thứ 7 cho một số khu vực TP.HCM và Hà Nội. Để đặt giao hàng cuối tuần, vui lòng liên hệ hotline hoặc chat với tư vấn viên để xác nhận khả năng giao hàng và phí vận chuyển bổ sung (nếu có).',
      },
      {
        id: 'gh-4',
        question: 'Làm sao để theo dõi đơn hàng đang vận chuyển?',
        answer: 'Bạn có thể theo dõi đơn hàng qua: (1) Email/SMS thông báo: Bạn sẽ nhận được thông tin mã vận đơn khi đơn hàng được bàn giao cho đơn vị vận chuyển. (2) Kiểm tra trong tài khoản: Truy cập mục "Đơn hàng" để xem chi tiết trạng thái. (3) Liên hệ hotline 1800 8137.',
      },
      {
        id: 'gh-5',
        question: 'Phí vận chuyển được tính như thế nào?',
        answer: 'Phí vận chuyển được tính dựa trên: (1) Trọng lượng và kích thước sản phẩm. (2) Khu vực giao hàng. (3) Đơn vị vận chuyển được chọn. Bạn sẽ thấy phí vận chuyển được hiển thị rõ ràng trước khi xác nhận đặt hàng.',
      },
    ],
  },
  {
    id: 'doi-tra-bao-hanh',
    name: 'Đổi trả & bảo hành',
    icon: <RefreshCw size={16} strokeWidth={1.8} />,
    description: 'Chính sách đổi trả và bảo hành sản phẩm',
    faqs: [
      {
        id: 'dt-1',
        question: 'Chính sách đổi trả của Mecsu như thế nào?',
        answer: 'Mecsu chấp nhận đổi trả sản phẩm trong các trường hợp: (1) Sản phẩm bị lỗi từ nhà sản xuất. (2) Sản phẩm không đúng với mô tả trên website. (3) Sản phẩm bị hư hỏng trong quá trình vận chuyển. Thời hạn đổi trả: 7 ngày kể từ ngày nhận hàng.',
      },
      {
        id: 'dt-2',
        question: 'Sản phẩm lỗi kỹ thuật thì xử lý ra sao?',
        answer: 'Đối với sản phẩm lỗi kỹ thuật, Mecsu xử lý như sau: (1) Gửi hình ảnh/video mô tả lỗi cho tư vấn viên. (2) Đội ngũ kỹ thuật xác nhận lỗi. (3) Đổi mới sản phẩm hoặc hoàn tiền theo yêu cầu của khách. Thời gian xử lý: 3-5 ngày làm việc.',
      },
      {
        id: 'dt-3',
        question: 'Quy trình đổi trả sản phẩm như thế nào?',
        answer: 'Quy trình đổi trả: (1) Liên hệ hotline 1800 8137 hoặc gửi yêu cầu qua website để đăng ký đổi trả. (2) Mecsu sẽ hướng dẫn bạn đóng gói và gửi sản phẩm về. (3) Sau khi sản phẩm được xác nhận đủ điều kiện đổi trả, Mecsu sẽ tiến hành đổi mới hoặc hoàn tiền.',
      },
      {
        id: 'dt-4',
        question: 'Sản phẩm đặt hàng riêng có được đổi trả không?',
        answer: 'Sản phẩm đặt hàng riêng (không có sẵn trong kho) thường không được đổi trả do được sản xuất theo yêu cầu riêng. Tuy nhiên, nếu sản phẩm bị lỗi hoặc không đúng thông số kỹ thuật, Mecsu sẽ hỗ trợ đổi trả hoặc bảo hành.',
      },
      {
        id: 'dt-5',
        question: 'Thời gian bảo hành sản phẩm là bao lâu?',
        answer: 'Thời gian bảo hành tùy thuộc vào loại sản phẩm: (1) Dụng cụ cầm tay: 6-12 tháng. (2) Thiết bị điện: 12-24 tháng. (3) Bulong, ốc vít: Theo tiêu chuẩn nhà sản xuất. Chi tiết bảo hành được ghi rõ trên hóa đơn.',
      },
    ],
  },
  {
    id: 'tai-khoan',
    name: 'Tài khoản',
    icon: <Building2 size={16} strokeWidth={1.8} />,
    description: 'Quản lý tài khoản và thông tin cá nhân',
    faqs: [
      {
        id: 'tk-1',
        question: 'Làm sao để tạo tài khoản Mecsu?',
        answer: 'Bạn có thể tạo tài khoản Mecsu bằng cách: (1) Nhấn "Đăng ký" ở góc phải header và điền thông tin cần thiết. (2) Đăng ký nhanh bằng email hoặc số điện thoại. (3) Tạo tài khoản ngay sau lần mua hàng đầu tiên.',
      },
      {
        id: 'tk-2',
        question: 'Quên mật khẩu thì phải làm gì?',
        answer: 'Nếu quên mật khẩu, bạn có thể: (1) Nhấn "Quên mật khẩu" trên trang đăng nhập. (2) Nhập email hoặc số điện thoại đã đăng ký. (3) Mecsu sẽ gửi link đặt lại mật khẩu qua email/SMS. (4) Nhấn vào link và đặt mật khẩu mới.',
      },
      {
        id: 'tk-3',
        question: 'Tôi có thể thay đổi thông tin tài khoản không?',
        answer: 'Có, bạn có thể thay đổi các thông tin tài khoản: (1) Họ tên, số điện thoại, email. (2) Địa chỉ giao hàng mặc định. (3) Thêm/sửa/xóa địa chỉ giao hàng. (4) Thay đổi mật khẩu. Truy cập mục "Tài khoản" > "Hồ sơ" để cập nhật.',
      },
      {
        id: 'tk-4',
        question: 'Làm sao để xem lịch sử mua hàng?',
        answer: 'Để xem lịch sử mua hàng: (1) Đăng nhập vào tài khoản Mecsu. (2) Truy cập mục "Đơn hàng" trong menu tài khoản. (3) Bạn sẽ thấy danh sách tất cả đơn hàng với trạng thái chi tiết.',
      },
      {
        id: 'tk-5',
        question: 'Mecsu có chương trình khách hàng thân thiết không?',
        answer: 'Mecsu thường xuyên có các chương trình ưu đãi cho khách hàng: (1) Ưu đãi cho khách hàng doanh nghiệp VIP. (2) Mã giảm giá và khuyến mãi theo mùa. (3) Ưu đãi đặc biệt cho đơn hàng số lượng lớn.',
      },
    ],
  },
  {
    id: 'thong-tin-san-pham',
    name: 'Thông tin sản phẩm',
    icon: <FileText size={16} strokeWidth={1.8} />,
    description: 'Tìm hiểu về thông số và đặc tính sản phẩm',
    faqs: [
      {
        id: 'tsp-1',
        question: 'Làm sao để kiểm tra thông số kỹ thuật của sản phẩm?',
        answer: 'Thông số kỹ thuật của sản phẩm được hiển thị chi tiết trên trang sản phẩm, bao gồm: (1) Kích thước, vật liệu, tiêu chuẩn. (2) Tải trọng, áp suất, nhiệt độ làm việc. (3) Mã sản phẩm gốc và mã tương đương.',
      },
      {
        id: 'tsp-2',
        question: 'Nếu hình ảnh không giống sản phẩm thực tế thì sao?',
        answer: 'Mecsu luôn cố gắng cung cấp hình ảnh chính xác nhất cho sản phẩm. Tuy nhiên, có thể có sự khác biệt nhỏ về màu sắc do ánh sáng và màn hình hiển thị. Nếu sản phẩm nhận được không đúng như mô tả, bạn có quyền đổi trả.',
      },
      {
        id: 'tsp-3',
        question: 'Mecsu có cung cấp mẫu thử sản phẩm không?',
        answer: 'Đối với một số sản phẩm, Mecsu có thể hỗ trợ: (1) Mẫu thử cho dụng cụ và thiết bị cầm tay. (2) Catalogue và tài liệu kỹ thuật miễn phí. (3) Tư vấn kỹ thuật trực tiếp để chọn đúng sản phẩm.',
      },
      {
        id: 'tsp-4',
        question: 'Làm sao để tìm sản phẩm tương đương thay thế?',
        answer: 'Để tìm sản phẩm tương đương: (1) Sử dụng chức năng tìm kiếm nâng cao với bộ lọc tiêu chuẩn (ISO, DIN, ANSI). (2) Gửi thông số kỹ thuật hoặc hình ảnh sản phẩm cần thay thế. (3) Liên hệ tư vấn viên kỹ thuật.',
      },
      {
        id: 'tsp-5',
        question: 'Sản phẩm trên Mecsu có chính hãng không?',
        answer: 'Tất cả sản phẩm trên Mecsu đều được cam kết 100% chính hãng từ các nhà sản xuất uy tín. Có đầy đủ chứng nhận xuất xứ (CO) và chất lượng (CQ). Mecsu là nhà phân phối ủy quyền của nhiều thương hiệu quốc tế.',
      },
    ],
  },
  {
    id: 'bao-gia-doanh-nghiep',
    name: 'Báo giá doanh nghiệp',
    icon: <Quote size={16} strokeWidth={1.8} />,
    description: 'Báo giá và ưu đãi cho doanh nghiệp',
    faqs: [
      {
        id: 'bg-1',
        question: 'Làm sao để yêu cầu báo giá cho doanh nghiệp?',
        answer: 'Bạn có thể yêu cầu báo giá bằng nhiều cách: (1) Gửi danh sách mã sản phẩm và số lượng qua email sales@mecsu.vn. (2) Sử dụng form "Yêu cầu báo giá" trên website. (3) Chat trực tiếp với tư vấn viên. Báo giá thường được gửi trong 2-4 giờ làm việc.',
      },
      {
        id: 'bg-2',
        question: 'Mecsu có hỗ trợ giá sỉ cho doanh nghiệp không?',
        answer: 'Có, Mecsu có chính sách giá sỉ hấp dẫn cho doanh nghiệp: (1) Giảm giá theo số lượng đặt hàng. (2) Ưu đãi cho khách hàng thân thiết và doanh nghiệp VIP. (3) Báo giá riêng cho dự án đặc thù.',
      },
      {
        id: 'bg-3',
        question: 'Mecsu có ký hợp đồng cung cấp hàng cho doanh nghiệp không?',
        answer: 'Có, Mecsu hỗ trợ ký hợp đồng cung cấp cho doanh nghiệp với: (1) Cam kết về giá và số lượng trong thời gian nhất định. (2) Giao hàng theo lịch trình và điểm giao hàng quy định. (3) Thanh toán theo điều khoản thỏa thuận.',
      },
      {
        id: 'bg-4',
        question: 'Thời gian phản hồi báo giá là bao lâu?',
        answer: 'Thời gian phản hồi báo giá: (1) Báo giá thông thường: 2-4 giờ trong giờ làm việc. (2) Báo giá cho danh sách dài (trên 50 mã): 24 giờ. (3) Báo giá cho dự án đặc biệt: 2-3 ngày làm việc.',
      },
      {
        id: 'bg-5',
        question: 'Doanh nghiệp có được xuất hóa đơn VAT riêng không?',
        answer: 'Có, Mecsu hỗ trợ xuất hóa đơn VAT riêng cho doanh nghiệp: (1) Theo từng đơn hàng. (2) Theo tháng/quý theo yêu cầu. (3) Hóa đơn tổng hợp cho nhiều đơn hàng.',
      },
    ],
  },
  {
    id: 'hoa-don-chung-tu',
    name: 'Hóa đơn & chứng từ',
    icon: <Download size={16} strokeWidth={1.8} />,
    description: 'Quản lý hóa đơn và chứng từ mua hàng',
    faqs: [
      {
        id: 'hd-1',
        question: 'Làm sao để xuất hóa đơn VAT?',
        answer: 'Để xuất hóa đơn VAT, bạn cần: (1) Cung cấp thông tin xuất hóa đơn khi đặt hàng (tên công ty, địa chỉ, mã số thuế). (2) Hóa đơn điện tử sẽ được gửi qua email sau khi thanh toán. (3) Kiểm tra và tải hóa đơn từ trang chi tiết đơn hàng.',
      },
      {
        id: 'hd-2',
        question: 'Tôi có thể tải lại hóa đơn cũ không?',
        answer: 'Có, bạn có thể tải lại hóa đơn: (1) Đăng nhập vào tài khoản Mecsu. (2) Truy cập mục "Đơn hàng" và chọn đơn hàng cần xem. (3) Nhấn "Tải hóa đơn" để tải file PDF. Hóa đơn được lưu trữ vĩnh viễn trong tài khoản.',
      },
      {
        id: 'hd-3',
        question: 'Tôi cần sửa thông tin hóa đơn thì làm sao?',
        answer: 'Để sửa thông tin hóa đơn: (1) Liên hệ hotline 1800 8137 ngay trong ngày nhận được hóa đơn. (2) Cung cấp mã đơn hàng và thông tin cần sửa. (3) Mecsu sẽ hủy hóa đơn cũ và xuất hóa đơn điều chỉnh.',
      },
      {
        id: 'hd-4',
        question: 'Làm sao để lấy chứng từ giao hàng?',
        answer: 'Chứng từ giao hàng (phiếu giao hàng) được đính kèm trong kiện hàng. Phiếu giao hàng có chữ ký của người nhận sẽ được lưu trữ điện tử. Bạn có thể yêu cầu bản scan phiếu giao hàng qua email.',
      },
      {
        id: 'hd-5',
        question: 'Mecsu có xuất hóa đơn điện tử không?',
        answer: 'Có, Mecsu xuất hóa đơn điện tử (VAT invoice) theo quy định của pháp luật: (1) Hóa đơn được gửi qua email ngay sau khi đơn hàng được xác nhận thanh toán. (2) Hóa đơn có giá trị pháp lý tương đương hóa đơn giấy. (3) File PDF và XML được lưu trong tài khoản.',
      },
    ],
  },
  {
    id: 'tu-van-ky-thuat',
    name: 'Tư vấn kỹ thuật',
    icon: <Wrench size={16} strokeWidth={1.8} />,
    description: 'Hỗ trợ tư vấn kỹ thuật chuyên nghiệp',
    faqs: [
      {
        id: 'tv-1',
        question: 'Tôi không biết chọn đúng sản phẩm thì phải làm sao?',
        answer: 'Đội ngũ kỹ thuật Mecsu luôn sẵn sàng hỗ trợ: (1) Cung cấp thông số kỹ thuật và yêu cầu công việc cụ thể. (2) Gửi hình ảnh hoặc bản vẽ của sản phẩm cần thay thế. (3) Mô tả ứng dụng và điều kiện làm việc.',
      },
      {
        id: 'tv-2',
        question: 'Có thể gửi hình ảnh/mã sản phẩm để được tư vấn không?',
        answer: 'Có, bạn có thể gửi hình ảnh và mã sản phẩm qua: (1) Chat trực tiếp trên website với tư vấn viên. (2) Email kèm hình ảnh đính kèm đến sales@mecsu.vn. (3) Zalo OA Mecsu. Đội ngũ kỹ thuật sẽ phân tích và đề xuất sản phẩm phù hợp.',
      },
      {
        id: 'tv-3',
        question: 'Mecsu có hỗ trợ tư vấn tại công trường không?',
        answer: 'Đối với các dự án lớn hoặc yêu cầu phức tạp, Mecsu có thể sắp xếp: (1) Tư vấn qua điện thoại hoặc video call. (2) Hỗ trợ tư vấn tại kho hàng để khách hàng kiểm tra sản phẩm. (3) Kỹ sư ứng dụng hỗ trợ tại công trường cho các dự án đặc thù.',
      },
      {
        id: 'tv-4',
        question: 'Thời gian phản hồi tư vấn kỹ thuật là bao lâu?',
        answer: 'Thời gian phản hồi tư vấn kỹ thuật: (1) Trong giờ làm việc (8:00-17:30): phản hồi trong 30-60 phút. (2) Chat/Zalo: phản hồi ngay lập tức. (3) Email: phản hồi trong 2-4 giờ làm việc.',
      },
      {
        id: 'tv-5',
        question: 'Mecsu có tài liệu kỹ thuật (catalogue, datasheet) không?',
        answer: 'Có, Mecsu cung cấp tài liệu kỹ thuật cho khách hàng: (1) Catalogue sản phẩm theo danh mục. (2) Datasheet và bản vẽ kỹ thuật (CAD/PDF). (3) Hướng dẫn sử dụng và bảo quản. (4) Chứng nhận chất lượng và xuất xứ.',
      },
    ],
  },
];

// Quick Support Actions Component
const QuickSupportActions = () => {
  const actions = [
    { label: 'Liên hệ Mecsu', href: '/dich-vu-khach-hang', icon: <Headphones size={15} /> },
    { label: 'Theo dõi đơn hàng', href: '/tai-khoan/don-hang', icon: <Package size={15} /> },
    { label: 'Gửi yêu cầu báo giá', href: '/tai-khoan/bao-gia', icon: <FileCheck size={15} /> },
    { label: 'Yêu cầu đổi/trả hàng', href: '/tai-khoan/don-hang/doi-tra', icon: <RefreshCw size={15} /> },
  ];

  return (
    <div className="mt-5 pt-5 border-t border-slate-100">
      <h4 className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-3">
        Hỗ trợ nhanh
      </h4>
      <div className="flex flex-col gap-1.5">
        {actions.map((action, idx) => (
          <Link
            key={idx}
            to={action.href}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[12px] text-slate-600 
                     hover:bg-slate-50 hover:text-brand-secondary transition-all duration-150 group"
          >
            <span className="text-slate-400 group-hover:text-brand-secondary transition-colors">
              {action.icon}
            </span>
            <span>{action.label}</span>
            <ChevronRight size={12} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
        ))}
      </div>
    </div>
  );
};

// FAQ Item Component
interface FAQItemComponentProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}

const FAQItemComponent: React.FC<FAQItemComponentProps> = ({ question, answer, isOpen, onToggle }) => {
  return (
    <div className="border-b border-slate-100 last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-4 px-1 text-left 
                 hover:bg-slate-50/70 transition-colors duration-150 group rounded"
        aria-expanded={isOpen}
        aria-controls={`faq-answer-${question.substring(0, 20)}`}
      >
        <span className="text-[14px] font-medium text-slate-700 pr-6 group-hover:text-slate-900 transition-colors">
          {question}
        </span>
        <ChevronDown
          size={16}
          className={`text-slate-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-brand-secondary' : ''}`}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <div 
              id={`faq-answer-${question.substring(0, 20)}`}
              className="pb-5 pt-1 pl-1 text-[13px] text-slate-600 leading-relaxed"
            >
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Mobile Category Dropdown
interface MobileCategoryDropdownProps {
  categories: typeof FAQ_CATEGORIES;
  activeCategory: string;
  onSelect: (id: string) => void;
}

const MobileCategoryDropdown: React.FC<MobileCategoryDropdownProps> = ({ categories, activeCategory, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const activeCat = categories.find(c => c.id === activeCategory);

  return (
    <div className="lg:hidden mb-5">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3.5 bg-white border border-slate-200 rounded-lg"
      >
        <div className="flex items-center gap-2.5">
          <span className="text-brand-secondary">{activeCat?.icon}</span>
          <span className="text-[13px] font-medium text-slate-700">{activeCat?.name || 'Chọn danh mục'}</span>
        </div>
        <ChevronDown size={16} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="mt-1.5 bg-white border border-slate-200 rounded-lg overflow-hidden"
          >
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  onSelect(cat.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-2.5 px-4 py-3 text-[13px] transition-colors ${
                  cat.id === activeCategory
                    ? 'bg-brand-secondary/5 text-brand-secondary font-medium border-l-2 border-brand-secondary'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className={cat.id === activeCategory ? 'text-brand-secondary' : 'text-slate-400'}>{cat.icon}</span>
                {cat.name}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Root FAQ Page - Shows all categories overview
const RootFAQPage = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Popular Questions */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h2 className="text-[15px] font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <TrendingUp size={16} className="text-brand-secondary" />
          Câu hỏi phổ biến
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {FAQ_CATEGORIES.slice(0, 4).map((cat) => (
            <button
              key={cat.id}
              onClick={() => navigate(`/faqs/${cat.id}`)}
              className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 hover:border-brand-secondary/30 hover:bg-brand-secondary/5 transition-all text-left group"
            >
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-brand-secondary/10 group-hover:text-brand-secondary transition-colors">
                {cat.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-medium text-slate-700 group-hover:text-brand-secondary transition-colors">{cat.name}</div>
                <div className="text-[11px] text-slate-400">{cat.faqs.length} câu hỏi</div>
              </div>
              <ChevronRight size={14} className="text-slate-300 group-hover:text-brand-secondary group-hover:translate-x-0.5 transition-all" />
            </button>
          ))}
        </div>
      </div>

      {/* All Categories */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h2 className="text-[15px] font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <Bookmark size={16} className="text-brand-secondary" />
          Tất cả danh mục
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {FAQ_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => navigate(`/faqs/${cat.id}`)}
              className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 hover:border-brand-secondary/30 hover:bg-brand-secondary/5 transition-all text-left group"
            >
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-brand-secondary/10 group-hover:text-brand-secondary transition-colors">
                {cat.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-medium text-slate-700 group-hover:text-brand-secondary transition-colors">{cat.name}</div>
                <div className="text-[11px] text-slate-400">{cat.faqs.length} câu hỏi</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// Main FAQ Detail Page Component
export default function FAQDetailPage() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Default to first category if no category selected
  const currentCategoryId = categoryId || FAQ_CATEGORIES[0].id;
  const currentCategory = FAQ_CATEGORIES.find(cat => cat.id === currentCategoryId) || FAQ_CATEGORIES[0];

  // Search all FAQs
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const query = searchQuery.toLowerCase();
    const results: { category: FAQCategory; faq: FAQItem }[] = [];
    
    FAQ_CATEGORIES.forEach(cat => {
      cat.faqs.forEach(faq => {
        if (
          faq.question.toLowerCase().includes(query) ||
          faq.answer.toLowerCase().includes(query)
        ) {
          results.push({ category: cat, faq });
        }
      });
    });
    
    return results;
  }, [searchQuery]);

  // Filter FAQs based on search or show all for category
  const filteredFAQs = useMemo(() => {
    if (!categoryId) return null;
    if (!searchQuery.trim()) {
      return currentCategory.faqs;
    }
    const query = searchQuery.toLowerCase();
    return currentCategory.faqs.filter(
      faq =>
        faq.question.toLowerCase().includes(query) ||
        faq.answer.toLowerCase().includes(query)
    );
  }, [categoryId, currentCategory, searchQuery]);

  const toggleItem = (id: string) => {
    setOpenItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  // Debounced search
  useEffect(() => {
    if (searchQuery) {
      setIsSearching(true);
      const timer = setTimeout(() => setIsSearching(false), 300);
      return () => clearTimeout(timer);
    }
  }, [searchQuery]);

  // Breadcrumb items based on category
  const breadcrumbItems = categoryId
    ? [
        { label: 'Trang chủ', href: '/' },
        { label: 'Dịch vụ khách hàng', href: '/dich-vu-khach-hang' },
        { label: 'FAQs', href: '/faqs' },
        { label: currentCategory.name },
      ]
    : [
        { label: 'Trang chủ', href: '/' },
        { label: 'Dịch vụ khách hàng', href: '/dich-vu-khach-hang' },
        { label: 'FAQs' },
      ];

  const handleCategorySelect = (id: string) => {
    setOpenItems(new Set());
    navigate(`/faqs/${id}`);
  };

  const isRootPage = !categoryId;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Compact Hero Section */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="pt-4 pb-2">
            <Breadcrumb items={breadcrumbItems} />
          </div>

          {/* Compact Title */}
          <div className={`transition-all duration-200 ${isRootPage ? 'py-5' : 'py-4'}`}>
            <h1 className="text-xl lg:text-2xl font-bold text-slate-900 tracking-tight">
              {isRootPage ? 'Trung tâm hỗ trợ Mecsu' : `FAQs - ${currentCategory.name}`}
            </h1>
            {!isRootPage && (
              <p className="text-[13px] text-slate-500 mt-1">
                {currentCategory.description}
              </p>
            )}
          </div>

          {/* Compact Search Bar */}
          <div className={`pb-4 transition-all duration-200 ${isRootPage ? 'pt-2 pb-5' : 'pt-1 pb-5'}`}>
            <div className="relative max-w-2xl">
              <Search 
                size={16} 
                className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${
                  isSearching ? 'text-brand-secondary animate-pulse' : 'text-slate-400'
                }`} 
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm trong trung tâm hỗ trợ Mecsu..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg
                         text-[13px] text-slate-700 placeholder:text-slate-400
                         focus:outline-none focus:border-brand-secondary focus:ring-2 focus:ring-brand-secondary/10
                         transition-all duration-150"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-5 lg:py-6">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* Left Sidebar - Desktop */}
            {categoryId && (
              <div className="lg:w-[260px] shrink-0">
                <div className="hidden lg:block sticky top-20">
                  {/* Categories Sidebar */}
                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-4 py-3 border-b border-slate-100">
                      <h3 className="text-[12px] font-semibold text-slate-700 uppercase tracking-wide">
                        Danh mục hỗ trợ
                      </h3>
                    </div>
                    <div className="p-2">
                      {FAQ_CATEGORIES.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => handleCategorySelect(cat.id)}
                          className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-[13px] rounded-lg transition-all duration-150 ${
                            cat.id === currentCategoryId
                              ? 'bg-brand-secondary/8 text-brand-secondary font-semibold border-l-2 border-brand-secondary ml-0.5'
                              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                          }`}
                        >
                          <span className={cat.id === currentCategoryId ? 'text-brand-secondary' : 'text-slate-400'}>
                            {cat.icon}
                          </span>
                          {cat.name}
                        </button>
                      ))}
                    </div>
                    <QuickSupportActions />
                  </div>

                  {/* Contact Card */}
                  <div className="mt-4 p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                    <h4 className="text-[12px] font-semibold text-slate-700 mb-3">Liên hệ Mecsu</h4>
                    <div className="flex flex-col gap-2">
                      <a href="#" className="flex items-center gap-2 text-[12px] text-slate-600 hover:text-brand-secondary transition-colors">
                        <MessageCircle size={13} className="text-brand-secondary" />
                        Chat với tư vấn viên
                      </a>
                      <a href="tel:18008137" className="flex items-center gap-2 text-[12px] text-slate-600 hover:text-brand-secondary transition-colors">
                        <Phone size={13} className="text-brand-secondary" />
                        1800 8137
                      </a>
                      <a href="mailto:sales@mecsu.vn" className="flex items-center gap-2 text-[12px] text-slate-600 hover:text-brand-secondary transition-colors">
                        <Mail size={13} className="text-brand-secondary" />
                        sales@mecsu.vn
                      </a>
                    </div>
                    <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-[11px] text-slate-400">
                      <Clock size={11} />
                      Thứ 2 - Thứ 7, 8:00 - 17:30
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              {/* Mobile Category Dropdown */}
              {categoryId && (
                <MobileCategoryDropdown
                  categories={FAQ_CATEGORIES}
                  activeCategory={currentCategoryId}
                  onSelect={handleCategorySelect}
                />
              )}

              {/* Search Results */}
              {searchQuery && searchResults && (
                <div className="bg-white rounded-xl border border-slate-200 p-5 mb-5">
                  <h2 className="text-[14px] font-semibold text-slate-800 mb-4">
                    Kết quả tìm kiếm: {searchResults.length} câu hỏi
                  </h2>
                  {searchResults.length > 0 ? (
                    <div className="space-y-4">
                      {searchResults.map((result, idx) => (
                        <div key={idx} className="border-b border-slate-100 last:border-b-0 pb-4 last:pb-0">
                          <div className="text-[11px] text-brand-secondary font-medium mb-2">
                            {result.category.name}
                          </div>
                          <button
                            onClick={() => {
                              navigate(`/faqs/${result.category.id}`);
                              setSearchQuery('');
                              setTimeout(() => {
                                const el = document.getElementById(`faq-answer-${result.faq.question.substring(0, 20)}`);
                                el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                              }, 100);
                            }}
                            className="text-[13px] font-medium text-slate-700 hover:text-brand-secondary transition-colors text-left w-full"
                          >
                            {result.faq.question}
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <HelpCircle size={32} className="text-slate-300 mx-auto mb-3" />
                      <p className="text-[13px] text-slate-500">Không tìm thấy câu hỏi phù hợp</p>
                    </div>
                  )}
                </div>
              )}

              {/* Root FAQ Page - All Categories */}
              {isRootPage && !searchQuery && <RootFAQPage />}

              {/* Category Detail Page */}
              {categoryId && filteredFAQs && (
                <>
                  {/* Category Header */}
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-lg bg-brand-secondary/10 flex items-center justify-center">
                      <div className="text-brand-secondary">
                        {currentCategory.icon}
                      </div>
                    </div>
                    <div>
                      <h2 className="text-[16px] font-bold text-slate-900">{currentCategory.name}</h2>
                    </div>
                  </div>

                  {/* FAQ List */}
                  <div className="bg-white rounded-xl border border-slate-200 p-5">
                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-100">
                      <h3 className="text-[13px] font-medium text-slate-500">
                        {filteredFAQs.length} câu hỏi trong mục này
                      </h3>
                    </div>
                    
                    {filteredFAQs.length > 0 ? (
                      <div>
                        {filteredFAQs.map((faq) => (
                          <FAQItemComponent
                            key={faq.id}
                            question={faq.question}
                            answer={faq.answer}
                            isOpen={openItems.has(faq.id)}
                            onToggle={() => toggleItem(faq.id)}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-10">
                        <HelpCircle size={32} className="text-slate-300 mx-auto mb-3" />
                        <p className="text-[13px] text-slate-500 mb-2">Không tìm thấy kết quả phù hợp</p>
                        <button
                          onClick={() => setSearchQuery('')}
                          className="text-[12px] text-brand-secondary hover:underline"
                        >
                          Xem tất cả câu hỏi
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Last Updated */}
                  <div className="mt-4 flex items-center gap-1.5 text-[11px] text-slate-400">
                    <Calendar size={11} />
                    <span>Cập nhật lần cuối: 18/05/2026</span>
                  </div>

                  {/* Still Have Questions - Enhanced */}
                  <div className="mt-6 p-5 bg-white rounded-xl border border-slate-200">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
                        <HelpCircle size={20} className="text-amber-500" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-[14px] font-semibold text-slate-800 mb-1">
                          Bạn vẫn chưa tìm thấy câu trả lời?
                        </h3>
                        <p className="text-[12px] text-slate-500 mb-4">
                          Đội ngũ Mecsu luôn sẵn sàng hỗ trợ bạn tìm đúng sản phẩm và xử lý đơn hàng nhanh chóng.
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <a
                            href="#"
                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-secondary text-white rounded-lg text-[12px] font-medium hover:bg-brand-secondary/90 transition-colors"
                          >
                            <MessageCircle size={13} />
                            Liên hệ hỗ trợ
                          </a>
                          <a
                            href="/tai-khoan/bao-gia"
                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-[12px] font-medium hover:border-brand-secondary hover:text-brand-secondary transition-colors"
                          >
                            <FileCheck size={13} />
                            Gửi yêu cầu báo giá
                          </a>
                          <a
                            href="/tai-khoan/don-hang"
                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-[12px] font-medium hover:border-brand-secondary hover:text-brand-secondary transition-colors"
                          >
                            <Package size={13} />
                            Theo dõi đơn hàng
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
