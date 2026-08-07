import * as React from 'react';
import { cn } from '@/lib/utils/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, error, ...props }, ref) => {
  return (
    <input
      type={type}
      ref={ref}
      className={cn(
        'flex h-[52px] w-full rounded-[12px] border border-border bg-surface px-4 text-[15px] text-foreground outline-none transition-all duration-200 placeholder:text-muted/50 focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50',
        error 
          ? 'border-[#FF5252] focus:border-[#FF5252] focus:ring-[#FF5252]/30' 
          : 'focus:border-primary focus:ring-[#FF2A55]/30',
        className,
      )}
      {...props}
    />
  );
});
Input.displayName = 'Input';

export { Input };

