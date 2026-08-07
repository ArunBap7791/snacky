'use server';

import { createAdminClient } from '@/lib/supabase/server';
import { XP_RULES, calculateTier } from '@/lib/config/gamification';
import { BookingPayload } from './booking';

/**
 * Calculates XP for a booking and updates the user's reward profile
 */
export async function calculateAndAwardXP(userId: string, payload: BookingPayload) {
  const supabase = createAdminClient();

  let earnedXp = 0;

  // Calculate Ticket XP
  if (payload.seats && payload.seats.length > 0) {
    const ticketCount = Math.min(payload.seats.length, XP_RULES.tickets.maximumTicketsPerBooking);
    const ticketXp = ticketCount * XP_RULES.tickets.baseXpPerTicket;
    
    // Note: To implement premium seat or weekend multiplier accurately, 
    // we would need to check the specific seat details and show date. 
    // Applying base calculation for now.
    earnedXp += ticketXp;
  }

  // Calculate Snack XP
  if (payload.snackItems && payload.snackItems.length > 0) {
    const snackTotal = payload.snackItems.reduce((acc, item) => acc + (item.unitPrice * item.quantity), 0);
    earnedXp += Math.floor(snackTotal * XP_RULES.snacks.xpPerRupeeSpent);

    // Check for combos (simplified check)
    const hasCombo = payload.snackItems.some(item => item.quantity > 1); // Mock logic for combo
    if (hasCombo) {
      earnedXp += XP_RULES.snacks.comboBonusXp;
    }
  }

  if (earnedXp === 0) return;

  // Update Rewards Table
  // First, get current XP
  const { data: currentReward } = await supabase
    .from('rewards')
    .select('current_xp')
    .eq('user_id', userId)
    .single();

  const currentXp = currentReward?.current_xp || 0;
  const newXp = currentXp + earnedXp;
  const newTier = calculateTier(newXp);

  await supabase
    .from('rewards')
    .update({
      current_xp: newXp,
      tier: newTier,
      updated_at: new Date().toISOString()
    })
    .eq('user_id', userId);
}
