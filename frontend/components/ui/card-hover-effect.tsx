"use client";
import React, { useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export interface CardHoverEffectProps {
    items: {
        title: string;
        description: string;
        icon: React.ReactNode;
        color: string;
    }[];
    className?: string;
    cardClassName?: string;
}

export const CardHoverEffect = ({ items, className, cardClassName }: CardHoverEffectProps) => {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    return (
        <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8", className)}>
            {items.map((item, idx) => (
                <motion.div
                    key={`card-hover-${idx}`}
                    className="relative"
                    onMouseEnter={() => setHoveredIndex(idx)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    initial={{ opacity: 0.9 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    <motion.div
                        layout
                        className={cn(
                            "relative h-full bg-white dark:bg-ui-navy-800 rounded-xl p-6",
                            "border border-transparent hover:border-gray-200 dark:hover:border-gray-700",
                            "transition-all duration-300 ease-in-out",
                            "shadow-sm hover:shadow-xl",
                            cardClassName
                        )}
                        initial={{ borderRadius: 16 }}
                        whileHover={{
                            scale: 1.03,
                            y: -5,
                            transition: { duration: 0.2, ease: "easeOut" },
                        }}
                    >
                        {/* Gradient background on hover */}
                        <motion.div
                            className={cn("absolute inset-0 rounded-xl bg-gradient-to-b from-transparent via-transparent to-transparent", "z-0 transition-all")}
                            initial={{ opacity: 0 }}
                            animate={{
                                opacity: hoveredIndex === idx ? 0.07 : 0,
                                background:
                                    hoveredIndex === idx
                                        ? `linear-gradient(to bottom, transparent, ${item.color.includes("/") ? item.color.split("/")[0] : item.color})`
                                        : "transparent",
                            }}
                            transition={{ duration: 0.3 }}
                        ></motion.div>

                        {/* Icon container with animation */}
                        <motion.div
                            className={cn("relative z-10 mx-auto p-3 rounded-full mb-4 text-white w-12 h-12 flex items-center justify-center", item.color)}
                            whileHover={{
                                scale: 1.1,
                                transition: { repeat: 1, repeatType: "reverse", duration: 0.3 },
                            }}
                        >
                            {item.icon}
                        </motion.div>

                        {/* Content with slight movement on hover */}
                        <motion.div className="relative z-10" initial={{ y: 0 }} whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
                            <h3 className="text-lg font-bold text-ui-navy-800 dark:text-white mb-2">{item.title}</h3>
                            <p className="text-sm text-ui-navy-600 dark:text-ui-beige-200">{item.description}</p>
                        </motion.div>

                        {/* Shimmering border effect */}
                        <motion.div
                            className="absolute inset-0 rounded-xl pointer-events-none"
                            initial={{ opacity: 0, borderWidth: 1 }}
                            animate={{
                                opacity: hoveredIndex === idx ? [0, 0.5, 0] : 0,
                                borderWidth: hoveredIndex === idx ? [1, 2, 1] : 1,
                            }}
                            transition={{
                                duration: 1.5,
                                repeat: hoveredIndex === idx ? Infinity : 0,
                                repeatType: "loop",
                            }}
                            style={{
                                border: `2px solid ${item.color}`,
                                boxShadow: hoveredIndex === idx ? `0 0 15px 1px ${item.color.replace("bg-", "").replace("-", "")}` : "none",
                            }}
                        />
                    </motion.div>
                </motion.div>
            ))}
        </div>
    );
};
