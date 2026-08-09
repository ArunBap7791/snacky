'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { TopNavigation } from '@/components/ui/top-navigation';
import { SearchBar } from '@/components/ui/search-bar';
import { TheatreCard } from '@/components/ui/theatre-card';
import { EmptyState } from '@/components/ui/empty-state';
import { getTheatres, getMovies } from '@/lib/services/api';
import { Theatre, Movie, Show } from '@/lib/types/domain';
import { mockShows } from '@/lib/services/mockData';
import { Store } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/lib/store/cartStore';

export default function TheatresListingPage() {
  const router = useRouter();
  const [theatres, setTheatres] = useState<Theatre[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [fetchedTheatres, fetchedMovies] = await Promise.all([
        getTheatres(),
        getMovies(),
      ]);
      setTheatres(fetchedTheatres);
      setMovies(fetchedMovies);
      setLoading(false);
    };
    fetchData();
  }, []);

  const filteredTheatres = theatres.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-background pb-24 text-foreground flex flex-col">
      <TopNavigation title="Theatres" showBack />

      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        <SearchBar 
          placeholder="Search theatres..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {loading ? (
          <div className="flex h-40 items-center justify-center">
            <span className="text-sm text-muted">Loading...</span>
          </div>
        ) : filteredTheatres.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {filteredTheatres.map(theatre => {
              // Aggregate running movies for this theatre
              const theatreShows = mockShows.filter(s => s.theatreId === theatre.id);
              const uniqueMovieIds = Array.from(new Set(theatreShows.map(s => s.movieId)));
              
              const runningMovies = uniqueMovieIds.map(movieId => {
                const movie = movies.find(m => m.id === movieId);
                const showsForMovie = theatreShows.filter(s => s.movieId === movieId);
                return movie ? { movie, shows: showsForMovie } : null;
              }).filter(Boolean) as { movie: Movie, shows: Show[] }[];

              return (
                <div 
                  key={theatre.id} 
                  className="cursor-pointer"
                  onClick={() => {
                    useCartStore.getState().clearCart();
                    router.push(`/theatres/${theatre.id}`);
                  }}
                >
                  <TheatreCard 
                    name={theatre.name}
                    distance="2.5 km"
                    logoUrl={theatre.logoUrl}
                    formats={theatre.availableFacilities}
                    hallFeatures={theatre.hallFeatures}
                    runningMovies={runningMovies}
                  />
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState 
            title="No theatres found" 
            description="We couldn't find any theatres matching your search or filters." 
            image={<Image src="/assets/Corny%20Bombs/Corny%20Confused.png" alt="No theatres found" fill className="object-contain" />} 
          />
        )}
      </div>
    </main>
  );
}

