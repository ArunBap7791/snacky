import { Booking } from '@/lib/types/domain';

export interface BookingContext {
  isLoading: boolean;
  isExistingBooking: boolean;
  isMovieBooking: boolean;
  isStandaloneSnackOrder: boolean;
  hasExistingSnacks: boolean;
  existingFulfilmentMethod?: string;
  deliveryRules: {
    canExpressPickup: boolean;
    canSeatDelivery: boolean;
    helperMessage?: string;
    popupRequired: boolean;
  };
}

export function deriveBookingContext(
  existingBookingId: string | undefined | null,
  existingBooking: Booking | null,
  cart: { movieId?: string; seats?: string[] }
): BookingContext {
  const isExistingBooking = Boolean(existingBookingId && existingBooking);
  const isLoading = Boolean(existingBookingId && !existingBooking);

  if (isLoading) {
    return {
      isLoading: true,
      isExistingBooking: false,
      isMovieBooking: false,
      isStandaloneSnackOrder: false,
      hasExistingSnacks: false,
      deliveryRules: {
        canExpressPickup: false,
        canSeatDelivery: false,
        popupRequired: false
      }
    };
  }

  // Existing booking is ALWAYS the source of truth if it exists.
  const isMovieBooking = isExistingBooking 
    ? existingBooking!.orderType === 'movie'
    : Boolean(cart.movieId && cart.seats && cart.seats.length > 0);

  const isStandaloneSnackOrder = !isMovieBooking;
  
  const hasExistingSnacks = isExistingBooking 
    ? Boolean(existingBooking!.snackOrder && existingBooking!.snackOrder.length > 0)
    : false;
    
  const existingFulfilmentMethod = isExistingBooking 
    ? existingBooking!.fulfilmentMethod 
    : undefined;

  // Enforce defined business rules
  let canExpressPickup = true;
  let canSeatDelivery = true;
  let helperMessage: string | undefined = undefined;
  let popupRequired = false;

  if (isStandaloneSnackOrder) {
    canExpressPickup = true;
    canSeatDelivery = false;
    popupRequired = true;
  } else if (existingFulfilmentMethod === 'seat_delivery') {
    canExpressPickup = false;
    canSeatDelivery = true;
    helperMessage = "This booking is already configured for On-seat Delivery. Additional snacks will also be delivered to your seat.";
  } else {
    // Existing Movie Booking (No Snacks) OR (Express Pickup)
    canExpressPickup = true;
    canSeatDelivery = true;
  }

  return {
    isLoading: false,
    isExistingBooking,
    isMovieBooking,
    isStandaloneSnackOrder,
    hasExistingSnacks,
    existingFulfilmentMethod,
    deliveryRules: {
      canExpressPickup,
      canSeatDelivery,
      helperMessage,
      popupRequired
    }
  };
}
