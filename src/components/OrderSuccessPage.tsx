import React, { useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { restorePrevBrowseLocation } from "../App";

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
  paymentMethod?: string;
}

interface OrderSuccessPageProps {
  lastOrder: LastOrder | null;
}

const PALETTE = {
  navy: "#173E75",
  softBlue: "#315E8A",
  gold: "#F6C343",
  background: "#F7F8FA",
  cardBg: "#FFFFFF",
  text: "#111827",
  muted: "#6B7280",
  border: "#E5E7EB",
};

const formatAddress = (
  address?: string,
  ward?: string,
  district?: string,
  province?: string,
) => {
  return (
    [address, ward, district, province].filter(Boolean).join(", ") ||
    "Chưa có địa chỉ giao hàng"
  );
};

const formatPrice = (price?: number) => {
  if (price === undefined || price === null) return "0đ";
  return `${price.toLocaleString("vi-VN")}đ`;
};

const buildAddress = (addr?: ShippingAddress) => {
  if (!addr) return "Chưa có địa chỉ giao hàng";
  if (addr.fullAddress) return addr.fullAddress;
  return (
    [addr.street, addr.ward, addr.district, addr.province]
      .filter(Boolean)
      .join(", ") || "Chưa có địa chỉ giao hàng"
  );
};

const formatPaymentMethodDisplay = (method?: string): string => {
  const methods: Record<string, string> = {
    bank: 'Chuyển khoản ngân hàng',
    cod: 'Thanh toán khi nhận hàng (COD)',
    quotation: 'Yêu cầu báo giá chính thức',
    netterms: 'Net terms (Mua chịu)',
  };
  return methods[method || ''] || method || 'Chưa xác định';
};

const buildReceiverText = (addr?: ShippingAddress) => {
  if (!addr?.receiverName && !addr?.phone) return "Chưa có thông tin";
  const name = addr.receiverName || "";
  const phone = addr.phone || "";
  return [name, phone].filter(Boolean).join(" - ");
};

const CONFETTI_COLORS = [
  PALETTE.navy,
  PALETTE.softBlue,
  "#A8C4E5",
  PALETTE.gold,
  "#ffffff",
];

const SuccessIcon: React.FC = () => {
  return (
    <motion.div
      className="relative flex items-center justify-center select-none no-caret"
      style={{ userSelect: "none", pointerEvents: "none" }}
      initial={{ scale: 0.4, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      }}
    >
      {/* Outer glow ring - static gradient */}
      <div
        className="absolute w-28 h-28 rounded-full"
        style={{
          background: `radial-gradient(circle, ${PALETTE.softBlue}20 0%, transparent 70%)`,
          userSelect: "none",
          pointerEvents: "none",
        }}
      />

      {/* Main circle */}
      <div
        className="relative w-20 h-20 rounded-full flex items-center justify-center"
        style={{
          background: PALETTE.navy,
          userSelect: "none",
          pointerEvents: "none",
          boxShadow: `0 0 24px ${PALETTE.softBlue}20`,
        }}
      >
        {/* Check icon - static after entrance */}
        <motion.svg
          width="36"
          height="36"
          viewBox="0 0 36 36"
          fill="none"
          style={{ userSelect: "none", pointerEvents: "none" }}
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
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
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
            transition={{ duration: 0.6, delay: 0.9, ease: "easeOut" }}
          />
        </motion.svg>
      </div>
    </motion.div>
  );
};

