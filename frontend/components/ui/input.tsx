import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(({ className, type, ...props }, ref) => {
    return (
        <input
            type={type}
            className={cn(
                "flex h-9 w-full rounded-md border border-ui-navy-200 bg-white px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-ui-navy-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ui-navy-400 disabled:cursor-not-allowed disabled:opacity-50 dark:border-ui-navy-700 dark:bg-ui-navy-800 dark:text-ui-beige-100 dark:placeholder:text-ui-navy-400 dark:focus-visible:ring-ui-navy-500 md:text-sm",
                className
            )}
            ref={ref}
            {...props}
        />
    );
});
Input.displayName = "Input";

export { Input };
