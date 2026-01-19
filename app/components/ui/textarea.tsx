import * as React from 'react';

// Adjust the import path if necessary (e.g., '@/lib/utils')
import { cn } from '../../lib/utils';

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          `flex min-h-[80px] w-full rounded-md border border-neutral-200 bg-white px-3 py-3 text-sm
           ring-offset-white placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-1
           focus-visible:ring-neutral-950 focus-visible:ring-offset-0 disabled:cursor-not-allowed
           disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-950 dark:ring-offset-neutral-950
           dark:placeholder:text-neutral-400 dark:focus-visible:ring-neutral-400 md:px-4 md:py-4
           md:text-sm`,
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea';

export { Textarea };