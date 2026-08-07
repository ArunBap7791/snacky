'use client';

import { motion } from 'framer-motion';
import { useSafeMotion } from '@/lib/motion';

export default function Template({ children }: { children: React.ReactNode }) {
  const { pageVariants, prefersReducedMotion } = useSafeMotion();
  
  if (prefersReducedMotion) {
    return <>{children}</>;
  }
  
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      className="flex flex-col flex-1 h-full w-full"
    >
      {children}
    </motion.div>
  );
}
