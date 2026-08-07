import * as React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  removable?: boolean;
}

function Tag({ className, removable = false, children, ...props }: TagProps) {
  return (
    <span className={cn('inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 text-[12px] text-foreground', className)} {...props}>
      <span>{children}</span>
      {removable ? <X className="h-3.5 w-3.5" /> : null}
    </span>
  );
}

export { Tag };

