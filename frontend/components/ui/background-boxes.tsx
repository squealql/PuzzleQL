"use client";
import React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export const BackgroundBoxes = ({
    className,
    containerClassName,
    boxClassName,
    animate = true,
}: {
    className?: string;
    containerClassName?: string;
    boxClassName?: string;
    animate?: boolean;
}) => {
    const rows = 8;
    const columns = 12;

    const colors = [
        "bg-block-pink-500/20",
        "bg-block-magenta-600/20",
        "bg-block-purple-700/20",
        "bg-block-indigo-700/20",
        "bg-block-blue-500/20",
        "bg-block-cyan-500/20",
    ];

    const indexToColorMap: Record<number, string> = {
        0: colors[0],
        1: colors[1],
        2: colors[2],
        3: colors[3],
        4: colors[4],
        5: colors[5],
    };

    const getRandomColor = (index: number) => {
        // Use index to determine color, but with some randomness
        return indexToColorMap[index % 6];
    };

    const calculateDelay = (index: number) => {
        const row = Math.floor(index / columns);
        const col = index % columns;
        return (row + col) * 0.05; // Staggered delay based on position
    };

    return (
        <div className={cn("relative h-full w-full overflow-hidden bg-transparent flex flex-row flex-wrap", containerClassName)}>
            {Array.from({ length: rows * columns }).map((_, i) => {
                const row = Math.floor(i / columns);
                const col = i % columns;
                return (
                    <motion.div
                        key={`box-${i}`}
                        className={cn("h-[40px] w-[40px] bg-white/10 z-0 border border-white/20 rounded-md", boxClassName, getRandomColor(i))}
                        style={{
                            x: col * 40,
                            y: row * 40,
                        }}
                        initial={
                            animate
                                ? {
                                      opacity: 0,
                                      scale: 0.8,
                                  }
                                : {}
                        }
                        animate={
                            animate
                                ? {
                                      opacity: [0, 0.8, 0],
                                      scale: [0.8, 1.1, 0.8],
                                  }
                                : {}
                        }
                        transition={
                            animate
                                ? {
                                      repeat: Infinity,
                                      repeatType: "loop",
                                      ease: "easeInOut",
                                      duration: 4,
                                      delay: calculateDelay(i),
                                  }
                                : {}
                        }
                    />
                );
            })}
            <div className={cn("relative z-10 w-full", className)}></div>
        </div>
    );
};
