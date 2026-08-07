import { Movie, Theatre, Show, Seat, Snack, User, RewardSummary, Booking, CartItem, FulfilmentMethod } from '../types/domain';
import { mockMovies, mockTheatres, mockShows, mockSeats, mockSnacks, mockUser, mockRewardSummary, mockBookings, mockBanners } from './mockData';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getMovies = async (): Promise<Movie[]> => {
  await delay(500);
  return mockMovies;
};

export const getBanners = async () => {
  await delay(300);
  return mockBanners;
};

export const getMovie = async (id: string): Promise<Movie | undefined> => {
  await delay(300);
  return mockMovies.find(m => m.id === id);
};

export const getTheatres = async (): Promise<Theatre[]> => {
  await delay(500);
  return mockTheatres;
};

export const getTheatre = async (id: string): Promise<Theatre | undefined> => {
  await delay(300);
  return mockTheatres.find(t => t.id === id);
};

export const getShowsForMovieAndTheatre = async (movieId: string, theatreId: string): Promise<Show[]> => {
  await delay(500);
  return mockShows.filter(s => s.movieId === movieId && s.theatreId === theatreId);
};

export const getShow = async (id: string): Promise<Show | undefined> => {
  await delay(300);
  return mockShows.find(s => s.id === id);
};

export const getSeatsForShow = async (showId: string): Promise<Seat[]> => {
  await delay(500);
  return mockSeats[showId] || [];
};

export const getSnacksForTheatre = async (theatreId: string): Promise<Snack[]> => {
  await delay(500);
  // Just returning all snacks for mock purposes if theatreId doesn't have specific ones, 
  // but filtering correctly in reality.
  return mockSnacks.filter(s => s.theatreId === theatreId || theatreId === 't1');
};

export const getUserProfile = async (): Promise<User> => {
  await delay(400);
  return mockUser;
};

export const getUserRewards = async (): Promise<RewardSummary> => {
  await delay(400);
  // Merge static mock rewards with Zustand client store
  let currentXp = mockRewardSummary.currentXp;
  let rewardHistory = [...(mockRewardSummary.rewardHistory || [])];
  
  if (typeof window !== 'undefined') {
    const { useRewardsStore } = await import('../store/rewardsStore');
    const storeState = useRewardsStore.getState();
    currentXp += storeState.currentXp;
    rewardHistory = [...storeState.rewardHistory, ...rewardHistory];
  }

  return {
    ...mockRewardSummary,
    currentXp,
    rewardHistory
  };
};

export const getUserBookings = async (): Promise<Booking[]> => {
  await delay(600);
  if (typeof window !== 'undefined') {
    const { useBookingStore } = await import('../store/bookingStore');
    return [...useBookingStore.getState().bookings, ...mockBookings];
  }
  return mockBookings;
};

export const getBooking = async (id: string): Promise<Booking | undefined> => {
  await delay(300);
  if (typeof window !== 'undefined') {
    const { useBookingStore } = await import('../store/bookingStore');
    const storeBooking = useBookingStore.getState().bookings.find((b: Booking) => b.id === id);
    if (storeBooking) return storeBooking;
  }
  return mockBookings.find(b => b.id === id);
};

export const createBooking = async (data: {
  userId: string;
  movieId?: string;
  theatreId?: string;
  showId?: string;
  seats?: string[];
  snackItems?: CartItem[];
  fulfilmentMethod?: FulfilmentMethod;
  totalAmount: number;
}): Promise<Booking> => {
  await delay(1500); // Simulate processing payment & booking
  
  let newId = `BK1001`;
  if (typeof window !== 'undefined') {
    const { useBookingStore } = await import('../store/bookingStore');
    const count = useBookingStore.getState().bookings.length + mockBookings.length + 1;
    newId = `BK${1000 + count}`;
  }

  const isSnackOnly = !data.movieId;

  const newBooking: Booking = {
    id: newId,
    orderType: isSnackOnly ? 'snack' : 'movie',
    userId: data.userId,
    movieId: data.movieId,
    theatreId: data.theatreId,
    showId: data.showId,
    seats: data.seats,
    snackOrder: data.snackItems,
    fulfilmentMethod: data.fulfilmentMethod,
    qrCode: isSnackOnly ? undefined : `qr_${Date.now()}`,
    otp: isSnackOnly ? undefined : Math.floor(100000 + Math.random() * 900000).toString(),
    status: 'confirmed',
    createdAt: new Date().toISOString(),
  };

  if (typeof window !== 'undefined') {
    const { useBookingStore } = await import('../store/bookingStore');
    useBookingStore.getState().addBooking(newBooking);

    const xpEarned = Math.floor(data.totalAmount / 10);
    const { useRewardsStore } = await import('../store/rewardsStore');
    useRewardsStore.getState().addXp(
      xpEarned, 
      isSnackOnly ? 'snack_purchase' : 'movie_booking', 
      isSnackOnly ? 'Snack Order' : 'Movie Ticket'
    );
  } else {
    // Fallback for tests/SSR
    mockBookings.unshift(newBooking);
  }

  return newBooking;
};

export const updateBooking = async (bookingId: string, data: {
  newSnacks?: CartItem[];
  fulfilmentMethod?: FulfilmentMethod;
}): Promise<Booking> => {
  await delay(1000);

  let booking: Booking | undefined;
  let store: { bookings: Booking[]; updateBooking: (id: string, updates: Partial<Booking>) => void } | undefined;
  if (typeof window !== 'undefined') {
    const { useBookingStore } = await import('../store/bookingStore');
    store = useBookingStore.getState();
    booking = store.bookings.find((b: Booking) => b.id === bookingId);
  }
  
  if (!booking) {
    booking = mockBookings.find(b => b.id === bookingId);
  }

  if (!booking) {
    throw new Error('Booking not found');
  }

  // Merge snacks
  const mergedSnacks = [...(booking.snackOrder || [])];
  if (data.newSnacks && data.newSnacks.length > 0) {
    data.newSnacks.forEach(newSnack => {
      const existingIdx = mergedSnacks.findIndex(s => s.snackId === newSnack.snackId);
      if (existingIdx >= 0) {
        mergedSnacks[existingIdx] = {
          ...mergedSnacks[existingIdx],
          quantity: mergedSnacks[existingIdx].quantity + newSnack.quantity
        };
      } else {
        mergedSnacks.push(newSnack);
      }
    });
  }

  let newFulfilment = data.fulfilmentMethod || booking.fulfilmentMethod;
  if (booking.fulfilmentMethod === 'seat_delivery') {
    newFulfilment = 'seat_delivery';
  }

  const updatedBooking: Booking = {
    ...booking,
    snackOrder: mergedSnacks,
    fulfilmentMethod: newFulfilment
  };

  if (typeof window !== 'undefined' && store) {
    store.updateBooking(bookingId, { 
      snackOrder: mergedSnacks, 
      fulfilmentMethod: updatedBooking.fulfilmentMethod 
    });
  } else {
    const mockIdx = mockBookings.findIndex(b => b.id === bookingId);
    if (mockIdx >= 0) {
      mockBookings[mockIdx] = updatedBooking;
    }
  }

  return updatedBooking;
};
