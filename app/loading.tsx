import { Skeleton } from '@/components/ui/skeleton';
import { TopNavigation } from '@/components/ui/top-navigation';

export default function Loading() {
  return (
    <main className="min-h-screen bg-background pb-32 text-foreground">
      <TopNavigation />
      
      {/* Header Skeleton */}
      <div className="px-4 py-6">
        <Skeleton className="h-6 w-32 mb-2" />
        <Skeleton className="h-8 w-48" />
      </div>

      {/* Categories Skeleton */}
      <div className="mt-2 flex gap-3 overflow-x-hidden px-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-10 w-24 shrink-0 rounded-full" />
        ))}
      </div>

      {/* Cards Grid Skeleton */}
      <div className="mt-8 grid grid-cols-2 gap-4 px-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex flex-col gap-2">
            <Skeleton className="h-48 w-full rounded-[16px]" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    </main>
  );
}

