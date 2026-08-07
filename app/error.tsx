'use client'; // Error boundaries must be Client Components

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { TopNavigation } from '@/components/ui/top-navigation';
import { AlertCircle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service like Sentry or Firebase Crashlytics
    console.error('App Segment Error:', error);
  }, [error]);

  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-6 text-center">
      <TopNavigation title="Error" showBack />
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary mb-6">
        <AlertCircle className="h-10 w-10" />
      </div>
      <h2 className="text-2xl font-bold mb-2">Something went wrong!</h2>
      <p className="text-muted mb-8 max-w-[280px]">
        We encountered an unexpected error while loading this page.
      </p>
      <Button 
        onClick={() => reset()}
        className="w-full max-w-[240px] bg-primary hover:bg-[#ff1a46] text-white"
      >
        Try again
      </Button>
    </main>
  );
}

