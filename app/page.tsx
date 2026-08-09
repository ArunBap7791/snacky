'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { TopNavigation } from '@/components/ui/top-navigation';
import { SearchBar } from '@/components/ui/search-bar';
import { ExperienceSwitcher } from '@/components/ui/experience-switcher';
import { HeroCarousel, Banner } from '@/components/ui/hero-carousel';
import { TrendingMovieCard } from '@/components/ui/trending-movie-card';
import { TheatreCard } from '@/components/ui/theatre-card';
import { UpcomingBookingCard } from '@/components/ui/upcoming-booking-card';
import { EmptyState } from '@/components/ui/empty-state';
import { motion } from 'framer-motion';
import { useSafeMotion } from '@/lib/motion';
import { getMovies, getTheatres, getBanners, getUserBookings, getShow } from '@/lib/services/api';
import { Movie, Theatre, Booking, Show } from '@/lib/types/domain';
import Link from 'next/link';
import { Popcorn, Film, Store } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/lib/store/cartStore';
export default function HomePage() {
  const { chipVariants, pageVariants } = useSafeMotion();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'movies' | 'snacks'>('movies');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('Tamil');
  const [selectedGenre, setSelectedGenre] = useState('Action');

  useEffect(() => {
    const saved = sessionStorage.getItem('homeActiveTab') as 'movies' | 'snacks';
    if (saved) setActiveTab(saved);

    const handleReset = () => {
      setActiveTab('movies');
      setSearchQuery('');
      setSelectedLanguage('Tamil');
      setSelectedGenre('Action');
    };
    window.addEventListener('resetHomeTab', handleReset);
    return () => window.removeEventListener('resetHomeTab', handleReset);
  }, []);
  
  const [movies, setMovies] = useState<Movie[]>([]);
  const [theatres, setTheatres] = useState<Theatre[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [upcomingBooking, setUpcomingBooking] = useState<{ booking: Booking, show?: Show, movie?: Movie, theatre?: Theatre } | null>(null);
  
  const [loading, setLoading] = useState(true);

  const trendingRef = useRef<HTMLDivElement>(null);
  const theatresRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [fetchedMovies, fetchedTheatres, fetchedBanners, fetchedBookings] = await Promise.all([
        getMovies(),
        getTheatres(),
        getBanners(),
        getUserBookings()
      ]);
      setMovies(fetchedMovies);
      setTheatres(fetchedTheatres);
      setBanners(fetchedBanners);
      
      const upcoming = fetchedBookings.find(b => b.status === 'confirmed' && b.orderType !== 'snack');
      if (upcoming && upcoming.showId) {
        const show = await getShow(upcoming.showId);
        const movie = fetchedMovies.find(m => m.id === upcoming.movieId);
        const theatre = fetchedTheatres.find(t => t.id === upcoming.theatreId);
        setUpcomingBooking({ booking: upcoming, show, movie, theatre });
      }
      
      setLoading(false);
    };
    fetchData();
  }, []);

  const filteredMovies = movies.filter(m => 
    m.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredTheatres = theatres.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const languages = ['Tamil', 'Telugu', 'Malayalam', 'Hindi', 'English'];
  const genres = ['Action', 'Crime', 'Sci-Fi', 'Drama', 'Comedy'];

  const filteredTrendingMovies = movies.slice(0, 10);

  const languageMovies = movies.filter(m => m.language === selectedLanguage).slice(0, 5);
  const genreMovies = movies.filter(m => m.genre?.includes(selectedGenre)).slice(0, 5);

  return (
    <main className="min-h-screen bg-background pb-24 text-foreground flex flex-col">
      <TopNavigation 
        location="New Delhi" 
        showNotifications 
        notificationCount={2}
      />

      <motion.main 
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="flex-1 overflow-y-auto"
      >
        <ExperienceSwitcher 
          activeTab={activeTab} 
          onChange={(tab) => { 
            setActiveTab(tab); 
            sessionStorage.setItem('homeActiveTab', tab);
            setSearchQuery(''); 
          }} 
        />

        <div className="px-4 py-4">
          {loading ? (
            <div className="flex h-40 items-center justify-center">
              <span className="text-sm text-muted">Loading...</span>
            </div>
          ) : (
            <>
              {activeTab === 'movies' && (
                <div className="space-y-8 pb-8">
                  {/* Search inside Movies Tab */}
                  <SearchBar 
                    placeholder="Search movies or theatres..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />

                  {searchQuery ? (
                    <div className="space-y-6">
                      {filteredMovies.length > 0 && (
                        <div className="space-y-4">
                          <h3 className="text-[14px] font-bold tracking-tight text-muted">Movies</h3>
                          <div className="grid grid-cols-2 gap-4">
                            {filteredMovies.map(movie => (
                              <Link href={`/movies/${movie.id}`} key={movie.id} className="block w-full">
                                <TrendingMovieCard 
                                  title={movie.title}
                                  genre={movie.genre}
                                  duration={`${movie.durationMinutes} min`}
                                  language={movie.language}
                                  rating={movie.rating?.toString()}
                                  posterUrl={movie.posterUrl}
                                  onBook={() => {
                                    useCartStore.getState().clearCart();
                                    router.push(`/movies/${movie.id}/theatres`);
                                  }}
                                />
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                      {filteredTheatres.length > 0 && (
                        <div className="space-y-4">
                          <h3 className="text-[14px] font-bold tracking-tight text-muted">Theatres</h3>
                          <div className="grid grid-cols-1 gap-4">
                            {filteredTheatres.map(theatre => (
                              <Link href={`/theatres/${theatre.id}`} key={theatre.id} className="block">
                                <TheatreCard 
                                  name={theatre.name}
                                  distance="2.5 km"
                                  formats={theatre.availableFacilities}
                                  ctaLabel="Book Ticket"
                                  onCtaClick={() => {
                                    useCartStore.getState().clearCart();
                                    router.push(`/theatres/${theatre.id}`);
                                  }}
                                  secondaryCtaLabel="Book Snacks"
                                  onSecondaryCtaClick={() => {
                                    useCartStore.getState().clearCart();
                                    router.push(`/theatres/${theatre.id}/snacks`);
                                  }}
                                />
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                      {filteredMovies.length === 0 && filteredTheatres.length === 0 && (
                        <EmptyState 
                          title="No movies found" 
                          description="Try adjusting your search to find what you're looking for." 
                          image={<Image src="/assets/Corny%20Bombs/Corny%20Confused.png" alt="No movies found" fill className="object-contain" />} 
                        />
                      )}
                    </div>
                  ) : (
                    <>
                      {/* Hero Carousel */}
                      <div className="-mx-4">
                        <HeroCarousel banners={banners} />
                      </div>

                      {/* Trending Movies */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-[18px] font-bold text-foreground tracking-tight">Trending Movies</h3>
                          <span onClick={() => router.push('/movies')} className="text-[12px] font-bold text-muted hover:text-foreground transition-colors cursor-pointer active:scale-95">View All &gt;</span>
                        </div>
                        {filteredTrendingMovies.length > 0 ? (
                          <div className="relative">
                            <div ref={trendingRef} className="-mx-4 flex overflow-x-auto px-4 pb-2 snap-x snap-mandatory scrollbar-hide space-x-4 scroll-fade-x" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                              {filteredTrendingMovies.map(movie => (
                                <div key={movie.id} className="w-[164px] md:w-[200px] shrink-0 snap-center">
                                  <TrendingMovieCard 
                                    title={movie.title}
                                    genre={movie.genre}
                                    duration={`${movie.durationMinutes} min`}
                                    language={movie.language}
                                    rating={movie.rating?.toString()}
                                    posterUrl={movie.posterUrl}
                                    onClick={() => {
                                      useCartStore.getState().clearCart();
                                      router.push(`/movies/${movie.id}`);
                                    }}
                                    onBook={() => {
                                      useCartStore.getState().clearCart();
                                      router.push(`/movies/${movie.id}/theatres`);
                                    }}
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <EmptyState 
                            title="No movies found" 
                            description="Try selecting another language or genre." 
                            image={<Image src="/assets/Corny%20Bombs/Corny%20Confused.png" alt="No movies found" fill className="object-contain" />} 
                          />
                        )}

                        {/* Languages */}
                        <div className="pt-2 space-y-4">
                          <h3 className="text-[18px] font-bold text-foreground tracking-tight">Languages</h3>
                          <div className="-mx-4 flex overflow-x-auto px-4 pb-1 scrollbar-hide gap-3 scroll-fade-x snap-x scroll-pl-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                            {languages.map(lang => (
                              <motion.button
                                variants={chipVariants}
                                whileHover="hover"
                                whileTap="tap"
                                key={lang}
                                onClick={() => setSelectedLanguage(lang)}
                                className={`whitespace-nowrap snap-start rounded-full px-5 h-10 flex items-center justify-center text-[13px] font-bold border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                                  selectedLanguage === lang 
                                    ? 'bg-[#F4F5F7] text-[#0D0E12] border-[#F4F5F7]' 
                                    : 'border-border bg-surface text-muted hover:border-[#9498A6] hover:text-foreground'
                                }`}
                              >
                                {lang}
                              </motion.button>
                            ))}
                          </div>
                          {selectedLanguage && languageMovies.length > 0 && (
                            <div className="relative mt-2">
                              <div className="-mx-4 flex overflow-x-auto px-4 pb-2 snap-x snap-mandatory scrollbar-hide space-x-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                                {languageMovies.map(movie => (
                                  <div key={movie.id} className="w-[164px] md:w-[200px] shrink-0 snap-center">
                                    <TrendingMovieCard 
                                      title={movie.title}
                                      genre={movie.genre}
                                      duration={`${movie.durationMinutes} min`}
                                      language={movie.language}
                                      rating={movie.rating?.toString()}
                                      posterUrl={movie.posterUrl}
                                      onClick={() => {
                                        useCartStore.getState().clearCart();
                                        router.push(`/movies/${movie.id}`);
                                      }}
                                      onBook={() => {
                                        useCartStore.getState().clearCart();
                                        router.push(`/movies/${movie.id}/theatres`);
                                      }}
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Genres */}
                        <div className="pb-4 space-y-4">
                          <h3 className="text-[18px] font-bold text-foreground tracking-tight">Genres</h3>
                          <div className="-mx-4 flex overflow-x-auto px-4 pb-1 scrollbar-hide gap-3 scroll-fade-x snap-x scroll-pl-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                            {genres.map(genre => (
                              <motion.button
                                variants={chipVariants}
                                whileHover="hover"
                                whileTap="tap"
                                key={genre}
                                onClick={() => setSelectedGenre(genre)}
                                className={`whitespace-nowrap snap-start rounded-full px-5 h-10 flex items-center justify-center text-[13px] font-bold border ${
                                  selectedGenre === genre 
                                    ? 'bg-[#F4F5F7] text-[#0D0E12] border-[#F4F5F7] shadow-[0_4px_12px_rgba(244,245,247,0.15)]' 
                                    : 'border-border bg-surface text-muted hover:border-[#9498A6] hover:text-foreground'
                                }`}
                              >
                                {genre}
                              </motion.button>
                            ))}
                          </div>
                          {selectedGenre && genreMovies.length > 0 && (
                            <div className="relative mt-2">
                              <div className="-mx-4 flex overflow-x-auto px-4 pb-2 snap-x snap-mandatory scrollbar-hide space-x-4 scroll-fade-x" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                                {genreMovies.map(movie => (
                                  <div key={movie.id} className="w-[164px] md:w-[200px] shrink-0 snap-center">
                                    <TrendingMovieCard 
                                      title={movie.title}
                                      genre={movie.genre}
                                      duration={`${movie.durationMinutes} min`}
                                      language={movie.language}
                                      rating={movie.rating?.toString()}
                                      posterUrl={movie.posterUrl}
                                      onClick={() => {
                                        useCartStore.getState().clearCart();
                                        router.push(`/movies/${movie.id}`);
                                      }}
                                      onBook={() => {
                                        useCartStore.getState().clearCart();
                                        router.push(`/movies/${movie.id}/theatres`);
                                      }}
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                        {/* Theatres Near You */}
                        <div className="pt-2 space-y-4">
                          <div className="flex items-center justify-between">
                            <h3 className="text-[18px] font-bold text-foreground tracking-tight">Theatres Near You</h3>
                            <span onClick={() => router.push('/theatres')} className="text-[12px] font-bold text-muted hover:text-foreground transition-colors cursor-pointer active:scale-95">View All &gt;</span>
                          </div>
                          <div className="relative">
                            <div ref={theatresRef} className="-mx-4 flex overflow-x-auto px-4 pb-2 snap-x snap-mandatory scrollbar-hide space-x-4 items-stretch" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                              {theatres.map(theatre => (
                                <Link href={`/theatres/${theatre.id}`} key={theatre.id} className="w-[300px] shrink-0 snap-center block h-full">
                                  <TheatreCard 
                                    name={theatre.name}
                                    distance="2.5 km"
                                    formats={theatre.availableFacilities}
                                    ctaLabel="Book Tickets"
                                    onCtaClick={() => {
                                      useCartStore.getState().clearCart();
                                      router.push(`/theatres/${theatre.id}`);
                                    }}
                                  />
                                </Link>
                              ))}
                            </div>
                          </div>
                        </div>
                      </>
                  )}
                </div>
              )}

              {activeTab === 'snacks' && (
                <div className="space-y-8 pb-6">
                  {/* Section 1 */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-[18px] font-bold tracking-tight text-foreground">Book Snacks for your Upcoming Shows</h3>
                      <p className="text-[14px] text-muted mt-1">Pre-book your favorite snacks and get them delivered to your seat.</p>
                    </div>

                    {upcomingBooking ? (
                      <div className="-mx-4 flex overflow-x-auto px-4 pb-2 snap-x snap-mandatory scrollbar-hide space-x-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                        <UpcomingBookingCard 
                          movieName={upcomingBooking.movie?.title || 'Unknown Movie'}
                          theatreName={upcomingBooking.theatre?.name || 'Unknown Theatre'}
                          date={upcomingBooking.show?.date || 'Today'}
                          time={upcomingBooking.show?.startTime || '10:00'}
                          posterUrl={upcomingBooking.movie?.posterUrl}
                          status={upcomingBooking.booking.status}
                          hasSnacks={upcomingBooking.booking.snackOrder && upcomingBooking.booking.snackOrder.length > 0}
                          fulfilmentMethod={upcomingBooking.booking.fulfilmentMethod}
                          onBookSnacks={() => {
                            useCartStore.getState().clearCart();
                            router.push(`/theatres/${upcomingBooking.theatre?.id}/snacks?fromBooking=true&fromUpcoming=true&movieId=${upcomingBooking.movie?.id}&showId=${upcomingBooking.show?.id}&bookingId=${upcomingBooking.booking.id}`);
                          }}
                          onViewTicket={() => {
                            router.push(`/bookings/${upcomingBooking.booking.id}`);
                          }}
                        />
                      </div>
                    ) : (
                      <EmptyState 
                        title="No Upcoming Shows" 
                        description="Book a movie ticket first to pre-order snacks directly to your seat." 
                        image={<Image src="/assets/Corny%20Bombs/Corny%20Confused.png" alt="No Upcoming Shows" fill className="object-contain" />} 
                        action={
                          <button 
                            onClick={() => setActiveTab('movies')}
                            className="rounded-[12px] bg-primary px-6 py-3 text-[14px] font-bold text-white transition-all active:scale-[0.96]"
                            aria-label="Book Tickets"
                          >
                            Book Tickets
                          </button>
                        }
                      />
                    )}
                  </div>

                  {/* Section 2 */}
                  <div className="flex flex-col flex-1">
                    <div className="pt-6 border-t border-border mb-6">
                      <h3 className="text-[18px] font-bold text-foreground tracking-tight">No booking in Snacky?</h3>
                      <p className="text-[14px] text-muted mt-1">Book snacks for other shows by selecting a theatre.</p>
                    </div>
                    
                    <div className="sticky top-0 z-20 bg-background pb-6">
                      <SearchBar 
                        placeholder="Search Theatre" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-4 min-h-[400px] content-start">
                      {filteredTheatres.length > 0 ? (
                        filteredTheatres.map(theatre => (
                          <div 
                            key={theatre.id}
                            className="cursor-pointer"
                            onClick={() => {
                              useCartStore.getState().clearCart();
                              router.push(`/theatres/${theatre.id}/snacks`);
                            }}
                          >
                            <TheatreCard 
                              name={theatre.name}
                              distance="2.5 km"
                              logoUrl={theatre.logoUrl}
                              formats={theatre.availableFacilities}
                              ctaLabel="Order Snacks"
                            />
                          </div>
                        ))
                      ) : searchQuery ? (
                        <EmptyState 
                          title="No theatres found" 
                          description="We couldn't find any theatres matching your search." 
                          image={<Image src="/assets/Corny%20Bombs/Corny%20Confused.png" alt="No theatres found" fill className="object-contain" />} 
                        />
                      ) : null}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </motion.main>

    </main>
  );
}

