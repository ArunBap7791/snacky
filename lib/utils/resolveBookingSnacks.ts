import { CartItem, Snack } from '../types/domain';

export interface ResolvedSnack {
  id: string;
  name: string;
  imageUrl?: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export function resolveBookingSnacks(
  cartItems: CartItem[] | undefined,
  snackCatalogue: Snack[]
): ResolvedSnack[] {
  if (!cartItems || cartItems.length === 0) return [];

  return cartItems
    .map((item) => {
      const snackData = snackCatalogue.find((s) => s.id === item.snackId);
      if (!snackData) return null;

      // Ensure price comes from the CartItem (historical accuracy) but fallback to catalogue
      const unitPrice = item.unitPrice || snackData.price || 0;
      
      return {
        id: item.snackId,
        name: snackData.name,
        imageUrl: snackData.imageUrl,
        quantity: item.quantity,
        unitPrice: unitPrice,
        subtotal: unitPrice * item.quantity,
      };
    })
    .filter(Boolean) as ResolvedSnack[];
}
