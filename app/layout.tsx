import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Providers } from './providers';
import { SplashWrapper } from '@/components/ui/splash-wrapper';
import { PermissionManager } from '@/components/ui/permission-manager';
import { Toaster } from '@/components/ui/toast';
import { BottomNavigation } from '@/components/ui/bottom-navigation';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: 'Snacky - Movie Tickets & Snacks',
  description: 'A premium cinema companion for booking movie tickets and ordering snacks to your seat.',
  manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    url: 'https://snacky.app',
    title: 'Snacky - Movie Tickets & Snacks',
    description: 'A premium cinema companion for booking movie tickets and ordering snacks to your seat.',
    siteName: 'Snacky',
    images: [{ url: '/og-image.jpg' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Snacky',
    description: 'Book movie tickets and order snacks to your seat.',
  }
};

export const viewport: Viewport = {
  themeColor: '#0D0E12',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1, // Disable pinch zoom for app-like feel
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-black text-foreground antialiased">
        <Providers>
          <SplashWrapper>
            <div className="mx-auto min-h-screen w-full max-w-md bg-background shadow-2xl relative overflow-x-hidden">
              {children}
              <PermissionManager />
              <Toaster />
              <BottomNavigation />
            </div>
          </SplashWrapper>
        </Providers>
      </body>
    </html>
  );
}

