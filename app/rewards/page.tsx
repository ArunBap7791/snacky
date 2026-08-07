'use client';

import { useEffect, useState } from 'react';
import { ProgressiveImage } from '@/components/ui/progressive-image';
import { useRouter } from 'next/navigation';
import { TopNavigation } from '@/components/ui/top-navigation';
import { getUserRewards } from '@/lib/services/api';
import { RewardSummary } from '@/lib/types/domain';
import { RewardCard } from '@/components/ui/reward-card';
import { Button } from '@/components/ui/button';
import { BottomSheet } from '@/components/ui/bottom-sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { BottomNavigation } from '@/components/ui/bottom-navigation';
import { Award, Star, Ticket, Coffee, Gift, ChevronRight, CheckCircle2, History, X } from 'lucide-react';
import { useAuth } from '@/lib/hooks/useAuth';

export default function RewardsPage() {
  const router = useRouter();
  const [rewards, setRewards] = useState<RewardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedReward, setSelectedReward] = useState<NonNullable<RewardSummary['availableRewards']>[0] | null>(null);
  const [showProgress, setShowProgress] = useState(false);
  const { isSignedIn, isGuest } = useAuth();

  useEffect(() => {
    if (isGuest) {
      router.push('/sign-in?redirect_url=/rewards');
      return;
    }
    getUserRewards().then(data => {
      setRewards(data);
      setLoading(false);
      // Trigger progress bar animation after load
      setTimeout(() => setShowProgress(true), 100);
    });
  }, [isGuest, router]);

  if (isGuest) return null;

  const getTierFromXp = (xp: number) => {
    if (xp >= 5000) return 'platinum';
    if (xp >= 2500) return 'gold';
    if (xp >= 1000) return 'silver';
    return 'member';
  };

  const getNextTierInfo = (tier: string) => {
    if (tier === 'platinum') return { next: 'Max Tier', points: 5000, currentBase: 5000 };
    if (tier === 'gold') return { next: 'Platinum', points: 5000, currentBase: 2500 };
    if (tier === 'silver') return { next: 'Gold', points: 2500, currentBase: 1000 };
    return { next: 'Silver', points: 1000, currentBase: 0 };
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-background pb-24">
        <TopNavigation title="Rewards" />
        <div className="px-4 py-6 space-y-8">
          <Skeleton className="h-[200px] w-full rounded-[24px]" />
          <Skeleton className="h-[60px] w-full rounded-[16px]" />
          <div className="space-y-4">
            <Skeleton className="h-6 w-32 mb-4" />
            <Skeleton className="h-[100px] w-full rounded-[16px]" />
            <Skeleton className="h-[100px] w-full rounded-[16px]" />
            <Skeleton className="h-[100px] w-full rounded-[16px]" />
          </div>
        </div>
        <BottomNavigation />
      </main>
    );
  }

  const currentXp = rewards?.currentXp || 0;
  const currentTier = rewards ? getTierFromXp(currentXp) : 'member';
  const tierInfo = getNextTierInfo(currentTier);
  const xpNeeded = Math.max(0, tierInfo.points - currentXp);
  const progressPercent = tierInfo.currentBase === tierInfo.points ? 100 : Math.max(0, Math.min(((currentXp - tierInfo.currentBase) / (tierInfo.points - tierInfo.currentBase)) * 100, 100));

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'movie_booking': return <Ticket className="h-4 w-4 text-primary" />;
      case 'snack_purchase': return <Coffee className="h-4 w-4 text-success" />;
      case 'referral': return <Gift className="h-4 w-4 text-[#00B0FF]" />;
      default: return <Star className="h-4 w-4 text-secondary" />;
    }
  };

  const getTierIcon = (tier: string, isActive: boolean) => {
    const color = isActive ? 'text-[#181A20]' : 'text-foreground';
    return <Award className={`h-6 w-6 ${color}`} />;
  };

  const hasRewards = rewards?.availableRewards && rewards.availableRewards.length > 0;
  const hasHistory = rewards?.rewardHistory && rewards.rewardHistory.length > 0;

  if (!hasRewards && !hasHistory) {
    return (
      <main className="min-h-screen bg-background pb-24 text-foreground">
        <TopNavigation title="Rewards" />
        <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in zoom-in duration-500">
          <div className="relative mb-6 h-28 w-28 overflow-hidden rounded-full border-4 border-border bg-surface shadow-lg flex items-center justify-center">
            <Gift className="h-12 w-12 text-muted opacity-50" />
          </div>
          <h3 className="text-[20px] font-bold tracking-tight text-foreground">No rewards yet</h3>
          <p className="mt-2 mb-8 text-[14px] text-muted px-4 max-w-[280px]">
            Book tickets and order snacks to earn XP and unlock premium rewards.
          </p>
            <Button 
              onClick={() => router.push('/')}
              className="h-[52px] rounded-[16px] bg-primary px-8 text-[16px] font-bold text-white transition-all duration-200 ease-out active:scale-[0.96] flex items-center justify-center gap-2"
            >
            Book your first movie
          </Button>
        </div>
        <BottomNavigation />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background pb-24 text-foreground">
      <TopNavigation title="Rewards" />
      
      <div className="px-4 py-6 space-y-8">
        
        {/* Top Summary Card */}
        <div className="relative overflow-hidden w-full rounded-[24px] bg-gradient-to-br from-[#181A20] to-[#2A2D36] border border-border p-6 shadow-2xl">
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-secondary/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-[12px] text-muted uppercase tracking-wider font-bold mb-1">Current Tier</p>
              <div className="flex items-center gap-2">
                <div className="bg-gradient-to-r from-[#FFD000] to-[#FF8F00] p-1.5 rounded-full shadow-lg">
                  <Award className="w-5 h-5 text-black" />
                </div>
                <h2 className="text-[28px] font-bold capitalize text-foreground tracking-tight">{currentTier}</h2>
              </div>
            </div>
            <div className="text-right flex flex-col items-end">
              <div className="flex items-end gap-1">
                <span className="text-[32px] font-black text-secondary leading-none">{currentXp}</span>
                <span className="text-[14px] font-bold text-muted mb-1">XP</span>
              </div>
            </div>
          </div>
          
          {currentTier !== 'platinum' && (
            <div className="mt-4">
              <div className="flex justify-between text-[13px] font-bold text-foreground mb-2">
                <span>{currentXp} XP</span>
                <span className="text-muted">{tierInfo.points} XP for {tierInfo.next}</span>
              </div>
              <div className="w-full h-2.5 bg-background rounded-full overflow-hidden shadow-inner flex items-center">
                <div 
                  className="h-full bg-gradient-to-r from-[#FF2A55] to-[#FFD000] rounded-full transition-all duration-1000 ease-out" 
                  style={{ width: showProgress ? `${progressPercent}%` : '0%', minWidth: progressPercent > 0 ? '4px' : '0' }}
                />
              </div>
              <p className="text-[12px] text-muted mt-3 font-medium text-center bg-background/50 py-1.5 rounded-lg border border-border/50">
                Only <span className="text-secondary">{xpNeeded} XP</span> to reach {tierInfo.next}
              </p>
            </div>
          )}
        </div>

        {/* Gamification / Recent Achievement */}
        <div className="flex items-center justify-between bg-gradient-to-r from-[#FFD000]/20 to-transparent border border-secondary/30 rounded-[16px] p-4 animate-in slide-in-from-right-4 fade-in">
          <div className="flex items-center gap-3">
            <div className="bg-secondary p-2 rounded-full">
              <Star className="w-5 h-5 text-black" />
            </div>
            <div>
              <p className="text-[12px] text-secondary font-bold uppercase tracking-wide">Recent Achievement</p>
              <p className="text-[14px] font-bold text-foreground">Welcome Bonus Claimed!</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-muted" />
        </div>

        {/* Tier Benefits */}
        <section>
          <h3 className="text-[18px] font-bold tracking-tight mb-4">Tier Benefits</h3>
          <div className="grid grid-cols-1 gap-3">
            {[
              { id: 'member', title: 'Member', req: '0 - 999 XP', benefits: 'Basic benefits' },
              { id: 'silver', title: 'Silver', req: '1000 - 2499 XP', benefits: 'Standard booking access' },
              { id: 'gold', title: 'Gold', req: '2500 - 4999 XP', benefits: '5% off snacks, Priority support' },
              { id: 'platinum', title: 'Platinum', req: '5000+ XP', benefits: 'Free seat delivery, 10% off tickets' }
            ].map((tier) => {
              const isActive = currentTier === tier.id;
              return (
                <div 
                  key={tier.id} 
                  className={`flex items-center gap-4 p-4 rounded-[16px] border transition-all duration-300 ${isActive ? 'bg-gradient-to-r from-[#FFD000] to-[#FF8F00] border-transparent shadow-[0_4px_20px_rgba(255,208,0,0.25)] scale-[1.02]' : 'bg-surface border-border'}`}
                >
                  <div className={`p-2 rounded-full ${isActive ? 'bg-black/10' : 'bg-[#2A2D36]'}`}>
                    {getTierIcon(tier.id, isActive)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <h4 className={`font-bold text-[16px] ${isActive ? 'text-[#181A20]' : 'text-foreground'}`}>{tier.title}</h4>
                      {isActive && <span className="text-[10px] font-black uppercase tracking-wider bg-surface text-secondary px-2 py-0.5 rounded-full">Current</span>}
                    </div>
                    <p className={`text-[12px] mb-1 font-medium ${isActive ? 'text-[#181A20]/80' : 'text-muted'}`}>{tier.benefits}</p>
                    <p className={`text-[11px] font-bold ${isActive ? 'text-[#181A20]/70' : 'text-primary'}`}>{tier.req}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Available Rewards */}
        {hasRewards && (
          <section>
            <h3 className="text-[18px] font-bold tracking-tight mb-4">Available Rewards</h3>
            <div className="grid grid-cols-1 gap-4">
              {rewards.availableRewards?.map(reward => (
                <RewardCard 
                  key={reward.id}
                  title={reward.title}
                  pointsRequired={reward.xpRequired}
                  description={reward.description}
                  imageUrl={reward.imageUrl}
                  currentXp={currentXp}
                  onClick={() => setSelectedReward(reward)}
                />
              ))}
            </div>
          </section>
        )}

        {/* Reward History */}
        {hasHistory && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[18px] font-bold tracking-tight">Reward History</h3>
              <Button variant="ghost" className="text-[13px] font-bold text-primary h-auto p-0 hover:bg-transparent flex items-center justify-center gap-2">View All</Button>
            </div>
            <div className="rounded-[24px] border border-border bg-surface p-2">
              {rewards.rewardHistory?.map((item, index) => (
                <div key={item.id} className={`flex items-center gap-4 p-4 ${index !== rewards.rewardHistory!.length - 1 ? 'border-b border-border' : ''}`}>
                  <div className="h-10 w-10 shrink-0 rounded-full bg-[#2A2D36] flex items-center justify-center">
                    {getSourceIcon(item.source)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-[14px] text-foreground truncate">{item.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[11px] text-muted">{new Date(item.date).toLocaleDateString()}</span>
                      <span className="w-1 h-1 rounded-full bg-[#2A2D36]" />
                      <span className="text-[11px] text-muted capitalize">{item.source.replace('_', ' ')}</span>
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <span className="font-bold text-[14px] text-success">+{item.xpEarned} XP</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

      </div>

      {/* Reward Details Bottom Sheet */}
      <BottomSheet open={!!selectedReward} onClose={() => setSelectedReward(null)}>
        <div className="flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-300 relative" onClick={e => e.stopPropagation()}>
          <button 
            className="absolute -top-1 right-0 p-2 rounded-full bg-[#2A2D36] text-foreground hover:bg-[#3f4351] transition-colors z-10"
            onClick={() => setSelectedReward(null)}
          >
            <X className="w-4 h-4" />
          </button>

          {selectedReward && (
            <>
              <div className="relative w-full h-[160px] rounded-[16px] overflow-hidden bg-[#2A2D36] mb-5">
                <ProgressiveImage src={selectedReward.imageUrl} alt={selectedReward.title} className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#181A20] via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                  <span className="text-[12px] font-bold text-secondary">{selectedReward.xpRequired} XP</span>
                </div>
              </div>

              <h3 className="text-[20px] font-bold text-foreground mb-2">{selectedReward.title}</h3>
              <p className="text-[14px] text-muted mb-6 leading-relaxed">
                {selectedReward.description}
              </p>

              <div className="space-y-4 mb-8">
                <div>
                  <h4 className="text-[13px] font-bold text-foreground mb-2 flex items-center gap-2">
                    <History className="w-4 h-4 text-primary" /> Expiry
                  </h4>
                  <p className="text-[13px] text-muted">{selectedReward.expiry}</p>
                </div>
                <div>
                  <h4 className="text-[13px] font-bold text-foreground mb-2 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-success" /> Terms & Conditions
                  </h4>
                  <ul className="text-[13px] text-muted space-y-1 list-disc list-inside">
                    {selectedReward.terms.map((term: string, i: number) => (
                      <li key={i}>{term}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pb-safe">
                <Button 
                  className={`w-full h-[56px] text-[16px] font-bold rounded-[16px] flex items-center justify-center gap-2 ${
                    currentXp < selectedReward.xpRequired 
                      ? 'bg-[#2A2D36] text-muted' 
                      : 'bg-secondary text-black hover:bg-secondary/90 shadow-[0_4px_20px_rgba(255,208,0,0.3)]'
                  }`}
                  disabled={currentXp < selectedReward.xpRequired}
                  onClick={() => {
                    if (!isSignedIn) {
                      router.push(`/sign-in?redirect_url=${encodeURIComponent('/rewards')}`);
                      return;
                    }
                    // Handle actual redemption here
                    alert('Reward redeemed! Check your email for details.');
                    setSelectedReward(null);
                  }}
                >
                  {currentXp < selectedReward.xpRequired ? `Need ${selectedReward.xpRequired - currentXp} more XP to Redeem` : 'Redeem Reward'}
                </Button>
              </div>
            </>
          )}
        </div>
      </BottomSheet>

      <div className="pb-safe" />
    </main>
  );
}

