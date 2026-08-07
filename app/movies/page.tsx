'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TopNavigation } from '@/components/ui/top-navigation';
import { SearchBar } from '@/components/ui/search-bar';
import { TrendingMovieCard } from '@/components/ui/trending-movie-card';
import { EmptyState } from '@/components/ui/empty-state';
import { getMovies } from '@/lib/services/api';
import { Movie } from '@/lib/types/domain';
import { Film } from 'lucide-react';

export default function MoviesListingPage() {
  const router = useRouter();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      const fetchedMovies = await getMovies();
      setMovies(fetchedMovies);
      setLoading(false);
    };
    fetchMovies();
  }, []);

  const filteredMovies = movies.filter(m => 
    m.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-background pb-24 text-foreground flex flex-col">
      <TopNavigation title="Movies" showBack />

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
        <SearchBar 
          placeholder="Search movies..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {loading ? (
          <div className="flex h-40 items-center justify-center">
            <span className="text-sm text-muted">Loading...</span>
          </div>
        ) : filteredMovies.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {filteredMovies.map(movie => (
              <TrendingMovieCard 
                key={movie.id}
                title={movie.title}
                genre={movie.genre}
                duration={`${movie.durationMinutes} min`}
                language={movie.language}
                rating={movie.rating?.toString()}
                posterUrl={movie.posterUrl}
                onClick={() => router.push(`/movies/${movie.id}`)}
                onBook={() => router.push(`/movies/${movie.id}/theatres`)}
              />
            ))}
          </div>
        ) : (
          <EmptyState 
            title="No movies found" 
            description="Try adjusting your search to find what you're looking for." 
            icon={<Film className="h-8 w-8" />} 
          />
        )}
      </div>
    </main>
  );
}

