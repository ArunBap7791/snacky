import * as React from 'react';
import Image from 'next/image';
import { MapPin, Calendar, Clock3, Popcorn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProgressiveImage } from '@/components/ui/progressive-image';
import { motion } from 'framer-motion';
import { useSafeMotion } from '@/lib/motion';

export interface UpcomingBookingCardProps extends React.HTMLAttributes<HTMLDivElement> {
  movieName: string;
  theatreName: string;
  date: string;
  time: string;
  posterUrl?: string;
  status?: string;
  onBookSnacks?: () => void;
  onViewTicket?: () => void;
  hasSnacks?: boolean;
  fulfilmentMethod?: string;
}

export function UpcomingBookingCard({ 
  movieName, 
  theatreName, 
  date, 
  time, 
  posterUrl, 
  status = 'Confirmed', 
  onBookSnacks, 
  onViewTicket,
  hasSnacks, 
  fulfilmentMethod, 
  className = '', 
  ...props 
}: UpcomingBookingCardProps) {
  const { cardPressVariants } = useSafeMotion();
  
  const getStatusColor = (statusStr: string) => {
    switch (statusStr?.toLowerCase()) {
      case 'completed': return 'bg-success/20 text-success';
      case 'cancelled': return 'bg-[#FF5252]/20 text-[#FF5252]';
      case 'confirmed': return 'bg-[#00B0FF]/20 text-[#00B0FF]';
      case 'pending': return 'bg-secondary/20 text-secondary';
      default: return 'bg-[#9498A6]/20 text-muted';
    }
  };

  return (
    <motion.div 
      variants={cardPressVariants}
      whileTap="tap"
      className={`relative overflow-hidden w-full min-w-[280px] rounded-[24px] border border-border bg-surface p-4 shadow-lg cursor-pointer hover:border-[#9498A6]/50 ${className}`} 
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      {...(props as any)}
    >
      <div className="flex gap-4">
        {/* Poster */}
        <div className="relative h-[120px] w-[84px] shrink-0 rounded-[12px] overflow-hidden bg-[#2A2D36]">
          {posterUrl ? (
            <ProgressiveImage src={posterUrl} alt={movieName} className="absolute inset-0 h-full w-full object-cover" />
          ) : (
            <div className="relative flex h-full w-full items-center justify-center">
              <Image src="/assets/Corny%20Bombs/Corny%20Covers%20His%20Eyes.png" alt="No Poster" fill className="object-contain p-3 opacity-50" />
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-1 flex-col">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-bold text-[16px] leading-tight text-foreground line-clamp-1">
              {movieName}
            </h3>
            {status && (
              <span className={`shrink-0 rounded-[6px] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${getStatusColor(status)} animate-in fade-in`}>
                {status}
              </span>
            )}
          </div>
          
          <div className="mt-1 space-y-1 text-[12px] text-muted">
            <div className="flex items-center gap-1.5 line-clamp-1">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              <span>{theatreName}</span>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" />{date}</span>
              <span className="flex items-center gap-1.5"><Clock3 className="h-3.5 w-3.5" />{time}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Movie Snacks Info below */}
      {hasSnacks && (
        <div className="mt-3 pt-3 border-t border-border flex items-center justify-between text-[12px] font-medium">
          <span className="flex items-center gap-1.5 text-success"><Popcorn className="h-3.5 w-3.5" /> Pre-ordered Snacks</span>
          {fulfilmentMethod && <span className="text-muted capitalize">{fulfilmentMethod.replace('_', ' ')}</span>}
        </div>
      )}

      {/* Actions */}
      <div className="mt-4 pt-4 border-t border-border flex flex-col gap-3">
        <div className="flex gap-3">
          <Button 
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={onBookSnacks}
            aria-label={hasSnacks ? "Add More Snacks" : "Add Snacks"}
          >
            {hasSnacks ? 'Add More Snacks' : 'Add Snacks'}
          </Button>
          <Button 
            size="sm"
            className="flex-1"
            onClick={onViewTicket || onBookSnacks} 
            aria-label="View Ticket"
          >
            View Ticket
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

