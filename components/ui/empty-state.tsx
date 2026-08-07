'use client';

import * as React from 'react';
import { cn } from '@/lib/utils/cn';
import { motion } from 'framer-motion';
import { useSafeMotion } from '@/lib/motion';

import { HTMLMotionProps } from 'framer-motion';

export interface EmptyStateProps extends HTMLMotionProps<"div"> {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  image?: React.ReactNode;
}

function EmptyState({ title, description, icon, action, image, className, ...props }: EmptyStateProps) {
  const { emptyStateVariants, prefersReducedMotion } = useSafeMotion();

  return (
    <motion.div 
      variants={emptyStateVariants}
      initial={prefersReducedMotion ? undefined : "initial"}
      animate="animate"
      exit={prefersReducedMotion ? undefined : "exit"}
      className={cn('flex flex-col items-center justify-center rounded-[24px] border border-dashed border-border bg-surface px-6 py-12 text-center', className)} 
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      {...props}
    >
      {image ? (
        <div className="mb-6 h-32 w-32 relative overflow-hidden flex items-center justify-center">
          {image}
        </div>
      ) : icon ? (
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-surface text-primary">
          {icon}
        </div>
      ) : null}
      <h3 className="text-[20px] font-bold text-foreground tracking-tight">{title}</h3>
      {description ? <p className="mt-2 mb-6 max-w-[280px] text-[14px] text-muted leading-relaxed">{description}</p> : <div className="mb-6" />}
      {action && <div>{action}</div>}
    </motion.div>
  );
}

export { EmptyState };

