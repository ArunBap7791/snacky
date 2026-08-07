'use client';

import { useEffect, useState } from 'react';
import { ProgressiveImage } from '@/components/ui/progressive-image';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { TopNavigation } from '@/components/ui/top-navigation';
import { useCartStore } from '@/lib/store/cartStore';
import { getBooking, getMovie, getTheatre, getShow, getSnacksForTheatre } from '@/lib/services/api';
import { mockShows } from '@/lib/services/mockData';
import { Booking, Movie, Theatre, Show, Snack } from '@/lib/types/domain';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { HelpCircle, RotateCcw, Check, CircleDot, Share2, Home, Popcorn } from 'lucide-react';
import { BookingSummaryCard, BookingSummaryData } from '@/components/ui/booking-summary-card';
import { resolveBookingSnacks } from '@/lib/utils/resolveBookingSnacks';
import { motion } from 'framer-motion';
import { fadeUpVariants } from '@/lib/motion';

export default function BookingDetailsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const bookingId = params.id as string;
  const from = searchParams.get('from');
  
  const [booking, setBooking] = useState<Booking | null>(null);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [theatre, setTheatre] = useState<Theatre | null>(null);
  const [show, setShow] = useState<Show | null>(null);
  const [availableSnacks, setAvailableSnacks] = useState<Snack[]>([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchData = async () => {
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
      }
      setLoading(false);
    };
    fetchData();
  }, [bookingId]);

  if (loading) {
    return (
      <main className="min-h-screen bg-background pb-32">
        <TopNavigation title="Booking Details" showBack />
        <div className="px-4 py-6 mt-14 space-y-6">
          <div className="rounded-[24px] border border-border bg-surface p-6 shadow-lg flex flex-col gap-4">
            <Skeleton className="h-5 w-1/3 mb-2" />
            <div className="flex gap-4">
              <Skeleton className="h-[120px] w-[84px] rounded-[12px]" />
              <div className="flex flex-1 flex-col space-y-3">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-1/3" />
              </div>
            </div>
          </div>
          <Skeleton className="h-[150px] w-full rounded-[24px]" />
          <Skeleton className="h-[200px] w-full rounded-[24px]" />
        </div>
      </main>
    );
  }

  if (!booking) {
    return (
      <main className="min-h-screen bg-background pb-32 flex flex-col">
        <TopNavigation title="Booking Details" showBack />
        <div className="flex-1 flex items-center justify-center pt-20">
          <div className="text-center px-4">
            <h3 className="text-xl font-bold text-foreground">Booking Not Found</h3>
            <p className="mt-2 text-muted">The booking you are looking for does not exist or has been removed.</p>
            <Button 
              className="mt-6 bg-primary text-white rounded-full px-8 font-bold"
              onClick={() => router.push('/bookings')}
            >
              Go to My Bookings
            </Button>
          </div>
        </div>
      </main>
    );
  }

  const hasSnacks = booking.snackOrder && booking.snackOrder.length > 0;
  const isSnackOnly = booking.orderType === 'snack';
  const ticketTotal = isSnackOnly ? 0 : (booking.seats?.length || 0) * 250;
  
  const snackTotal = hasSnacks ? booking.snackOrder!.reduce((acc, s) => acc + (s.quantity * s.unitPrice), 0) : 0;
  const fee = isSnackOnly ? 0 : 30;
  const deliveryFee = booking.fulfilmentMethod === 'seat_delivery' ? 50 : 0;
  const grandTotal = ticketTotal + snackTotal + fee + deliveryFee;
  const rewardPoints = Math.floor(grandTotal / 10); // 10% points earned

  // Mock timeline status determination
  const getTimelineStep = () => {
    if (booking.status === 'completed') return 4;
    if (booking.status === 'cancelled') return -1;
    // For mock ongoing status, just assume step 2 or 3 based on random or specific logic
    // We will hardcode step 2 for "confirmed" to show active timeline
    return 2; 
  };
  const currentStep = getTimelineStep();

  const timelineSteps = [
    { title: isSnackOnly ? 'Order Confirmed' : 'Booking Confirmed', subtitle: isSnackOnly ? 'Your order is placed' : 'Your ticket is secured' },
    { title: 'Preparing Snacks', subtitle: 'We are getting your order ready' },
    { title: booking.fulfilmentMethod === 'seat_delivery' ? 'Out for Delivery' : 'Ready for Pickup', subtitle: booking.fulfilmentMethod === 'seat_delivery' ? 'Heading to your seat' : 'Collect at the counter' },
    { title: booking.fulfilmentMethod === 'seat_delivery' ? 'Delivered' : 'Picked Up', subtitle: isSnackOnly ? 'Enjoy your snacks!' : 'Enjoy your movie!' }
  ];

  const summaryData: BookingSummaryData = {
    id: booking.id,
    status: booking.status,
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
    <main className="min-h-screen bg-background pb-32 text-foreground">
      <TopNavigation title={isSnackOnly ? "Order Details" : "Booking Details"} showBack={from !== 'success'} />
      
      <motion.div 
        className="px-4 py-6 mt-14 space-y-6"
        initial="initial"
        animate="animate"
        variants={{
          initial: {},
          animate: { transition: { staggerChildren: 0.15 } }
        }}
      >
        
        {/* Main Ticket Card */}
        <motion.div variants={fadeUpVariants} className="relative">
          {/* QR and OTP Section */}
          {!isSnackOnly && booking.status !== 'completed' && booking.status !== 'cancelled' && (
            <div className="mb-6 flex flex-col items-center">
              <div className="h-40 w-40 bg-white p-2 rounded-[16px] shadow-inner mb-6 relative overflow-hidden flex items-center justify-center border-4 border-border">
                <div className="grid grid-cols-4 grid-rows-4 gap-1 w-full h-full opacity-20 pointer-events-none absolute inset-0 p-2">
                  {Array.from({length: 16}).map((_, i) => (
                    <div key={i} className="bg-black rounded-sm" style={{ opacity: Math.random() > 0.5 ? 1 : 0 }} />
                  ))}
                </div>
                <ProgressiveImage src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=snacky-booking" alt="QR Code" width={130} height={130} className="w-[130px] h-[130px]" />
              </div>
              <p className="text-[13px] text-muted font-medium uppercase tracking-wider mb-1">Entry & Pickup OTP</p>
              <div className="text-[32px] font-black tracking-[0.2em] text-secondary">{booking.otp}</div>
            </div>
          )}

          <BookingSummaryCard data={summaryData} className="w-full" />
        </motion.div>

        {/* Track Order Timeline */}
        {booking.status !== 'cancelled' && hasSnacks && (
          <motion.div variants={fadeUpVariants} className="rounded-[24px] border border-border bg-surface p-6 shadow-lg">
            <h3 className="font-bold text-[16px] tracking-tight text-foreground mb-6">Track Order</h3>
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-[13px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-[#FF2A55] before:to-[#2A2D36]">
              {timelineSteps.map((step, index) => {
                const stepNum = index + 1;
                const isCompleted = currentStep > stepNum;
                const isCurrent = currentStep === stepNum;

                // Skip non-snack steps for snack-only orders if needed
                if (isSnackOnly && index === 0) return null;

                return (
                  <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className={`flex items-center justify-center w-7 h-7 rounded-full border-4 border-[#181A20] shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 transition-colors duration-500
                      ${isCompleted ? 'bg-primary' : isCurrent ? 'bg-secondary animate-pulse' : 'bg-[#2A2D36]'}`}>
                      {isCompleted ? <Check className="w-3 h-3 text-white" /> : isCurrent ? <CircleDot className="w-3 h-3 text-[#181A20]" /> : null}
                    </div>
                    <div className="w-[calc(100%-2rem)] md:w-[calc(50%-2.5rem)] ml-4 md:ml-0">
                      <div className={`flex flex-col ${isCompleted ? 'opacity-100' : isCurrent ? 'opacity-100 scale-[1.02] transform transition-transform' : 'opacity-40'}`}>
                        <h4 className={`font-bold text-[14px] ${isCurrent ? 'text-secondary' : 'text-foreground'}`}>{step.title}</h4>
                        <p className="text-[12px] text-muted">{step.subtitle}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            </motion.div>
        )}

        {/* Snack Summary & Payment */}
        <motion.div variants={fadeUpVariants} className="rounded-[24px] border border-border bg-surface p-6 shadow-lg space-y-4">
          {/* Snacks */}
          {hasSnacks && (
            <div>
              <h4 className="flex items-center gap-2 text-[14px] font-bold tracking-tight text-foreground mb-3">
                <Popcorn className="h-4 w-4 text-primary" /> {isSnackOnly ? 'Order Items' : 'Snack Order'}
              </h4>
              <div className="space-y-2 text-[13px]">
                <div className="flex items-center justify-between">
                  <span className="text-muted">{booking.snackOrder!.reduce((acc, s) => acc + s.quantity, 0)} Items</span>
                  <span className="font-medium">₹{snackTotal}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted">Delivery Method</span>
                  <span className="font-medium capitalize">{booking.fulfilmentMethod?.replace('_', ' ')}</span>
                </div>
              </div>
            </div>
          )}

          {/* Payment */}
          <div className={hasSnacks ? "pt-6 border-t border-border" : ""}>
            <h4 className="text-[14px] font-bold tracking-tight text-foreground mb-3">Payment Summary</h4>
            <div className="space-y-2 text-[13px]">
              {!isSnackOnly && (
                <div className="flex justify-between">
                  <span className="text-muted">Tickets ({booking.seats?.length})</span>
                  <span className="font-medium">₹{ticketTotal}</span>
                </div>
              )}
              {hasSnacks && (
                <div className="flex justify-between">
                  <span className="text-muted">Snacks</span>
                  <span className="font-medium">₹{snackTotal}</span>
                </div>
              )}
              {!isSnackOnly && (
                <div className="flex justify-between">
                  <span className="text-muted">Convenience Fee</span>
                  <span className="font-medium">₹{fee}</span>
                </div>
              )}
              {deliveryFee > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted">Delivery Fee</span>
                  <span className="font-medium">₹{deliveryFee}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-border pt-3 text-[16px] font-bold text-foreground">
                <span>Total Paid</span>
                <span>₹{grandTotal}</span>
              </div>
              <div className="flex justify-between items-center bg-secondary/10 rounded-[8px] p-3 mt-3 border border-secondary/20">
                <span className="text-secondary font-bold">Reward Points Earned</span>
                <span className="text-secondary font-black">+{rewardPoints} XP</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={fadeUpVariants} className="flex flex-col gap-3">
          {from === 'success' ? (
            <>
              {!isSnackOnly && (
                <Button className="w-full h-[52px] text-[15px] font-bold rounded-[16px] bg-primary text-white flex items-center justify-center gap-2">
                  <Share2 className="w-4 h-4" /> Share Ticket
                </Button>
              )}
              <Button 
                className="w-full h-[52px] text-[15px] font-bold rounded-[16px] bg-transparent border border-border text-foreground hover:bg-[#2A2D36]/50 flex items-center justify-center gap-2"
                onClick={() => router.push('/')}
              >
                <Home className="w-4 h-4" /> Go Home
              </Button>
            </>
          ) : (
            booking.status !== 'completed' && booking.status !== 'cancelled' ? (
              <>
                {!isSnackOnly && (
                  <Button className="w-full h-[52px] text-[15px] font-bold rounded-[16px] bg-primary text-white flex items-center justify-center gap-2">
                    <Share2 className="w-4 h-4" /> Share Ticket
                  </Button>
                )}
                <Button 
                  className={`w-full h-[52px] text-[15px] font-bold rounded-[16px] flex items-center justify-center gap-2 ${isSnackOnly ? 'bg-primary text-white' : 'bg-transparent border border-border text-foreground hover:bg-[#2A2D36]/50'}`}
                  onClick={() => {
                    useCartStore.getState().clearCart();
                    router.push(isSnackOnly ? `/theatres/${booking.theatreId}/snacks?bookingId=${booking.id}` : `/theatres/${booking.theatreId}/snacks?fromBooking=true&movieId=${booking.movieId}&showId=${booking.showId}&bookingId=${booking.id}`);
                  }}
                >
                  <Popcorn className={`w-4 h-4 ${isSnackOnly ? '' : 'text-secondary'}`} /> {hasSnacks ? (isSnackOnly ? 'Order More' : 'Add Snacks') : 'Order Snacks'}
                </Button>
              </>
            ) : (
              booking.status === 'completed' && movie && !isSnackOnly && mockShows.some(s => s.movieId === movie.id && new Date(s.date) >= new Date(new Date().toISOString().split('T')[0])) && (
                <Button 
                  className="w-full h-[52px] text-[15px] font-bold rounded-[16px] bg-transparent border border-primary text-primary hover:bg-primary/10 flex items-center justify-center gap-2"
                  onClick={() => router.push(`/movies/${booking.movieId}`)}
                >
                  <RotateCcw className="w-4 h-4" /> Book Again
                </Button>
              )
            )
          )}
          <Button variant="ghost" className="w-full h-[40px] text-[13px] font-bold text-muted hover:bg-transparent hover:text-foreground mt-1 transition-colors flex items-center justify-center gap-2">
            <HelpCircle className="w-4 h-4" /> Need Help
          </Button>
        </motion.div>

      </motion.div>
    </main>
  );
}

