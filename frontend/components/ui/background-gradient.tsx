"use client";

import React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export interface BackgroundGradientProps {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  animate?: boolean;
  gradientClassName?: string;
}

export const BackgroundGradient = ({
  children,
  className,
  containerClassName,
  animate = true,
  gradientClassName,
}: BackgroundGradientProps) => {
  const variants = {
    initial: {
      backgroundPosition: "0 50%",
    },
    animate: {
      backgroundPosition: ["0, 50%", "100% 50%", "0 50%"],
    },
  };

  return (
    <div className={cn("relative p-[4px] group", containerClassName)}>
      <motion.div
        variants={animate ? variants : undefined}
        initial={animate ? "initial" : undefined}
        animate={animate ? "animate" : undefined}
        transition={
          animate
            ? {
                duration: 5,
                repeat: Infinity,
                repeatType: "reverse",
              }
            : undefined
        }
        className={cn(
          "absolute inset-0 rounded-3xl z-[1] opacity-60 group-hover:opacity-100 blur-xl transition duration-500",
          "bg-gradient-to-r from-ui-navy-500 via-ui-beige-300 to-ui-navy-300",
          gradientClassName
        )}
      />
      <div
        className={cn(
          "relative z-[2] rounded-3xl overflow-hidden backdrop-blur-xl p-4 h-full",
          "bg-white dark:bg-ui-navy-900 bg-opacity-90 dark:bg-opacity-90",
          className
        )}
      >
        {children}
      </div>
    </div>
  );
};