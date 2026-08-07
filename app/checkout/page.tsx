'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TopNavigation } from '@/components/ui/top-navigation';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useSafeMotion } from '@/lib/motion';
import { useCartStore } from '@/lib/store/cartStore';
import { useAuthStore } from '@/lib/store/authStore';
import { getTheatre, getMovie, getShow, getSnacksForTheatre, getBooking } from '@/lib/services/api';
import { resolveBookingSnacks } from '@/lib/utils/resolveBookingSnacks';
import { Theatre, Movie, Show, Snack, FulfilmentMethod, Booking } from '@/lib/types/domain';
import { BookingSummaryCard, BookingSummaryData } from '@/components/ui/booking-summary-card';
import { deriveBookingContext } from '@/lib/utils/booking-context';
import { Skeleton } from '@/components/ui/skeleton';
import { useShallow } from 'zustand/react/shallow';
import { AnimatePresence } from 'framer-motion';
import { useIsMounted } from '@/lib/hooks/useIsMounted';

export default function CheckoutPage() {
  const router = useRouter();
  const { chipVariants, pageVariants } = useSafeMotion();
  const { isGuest } = useAuthStore();
  const {
    existingBookingId,
    movieId,
    theatreId,
    showId,
    seats,
    items,
    fulfilmentMethod,
    seatDeliveryTiming,
    setFulfilmentMethod,
    getTotalAmount
  } = useCartStore(
    useShallow((state) => ({
      existingBookingId: state.existingBookingId,
      movieId: state.movieId,
      theatreId: state.theatreId,
      showId: state.showId,
      seats: state.seats,
      items: state.items,
      fulfilmentMethod: state.fulfilmentMethod,
      seatDeliveryTiming: state.seatDeliveryTiming,
      setFulfilmentMethod: state.setFulfilmentMethod,
      getTotalAmount: state.getTotalAmount
    }))
  );
  const [theatre, setTheatre] = useState<Theatre | null>(null);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [show, setShow] = useState<Show | null>(null);
  const [availableSnacks, setAvailableSnacks] = useState<Snack[]>([]);
  const [existingBooking, setExistingBooking] = useState<Booking | null>(null);
  const [showSeatDeliveryDialog, setShowSeatDeliveryDialog] = useState(false);
  const isMounted = useIsMounted();

  const context = deriveBookingContext(
    existingBookingId,
    existingBooking,
    { movieId, seats }
  );

  const isLoadingExistingBooking = context.isLoading;

  useEffect(() => {
    // Wait until loaded
    if (isLoadingExistingBooking) return;

    if (context.isStandaloneSnackOrder && fulfilmentMethod !== 'express_pickup') {
      setFulfilmentMethod('express_pickup');
    }
  }, [context.isStandaloneSnackOrder, fulfilmentMethod, setFulfilmentMethod, isLoadingExistingBooking]);

  useEffect(() => {
    if (isLoadingExistingBooking) return;

    if (context.existingFulfilmentMethod === 'seat_delivery' && fulfilmentMethod !== 'seat_delivery') {
      setFulfilmentMethod('seat_delivery');
    }
  }, [context.existingFulfilmentMethod, fulfilmentMethod, setFulfilmentMethod, isLoadingExistingBooking]);

  useEffect(() => {
    if ((!seats || seats.length === 0) && items.length === 0) {
      router.push('/cart');
    }
  }, [seats, items, router]);
  
  useEffect(() => {
    const fetchData = async () => {
      let tId = theatreId;
      let mId = movieId;
      let sId = showId;
      let bookingData = null;

      if (existingBookingId) {
        bookingData = await getBooking(existingBookingId);
        setExistingBooking(bookingData || null);
        if (bookingData) {
          tId = tId || bookingData.theatreId;
          mId = mId || bookingData.movieId;
          sId = sId || bookingData.showId;
        }
      }

      const [theatreData, movieData, showData, snacksData] = await Promise.all([
        tId ? getTheatre(tId) : Promise.resolve(null),
        mId ? getMovie(mId) : Promise.resolve(null),
        sId ? getShow(sId) : Promise.resolve(null),
        tId ? getSnacksForTheatre(tId) : Promise.resolve([])
      ]);
      
      if (theatreData) setTheatre(theatreData);
      if (movieData) setMovie(movieData);
      if (showData) setShow(showData);
      if (snacksData) setAvailableSnacks(snacksData);
    };
    fetchData();
  }, [theatreId, movieId, showId, existingBookingId]);

  const hasSnacks = items.length > 0;
  const isSeatDeliveryEligible = Boolean(theatre?.supportsSeatDelivery && (seats?.length || existingBooking?.seats?.length));

  const handleSelectFulfilment = (method: FulfilmentMethod, timing?: 'before_movie' | 'interval') => {
    if (method === 'seat_delivery' && context.deliveryRules.popupRequired) {
      setShowSeatDeliveryDialog(true);
      return;
    }
    setFulfilmentMethod(method, timing);
  };

  const handleProceed = () => {
    if (hasSnacks && !fulfilmentMethod) return;
    if (isGuest) {
      router.push('/login?redirect=/checkout/payment');
    } else {
      router.push('/checkout/payment');
    }
  };

  const ticketTotal = context.isStandaloneSnackOrder || context.isExistingBooking ? 0 : (seats?.length || 0) * 250;
  const snackTotal = getTotalAmount();
  const snackCount = items.reduce((a, b) => a + b.quantity, 0);
  const fee = context.isStandaloneSnackOrder || context.isExistingBooking ? 0 : 30; // Mock convenience fee
  const deliveryFee = (fulfilmentMethod === 'seat_delivery' && context.existingFulfilmentMethod !== 'seat_delivery') ? 50 : 0;
  const total = ticketTotal + snackTotal + fee + deliveryFee;

  const summaryData: BookingSummaryData = {
    orderType: context.isStandaloneSnackOrder ? 'snack' : 'movie',
    movieName: movie?.title,
    moviePosterUrl: movie?.posterUrl,
    theatreName: theatre?.name,
    theatreLogoUrl: theatre?.logoUrl,
    date: show?.date,
    time: show?.startTime,
    screen: show?.screen,
    seats: seats || existingBooking?.seats,
    snackCount: snackCount,
    snacks: resolveBookingSnacks(items, availableSnacks),
    fulfilmentMethod: fulfilmentMethod
  };

  if (!isMounted || isLoadingExistingBooking) {
    return (
      <main className="min-h-screen bg-background pb-32 flex flex-col items-center py-10 px-4">
        <Skeleton className="h-8 w-64 mb-6" />
        <Skeleton className="h-40 w-full mb-6 rounded-[24px]" />
        <Skeleton className="h-24 w-full rounded-[24px]" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background pb-32 text-foreground">
      <TopNavigation title="Checkout Summary" showBack />
      
      <motion.div 
        variants={pageVariants}
        initial="initial"
        animate="animate"
        className="px-4 py-6"
      >
        
        {hasSnacks && (
          <div className="mb-8">
            <h3 className="text-[16px] font-bold tracking-tight mb-4">Choose Fulfilment</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <motion.button 
                variants={chipVariants}
                whileHover="hover"
                whileTap="tap"
                onClick={() => {
                  if (context.deliveryRules.canExpressPickup) handleSelectFulfilment('express_pickup');
                }}
                className={`flex flex-col items-start gap-3 rounded-[16px] p-4 border-[1.5px] min-h-[120px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background ${fulfilmentMethod === 'express_pickup' ? 'border-primary bg-primary/10' : 'border-border bg-surface'} ${!context.deliveryRules.canExpressPickup ? 'opacity-50 pointer-events-none' : ''}`}
                aria-pressed={fulfilmentMethod === 'express_pickup'}
              >
                <div className="flex items-center justify-between w-full">
                  <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${fulfilmentMethod === 'express_pickup' ? 'border-primary' : 'border-border'}`}>
                    {fulfilmentMethod === 'express_pickup' && <div className="h-2.5 w-2.5 rounded-full bg-primary" />}
                  </div>
                </div>
                <div className="text-left w-full mt-auto">
                  <span className="block font-bold text-[14px] text-foreground">Express Pickup</span>
                  <span className="block text-muted text-[11px] mt-1 leading-snug">Collect from counter. Free.</span>
                </div>
              </motion.button>
              
              <motion.button 
                variants={chipVariants}
                whileHover="hover"
                whileTap="tap"
                onClick={() => handleSelectFulfilment('seat_delivery', 'interval')}
                className={`flex flex-col items-start gap-3 rounded-[16px] p-4 border-[1.5px] min-h-[120px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background ${fulfilmentMethod === 'seat_delivery' ? 'border-primary bg-primary/10' : 'border-border bg-surface'}`}
                aria-pressed={fulfilmentMethod === 'seat_delivery'}
              >
                <div className="flex items-center justify-between w-full">
                  <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${fulfilmentMethod === 'seat_delivery' ? 'border-primary' : 'border-border'}`}>
                    {fulfilmentMethod === 'seat_delivery' && <div className="h-2.5 w-2.5 rounded-full bg-primary" />}
                  </div>
                  {isSeatDeliveryEligible && <span className="font-bold text-secondary bg-secondary/10 px-1.5 py-0.5 rounded-[4px] text-[10px]">+₹50</span>}
                </div>
                <div className="text-left w-full mt-auto">
                  <span className="block font-bold text-[14px] text-foreground">Seat Delivery</span>
                  <span className="block text-muted text-[11px] mt-1 leading-snug">
                    Delivered to your seat.
                  </span>
                </div>
              </motion.button>
            </div>
            
            {fulfilmentMethod === 'seat_delivery' && isSeatDeliveryEligible && (
              <div className="mt-4 flex flex-col gap-3 rounded-[16px] bg-surface p-4 border border-border">
                <h4 className="text-[12px] font-bold text-muted uppercase tracking-wider mb-1">Select Timing</h4>
                
                <div className="grid grid-cols-2 gap-3 mt-3">
                  <motion.label 
                    variants={chipVariants}
                    whileHover="hover"
                    whileTap="tap"
                    className={`flex flex-col items-center justify-center gap-2 p-3 rounded-[12px] border-[1.5px] cursor-pointer text-center min-h-[80px] has-[:focus-visible]:outline-none has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-background ${seatDeliveryTiming === 'before_movie' ? 'border-primary bg-primary/5' : 'border-border hover:bg-[#2A2D36]/50'}`}
                  >
                    <input 
                      type="radio" 
                      name="timing" 
                      className="sr-only" 
                      onChange={() => handleSelectFulfilment('seat_delivery', 'before_movie')}
                      checked={seatDeliveryTiming === 'before_movie'} 
                    />
                    <div className={`h-4 w-4 shrink-0 rounded-full border-2 flex items-center justify-center ${seatDeliveryTiming === 'before_movie' ? 'border-primary' : 'border-border'}`}>
                      {seatDeliveryTiming === 'before_movie' && <div className="h-2 w-2 rounded-full bg-primary" />}
                    </div>
                    <span className={`text-[12px] font-bold ${seatDeliveryTiming === 'before_movie' ? 'text-foreground' : 'text-muted'}`}>Before Movie</span>
                  </motion.label>

                  <motion.label 
                    variants={chipVariants}
                    whileHover="hover"
                    whileTap="tap"
                    className={`flex flex-col items-center justify-center gap-2 p-3 rounded-[12px] border-[1.5px] cursor-pointer text-center min-h-[80px] has-[:focus-visible]:outline-none has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-background ${seatDeliveryTiming === 'interval' ? 'border-primary bg-primary/5' : 'border-border hover:bg-[#2A2D36]/50'}`}
                  >
                    <input 
                      type="radio" 
                      name="timing" 
                      className="sr-only"
                      onChange={() => handleSelectFulfilment('seat_delivery', 'interval')}
                      checked={seatDeliveryTiming === 'interval'} 
                    />
                    <div className={`h-4 w-4 shrink-0 rounded-full border-2 flex items-center justify-center ${seatDeliveryTiming === 'interval' ? 'border-primary' : 'border-border'}`}>
                      {seatDeliveryTiming === 'interval' && <div className="h-2 w-2 rounded-full bg-primary" />}
                    </div>
                    <span className={`text-[12px] font-bold ${seatDeliveryTiming === 'interval' ? 'text-foreground' : 'text-muted'}`}>During Interval</span>
                  </motion.label>
                </div>
              </div>
            )}

            {context.deliveryRules.helperMessage && (
              <div className="mt-4 p-4 rounded-[16px] bg-secondary/10 border border-secondary/20 text-secondary text-[13px] leading-relaxed font-medium">
                {context.deliveryRules.helperMessage}
              </div>
            )}
          </div>
        )}

        <div className="rounded-[16px] border border-border bg-surface p-4">
          <h3 className="text-[16px] font-bold tracking-tight mb-4 border-b border-border pb-2">Order Summary</h3>
          
          <div className="mb-4">
            <BookingSummaryCard data={summaryData} className="border-none shadow-none p-0" />
          </div>

          <div className="flex flex-col gap-2 text-sm pt-4 border-t border-border border-dashed">
            <AnimatePresence initial={false}>
              {!context.isStandaloneSnackOrder && ticketTotal > 0 && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="flex justify-between overflow-hidden">
                  <span className="text-muted">Tickets ({seats?.length})</span>
                  <span>₹{ticketTotal}</span>
                </motion.div>
              )}
              
              {snackTotal > 0 && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="flex justify-between overflow-hidden">
                  <span className="text-muted">Snacks ({snackCount})</span>
                  <span>₹{snackTotal}</span>
                </motion.div>
              )}

              {!context.isStandaloneSnackOrder && !context.isExistingBooking && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="flex justify-between overflow-hidden">
                  <span className="text-muted">Convenience Fee</span>
                  <span>₹{fee}</span>
                </motion.div>
              )}

              {deliveryFee > 0 && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="flex justify-between text-secondary overflow-hidden">
                  <span>Delivery Fee</span>
                  <span>₹{deliveryFee}</span>
                </motion.div>
              )}
            </AnimatePresence>
            
            <div className="mt-2 flex justify-between font-bold text-[16px] border-t border-border pt-3">
              <span>Amount Payable</span>
              <AnimatePresence mode="popLayout">
                <motion.span 
                  key={total}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                >
                  ₹{total}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>
        </div>

      </motion.div>

      <div className="fixed bottom-0 left-0 right-0 border-t border-border/50 bg-surface/90 backdrop-blur-md px-4 py-4 pb-safe z-50 flex items-center justify-between">
        <div>
          <div className="text-[12px] text-muted">Amount Payable</div>
          <AnimatePresence mode="popLayout">
            <motion.div 
              key={total}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="text-[20px] font-bold text-foreground"
            >
              ₹{total}
            </motion.div>
          </AnimatePresence>
        </div>
        <Button 
          className="h-[52px] px-8 text-[16px] font-bold rounded-[16px] flex items-center justify-center gap-2"
          onClick={handleProceed}
          disabled={hasSnacks && (!fulfilmentMethod || (fulfilmentMethod === 'seat_delivery' && !seatDeliveryTiming))}
        >
          Proceed to Pay
        </Button>
      </div>

      {showSeatDeliveryDialog && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 animate-in fade-in">
          <div className="bg-surface border border-border rounded-[24px] p-6 w-full max-w-sm shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-[18px] font-bold tracking-tight text-foreground mb-2">On-seat Delivery isn&apos;t available</h3>
            <p className="text-[14px] text-muted mb-6 leading-relaxed">
              On-seat Delivery is available only when you have an active movie booking.<br/><br/>
              Book snacks from your movie booking to have them delivered directly to your seat.
            </p>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="flex-1 h-12 rounded-[12px] bg-background border border-border text-foreground hover:bg-[#2A2D36] font-bold flex items-center justify-center gap-2"
                onClick={() => setShowSeatDeliveryDialog(false)}
              >
                Cancel
              </Button>
              <Button 
                className="flex-1 h-12 rounded-[12px] bg-primary text-white hover:bg-[#ff1a46] font-bold flex items-center justify-center gap-2"
                onClick={() => router.push('/bookings')}
              >
                Go to Bookings
              </Button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

