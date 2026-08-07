'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/lib/store/authStore';
import { Button } from '@/components/ui/button';
import { Phone, ChevronRight, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { setGuestMode, setDummyUserMode } = useAuthStore();
  
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendOtp = () => {
    if (phoneNumber.length < 10) return;
    setLoading(true);
    // Mock OTP send
    setTimeout(() => {
      setLoading(false);
      setOtpSent(true);
      setOtp('123456'); // Mock auto OTP fetch
    }, 1500);
  };

  const handleVerifyOtp = () => {
    setLoading(true);
    setTimeout(() => {
      document.cookie = "snacky_dummy_auth=true; path=/";
      setDummyUserMode(true);
      const searchParams = new URLSearchParams(window.location.search);
      const redirect = searchParams.get('redirect') || '/';
      router.push(redirect);
      router.refresh();
    }, 1000);
  };



  const handleGuest = () => {
    document.cookie = "snacky_guest_mode=true; path=/";
    setGuestMode(true);
    const searchParams = new URLSearchParams(window.location.search);
    const redirect = searchParams.get('redirect') || '/';
    router.push(redirect);
    router.refresh();
  };

  return (
    <main className="min-h-screen bg-background flex flex-col px-6 pt-16 pb-8">
      <div className="flex-1 flex flex-col justify-center max-w-md w-full mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 text-center"
        >
          <div className="w-16 h-16 bg-primary rounded-[20px] flex items-center justify-center mx-auto mb-6 shadow-[0_8px_32px_rgba(255,42,85,0.3)]">
            <span className="text-3xl font-bold text-white">S</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight mb-2">Welcome to Snacky</h1>
          <p className="text-muted text-sm">Your premium movie and snack experience</p>
        </motion.div>

        <AnimatePresence mode="wait">
          {!otpSent ? (
            <motion.div 
              key="phone-form"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4"
            >
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                <input
                  type="tel"
                  placeholder="Mobile Number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full h-14 bg-surface border border-border rounded-2xl pl-12 pr-4 text-foreground text-[16px] font-medium focus:border-primary focus:ring-1 focus:ring-[#FF2A55] transition-all outline-none placeholder:text-muted"
                />
              </div>
              <Button 
                onClick={handleSendOtp} 
                disabled={phoneNumber.length < 10 || loading}
                className="w-full h-14 bg-primary hover:bg-primary/90 text-white rounded-2xl text-[16px] font-bold gap-2 flex items-center justify-center"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Get OTP'}
              </Button>
            </motion.div>
          ) : (
            <motion.div 
              key="otp-form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="text-center mb-6">
                <p className="text-muted text-sm">Code sent to {phoneNumber}</p>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <button onClick={() => setOtpSent(false)} className="text-muted text-sm font-bold hover:text-foreground">Edit Number</button>
                  <span className="text-[#2A2D36]">•</span>
                  <button onClick={handleSendOtp} className="text-primary text-sm font-bold">Resend OTP</button>
                </div>
              </div>
              
              <div className="flex justify-center gap-2">
                {[0, 1, 2, 3, 4, 5].map((index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength={1}
                    value={otp[index] || ''}
                    readOnly
                    className="w-12 h-14 bg-surface border border-border rounded-xl text-center text-foreground text-xl font-bold focus:border-primary focus:ring-1 focus:ring-[#FF2A55] transition-all outline-none"
                  />
                ))}
              </div>

              <Button 
                onClick={handleVerifyOtp} 
                disabled={loading}
                className="w-full h-14 bg-primary hover:bg-primary/90 text-white rounded-2xl text-[16px] font-bold mt-6 gap-2 flex items-center justify-center"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verify & Login'}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-8 mb-8 flex items-center gap-4">
          <div className="flex-1 h-[1px] bg-[#2A2D36]" />
          <span className="text-muted text-[12px] font-bold uppercase tracking-wider">Or continue with</span>
          <div className="flex-1 h-[1px] bg-[#2A2D36]" />
        </div>

        <div className="space-y-3">
          <button className="w-full h-14 bg-surface hover:bg-[#2A2D36] border border-border rounded-2xl flex items-center justify-center gap-3 text-foreground text-[15px] font-semibold transition-colors">
            <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/><path d="M1 1h22v22H1z" fill="none"/></svg>
            Google
          </button>
          
          <button className="w-full h-14 bg-surface hover:bg-[#2A2D36] border border-border rounded-2xl flex items-center justify-center gap-3 text-foreground text-[15px] font-semibold transition-colors">
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.15 2.95.93 3.67 2.14-3.26 1.95-2.73 6.47.53 7.82-.76 1.62-1.63 3-2.85 4.05zm-4.32-15.5c-.24-2.61 2.3-5 5.08-4.78.43 2.82-2.67 5.17-5.08 4.78z" /></svg>
            Apple
          </button>
        </div>

        <div className="mt-8 space-y-3">


          <button 
            onClick={handleGuest}
            className="w-full h-14 border border-border hover:bg-surface rounded-2xl flex items-center justify-center gap-3 text-muted text-[15px] font-bold transition-colors"
          >
            Continue as Guest
            <ChevronRight className="w-4 h-4 opacity-50" />
          </button>
        </div>
      </div>
    </main>
  );
}

