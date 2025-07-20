import * as React from "react";

import { cn } from "@/lib/utils";

// We're using the direct React textarea attributes type without extending it
type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => {
    return (
        <textarea
            className={cn(
                "flex min-h-20 w-full rounded-md border border-ui-navy-200 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-ui-navy-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ui-navy-400 disabled:cursor-not-allowed disabled:opacity-50 dark:border-ui-navy-700 dark:bg-ui-navy-800 dark:text-ui-beige-100 dark:placeholder:text-ui-navy-400 dark:focus-visible:ring-ui-navy-500",
                className
            )}
            ref={ref}
            {...props}
        />
    );
});
Textarea.displayName = "Textarea";

export { Textarea };
