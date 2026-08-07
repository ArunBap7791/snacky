'use client';

import * as React from 'react';
import { Gift, Lock } from 'lucide-react';
import { Card, CardContent, CardProps } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ProgressiveImage } from '@/components/ui/progressive-image';
import { motion, AnimatePresence } from 'framer-motion';
import { useSafeMotion } from '@/lib/motion';

export interface RewardCardProps extends CardProps {
  title: string;
  pointsRequired: number;
  description: string;
  imageUrl: string;
  currentXp: number;
  onClick: () => void;
}

export function RewardCard({ title, pointsRequired, description, imageUrl, currentXp, onClick, className, ...props }: RewardCardProps) {
  const { counterVariants, prefersReducedMotion } = useSafeMotion();
  const isLocked = currentXp < pointsRequired;
  const xpNeeded = pointsRequired - currentXp;

  return (
    <Card 
      whileTap="tap"
      className={`overflow-hidden border-border bg-surface cursor-pointer rounded-[16px] transition-all duration-300 ${className} ${isLocked ? 'opacity-70 grayscale-[20%]' : 'hover:border-secondary/50 shadow-lg'}`}
      onClick={onClick}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      {...props}
    >
      <div className="flex h-[120px] items-stretch">
        {/* Reward Image */}
        <div className="relative w-[120px] shrink-0 bg-[#2A2D36]">
          <ProgressiveImage src={imageUrl} alt={title} className="absolute inset-0 h-full w-full object-cover" />
          {isLocked && (
            <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
              <Lock className="w-8 h-8 text-white/50" />
            </div>
          )}
        </div>
        
        {/* Content */}
        <CardContent className="flex flex-1 flex-col justify-center p-4 py-3 overflow-hidden">
          <div className="flex justify-between items-start gap-2 mb-1">
            <h3 className={`font-bold text-[15px] leading-tight tracking-tight line-clamp-1 ${isLocked ? 'text-muted' : 'text-foreground'}`}>
              {title}
            </h3>
            {!isLocked && (
              <motion.div 
                initial={prefersReducedMotion ? undefined : { scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="shrink-0 rounded-full bg-secondary/15 p-1.5 text-secondary"
              >
                <Gift className="h-3 w-3" />
              </motion.div>
            )}
          </div>
          
          <p className="text-[12px] text-muted line-clamp-2 leading-relaxed mb-3 flex-1">
            {description}
          </p>
          
          <div className="flex items-center justify-between mt-auto">
            <div className="flex flex-col relative w-24">
              <div className={`text-[14px] font-black flex items-center ${isLocked ? 'text-muted' : 'text-secondary'}`}>
                {pointsRequired} XP
              </div>
              {isLocked && (
                <div className="text-[10px] text-[#FF5252] font-semibold tracking-wider uppercase h-4 relative">
                  <AnimatePresence mode="popLayout">
                    <motion.span
                      key={xpNeeded}
                      variants={counterVariants}
                      initial={prefersReducedMotion ? undefined : "initial"}
                      animate="animate"
                      exit={prefersReducedMotion ? undefined : "exit"}
                      className="absolute left-0"
                    >
                      {xpNeeded > 0 ? `${xpNeeded} XP Needed` : ''}
                    </motion.span>
                  </AnimatePresence>
                </div>
              )}
            </div>
            
            <Button 
              size="sm" 
              variant={isLocked ? "outline" : "default"}
              disabled={isLocked}
              className={`h-[36px] text-[13px] font-bold rounded-[12px] px-4 shrink-0 flex items-center justify-center gap-2 ${
                isLocked 
                  ? 'border-border text-muted bg-transparent' 
                  : 'bg-secondary text-black hover:bg-secondary/90 shadow-[0_2px_10px_rgba(255,208,0,0.2)]'
              }`}
            >
              {isLocked ? 'Locked' : 'Redeem'}
            </Button>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}

