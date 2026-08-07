export type UserRole = 'customer' | 'partner' | 'admin';

export type AuthMethod = 'mobile_otp' | 'google' | 'apple';

export type FulfilmentMethod = 'express_pickup' | 'seat_delivery';

export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export type PaymentStatus = 'pending' | 'authorized' | 'captured' | 'failed' | 'refunded';

export interface User {
  id: string;
  fullName: string;
  mobileNumber?: string;
  email?: string;
  profileImage?: string;
  rewardPoints: number;
  createdAt: string;
  updatedAt: string;
}

export interface Movie {
  id: string;
  title: string;
  language: string;
  genre: string;
  durationMinutes: number;
  rating?: number;
  posterUrl?: string;
  description?: string;
  trailerUrl?: string;
  releaseYear?: number;
  certification?: 'U' | 'UA' | 'A';
  castAndCrew?: {
    id: string;
    name: string;
    role: string;
    photoUrl: string;
  }[];
  reviews?: {
    overallRating: number;
    totalCount: number;
    userReviews: {
      id: string;
      userName: string;
      userAvatar?: string;
      rating: number;
      text: string;
    }[];
  };
  moreLikeThis?: string[]; // Array of Movie IDs
}

export interface Theatre {
  id: string;
  name: string;
  address: string;
  logoUrl?: string;
  latitude: number;
  longitude: number;
  partnerId: string;
  availableFacilities: string[];
  hallFeatures?: string[];
  supportsSeatDelivery: boolean;
}

export interface Show {
  id: string;
  movieId: string;
  theatreId: string;
  screen: string;
  date: string;
  startTime: string;
  endTime: string;
  seatLayout: string;
  availability?: 'available' | 'fast-filling' | 'house-full';
}

export interface Seat {
  id: string;
  showId: string;
  seatNumber: string;
  seatType: string;
  status: 'available' | 'reserved' | 'booked' | 'blocked';
  price: number;
}

export interface Snack {
  id: string;
  theatreId: string;
  category: string;
  name: string;
  description?: string;
  price: number;
  isVeg: boolean;
  allergens?: string[];
  allergenInfo?: string[];
  availability: 'in_stock' | 'out_of_stock';
  imageUrl?: string;
}

export interface CartItem {
  id: string;
  snackId: string;
  quantity: number;
  unitPrice: number;
}

export interface Cart {
  id: string;
  userId: string;
  theatreId?: string;
  bookingReference?: string;
  items: CartItem[];
  fulfilmentMethod?: FulfilmentMethod;
  totalAmount: number;
}

export interface Booking {
  id: string;
  orderType: 'movie' | 'snack';
  userId: string;
  movieId?: string;
  theatreId?: string;
  showId?: string;
  seats?: string[];
  snackOrder?: CartItem[];
  fulfilmentMethod?: FulfilmentMethod;
  qrCode?: string;
  otp?: string;
  status: BookingStatus;
  createdAt: string;
}

export interface Payment {
  id: string;
  bookingId: string;
  gatewayOrderId?: string;
  status: PaymentStatus;
  amount: number;
  timestamp: string;
}

export interface RewardSummary {
  userId: string;
  currentXp: number;
  tier: 'silver' | 'gold' | 'platinum';
  expiresAt?: string;
  rewardHistory?: {
    id: string;
    title: string;
    xpEarned: number;
    date: string;
    source: 'movie_booking' | 'snack_purchase' | 'referral' | 'bonus';
  }[];
  availableRewards?: {
    id: string;
    title: string;
    xpRequired: number;
    description: string;
    imageUrl: string;
    terms: string[];
    expiry: string;
  }[];
}
