'use client';

import * as React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { useSafeMotion } from '@/lib/motion';
import { cn } from '@/lib/utils/cn';

export interface ProgressiveImageProps extends HTMLMotionProps<"img"> {
  fallbackSrc?: string;
}

export function ProgressiveImage({ src, alt, className, fallbackSrc = 'https://placehold.co/400x400/2A2D36/9498A6.png?text=Image', ...props }: ProgressiveImageProps) {
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [hasError, setHasError] = React.useState(false);
  const { imageFadeVariants, prefersReducedMotion } = useSafeMotion();

  return (
    <div className={cn('relative overflow-hidden bg-[#2A2D36]', className)}>
      <motion.img
        src={hasError ? fallbackSrc : src}
        alt={alt}
        variants={imageFadeVariants}
        initial="initial"
        animate={isLoaded ? 'animate' : 'initial'}
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          setHasError(true);
          setIsLoaded(true);
        }}
        className="h-full w-full object-cover"
        style={prefersReducedMotion ? { filter: 'none', opacity: 1, scale: 1 } : {}}
        {...props}
      />
    </div>
  );
}
