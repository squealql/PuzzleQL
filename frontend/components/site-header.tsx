"use client";

import { useEffect, useState } from "react";

export function SiteHeader({ children }: { children: React.ReactNode }) {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return <header className={`w-full sticky top-0 z-50 transition-shadow ${isScrolled ? "shadow-md" : ""}`}>{children}</header>;
}
