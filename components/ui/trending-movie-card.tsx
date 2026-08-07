import * as React from 'react';
import { Star, Clock3 } from 'lucide-react';
import { Card, CardContent, CardProps } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ProgressiveImage } from '@/components/ui/progressive-image';

export interface TrendingMovieCardProps extends CardProps {
  title: string;
  genre?: string;
  duration?: string;
  language?: string;
  rating?: string;
  posterUrl?: string;
  onBook?: () => void;
}

export function TrendingMovieCard({ title, genre, duration, language, rating, posterUrl, onBook, onClick, className, ...props }: TrendingMovieCardProps & { onClick?: () => void }) {
  return (
    <Card 
      whileTap="tap"
      className={`flex flex-col h-full overflow-hidden bg-surface border-border p-0 shadow-lg cursor-pointer ${className}`} 
      onClick={onClick}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      {...props}
    >
      {/* Top side: Poster */}
      <div className="relative w-full aspect-video shrink-0 bg-gradient-to-br from-[#FF2A55]/20 to-[#181A20]">
        {posterUrl ? (
          <ProgressiveImage src={posterUrl} alt={title} className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[10px] text-muted">No Poster</div>
        )}
      </div>

      {/* Bottom side: Details */}
      <CardContent className="flex flex-col flex-1 justify-between p-3 space-y-2">
        <div>
          <div className="flex items-start justify-between gap-1">
            <h3 className="font-bold text-[14px] leading-tight text-foreground line-clamp-1">{title}</h3>
            {rating && (
              <div className="shrink-0 flex items-center gap-0.5 rounded bg-background px-1 py-0.5 border border-border">
                <Star className="h-2.5 w-2.5 fill-[#FFD000] text-secondary" />
                <span className="text-[10px] font-bold text-foreground">{rating}</span>
              </div>
            )}
          </div>
          
          <div className="mt-0.5 flex flex-col text-[11px] text-muted">
            {genre && <span className="truncate">{genre}</span>}
            <div className="flex items-center gap-1.5 truncate mt-0.5">
              {language && <span>{language}</span>}
              {language && duration && <span className="h-1 w-1 rounded-full bg-[#2A2D36] shrink-0" />}
              {duration && <span className="flex items-center gap-1 shrink-0"><Clock3 className="h-2.5 w-2.5" />{duration}</span>}
            </div>
          </div>
        </div>

        <Button 
          size="sm" 
          onClick={(e) => {
            e.stopPropagation();
            onBook?.();
          }} 
          className="mt-1 w-full font-bold h-8 text-[12px] rounded-[8px]"
        >
          Book Ticket
        </Button>
      </CardContent>
    </Card>
  );
}

