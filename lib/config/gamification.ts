/**
 * Centralized Gamification and Rewards Configuration
 * Based on 06_Gamification.md
 */

export const TIER_THRESHOLDS = {
  silver: 0,
  gold: 1000,
  platinum: 5000,
} as const;

export type Tier = keyof typeof TIER_THRESHOLDS;

export const XP_RULES = {
  // Ticket booking XP calculation
  tickets: {
    baseXpPerTicket: 50, // Base XP per ticket
    premiumSeatMultiplier: 1.5, // Premium seats get 1.5x XP
    weekendMultiplier: 1.2, // Friday-Sunday bookings get 1.2x XP
    maximumTicketsPerBooking: 10,
  },
  // Snack ordering XP calculation
  snacks: {
    xpPerRupeeSpent: 0.1, // 1 XP for every Rs 10 spent on snacks
    comboBonusXp: 20, // Flat bonus XP for ordering a combo
  },
  // Engagement
  firstBookingBonus: 100, // 100 XP for the user's first ever booking
  referralBonus: 200, // 200 XP for successful referral
};

export const REWARD_CATALOG = [
  {
    id: 'free_popcorn',
    title: 'Free Large Popcorn',
    pointsRequired: 500,
    description: 'Redeem a free large salted popcorn on your next visit.',
    durationMonths: 6,
  },
  {
    id: 'free_seat_delivery',
    title: 'Free Seat Delivery',
    pointsRequired: 200,
    description: 'Waive off seat delivery charges for one booking.',
    durationMonths: 3,
  },
  {
    id: 'ticket_50_off',
    title: 'Movie Ticket 50% Off',
    pointsRequired: 1500,
    description: 'Get 50% off on your next movie ticket booking.',
    durationMonths: 6,
  },
];

/**
 * Utility to calculate tier based on current XP
 */
export function calculateTier(xp: number): Tier {
  if (xp >= TIER_THRESHOLDS.platinum) return 'platinum';
  if (xp >= TIER_THRESHOLDS.gold) return 'gold';
  return 'silver';
}

/**
 * Utility to get XP required for next tier
 */
export function getNextTierInfo(currentTier: Tier) {
  if (currentTier === 'silver') return { next: 'gold' as Tier, points: TIER_THRESHOLDS.gold };
  if (currentTier === 'gold') return { next: 'platinum' as Tier, points: TIER_THRESHOLDS.platinum };
  return null; // Already at max tier
}
