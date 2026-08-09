import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher([
  '/login(.*)'
]);

const isRestrictedGuestRoute = createRouteMatcher([
  '/profile(.*)',
  '/rewards(.*)',
  '/bookings(.*)' // Booking history
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  const guestMode = req.cookies.get('snacky_guest_mode')?.value === 'true';
  const dummyAuth = req.cookies.get('snacky_dummy_auth')?.value === 'true';

  const isAuthenticated = !!userId || dummyAuth;

  // If user is accessing a restricted route as a guest, or without any auth
  if (isRestrictedGuestRoute(req)) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  // If user is accessing a protected route (not public) and not authenticated/guest
  if (!isPublicRoute(req)) {
    if (!isAuthenticated && !guestMode) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!_next|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico|css|js|map|mp4)$).*)'],
};
