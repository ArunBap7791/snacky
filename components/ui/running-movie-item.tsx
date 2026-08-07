import * as React from 'react';
import { ProgressiveImage } from '@/components/ui/progressive-image';
import { useRouter } from 'next/navigation';
import { Clock3, Star } from 'lucide-react';
import { Movie, Show } from '@/lib/types/domain';

export interface RunningMovieItemProps {
  movie: Movie;
  shows: Show[];
}

export function RunningMovieItem({ movie, shows }: RunningMovieItemProps) {
  const router = useRouter();

  return (
    <div className="flex gap-4 p-3 bg-surface rounded-[16px] border border-border">
      <div className="relative w-[84px] h-[120px] shrink-0 rounded-[12px] overflow-hidden bg-[#2A2D36]">
        {movie.posterUrl ? (
          <ProgressiveImage src={movie.posterUrl} alt={movie.title} className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-muted">No Poster</div>
        )}
      </div>
      <div className="flex flex-col flex-1">
        <h4 className="font-bold text-[16px] text-foreground line-clamp-1">{movie.title}</h4>
        
        <div className="flex flex-wrap items-center gap-2 mt-1 text-[12px] text-muted">
          {movie.rating && (
             <div className="flex items-center gap-1 rounded bg-[#2A2D36] px-1.5 py-0.5 border border-[#3f4351]">
               <Star className="h-3 w-3 fill-[#FFD000] text-secondary" />
               <span className="font-bold text-foreground">{movie.rating}</span>
             </div>
          )}
          <span>{movie.language}</span>
          <span className="h-1 w-1 rounded-full bg-[#9498A6] shrink-0" />
          <span className="flex items-center gap-1"><Clock3 className="h-3 w-3" />{movie.durationMinutes} min</span>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {shows.map(show => {
            const isHouseFull = show.availability === 'house-full';
            
            let borderTextClass = '';
            if (isHouseFull) {
              borderTextClass = 'bg-surface text-muted border-border opacity-50 cursor-not-allowed';
            } else if (show.availability === 'fast-filling') {
              borderTextClass = 'bg-surface text-[#FF9800] border-[#FF9800]/30 hover:bg-[#FF9800]/10';
            } else {
              borderTextClass = 'bg-surface text-success border-[#00E676]/30 hover:bg-success/10';
            }

            return (
              <button
                key={show.id}
                disabled={isHouseFull}
                onClick={() => !isHouseFull && router.push(`/movies/${movie.id}/theatres/${show.theatreId}/shows/${show.id}`)}
                className={`flex flex-col items-center justify-center px-3 py-1.5 rounded-[8px] transition-all duration-200 ease-out active:scale-[0.98] border min-w-[70px] ${borderTextClass}`}
              >
                <span className="text-[13px] font-bold">{show.startTime}</span>
                {show.screen && <span className="text-[9px] mt-0.5 opacity-80">{show.screen}</span>}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

