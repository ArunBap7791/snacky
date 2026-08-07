'use client';

import { useReducedMotion } from 'framer-motion';

// --- Motion Tokens ---
export const motionDuration = {
  instant: 0.1,    // 100ms
  fast: 0.15,      // 150ms
  normal: 0.22,    // 220ms
  slow: 0.3,       // 300ms
  success: 0.5,    // 500ms
} as const;

export const motionEase = {
  standard: [0.25, 1, 0.5, 1], // Ease Out
  accelerate: [0.4, 0, 1, 1],  // Ease In
  decelerate: [0, 0, 0.2, 1],  // Ease Out Cubic
  emphasized: [0.4, 0, 0.2, 1], // Ease In Out
} as const;

// --- Shared Variants ---

export const pageVariants = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0, transition: { duration: motionDuration.slow, ease: motionEase.standard } },
  exit: { opacity: 0, transition: { duration: motionDuration.fast, ease: motionEase.accelerate } },
};

export const fadeVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: motionDuration.normal, ease: motionEase.standard } },
  exit: { opacity: 0, transition: { duration: motionDuration.fast, ease: motionEase.accelerate } },
};

export const fadeUpVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: motionDuration.normal, ease: motionEase.standard } },
  exit: { opacity: 0, y: 16, transition: { duration: motionDuration.fast, ease: motionEase.accelerate } },
};

export const scaleVariants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1, transition: { duration: motionDuration.normal, ease: motionEase.emphasized } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: motionDuration.fast, ease: motionEase.accelerate } },
};

export const cardPressVariants = {
  hover: {},
  tap: { scale: 0.98, transition: { duration: motionDuration.instant, ease: motionEase.accelerate } },
};

export const buttonPressVariants = {
  hover: {},
  tap: { scale: 0.98, transition: { duration: motionDuration.instant, ease: motionEase.accelerate } },
};

export const successPulseVariants = {
  initial: { scale: 0.8, opacity: 0 },
  animate: { scale: [1.2, 1], opacity: 1, transition: { duration: motionDuration.success, ease: motionEase.emphasized } },
};

export const badgeBounceVariants = {
  initial: { scale: 0 },
  animate: { 
    scale: 1,
    transition: { type: 'spring' as const, stiffness: 400, damping: 15 }
  },
  update: { scale: [1, 1.1, 1], transition: { duration: motionDuration.normal, ease: motionEase.emphasized } }
};

export const bottomSheetVariants = {
  initial: { y: '100%' },
  animate: { y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 30 } },
  exit: { y: '100%', transition: { type: 'spring' as const, stiffness: 300, damping: 30 } },
};

export const bottomSheetOverlayVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: motionDuration.normal, ease: motionEase.standard } },
  exit: { opacity: 0, transition: { duration: motionDuration.fast, ease: motionEase.accelerate } },
};

export const modalVariants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1, transition: { duration: motionDuration.normal, ease: motionEase.emphasized } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: motionDuration.fast, ease: motionEase.accelerate } },
};

export const skeletonShimmerVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: motionDuration.slow } },
};

export const shimmerSweepVariants = {
  initial: { x: '-100%' },
  animate: { x: '100%', transition: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' as const } },
};

export const toastVariants = {
  initial: { opacity: 0, y: 50, scale: 0.9 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring' as const, stiffness: 300, damping: 25 } },
  exit: { opacity: 0, scale: 0.9, transition: { duration: motionDuration.fast, ease: motionEase.accelerate } },
};

export const counterVariants = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0, transition: { duration: motionDuration.fast, ease: motionEase.standard } },
  exit: { opacity: 0, y: 20, transition: { duration: motionDuration.instant, ease: motionEase.accelerate } },
};

export const imageFadeVariants = {
  initial: { opacity: 0, scale: 0.98 },
  animate: { opacity: 1, scale: 1, transition: { duration: motionDuration.normal, ease: motionEase.standard } },
  exit: { opacity: 0, transition: { duration: motionDuration.fast, ease: motionEase.accelerate } },
};

export const emptyStateVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: motionDuration.normal, ease: motionEase.standard } },
  exit: { opacity: 0, y: -20, transition: { duration: motionDuration.fast, ease: motionEase.accelerate } },
};

export const listStaggerVariants = {
  animate: { transition: { staggerChildren: 0.05 } }
};

// --- Helpers ---
export function useSafeMotion() {
  const prefersReducedMotion = useReducedMotion();

  return {
    prefersReducedMotion,
    // Return modified variants if reduced motion is preferred
    pageVariants: prefersReducedMotion ? fadeVariants : pageVariants,
    fadeVariants,
    fadeUpVariants: prefersReducedMotion ? fadeVariants : fadeUpVariants,
    scaleVariants: prefersReducedMotion ? fadeVariants : scaleVariants,
    chipVariants: prefersReducedMotion ? { hover: {}, tap: {} } : {
      hover: { scale: 1.02, transition: { duration: 0.2, ease: motionEase.standard } },
      tap: { scale: 0.96, transition: { duration: 0.1, ease: motionEase.standard } }
    },
    cardPressVariants: prefersReducedMotion ? {} : cardPressVariants,
    buttonPressVariants: prefersReducedMotion ? {} : buttonPressVariants,
    successPulseVariants: prefersReducedMotion ? fadeVariants : successPulseVariants,
    badgeBounceVariants: prefersReducedMotion ? fadeVariants : badgeBounceVariants,
    bottomSheetVariants: prefersReducedMotion ? fadeUpVariants : bottomSheetVariants,
    bottomSheetOverlayVariants: prefersReducedMotion ? fadeVariants : bottomSheetOverlayVariants,
    modalVariants: prefersReducedMotion ? fadeVariants : modalVariants,
    toastVariants: prefersReducedMotion ? fadeVariants : toastVariants,
    emptyStateVariants: prefersReducedMotion ? fadeVariants : emptyStateVariants,
    counterVariants: prefersReducedMotion ? fadeVariants : counterVariants,
    imageFadeVariants: prefersReducedMotion ? fadeVariants : imageFadeVariants,
    skeletonShimmerVariants,
    shimmerSweepVariants: prefersReducedMotion ? { initial: { opacity: 0 }, animate: { opacity: 0 } } : shimmerSweepVariants,
    listStaggerVariants,
  };
}
