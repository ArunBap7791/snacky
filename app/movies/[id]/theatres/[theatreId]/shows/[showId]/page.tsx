'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { TopNavigation } from '@/components/ui/top-navigation';
import { Button } from '@/components/ui/button';
import { getSeatsForShow, getMovie, getTheatre } from '@/lib/services/api';
import { Seat, Movie, Theatre } from '@/lib/types/domain';
import { useCartStore } from '@/lib/store/cartStore';
import { Skeleton } from '@/components/ui/skeleton';
import { MovieInfoCard } from '@/components/ui/movie-info-card';
import { Ticket, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSafeMotion, motionDuration, motionEase, fadeUpVariants } from '@/lib/motion';

export default function SeatSelectionPage() {
  const params = useParams();
  const router = useRouter();
  const movieId = params.id as string;
  const theatreId = params.theatreId as string;
  const showId = params.showId as string;
  
  const [seats, setSeats] = useState<Seat[]>([]);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [theatre, setTheatre] = useState<Theatre | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [loading, setLoading] = useState(true);
  const [isNavigating, setIsNavigating] = useState(false);

  const setBookingDetails = useCartStore(state => state.setBookingDetails);
  const { prefersReducedMotion, pageVariants } = useSafeMotion();

  // Load selected seats from sessionStorage on mount
  useEffect(() => {
    const saved = sessionStorage.getItem('snacky-seat-selection');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.movieId === movieId && parsed.theatreId === theatreId && parsed.showId === showId) {
          // Temporarily store just IDs, will match with full objects once seats data loads
          if (parsed.seats && Array.isArray(parsed.seats)) {
            // we will set them once seats are fetched
            sessionStorage.setItem('snacky-seat-selection-temp', JSON.stringify(parsed.seats));
          }
        } else {
          sessionStorage.removeItem('snacky-seat-selection');
        }
      } catch {}
    }
  }, [movieId, theatreId, showId]);

  useEffect(() => {
    const fetchData = async () => {
      const [seatsData, movieData, theatreData] = await Promise.all([
        getSeatsForShow(showId),
        getMovie(movieId),
        getTheatre(theatreId)
      ]);
      setSeats(seatsData);
      setMovie(movieData || null);
      setTheatre(theatreData || null);
      setLoading(false);

      // Restore seats if any
      const tempSaved = sessionStorage.getItem('snacky-seat-selection-temp');
      if (tempSaved) {
        try {
          const seatIds: string[] = JSON.parse(tempSaved);
          const restored = seatsData.filter(s => seatIds.includes(s.id) && s.status === 'available');
          setSelectedSeats(restored);
        } catch {}
        sessionStorage.removeItem('snacky-seat-selection-temp');
      }
    };
    fetchData();
  }, [showId, movieId, theatreId]);

  // Save selected seats to sessionStorage
  useEffect(() => {
    if (selectedSeats.length > 0) {
      sessionStorage.setItem('snacky-seat-selection', JSON.stringify({
        movieId, theatreId, showId, seats: selectedSeats.map(s => s.id)
      }));
    } else {
      sessionStorage.removeItem('snacky-seat-selection');
    }
  }, [selectedSeats, movieId, theatreId, showId]);

  const toggleSeat = (seat: Seat) => {
    if (seat.status !== 'available') return;
    
    setSelectedSeats(prev => {
      const isSelected = prev.find(s => s.id === seat.id);
      if (isSelected) return prev.filter(s => s.id !== seat.id);
      return [...prev, seat];
    });
  };

  const handleContinue = () => {
    if (selectedSeats.length === 0) return;
    setIsNavigating(true);
    setBookingDetails(movieId, theatreId, showId, selectedSeats.map(s => s.id));
    
    router.push(`/theatres/${theatreId}/snacks?fromBooking=true`);
  };

  const totalPrice = selectedSeats.reduce((acc, s) => acc + s.price, 0);

  return (
    <main className="min-h-screen bg-background pb-[100px] text-foreground overflow-x-hidden">
      <TopNavigation title="Select Seats" showBack />
      
      <motion.div 
        variants={pageVariants}
        initial="initial"
        animate="animate"
        className="px-4 pb-6"
      >
        {/* Movie Information Header */}
        {movie && theatre && (
          <div className="mb-6">
            <MovieInfoCard 
              title={movie.title}
              posterUrl={movie.posterUrl}
              subtitle={theatre.name}
              details={
                <>
                  <span className="bg-[#2A2D36] px-2 py-0.5 rounded-[4px]">{movie.language}</span>
                  <span className="bg-[#2A2D36] px-2 py-0.5 rounded-[4px]">2D</span>
                </>
              }
            />
          </div>
        )}

        {/* Screen Indicator */}
        <div className="mb-14 mt-10 text-center relative">
          <div className="mx-auto h-[40px] w-[85%] rounded-[50%] border-t-[3px] border-primary/50 opacity-80"></div>
          <span className="text-[12px] uppercase tracking-widest text-muted font-bold relative -top-3">Screen This Way</span>
        </div>

          {loading ? (
          <div className="flex flex-col gap-6 overflow-x-auto pb-4 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <div className="min-w-max space-y-4 px-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center justify-center gap-2">
                  <span className="w-6 text-center text-[12px] font-bold text-muted"></span>
                  <div className="flex gap-2">
                    {[...Array(10)].map((_, j) => (
                      <Skeleton key={j} className="h-10 w-10 min-w-[40px] rounded-t-[12px]" />
                    ))}
                  </div>
                  <span className="w-6 text-center text-[12px] font-bold text-muted"></span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-6 overflow-x-auto pb-4 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <div className="min-w-max space-y-4 px-2 mx-auto">
              {['A', 'B', 'C', 'D', 'E'].map(row => (
                <div key={row} className="flex items-center justify-center gap-2">
                  <div className="flex gap-2">
                    {seats.filter(s => s.seatNumber.startsWith(row)).sort((a,b) => a.seatNumber.localeCompare(b.seatNumber, undefined, { numeric: true })).map((seat, index, arr) => {
                      const isSelected = selectedSeats.some(s => s.id === seat.id);
                      const isWalkway = index === Math.floor(arr.length / 2);
                      let bgColor = 'bg-[#2A2D36]';
                      let borderColor = 'border-[#3f4351]';
                      let textColor = 'text-foreground';
                      let opacity = 'opacity-100';
                      
                      if (seat.status === 'booked') {
                        bgColor = 'bg-[#1C1E26]';
                        borderColor = 'border-border';
                        textColor = 'text-[#5A5D6B] line-through'; 
                        opacity = 'opacity-80';
                      } else if (seat.status === 'blocked') {
                        bgColor = 'bg-surface';
                        borderColor = 'border-border';
                        textColor = 'text-[#40434f] text-transparent line-through decoration-[#40434f]';
                      } else if (isSelected) {
                        bgColor = 'bg-primary';
                        borderColor = 'border-primary';
                        textColor = 'text-white';
                      }

                      return (
                        <div key={seat.id} className="flex gap-2">
                          {isWalkway && <div className="w-8 shrink-0 flex items-center justify-center"><span className="text-[10px] text-[#2A2D36] rotate-90 whitespace-nowrap">WALKWAY</span></div>}
                          <motion.button
                            disabled={seat.status !== 'available'}
                            onClick={() => toggleSeat(seat)}
                            whileTap={seat.status === 'available' && !prefersReducedMotion ? { scale: 0.97 } : undefined}
                            animate={isSelected ? { scale: 1.02, backgroundColor: '#FF2A55', borderColor: '#FF2A55', color: '#fff' } : undefined}
                            transition={{ duration: motionDuration.fast, ease: motionEase.standard }}
                            className={`flex h-10 w-10 min-w-[40px] items-center justify-center rounded-t-[12px] border-b-[3px] text-[11px] font-bold outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 focus-visible:ring-offset-background ${bgColor} ${borderColor} ${textColor} ${opacity}`}
                            aria-label={`Seat ${seat.seatNumber} ${seat.status === 'available' ? 'Available' : 'Booked'} ${isSelected ? 'Selected' : ''}`}
                            aria-pressed={isSelected}
                          >
                            {seat.seatNumber}
                          </motion.button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Improved Legend */}
        <motion.div 
          variants={fadeUpVariants}
          initial="initial"
          animate="animate"
          className="mt-10 flex flex-nowrap items-center justify-center overflow-x-auto scrollbar-hide text-[11px] font-bold text-muted bg-surface p-4 rounded-[16px] border border-border w-full max-w-full mx-auto gap-8"
        >
          <div className="flex items-center gap-2 shrink-0">
            <div className="h-5 w-5 rounded-t-[6px] border-b-[3px] border-[#3f4351] bg-[#2A2D36]"></div>
            <span className="text-foreground">Available</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <div className="h-5 w-5 rounded-t-[6px] border-b-[3px] border-primary bg-primary"></div>
            <span className="text-primary">Selected</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <div className="h-5 w-5 rounded-t-[6px] border-b-[3px] border-border bg-[#1C1E26] flex items-center justify-center">
              <span className="text-[10px] text-[#5A5D6B] line-through opacity-50">/</span>
            </div>
            <span>Occupied</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Improved Fixed Bottom CTA */}
      <AnimatePresence>
        {selectedSeats.length > 0 && (
          <motion.div 
            initial={prefersReducedMotion ? { opacity: 0 } : { y: '100%' }}
            animate={prefersReducedMotion ? { opacity: 1 } : { y: 0 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { y: '100%' }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 border-t border-border/50 bg-surface/90 backdrop-blur-md px-4 py-4 pb-safe z-50 shadow-[0_-8px_32px_rgba(0,0,0,0.15)]"
          >
            <div className="flex items-center justify-between gap-4 max-w-md mx-auto">
          <div className="flex-1">
            <div className="text-[13px] text-muted font-medium">
              Selected Seats: {selectedSeats.length}
            </div>
            <div className="text-[20px] font-bold text-foreground">₹{totalPrice}</div>
          </div>
          <Button 
            className="h-[52px] min-w-[140px] px-6 text-[16px] font-bold rounded-[16px] flex items-center justify-center gap-2 bg-primary text-white hover:bg-primary/90"
            onClick={handleContinue}
            disabled={isNavigating}
            aria-label="Continue to Snack Ordering"
          >
            {isNavigating ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <Ticket className="h-5 w-5" />
                Continue
              </>
            )}
          </Button>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
    </main>
  );
}

