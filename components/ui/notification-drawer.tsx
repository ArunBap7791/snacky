'use client';

import * as React from 'react';
import { useState } from 'react';
import { BottomSheet } from '@/components/ui/bottom-sheet';
import { Ticket, Popcorn, Award, Tag, Check, X, Bell } from 'lucide-react';
import { EmptyState } from '@/components/ui/empty-state';
import { motion, AnimatePresence } from 'framer-motion';
import { useSafeMotion } from '@/lib/motion';

export interface NotificationDrawerProps {
  open: boolean;
  onClose: () => void;
}

const mockNotifications = [
  {
    id: '1',
    type: 'booking',
    title: 'Booking Confirmed!',
    description: 'Your tickets for Avengers: Endgame are confirmed. Show starts at 7:00 PM.',
    time: '2 hours ago',
    read: false,
    icon: <Ticket className="w-5 h-5 text-[#00B0FF]" />
  },
  {
    id: '2',
    type: 'snack',
    title: 'Order Preparing',
    description: 'Your popcorn and coke combo is being prepared and will be delivered to your seat.',
    time: '3 hours ago',
    read: false,
    icon: <Popcorn className="w-5 h-5 text-primary" />
  },
  {
    id: '3',
    type: 'reward',
    title: 'Silver Tier Unlocked',
    description: 'Congratulations! You have reached Silver Tier. Enjoy standard booking access.',
    time: '1 day ago',
    read: true,
    icon: <Award className="w-5 h-5 text-secondary" />
  },
  {
    id: '4',
    type: 'promo',
    title: 'Weekend Special',
    description: 'Get 50% off on all large popcorn this weekend!',
    time: '2 days ago',
    read: true,
    icon: <Tag className="w-5 h-5 text-success" />
  }
];

export function NotificationDrawer({ open, onClose }: NotificationDrawerProps) {
  const [notifications, setNotifications] = useState(mockNotifications);
  const { counterVariants, prefersReducedMotion } = useSafeMotion();

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <BottomSheet open={open} onClick={onClose}>
      <div 
        className="flex flex-col h-[70vh] bg-background rounded-t-[24px] overflow-hidden animate-in slide-in-from-bottom-full duration-300 relative" 
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border bg-surface">
          <h2 className="text-[20px] font-bold tracking-tight text-foreground flex items-center gap-2">
            Notifications
            <AnimatePresence mode="popLayout">
              {unreadCount > 0 && (
                <motion.span 
                  key={unreadCount}
                  variants={counterVariants}
                  initial={prefersReducedMotion ? undefined : "initial"}
                  animate="animate"
                  exit={prefersReducedMotion ? undefined : "exit"}
                  className="bg-primary text-white text-[12px] font-bold px-2 py-0.5 rounded-full inline-block"
                >
                  {unreadCount}
                </motion.span>
              )}
            </AnimatePresence>
          </h2>
          <button 
            className="p-2 rounded-full bg-[#2A2D36] text-foreground hover:bg-[#3f4351] transition-colors"
            onClick={onClose}
            aria-label="Close notifications"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto pb-safe">
          {notifications.length > 0 ? (
            <div className="p-4 space-y-3">
              <AnimatePresence>
                {unreadCount > 0 && (
                  <motion.div 
                    initial={prefersReducedMotion ? undefined : { opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={prefersReducedMotion ? undefined : { opacity: 0, height: 0 }}
                    className="flex justify-end mb-2 overflow-hidden"
                  >
                    <button 
                      onClick={markAllRead}
                      className="text-[13px] font-bold text-primary hover:text-[#ff1a46] flex items-center gap-1.5 transition-colors"
                    >
                      <Check className="w-4 h-4" /> Mark all as read
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
              <AnimatePresence>
                {notifications.map(notif => (
                  <motion.div 
                    layout
                    initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={prefersReducedMotion ? undefined : { opacity: 0, x: -100 }}
                    transition={{ duration: 0.2 }}
                    key={notif.id}
                    className={`relative overflow-hidden rounded-[16px] border p-4 flex gap-4 transition-all duration-300 ${notif.read ? 'border-border bg-background opacity-70 grayscale-[20%]' : 'border-border bg-surface shadow-lg'}`}
                  >
                    {!notif.read && (
                      <div className="absolute top-4 left-0 w-1 h-8 bg-primary rounded-r-md" />
                    )}
                    <div className={`shrink-0 w-12 h-12 rounded-[12px] flex items-center justify-center ${notif.read ? 'bg-surface' : 'bg-[#2A2D36]/80'}`}>
                      {notif.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2 mb-1">
                        <h3 className={`text-[15px] font-bold tracking-tight truncate ${notif.read ? 'text-muted' : 'text-foreground'}`}>
                          {notif.title}
                        </h3>
                        <span className="text-[11px] font-medium text-muted shrink-0 mt-0.5">
                          {notif.time}
                        </span>
                      </div>
                      <p className={`text-[13px] leading-relaxed ${notif.read ? 'text-muted' : 'text-foreground/90'}`}>
                        {notif.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center p-6">
              <EmptyState 
                icon={<Bell className="h-8 w-8" />}
                title="No Notifications"
                description="You're all caught up! We'll notify you when there's an update on your bookings or rewards."
              />
            </div>
          )}
        </div>
      </div>
    </BottomSheet>
  );
}

