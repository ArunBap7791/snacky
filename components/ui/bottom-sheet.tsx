'use client';

import * as React from 'react';
import { cn } from '@/lib/utils/cn';
import { motion, AnimatePresence, HTMLMotionProps } from 'framer-motion';
import { useSafeMotion } from '@/lib/motion';

export interface BottomSheetProps extends Omit<HTMLMotionProps<"div">, "children"> {
  open?: boolean;
  onClose?: () => void;
  children?: React.ReactNode;
}

function BottomSheet({ open = false, onClose, className, children, ...props }: BottomSheetProps) {
  const { bottomSheetVariants, bottomSheetOverlayVariants } = useSafeMotion();

  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div 
          variants={bottomSheetOverlayVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0"
        >
          <motion.div 
            variants={bottomSheetVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.2}
            onDragEnd={(e, { offset, velocity }) => {
              if (offset.y > 100 || velocity.y > 500) {
                onClose?.();
              }
            }}
            onClick={(e) => e.stopPropagation()}
            className={cn('w-full rounded-t-[24px] border border-border bg-surface p-5 shadow-[0_-8px_24px_rgba(0,0,0,0.4)]', className)} 
            {...props}
          >
            <div className="mx-auto mb-4 h-1.5 w-16 rounded-full bg-[#2A2D36] cursor-grab active:cursor-grabbing" />
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export { BottomSheet };

