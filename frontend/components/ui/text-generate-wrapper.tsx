"use client";

import { AceternityTextGenerate } from "@/components/ui/aceternity-text-generate";

export function EnhancedTextGenerate({ words, className }: { words: string; className?: string }) {
    return <AceternityTextGenerate words={words} className={className} speed={0.4} />;
}
