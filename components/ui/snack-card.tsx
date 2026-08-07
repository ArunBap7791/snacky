'use client';

import * as React from 'react';
import { Leaf, Beef, Plus, Minus } from 'lucide-react';
import { Card, CardContent, CardProps } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ProgressiveImage } from '@/components/ui/progressive-image';
import { motion, AnimatePresence } from 'framer-motion';
import { useSafeMotion } from '@/lib/motion';

export interface SnackCardProps extends CardProps {
  name: string;
  category?: string;
  description?: string;
  price?: number;
  isVeg?: boolean;
  availability?: 'in_stock' | 'out_of_stock';
  allergens?: string[];
  imageUrl?: string;
  quantity?: number;
  onAdd?: () => void;
  onRemove?: () => void;
}

function SnackCard({ name, description, price = 0, isVeg = true, imageUrl, quantity = 0, onAdd, onRemove, className, ...props }: SnackCardProps) {
  const { counterVariants, prefersReducedMotion } = useSafeMotion();

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Card className={`overflow-hidden border border-border bg-surface rounded-[16px] transition-all duration-300 p-0 flex flex-col h-[210px] w-full ${className}`} {...props}>
      {/* Product Image - Landscape Height (48%) */}
      <div className="relative w-full h-[100px] bg-[#2A2D36] shrink-0 rounded-t-[16px] overflow-hidden">
        {imageUrl ? (
          <ProgressiveImage src={imageUrl} alt={name} className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[12px] text-muted">No Image</div>
        )}
        <div className="absolute top-2 right-2 rounded-full bg-surface/80 p-1 backdrop-blur-sm shadow-sm border border-border">
          {isVeg ? (
            <Leaf className="h-3 w-3 text-success" aria-label="Vegetarian" />
          ) : (
            <Beef className="h-3 w-3 text-primary" aria-label="Non-Vegetarian" />
          )}
        </div>
      </div>

      {/* Content - Flex Column Layout */}
      <CardContent className="flex flex-col flex-1 p-2.5">
        {/* Top: Name & Description */}
        <div>
          <h3 className="font-bold text-[13px] leading-snug tracking-tight text-foreground line-clamp-1" title={name}>
            {name}
          </h3>
          
          <p className="text-[11px] text-muted mt-0.5 line-clamp-1" title={description || 'Delicious snack'}>
            {description || 'Delicious snack'}
          </p>
        </div>

        {/* Spacer to push bottom row to the very bottom */}
        <div className="flex-1 min-h-[4px]" />

        {/* Bottom Row: Price & Add Button */}
        <div className="flex items-center justify-between gap-1 mt-auto">
          <div className="text-[13px] font-bold text-foreground whitespace-nowrap">₹{price}</div>
          
          <AnimatePresence mode="popLayout" initial={false}>
            {quantity > 0 ? (
              <motion.div
                key="controls"
                initial={prefersReducedMotion ? undefined : { opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={prefersReducedMotion ? undefined : { opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="flex items-center justify-between gap-1 rounded-full border border-primary p-1 bg-primary/5 h-8 w-[72px] shrink-0"
              >
                <motion.button whileTap={{ scale: 0.95 }} onClick={onRemove} aria-label="Decrease quantity" className="relative flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-primary transition-all duration-200 ease-out after:absolute after:-inset-3 after:content-[''] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 focus-visible:ring-offset-surface"><Minus className="h-3 w-3 relative z-10" /></motion.button>
                <div className="flex items-center justify-center overflow-hidden flex-1">
                  <AnimatePresence mode="popLayout">
                    <motion.span
                      key={quantity}
                      variants={counterVariants}
                      initial={prefersReducedMotion ? undefined : "initial"}
                      animate="animate"
                      exit={prefersReducedMotion ? undefined : "exit"}
                      className="text-center text-[12px] font-bold"
                    >
                      {quantity}
                    </motion.span>
                  </AnimatePresence>
                </div>
                <motion.button whileTap={{ scale: 0.95 }} onClick={onAdd} aria-label="Increase quantity" className="relative flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white transition-all duration-200 ease-out after:absolute after:-inset-3 after:content-[''] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 focus-visible:ring-offset-surface"><Plus className="h-3 w-3 relative z-10" /></motion.button>
              </motion.div>
            ) : (
              <motion.div
                key="add"
                initial={prefersReducedMotion ? undefined : { opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={prefersReducedMotion ? undefined : { opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="shrink-0"
              >
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="h-8 px-4 rounded-full text-[12px] font-bold border-primary text-primary hover:bg-primary/10 whitespace-nowrap w-[72px] flex items-center justify-center gap-2" 
                  onClick={onAdd} 
                  aria-label={`Add ${name} to cart`}
                >
                  Add
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
}

export { SnackCard };

