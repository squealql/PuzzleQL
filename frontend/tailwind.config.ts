import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

export default {
    darkMode: ["class"],
    content: ["./pages/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}", "./app/**/*.{js,ts,jsx,tsx,mdx}", "./src/**/*.{js,ts,jsx,tsx,mdx}"],
    theme: {
        extend: {
            colors: {
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                primary: {
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                chart: {
                    "1": "hsl(var(--chart-1))",
                    "2": "hsl(var(--chart-2))",
                    "3": "hsl(var(--chart-3))",
                    "4": "hsl(var(--chart-4))",
                    "5": "hsl(var(--chart-5))",
                },
                // UI Colors
                "ui-navy": {
                    950: "hsl(var(--ui-navy-950))",
                    900: "hsl(var(--ui-navy-900))",
                    800: "hsl(var(--ui-navy-800))",
                    700: "hsl(var(--ui-navy-700))",
                    600: "hsl(var(--ui-navy-600))",
                    500: "hsl(var(--ui-navy-500))",
                    400: "hsl(var(--ui-navy-400))",
                    300: "hsl(var(--ui-navy-300))",
                    200: "hsl(var(--ui-navy-200))",
                    100: "hsl(var(--ui-navy-100))",
                },
                "ui-purple": {
                    600: "hsl(var(--ui-purple-600))",
                    500: "hsl(var(--ui-purple-500))",
                    400: "hsl(var(--ui-purple-400))",
                },
                "ui-terracotta": {
                    700: "hsl(var(--ui-terracotta-700))",
                    600: "hsl(var(--ui-terracotta-600))",
                    500: "hsl(var(--ui-terracotta-500))",
                    400: "hsl(var(--ui-terracotta-400))",
                    300: "hsl(var(--ui-terracotta-300))",
                },
                "ui-beige": {
                    300: "hsl(var(--ui-beige-300))",
                    200: "hsl(var(--ui-beige-200))",
                    100: "hsl(var(--ui-beige-100))",
                },

                // Block Colors
                "block-pink": {
                    600: "hsl(var(--block-pink-600))",
                    500: "hsl(var(--block-pink-500))",
                    400: "hsl(var(--block-pink-400))",
                },
                "block-magenta": {
                    700: "hsl(var(--block-magenta-700))",
                    600: "hsl(var(--block-magenta-600))",
                    500: "hsl(var(--block-magenta-500))",
                },
                "block-purple": {
                    800: "hsl(var(--block-purple-800))",
                    700: "hsl(var(--block-purple-700))",
                    600: "hsl(var(--block-purple-600))",
                    500: "hsl(var(--block-purple-500))",
                },
                "block-indigo": {
                    800: "hsl(var(--block-indigo-800))",
                    700: "hsl(var(--block-indigo-700))",
                    600: "hsl(var(--block-indigo-600))",
                    500: "hsl(var(--block-indigo-500))",
                },
                "block-blue": {
                    700: "hsl(var(--block-blue-700))",
                    600: "hsl(var(--block-blue-600))",
                    500: "hsl(var(--block-blue-500))",
                    400: "hsl(var(--block-blue-400))",
                },
                "block-cyan": {
                    500: "hsl(var(--block-cyan-500))",
                    400: "hsl(var(--block-cyan-400))",
                    300: "hsl(var(--block-cyan-300))",
                },
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
        },
    },
    plugins: [tailwindcssAnimate],
} satisfies Config;
