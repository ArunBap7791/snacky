import * as React from 'react';
import { cn } from '@/lib/utils/cn';

export type VisuallyHiddenProps = React.HTMLAttributes<HTMLSpanElement>;

function VisuallyHidden({ className, ...props }: VisuallyHiddenProps) {
  return <span className={cn('sr-only', className)} {...props} />;
}

export { VisuallyHidden };
