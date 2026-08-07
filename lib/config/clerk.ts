export const clerkConfig = {
  signInUrl: process.env.CLERK_SIGN_IN_URL ?? '/sign-in',
  signUpUrl: process.env.CLERK_SIGN_UP_URL ?? '/sign-up',
  afterSignInUrl: process.env.CLERK_AFTER_SIGN_IN_URL ?? '/',
  afterSignUpUrl: process.env.CLERK_AFTER_SIGN_UP_URL ?? '/',
};
