'use server';

import { createAdminClient } from '@/lib/supabase/server';
import { partnerProvider } from '@/lib/services/partner/MockPartnerProvider';
import { Movie, Theatre, Show, Snack } from '@/lib/types/domain';

/**
 * Fetches movies from Partner Provider, syncs them to Supabase, and returns them.
 */
export async function syncAndGetMovies(): Promise<Movie[]> {
  const supabase = createAdminClient();
  const movies = await partnerProvider.getMovies();

  // Upsert to Supabase
  if (movies.length > 0) {
    const { error } = await supabase.from('movies').upsert(
      movies.map(m => ({
        id: m.id,
        title: m.title,
        language: m.language,
        genre: m.genre,
        duration_minutes: m.durationMinutes,
        rating: m.rating,
        poster_url: m.posterUrl,
        description: m.description,
        updated_at: new Date().toISOString()
      }))
    );
    if (error) console.error('Failed to sync movies:', error);
  }

  return movies;
}

export async function syncAndGetTheatres(): Promise<Theatre[]> {
  const supabase = createAdminClient();
  const theatres = await partnerProvider.getTheatres();

  if (theatres.length > 0) {
    const { error } = await supabase.from('theatres').upsert(
      theatres.map(t => ({
        id: t.id,
        name: t.name,
        address: t.address,
        latitude: t.latitude,
        longitude: t.longitude,
        partner_id: t.partnerId,
        available_facilities: t.availableFacilities,
        supports_seat_delivery: t.supportsSeatDelivery,
        updated_at: new Date().toISOString()
      }))
    );
    if (error) console.error('Failed to sync theatres:', error);
  }

  return theatres;
}

export async function syncAndGetShows(movieId: string, theatreId: string): Promise<Show[]> {
  const supabase = createAdminClient();
  const shows = await partnerProvider.getShows(movieId, theatreId);

  if (shows.length > 0) {
    const { error } = await supabase.from('shows').upsert(
      shows.map(s => ({
        id: s.id,
        movie_id: s.movieId,
        theatre_id: s.theatreId,
        screen: s.screen,
        date: s.date,
        start_time: s.startTime,
        end_time: s.endTime,
        seat_layout: s.seatLayout,
        updated_at: new Date().toISOString()
      }))
    );
    if (error) console.error('Failed to sync shows:', error);
  }

  return shows;
}

export async function syncAndGetSnacks(theatreId: string): Promise<Snack[]> {
  const supabase = createAdminClient();
  const snacks = await partnerProvider.getSnacks(theatreId);

  if (snacks.length > 0) {
    const { error } = await supabase.from('snacks').upsert(
      snacks.map(s => ({
        id: s.id,
        theatre_id: s.theatreId,
        category: s.category,
        name: s.name,
        description: s.description,
        price: s.price,
        is_veg: s.isVeg,
        availability: s.availability,
        image_url: s.imageUrl,
        updated_at: new Date().toISOString()
      }))
    );
    if (error) console.error('Failed to sync snacks:', error);
  }

  return snacks;
}
