"use client";

import { AnimatedButton } from "@/components/ui/animated-button";
import { ArrowRight } from "lucide-react";

export function GetStartedButton() {
    return (
        <AnimatedButton
            size="lg"
            className="bg-ui-navy-700 hover:bg-ui-navy-600 text-white dark:bg-ui-navy-500 dark:hover:bg-ui-navy-400"
            icon={ArrowRight}
            iconPlacement="right"
            hoverScale={1.03}
        >
            Get Started
        </AnimatedButton>
    );
}

export function SignUpButton() {
    return (
        <AnimatedButton size="lg" variant="outline" className="dark:text-white dark:border-ui-navy-500 dark:hover:bg-ui-navy-800">
            Sign Up
        </AnimatedButton>
    );
}
