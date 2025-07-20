"use client";

import { CardHoverEffect } from "@/components/ui/card-hover-effect";
import { Blocks, Bot, Combine, Database, Waypoints } from "lucide-react";
import React from "react";

export interface FeatureItem {
    title: string;
    description: string;
    icon: React.ReactNode;
    color: string;
}

const defaultFeatures: FeatureItem[] = [
    {
        title: "Intuitive Block-Based Builder",
        description: "Visually construct queries by dragging and dropping blocks. Perfect for both beginners and seasoned developers.",
        icon: <Blocks className="h-6 w-6" />,
        color: "bg-block-pink-500",
    },
    {
        title: "Broad Database Support",
        description: "Connect to your favorite databases including PostgreSQL, MySQL, SQLite, and more.",
        icon: <Database className="h-6 w-6" />,
        color: "bg-block-magenta-600",
    },
    {
        title: "AI-Powered Assistance",
        description: "Leverage our intelligent assistant to optimize queries and get suggestions in real-time.",
        icon: <Bot className="h-6 w-6" />,
        color: "bg-block-purple-700",
    },
    {
        title: "Complex Joins Made Easy",
        description: "Effortlessly create and manage complex joins and relationships between tables.",
        icon: <Combine className="h-6 w-6" />,
        color: "bg-block-indigo-700",
    },
    {
        title: "Clear Data Flow Visualization",
        description: "Visualize and understand your data flow with clear, interactive query tools.",
        icon: <Waypoints className="h-6 w-6" />,
        color: "bg-block-blue-500",
    },
    {
        title: "Export to Code",
        description: "Export your queries to SQL, Python, JavaScript, and more.",
        icon: <Blocks className="h-6 w-6" />,
        color: "bg-block-cyan-500",
    },
];

export function FeatureCardsWrapper({ features = defaultFeatures, className }: { features?: FeatureItem[]; className?: string }) {
    return <CardHoverEffect items={features} className={className} />;
}
