'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSafeMotion, motionDuration, motionEase } from '@/lib/motion';
import Image from 'next/image';

export function SplashWrapper({ children }: { children: React.ReactNode }) {
  const [showSplash, setShowSplash] = useState(true);
  const [videoError, setVideoError] = useState(false);
  const { prefersReducedMotion } = useSafeMotion();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Only show splash on initial load if not already seen in this session
    const hasSeenSplash = sessionStorage.getItem('snacky_splash_seen');
    if (hasSeenSplash) {
      setShowSplash(false);
      return;
    }

    let timer: NodeJS.Timeout;

    if (prefersReducedMotion || videoError) {
      timer = setTimeout(() => {
        handleDismiss();
      }, 1500);
    } else {
      // absolute max timeout in case autoplay fails or video is extremely long
      timer = setTimeout(() => {
        handleDismiss();
      }, 10000);
    }

    return () => clearTimeout(timer);
  }, [prefersReducedMotion, videoError]);

  const handleDismiss = () => {
    setShowSplash(false);
    sessionStorage.setItem('snacky_splash_seen', 'true');
  };

  return (
    <>
      <AnimatePresence>
        {showSplash && (
          <motion.div 
            key="splash"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: motionDuration.success, ease: motionEase.standard }}
            className={"flex min-h-screen w-full flex-col items-center justify-center z-[100] fixed inset-0 max-w-md mx-auto " + ((prefersReducedMotion || videoError) ? "bg-secondary" : "bg-background")}
          >
            {(prefersReducedMotion || videoError) ? (
              <motion.div 
                initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
                animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
                transition={{ duration: motionDuration.success, ease: motionEase.standard }}
                className="relative flex h-32 w-auto min-w-[200px] items-center justify-center px-4"
              >
                <Image src="/assets/Snacky%20Logo/SVG/Snacky%20Combined.svg" alt="Snacky" width={160} height={60} className="object-contain" priority />
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: motionDuration.success, ease: motionEase.standard }}
                className="relative flex w-full h-full items-center justify-center"
              >
                <video
                  ref={videoRef}
                  src="/assets/Splash Screen Video/V2 HB Splash Snacky.mp4"
                  className="w-full h-full object-cover"
                  autoPlay
                  muted
                  playsInline
                  onEnded={handleDismiss}
                  onError={() => setVideoError(true)}
                />
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      {!showSplash && children}
    </>
  );
}

