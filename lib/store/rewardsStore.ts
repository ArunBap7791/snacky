import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { RewardSummary } from '../types/domain';

interface RewardsState {
  currentXp: number;
  rewardHistory: NonNullable<RewardSummary['rewardHistory']>;
  addXp: (xp: number, source: NonNullable<RewardSummary['rewardHistory']>[0]['source'], title: string) => void;
  clearRewards: () => void;
}

export const useRewardsStore = create<RewardsState>()(
  persist(
    (set) => ({
      currentXp: 0,
      rewardHistory: [],
      addXp: (xp, source, title) => set((state) => ({
        currentXp: state.currentXp + xp,
        rewardHistory: [
          {
            id: `rh_${Date.now()}`,
            title,
            xpEarned: xp,
            date: new Date().toISOString(),
            source
          },
          ...state.rewardHistory
        ]
      })),
      clearRewards: () => set({ currentXp: 0, rewardHistory: [] }),
    }),
    {
      name: 'snacky-rewards-storage',
    }
  )
);
