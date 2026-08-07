import * as React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface DialogProps extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean;
  title?: string;
  description?: string;
}

function Dialog({ open = false, title, description, className, children, ...props }: DialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 sm:items-center">
      <div className={cn('w-full max-w-md rounded-[24px] border border-border bg-surface p-5 shadow-[0_8px_24px_rgba(0,0,0,0.24)]', className)} {...props}>
        {(title || description) ? (
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              {title ? <h3 className="text-[20px] font-semibold">{title}</h3> : null}
              {description ? <p className="mt-1 text-[14px] text-muted">{description}</p> : null}
            </div>
            <button type="button" className="rounded-full p-2 text-muted hover:bg-[#2A2D36]" aria-label="Close dialog">
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : null}
        {children}
      </div>
    </div>
  );
}

export { Dialog };

