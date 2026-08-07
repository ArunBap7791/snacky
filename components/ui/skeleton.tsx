'use client';

import * as React from 'react';
import { cn } from '@/lib/utils/cn';
import { motion, HTMLMotionProps } from 'framer-motion';
import { skeletonShimmerVariants, shimmerSweepVariants } from '@/lib/motion';

export type SkeletonProps = HTMLMotionProps<"div">;

function Skeleton({ className, ...props }: SkeletonProps) {


  return (
    <motion.div 
      variants={skeletonShimmerVariants}
      initial="initial"
      animate="animate"
      className={cn(
        'relative overflow-hidden rounded-[12px] bg-[#2A2D36]', 
        className
      )} 
      {...props} 
    >
      <motion.div 
        variants={shimmerSweepVariants}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent" 
      />
    </motion.div>
  );
}

export { Skeleton };
