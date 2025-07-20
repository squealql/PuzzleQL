"use client";
import React, { useEffect, useState } from "react";
import { motion, useAnimation } from "motion/react";
import { cn } from "@/lib/utils";

export const AceternityTextGenerate = ({ words, className, speed = 0.5 }: { words: string; className?: string; speed?: number }) => {
    const [displayedText, setDisplayedText] = useState("");
    const controls = useAnimation();

    useEffect(() => {
        let currentText = "";
        let currentIndex = 0;

        const animateText = () => {
            if (currentIndex < words.length) {
                currentText += words[currentIndex];
                setDisplayedText(currentText);
                currentIndex++;

                const delay = words[currentIndex - 1] === " " ? 150 * speed : 30 * speed;
                setTimeout(animateText, delay);
            } else {
                controls.start({
                    opacity: 1,
                    transition: { duration: 0.5 },
                });
            }
        };

        setDisplayedText("");
        currentText = "";
        currentIndex = 0;
        controls.set({ opacity: 0.9 });

        // Add a small delay before starting the animation
        setTimeout(animateText, 300);

        return () => {
            setDisplayedText("");
        };
    }, [words, speed, controls]);

    return (
        <motion.div className={cn("font-medium", className)} initial={{ opacity: 0.5 }} animate={controls}>
            <div className="relative">
                {displayedText}
                <motion.span
                    initial={{ opacity: 1 }}
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ repeat: Infinity, duration: 0.8 }}
                    className="absolute ml-1 -mt-1 inline-block h-5 w-0.5 bg-current"
                >
                    &nbsp;
                </motion.span>
            </div>
        </motion.div>
    );
};
