import { useEffect } from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ToastProps {
  message: string;
  type?: 'success' | 'error';
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={cn(
        'fixed top-6 right-6 z-[10000] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-lg border bg-white animate-slide-in',
        type === 'success' ? 'border-[#16A34A] text-[#173E75]' : 'border-[#DC2626] text-[#DC2626]'
      )}
    >
      {type === 'success' ? (
        <CheckCircle size={20} className="text-[#16A34A]" />
      ) : (
        <AlertCircle size={20} className="text-[#DC2626]" />
      )}
      <span className="text-sm font-medium">{message}</span>
      <button
        onClick={onClose}
        className="ml-2 hover:opacity-70 transition-opacity"
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default Toast;
