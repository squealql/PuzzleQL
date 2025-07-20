import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
    "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
    {
        variants: {
            variant: {
                default: "border-transparent bg-ui-navy-700 text-white shadow hover:bg-ui-navy-600 dark:bg-ui-navy-500 dark:hover:bg-ui-navy-400",
                secondary:
                    "border-transparent bg-ui-navy-200 text-ui-navy-900 hover:bg-ui-navy-300/80 dark:bg-ui-navy-700 dark:text-ui-beige-100 dark:hover:bg-ui-navy-600",
                destructive:
                    "border-transparent bg-ui-terracotta-500 text-white shadow hover:bg-ui-terracotta-600 dark:bg-ui-terracotta-700 dark:hover:bg-ui-terracotta-600",
                outline: "text-ui-navy-900 border-ui-navy-200 dark:text-ui-beige-100 dark:border-ui-navy-600",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
    return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
