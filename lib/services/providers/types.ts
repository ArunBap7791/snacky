import type { Booking, Movie, Seat, Snack, Theatre, Show } from '@/lib/types/domain';

export interface TheatreProvider {
  getMovies(): Promise<Movie[]>;
  getTheatres(): Promise<Theatre[]>;
  getShows(movieId?: string, theatreId?: string): Promise<Show[]>;
  getSeats(showId: string): Promise<Seat[]>;
  getSnacks(theatreId: string): Promise<Snack[]>;
  createBooking(booking: Partial<Booking>): Promise<Booking>;
  updateBookingStatus(bookingId: string, status: Booking['status']): Promise<Booking>;
}

export interface ProviderConfig {
  provider: 'mock' | 'partner';
  baseUrl?: string;
}
