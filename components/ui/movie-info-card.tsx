import * as React from 'react';
import { ProgressiveImage } from '@/components/ui/progressive-image';
import { cn } from '@/lib/utils/cn';

export interface MovieInfoCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  posterUrl?: string;
  subtitle?: React.ReactNode;
  details?: React.ReactNode;
}

export function MovieInfoCard({ title, posterUrl, subtitle, details, className, ...props }: MovieInfoCardProps) {
  return (
    <div className={cn("flex items-stretch gap-4 overflow-hidden rounded-[16px] border border-border bg-surface shadow-sm p-3 h-[104px]", className)} {...props}>
      <div className="relative w-[72px] shrink-0 overflow-hidden rounded-[8px] bg-[#2A2D36]">
        {posterUrl ? (
          <ProgressiveImage src={posterUrl} alt={title} className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[10px] text-muted font-bold">No Poster</div>
        )}
      </div>
      <div className="flex flex-col justify-center overflow-hidden flex-1 py-0.5">
        <h2 className="text-[16px] font-bold text-foreground line-clamp-1 tracking-tight">{title}</h2>
        
        {subtitle && (
          <div className="mt-1 text-[13px] text-muted line-clamp-1">
            {subtitle}
          </div>
        )}
        
        {details && (
          <div className="mt-1.5 flex items-center gap-2 text-[11px] font-medium text-muted truncate">
            {details}
          </div>
        )}
      </div>
    </div>
  );
}

