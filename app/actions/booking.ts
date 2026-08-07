'use server';

import { createAdminClient } from '@/lib/supabase/server';
import { partnerProvider } from '@/lib/services/partner/MockPartnerProvider';
import { calculateAndAwardXP } from './rewards';
import { currentUser } from '@clerk/nextjs/server';

export interface BookingPayload {
  movieId?: string;
  theatreId?: string;
  showId?: string;
  seats?: string[];
  snackItems?: { snackId: string; quantity: number; unitPrice: number }[];
  fulfilmentMethod?: string;
  totalAmount: number;
  paymentRef: string; // From Razorpay
}

/**
 * Confirms a booking, saves it to the DB, and processes rewards
 */
export async function confirmBookingTransaction(payload: BookingPayload) {
  const user = await currentUser();
  if (!user) throw new Error('Unauthorized');

  const supabase = createAdminClient();

  // 1. Reserve seats via Partner API
  let reservationId = '';
  if (payload.showId && payload.seats && payload.seats.length > 0) {
    reservationId = await partnerProvider.reserveSeats(payload.showId, payload.seats);
  }

  // 2. Confirm booking with Partner API
  const partnerConfirmed = await partnerProvider.confirmBooking(reservationId, payload.paymentRef);
  if (!partnerConfirmed) {
    throw new Error('Partner rejected booking');
  }

  // 3. Generate QR Code and OTP (Mocked logic for now)
  const bookingId = `BKG-${Date.now().toString().slice(-6)}`;
  const qrCodeData = `snacky://verify/${bookingId}`;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // 4. Save Booking to Supabase
  const { error: bookingError } = await supabase.from('bookings').insert({
    id: bookingId,
    user_id: user.id,
    movie_id: payload.movieId,
    theatre_id: payload.theatreId,
    show_id: payload.showId,
    fulfilment_method: payload.fulfilmentMethod,
    qr_code: qrCodeData,
    otp,
    status: 'confirmed',
    total_amount: payload.totalAmount
  });

  if (bookingError) throw bookingError;

  // 5. Save Seats
  if (payload.seats && payload.seats.length > 0) {
    const seatInserts = payload.seats.map(seatId => ({
      booking_id: bookingId,
      seat_id: seatId
    }));
    await supabase.from('booking_seats').insert(seatInserts);
  }

  // 6. Save Snacks
  if (payload.snackItems && payload.snackItems.length > 0) {
    const snackInserts = payload.snackItems.map(item => ({
      booking_id: bookingId,
      snack_id: item.snackId,
      quantity: item.quantity,
      unit_price: item.unitPrice
    }));
    await supabase.from('booking_snacks').insert(snackInserts);
  }

  // 7. Process Gamification Rewards
  await calculateAndAwardXP(user.id, payload);

  // Return booking info
  return {
    id: bookingId,
    qrCode: qrCodeData,
    otp,
    status: 'confirmed'
  };
}
