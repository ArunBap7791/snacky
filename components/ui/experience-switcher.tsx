import * as React from 'react';
import { cn } from '@/lib/utils/cn';
import { Film, Popcorn } from 'lucide-react';

export interface ExperienceSwitcherProps {
  activeTab: 'movies' | 'snacks';
  onChange: (tab: 'movies' | 'snacks') => void;
}

export function ExperienceSwitcher({ activeTab, onChange }: ExperienceSwitcherProps) {
  return (
    <div className="relative mx-4 mt-4 mb-2 flex h-14 items-center justify-between rounded-[20px] bg-surface p-1 border border-border">
      {/* Animated active background */}
      <div 
        className={cn(
          "absolute left-1 top-1 bottom-1 w-[calc(50%-4px)] rounded-[16px] shadow-md transition-transform duration-300 ease-out",
          activeTab === 'movies' ? 'translate-x-0 bg-primary' : 'translate-x-full bg-secondary'
        )}
      />

      {/* Movies Tab */}
      <button
        onClick={() => onChange('movies')}
        className={cn(
          "relative z-10 flex h-full w-1/2 items-center justify-center gap-2 rounded-[16px] text-[14px] font-bold transition-all duration-300",
          activeTab === 'movies' ? 'text-white scale-100' : 'text-muted scale-95 hover:text-foreground'
        )}
      >
        <Film className={cn("h-5 w-5 transition-colors duration-300", activeTab === 'movies' ? 'text-white' : 'text-muted')} />
        Movies
      </button>

      {/* Snacks Tab */}
      <button
        onClick={() => onChange('snacks')}
        className={cn(
          "relative z-10 flex h-full w-1/2 items-center justify-center gap-2 rounded-[16px] text-[14px] font-bold transition-all duration-300",
          activeTab === 'snacks' ? 'text-[#0D0E12] scale-100' : 'text-muted scale-95 hover:text-foreground'
        )}
      >
        <Popcorn className={cn("h-5 w-5 transition-colors duration-300", activeTab === 'snacks' ? 'text-[#0D0E12]' : 'text-muted')} />
        Snacks
      </button>
    </div>
  );
}

