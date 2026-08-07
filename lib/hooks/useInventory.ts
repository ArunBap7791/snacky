import { useQuery } from '@tanstack/react-query';
import { 
  syncAndGetMovies, 
  syncAndGetTheatres, 
  syncAndGetShows, 
  syncAndGetSnacks 
} from '@/app/actions/inventory';

export function useMovies() {
  return useQuery({
    queryKey: ['movies'],
    queryFn: () => syncAndGetMovies(),
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });
}

export function useTheatres() {
  return useQuery({
    queryKey: ['theatres'],
    queryFn: () => syncAndGetTheatres(),
    staleTime: 1000 * 60 * 5,
  });
}

export function useShows(movieId: string, theatreId: string) {
  return useQuery({
    queryKey: ['shows', movieId, theatreId],
    queryFn: () => syncAndGetShows(movieId, theatreId),
    enabled: !!movieId && !!theatreId,
    staleTime: 1000 * 60 * 2,
  });
}

export function useSnacks(theatreId: string) {
  return useQuery({
    queryKey: ['snacks', theatreId],
    queryFn: () => syncAndGetSnacks(theatreId),
    enabled: !!theatreId,
    staleTime: 1000 * 60 * 10,
  });
}
