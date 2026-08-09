'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { TopNavigation } from '@/components/ui/top-navigation';
import { getTheatre, getMovies } from '@/lib/services/api';
import { mockShows } from '@/lib/services/mockData';
import { Theatre, Movie, Show } from '@/lib/types/domain';
import { RunningMovieItem } from '@/components/ui/running-movie-item';
import { EmptyState } from '@/components/ui/empty-state';
import { MapPin, Film, Star } from 'lucide-react';
import { ProgressiveImage } from '@/components/ui/progressive-image';
import { Badge } from '@/components/ui/badge';

export default function TheatreDetailsPage() {
  const params = useParams();
  const theatreId = params.id as string;

  const [theatre, setTheatre] = useState<Theatre | null>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [fetchedTheatre, fetchedMovies] = await Promise.all([
        getTheatre(theatreId),
        getMovies(),
      ]);
      setTheatre(fetchedTheatre || null);
      setMovies(fetchedMovies);
      setLoading(false);
    };
    fetchData();
  }, [theatreId]);

  if (loading) {
    return (
      <main className="min-h-screen bg-background pb-24 text-foreground flex flex-col">
        <TopNavigation title="Theatre Details" showBack />
        <div className="flex h-40 items-center justify-center">
          <span className="text-sm text-muted">Loading...</span>
        </div>
      </main>
    );
  }

  if (!theatre) {
    return (
      <main className="min-h-screen bg-background pb-24 text-foreground flex flex-col">
        <TopNavigation title="Theatre Details" showBack />
        <EmptyState title="Theatre not found" description="The theatre you are looking for does not exist." image={<Image src="/assets/Corny%20Bombs/Corny%20Confused.png" alt="Theatre not found" fill className="object-contain" />} />
      </main>
    );
  }

  // Aggregate running movies
  const theatreShows = mockShows.filter(s => s.theatreId === theatre.id);
  const uniqueMovieIds = Array.from(new Set(theatreShows.map(s => s.movieId)));
  
  const runningMovies = uniqueMovieIds.map(movieId => {
    const movie = movies.find(m => m.id === movieId);
    const showsForMovie = theatreShows.filter(s => s.movieId === movieId);
    return movie ? { movie, shows: showsForMovie } : null;
  }).filter(Boolean) as { movie: Movie, shows: Show[] }[];

  const allFacilities = [...(theatre.availableFacilities || []), ...(theatre.hallFeatures || [])];

  return (
    <main className="min-h-screen bg-background pb-24 text-foreground flex flex-col">
      <TopNavigation showBack />
      
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="px-4 py-4 border-b border-border space-y-4">
          <div className="flex items-start gap-4">
            {theatre.logoUrl ? (
              <div className="relative h-[64px] w-[64px] shrink-0 overflow-hidden rounded-[16px] bg-white border-[1.5px] border-border">
                <ProgressiveImage src={theatre.logoUrl} alt={theatre.name} className="absolute inset-0 h-full w-full object-contain p-2" />
              </div>
            ) : (
              <div className="flex h-[64px] w-[64px] shrink-0 items-center justify-center rounded-[16px] border-[1.5px] border-border bg-[#2A2D36] text-[20px] font-bold text-foreground">
                {theatre.name.charAt(0)}
              </div>
            )}
            <div className="flex flex-col justify-center min-h-[64px]">
              <h1 className="text-[20px] font-bold leading-tight tracking-tight">{theatre.name}</h1>
              <div className="mt-1.5 flex flex-col gap-1 text-[13px] text-muted">
                <span className="flex items-start gap-1.5">
                  <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{theatre.address || "Address not available"}</span>
                </span>
                <span className="flex items-center gap-1.5 font-medium text-secondary">
                  <Star className="h-4 w-4 fill-[#FFD000]" />
                  4.5 / 5 • 2.5 km away
                </span>
              </div>
            </div>
          </div>
          
          {/* Facilities */}
          {allFacilities.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {allFacilities.map(facility => (
                <Badge key={facility} variant="secondary" className="bg-surface border-border text-foreground px-3 py-1 rounded-full text-[11px] font-bold pointer-events-none">
                  {facility}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Running Movies */}
        <div className="px-4 py-6">
          <h2 className="text-[18px] font-bold tracking-tight text-foreground mb-4">Now Showing</h2>
          
          {runningMovies.length > 0 ? (
            <div className="flex flex-col gap-4">
              {runningMovies.map(({ movie, shows }) => (
                <RunningMovieItem key={movie.id} movie={movie} shows={shows} />
              ))}
            </div>
          ) : (
            <EmptyState 
              title="No movies running" 
              description="There are currently no movies running at this theatre." 
              image={<Image src="/assets/Corny%20Bombs/Corny%20Confused.png" alt="No movies running" fill className="object-contain" />} 
            />
          )}
        </div>
      </div>
    </main>
  );
}

