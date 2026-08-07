import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Booking } from '../types/domain';

interface BookingState {
  bookings: Booking[];
  addBooking: (booking: Booking) => void;
  updateBooking: (id: string, updates: Partial<Booking>) => void;
  clearBookings: () => void;
}

export const useBookingStore = create<BookingState>()(
  persist(
    (set) => ({
      bookings: [],
      addBooking: (booking) => set((state) => ({
        bookings: [booking, ...state.bookings]
      })),
      updateBooking: (id, updates) => set((state) => ({
        bookings: state.bookings.map((b) => (b.id === id ? { ...b, ...updates } : b))
      })),
      clearBookings: () => set({ bookings: [] }),
    }),
    {
      name: 'snacky-booking-storage',
      version: 1, // Bump version to clear existing local storage during dev reset
    }
  )
);
