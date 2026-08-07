export const businessRules = {
  xp: {
    movieBooking: 100,
    snackPurchase: 60,
    combinedPurchase: 150,
    expirationDays: 365,
    reminderDays: [30, 7, 1],
  },
  tiers: {
    silver: { minXp: 0, maxXp: 999 },
    gold: { minXp: 1000, maxXp: 4999 },
    platinum: { minXp: 5000, maxXp: Number.POSITIVE_INFINITY },
  },
  fulfilment: {
    seatDeliveryFee: 40,
    seatDeliveryEligibility: {
      requiresSnackyBooking: true,
      requiresTheatreSupport: true,
      requiresOpenDeliveryWindow: true,
    },
  },
  payments: {
    currency: 'INR',
    supportedMethods: ['UPI', 'Card', 'Net Banking', 'Wallet'],
  },
  ui: {
    primaryColor: '#FF2A55',
    accentColor: '#FFD000',
    successColor: '#00E676',
    warningColor: '#FF9100',
    errorColor: '#FF5252',
  },
} as const;
