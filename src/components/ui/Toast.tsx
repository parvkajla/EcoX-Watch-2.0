import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useAppStore, type Toast } from '../../store/appStore';
import { cn } from '../../utils';

const icons: Record<Toast['type'], React.ReactNode> = {
  success: <CheckCircle size={15} className="text-green-600 flex-shrink-0" />,
  error: <XCircle size={15} className="text-red-600 flex-shrink-0" />,
  warning: <AlertTriangle size={15} className="text-amber-600 flex-shrink-0" />,
  info: <Info size={15} className="text-blue-600 flex-shrink-0" />,
};

const colors: Record<Toast['type'], string> = {
  success: 'border-green-200 bg-green-50',
  error: 'border-red-200 bg-red-50',
  warning: 'border-amber-200 bg-amber-50',
  info: 'border-blue-200 bg-blue-50',
};

export function ToastContainer() {
  const { toasts, removeToast } = useAppStore();
  return (
    <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 40, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 40, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-auto"
          >
            <div
              className={cn(
                'flex items-start gap-3 p-3.5 pr-4 rounded-xl border shadow-[0_4px_16px_0_rgba(0,0,0,0.08)] max-w-sm w-full',
                colors[toast.type]
              )}
            >
              {icons[toast.type]}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#20211F]">{toast.title}</p>
                {toast.message && <p className="text-xs text-[#777A73] mt-0.5">{toast.message}</p>}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-[#A8ABA3] hover:text-[#20211F] transition-colors ml-1"
              >
                <X size={13} />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
