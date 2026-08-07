import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, FulfilmentMethod } from '../types/domain';

interface CartState {
  items: CartItem[];
  movieId?: string;
  theatreId?: string;
  showId?: string;
  seats?: string[];
  fulfilmentMethod?: FulfilmentMethod;
  existingBookingId?: string;
  seatDeliveryTiming?: 'before_movie' | 'interval';
  addSnack: (snackId: string, price: number, theatreId: string) => void;
  removeSnack: (snackId: string) => void;
  updateSnackQuantity: (snackId: string, quantity: number) => void;
  setBookingDetails: (movieId: string, theatreId: string, showId: string, seats: string[]) => void;
  setFulfilmentMethod: (method: FulfilmentMethod, timing?: 'before_movie' | 'interval') => void;
  setExistingBooking: (bookingId?: string) => void;
  clearCart: () => void;
  getTotalAmount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      movieId: undefined,
      theatreId: undefined,
      showId: undefined,
      seats: undefined,
      fulfilmentMethod: undefined,
      seatDeliveryTiming: undefined,
      existingBookingId: undefined,

      addSnack: (snackId, price, theatreId) => set((state) => {
        // Prevent adding snacks from a different theatre
        if (state.theatreId && state.theatreId !== theatreId && state.items.length > 0) {
          return { ...state, theatreId, items: [{ id: Date.now().toString(), snackId, quantity: 1, unitPrice: price }] };
        }

        const existingItem = state.items.find(i => i.snackId === snackId);
        if (existingItem) {
          return {
            ...state,
            theatreId,
            items: state.items.map(i => i.snackId === snackId ? { ...i, quantity: i.quantity + 1 } : i)
          };
        }
        return {
          ...state,
          theatreId,
          items: [...state.items, { id: Date.now().toString(), snackId, quantity: 1, unitPrice: price }]
        };
      }),

      removeSnack: (snackId) => set((state) => ({
        ...state,
        items: state.items.filter(i => i.snackId !== snackId)
      })),

      updateSnackQuantity: (snackId, quantity) => {
        if (quantity <= 0) {
          get().removeSnack(snackId);
          return;
        }
        set((state) => ({
          ...state,
          items: state.items.map(i => i.snackId === snackId ? { ...i, quantity } : i)
        }));
      },

      setBookingDetails: (movieId, theatreId, showId, seats) => set((state) => ({
        ...state,
        movieId,
        theatreId,
        showId,
        seats
      })),

      setFulfilmentMethod: (method, timing) => set((state) => ({
        ...state,
        fulfilmentMethod: method,
        seatDeliveryTiming: timing
      })),

      setExistingBooking: (bookingId) => set((state) => ({
        ...state,
        existingBookingId: bookingId
      })),

      clearCart: () => set({ items: [], movieId: undefined, theatreId: undefined, showId: undefined, seats: undefined, fulfilmentMethod: undefined, seatDeliveryTiming: undefined, existingBookingId: undefined }),

      getTotalAmount: () => {
        const { items } = get();
        return items.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);
      }
    }),
    {
      name: 'snacky-cart-storage', // Key in local storage
      version: 1, // Bump version to clear existing local storage during dev reset
    }
  )
);
