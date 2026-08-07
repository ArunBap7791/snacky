import { MockTheatreProvider } from '@/lib/services/providers/mock/theatre-provider';
import type { TheatreProvider, ProviderConfig } from '@/lib/services/providers/types';

export function createTheatreProvider(config: ProviderConfig): TheatreProvider {
  switch (config.provider) {
    case 'mock':
      return new MockTheatreProvider();
    case 'partner':
      return new MockTheatreProvider();
    default:
      return new MockTheatreProvider();
  }
}
