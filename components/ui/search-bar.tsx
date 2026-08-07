'use client';

import * as React from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils/cn';
import { motion, AnimatePresence } from 'framer-motion';
import { useSafeMotion } from '@/lib/motion';

export interface SearchBarProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onClear?: () => void;
}

const SearchBar = React.forwardRef<HTMLInputElement, SearchBarProps>(({ className, value, onChange, onClear, ...props }, ref) => {
  const { prefersReducedMotion } = useSafeMotion();
  const [isFocused, setIsFocused] = React.useState(false);
  const hasValue = value !== undefined ? String(value).length > 0 : false;

  return (
    <div className={cn('relative flex items-center', className)}>
      <motion.div
        animate={{ scale: isFocused ? 1.1 : 1, color: isFocused ? '#F4F5F7' : '#9498A6' }}
        transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.2 }}
        className="pointer-events-none absolute left-4 h-4 w-4"
      >
        <Search className="h-4 w-4" />
      </motion.div>
      <Input 
        ref={ref} 
        className={cn("pl-11", onClear && "pr-11")} 
        value={value}
        onChange={onChange}
        onFocus={(e) => {
          setIsFocused(true);
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          props.onBlur?.(e);
        }}
        {...props} 
      />
      
      <AnimatePresence>
        {hasValue && onClear && (
          <motion.button
            initial={prefersReducedMotion ? undefined : { opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={prefersReducedMotion ? undefined : { opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15 }}
            type="button"
            onClick={onClear}
            className="absolute right-3 flex h-6 w-6 items-center justify-center rounded-full bg-[#2A2D36] text-foreground hover:bg-[#3f4351] active:scale-95 transition-colors"
            aria-label="Clear search"
          >
            <X className="h-3.5 w-3.5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
});
SearchBar.displayName = 'SearchBar';

export { SearchBar };

