import { z } from 'zod';

export const authLoginSchema = z.object({
  method: z.enum(['mobile_otp', 'google', 'apple']),
  phoneNumber: z.string().optional(),
});

export const cartItemSchema = z.object({
  snackId: z.string().min(1),
  quantity: z.number().int().positive(),
});

export const bookingCreateSchema = z.object({
  movieId: z.string().optional(),
  theatreId: z.string().optional(),
  showId: z.string().optional(),
  seats: z.array(z.string()).optional(),
  snackOrder: z.array(z.string()).optional(),
  fulfilmentMethod: z.enum(['express_pickup', 'seat_delivery']).optional(),
});

export const paymentVerifySchema = z.object({
  bookingId: z.string().min(1),
  paymentId: z.string().min(1),
  signature: z.string().min(1),
});
