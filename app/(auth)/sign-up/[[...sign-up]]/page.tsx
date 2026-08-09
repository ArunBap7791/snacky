import { SignUp } from '@clerk/nextjs';
import Image from 'next/image';
export default function SignUpPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center mx-auto mb-6">
            <Image src="/assets/Snacky%20Logo/SVG/Snacky%20Combined.svg" alt="Snacky" width={140} height={48} className="object-contain" priority />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Join Snacky</h1>
          <p className="mt-2 text-muted">Create an account to start earning rewards.</p>
        </div>
        <SignUp 
          appearance={{
            elements: {
              card: 'bg-surface border border-border shadow-xl rounded-[24px] p-6',
              headerTitle: 'hidden',
              headerSubtitle: 'hidden',
              socialButtonsBlockButton: 'border-border bg-background text-foreground hover:bg-[#2A2D36] h-[52px] rounded-[16px] font-bold',
              socialButtonsBlockButtonText: 'font-bold text-[14px]',
              dividerLine: 'bg-[#2A2D36]',
              dividerText: 'text-muted text-[13px] font-medium',
              formFieldLabel: 'text-foreground font-medium text-[13px] mb-1.5',
              formFieldInput: 'bg-background border border-border text-foreground focus:border-primary focus:ring-1 focus:ring-[#FF2A55] h-[52px] rounded-[12px] px-4 text-[15px]',
              formButtonPrimary: 'bg-primary hover:bg-[#ff1a46] text-white h-[52px] rounded-[16px] font-bold text-[16px]',
              footerActionText: 'text-muted font-medium text-[14px]',
              footerActionLink: 'text-primary hover:text-[#ff1a46] font-bold text-[14px]'
            }
          }}
          routing="path" 
          path="/sign-up" 
          signInUrl="/sign-in" 
        />
      </div>
    </main>
  );
}

