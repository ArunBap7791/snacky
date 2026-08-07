'use client';

import { useState, useEffect } from 'react';
import { Button } from './button';
import { MapPin, Bell } from 'lucide-react';

export function PermissionManager() {
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);

  useEffect(() => {
    // Only run on client after mount
    const locRequested = localStorage.getItem('location_permission_requested');
    const notifRequested = localStorage.getItem('notification_permission_requested');

    if (!locRequested) {
      // Small delay to allow splash to finish
      const timer = setTimeout(() => setShowLocationModal(true), 2500);
      return () => clearTimeout(timer);
    } else if (!notifRequested) {
      // Small delay to prevent modals popping up back to back
      const timer = setTimeout(() => setShowNotificationModal(true), 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleLocationAllow = () => {
    localStorage.setItem('location_permission_requested', 'true');
    localStorage.setItem('location_permission_granted', 'true');
    setShowLocationModal(false);
    
    // Check if notification is next
    const notifRequested = localStorage.getItem('notification_permission_requested');
    if (!notifRequested) {
      setTimeout(() => setShowNotificationModal(true), 500);
    }
  };

  const handleLocationNotNow = () => {
    localStorage.setItem('location_permission_requested', 'true');
    localStorage.setItem('location_permission_granted', 'false');
    setShowLocationModal(false);
    
    // Check if notification is next
    const notifRequested = localStorage.getItem('notification_permission_requested');
    if (!notifRequested) {
      setTimeout(() => setShowNotificationModal(true), 500);
    }
  };

  const handleNotificationAllow = () => {
    localStorage.setItem('notification_permission_requested', 'true');
    localStorage.setItem('notification_permission_granted', 'true');
    setShowNotificationModal(false);
  };

  const handleNotificationSkip = () => {
    localStorage.setItem('notification_permission_requested', 'true');
    localStorage.setItem('notification_permission_granted', 'false');
    setShowNotificationModal(false);
  };

  return (
    <>
      {showLocationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 animate-in fade-in max-w-md mx-auto">
          <div className="w-full max-w-sm rounded-2xl bg-surface p-6 shadow-2xl border border-border">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <MapPin className="h-8 w-8 text-primary" />
            </div>
            <h2 className="mb-2 text-center text-xl font-bold text-foreground">Enable Location</h2>
            <p className="mb-6 text-center text-sm text-muted">
              We use your location to find partner theatres and movie times near you.
            </p>
            <div className="flex flex-col gap-3">
              <Button onClick={handleLocationAllow} className="w-full text-[16px] font-bold py-6">
                Allow Location
              </Button>
              <Button variant="ghost" onClick={handleLocationNotNow} className="w-full font-medium">
                Not Now
              </Button>
            </div>
          </div>
        </div>
      )}

      {showNotificationModal && !showLocationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 animate-in fade-in max-w-md mx-auto">
          <div className="w-full max-w-sm rounded-2xl bg-surface p-6 shadow-2xl border border-border">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary/10">
              <Bell className="h-8 w-8 text-secondary" />
            </div>
            <h2 className="mb-2 text-center text-xl font-bold text-foreground">Stay Updated</h2>
            <p className="mb-6 text-center text-sm text-muted">
              Get notified when your snacks are ready for pickup or being delivered to your seat.
            </p>
            <div className="flex flex-col gap-3">
              <Button onClick={handleNotificationAllow} className="w-full bg-secondary text-black hover:bg-[#e6bb00] text-[16px] font-bold py-6">
                Enable Notifications
              </Button>
              <Button variant="ghost" onClick={handleNotificationSkip} className="w-full font-medium">
                Skip for now
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

