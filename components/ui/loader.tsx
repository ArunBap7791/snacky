import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface LoaderProps {
  className?: string;
}

function Loader({ className }: LoaderProps) {
  return <Loader2 className={cn('h-5 w-5 animate-spin text-primary', className)} />;
}

export { Loader };

