import * as React from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ProgressiveImage } from '@/components/ui/progressive-image';
import { MapPin, Calendar, Clock3, Film, Popcorn } from 'lucide-react';
import { getMovie, getTheatre, getShow } from '@/lib/services/api';
import { mockShows } from '@/lib/services/mockData';
import { Booking, Movie, Theatre, Show } from '@/lib/types/domain';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import { useSafeMotion } from '@/lib/motion';

export interface BookingCardProps extends React.HTMLAttributes<HTMLDivElement> {
  booking: Booking;
  tab: 'upcoming' | 'ongoing' | 'completed';
}

export function BookingCard({ booking, tab, className, ...props }: BookingCardProps) {
  const router = useRouter();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [theatre, setTheatre] = useState<Theatre | null>(null);
  const [show, setShow] = useState<Show | null>(null);
  const [loading, setLoading] = useState(true);
  const { cardPressVariants } = useSafeMotion();

  useEffect(() => {
    const fetchData = async () => {
      const [movieData, theatreData, showData] = await Promise.all([
        booking.movieId ? getMovie(booking.movieId) : Promise.resolve(null),
        booking.theatreId ? getTheatre(booking.theatreId) : Promise.resolve(null),
        booking.showId ? getShow(booking.showId) : Promise.resolve(null),
      ]);
      if (movieData) setMovie(movieData);
      if (theatreData) setTheatre(theatreData);
      if (showData) setShow(showData);
      setLoading(false);
    };
    fetchData();
  }, [booking]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-success/20 text-success';
      case 'cancelled': return 'bg-[#FF5252]/20 text-[#FF5252]';
      case 'confirmed': return 'bg-[#00B0FF]/20 text-[#00B0FF]';
      case 'pending': return 'bg-secondary/20 text-secondary';
      default: return 'bg-[#9498A6]/20 text-muted';
    }
  };

  const formattedSeats = booking.seats?.map(s => s.split('_').pop()).join(', ') || 'N/A';
  const hasSnacks = booking.snackOrder && booking.snackOrder.length > 0;
  const isSnackOnly = booking.orderType === 'snack';
  const snackCount = booking.snackOrder?.length || 0;

  if (loading) {
    return (
      <div className={`rounded-[24px] border border-border bg-surface p-4 flex flex-col gap-4 ${className}`} {...props}>
        <div className="flex gap-4">
          <Skeleton className="h-[120px] w-[84px] rounded-[12px]" />
          <div className="flex flex-1 flex-col justify-center space-y-3">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="h-3 w-2/3" />
            <Skeleton className="h-3 w-1/3 mt-2" />
          </div>
        </div>
        <div className="flex gap-3 pt-4 border-t border-border">
          <Skeleton className="h-[40px] flex-1 rounded-[12px]" />
          <Skeleton className="h-[40px] flex-1 rounded-[12px]" />
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      variants={cardPressVariants}
      whileTap="tap"
      className={`relative overflow-hidden rounded-[24px] border border-border bg-surface p-4 shadow-lg cursor-pointer hover:border-[#9498A6]/50 ${booking.status === 'completed' || booking.status === 'cancelled' ? 'opacity-80 grayscale-[20%]' : ''} ${className}`} 
      onClick={() => router.push(`/bookings/${booking.id}`)}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      {...(props as any)}
    >
      <div className="flex gap-4">
        {/* Poster */}
        <div className="relative h-[120px] w-[84px] shrink-0 rounded-[12px] overflow-hidden bg-[#2A2D36]">
          {isSnackOnly ? (
            theatre?.logoUrl ? (
              <ProgressiveImage src={theatre.logoUrl} alt={theatre.name} className="absolute inset-0 h-full w-full object-contain bg-white" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-[16px] font-bold text-muted">{theatre?.name?.charAt(0) || 'S'}</div>
            )
          ) : (
            movie?.posterUrl ? (
              <ProgressiveImage src={movie.posterUrl} alt={movie.title} className="absolute inset-0 h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-[10px] text-muted">No Poster</div>
            )
          )}
        </div>

        {/* Details */}
        <div className="flex flex-1 flex-col">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-bold text-[16px] leading-tight text-foreground line-clamp-1">
              {isSnackOnly ? 'Snack Order' : movie?.title || 'Unknown Movie'}
            </h3>
            <span className={`shrink-0 rounded-[6px] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${getStatusColor(booking.status)} animate-in fade-in`}>
              {booking.status}
            </span>
          </div>
          
          <div className="mt-1 space-y-1 text-[12px] text-muted">
            <div className="flex items-center gap-1.5 line-clamp-1">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              <span>{theatre?.name || 'Unknown Theatre'}</span>
            </div>
            
            {isSnackOnly ? (
              hasSnacks && (
                <div className="flex items-center gap-3 font-medium text-foreground mt-1 pt-1">
                  <span>{snackCount} Items</span>
                  {booking.fulfilmentMethod && (
                    <>
                      <span>•</span>
                      <span className="capitalize">{booking.fulfilmentMethod.replace('_', ' ')}</span>
                    </>
                  )}
                </div>
              )
            ) : (
              <>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" />{show?.date || 'N/A'}</span>
                  <span className="flex items-center gap-1.5"><Clock3 className="h-3.5 w-3.5" />{show?.startTime || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-3 font-medium text-foreground mt-1">
                  <span className="flex items-center gap-1.5"><Film className="h-3.5 w-3.5 text-muted" />{show?.screen || 'N/A'}</span>
                  <span>•</span>
                  <span>{booking.seats?.length} Seats ({formattedSeats})</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Additional Movie Snacks Info below */}
      {!isSnackOnly && hasSnacks && (
        <div className="mt-3 pt-3 border-t border-border flex items-center justify-between text-[12px] font-medium">
          <span className="flex items-center gap-1.5 text-success"><Popcorn className="h-3.5 w-3.5" /> Pre-ordered Snacks ({snackCount} Items)</span>
          {booking.fulfilmentMethod && <span className="text-muted capitalize">{booking.fulfilmentMethod.replace('_', ' ')}</span>}
        </div>
      )}

      {/* Actions */}
      <div className="mt-4 pt-4 border-t border-border flex flex-col gap-3">
        {(tab === 'upcoming' || tab === 'ongoing') && (
          <div className="flex gap-3">
            <Button 
              variant="outline"
              className="flex-1 h-[40px] text-[13px] font-bold rounded-[12px] border-border text-foreground hover:bg-surface flex items-center justify-center gap-2"
              onClick={(e) => { 
                e.stopPropagation(); 
                router.push(isSnackOnly ? `/theatres/${booking.theatreId}/snacks?bookingId=${booking.id}` : `/theatres/${booking.theatreId}/snacks?fromBooking=true&movieId=${booking.movieId}&showId=${booking.showId}&bookingId=${booking.id}`); 
              }}
              aria-label={hasSnacks ? "Add More Snacks" : "Add Snacks"}
            >
              {hasSnacks ? 'Add More Snacks' : 'Add Snacks'}
            </Button>
            <Button 
              className="flex-1 h-[40px] text-[13px] font-bold rounded-[12px] bg-primary text-white hover:bg-primary/90 flex items-center justify-center gap-2"
              onClick={(e) => { e.stopPropagation(); router.push(`/bookings/${booking.id}`); }}
              aria-label="View Ticket"
            >
              {isSnackOnly ? 'View Order' : 'View Ticket'}
            </Button>
          </div>
        )}
        
        {tab === 'completed' && (
          <div className="flex gap-3">
            {!isSnackOnly && (
              <Button 
                variant="outline"
                className={`h-[40px] text-[13px] font-bold rounded-[12px] border-border text-foreground hover:bg-surface flex-1 flex items-center justify-center gap-2`}
                onClick={(e) => { e.stopPropagation(); router.push(`/movies/${booking.movieId}`); }}
                aria-label="Rate Movie"
              >
                Rate Movie
              </Button>
            )}
            {!isSnackOnly && movie && mockShows.some(s => s.movieId === movie.id && new Date(s.date) >= new Date(new Date().toISOString().split('T')[0])) && (
              <Button 
                className="flex-1 h-[40px] text-[13px] font-bold rounded-[12px] bg-primary text-white hover:bg-primary/90 flex items-center justify-center gap-2"
                onClick={(e) => { e.stopPropagation(); router.push(`/movies/${booking.movieId}`); }}
                aria-label="Book Again"
              >
                Book Again
              </Button>
            )}
            {isSnackOnly && (
              <Button 
                variant="outline"
                className={`h-[40px] text-[13px] font-bold rounded-[12px] border-border text-foreground hover:bg-surface w-full flex items-center justify-center gap-2`}
                onClick={(e) => { e.stopPropagation(); router.push(`/theatres/${booking.theatreId}/snacks`); }}
                aria-label="Order Again"
              >
                Order Again
              </Button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

