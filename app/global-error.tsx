'use client'; // Error boundaries must be Client Components

import { Button } from '@/components/ui/button';

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground antialiased">
        <div className="mx-auto flex min-h-screen w-full max-w-md flex-col items-center justify-center p-6 text-center shadow-2xl">
          <h2 className="text-3xl font-bold mb-3 text-white">Critical Error</h2>
          <p className="text-muted mb-8">
            The application crashed unexpectedly.
          </p>
          <Button 
            onClick={() => reset()}
            className="w-full max-w-[240px] bg-primary hover:bg-[#ff1a46] text-white"
          >
            Restart Application
          </Button>
        </div>
      </body>
    </html>
  );
}

