'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { TopNavigation } from '@/components/ui/top-navigation';
import { motion } from 'framer-motion';
import { useSafeMotion } from '@/lib/motion';
import { useCartStore } from '@/lib/store/cartStore';
import { createBooking, updateBooking, getBooking } from '@/lib/services/api';
import { useAuth } from '@/lib/hooks/useAuth';
import { Booking } from '@/lib/types/domain';
import { deriveBookingContext } from '@/lib/utils/booking-context';
import { Skeleton } from '@/components/ui/skeleton';
import { useShallow } from 'zustand/react/shallow';
import { CheckCircle2 } from 'lucide-react';
import { successPulseVariants } from '@/lib/motion';
import { AnimatePresence } from 'framer-motion';
import { useIsMounted } from '@/lib/hooks/useIsMounted';

export default function PaymentPage() {
  const router = useRouter();
  const { existingBookingId, seats, movieId, theatreId, showId, items, fulfilmentMethod, getTotalAmount } = useCartStore(
    useShallow((state) => ({
      existingBookingId: state.existingBookingId,
      seats: state.seats,
      movieId: state.movieId,
      theatreId: state.theatreId,
      showId: state.showId,
      items: state.items,
      fulfilmentMethod: state.fulfilmentMethod,
      getTotalAmount: state.getTotalAmount
    }))
  );
  
  const { chipVariants, pageVariants, cardPressVariants } = useSafeMotion();
  const { user, isSignedIn } = useAuth();
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success'>('idle');
  const [activeMethod, setActiveMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [existingBooking, setExistingBooking] = useState<Booking | null>(null);
  const isMounted = useIsMounted();

  useEffect(() => {
    if (existingBookingId) {
      getBooking(existingBookingId).then(data => {
        if (data) setExistingBooking(data);
      });
    }
  }, [existingBookingId]);

  useEffect(() => {
    if ((!seats || seats.length === 0) && items.length === 0) {
      router.push('/cart');
    }
  }, [seats, items, router]);

  const context = deriveBookingContext(existingBookingId, existingBooking, { movieId, seats });
  const isLoadingExistingBooking = context.isLoading;

  const ticketTotal = context.isStandaloneSnackOrder || context.isExistingBooking ? 0 : (seats?.length || 0) * 250;
  const snackTotal = getTotalAmount();
  const fee = context.isStandaloneSnackOrder || context.isExistingBooking ? 0 : 30; 
  const deliveryFee = (fulfilmentMethod === 'seat_delivery' && context.existingFulfilmentMethod !== 'seat_delivery') ? 50 : 0;
  const total = ticketTotal + snackTotal + fee + deliveryFee;

  const handlePayment = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!isSignedIn) {
      router.push(`/login?redirect=${encodeURIComponent('/checkout/payment')}`);
      return;
    }
    if (!user || paymentStatus !== 'idle') return;
    setPaymentStatus('processing');
    
    try {
      let booking;
      if (context.isExistingBooking && existingBookingId) {
        booking = await updateBooking(existingBookingId, {
          newSnacks: items,
          fulfilmentMethod: fulfilmentMethod
        });
      } else {
        booking = await createBooking({
          userId: user.id,
          movieId: movieId,
          theatreId: theatreId,
          showId: showId,
          seats: seats,
          snackItems: items,
          fulfilmentMethod: fulfilmentMethod,
          totalAmount: total
        });
      }
      
      setPaymentStatus('success');
      setTimeout(() => {
        router.push(`/checkout/confirmation?id=${booking.id}`);
      }, 1000); // Wait for success animation
    } catch (e) {
      console.error(e);
      alert('Payment processing error, try again!');
      setPaymentStatus('idle');
    }
  };

  if (!isMounted || isLoadingExistingBooking) {
    return (
      <main className="min-h-screen bg-background pb-[100px] text-foreground overflow-x-hidden flex flex-col items-center py-10 px-4">
        <Skeleton className="h-8 w-64 mb-6" />
        <Skeleton className="h-40 w-full mb-6 rounded-[24px]" />
        <Skeleton className="h-24 w-full rounded-[24px]" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background pb-[100px] text-foreground overflow-x-hidden">
      <TopNavigation title="Payment" showBack />
      
      <motion.div 
        variants={pageVariants}
        initial="initial"
        animate="animate"
        className="px-4 py-6"
      >
        <div className="mb-6 rounded-[24px] bg-surface p-6 text-center border border-border shadow-sm flex flex-col items-center">
          <div className="text-primary text-[18px] uppercase tracking-widest font-black mb-2">Amount Payable</div>
          <div className="text-[40px] font-black text-foreground tracking-tighter">₹{total}</div>
        </div>
        
        <h3 className="text-[18px] font-bold tracking-tight mb-4 text-foreground">Select Payment Method</h3>
        
        <div className="flex flex-col gap-4">
          {/* UPI */}
          <div className={`overflow-hidden rounded-[20px] border transition-all duration-300 ${activeMethod === 'upi' ? 'border-primary bg-surface' : 'border-border bg-surface'}`}>
            <motion.div 
              variants={cardPressVariants}
              whileTap="tap"
              className="p-5 flex items-center justify-between cursor-pointer"
              onClick={() => setActiveMethod('upi')}
            >
              <div className="flex items-center gap-3">
                <div className={`flex h-6 w-6 items-center justify-center rounded-full border-2 transition-colors ${activeMethod === 'upi' ? 'border-primary' : 'border-border'}`}>
                  {activeMethod === 'upi' && <div className="h-2.5 w-2.5 rounded-full bg-primary" />}
                </div>
                <span className="font-bold text-[16px] text-foreground">UPI</span>
              </div>
            </motion.div>
            
            <div className={`transition-all duration-500 ease-in-out ${activeMethod === 'upi' ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'}`}>
              <div className="px-5 pb-5">
                <div className="flex items-center gap-4 mb-5 border-t border-border pt-5">
                  {/* Mock Icons for UPI Apps */}
                  <motion.div variants={chipVariants} whileHover="hover" whileTap="tap" className="flex flex-col items-center gap-1.5 cursor-pointer">
                    <div className="h-12 w-12 rounded-full bg-[#2A2D36] flex items-center justify-center text-[10px] font-bold">GPay</div>
                  </motion.div>
                  <motion.div variants={chipVariants} whileHover="hover" whileTap="tap" className="flex flex-col items-center gap-1.5 cursor-pointer">
                    <div className="h-12 w-12 rounded-full bg-[#2A2D36] flex items-center justify-center text-[10px] font-bold">PhonePe</div>
                  </motion.div>
                  <motion.div variants={chipVariants} whileHover="hover" whileTap="tap" className="flex flex-col items-center gap-1.5 cursor-pointer">
                    <div className="h-12 w-12 rounded-full bg-[#2A2D36] flex items-center justify-center text-[10px] font-bold text-secondary">Paytm</div>
                  </motion.div>
                  <motion.div variants={chipVariants} whileHover="hover" whileTap="tap" className="flex flex-col items-center gap-1.5 cursor-pointer">
                    <div className="h-12 w-12 rounded-full bg-[#2A2D36] flex items-center justify-center text-[10px] font-bold text-[#4CAF50]">BHIM</div>
                  </motion.div>
                </div>
                
                <form onSubmit={handlePayment} className="space-y-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[12px] font-medium text-muted">Enter UPI ID</label>
                    <input 
                      type="text" 
                      placeholder="e.g. mobilenumber@upi" 
                      className="w-full bg-background border border-border rounded-[12px] h-[52px] px-4 text-foreground text-[15px] focus:outline-none focus:border-primary"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className={`w-full h-[52px] rounded-[16px] text-white font-bold text-[16px] flex items-center justify-center gap-2 transition-colors ${paymentStatus === 'success' ? 'bg-[#4CAF50]' : 'bg-primary'}`}
                    disabled={paymentStatus !== 'idle'}
                    isLoading={paymentStatus === 'processing'}
                  >
                    {paymentStatus === 'success' ? <CheckCircle2 className="h-5 w-5" /> : 'Continue with UPI'}
                  </Button>
                </form>
              </div>
            </div>
          </div>

          {/* Credit / Debit Card */}
          <div className={`overflow-hidden rounded-[20px] border transition-all duration-300 ${activeMethod === 'card' ? 'border-primary bg-surface' : 'border-border bg-surface'}`}>
            <motion.div 
              variants={cardPressVariants}
              whileTap="tap"
              className="p-5 flex items-center justify-between cursor-pointer"
              onClick={() => setActiveMethod('card')}
            >
              <div className="flex items-center gap-3">
                <div className={`flex h-6 w-6 items-center justify-center rounded-full border-2 transition-colors ${activeMethod === 'card' ? 'border-primary' : 'border-border'}`}>
                  {activeMethod === 'card' && <div className="h-2.5 w-2.5 rounded-full bg-primary" />}
                </div>
                <span className="font-bold text-[16px] text-foreground">Credit / Debit Card</span>
              </div>
            </motion.div>
            
            <div className={`transition-all duration-500 ease-in-out ${activeMethod === 'card' ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
              <div className="px-5 pb-5">
                <form onSubmit={handlePayment} className="space-y-4 border-t border-border pt-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[12px] font-medium text-muted">Card Number</label>
                    <input 
                      type="text" 
                      placeholder="0000 0000 0000 0000" 
                      className="w-full bg-background border border-border rounded-[12px] h-[52px] px-4 text-foreground text-[15px] focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[12px] font-medium text-muted">Card Holder Name</label>
                    <input 
                      type="text" 
                      placeholder="Name on card" 
                      className="w-full bg-background border border-border rounded-[12px] h-[52px] px-4 text-foreground text-[15px] focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div className="flex gap-4">
                    <div className="flex flex-col gap-1.5 flex-1">
                      <label className="text-[12px] font-medium text-muted">Expiry Date</label>
                      <input 
                        type="text" 
                        placeholder="MM/YY" 
                        className="w-full bg-background border border-border rounded-[12px] h-[52px] px-4 text-foreground text-[15px] focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5 flex-1">
                      <label className="text-[12px] font-medium text-muted">CVV</label>
                      <input 
                        type="password" 
                        placeholder="•••" 
                        className="w-full bg-background border border-border rounded-[12px] h-[52px] px-4 text-foreground text-[15px] focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>
                  <Button 
                    type="submit" 
                    className={`w-full h-[52px] rounded-[16px] text-white font-bold text-[16px] mt-2 flex items-center justify-center gap-2 transition-colors ${paymentStatus === 'success' ? 'bg-[#4CAF50]' : 'bg-primary'}`}
                    disabled={paymentStatus !== 'idle'}
                    isLoading={paymentStatus === 'processing'}
                  >
                    {paymentStatus === 'success' ? <CheckCircle2 className="h-5 w-5" /> : `Pay ₹${total}`}
                  </Button>
                </form>
              </div>
            </div>
          </div>

          {/* Net Banking */}
          <div className={`overflow-hidden rounded-[20px] border transition-all duration-300 ${activeMethod === 'netbanking' ? 'border-primary bg-surface' : 'border-border bg-surface'}`}>
            <motion.div 
              variants={cardPressVariants}
              whileTap="tap"
              className="p-5 flex items-center justify-between cursor-pointer"
              onClick={() => setActiveMethod('netbanking')}
            >
              <div className="flex items-center gap-3">
                <div className={`flex h-6 w-6 items-center justify-center rounded-full border-2 transition-colors ${activeMethod === 'netbanking' ? 'border-primary' : 'border-border'}`}>
                  {activeMethod === 'netbanking' && <div className="h-2.5 w-2.5 rounded-full bg-primary" />}
                </div>
                <span className="font-bold text-[16px] text-foreground">Net Banking</span>
              </div>
            </motion.div>
            
            <div className={`transition-all duration-500 ease-in-out ${activeMethod === 'netbanking' ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'}`}>
              <div className="px-5 pb-5">
                <form onSubmit={handlePayment} className="space-y-4 border-t border-border pt-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[12px] font-medium text-muted">Select Bank</label>
                    <div className="relative">
                      <select className="w-full bg-background border border-border rounded-[12px] h-[52px] px-4 text-foreground text-[15px] focus:outline-none focus:border-primary appearance-none cursor-pointer">
                        <option>State Bank of India</option>
                        <option>HDFC Bank</option>
                        <option>ICICI Bank</option>
                        <option>Axis Bank</option>
                        <option>Kotak Mahindra Bank</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted">
                        ▼
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[12px] font-medium text-muted">Account Holder Name</label>
                    <input 
                      type="text" 
                      placeholder="Name on account" 
                      className="w-full bg-background border border-border rounded-[12px] h-[52px] px-4 text-foreground text-[15px] focus:outline-none focus:border-primary"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className={`w-full h-[52px] rounded-[16px] text-white font-bold text-[16px] mt-2 flex items-center justify-center gap-2 transition-colors ${paymentStatus === 'success' ? 'bg-[#4CAF50]' : 'bg-primary'}`}
                    disabled={paymentStatus !== 'idle'}
                    isLoading={paymentStatus === 'processing'}
                  >
                    {paymentStatus === 'success' ? <CheckCircle2 className="h-5 w-5" /> : `Pay ₹${total}`}
                  </Button>
                </form>
              </div>
            </div>
          </div>

        </div>
      </motion.div>


      <AnimatePresence>
        {paymentStatus === 'success' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-background/90 backdrop-blur-md"
          >
            <motion.div 
              variants={successPulseVariants}
              initial="initial"
              animate="animate"
              className="flex flex-col items-center justify-center gap-4"
            >
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#4CAF50]/10">
                <CheckCircle2 className="h-12 w-12 text-[#4CAF50]" />
              </div>
              <h2 className="text-[24px] font-bold text-foreground">Payment Successful</h2>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

