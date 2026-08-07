import { PartnerProvider } from './PartnerProvider';
import { Movie, Theatre, Show, Seat, Snack } from '@/lib/types/domain';
import { mockMovies, mockTheatres, mockShows, mockSeats, mockSnacks } from '@/lib/services/mockData';

/**
 * Mock implementation of the PartnerProvider.
 * This simulates calling an external partner API (like PVR or INOX)
 */
export class MockPartnerProvider implements PartnerProvider {
  
  async init(): Promise<void> {
    // Simulate auth token exchange
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  async getMovies(): Promise<Movie[]> {
    return mockMovies;
  }

  async getMovie(id: string): Promise<Movie | null> {
    return mockMovies.find(m => m.id === id) || null;
  }

  async getTheatres(): Promise<Theatre[]> {
    return mockTheatres;
  }

  async getTheatre(id: string): Promise<Theatre | null> {
    return mockTheatres.find(t => t.id === id) || null;
  }

  async getShows(movieId: string, theatreId: string): Promise<Show[]> {
    return mockShows.filter(s => s.movieId === movieId && s.theatreId === theatreId);
  }

  async getShow(id: string): Promise<Show | null> {
    return mockShows.find(s => s.id === id) || null;
  }

  async getSeats(showId: string): Promise<Seat[]> {
    return mockSeats[showId] || [];
  }

  async getSnacks(theatreId: string): Promise<Snack[]> {
    return mockSnacks.filter(s => s.theatreId === theatreId || theatreId === 't1');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async reserveSeats(_showId: string, _seatIds: string[]): Promise<string> {
    // Simulate seat reservation lock
    return `res_${Date.now()}`;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async confirmBooking(_reservationId: string, _paymentRef: string): Promise<boolean> {
    // Simulate booking confirmation
    return true;
  }
}

// Export a singleton instance
export const partnerProvider = new MockPartnerProvider();
