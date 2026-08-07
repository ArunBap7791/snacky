'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { TopNavigation } from '@/components/ui/top-navigation';
import { Button } from '@/components/ui/button';
import { getMovie, getMovies } from '@/lib/services/api';
import { Movie } from '@/lib/types/domain';
import { ProgressiveImage } from '@/components/ui/progressive-image';
import { Play, Star, Ticket, Loader2, X } from 'lucide-react';
import { BottomSheet } from '@/components/ui/bottom-sheet';
import { TrendingMovieCard } from '@/components/ui/trending-movie-card';
import { Skeleton } from '@/components/ui/skeleton';
import { useCartStore } from '@/lib/store/cartStore';

export default function MovieDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const movieId = params.id as string;
  
  const [movie, setMovie] = useState<Movie | null>(null);
  const [recommended, setRecommended] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [isNavigating, setIsNavigating] = useState(false);
  const [showFullStory, setShowFullStory] = useState(false);
  const [showReviewsSheet, setShowReviewsSheet] = useState(false);
  const [reviewSort, setReviewSort] = useState('Most Relevant');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [showReviewSuccess, setShowReviewSuccess] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getMovie(movieId);
      if (data) setMovie(data);
      
      if (data?.moreLikeThis && data.moreLikeThis.length > 0) {
        const allMovies = await getMovies();
        const similar = allMovies.filter(m => data.moreLikeThis?.includes(m.id));
        setRecommended(similar);
      }
      setLoading(false);
    };
    fetchData();
  }, [movieId]);

  const handleBookTickets = () => {
    setIsNavigating(true);
    useCartStore.getState().clearCart();
    router.push(`/movies/${movieId}/theatres`);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-background pb-[100px] overflow-x-hidden">
        <TopNavigation showBack />
        <Skeleton className="w-full aspect-video rounded-none mt-14" />
        <div className="px-4 mt-6 space-y-8">
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-6 w-1/3" />
            <div className="flex gap-4">
              <Skeleton className="h-16 w-16 rounded-full" />
              <Skeleton className="h-16 w-16 rounded-full" />
              <Skeleton className="h-16 w-16 rounded-full" />
            </div>
          </div>
        </div>
      </main>
    );
  }
  if (!movie) return <div className="min-h-screen bg-background flex items-center justify-center text-foreground">Movie not found</div>;

  const truncateStory = movie.description && movie.description.length > 100 && !showFullStory;

  return (
    <main className="min-h-screen bg-background pb-[100px] text-foreground overflow-x-hidden">
      <TopNavigation showBack />
      
      {/* Cinematic Trailer Preview */}
      <div className="relative w-full aspect-video bg-surface">
        {movie.trailerUrl ? (
          <ProgressiveImage 
            src={movie.trailerUrl} 
            alt={movie.title} 
            className="absolute inset-0 h-full w-full object-cover opacity-80"
          />
        ) : movie.posterUrl ? (
          <ProgressiveImage 
            src={movie.posterUrl} 
            alt={movie.title} 
            className="absolute inset-0 h-full w-full object-cover opacity-80"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[#2A2D36]">
            No Trailer
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0E12] via-transparent to-[#0D0E12]/50" />
        
        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <button 
            className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm border border-white/40 shadow-lg transition-all duration-200 ease-out active:scale-[0.92]"
            aria-label="Play Trailer"
          >
            <Play className="h-6 w-6 text-white ml-1 fill-white" />
          </button>
        </div>

        {/* Info Overlay */}
        <div className="absolute bottom-4 left-4 right-4 flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2 text-[12px] font-bold">
            {movie.certification && (
              <span className="flex h-[28px] items-center justify-center rounded-[6px] bg-surface/90 px-2.5 backdrop-blur-sm border border-border text-foreground shadow-sm">
                {movie.certification}
              </span>
            )}
            {movie.rating && (
              <span className="flex h-[28px] items-center gap-1 rounded-[6px] bg-surface/90 px-2.5 backdrop-blur-sm border border-border text-foreground shadow-sm">
                <Star className="h-3.5 w-3.5 fill-[#FFD000] text-secondary" /> {movie.rating}
              </span>
            )}
            <span className="flex h-[28px] items-center justify-center rounded-[6px] bg-surface/90 px-2.5 backdrop-blur-sm border border-border text-foreground shadow-sm">
              {movie.durationMinutes} min
            </span>
            <span className="flex h-[28px] items-center justify-center rounded-[6px] bg-surface/90 px-2.5 backdrop-blur-sm border border-border text-foreground shadow-sm">
              {movie.language}
            </span>
            {movie.genre.split(',').map(g => (
              <span key={g} className="flex h-[28px] items-center justify-center rounded-[6px] bg-surface/90 px-2.5 backdrop-blur-sm border border-border text-foreground shadow-sm">
                {g.trim()}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 mt-6 space-y-8">
        
        {/* Title & Story */}
        <section className="space-y-3">
          <h1 className="text-[24px] font-bold tracking-tight leading-tight text-foreground">{movie.title}</h1>
          <div className="mt-3 text-[14px] leading-relaxed text-muted">
            <p>
              {truncateStory ? `${movie.description?.substring(0, 100)}...` : movie.description}
            </p>
            {movie.description && movie.description.length > 100 && (
              <button 
                onClick={() => setShowFullStory(!showFullStory)}
                className="mt-1 font-bold text-primary active:opacity-70 transition-opacity"
              >
                {showFullStory ? 'Show Less' : 'Read More'}
              </button>
            )}
          </div>
        </section>

        {/* Cast & Crew */}
        {movie.castAndCrew && movie.castAndCrew.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-[18px] font-bold tracking-tight text-foreground">Cast & Crew</h2>
            <div className="-mx-4 flex overflow-x-auto px-4 pb-2 scrollbar-hide space-x-4 snap-x snap-mandatory" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {movie.castAndCrew.map(person => (
                <div key={person.id} className="flex w-[80px] shrink-0 snap-start flex-col items-center text-center gap-2">
                  <div className="relative h-[80px] w-[80px] overflow-hidden rounded-full border-[1.5px] border-border bg-[#2A2D36] shadow-sm">
                    {person.photoUrl ? (
                      <ProgressiveImage src={person.photoUrl} alt={person.name} className="absolute inset-0 h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center font-bold text-[18px] text-muted bg-surface">{person.name.charAt(0)}</div>
                    )}
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold leading-tight text-foreground line-clamp-2">{person.name}</p>
                    <p className="text-[11px] text-muted line-clamp-1 mt-0.5">{person.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Reviews */}
        {movie.reviews && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h2 className="text-[18px] font-bold tracking-tight text-foreground">Reviews</h2>
                <button 
                  onClick={() => setShowReviewsSheet(true)}
                  className="text-[12px] font-bold text-primary active:opacity-70 transition-opacity"
                >
                  Read All
                </button>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-gradient-to-r from-[#FFD000]/10 to-transparent border border-secondary/20 px-3 py-1 text-[14px]">
                <Star className="h-4 w-4 fill-[#FFD000] text-secondary" />
                <span className="font-black text-foreground">{movie.reviews.overallRating}</span>
                <span className="text-[12px] text-muted font-medium">({movie.reviews.totalCount})</span>
              </div>
            </div>
            
            <div className="flex overflow-x-auto pb-4 scrollbar-hide space-x-4 snap-x snap-mandatory" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {movie.reviews.userReviews.slice(0, 3).map(review => (
                <div key={review.id} className="w-[280px] shrink-0 snap-start rounded-[16px] bg-surface border border-border p-4 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="relative h-10 w-10 overflow-hidden rounded-full bg-[#2A2D36] border border-border">
                      {review.userAvatar ? (
                        <ProgressiveImage src={review.userAvatar} alt={review.userName} className="absolute inset-0 h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center font-bold text-[14px] text-muted bg-background">{review.userName.charAt(0)}</div>
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-[14px] text-foreground">{review.userName}</p>
                      <div className="flex items-center gap-1 text-secondary mt-0.5">
                        <Star className="h-3 w-3 fill-[#FFD000]" />
                        <span className="text-[12px] font-bold">{review.rating}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-[13px] text-muted line-clamp-3 leading-relaxed">{review.text}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-[16px] bg-surface border border-border p-5 shadow-sm">
              <h3 className="text-[16px] font-bold text-foreground mb-4 text-center tracking-tight">Rate & Review</h3>
              <div className="flex justify-center gap-0.5 mb-5 overflow-x-auto scrollbar-hide max-w-full px-4 py-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 transition-transform active:scale-90 focus:outline-none flex h-9 w-9 shrink-0 items-center justify-center rounded-full hover:bg-[#2A2D36]/50"
                  >
                    <Star 
                      className={`h-7 w-7 transition-colors ${
                        star <= (hoverRating || rating) 
                          ? 'fill-[#FFD000] text-secondary' 
                          : 'text-[#2A2D36] fill-transparent'
                      }`} 
                    />
                  </button>
                ))}
              </div>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Share your experience about this movie..."
                className="w-full bg-background border border-border rounded-[12px] p-4 text-[14px] text-foreground placeholder-[#9498A6] focus:outline-none focus:border-primary resize-none h-[100px] mb-4 transition-colors"
              />
              <button 
                disabled={rating === 0 || reviewText.trim() === ''}
                onClick={() => {
                  setShowReviewSuccess(true);
                  setRating(0);
                  setReviewText('');
                  setTimeout(() => setShowReviewSuccess(false), 3000);
                }}
                className="w-full rounded-[12px] h-12 bg-primary text-[14px] font-bold text-white transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
              >
                Post Review
              </button>
            </div>
          </section>
        )}

        {/* More Like This */}
        {recommended.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-[18px] font-bold tracking-tight text-foreground">More Like This</h2>
            <div className="-mx-4 flex overflow-x-auto px-4 pb-2 snap-x snap-mandatory scrollbar-hide space-x-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {recommended.map(rec => (
                <div key={rec.id} className="w-[164px] shrink-0 snap-center">
                  <TrendingMovieCard 
                    title={rec.title}
                    genre={rec.genre}
                    duration={`${rec.durationMinutes} min`}
                    language={rec.language}
                    rating={rec.rating?.toString()}
                    posterUrl={rec.posterUrl}
                    onBook={() => router.push(`/movies/${rec.id}`)}
                  />
                </div>
              ))}
            </div>
          </section>
        )}

      </div>

      {/* Fixed Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-border/50 bg-surface/90 backdrop-blur-xl px-4 py-4 pb-safe z-40 shadow-[0_-8px_24px_rgba(0,0,0,0.5)]">
        <Button 
          className="w-full h-[52px] text-[16px] font-bold rounded-[12px] flex items-center justify-center shadow-md transition-transform active:scale-[0.98] gap-2 bg-primary text-white hover:bg-primary/90"
          onClick={handleBookTickets}
          disabled={isNavigating}
          aria-label="Book Tickets"
        >
          {isNavigating ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <>
              <Ticket className="h-5 w-5" />
              <span>Book Tickets</span>
            </>
          )}
        </Button>
      </div>

      <BottomSheet open={showReviewsSheet} onClose={() => setShowReviewsSheet(false)} className="h-[85vh] flex flex-col p-0">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between border-b border-border px-4 pb-4 shrink-0 mt-2">
            <div>
              <h3 className="text-[20px] font-bold text-foreground tracking-tight">All Reviews</h3>
              <div className="flex items-center gap-1.5 mt-1 text-[14px]">
                <Star className="h-4 w-4 fill-[#FFD000] text-secondary" />
                <span className="font-bold text-foreground">{movie.reviews?.overallRating}</span>
                <span className="text-muted">({movie.reviews?.totalCount})</span>
              </div>
            </div>
          <button 
            onClick={() => setShowReviewsSheet(false)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2A2D36] text-foreground active:scale-95 transition-transform hover:bg-[#9498A6]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="flex gap-2 overflow-x-auto px-4 py-4 shrink-0 border-b border-border/50 scrollbar-hide">
          {['Most Relevant', 'Latest', 'Highest Rating', 'Lowest Rating'].map(sort => (
            <button 
              key={sort}
              onClick={() => setReviewSort(sort)}
              className={`whitespace-nowrap px-5 h-10 flex items-center justify-center rounded-full text-[13px] font-bold transition-colors ${
                reviewSort === sort 
                  ? 'bg-[#F4F5F7] text-[#0D0E12] shadow-[0_4px_12px_rgba(244,245,247,0.15)]' 
                  : 'bg-surface text-muted border border-border hover:text-foreground'
              }`}
            >
              {sort}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {movie.reviews?.userReviews.map(review => (
            <div key={review.id} className="rounded-[16px] bg-surface border border-border p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="relative h-10 w-10 overflow-hidden rounded-full bg-[#2A2D36]">
                  {review.userAvatar ? (
                    <ProgressiveImage src={review.userAvatar} alt={review.userName} className="absolute inset-0 h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center font-bold text-[14px] text-foreground">{review.userName.charAt(0)}</div>
                  )}
                </div>
                <div>
                  <p className="font-bold text-[14px] text-foreground">{review.userName}</p>
                  <div className="flex items-center gap-1 text-secondary">
                    <Star className="h-3 w-3 fill-[#FFD000]" />
                    <span className="text-[12px] font-bold">{review.rating}</span>
                  </div>
                </div>
              </div>
              <p className="text-[13px] text-[#E0E2E9] leading-relaxed">{review.text}</p>
            </div>
          ))}
        </div>
      </div>
      </BottomSheet>
      
      {/* Review Success Dialog */}
      {showReviewSuccess && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-surface border border-[#00E676] rounded-[16px] px-6 py-4 shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
          <div className="h-8 w-8 rounded-full bg-success/20 flex items-center justify-center shrink-0">
            <Star className="h-4 w-4 fill-[#00E676] text-success" />
          </div>
          <div>
            <h4 className="font-bold text-foreground text-[14px]">Review Posted!</h4>
            <p className="text-[12px] text-muted">Thank you for your feedback.</p>
          </div>
        </div>
      )}
    </main>
  );
}

