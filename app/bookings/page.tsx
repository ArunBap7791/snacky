'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { TopNavigation } from '@/components/ui/top-navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { getUserBookings } from '@/lib/services/api';
import { Booking } from '@/lib/types/domain';
import { BookingCard } from '@/components/ui/booking-card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Ticket } from 'lucide-react';

export default function BookingsPage() {
  const router = useRouter();
  const { isGuest } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'upcoming' | 'ongoing' | 'completed'>('upcoming');

  useEffect(() => {
    if (isGuest) {
      router.push('/sign-in?redirect_url=/bookings');
      return;
    }
    getUserBookings().then(data => {
      setBookings(data);
      setLoading(false);
    });
  }, [isGuest, router]);

  if (isGuest) return null;

  const filtered = bookings.filter(b => {
    if (tab === 'upcoming') return b.status === 'confirmed' || b.status === 'pending';
    if (tab === 'ongoing') return false; // Assuming ongoing state might exist later
    if (tab === 'completed') return b.status === 'completed' || b.status === 'cancelled';
    return false;
  });

  return (
    <main className="min-h-screen bg-background pb-24 text-foreground">
      <TopNavigation title="Your Bookings" />
      
      {/* Sticky Tabs */}
      <div className="sticky top-14 z-10 bg-background px-4 pt-2 border-b border-border">
        <div className="flex w-full">
          {(['upcoming', 'ongoing', 'completed'] as const).map(t => (
            <button 
              key={t}
              className={`flex-1 pb-3 text-[14px] font-bold capitalize transition-colors relative ${tab === t ? 'text-primary' : 'text-muted hover:text-foreground'}`}
              onClick={() => setTab(t)}
            >
              {t}
              {tab === t && (
                <div className="absolute bottom-0 left-0 w-full h-[3px] rounded-t-full bg-primary animate-in slide-in-from-bottom-1" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 py-4">
        {loading ? (
          <div className="flex flex-col space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex flex-col bg-surface border border-border rounded-[24px] p-4">
                <div className="flex gap-4">
                  <Skeleton className="h-[120px] w-[84px] shrink-0 rounded-[12px]" />
                  <div className="flex-1 space-y-3 py-1">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-border flex gap-3">
                  <Skeleton className="h-[40px] flex-1 rounded-[12px]" />
                  <Skeleton className="h-[40px] flex-1 rounded-[12px]" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className="flex flex-col space-y-4">
            {filtered.map(booking => (
              <BookingCard 
                key={booking.id}
                booking={booking}
                tab={tab}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center animate-in fade-in zoom-in duration-500">
            {(tab === 'ongoing' || tab === 'completed') ? (
              <div className="relative mb-6 flex h-[120px] w-[120px] items-center justify-center">
                <Image src="/assets/Corny%20Bombs/Corny%20Covers%20His%20Eyes.png" alt={`No ${tab} bookings`} fill className="object-contain" />
              </div>
            ) : (
              <div className="relative mb-6 h-28 w-28 overflow-hidden rounded-full border-4 border-border bg-surface shadow-lg flex items-center justify-center">
                <Ticket className="h-12 w-12 text-muted opacity-50" />
              </div>
            )}
            <h3 className="text-[20px] font-bold text-foreground tracking-tight mb-2">No bookings yet</h3>
            <p className="mb-8 text-[14px] text-muted px-4 max-w-[280px] leading-relaxed">
              You don&apos;t have any {tab} bookings at the moment. Explore movies to book your next experience!
            </p>
            <Button 
              onClick={() => router.push('/')}
              className="h-[52px] rounded-[16px] bg-primary px-8 text-[16px] font-bold text-white transition-all duration-200 ease-out active:scale-[0.96] flex items-center justify-center gap-2"
            >
              Explore Movies
            </Button>
          </div>
        )}
      </div>

      <div className="pb-safe" />
    </main>
  );
}

