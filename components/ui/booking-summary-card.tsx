import * as React from 'react';
import Image from 'next/image';
import { ProgressiveImage } from '@/components/ui/progressive-image';
import { MapPin, Calendar, Clock3, Film, Popcorn, Store, Ticket } from 'lucide-react';
import { ResolvedSnack } from '@/lib/utils/resolveBookingSnacks';

export interface BookingSummaryData {
  id?: string;
  status?: string;
  orderType: 'movie' | 'snack';
  movieName?: string;
  moviePosterUrl?: string;
  theatreName?: string;
  theatreLogoUrl?: string;
  date?: string;
  time?: string;
  screen?: string;
  seats?: string[];
  snackCount?: number;
  snacks?: ResolvedSnack[];
  fulfilmentMethod?: string;
}

export interface BookingSummaryCardProps {
  data: BookingSummaryData;
  className?: string;
}

export function BookingSummaryCard({ data, className = '' }: BookingSummaryCardProps) {
  const isSnackOnly = data.orderType === 'snack';
  const hasSnacks = (data.snacks && data.snacks.length > 0) || (data.snackCount ?? 0) > 0;
  
  const getStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'bg-success/20 text-success';
      case 'cancelled': return 'bg-[#FF5252]/20 text-[#FF5252]';
      case 'confirmed': return 'bg-[#00B0FF]/20 text-[#00B0FF]';
      case 'pending': return 'bg-secondary/20 text-secondary';
      default: return 'bg-[#9498A6]/20 text-muted';
    }
  };

  const formattedSeats = data.seats?.map(s => s.split('_').pop()).join(', ') || 'N/A';

  return (
    <div className={`relative overflow-hidden rounded-[24px] border border-border bg-surface p-4 shadow-lg ${data.status === 'completed' || data.status === 'cancelled' ? 'opacity-80 grayscale-[20%]' : ''} ${className}`}>
      
      {/* Header for Status / ID if present */}
      {(data.id || data.status) && (
        <div className="flex justify-between items-center mb-4 border-b border-border pb-3">
          {data.id ? (
            <h3 className="font-mono text-[13px] text-muted">ID: {data.id.toUpperCase()}</h3>
          ) : (
            <div />
          )}
          {data.status && (
            <span className={`shrink-0 rounded-[6px] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${getStatusColor(data.status)} animate-in fade-in`}>
              {data.status}
            </span>
          )}
        </div>
      )}

      <div className="flex gap-4">
        {/* Poster / Logo */}
        <div className="relative h-[120px] w-[84px] shrink-0 rounded-[12px] overflow-hidden bg-[#2A2D36]">
          {isSnackOnly ? (
            data.theatreLogoUrl ? (
              <ProgressiveImage src={data.theatreLogoUrl} alt={data.theatreName || 'Theatre'} className="absolute inset-0 h-full w-full object-contain bg-white" />
            ) : (
              <div className="relative flex h-full w-full items-center justify-center">
                <Image src="/assets/Corny%20Bombs/Corny%20Covers%20His%20Eyes.png" alt="No Logo" fill className="object-contain p-3 opacity-50" />
              </div>
            )
          ) : (
            data.moviePosterUrl ? (
              <ProgressiveImage src={data.moviePosterUrl} alt={data.movieName || 'Movie'} className="absolute inset-0 h-full w-full object-cover" />
            ) : (
              <div className="relative flex h-full w-full items-center justify-center">
                <Image src="/assets/Corny%20Bombs/Corny%20Covers%20His%20Eyes.png" alt="No Poster" fill className="object-contain p-3 opacity-50" />
              </div>
            )
          )}
        </div>

        {/* Details */}
        <div className="flex flex-1 flex-col">
          <h3 className="font-bold text-[16px] leading-tight text-foreground line-clamp-2 mb-1">
            {isSnackOnly ? 'Snack Order' : data.movieName || 'Unknown Movie'}
          </h3>
          
          <div className="mt-1 space-y-1 text-[12px] text-muted">
            {data.theatreName && (
              <div className="flex items-center gap-1.5 line-clamp-1">
                {isSnackOnly ? <Store className="h-3.5 w-3.5 shrink-0" /> : <MapPin className="h-3.5 w-3.5 shrink-0" />}
                <span>{data.theatreName}</span>
              </div>
            )}
            
            {isSnackOnly ? (
              hasSnacks && (
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-muted mb-3 flex items-center justify-between">
                    <span>Snacks Added</span>
                    {data.fulfilmentMethod && (
                      <span className="text-success capitalize">{data.fulfilmentMethod.replace('_', ' ')}</span>
                    )}
                  </div>
                  {data.snacks && data.snacks.length > 0 ? (
                    <>
                      <div className="space-y-2">
                        {data.snacks.map((snack, i) => (
                          <div key={i} className="flex justify-between items-center text-[13px]">
                            <span className="text-foreground line-clamp-1 pr-4">{snack.name} <span className="text-muted font-medium whitespace-nowrap ml-1">×{snack.quantity}</span></span>
                            <span className="text-foreground font-medium whitespace-nowrap">₹{snack.subtotal}</span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 pt-3 border-t border-border border-dashed flex justify-between items-center text-[13px] font-bold text-foreground">
                        <span>Snacks Total</span>
                        <span>₹{data.snacks.reduce((a, b) => a + b.subtotal, 0)}</span>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center gap-3 font-medium text-foreground">
                      <span className="flex items-center gap-1.5"><Popcorn className="h-3.5 w-3.5 text-muted" />{data.snackCount} Items</span>
                    </div>
                  )}
                </div>
              )
            ) : (
              <>
                <div className="flex items-center gap-3">
                  {data.date && <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" />{data.date}</span>}
                  {data.time && <span className="flex items-center gap-1.5"><Clock3 className="h-3.5 w-3.5" />{data.time}</span>}
                </div>
                <div className="flex items-center gap-3 font-medium text-foreground mt-1">
                  {data.screen && <span className="flex items-center gap-1.5"><Film className="h-3.5 w-3.5 text-muted" />{data.screen}</span>}
                  {data.seats && data.seats.length > 0 && (
                    <>
                      <span>•</span>
                      <span className="flex items-center gap-1.5 text-foreground"><Ticket className="h-3.5 w-3.5 text-muted" />{data.seats.length} Seats <span className="text-muted font-normal">({formattedSeats})</span></span>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Additional Movie Snacks Info below */}
      {!isSnackOnly && hasSnacks && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="text-[11px] font-bold uppercase tracking-wider text-muted mb-3 flex items-center justify-between">
            <span>Snacks Added</span>
            {data.fulfilmentMethod && (
              <span className="text-success capitalize">{data.fulfilmentMethod.replace('_', ' ')}</span>
            )}
          </div>
          {data.snacks && data.snacks.length > 0 ? (
            <>
              <div className="space-y-2">
                {data.snacks.map((snack, i) => (
                  <div key={i} className="flex justify-between items-center text-[13px]">
                    <span className="text-foreground line-clamp-1 pr-4">{snack.name} <span className="text-muted font-medium whitespace-nowrap ml-1">×{snack.quantity}</span></span>
                    <span className="text-foreground font-medium whitespace-nowrap">₹{snack.subtotal}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-border border-dashed flex justify-between items-center text-[13px] font-bold text-foreground">
                <span>Snacks Total</span>
                <span>₹{data.snacks.reduce((a, b) => a + b.subtotal, 0)}</span>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-between text-[12px] font-medium">
              <span className="flex items-center gap-1.5 text-success"><Popcorn className="h-3.5 w-3.5" /> Pre-ordered Snacks ({data.snackCount} Items)</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

