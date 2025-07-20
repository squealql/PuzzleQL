"use client";

import { BackgroundBoxes } from "@/components/ui/background-boxes";

export function BackgroundBoxesWrapper({ className, containerClassName }: { className?: string; containerClassName?: string }) {
    return <BackgroundBoxes className={className} containerClassName={containerClassName} />;
}
