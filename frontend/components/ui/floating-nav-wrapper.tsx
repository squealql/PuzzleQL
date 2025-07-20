"use client";

import { FloatingNav } from "./floating-navbar";

export function FloatingNavWrapper() {
    const navItems = [
        { name: "Features", link: "/#features" },
        { name: "Projects", link: "/projects" },
        { name: "Palette", link: "/palette" },
    ];

    return <FloatingNav navItems={navItems} />;
}
