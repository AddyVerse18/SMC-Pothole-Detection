import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, AlertCircle, CheckCircle } from 'lucide-react';
import { ToastMessage } from '../../hooks/useToasts';

interface ToastSystemProps {
  toasts: readonly ToastMessage[];
}

export const ToastSystem: React.FC<ToastSystemProps> = ({ toasts }) => {
  return (
    <div className="fixed bottom-20 md:bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.95 }}
            className="flex items-center gap-3 bg-white/90 backdrop-blur-md border border-slate-200 px-4 py-3 rounded-xl shadow-lg pointer-events-auto min-w-[280px]"
          >
            <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Info className="w-4 h-4" />
            </div>
            <p className="text-sm font-medium text-navy-900">{toast.msg}</p>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
