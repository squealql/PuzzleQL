import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
    {
        variants: {
            variant: {
                default: "bg-ui-navy-700 text-white shadow hover:bg-ui-navy-600 dark:bg-ui-navy-500 dark:hover:bg-ui-navy-400 dark:text-white",
                destructive: "bg-ui-terracotta-500 text-white shadow-sm hover:bg-ui-terracotta-600 dark:bg-ui-terracotta-700 dark:hover:bg-ui-terracotta-600",
                outline:
                    "border border-ui-navy-200 bg-transparent shadow-sm hover:bg-ui-navy-100 hover:text-ui-navy-800 dark:border-ui-navy-700 dark:text-ui-beige-100 dark:hover:bg-ui-navy-700",
                secondary:
                    "bg-ui-navy-200 text-ui-navy-900 shadow-sm hover:bg-ui-navy-300/80 dark:bg-ui-navy-700 dark:text-ui-beige-100 dark:hover:bg-ui-navy-600",
                ghost: "hover:bg-accent hover:text-accent-foreground",
                link: "text-primary underline-offset-4 hover:underline",
            },
            size: {
                default: "h-9 px-4 py-2",
                sm: "h-8 rounded-md px-3 text-xs",
                lg: "h-10 rounded-md px-8",
                icon: "h-9 w-9",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
});
Button.displayName = "Button";

export { Button, buttonVariants };
