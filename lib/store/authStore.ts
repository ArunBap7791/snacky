import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  isGuest: boolean;
  isDummyUser: boolean;
  setGuestMode: (isGuest: boolean) => void;
  setDummyUserMode: (isDummy: boolean) => void;
  clearAuthSession: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isGuest: false,
      isDummyUser: false,
      setGuestMode: (isGuest) => set({ isGuest, isDummyUser: false }),
      setDummyUserMode: (isDummy) => set({ isDummyUser: isDummy, isGuest: false }),
      clearAuthSession: () => set({ isGuest: false, isDummyUser: false }),
    }),
    {
      name: 'snacky-auth-storage',
    }
  )
);
