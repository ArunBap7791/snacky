import * as React from 'react';
import { MapPin, Clock3 } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { ProgressiveImage } from '@/components/ui/progressive-image';
import { Card, CardContent, CardHeader, CardTitle, CardProps } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Movie, Show } from '@/lib/types/domain';
import { RunningMovieItem } from '@/components/ui/running-movie-item';

export interface TheatreCardProps extends CardProps {
  name: string;
  distance?: string;
  formats?: string[];
  hallFeatures?: string[];
  languages?: string[];
  showTimes?: (string | { id: string, time: string, screen?: string, availability?: 'available' | 'fast-filling' | 'house-full' })[];
  selectedShowTimeId?: string;
  onShowTimeSelect?: (id: string) => void;
  logoUrl?: string;
  ctaLabel?: string;
  onCtaClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  secondaryCtaLabel?: string;
  onSecondaryCtaClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  runningMovies?: { movie: Movie; shows: Show[] }[];
  compactMode?: boolean;
}

function TheatreCard({ name, distance, formats, hallFeatures, languages, showTimes, selectedShowTimeId, onShowTimeSelect, logoUrl, ctaLabel = 'Select Theatre', onCtaClick, secondaryCtaLabel, onSecondaryCtaClick, runningMovies, compactMode, className, ...props }: TheatreCardProps) {
  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Card className={`overflow-hidden border-border bg-surface rounded-[24px] p-0 flex flex-col ${className}`} {...props}>
      <CardHeader className="p-4 pb-3 shrink-0">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            {logoUrl ? (
              <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-white border border-border">
                <ProgressiveImage src={logoUrl} alt={name} className="absolute inset-0 h-full w-full object-contain" />
              </div>
            ) : (
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#2A2D36] text-[12px] font-bold text-foreground">
                {name.charAt(0)}
              </div>
            )}
            <div>
              <CardTitle className="line-clamp-1 text-[16px] leading-tight tracking-tight text-foreground">{name}</CardTitle>
              <div className="mt-1 flex items-center gap-2 text-[12px] text-muted">
              {distance ? <><MapPin className="h-4 w-4" />{distance}</> : null}
            </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 px-4 pb-4 pt-0 flex-1 flex flex-col">
        <div className="flex-1 space-y-3">
          <div className="flex flex-wrap gap-2">
            {formats?.map((format) => <span key={format} className="inline-flex items-center justify-center rounded-full bg-surface border border-border px-3 py-1 text-[11px] font-bold text-foreground">{format}</span>)}
            {hallFeatures?.map((feature) => <span key={feature} className="inline-flex items-center justify-center rounded-full bg-surface border border-border px-3 py-1 text-[11px] font-bold text-foreground">{feature}</span>)}
            {languages?.map((language) => <span key={language} className="inline-flex items-center justify-center rounded-full bg-surface border border-border px-3 py-1 text-[11px] font-bold text-foreground">{language}</span>)}
          </div>
          
          {showTimes && showTimes.length > 0 && (
            <div className="mt-3">
              <div className="flex items-center gap-1.5 text-[12px] font-medium text-muted mb-3">
                <Clock3 className="h-3.5 w-3.5" /> Show Times
              </div>
              <div className="flex flex-wrap gap-2.5">
                {showTimes.map((st, i) => {
                  const isObj = typeof st === 'object';
                  const id = isObj ? st.id : `st-${i}`;
                  const time = isObj ? st.time : st;
                  const screen = isObj && st.screen ? st.screen : undefined;
                  const availability = isObj && st.availability ? st.availability : 'available';
                  const isSelected = selectedShowTimeId === id;
                  const isHouseFull = availability === 'house-full';
                  
                  let borderTextClass = '';
                  if (isHouseFull) {
                    borderTextClass = 'bg-surface text-muted border-border opacity-60 cursor-not-allowed';
                  } else if (availability === 'fast-filling') {
                    borderTextClass = isSelected 
                      ? 'bg-[#FF9800] text-white border-[#FF9800] shadow-[0_4px_12px_rgba(255,152,0,0.3)] border-transparent' 
                      : 'bg-transparent text-[#FF9800] border-[#FF9800] hover:bg-[#FF9800]/10';
                  } else {
                    borderTextClass = isSelected 
                      ? 'bg-success text-white border-[#00E676] shadow-[0_4px_12px_rgba(0,230,118,0.3)] border-transparent'
                      : 'bg-transparent text-success border-[#00E676] hover:bg-success/10';
                  }

                  return (
                    <button
                      key={id}
                      disabled={isHouseFull}
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        if (!isHouseFull && onShowTimeSelect) onShowTimeSelect(id);
                      }}
                      className={cn(
                        "flex flex-col items-center justify-center px-3 py-2 rounded-[8px] transition-all duration-200 ease-out active:scale-[0.96] border min-w-[76px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                        borderTextClass
                      )}
                      aria-label={`Select show time ${time}`}
                      aria-pressed={isSelected}
                    >
                      <span className="text-[13px] font-bold">{time}</span>
                      {screen && <span className={cn("text-[10px] mt-0.5 whitespace-nowrap", isSelected ? 'text-white/80' : 'opacity-80')}>{screen}</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {runningMovies && runningMovies.length > 0 && (
            <div className="mt-4 pt-4 border-t border-border space-y-3">
              <h4 className="text-[14px] font-bold text-foreground">Running Movies</h4>
              <div className="flex flex-col gap-3">
                {runningMovies.map(({ movie, shows }) => (
                  <RunningMovieItem key={movie.id} movie={movie} shows={shows} />
                ))}
              </div>
            </div>
          )}
        </div>
        
        {(onCtaClick || onSecondaryCtaClick) && !compactMode && (
          <div className="flex gap-2 w-full mt-auto pt-4 shrink-0">
            {onCtaClick && (
              <Button size="sm" className={onSecondaryCtaClick ? 'flex-1' : 'w-full'} onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                onCtaClick(e);
              }}>
                {ctaLabel}
              </Button>
            )}
            {onSecondaryCtaClick && (
              <Button size="sm" variant="outline" className={onCtaClick ? 'flex-1' : 'w-full'} onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                onSecondaryCtaClick(e);
              }}>
                {secondaryCtaLabel}
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export { TheatreCard };

