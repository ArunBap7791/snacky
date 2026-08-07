'use client';

import * as React from 'react';
import { Home, Gift, Ticket, ShoppingCart, User } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { useSafeMotion, motionDuration } from '@/lib/motion';
import { useCartStore } from '@/lib/store/cartStore';
import { AnimatePresence } from 'framer-motion';

const items = [
  { id: '', label: 'Home', icon: Home },
  { id: 'rewards', label: 'Rewards', icon: Gift },
  { id: 'bookings', label: 'Bookings', icon: Ticket },
  { id: 'cart', label: 'Cart', icon: ShoppingCart },
  { id: 'profile', label: 'Profile', icon: User },
] as const;

export function BottomNavigation({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();
  const { prefersReducedMotion } = useSafeMotion();
  const cartItems = useCartStore((state) => state.items);
  const totalCartItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // We only show it on the top-level routes
  const isRootRoute = pathname === '/' || pathname === '/rewards' || pathname === '/bookings' || pathname === '/cart' || pathname === '/profile';
  
  if (!isRootRoute) return null;

  return (
    <nav className={cn('fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around rounded-t-[24px] border-t border-border/50 bg-surface/90 backdrop-blur-lg px-3 py-3 mx-auto max-w-md w-full pb-safe', className)} aria-label="Bottom Navigation" {...props}>
      {items.map((item) => {
        const Icon = item.icon;
        const href = `/${item.id}`;
        const selected = pathname === href;

        return (
            <Link 
              href={selected && item.id !== '' ? '#' : href}
              onClick={(e) => {
                if (item.id === '') {
                  if (typeof window !== 'undefined') {
                    sessionStorage.setItem('homeActiveTab', 'movies');
                    window.dispatchEvent(new Event('resetHomeTab'));
                  }
                }
                if (selected && item.id !== '') {
                  e.preventDefault();
                }
              }}
              key={item.id} 
              aria-label={item.label}
              aria-current={selected ? 'page' : undefined}
              className={cn(
                'flex flex-col items-center justify-center min-w-[48px] min-h-[48px] flex-1 rounded-[12px] px-1 py-2 text-[11px] outline-none', 
                selected ? 'text-primary' : 'text-muted hover:text-foreground'
              )}
            >
              <motion.div 
                animate={{ 
                  scale: selected && !prefersReducedMotion ? 1.08 : 1, 
                  color: selected ? '#FF2A55' : '#9498A6'
                }}
                transition={{ duration: motionDuration.normal }}
                className="mb-1 flex flex-col items-center justify-center"
              >
                <div className="relative">
                  <Icon className={cn("h-5 w-5", selected && "drop-shadow-[0_0_8px_rgba(255,42,85,0.5)]")} aria-hidden="true" />
                  {item.id === 'cart' && totalCartItems > 0 && (
                    <AnimatePresence>
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        transition={{ type: "spring", stiffness: 400, damping: 15 }}
                        className="absolute -top-1.5 -right-2 flex h-[14px] min-w-[14px] items-center justify-center rounded-full bg-primary px-1 text-[9px] font-bold text-white shadow-sm"
                      >
                        <motion.span
                          key={totalCartItems}
                          initial={prefersReducedMotion ? false : { scale: 1.1 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: motionDuration.normal, ease: "easeOut" }}
                        >
                          {totalCartItems}
                        </motion.span>
                      </motion.div>
                    </AnimatePresence>
                  )}
                </div>
              </motion.div>
              <motion.span 
                animate={{ opacity: selected ? 1 : 0.8 }}
                transition={{ duration: motionDuration.normal }}
                className={cn("relative flex flex-col items-center justify-center", selected ? "font-bold" : "font-medium")}
              >
                {item.label}
                <span className="invisible font-bold h-0 overflow-hidden" aria-hidden="true">{item.label}</span>
              </motion.span>
            </Link>
        );
      })}
    </nav>
  );
}

