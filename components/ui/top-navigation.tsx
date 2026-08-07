'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Bell, ArrowLeft, Search, ChevronDown, User } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { NotificationDrawer } from './notification-drawer';

export interface TopNavigationProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  showBack?: boolean;
  showSearch?: boolean;
  showNotifications?: boolean;
  notificationCount?: number;
  location?: string;
  showProfile?: boolean;
}

function TopNavigation({ title, showBack = false, showSearch = false, showNotifications = false, notificationCount = 0, location, showProfile = false, className, ...props }: TopNavigationProps) {
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  
  return (
    <>
    <header className={cn('sticky top-0 z-40 flex items-center justify-between border-b border-border/50 bg-background/80 backdrop-blur-md px-4 py-3 pb-safe pt-safe transition-all duration-200', className)} {...props}>
      <div className="flex items-center gap-3">
        {showBack ? <button onClick={() => router.back()} className="rounded-full p-2 text-foreground hover:bg-surface active:scale-[0.98] transition-transform duration-200 ease-out" aria-label="Go back"><ArrowLeft className="h-5 w-5" /></button> : null}
        {!showBack && showProfile ? (
          <button onClick={() => router.push('/profile')} className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary active:scale-[0.98] transition-transform duration-200 ease-out">
            <User className="h-5 w-5" />
          </button>
        ) : null}
        {location ? (
          <div className="flex flex-col cursor-pointer active:scale-[0.98] transition-transform duration-200 ease-out ml-1">
            <span className="text-[11px] font-medium text-muted">Your Location</span>
            <div className="flex items-center gap-1">
              <span className="text-[16px] font-bold text-foreground truncate max-w-[150px]">{location}</span>
              <ChevronDown className="h-4 w-4 text-primary" />
            </div>
          </div>
        ) : title ? (
          <h2 className="text-[20px] font-semibold">{title}</h2>
        ) : null}
      </div>
      <div className="flex items-center gap-2">
        {showSearch ? <button className="rounded-full p-2 text-foreground hover:bg-surface active:scale-[0.98] transition-transform duration-200 ease-out" aria-label="Search"><Search className="h-5 w-5" /></button> : null}
        {showNotifications ? (
          <button 
            className="relative rounded-full p-2 text-foreground hover:bg-surface active:scale-[0.98] transition-transform duration-200 ease-out" 
            aria-label="Notifications"
            onClick={() => setDrawerOpen(true)}
          >
            <Bell className="h-5 w-5" />
            {notificationCount > 0 && (
              <span className="absolute top-1.5 right-2 flex h-2 w-2 items-center justify-center rounded-full bg-primary" />
            )}
          </button>
        ) : null}
      </div>
    </header>
    <NotificationDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}

export { TopNavigation };

