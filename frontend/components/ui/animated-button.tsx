"use client";
import React from "react";
import { motion } from "motion/react";
import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface AnimatedButtonProps extends ButtonProps {
    children: React.ReactNode;
    className?: string;
    iconClassName?: string;
    icon?: LucideIcon;
    iconPlacement?: "left" | "right";
    hoverScale?: number;
    animate?: boolean;
}

export const AnimatedButton = ({
    children,
    className,
    iconClassName,
    icon: Icon,
    iconPlacement = "right",
    hoverScale = 1.05,
    animate = true,
    ...props
}: AnimatedButtonProps) => {
    return (
        <motion.div
            className="inline-block"
            whileHover={animate ? { scale: hoverScale } : {}}
            whileTap={animate ? { scale: 0.95 } : {}}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
            <Button className={cn("relative overflow-hidden transition-all duration-300", className)} {...props}>
                <motion.span
                    className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-20 transition-opacity duration-300"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 0.1 }}
                ></motion.span>

                {Icon && iconPlacement === "left" && (
                    <motion.span className={cn("mr-2", iconClassName)} initial={{ x: 0 }} whileHover={{ x: -4 }} whileTap={{ x: 0 }}>
                        <Icon className="h-5 w-5" />
                    </motion.span>
                )}

                <span className="relative z-10">{children}</span>

                {Icon && iconPlacement === "right" && (
                    <motion.span className={cn("ml-2", iconClassName)} initial={{ x: 0 }} whileHover={{ x: 4 }} whileTap={{ x: 0 }}>
                        <Icon className="h-5 w-5" />
                    </motion.span>
                )}
            </Button>
        </motion.div>
    );
};
