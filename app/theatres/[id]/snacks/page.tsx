'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { TopNavigation } from '@/components/ui/top-navigation';
import { Button } from '@/components/ui/button';
import { getSnacksForTheatre, getTheatre, getMovie, getShow } from '@/lib/services/api';
import { Snack, Theatre, Movie, Show } from '@/lib/types/domain';
import { useCartStore } from '@/lib/store/cartStore';
import { SnackCard } from '@/components/ui/snack-card';
import { SearchBar } from '@/components/ui/search-bar';
import { Skeleton } from '@/components/ui/skeleton';
import { MovieInfoCard } from '@/components/ui/movie-info-card';
import { Clock3 } from 'lucide-react';
import { ProgressiveImage } from '@/components/ui/progressive-image';
import { useShallow } from 'zustand/react/shallow';

export default function SnackCataloguePage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const theatreId = params.id as string;
  const fromBooking = searchParams.get('fromBooking') === 'true';
  
  const [snacks, setSnacks] = useState<Snack[]>([]);
  const [theatre, setTheatre] = useState<Theatre | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const [movie, setMovie] = useState<Movie | null>(null);
  const [show, setShow] = useState<Show | null>(null);
  
  // Timer state for reservation banner
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes

  const {
    movieId: cartMovieId,
    showId: cartShowId,
    seats: cartSeats,
    items,
    addSnack,
    updateSnackQuantity,
    getTotalAmount,
    setExistingBooking
  } = useCartStore(
    useShallow((state) => ({
      movieId: state.movieId,
      showId: state.showId,
      seats: state.seats,
      items: state.items,
      addSnack: state.addSnack,
      updateSnackQuantity: state.updateSnackQuantity,
      getTotalAmount: state.getTotalAmount,
      setExistingBooking: state.setExistingBooking
    }))
  );

  const showReservationTimer = Boolean(cartSeats && cartSeats.length > 0);
  useEffect(() => {
    const fetchData = async () => {
      const movieIdParam = searchParams.get('movieId');
      const showIdParam = searchParams.get('showId');
      const bookingIdParam = searchParams.get('bookingId');
      
      const movieId = movieIdParam || cartMovieId;
      const showId = showIdParam || cartShowId;

      if (bookingIdParam) {
        setExistingBooking(bookingIdParam);
      }

      const [snackData, theatreData, movieData, showData] = await Promise.all([
        getSnacksForTheatre(theatreId),
        getTheatre(theatreId),
        movieId ? getMovie(movieId) : Promise.resolve(null),
        showId ? getShow(showId) : Promise.resolve(null)
      ]);
      setSnacks(snackData);
      setTheatre(theatreData || null);
      setMovie(movieData || null);
      setShow(showData || null);
      setLoading(false);
    };
    fetchData();
  }, [theatreId, searchParams, cartMovieId, cartShowId, setExistingBooking]);

  useEffect(() => {
    if (showReservationTimer && timeLeft > 0) {
      const timerId = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timerId);
    }
  }, [showReservationTimer, timeLeft]);

  const categories = ['All', ...Array.from(new Set(snacks.map(s => s.category)))];
  
  const filteredSnacks = snacks.filter(s => {
    const matchesCategory = activeCategory === 'All' || s.category === activeCategory;
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCheckout = () => {
    router.push('/cart');
  };

  const getQuantity = (snackId: string) => {
    return items.find(i => i.snackId === snackId)?.quantity || 0;
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const progressPercentage = (timeLeft / 300) * 100;

  return (
    <main className="min-h-screen bg-background pb-32 text-foreground flex flex-col overflow-x-hidden">
      <TopNavigation title="Order Snacks" showBack />
      
      {/* Sticky Reservation Banner */}
      {showReservationTimer && (
        <div className="sticky top-14 z-20 bg-surface border-b border-border shadow-sm">
          <div className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/10 text-secondary">
                <Clock3 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-[14px] font-bold text-foreground">Seats Reserved</h3>
                <p className="text-[12px] text-secondary font-medium">{formatTime(timeLeft)} remaining</p>
              </div>
            </div>
            <button 
              onClick={handleCheckout}
              className="text-[13px] font-bold text-muted transition-all duration-200 ease-out active:scale-[0.92] bg-[#2A2D36]/50 px-4 py-2 rounded-full"
            >
              Skip Snack
            </button>
          </div>
          {/* Progress Bar */}
          <div className="h-1 w-full bg-[#2A2D36]">
            <div 
              className="h-full bg-secondary transition-all duration-1000 ease-linear" 
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      )}

      <div className={`px-4 mt-4 pt-4 pb-6 flex-1`}>
        {showReservationTimer && timeLeft === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in zoom-in duration-500">
            <div className="relative mb-6 h-28 w-28 overflow-hidden rounded-full border-4 border-border bg-surface shadow-lg flex items-center justify-center">
              <Clock3 className="h-12 w-12 text-[#FF5252] opacity-80" />
            </div>
            <h3 className="text-[20px] font-bold text-foreground">Seat reservation expired</h3>
            <p className="mt-2 mb-8 text-[14px] text-muted px-4 max-w-[280px]">
              Please reselect your seats to continue.
            </p>
            <Button 
              onClick={() => router.push(`/movies/${cartMovieId}/theatres/${theatreId}/shows/${cartShowId}`)}
              className="h-[48px] rounded-[16px] bg-primary px-8 text-[16px] font-bold text-white"
            >
              Reselect Seats
            </Button>
          </div>
        ) : (
          <>
            {fromBooking && movie && show ? (
              <div className="mb-4">
                <MovieInfoCard 
                  title={movie.title}
                  posterUrl={movie.posterUrl}
                  subtitle={theatre?.name}
                  details={
                    <>
                      <span className="rounded bg-[#2A2D36] px-1.5 py-0.5 text-foreground">{show.date}</span>
                      <span className="rounded bg-[#2A2D36] px-1.5 py-0.5 text-foreground">{show.startTime}</span>
                      <span className="rounded bg-[#2A2D36] px-1.5 py-0.5 text-foreground">{movie.language}</span>
                      <span className="rounded bg-[#2A2D36] px-1.5 py-0.5 text-foreground">{show.screen}</span>
                    </>
                  }
                />
              </div>
            ) : (
              <div className="mb-4 flex items-center gap-3 overflow-hidden rounded-[16px] border border-border bg-surface shadow-md p-3">
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-white border border-border">
                  {theatre?.logoUrl ? (
                    <ProgressiveImage src={theatre.logoUrl} alt={theatre.name} className="absolute inset-0 h-full w-full object-contain" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-[#2A2D36] text-[14px] font-bold text-foreground">{theatre?.name?.charAt(0)}</div>
                  )}
                </div>
                <div className="flex flex-col justify-center overflow-hidden">
                  <h2 className="text-[15px] font-bold text-foreground line-clamp-1">{theatre?.name || 'Theatre Snacks'}</h2>
                  <div className="mt-1 flex items-center gap-2 text-[11px] text-muted">
                    <span>2.5 km</span>
                    <span className="h-1 w-1 rounded-full bg-[#9498A6]"></span>
                    <span className="line-clamp-1">{theatre?.availableFacilities?.join(' • ')}</span>
                  </div>
                </div>
              </div>
            )}
            
            {/* Sticky Search Bar */}
            <div className={`sticky ${showReservationTimer ? 'top-[90px]' : 'top-14'} z-10 bg-background py-2`}>
              <SearchBar 
                placeholder="Search for popcorn, cold drinks..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Sticky Categories */}
            <div className={`sticky ${showReservationTimer ? 'top-[154px]' : 'top-[120px]'} z-10 bg-background py-3 -mx-4 px-4`}>
              <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`whitespace-nowrap rounded-full px-4 py-2 text-[13px] font-bold transition-all duration-200 ease-out active:scale-[0.96] ${
                      activeCategory === cat 
                        ? 'bg-primary text-white' 
                        : 'border border-border bg-surface text-muted hover:border-[#9498A6]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

        {/* Snack Grid */}
        <div className="mt-4">
          {loading ? (
             <div className="grid grid-cols-2 gap-3">
               {[...Array(6)].map((_, i) => (
                 <div key={i} className="flex flex-col bg-surface border border-border rounded-[24px] overflow-hidden">
                   <Skeleton className="w-full aspect-square rounded-none" />
                   <div className="p-3 space-y-2">
                     <Skeleton className="h-4 w-3/4" />
                     <Skeleton className="h-3 w-1/2" />
                     <div className="flex justify-between items-center mt-2 pt-2">
                       <Skeleton className="h-4 w-1/4" />
                       <Skeleton className="h-8 w-[60px] rounded-full" />
                     </div>
                   </div>
                 </div>
               ))}
             </div>
          ) : (
            filteredSnacks.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {filteredSnacks.map(snack => (
                  <SnackCard 
                    key={snack.id}
                    name={snack.name}
                    category={snack.category}
                    description={snack.description}
                    price={snack.price}
                    isVeg={snack.isVeg}
                    allergens={snack.allergens}
                    imageUrl={snack.imageUrl}
                    quantity={getQuantity(snack.id)}
                    onAdd={() => addSnack(snack.id, snack.price, theatreId)}
                    onRemove={() => updateSnackQuantity(snack.id, getQuantity(snack.id) - 1)}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-[14px] text-muted">No snacks found for &quot;{searchQuery}&quot;</p>
              </div>
            )
          )}
        </div>
        </>
        )}
      </div>

      {/* Cart Summary / Checkout CTA */}
      {((items.length > 0 || showReservationTimer) && !(showReservationTimer && timeLeft === 0)) && (
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md border-t border-border/50 bg-surface/90 backdrop-blur-md px-4 py-4 pb-safe z-50">
          <div className="flex items-center justify-between">
            <div>
              {items.length > 0 ? (
                <>
                  <div className="text-[12px] text-muted font-medium">{items.reduce((acc, i) => acc + i.quantity, 0)} Item{items.length > 1 ? 's' : ''}</div>
                  <div className="text-[20px] font-bold text-foreground">₹{getTotalAmount()}</div>
                </>
              ) : (
                <div className="text-[14px] text-muted font-medium">Skip snacks?</div>
              )}
            </div>
            <Button 
              className="h-[52px] min-w-[140px] px-8 text-[16px] font-bold rounded-[16px] flex items-center justify-center gap-2"
              onClick={handleCheckout}
            >
              {showReservationTimer && items.length === 0 ? 'Skip & Checkout' : 'View Cart'}
            </Button>
          </div>
        </div>
      )}

      {/* Stand-alone Snacks Counter Pickup Dialog removed (handled in Checkout) */}
    </main>
  );
}

