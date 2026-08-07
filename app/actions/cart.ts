'use server';

import { currentUser } from '@clerk/nextjs/server';
import { createClient } from '@/lib/supabase/server';
import { CartItem } from '@/lib/types/domain';

export async function syncCartToServer(localCart: {
  items: CartItem[];
  movieId?: string;
  theatreId?: string;
  showId?: string;
  seats?: string[];
  fulfilmentMethod?: string;
}) {
  const user = await currentUser();
  if (!user) return; // Only sync for authenticated users

  const supabase = await createClient();

  try {
    // 1. Upsert Cart
    const { data: cart, error: cartError } = await supabase
      .from('carts')
      .upsert(
        {
          user_id: user.id,
          movie_id: localCart.movieId,
          theatre_id: localCart.theatreId,
          show_id: localCart.showId,
          seats: localCart.seats,
          fulfilment_method: localCart.fulfilmentMethod,
          updated_at: new Date().toISOString()
        },
        { onConflict: 'user_id' }
      )
      .select('id')
      .single();

    if (cartError) throw cartError;
    if (!cart) return;

    // 2. Clear old cart items
    await supabase.from('cart_items').delete().eq('cart_id', cart.id);

    // 3. Insert new cart items
    if (localCart.items.length > 0) {
      const itemsToInsert = localCart.items.map((item) => ({
        cart_id: cart.id,
        snack_id: item.snackId,
        quantity: item.quantity,
        unit_price: item.unitPrice
      }));
      
      const { error: itemsError } = await supabase.from('cart_items').insert(itemsToInsert);
      if (itemsError) throw itemsError;
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error syncing cart to server:', error);
    return { success: false, error };
  }
}
