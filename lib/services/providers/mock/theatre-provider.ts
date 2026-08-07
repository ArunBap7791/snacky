import type { Booking, Movie, Seat, Snack, Theatre, Show } from '@/lib/types/domain';
import type { TheatreProvider } from '@/lib/services/providers/types';

const mockMovies: Movie[] = [
  {
    id: 'movie-1',
    title: 'Midnight Horizon',
    language: 'English',
    genre: 'Sci-Fi',
    durationMinutes: 132,
    rating: 8.4,
    description: 'A futuristic thriller about a city under a sky of artificial stars.',
  },
];

const mockTheatres: Theatre[] = [
  {
    id: 'theatre-1',
    name: 'CineVista Deluxe',
    address: 'MG Road, Bengaluru',
    latitude: 12.9716,
    longitude: 77.5946,
    partnerId: 'partner-1',
    availableFacilities: ['Parking', 'Wheelchair Access'],
    supportsSeatDelivery: true,
  },
];

const mockShows: Show[] = [
  {
    id: 'show-1',
    movieId: 'movie-1',
    theatreId: 'theatre-1',
    screen: 'Screen 2',
    date: '2026-08-01',
    startTime: '19:30',
    endTime: '22:00',
    seatLayout: 'standard',
  },
];

const mockSeats: Seat[] = [
  { id: 'seat-1', showId: 'show-1', seatNumber: 'A1', seatType: 'standard', status: 'available', price: 220 },
  { id: 'seat-2', showId: 'show-1', seatNumber: 'A2', seatType: 'standard', status: 'available', price: 220 },
];

const mockSnacks: Snack[] = [
  {
    id: 'snack-1',
    theatreId: 'theatre-1',
    category: 'Popcorn',
    name: 'Classic Popcorn',
    description: 'Buttery popcorn',
    price: 180,
    isVeg: true,
    allergenInfo: ['Contains Milk'],
    availability: 'in_stock',
  },
];

export class MockTheatreProvider implements TheatreProvider {
  async getMovies(): Promise<Movie[]> {
    return mockMovies;
  }

  async getTheatres(): Promise<Theatre[]> {
    return mockTheatres;
  }

  async getShows(): Promise<Show[]> {
    return mockShows;
  }

  async getSeats(showId: string): Promise<Seat[]> {
    return mockSeats.filter((seat) => seat.showId === showId);
  }

  async getSnacks(theatreId: string): Promise<Snack[]> {
    return mockSnacks.filter((snack) => snack.theatreId === theatreId);
  }

  async createBooking(booking: Partial<Booking>): Promise<Booking> {
    return {
      id: `booking-${Date.now()}`,
      orderType: !booking.movieId ? 'snack' : 'movie',
      userId: booking.userId ?? 'guest',
      movieId: booking.movieId,
      theatreId: booking.theatreId,
      showId: booking.showId,
      seats: booking.seats,
      snackOrder: booking.snackOrder,
      fulfilmentMethod: booking.fulfilmentMethod,
      qrCode: 'mock-qr',
      otp: '123456',
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };
  }

  async updateBookingStatus(bookingId: string, status: Booking['status']): Promise<Booking> {
    return {
      id: bookingId,
      orderType: 'movie',
      userId: 'guest',
      status,
      createdAt: new Date().toISOString(),
    };
  }
}
