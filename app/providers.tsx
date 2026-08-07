'use client';

import { AppProviders } from '@/lib/providers/app-providers';

export function Providers({ children }: { children: React.ReactNode }) {
  return <AppProviders>{children}</AppProviders>;
}
