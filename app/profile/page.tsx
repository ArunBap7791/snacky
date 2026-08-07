'use client';

import { useState } from 'react';
import { TopNavigation } from '@/components/ui/top-navigation';
import { useRouter } from 'next/navigation';
import { ProgressiveImage } from '@/components/ui/progressive-image';
import { Button } from '@/components/ui/button';
import { BottomSheet } from '@/components/ui/bottom-sheet';
import { mockUser, mockRewardSummary } from '@/lib/services/mockData';
import { useAuth } from '@/lib/hooks/useAuth';
import { useAuthStore } from '@/lib/store/authStore';
import { 
  Settings, CreditCard, Bell, HelpCircle, LogOut, 
  ChevronRight, Award, Ticket, Gift, MapPin, 
  Globe, Moon, Shield, FileText, Info, AlertTriangle, User
} from 'lucide-react';

export default function ProfilePage() {
  const { user, isGuest, signOut } = useAuth();
  const { clearAuthSession } = useAuthStore();
  const router = useRouter();

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleLogout = async () => {
    setShowLogoutConfirm(false);
    
    document.cookie = "snacky_guest_mode=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = "snacky_dummy_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    clearAuthSession();

    try {
      await signOut();
    } catch {
      // Ignore
    }
    
    router.push('/login');
    router.refresh();
  };

  const quickActions = [
    { id: 'bookings', icon: Ticket, title: 'My Bookings', desc: 'Upcoming & past', color: 'text-primary', bg: 'bg-primary/10', action: () => router.push('/bookings') },
    { id: 'rewards', icon: Gift, title: 'Rewards', desc: `${mockRewardSummary.currentXp} XP`, color: 'text-secondary', bg: 'bg-secondary/10', action: () => router.push('/rewards') },
    { id: 'theatres', icon: MapPin, title: 'Saved Theatres', desc: '3 locations', color: 'text-success', bg: 'bg-success/10', action: () => {} },
    { id: 'payments', icon: CreditCard, title: 'Payment Methods', desc: 'Manage cards', color: 'text-[#00B0FF]', bg: 'bg-[#00B0FF]/10', action: () => {} },
  ];

  return (
    <main className="min-h-screen bg-background pb-28 text-foreground">
      <TopNavigation title="Profile" />
      
      <div className="px-4 pt-2 pb-6 space-y-8">
        
        {isGuest ? (
          <div className="rounded-[24px] border border-border bg-surface p-6 shadow-lg text-center flex flex-col items-center">
            <div className="h-16 w-16 rounded-full bg-[#2A2D36] flex items-center justify-center mb-4 border border-[#3f4351]">
              <User className="h-8 w-8 text-muted" />
            </div>
            <h2 className="text-[20px] font-bold text-foreground">Guest User</h2>
            <p className="text-[13px] text-muted mt-1">You&apos;re currently browsing as Guest.</p>
            
            <div className="mt-6 w-full text-left bg-background border border-border rounded-[16px] p-4 space-y-3">
              <p className="text-[14px] font-bold text-foreground">Login to:</p>
              <div className="flex items-center gap-3 text-[13px] text-muted">
                <Ticket className="h-4 w-4 text-primary" /> View Booking History
              </div>
              <div className="flex items-center gap-3 text-[13px] text-muted">
                <Gift className="h-4 w-4 text-secondary" /> Earn Rewards
              </div>
              <div className="flex items-center gap-3 text-[13px] text-muted">
                <Globe className="h-4 w-4 text-[#00B0FF]" /> Sync bookings across devices
              </div>
            </div>

            <Button 
              className="w-full mt-6 h-[52px] rounded-[16px] bg-primary text-white hover:bg-[#ff1a46] font-bold flex items-center justify-center gap-2"
              onClick={() => router.push('/login')}
            >
              Login / Sign Up
            </Button>
          </div>
        ) : (
          <>
            {/* Profile Header */}
            <div className="rounded-[24px] border border-border bg-surface p-6 shadow-lg">
          <div className="flex gap-4 items-start">
            <div className="relative h-16 w-16 shrink-0 rounded-full bg-gradient-to-br from-[#FF2A55] to-[#FFD000] p-[2px]">
              <div className="h-full w-full rounded-full bg-surface flex items-center justify-center overflow-hidden">
                {user?.imageUrl ? (
                  <ProgressiveImage src={user.imageUrl} alt="Profile" className="absolute inset-0 h-full w-full object-cover rounded-full" />
                ) : (
                  <span className="text-xl font-bold text-foreground">{user?.firstName?.charAt(0) || 'U'}</span>
                )}
              </div>
            </div>
            
            <div className="flex-1 min-w-0 pt-1">
              <h2 className="text-[20px] font-bold text-foreground truncate">{user?.fullName || mockUser.fullName}</h2>
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              <p className="text-[13px] text-muted mt-0.5">{(user as any)?.primaryEmailAddress?.emailAddress || (user as any)?.email || mockUser.email}</p>
              <p className="text-[13px] text-muted">{mockUser.mobileNumber}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 mt-5 p-3 rounded-[12px] bg-gradient-to-r from-[#FFD000]/20 to-transparent border border-secondary/30">
            <Award className="h-5 w-5 text-secondary" />
            <div className="flex-1 flex items-center justify-between">
              <span className="text-[14px] font-bold text-foreground capitalize">{mockRewardSummary.tier} Member</span>
              <span className="text-[14px] font-bold text-secondary">{mockRewardSummary.currentXp} XP</span>
            </div>
          </div>
          
          <div className="mt-5 flex items-center justify-between">
            <span className="text-[12px] text-muted">Member since {new Date(mockUser.createdAt).getFullYear()}</span>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-[32px] text-[12px] font-bold rounded-[8px] border-border bg-transparent text-foreground hover:bg-[#2A2D36] flex items-center justify-center gap-2"
            >
              Edit Profile
            </Button>
          </div>
        </div>

        {/* Quick Actions */}
        <section>
          <h3 className="text-[18px] font-bold tracking-tight mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map(action => (
              <button 
                key={action.id}
                onClick={action.action}
                className="flex flex-col items-start p-4 rounded-[16px] border border-border bg-surface active:scale-[0.98] transition-all duration-200 hover:border-[#9498A6]"
              >
                <div className={`p-2 rounded-[12px] ${action.bg} ${action.color} mb-3`}>
                  <action.icon className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-[14px] text-foreground mb-0.5">{action.title}</h4>
                <p className="text-[12px] text-muted">{action.desc}</p>
              </button>
            ))}
            </div>
          </section>
          </>
        )}

        {/* Preferences */}
        <section>
          <h3 className="text-[18px] font-bold tracking-tight mb-4">Preferences</h3>
          <div className="rounded-[24px] border border-border bg-surface overflow-hidden">
            <div 
              className="flex items-center justify-between p-4 active:bg-[#2A2D36]/50 transition-colors border-b border-border cursor-pointer"
              onClick={() => setNotificationsEnabled(!notificationsEnabled)}
              role="button"
              tabIndex={0}
              aria-label="Toggle notifications"
            >
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-muted" />
                <span className="font-medium text-[15px]">Notifications</span>
              </div>
              <div className={`w-11 h-6 rounded-full relative transition-colors duration-300 ${notificationsEnabled ? 'bg-success' : 'bg-[#2A2D36]'}`}>
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform duration-300 ${notificationsEnabled ? 'left-6' : 'left-1'}`} />
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 active:bg-[#2A2D36]/50 transition-colors border-b border-border cursor-pointer">
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-muted" />
                <span className="font-medium text-[15px]">Location</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[13px] text-muted">New Delhi</span>
                <ChevronRight className="h-4 w-4 text-muted" />
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 active:bg-[#2A2D36]/50 transition-colors border-b border-border cursor-pointer">
              <div className="flex items-center gap-3">
                <Globe className="h-5 w-5 text-muted" />
                <span className="font-medium text-[15px]">Language</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[13px] text-muted">English</span>
                <ChevronRight className="h-4 w-4 text-muted" />
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 active:bg-[#2A2D36]/50 transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <Moon className="h-5 w-5 text-muted" />
                <span className="font-medium text-[15px]">Theme</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[13px] text-muted">Dark</span>
                <ChevronRight className="h-4 w-4 text-muted" />
              </div>
            </div>
          </div>
        </section>

        {/* Support */}
        <section>
          <h3 className="text-[18px] font-bold tracking-tight mb-4">Support</h3>
          <div className="rounded-[24px] border border-border bg-surface overflow-hidden">
            {[
              { icon: HelpCircle, label: 'Help Center' },
              { icon: Info, label: 'FAQs' },
              { icon: Settings, label: 'Contact Support' },
              { icon: AlertTriangle, label: 'Report a Problem' },
            ].map((item, i, arr) => (
              <div 
                key={i} 
                className={`flex items-center justify-between p-4 active:bg-[#2A2D36]/50 transition-colors cursor-pointer ${i !== arr.length - 1 ? 'border-b border-border' : ''}`}
                role="button"
                tabIndex={0}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="h-5 w-5 text-muted" />
                  <span className="font-medium text-[15px]">{item.label}</span>
                </div>
                <ChevronRight className="h-4 w-4 text-muted" />
              </div>
            ))}
          </div>
        </section>

        {/* Legal */}
        <section>
          <h3 className="text-[18px] font-bold tracking-tight mb-4">Legal</h3>
          <div className="rounded-[24px] border border-border bg-surface overflow-hidden">
            {[
              { icon: Shield, label: 'Privacy Policy' },
              { icon: FileText, label: 'Terms & Conditions' },
              { icon: Info, label: 'About Snacky' },
            ].map((item, i, arr) => (
              <div 
                key={i} 
                className={`flex items-center justify-between p-4 active:bg-[#2A2D36]/50 transition-colors cursor-pointer ${i !== arr.length - 1 ? 'border-b border-border' : ''}`}
                role="button"
                tabIndex={0}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="h-5 w-5 text-muted" />
                  <span className="font-medium text-[15px]">{item.label}</span>
                </div>
                <ChevronRight className="h-4 w-4 text-muted" />
              </div>
            ))}
          </div>
          <p className="text-center text-[12px] text-muted mt-4">App Version v1.0.0</p>
        </section>

        {/* Account */}
        {!isGuest && (
          <section className="pt-2">
            <Button 
              onClick={() => setShowLogoutConfirm(true)}
              className="w-full h-[56px] flex items-center justify-center gap-2 rounded-[16px] border border-[#FF5252]/30 bg-[#FF5252]/10 text-[#FF5252] hover:bg-[#FF5252]/20 font-bold text-[16px]"
            >
              <LogOut className="h-5 w-5" />
              Logout
            </Button>
          </section>
        )}

      </div>

      {/* Logout Confirmation Bottom Sheet */}
      <BottomSheet open={showLogoutConfirm} onClose={() => setShowLogoutConfirm(false)}>
        <div className="flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-300" onClick={e => e.stopPropagation()}>
          <div className="w-16 h-16 rounded-full bg-[#FF5252]/10 flex items-center justify-center mb-4">
            <LogOut className="w-8 h-8 text-[#FF5252]" />
          </div>
          <h3 className="text-[20px] font-bold text-foreground mb-2">Log out of Snacky?</h3>
          <p className="text-[14px] text-muted text-center mb-8">
            You will need to log back in to book tickets, order snacks, and access your rewards.
          </p>
          
          <div className="w-full space-y-3 pb-safe">
            <Button 
              onClick={handleLogout}
              className="w-full h-[56px] text-[16px] font-bold rounded-[16px] bg-[#FF5252] text-white hover:bg-[#FF5252]/90 flex items-center justify-center gap-2"
            >
              Yes, Logout
            </Button>
            <Button 
              onClick={() => setShowLogoutConfirm(false)}
              className="w-full h-[56px] text-[16px] font-bold rounded-[16px] border border-border bg-transparent text-foreground hover:bg-[#2A2D36] flex items-center justify-center gap-2"
            >
              Cancel
            </Button>
          </div>
        </div>
      </BottomSheet>

      <div className="pb-safe" />
    </main>
  );
}

