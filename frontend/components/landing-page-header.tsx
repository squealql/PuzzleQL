"use client";

import { useTheme } from "next-themes";
import { AuthButton } from "./auth-button";
import { FloatingNav } from "./ui/floating-navbar";
import { hasEnvVars } from "@/lib/utils";
import { PROJECT_NAME } from "@/lib/config";
import Link from "next/link";

export function LandingPageHeader() {
    useTheme();

    const navItems = [
        { name: "Features", link: "/#features" },
        { name: "Projects", link: "/projects" },
        { name: "Palette", link: "/palette" },
    ];

    return (
        <>
            <header className="w-full sticky top-0 z-50 bg-transparent">
                <div className="w-full max-w-7xl mx-auto flex justify-between items-center p-3 text-sm">
                    <Link href="/" className="font-bold text-lg text-ui-navy-900 dark:text-white">
                        {PROJECT_NAME}
                    </Link>
                    <div className="flex items-center gap-4">{hasEnvVars && <AuthButton />}</div>
                </div>
            </header>
            <FloatingNav navItems={navItems} />
        </>
    );
}
