import { Movie, Theatre, Show, Seat, Snack } from '@/lib/types/domain';

export interface PartnerProvider {
  /**
   * Initialize the provider (e.g., set up auth tokens)
   */
  init(): Promise<void>;

  /**
   * Fetch all movies currently playing
   */
  getMovies(): Promise<Movie[]>;

  /**
   * Fetch a specific movie by ID
   */
  getMovie(id: string): Promise<Movie | null>;

  /**
   * Fetch all partner theatres
   */
  getTheatres(): Promise<Theatre[]>;

  /**
   * Fetch a specific theatre by ID
   */
  getTheatre(id: string): Promise<Theatre | null>;

  /**
   * Fetch shows for a specific movie at a specific theatre
   */
  getShows(movieId: string, theatreId: string): Promise<Show[]>;

  /**
   * Fetch a specific show by ID
   */
  getShow(id: string): Promise<Show | null>;

  /**
   * Fetch seats for a specific show
   */
  getSeats(showId: string): Promise<Seat[]>;

  /**
   * Fetch snacks available at a specific theatre
   */
  getSnacks(theatreId: string): Promise<Snack[]>;

  /**
   * Reserve seats temporarily during checkout
   * Returns a reservation ID
   */
  reserveSeats(showId: string, seatIds: string[]): Promise<string>;

  /**
   * Confirm the booking with the partner system
   */
  confirmBooking(reservationId: string, paymentRef: string): Promise<boolean>;
}
