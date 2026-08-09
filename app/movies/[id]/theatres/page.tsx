'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { TopNavigation } from '@/components/ui/top-navigation';
import { TheatreCard } from '@/components/ui/theatre-card';
import { EmptyState } from '@/components/ui/empty-state';
import { MovieInfoCard } from '@/components/ui/movie-info-card';
import { getTheatres, getShowsForMovieAndTheatre, getMovie } from '@/lib/services/api';
import { Theatre, Show, Movie } from '@/lib/types/domain';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import { useSafeMotion } from '@/lib/motion';
import { CalendarX } from 'lucide-react';

// Helper to get dates
const getNextDays = (count: number) => {
  const days = [];
  const today = new Date();
  for (let i = 0; i < count; i++) {
    const nextDate = new Date(today);
    nextDate.setDate(today.getDate() + i);
    days.push({
      date: nextDate,
      isoDate: nextDate.toISOString().split('T')[0],
      dayName: i === 0 ? 'Today' : nextDate.toLocaleDateString('en-US', { weekday: 'short' }),
      dateNumber: nextDate.getDate(),
      month: nextDate.toLocaleDateString('en-US', { month: 'short' })
    });
  }
  return days;
};

export default function MovieTheatresPage() {
  const router = useRouter();
  const params = useParams();
  const { chipVariants } = useSafeMotion();
  const movieId = params.id as string;
  
  const [theatres, setTheatres] = useState<Theatre[]>([]);
  const [showsMap, setShowsMap] = useState<Record<string, Show[]>>({});
  const [loading, setLoading] = useState(true);
  
  const dates = getNextDays(6);
  const [selectedDate, setSelectedDate] = useState(dates[0].isoDate);

  const [movie, setMovie] = useState<Movie | null>(null);
  
  useEffect(() => {
    const fetchTheatresAndShows = async () => {
      const fetchedMovie = await getMovie(movieId);
      if (fetchedMovie) setMovie(fetchedMovie);

      const fetchedTheatres = await getTheatres();
      
      const showsData: Record<string, Show[]> = {};
      await Promise.all(fetchedTheatres.map(async (theatre) => {
        const shows = await getShowsForMovieAndTheatre(movieId, theatre.id);
        showsData[theatre.id] = shows;
      }));

      setTheatres(fetchedTheatres);
      setShowsMap(showsData);
      setLoading(false);
    };
    fetchTheatresAndShows();
  }, [movieId]);

  const activeTheatres = theatres.filter(t => {
    const theatreShows = showsMap[t.id] || [];
    return theatreShows.some(s => s.date === selectedDate);
  });

  return (
    <main className="min-h-screen bg-background text-foreground">
      <TopNavigation title="Select Theatre & Show" showBack />
      
      <div className="pt-2 pb-6">
        
        {/* Movie Info Card */}
        {movie && (
          <div className="px-4 mb-6">
            <MovieInfoCard 
              title={movie.title}
              posterUrl={movie.posterUrl}
              subtitle={`${movie.language} • ${movie.durationMinutes} min`}
              details={`${movie.genre} • ${movie.releaseYear || new Date().getFullYear()}`}
            />
          </div>
        )}
        
        {/* Date Selector */}
        <div className="px-4 py-4 border-b border-border">
          <h3 className="text-[14px] font-bold tracking-tight text-foreground mb-3">Select Date</h3>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 snap-x snap-mandatory scroll-fade-x" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {dates.map((d) => {
              const isSelected = selectedDate === d.isoDate;
              return (
                <motion.button
                  variants={chipVariants}
                  whileHover="hover"
                  whileTap="tap"
                  key={d.isoDate}
                  onClick={() => setSelectedDate(d.isoDate)}
                  className={`flex flex-col items-center justify-center shrink-0 w-[64px] h-[72px] rounded-[16px] border snap-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                    isSelected 
                      ? 'bg-primary border-primary text-white' 
                      : 'bg-surface border-border text-muted'
                  }`}
                  aria-label={`Select date ${d.dayName} ${d.dateNumber}`}
                  aria-pressed={isSelected}
                >
                  <span className="text-[12px] font-medium">{d.dayName}</span>
                  <span className={`text-[18px] font-bold mt-0.5 ${isSelected ? 'text-white' : 'text-foreground'}`}>{d.dateNumber}</span>
                  <span className="text-[10px] uppercase mt-0.5">{d.month}</span>
                </motion.button>
              );
            })}
          </div>
        </div>

        <div className="flex-1 px-4 py-6">
          <h2 className="text-[18px] font-bold tracking-tight mb-4 text-foreground">Available Theatres</h2>
          
          {loading ? (
             <div className="flex flex-col gap-5">
               {[...Array(3)].map((_, i) => (
                 <div key={i} className="flex flex-col bg-surface border border-border rounded-[24px] p-4">
                   <div className="flex items-center gap-3 mb-4">
                     <Skeleton className="h-10 w-10 rounded-full" />
                     <div className="space-y-2 flex-1">
                       <Skeleton className="h-4 w-1/2" />
                       <Skeleton className="h-3 w-1/4" />
                     </div>
                   </div>
                   <div className="space-y-3">
                     <Skeleton className="h-6 w-3/4" />
                     <Skeleton className="h-8 w-full" />
                   </div>
                 </div>
               ))}
             </div>
          ) : activeTheatres.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 content-start">
              {activeTheatres.map(theatre => {
                const theatreShows = showsMap[theatre.id] || [];
                const filteredShows = theatreShows.filter(s => s.date === selectedDate);
                const formattedShowTimes = filteredShows.map(s => ({ 
                  id: s.id, 
                  time: s.startTime,
                  screen: s.screen,
                  availability: s.availability
                }));

                return (
                  <TheatreCard 
                    key={theatre.id}
                    name={theatre.name}
                    distance="2.5 km"
                    formats={theatre.availableFacilities}
                    hallFeatures={theatre.hallFeatures}
                    showTimes={formattedShowTimes}
                    onShowTimeSelect={(id) => router.push(`/movies/${movieId}/theatres/${theatre.id}/shows/${id}`)}
                  />
                );
              })}
            </div>
          ) : (
            <EmptyState 
              title="No shows available" 
              description="There are no shows available for the selected date and filters." 
              image={<Image src="/assets/Corny%20Bombs/Corny%20Confused.png" alt="No shows available" fill className="object-contain" />} 
            />
          )}
        </div>
      </div>
    </main>
  );
}

