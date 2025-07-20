"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface NavItem {
    name: string;
    link: string;
    icon?: React.ReactNode;
}

export const FloatingNav = ({ navItems, className }: { navItems: NavItem[]; className?: string }) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // Show navbar when scrolled to top
            if (currentScrollY < 100) {
                setIsScrolled(false);
                setIsVisible(true);
            } else {
                setIsScrolled(true);

                // Hide when scrolling down, show when scrolling up
                if (currentScrollY > lastScrollY && isVisible) {
                    setIsVisible(false);
                } else if (currentScrollY < lastScrollY && !isVisible) {
                    setIsVisible(true);
                }
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [isVisible, lastScrollY]);

    return (
        <AnimatePresence mode="wait">
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                    className={cn("fixed top-10 inset-x-0 mx-auto z-[100] flex justify-center", className)}
                >
                    <div
                        className={cn(
                            "flex items-center justify-center space-x-4 rounded-full px-4 py-2 shadow-lg",
                            isScrolled ? "bg-white/80 dark:bg-ui-navy-900/80 backdrop-blur-md border border-gray-200 dark:border-ui-navy-700" : "bg-transparent"
                        )}
                    >
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.link}
                                className={cn(
                                    "relative px-4 py-2 rounded-full text-sm font-medium",
                                    "hover:text-ui-navy-500 dark:hover:text-white transition-colors",
                                    "flex items-center space-x-1",
                                    isScrolled ? "text-ui-navy-700 dark:text-ui-beige-300" : "text-ui-navy-700 dark:text-white"
                                )}
                            >
                                {item.icon && <span>{item.icon}</span>}
                                <span>{item.name}</span>
                            </Link>
                        ))}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
