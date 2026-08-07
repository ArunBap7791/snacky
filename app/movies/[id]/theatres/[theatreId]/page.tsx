'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { TopNavigation } from '@/components/ui/top-navigation';
import { getShowsForMovieAndTheatre, getTheatre } from '@/lib/services/api';
import { Show, Theatre } from '@/lib/types/domain';
import { motion } from 'framer-motion';
import { useSafeMotion } from '@/lib/motion';

export default function ShowSelectionPage() {
  const params = useParams();
  const router = useRouter();
  const movieId = params.id as string;
  const theatreId = params.theatreId as string;
  const { chipVariants } = useSafeMotion();
  
  const [shows, setShows] = useState<Show[]>([]);
  const [theatre, setTheatre] = useState<Theatre | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShows = async () => {
      const [showData, theatreData] = await Promise.all([
        getShowsForMovieAndTheatre(movieId, theatreId),
        getTheatre(theatreId)
      ]);
      setShows(showData);
      setTheatre(theatreData || null);
      setLoading(false);
    };
    fetchShows();
  }, [movieId, theatreId]);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <TopNavigation title="Select Show Time" showBack />
      
      <div className="px-4 py-6">
        <h2 className="text-[20px] font-semibold">{theatre?.name || 'Theatre'}</h2>
        <p className="text-[14px] text-muted mt-1">{theatre?.address}</p>

        <div className="mt-8">
          <h3 className="text-[16px] font-medium mb-4">Today</h3>
          {loading ? (
             <div className="text-muted">Loading shows...</div>
          ) : shows.length > 0 ? (
            <div className="grid grid-cols-3 gap-3">
              {shows.map(show => (
                <motion.button
                  variants={chipVariants}
                  whileHover="hover"
                  whileTap="tap"
                  key={show.id}
                  onClick={() => router.push(`/movies/${movieId}/theatres/${theatreId}/shows/${show.id}`)}
                  className="rounded-[16px] border border-border bg-surface py-3 text-center transition-colors hover:border-primary hover:text-primary"
                >
                  <span className="block text-[16px] font-bold">{show.startTime}</span>
                  <span className="block text-[11px] text-muted mt-1">{show.screen}</span>
                </motion.button>
              ))}
            </div>
          ) : (
            <div className="text-muted">No shows available today.</div>
          )}
        </div>
      </div>
    </main>
  );
}

