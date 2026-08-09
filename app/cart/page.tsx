'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { TopNavigation } from '@/components/ui/top-navigation';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/lib/store/cartStore';
import { getSnacksForTheatre, getMovie, getTheatre, getShow } from '@/lib/services/api';
import { Snack, Movie, Theatre, Show } from '@/lib/types/domain';
// Removed useUser
import { MapPin, Calendar, Clock3, Plus, Minus, Trash2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { ProgressiveImage } from '@/components/ui/progressive-image';
import { EmptyState } from '@/components/ui/empty-state';
import { SnackCard } from '@/components/ui/snack-card';
import { motion, AnimatePresence } from 'framer-motion';
import { useSafeMotion } from '@/lib/motion';

import { useShallow } from 'zustand/react/shallow';

export default function CartPage() {
  const router = useRouter();
  const {
    theatreId,
    movieId,
    showId,
    seats,
    items,
    getTotalAmount,
    updateSnackQuantity,
    addSnack,
    removeSnack
  } = useCartStore(
    useShallow((state) => ({
      theatreId: state.theatreId,
      movieId: state.movieId,
      showId: state.showId,
      seats: state.seats,
      items: state.items,
      getTotalAmount: state.getTotalAmount,
      updateSnackQuantity: state.updateSnackQuantity,
      addSnack: state.addSnack,
      removeSnack: state.removeSnack
    }))
  );
  // Auth check moved to payment
  const [snacks, setSnacks] = useState<Snack[]>([]);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [theatre, setTheatre] = useState<Theatre | null>(null);
  const [show, setShow] = useState<Show | null>(null);
  const [loading, setLoading] = useState(true);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const { pageVariants } = useSafeMotion();

  useEffect(() => {
    const fetchData = async () => {
      if (theatreId) {
        const data = await getSnacksForTheatre(theatreId);
        setSnacks(data);
        
        const theatreData = await getTheatre(theatreId);
        if (theatreData) setTheatre(theatreData);
      }
      if (movieId) {
        const movieData = await getMovie(movieId);
        if (movieData) setMovie(movieData);
      }
      if (showId) {
        const showData = await getShow(showId);
        if (showData) setShow(showData);
      }
      setLoading(false);
    };
    fetchData();
  }, [theatreId, movieId, showId]);

  const handleCheckout = () => {
    router.push('/checkout');
  };

  const isDirectSnackOrder = !movieId || !seats || seats.length === 0;
  const ticketTotal = isDirectSnackOrder ? 0 : (seats?.length || 0) * 250; // Mock 250 per seat
  const snackTotal = getTotalAmount();
  const fee = isDirectSnackOrder ? 0 : 30; // Convenience fee
  const total = ticketTotal + snackTotal + fee;

  if (loading) {
    return (
      <main className="min-h-screen bg-background pb-[100px] text-foreground overflow-x-hidden">
        <TopNavigation title="Your Cart" showBack />
        <div className="px-4 py-6 space-y-6">
          <section>
            <h3 className="text-[16px] font-bold tracking-tight text-foreground mb-3 border-b border-border pb-2">Tickets</h3>
            <div className="rounded-[16px] border border-border bg-surface p-4 flex gap-4">
              <Skeleton className="h-[100px] w-[70px] rounded-[8px]" />
              <div className="flex flex-col flex-1 space-y-2 py-1">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-1/3 mt-2" />
              </div>
            </div>
          </section>
          <section>
            <h3 className="text-[16px] font-bold tracking-tight text-foreground mb-3 border-b border-border pb-2">Snacks</h3>
            <div className="flex flex-col gap-3">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="flex items-center justify-between rounded-[12px] bg-surface border border-border p-3">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-14 w-14 rounded-[8px]" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                  <Skeleton className="h-4 w-8" />
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background pb-[180px] text-foreground overflow-x-hidden">
      <TopNavigation title="Your Cart" showBack />
      
      <motion.div 
        variants={pageVariants}
        initial="initial"
        animate="animate"
        className="px-4 pt-4 pb-6 space-y-6"
      >
        
        {/* Ticket Summary */}
        {seats && seats.length > 0 && (
          <section>
            <h3 className="text-[16px] font-bold tracking-tight text-foreground mb-3 border-b border-border pb-2">Tickets</h3>
            <div className="rounded-[16px] border border-border bg-surface p-4 flex gap-4">
              <div className="relative h-[100px] w-[70px] shrink-0 rounded-[8px] overflow-hidden bg-[#2A2D36]">
                {movie?.posterUrl ? (
                  <ProgressiveImage src={movie.posterUrl} alt={movie.title} className="absolute inset-0 h-full w-full object-cover" />
                ) : null}
              </div>
              <div className="flex flex-col flex-1">
                <h4 className="font-bold text-[16px] line-clamp-1">{movie?.title}</h4>
                <div className="mt-2 space-y-1 text-[12px] text-muted">
                  <div className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> <span className="line-clamp-1">{theatre?.name}</span></div>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> {show?.date || 'Today'}</span>
                    <span className="flex items-center gap-1.5"><Clock3 className="h-3.5 w-3.5" /> {show?.startTime || '10:00'}</span>
                  </div>
                </div>
                <div className="mt-3 text-[13px] font-medium text-foreground">
                  {seats.length} Tickets • {seats.map(s => s.split('_').pop()).join(', ')}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Selected Snacks Summary */}
        {items.length > 0 && (
          <section>
            <h3 className="text-[16px] font-bold tracking-tight text-foreground mb-3 border-b border-border pb-2">Selected Snacks</h3>
            <div className="flex flex-col gap-3">
              {items.map(item => {
                const snackDetails = snacks.find(s => s.id === item.snackId);
                if (!snackDetails) return null;
                return (
                  <div key={item.id} className="flex items-center justify-between rounded-[12px] bg-surface border border-border p-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-14 w-14 shrink-0 rounded-[8px] overflow-hidden bg-[#2A2D36]">
                        {snackDetails.imageUrl && <ProgressiveImage src={snackDetails.imageUrl} alt={snackDetails.name} className="absolute inset-0 h-full w-full object-cover" />}
                      </div>
                      <div>
                        <div className="font-bold text-[13px] line-clamp-1">{snackDetails.name}</div>
                        <div className="text-[12px] text-muted">₹{item.unitPrice}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center bg-[#2A2D36] rounded-full p-1 border border-[#3f4351]">
                        <button 
                          className="h-8 w-8 rounded-full bg-surface flex items-center justify-center text-foreground active:scale-95"
                          onClick={() => {
                            if (item.quantity > 1) updateSnackQuantity(item.snackId, item.quantity - 1);
                            else setItemToDelete(item.snackId);
                          }}
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-8 text-center text-[14px] font-bold text-foreground">{item.quantity}</span>
                        <button 
                          className="h-8 w-8 rounded-full bg-surface flex items-center justify-center text-foreground active:scale-95"
                          onClick={() => updateSnackQuantity(item.snackId, item.quantity + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <button 
                        className="h-8 w-8 rounded-full flex items-center justify-center text-muted hover:text-primary hover:bg-primary/10 active:scale-95 transition-colors"
                        onClick={() => setItemToDelete(item.snackId)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Frequently Added Snacks */}
        {snacks.length > 0 && theatreId && (
          <section>
            <h3 className="text-[16px] font-bold tracking-tight text-foreground mb-3 border-b border-border pb-2">Frequently Added Snacks</h3>
            <div className="-mx-4 flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x scroll-fade-x px-4 scroll-pl-4 pt-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {snacks.filter(s => !items.find(i => i.snackId === s.id)).map(snack => (
                <div key={snack.id} className="w-[44vw] max-w-[180px] shrink-0 snap-start">
                  <SnackCard 
                    name={snack.name}
                    price={snack.price}
                    isVeg={snack.isVeg}
                    allergens={snack.allergens}
                    imageUrl={snack.imageUrl}
                    onAdd={() => addSnack(snack.id, snack.price, theatreId!)}
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Charges Breakdown */}
        {(items.length > 0 || (seats && seats.length > 0)) && (
          <section>
            <h3 className="text-[16px] font-bold tracking-tight text-foreground mb-3 border-b border-border pb-2">Charges Breakdown</h3>
            <div className="rounded-[16px] border border-border bg-surface p-4 text-[13px] space-y-3">
              {ticketTotal > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted">Tickets ({seats?.length})</span>
                  <span className="font-medium">₹{ticketTotal}</span>
                </div>
              )}
              {snackTotal > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted">Snacks ({items.reduce((a, b) => a + b.quantity, 0)})</span>
                  <span className="font-medium">₹{snackTotal}</span>
                </div>
              )}
              {!isDirectSnackOrder && (
                <div className="flex justify-between">
                  <span className="text-muted">Convenience Fee</span>
                  <span className="font-medium">₹{fee}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-border pt-3 text-[16px] font-bold text-foreground">
                <span>Grand Total</span>
                <span>₹{total}</span>
              </div>
            </div>
          </section>
        )}

      {(items.length === 0 && (!seats || seats.length === 0)) && (
          <div className="py-20 flex justify-center">
            <EmptyState 
              title="Your cart is empty" 
              description="Looks like you haven't added any items to your cart yet." 
              image={<Image src="/assets/Corny%20Bombs/Corny%20Confused.png" alt="Empty" fill className="object-contain" />}
              action={<Button onClick={() => router.push('/')} className="rounded-full px-8 bg-primary text-white font-bold">Browse Movies</Button>}
            />
          </div>
        )}

      </motion.div>

      {(items.length > 0 || (seats && seats.length > 0)) && (
        <div 
          className="fixed left-0 right-0 border-t border-border/50 bg-surface/90 backdrop-blur-md px-4 py-4 z-40 mx-auto max-w-md w-full"
          style={{ bottom: 'calc(72px + env(safe-area-inset-bottom))' }}
        >
          <Button 
            className="w-full h-[52px] text-[16px] font-bold rounded-[16px] flex items-center justify-center gap-2 overflow-hidden"
            onClick={handleCheckout}
          >
            <span>Continue</span>
            <div className="flex flex-row items-center">
              <span>₹</span>
              <div className="relative inline-flex items-center text-left min-w-[32px]">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={total}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 top-1/2 -translate-y-1/2"
                  >
                    {total}
                  </motion.span>
                </AnimatePresence>
              </div>
            </div>
          </Button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {itemToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-surface border border-border rounded-[24px] p-6 w-full max-w-sm shadow-2xl">
            <h3 className="text-[18px] font-bold tracking-tight text-foreground mb-2">Remove Item?</h3>
            <p className="text-[14px] text-muted mb-6">Are you sure you want to remove this item?</p>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="flex-1 rounded-[12px] h-[48px] border-border text-foreground hover:bg-[#2A2D36] font-bold"
                onClick={() => setItemToDelete(null)}
              >
                Cancel
              </Button>
              <Button 
                className="flex-1 rounded-[12px] h-[48px] bg-primary text-white hover:bg-primary/90 font-bold"
                onClick={() => {
                  removeSnack(itemToDelete);
                  setItemToDelete(null);
                }}
              >
                Remove
              </Button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