const OrderSuccessPage: React.FC<OrderSuccessPageProps> = ({ lastOrder }) => {
  const navigate = useNavigate();
  const confettiTriggered = useRef(false);

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

  if (!lastOrder) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div
            className="w-10 h-10 border-2 rounded-full mx-auto mb-3"
            style={{ borderColor: PALETTE.navy, borderTopColor: "transparent" }}
          />
          <p className="text-sm" style={{ color: PALETTE.muted }}>
            Đang chuyển hướng...
          </p>
        </div>
      </div>
    );
  }

  const subtotal = lastOrder.total / 1.1;
  const vat = lastOrder.total - subtotal;

  return (
    <div
      className="flex-1 flex flex-col items-center"
      style={{ background: PALETTE.background }}
    >
      <motion.div
        className="w-full max-w-3xl mx-auto px-4 py-4 space-y-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        {/* Hero Section */}
        <div className="flex flex-col items-center text-center">
          <SuccessIcon />

          <motion.h1
            className="text-2xl sm:text-3xl font-bold mb-2 mt-4"
            style={{ color: PALETTE.text }}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            Đơn hàng đã được xác nhận
          </motion.h1>

          <motion.p
            className="text-sm mb-4 max-w-md leading-relaxed"
            style={{ color: PALETTE.muted }}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            Cảm ơn bạn đã đặt hàng. Chúng tôi đã tiếp nhận đơn hàng và sẽ xử lý
            trong thời gian sớm nhất.
          </motion.p>

          {/* Order Code Pill */}
          <motion.button
            type="button"
            onClick={() => navigate(`/tai-khoan/don-hang/${lastOrder.orderId}`)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full transition-opacity hover:opacity-90 hover:cursor-pointer"
            style={{ background: PALETTE.navy }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.3 }}
          >
            <span className="text-xs font-semibold uppercase tracking-wider text-white/70">
              Mã đơn hàng
            </span>
            <span className="text-sm font-bold text-white underline decoration-white/70 underline-offset-2">
              {lastOrder.orderId}
            </span>
          </motion.button>
        </div>

        {/* Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
          {/* Card A: Delivery Info */}
          <motion.div
            className="rounded-[20px] border p-4"
            style={{ background: PALETTE.cardBg, borderColor: PALETTE.border }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
          >
            <h3
              className="text-sm font-semibold mb-2"
              style={{ color: PALETTE.navy }}
            >
              Thông tin giao hàng
            </h3>
            <div className="space-y-2 text-sm">
              <div>
                <span
                  className="block text-xs mb-0.5"
                  style={{ color: PALETTE.muted }}
                >
                  Người nhận
                </span>
                <span className="font-medium" style={{ color: PALETTE.text }}>
                  {buildReceiverText(lastOrder?.shippingAddress)}
                </span>
              </div>
              <div>
                <span
                  className="block text-xs mb-0.5"
                  style={{ color: PALETTE.muted }}
                >
                  Số điện thoại
                </span>
                <span className="font-medium" style={{ color: PALETTE.text }}>
                  {lastOrder?.shippingAddress?.phone || "—"}
                </span>
              </div>
              <div>
                <span
                  className="block text-xs mb-0.5"
                  style={{ color: PALETTE.muted }}
                >
                  Địa chỉ giao hàng
                </span>
                <span
                  className="font-medium leading-snug"
                  style={{ color: PALETTE.text }}
                >
                  {buildAddress(lastOrder?.shippingAddress)}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Card B: Payment Info */}
          <motion.div
            className="rounded-[20px] border p-4"
            style={{ background: PALETTE.cardBg, borderColor: PALETTE.border }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.4 }}
          >
            <h3
              className="text-sm font-semibold mb-2"
              style={{ color: PALETTE.navy }}
            >
              Thanh toán
            </h3>
            <div className="space-y-2 text-sm">
              <div>
                <span
                  className="block text-xs mb-0.5"
                  style={{ color: PALETTE.muted }}
                >
                  Phương thức thanh toán
                </span>
                <span className="font-medium" style={{ color: PALETTE.text }}>
                  {formatPaymentMethodDisplay(lastOrder?.paymentMethod)}
                </span>
              </div>
              <div>
                <span
                  className="block text-xs mb-0.5"
                  style={{ color: PALETTE.muted }}
                >
                  Trạng thái thanh toán
                </span>
                <span className="inline-flex items-center gap-1.5 font-medium text-green-600">
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                  Đã thanh toán
                </span>
              </div>
              <div>
                <span
                  className="block text-xs mb-0.5"
                  style={{ color: PALETTE.muted }}
                >
                  Ngày đặt hàng
                </span>
                <span className="font-medium" style={{ color: PALETTE.text }}>
                  {new Date().toLocaleDateString("vi-VN")}
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Payment Summary */}
        <motion.div
          className="rounded-[20px] border p-4"
          style={{ background: PALETTE.cardBg, borderColor: PALETTE.border }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.4 }}
        >
          <h3
            className="text-sm font-semibold mb-2"
            style={{ color: PALETTE.navy }}
          >
            Tổng thanh toán
          </h3>
          <div
            className="text-3xl font-bold mb-2"
            style={{ color: PALETTE.navy }}
          >
            {formatPrice(lastOrder.total)}
          </div>
          <div
            className="pt-2 space-y-1.5 text-sm"
            style={{ borderTop: `1px solid ${PALETTE.border}` }}
          >
            <div className="flex justify-between">
              <span style={{ color: PALETTE.muted }}>Tạm tính</span>
              <span className="font-medium" style={{ color: PALETTE.text }}>
                {formatPrice(Math.round(subtotal))}
              </span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: PALETTE.muted }}>VAT (10%)</span>
              <span className="font-medium" style={{ color: PALETTE.text }}>
                {formatPrice(Math.round(vat))}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className="flex flex-col-reverse sm:flex-row gap-3 w-full"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.4 }}
        >
          <button
            onClick={() => navigate("/tai-khoan/don-hang")}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-white transition-all hover:brightness-110"
            style={{ background: PALETTE.navy }}
          >
            Theo dõi đơn hàng
            <ArrowRight size={18} />
          </button>

          <div className="flex sm:justify-end">
            <button
              onClick={() => restorePrevBrowseLocation((url) => navigate(url), '/')}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all border hover:bg-slate-50"
              style={{ borderColor: PALETTE.navy, color: PALETTE.navy }}
            >
              <ShoppingBag size={18} />
              Tiếp tục mua sắm
            </button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default OrderSuccessPage;
