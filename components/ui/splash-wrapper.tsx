'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSafeMotion, motionDuration, motionEase } from '@/lib/motion';

export function SplashWrapper({ children }: { children: React.ReactNode }) {
  const [showSplash, setShowSplash] = useState(true);
  const { prefersReducedMotion } = useSafeMotion();

  useEffect(() => {
    // Only show splash on initial load if not already seen in this session
    const hasSeenSplash = sessionStorage.getItem('snacky_splash_seen');
    if (hasSeenSplash) {
      setShowSplash(false);
      return;
    }

    const timer = setTimeout(() => {
      setShowSplash(false);
      sessionStorage.setItem('snacky_splash_seen', 'true');
    }, 1500); 

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence>
        {showSplash && (
          <motion.div 
            key="splash"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: motionDuration.success, ease: motionEase.standard }}
            className="flex min-h-screen w-full flex-col items-center justify-center bg-background z-[100] fixed inset-0 max-w-md mx-auto"
          >
            <motion.div 
              initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
              animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
              transition={{ duration: motionDuration.success, ease: motionEase.standard }}
              className="relative flex h-32 w-32 items-center justify-center"
            >
              <h1 className="text-4xl font-bold text-foreground tracking-tighter z-10">
                Snacky<span className="text-primary">.</span>
              </h1>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {!showSplash && children}
    </>
  );
}

