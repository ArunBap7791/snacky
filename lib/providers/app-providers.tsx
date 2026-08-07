'use client';

import { QueryProvider } from '@/lib/providers/query-provider';
import { ThemeProvider } from '@/lib/providers/theme-provider';
import { PWAProvider } from '@/lib/providers/pwa-provider';
import { ClerkProvider } from '@clerk/nextjs';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <PWAProvider>
        <QueryProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </QueryProvider>
      </PWAProvider>
    </ClerkProvider>
  );
}
