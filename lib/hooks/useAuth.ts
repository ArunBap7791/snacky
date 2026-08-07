import { useUser, useClerk } from '@clerk/nextjs';
import { useAuthStore } from '../store/authStore';

export function useAuth() {
  const { user: clerkUser, isLoaded, isSignedIn: clerkIsSignedIn } = useUser();
  const { signOut: clerkSignOut } = useClerk();
  const { isGuest, isDummyUser, setGuestMode, setDummyUserMode, clearAuthSession } = useAuthStore();

  const isSignedIn = clerkIsSignedIn || isDummyUser;
  const isGuestSession = !isSignedIn && isGuest;
  
  // Return unified user interface
  const user = clerkIsSignedIn ? clerkUser : isDummyUser ? {
    id: 'dummy',
    firstName: 'Arun',
    fullName: 'Arun Bap',
    imageUrl: '', // default empty
  } : isGuestSession ? {
    id: 'guest',
    firstName: 'Guest',
    fullName: 'Guest User',
    imageUrl: '',
  } : null;

  const signOut = async () => {
    if (clerkIsSignedIn) {
      await clerkSignOut();
    }
    clearAuthSession();
  };

  const loginAsGuest = () => {
    setGuestMode(true);
  };
  
  const loginAsDummy = () => {
    setDummyUserMode(true);
  };

  return {
    isLoaded,
    isSignedIn,
    isGuest: isGuestSession,
    isDummyUser,
    user,
    signOut,
    loginAsGuest,
    loginAsDummy,
  };
}
