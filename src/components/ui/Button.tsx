import React from 'react';
import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';
import Magnetic from './Magnetic';
import { cn } from '../../lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success' | 'black';
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'icon';
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  isMagnetic?: boolean;
  magneticStrength?: number;
  className?: string;
  children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  isMagnetic = false,
  magneticStrength = 0.5,
  className,
  children,
  ...props
}, ref) => {
  const variants = {
    primary: 'bg-[#173B63] text-white hover:bg-[#122d4d] shadow-sm hover:shadow-md',
    secondary: 'bg-[#E8B931] text-[#111827] hover:bg-[#d4a71c] shadow-sm hover:shadow-md',
    outline: 'bg-white border border-[#D1D5DB] text-[#111827] hover:border-[#173B63] hover:bg-[#F7F8FA]',
    ghost: 'bg-transparent text-[#6B7280] hover:bg-[#F7F8FA] hover:text-[#111827]',
    danger: 'bg-[#DC2626] text-white hover:bg-[#B91C1C]',
    success: 'bg-[#16A34A] text-white hover:bg-[#15803D]',
    black: 'bg-[#111827] text-white hover:bg-[#1F2937]',
  };

  const sizes = {
    sm: 'px-4 py-2 text-[10px] h-8',
    md: 'px-6 py-3 text-[10px] h-10',
    lg: 'px-8 py-4 text-[11px] h-12',
    xl: 'px-10 py-5 text-[12px] h-14',
    icon: 'p-2 w-10 h-10',
  };

  const baseStyles = 'inline-flex items-center justify-center font-black uppercase tracking-[0.2em] rounded-2xl transition-colors duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none gap-3';
  
  const buttonContent = (
    <button
      ref={ref}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {Icon && iconPosition === 'left' && <Icon size={size === 'sm' ? 14 : 18} />}
      {children}
      {Icon && iconPosition === 'right' && <Icon size={size === 'sm' ? 14 : 18} />}
    </button>
  );

  if (isMagnetic) {
    return (
      <Magnetic strength={magneticStrength} className={cn('inline-block', className)}>
        {buttonContent}
      </Magnetic>
    );
  }

  return buttonContent;
});

Button.displayName = 'Button';

export default Button;
