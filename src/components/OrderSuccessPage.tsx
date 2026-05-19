import React, { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from './ui/Button';
import { Badge } from './ui/Badge';
import { Home, ShoppingBag } from 'lucide-react';

interface ShippingAddress {
  receiverName?: string;
  phone?: string;
  street?: string;
  ward?: string;
  district?: string;
  province?: string;
  fullAddress?: string;
}

interface LastOrder {
  orderId: string;
  shippingAddress?: ShippingAddress;
  total: number;
}

interface OrderSuccessPageProps {
  lastOrder: LastOrder | null;
}

const PALETTE = {
  navy: '#173B63',
  softBlue: '#315E8A',
  gold: '#E8B931',
  background: '#F7F8FA',
  text: '#111827',
  muted: '#6B7280',
  border: '#E2E8F0',
};

// Helper functions
const formatAddress = (address?: string, ward?: string, district?: string, province?: string) => {
  return [address, ward, district, province].filter(Boolean).join(', ') || 'Chưa có địa chỉ giao hàng';
};

const formatPrice = (price?: number) => {
  if (price === undefined || price === null) return '0đ';
  return `${price.toLocaleString('vi-VN')}đ`;
};

// Build address text from ShippingAddress object
const buildAddress = (addr?: ShippingAddress) => {
  if (!addr) return 'Chưa có địa chỉ giao hàng';
  if (addr.fullAddress) return addr.fullAddress;
  return [addr.street, addr.ward, addr.district, addr.province].filter(Boolean).join(', ') || 'Chưa có địa chỉ giao hàng';
};

// Build receiver text with name and phone
const buildReceiverText = (addr?: ShippingAddress) => {
  if (!addr?.receiverName && !addr?.phone) return 'Chưa có thông tin';
  const name = addr.receiverName || '';
  const phone = addr.phone || '';
  return [name, phone].filter(Boolean).join(' - ');
};

const CONFETTI_COLORS = [PALETTE.navy, PALETTE.softBlue, '#A8C4E5', PALETTE.gold, '#ffffff'];

const SuccessIcon: React.FC = () => {
  return (
    <motion.div
      className="relative flex items-center justify-center select-none no-caret"
      style={{ userSelect: 'none', pointerEvents: 'none' }}
      initial={{ scale: 0.4, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
    >
      {/* Outer glow ring - static gradient */}
      <div
        className="absolute w-28 h-28 rounded-full"
        style={{
          background: `radial-gradient(circle, ${PALETTE.softBlue}20 0%, transparent 70%)`,
          userSelect: 'none',
          pointerEvents: 'none',
        }}
      />

      {/* Main circle */}
      <div
        className="relative w-20 h-20 rounded-full flex items-center justify-center"
        style={{ 
          background: PALETTE.navy, 
          userSelect: 'none', 
          pointerEvents: 'none',
          boxShadow: `0 0 24px ${PALETTE.softBlue}20`,
        }}
      >
        {/* Check icon - static after entrance */}
        <motion.svg
          width="36"
          height="36"
          viewBox="0 0 36 36"
          fill="none"
          style={{ userSelect: 'none', pointerEvents: 'none' }}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.path
            d="M18 3.5C10.1 3.5 3.5 10.1 3.5 18C3.5 25.9 10.1 32.5 18 32.5C25.9 32.5 32.5 25.9 32.5 18C32.5 10.1 25.9 3.5 18 3.5Z"
            stroke={PALETTE.gold}
            strokeWidth="1.5"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
          />
          <motion.path
            d="M11 18L16 23L25 14"
            stroke={PALETTE.gold}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.6, delay: 0.9, ease: 'easeOut' }}
          />
        </motion.svg>
      </div>
    </motion.div>
  );
};

const OrderSuccessPage: React.FC<OrderSuccessPageProps> = ({ lastOrder }) => {
  const navigate = useNavigate();
  const confettiTriggered = useRef(false);

  // Debug log
  console.log("Order success data:", lastOrder);

  useEffect(() => {
    if (confettiTriggered.current || !lastOrder) return;
    confettiTriggered.current = true;

    const shootConfetti = () => {
      const duration = 2500;
      const end = Date.now() + duration;
      const frameRate = 14;
      let lastTime = Date.now();

      const frame = () => {
        const now = Date.now();
        if (now - lastTime >= frameRate) {
          lastTime = now;
          confetti({
            particleCount: 2,
            angle: 60,
            spread: 60,
            origin: { x: 0, y: 0.65 },
            colors: CONFETTI_COLORS,
            gravity: 1.2,
            scalar: 1.0,
            drift: 0.2,
            ticks: 180,
          });
          confetti({
            particleCount: 2,
            angle: 120,
            spread: 60,
            origin: { x: 1, y: 0.65 },
            colors: CONFETTI_COLORS,
            gravity: 1.2,
            scalar: 1.0,
            drift: -0.2,
            ticks: 180,
          });
        }
        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };

      frame();
    };

    const timer = setTimeout(shootConfetti, 500);
    return () => clearTimeout(timer);
  }, [lastOrder]);

  const easeOut = [0.16, 1, 0.3, 1] as [number, number, number, number];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: easeOut },
    },
  };

  if (!lastOrder) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div
            className="w-10 h-10 border-2 rounded-full mx-auto mb-3"
            style={{ borderColor: PALETTE.navy, borderTopColor: 'transparent' }}
          />
          <p className="text-sm" style={{ color: PALETTE.muted }}>Đang chuyển hướng...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-12 sm:py-24"
      style={{ background: PALETTE.background }}
    >
      <motion.div
        className="flex flex-col items-center text-center w-full max-w-md"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Success Icon */}
        <motion.div 
          className="mb-8 outline-none no-caret" 
          variants={itemVariants}
          tabIndex={-1}
          onMouseDown={(e) => e.preventDefault()}
        >
          <SuccessIcon />
        </motion.div>

        {/* Title */}
        <motion.h1
          className="text-2xl sm:text-3xl font-bold mb-3"
          style={{ color: PALETTE.text }}
          variants={itemVariants}
        >
          Đơn hàng đã được xác nhận
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-sm mb-10 max-w-sm leading-relaxed"
          style={{ color: PALETTE.muted }}
          variants={itemVariants}
        >
          Cảm ơn bạn đã đặt hàng. Đơn hàng sẽ được xử lý và thông báo qua email trong thời gian sớm nhất.
        </motion.p>

        {/* Order Info Card */}
        <motion.div
          className="bg-white rounded-2xl w-full mb-10"
          style={{
            border: `1px solid ${PALETTE.border}`,
            boxShadow: `0 1px 3px ${PALETTE.navy}08, 0 4px 16px ${PALETTE.navy}06`,
          }}
          variants={itemVariants}
        >
          <div className="p-6 space-y-4">
            {/* Order ID */}
            <div className="flex justify-between items-center">
              <span
                className="text-[10px] font-semibold uppercase tracking-widest"
                style={{ color: PALETTE.muted }}
              >
                Mã đơn hàng
              </span>
              <Badge variant="primary">{lastOrder?.orderId ?? '—'}</Badge>
            </div>

            {/* Recipient */}
            <div className="flex justify-between items-center">
              <span
                className="text-[10px] font-semibold uppercase tracking-widest"
                style={{ color: PALETTE.muted }}
              >
                Người nhận
              </span>
              <span className="text-sm font-semibold" style={{ color: PALETTE.text }}>
                {buildReceiverText(lastOrder?.shippingAddress)}
              </span>
            </div>

            {/* Address */}
            <div className="flex justify-between items-start gap-4">
              <span
                className="text-[10px] font-semibold uppercase tracking-widest flex-shrink-0 pt-0.5"
                style={{ color: PALETTE.muted }}
              >
                Địa chỉ
              </span>
              <span className="text-sm font-medium text-right leading-snug" style={{ color: PALETTE.text }}>
                {buildAddress(lastOrder?.shippingAddress)}
              </span>
            </div>

            {/* Divider */}
            <div className="border-t" style={{ borderColor: PALETTE.border }} />

            {/* Total */}
            <div
              className="rounded-xl p-4 flex justify-between items-center"
              style={{ background: `${PALETTE.navy}06` }}
            >
              <span
                className="text-[10px] font-semibold uppercase tracking-widest"
                style={{ color: PALETTE.muted }}
              >
                Tổng thanh toán
              </span>
              <span className="text-lg font-bold" style={{ color: PALETTE.navy }}>
                {formatPrice(lastOrder?.total)}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-3 w-full"
          variants={itemVariants}
        >
          <Button
            variant="black"
            size="xl"
            icon={Home}
            iconPosition="left"
            onClick={() => navigate('/')}
            className="w-full sm:w-auto sm:min-w-[180px] justify-center normal-case tracking-normal"
          >
            Về trang chủ
          </Button>

          <Button
            variant="outline"
            size="xl"
            icon={ShoppingBag}
            iconPosition="left"
            onClick={() => navigate('/danh-muc-san-pham')}
            className="w-full sm:w-auto sm:min-w-[180px] justify-center normal-case tracking-normal"
          >
            Tiếp tục mua sắm
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default OrderSuccessPage;
