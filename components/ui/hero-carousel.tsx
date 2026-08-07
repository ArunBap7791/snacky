'use client';

import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { ProgressiveImage } from '@/components/ui/progressive-image';
import { cn } from '@/lib/utils/cn';

export interface Banner {
  id: string;
  imageUrl: string;
  alt: string;
  movieId?: string;
  title?: string;
}

export interface HeroCarouselProps {
  banners: Banner[];
}

import Link from 'next/link';

export function HeroCarousel({ banners }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-slide every 4 seconds
  useEffect(() => {
    if (!banners || banners.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [banners]);

  // Scroll to current index when it changes automatically
  useEffect(() => {
    if (scrollRef.current) {
      const scrollWidth = scrollRef.current.clientWidth;
      scrollRef.current.scrollTo({
        left: currentIndex * scrollWidth,
        behavior: 'smooth'
      });
    }
  }, [currentIndex]);

  // Update current index on manual scroll/swipe
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollLeft = e.currentTarget.scrollLeft;
    const width = e.currentTarget.clientWidth;
    const newIndex = Math.round(scrollLeft / width);
    if (newIndex !== currentIndex) {
      setCurrentIndex(newIndex);
    }
  };

  if (!banners || banners.length === 0) return null;

  return (
    <div className="relative w-full overflow-hidden">
      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex w-full snap-x snap-mandatory overflow-x-auto scrollbar-hide overscroll-x-contain"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
      >
        {banners.map((banner) => {
          const content = (
            <div className="relative aspect-video w-full overflow-hidden rounded-[16px] border border-border bg-surface shadow-md">
              <ProgressiveImage 
                src={banner.imageUrl} 
                alt={banner.alt} 
                className="absolute inset-0 h-full w-full object-cover" 
              />
              {banner.title && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-4">
                  <h3 className="text-white font-bold text-lg drop-shadow-md">{banner.title}</h3>
                </div>
              )}
            </div>
          );
          
          return (
            <div key={banner.id} className="min-w-full flex-none snap-center px-4">
              {banner.movieId ? (
                <Link href={`/movies/${banner.movieId}`} className="block">
                  {content}
                </Link>
              ) : content}
            </div>
          );
        })}
      </div>
      
      {/* Pagination Dots */}
      <div className="mt-3 flex w-full items-center justify-center gap-1.5">
        {banners.map((_, idx) => (
          <div 
            key={idx} 
            className={cn(
              "h-1.5 rounded-full transition-all duration-500 ease-out",
              currentIndex === idx ? "w-6 bg-primary" : "w-1.5 bg-[#2A2D36] hover:bg-[#9498A6]"
            )}
          />
        ))}
      </div>
    </div>
  );
}

