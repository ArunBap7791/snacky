'use client';

import { useState } from 'react';
import { useSignIn } from '@clerk/nextjs';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import { Button } from '@/components/ui/button';
import { User, Mail, Apple, ArrowRight, Loader2, ArrowLeft } from 'lucide-react';

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signIn, isLoaded } = useSignIn();
  const { setGuestMode, setDummyUserMode } = useAuthStore();
  
  const loginAsDummy = () => {
    setDummyUserMode(true);
  };
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const redirectUrl = searchParams.get('redirect_url') || '/';

  const handleContinueAsGuest = () => {
    setGuestMode(true);
    router.push(redirectUrl);
  };

  const handleDummyLogin = () => {
    loginAsDummy();
    router.push(redirectUrl);
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 10) return;
    setIsLoading(true);
    
    // Mocking OTP fetch for non-Clerk test numbers
    setTimeout(() => {
      setStep('otp');
      setOtp('123456'); // Auto Fetch OTP (Mock)
      setIsLoading(false);
    }, 1500);
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate verification
    setTimeout(() => {
      handleDummyLogin();
    }, 1500);
  };

  const handleOAuth = (strategy: 'oauth_google' | 'oauth_apple') => {
    if (!isLoaded) return;
    signIn.authenticateWithRedirect({
      strategy,
      redirectUrl: '/sso-callback',
      redirectUrlComplete: redirectUrl,
    });
  };

  return (
    <main className="flex min-h-screen flex-col bg-background p-4 text-foreground">
      <div className="flex-1 w-full max-w-md mx-auto flex flex-col justify-center">
        
        <div className="mb-8 text-center space-y-2">
          <div className="mx-auto h-16 w-16 bg-primary rounded-[16px] flex items-center justify-center mb-6 shadow-[0_8px_32px_rgba(255,42,85,0.3)]">
            <span className="font-black text-2xl text-white tracking-tighter">Sn</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome to Snacky</h1>
          <p className="text-muted text-sm">Your premium cinema companion.</p>
        </div>

        <div className="bg-surface border border-border rounded-[24px] p-6 shadow-xl">
          {step === 'phone' ? (
            <form onSubmit={handlePhoneSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-muted">Mobile Number</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground font-medium">+91</span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="Enter mobile number"
                    className="w-full h-[52px] bg-background border border-border rounded-[16px] pl-12 pr-4 text-[15px] font-medium text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-[#FF2A55] transition-all"
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={phone.length < 10 || isLoading}
                className="w-full h-[52px] rounded-[16px] bg-primary text-white font-bold text-[16px] shadow-[0_4px_12px_rgba(255,42,85,0.25)] hover:bg-[#ff1a46] transition-all disabled:opacity-50 gap-4 flex items-center justify-center"
              >
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Get OTP'}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleOtpSubmit} className="space-y-4">
              <div className="flex items-center gap-3 mb-2 cursor-pointer" onClick={() => setStep('phone')}>
                <ArrowLeft className="h-4 w-4 text-muted" />
                <span className="text-[13px] font-medium text-muted">+91 {phone}</span>
              </div>
              
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-muted">Enter OTP</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  className="w-full h-[52px] bg-background border border-border rounded-[16px] px-4 text-center text-[20px] tracking-[0.5em] font-bold text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-[#FF2A55] transition-all"
                />
                <p className="text-[11px] text-success text-center font-medium mt-2 animate-pulse">Auto-fetched OTP successfully</p>
              </div>

              <Button 
                type="submit" 
                disabled={otp.length < 6 || isLoading}
                className="w-full h-[52px] rounded-[16px] bg-primary text-white font-bold text-[16px] shadow-[0_4px_12px_rgba(255,42,85,0.25)] hover:bg-[#ff1a46] transition-all disabled:opacity-50 gap-4 flex items-center justify-center"
              >
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Verify & Login'}
              </Button>
            </form>
          )}

          <div className="relative flex items-center py-6">
            <div className="flex-grow border-t border-border"></div>
            <span className="flex-shrink-0 mx-4 text-muted text-[13px] font-medium">Or continue with</span>
            <div className="flex-grow border-t border-border"></div>
          </div>

          <div className="space-y-3">
            <Button 
              type="button"
              variant="outline"
              onClick={() => handleOAuth('oauth_google')}
              className="w-full h-[52px] rounded-[16px] bg-background border border-border hover:bg-[#2A2D36] text-foreground font-bold transition-all flex items-center justify-center gap-4"
            >
              <Mail className="h-5 w-5" /> Google
            </Button>
            
            <Button 
              type="button"
              variant="outline"
              onClick={() => handleOAuth('oauth_apple')}
              className="w-full h-[52px] rounded-[16px] bg-background border border-border hover:bg-[#2A2D36] text-foreground font-bold transition-all flex items-center justify-center gap-4"
            >
              <Apple className="h-5 w-5" /> Apple
            </Button>
            
            <Button 
              type="button"
              variant="outline"
              onClick={handleDummyLogin}
              className="w-full h-[52px] rounded-[16px] bg-[#2A2D36] border-transparent hover:bg-[#3A3D46] text-secondary font-bold transition-all flex items-center justify-center gap-4"
            >
              <User className="h-5 w-5" /> Login as Dummy User
            </Button>
          </div>
        </div>

        <div className="mt-8">
          <Button 
            type="button"
            variant="ghost"
            onClick={handleContinueAsGuest}
            className="w-full h-[52px] rounded-[16px] bg-transparent text-muted hover:text-foreground hover:bg-surface font-bold text-[15px] transition-all flex items-center justify-center gap-4"
          >
            Continue as Guest <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

      </div>
    </main>
  );
}

