'use client';

import * as React from 'react';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { useSafeMotion } from '@/lib/motion';

export type ToastVariant = 'default' | 'success' | 'warning' | 'error';

export interface ToastData {
  id: string;
  message: React.ReactNode;
  variant?: ToastVariant;
  duration?: number;
}

import { HTMLMotionProps } from 'framer-motion';

export interface ToastProps extends HTMLMotionProps<"div"> {
  variant?: ToastVariant;
  onDismiss?: () => void;
  duration?: number;
}

const toastIcons = {
  default: <Info className="h-5 w-5" />,
  success: <CheckCircle2 className="h-5 w-5" />,
  warning: <AlertCircle className="h-5 w-5" />,
  error: <AlertCircle className="h-5 w-5" />,
};

function Toast({ variant = 'default', className, children, onDismiss, duration = 3000, ...props }: ToastProps) {
  const { toastVariants, prefersReducedMotion } = useSafeMotion();

  React.useEffect(() => {
    if (duration > 0 && onDismiss) {
      const timer = setTimeout(() => {
        onDismiss();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onDismiss]);

  return (
    <motion.div
      variants={toastVariants}
      initial={prefersReducedMotion ? undefined : "initial"}
      animate="animate"
      exit={prefersReducedMotion ? undefined : "exit"}
      drag="y"
      dragConstraints={{ top: 0, bottom: 0 }}
      onDragEnd={(_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        if (info.offset.y > 20 && onDismiss) {
          onDismiss();
        }
      }}
      className={cn('pointer-events-auto flex items-center gap-3 rounded-[16px] border border-border bg-surface px-4 py-3 shadow-[0_8px_24px_rgba(0,0,0,0.24)]', className)}
      {...props}
    >
      <div className={variant === 'success' ? 'text-secondary' : 'text-primary'}>{toastIcons[variant]}</div>
      <div className="text-[14px] text-foreground">{children as React.ReactNode}</div>
    </motion.div>
  );
}

// Global Toast State
let toastIdCounter = 0;
type ToastListener = (toasts: ToastData[]) => void;
let toasts: ToastData[] = [];
const listeners = new Set<ToastListener>();

function notifyListeners() {
  listeners.forEach(listener => listener([...toasts]));
}

export function toast(message: React.ReactNode, options?: { variant?: ToastVariant; duration?: number }) {
  const id = (++toastIdCounter).toString();
  toasts = [...toasts, { id, message, ...options }];
  notifyListeners();
}

export function useToast() {
  return { toast };
}

export function Toaster() {
  const [currentToasts, setCurrentToasts] = React.useState<ToastData[]>([]);

  React.useEffect(() => {
    setCurrentToasts([...toasts]);
    const listener: ToastListener = (newToasts) => {
      setCurrentToasts(newToasts);
    };
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  const handleDismiss = (id: string) => {
    toasts = toasts.filter(t => t.id !== id);
    notifyListeners();
  };

  return (
    <div className="fixed bottom-20 left-0 right-0 z-50 flex flex-col items-center gap-2 pointer-events-none px-4">
      <AnimatePresence mode="popLayout">
        {currentToasts.map(t => (
          <Toast key={t.id} variant={t.variant} duration={t.duration} onDismiss={() => handleDismiss(t.id)}>
            {t.message}
          </Toast>
        ))}
      </AnimatePresence>
    </div>
  );
}

export { Toast };

