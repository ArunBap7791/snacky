import * as React from 'react';
import { Clock3, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardProps } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ProgressiveImage } from '@/components/ui/progressive-image';

export interface MovieCardProps extends CardProps {
  title: string;
  language?: string;
  genre?: string;
  duration?: string;
  rating?: string;
  posterLabel?: string;
  posterUrl?: string;
  ctaLabel?: string;
  formats?: string[];
  onCtaClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

function MovieCard({ title, language, genre, duration, rating, posterLabel = 'Movie', posterUrl, ctaLabel = 'Book Tickets', onCtaClick, className, ...props }: MovieCardProps) {
  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Card whileTap="tap" className={`overflow-hidden bg-surface border-border p-0 shadow-lg rounded-[24px] ${className}`} {...props}>
      <CardHeader className="p-4 pb-3 space-y-3">
        <div className="relative flex h-36 items-center justify-center rounded-[16px] bg-[#2A2D36] text-center text-[16px] font-semibold text-white overflow-hidden">
          {posterUrl ? (
            <ProgressiveImage src={posterUrl} alt={title} className="absolute inset-0 h-full w-full object-cover" />
          ) : (
            posterLabel
          )}
        </div>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-[18px] font-bold leading-tight tracking-tight text-foreground">{title}</CardTitle>
          {rating ? <Badge variant="secondary" className="shrink-0 flex items-center gap-1 rounded-[4px] bg-background px-1.5 py-0.5 text-secondary border border-border shadow-sm"><Star className="h-3 w-3 fill-[#FFD000] text-secondary" />{rating}</Badge> : null}
        </div>
        <div className="flex flex-wrap gap-2 text-[12px] font-medium text-muted">
          {language ? <span>{language}</span> : null}
          {genre ? <span>{genre}</span> : null}
        </div>
      </CardHeader>
      <CardContent className="flex items-center justify-between gap-3 p-4 pt-0">
        <div className="flex items-center gap-3 text-[12px] font-medium text-muted">
          <span className="flex items-center gap-1 shrink-0"><Clock3 className="h-4 w-4 text-muted" />{duration}</span>
        </div>
        <Button size="sm" className="shrink-0" onClick={(e) => {
          if (onCtaClick) {
            e.stopPropagation();
            onCtaClick(e);
          }
        }}>{ctaLabel}</Button>
      </CardContent>
    </Card>
  );
}

export { MovieCard }; 

