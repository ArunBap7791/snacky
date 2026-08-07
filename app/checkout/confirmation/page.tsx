'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { getBooking, getMovie, getTheatre, getShow, getSnacksForTheatre } from '@/lib/services/api';
import { Booking, Movie, Theatre, Show, Snack } from '@/lib/types/domain';
import { CheckCircle2, Navigation, Home } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { ProgressiveImage } from '@/components/ui/progressive-image';
import { useCartStore } from '@/lib/store/cartStore';
import { motion } from 'framer-motion';
import { useSafeMotion, fadeUpVariants } from '@/lib/motion';
import { BookingSummaryCard, BookingSummaryData } from '@/components/ui/booking-summary-card';
import { resolveBookingSnacks } from '@/lib/utils/resolveBookingSnacks';

export default function ConfirmationPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const bookingId = searchParams.get('id');
  const { successPulseVariants, prefersReducedMotion } = useSafeMotion();
  
  const [booking, setBooking] = useState<Booking | null>(null);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [theatre, setTheatre] = useState<Theatre | null>(null);
  const [show, setShow] = useState<Show | null>(null);
  const [availableSnacks, setAvailableSnacks] = useState<Snack[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (bookingId) {
        const data = await getBooking(bookingId);
        if (data) {
          setBooking(data);
          
          const [movieData, theatreData, showData, snacksData] = await Promise.all([
            data.movieId ? getMovie(data.movieId) : Promise.resolve(null),
            data.theatreId ? getTheatre(data.theatreId) : Promise.resolve(null),
            data.showId ? getShow(data.showId) : Promise.resolve(null),
            data.theatreId ? getSnacksForTheatre(data.theatreId) : Promise.resolve([])
          ]);
          
          if (movieData) setMovie(movieData);
          if (theatreData) setTheatre(theatreData);
          if (showData) setShow(showData);
          if (snacksData) setAvailableSnacks(snacksData);
          
          // Clear cart only after successful booking render
          useCartStore.getState().clearCart();
        }
      }
      setLoading(false);
    };
    fetchData();
  }, [bookingId]);

  if (loading) {
    return (
      <main className="min-h-screen bg-background pb-[160px] flex flex-col items-center py-10 px-4">
        <Skeleton className="h-24 w-24 rounded-full mb-6" />
        <Skeleton className="h-8 w-64 mb-2" />
        <Skeleton className="h-6 w-40 mb-8 rounded-full" />
        
        <div className="w-full rounded-[24px] bg-surface border border-border p-6 shadow-2xl">
          <div className="flex flex-col items-center justify-center py-6 border-b border-border border-dashed mb-6">
            <Skeleton className="h-40 w-40 rounded-[16px] mb-6" />
            <Skeleton className="h-4 w-32 mb-2" />
            <Skeleton className="h-10 w-48" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-6 w-40" />
            <div className="flex gap-4">
              <Skeleton className="h-[80px] w-[56px] rounded-[8px]" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }
  if (!booking) {
    return <div className="min-h-screen bg-background flex flex-col items-center justify-center text-muted">Booking not found.</div>;
  }

  const isSnackOnly = booking.orderType === 'snack';
  
  const summaryData: BookingSummaryData = {
    orderType: booking.orderType,
    movieName: movie?.title,
    moviePosterUrl: movie?.posterUrl,
    theatreName: theatre?.name,
    theatreLogoUrl: theatre?.logoUrl,
    date: show?.date,
    time: show?.startTime,
    screen: show?.screen,
    seats: booking.seats,
    snackCount: booking.snackOrder?.reduce((acc, s) => acc + s.quantity, 0) || 0,
    snacks: resolveBookingSnacks(booking.snackOrder, availableSnacks),
    fulfilmentMethod: booking.fulfilmentMethod
  };

  return (
    <main className="min-h-screen bg-background pb-[160px] text-foreground">
      <motion.div 
        className="px-4 py-10 flex flex-col items-center relative overflow-hidden"
        initial="initial"
        animate="animate"
        variants={{
          initial: {},
          animate: { transition: { staggerChildren: 0.2 } }
        }}
      >
        {/* Success Animation Placeholder */}
        <div className="absolute top-0 left-0 w-full h-[200px] bg-gradient-to-b from-[#00E676]/10 to-transparent pointer-events-none" />
        
        <motion.div 
          variants={successPulseVariants}
          initial={prefersReducedMotion ? undefined : "initial"}
          animate="animate"
          className="relative h-24 w-24 rounded-full bg-success/20 flex items-center justify-center mb-6"
        >
          <motion.div 
            animate={prefersReducedMotion ? undefined : {
              scale: [1, 1.2, 1],
              opacity: [0.5, 0, 0.5]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute inset-0 rounded-full border-4 border-[#00E676]/30" 
          />
          <CheckCircle2 className="h-12 w-12 text-success" />
        </motion.div>
        
        <motion.h2 variants={fadeUpVariants} className="text-[28px] font-bold tracking-tight mb-2">
          {isSnackOnly ? 'Order Confirmed!' : 'Booking Confirmed!'}
        </motion.h2>
        <motion.p variants={fadeUpVariants} className="text-muted mb-8 font-mono text-[13px] bg-surface px-3 py-1 rounded-full border border-border">
          ID: {booking.id.toUpperCase()}
        </motion.p>

        <motion.div variants={fadeUpVariants} className="w-full rounded-[24px] bg-surface border border-border p-6 shadow-2xl relative">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#FF2A55] to-[#FFD000] rounded-t-[24px]"></div>
          
          {!isSnackOnly && (
            <div className="flex flex-col items-center justify-center py-6 border-b border-border border-dashed mb-6">
              <div className="h-40 w-40 bg-white p-2 rounded-[16px] shadow-inner mb-6 relative overflow-hidden flex items-center justify-center">
                <div className="grid grid-cols-4 grid-rows-4 gap-1 w-full h-full opacity-20 pointer-events-none absolute inset-0 p-2">
                  {Array.from({length: 16}).map((_, i) => (
                    <div key={i} className="bg-black rounded-sm" style={{ opacity: Math.random() > 0.5 ? 1 : 0 }} />
                  ))}
                </div>
                <ProgressiveImage src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=snacky-booking" alt="QR Code" width={130} height={130} className="w-[130px] h-[130px]" />
              </div>
              
              <p className="text-[13px] text-muted font-medium uppercase tracking-wider mb-1">Your Pickup OTP</p>
              <div className="text-4xl font-black tracking-[0.2em] text-secondary drop-shadow-md">{booking.otp}</div>
            </div>
          )}

          <BookingSummaryCard data={summaryData} className="border-none shadow-none p-0" />
        </motion.div>
      </motion.div>

      <motion.div 
        initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 50 }}
        animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6, ease: [0.2, 1, 0.4, 1] }}
        className="fixed bottom-0 left-0 right-0 bg-surface/90 backdrop-blur-md border-t border-border/50 px-4 py-4 pb-safe z-50 flex flex-col gap-3"
      >
        {!isSnackOnly && (
          <Button 
            className="w-full h-[52px] text-[16px] font-bold rounded-[16px] flex items-center justify-center gap-2 bg-primary text-white hover:bg-primary/90"
            onClick={() => router.push(`/bookings/${booking.id}?from=success`)}
          >
            <Navigation className="h-5 w-5" /> View Ticket
          </Button>
        )}
        <Button 
          variant={isSnackOnly ? "default" : "outline"}
          className={`w-full h-[52px] text-[16px] font-bold rounded-[16px] flex items-center justify-center gap-2 ${isSnackOnly ? 'bg-primary text-white hover:bg-primary/90' : 'border-border text-foreground hover:bg-[#2A2D36]/50'}`}
          onClick={() => router.push('/')}
        >
          <Home className="h-5 w-5" /> Back to Home
        </Button>
      </motion.div>
    </main>
  );
}

