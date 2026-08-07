import * as React from 'react';
import { cn } from '@/lib/utils/cn';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'secondary' | 'success' | 'warning' | 'error';
}

const badgeVariants = {
  default: 'bg-primary text-white',
  secondary: 'bg-secondary text-[#0D0E12]',
  success: 'bg-success text-[#0D0E12]',
  warning: 'bg-[#FF9100] text-[#0D0E12]',
  error: 'bg-[#FF5252] text-white',
};

function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return <span className={cn('inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider', badgeVariants[variant], className)} {...props} />;
}

export { Badge };

