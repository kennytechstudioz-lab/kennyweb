'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { 
  HiCheckCircle, 
  HiExclamationCircle, 
  HiInformationCircle, 
  HiX,
  HiExclamation
} from 'react-icons/hi';

type ToastType = 'success' | 'warning' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ConfirmOptions {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'primary';
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
  showConfirm: (options: ConfirmOptions) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [confirmOptions, setConfirmOptions] = useState<ConfirmOptions | null>(null);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showConfirm = useCallback((options: ConfirmOptions) => {
    setConfirmOptions(options);
  }, []);

  const handleConfirm = () => {
    if (confirmOptions?.onConfirm) {
      confirmOptions.onConfirm();
    }
    setConfirmOptions(null);
  };

  const handleCancel = () => {
    if (confirmOptions?.onCancel) {
      confirmOptions.onCancel();
    }
    setConfirmOptions(null);
  };

  const getToastStyles = (type: ToastType) => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-emerald-50/95 border-emerald-200/50',
          text: 'text-emerald-800',
          icon: <HiCheckCircle className="text-emerald-500 text-xl flex-shrink-0" />,
        };
      case 'warning':
        return {
          bg: 'bg-amber-50/95 border-amber-200/50',
          text: 'text-amber-800',
          icon: <HiExclamationCircle className="text-amber-500 text-xl flex-shrink-0" />,
        };
      case 'error':
        return {
          bg: 'bg-rose-50/95 border-rose-200/50',
          text: 'text-rose-800',
          icon: <HiExclamationCircle className="text-rose-500 text-xl flex-shrink-0" />,
        };
      case 'info':
      default:
        return {
          bg: 'bg-blue-50/95 border-blue-200/50',
          text: 'text-blue-800',
          icon: <HiInformationCircle className="text-blue-500 text-xl flex-shrink-0" />,
        };
    }
  };

  return (
    <ToastContext.Provider value={{ showToast, showConfirm }}>
      {children}
      
      {/* Toast Portal Container */}
      <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => {
          const styles = getToastStyles(toast.type);
          return (
            <div
              key={toast.id}
              className={`
                flex items-center gap-3 p-4 rounded-2xl border backdrop-blur-md shadow-lg pointer-events-auto
                animate-in slide-in-from-right-10 fade-in duration-300
                ${styles.bg} ${styles.text}
              `}
            >
              {styles.icon}
              <p className="text-sm font-semibold flex-1 leading-snug">{toast.message}</p>
              <button
                onClick={() => removeToast(toast.id)}
                className="p-1 hover:bg-black/5 rounded-lg transition-colors text-slate-400 hover:text-slate-600 cursor-pointer flex-shrink-0"
                aria-label="Dismiss toast"
              >
                <HiX className="text-base" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Global Confirmation Warning Modal */}
      {confirmOptions && (
        <div className="fixed inset-0 z-[9998] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-md w-full p-8 border border-slate-100 space-y-6 animate-in zoom-in-95 duration-200">
            {/* Warning Header */}
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                confirmOptions.variant === 'danger'
                  ? 'bg-rose-50 text-rose-500 border border-rose-100'
                  : confirmOptions.variant === 'primary'
                  ? 'bg-blue-50 text-blue-500 border border-blue-100'
                  : 'bg-amber-50 text-amber-500 border border-amber-100'
              }`}>
                <HiExclamation className="text-2xl" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-black text-slate-900 leading-snug">{confirmOptions.title}</h3>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">{confirmOptions.message}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={handleConfirm}
                className={`flex-1 py-3.5 rounded-2xl font-bold transition-all hover:shadow-lg cursor-pointer text-sm ${
                  confirmOptions.variant === 'danger'
                    ? 'bg-red-500 text-white hover:bg-red-600 shadow-red-500/10'
                    : confirmOptions.variant === 'primary'
                    ? 'bg-primary text-white hover:bg-primary-dark shadow-primary/10'
                    : 'bg-amber-500 text-white hover:bg-amber-600 shadow-amber-500/10'
                }`}
              >
                {confirmOptions.confirmText || 'Confirm'}
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 bg-slate-100 text-slate-600 hover:bg-slate-200 py-3.5 rounded-2xl font-bold transition-all cursor-pointer text-sm"
              >
                {confirmOptions.cancelText || 'Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
}
