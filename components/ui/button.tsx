'use client';

import { Slot } from '@radix-ui/react-slot';
import { motion, HTMLMotionProps } from 'framer-motion';
import { useSafeMotion } from '@/lib/motion';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils/cn';

import { Loader2 } from 'lucide-react';

const buttonVariants_ = cva(
  'inline-flex items-center justify-center gap-2 font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-white hover:bg-[#e0244d]',
        secondary: 'bg-secondary text-background hover:bg-[#f0be00]',
        outline: 'border border-border bg-transparent hover:bg-surface',
        ghost: 'bg-transparent hover:bg-surface',
      },
      size: {
        default: 'h-[48px] px-6 py-2 rounded-[14px] text-[15px]',
        sm: 'h-[40px] px-4 py-1.5 rounded-[12px] text-[13px]',
        lg: 'h-[56px] px-8 py-3 rounded-[16px] text-[16px]',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends Omit<HTMLMotionProps<"button">, "ref">,
    VariantProps<typeof buttonVariants_> {
  asChild?: boolean;
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, isLoading = false, children, disabled, ...props }, ref) => {
    const { buttonPressVariants } = useSafeMotion();
    
    if (asChild) {
      return (
        <Slot
          className={cn(buttonVariants_({ variant, size, className }))}
          ref={ref}
          {...(props as unknown as React.HTMLAttributes<HTMLElement>)}
        >
          {children as React.ReactNode}
        </Slot>
      );
    }

    return (
      <motion.button 
        className={cn(buttonVariants_({ variant, size, className }), "relative overflow-hidden")} 
        ref={ref} 
        disabled={disabled || isLoading}
        variants={buttonPressVariants}
        whileHover="hover"
        whileTap="tap"
        {...props}
      >
        <span className={cn("inline-flex items-center justify-center gap-2 transition-opacity duration-200", isLoading ? "opacity-0" : "opacity-100")}>
          {children as React.ReactNode}
        </span>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
        )}
      </motion.button>
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants_ as buttonVariants };

