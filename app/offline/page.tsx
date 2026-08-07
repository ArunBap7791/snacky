import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function OfflinePage() {
  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-6 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary mb-6">
        <AlertTriangle className="h-10 w-10" />
      </div>
      <h2 className="text-2xl font-bold mb-2">You are offline</h2>
      <p className="text-muted mb-8 max-w-[280px]">
        It looks like you&apos;ve lost your internet connection. Please check your network settings and try again.
      </p>
      <Link href="/" className="w-full">
        <Button className="w-full max-w-[240px] bg-primary hover:bg-[#ff1a46] text-white">
          Retry Connection
        </Button>
      </Link>
    </main>
  );
}

