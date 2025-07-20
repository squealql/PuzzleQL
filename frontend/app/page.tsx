import { AuthButton } from "@/components/auth-button";
import { SiteHeader } from "@/components/site-header";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { Button } from "@/components/ui/button";
import { PROJECT_NAME } from "@/lib/config";
import { hasEnvVars } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Blocks, Bot, Combine, Database, Waypoints } from "lucide-react";

export default function HomePage() {
    return (
        <div className="flex flex-col min-h-screen bg-ui-beige-100 dark:bg-ui-navy-950">
            <SiteHeader>
                <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16 bg-white dark:bg-ui-navy-900">
                    <div className="w-full max-w-7xl flex justify-between items-center p-3 text-sm">
                        <div className="flex items-center gap-4">
                            <Link href="/" className="font-bold text-lg text-ui-navy-900 dark:text-white">
                                {PROJECT_NAME}
                            </Link>
                            <div className="hidden md:flex items-center gap-4 text-ui-navy-700 dark:text-ui-beige-300">
                                <Link href="/#features" className="hover:text-ui-navy-500 dark:hover:text-white">
                                    Features
                                </Link>
                                <Link href="/projects" className="hover:text-ui-navy-500 dark:hover:text-white">
                                    Projects
                                </Link>
                                <Link href="/palette" className="hover:text-ui-navy-500 dark:hover:text-white">
                                    Palette
                                </Link>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            {hasEnvVars && <AuthButton />}
                            <ThemeSwitcher />
                        </div>
                    </div>
                </nav>
            </SiteHeader>

            <main className="flex-1 w-full">
                {/* Hero Section */}
                <section className="relative w-full flex-grow flex items-center justify-center py-20 md:py-32 text-center">
                    <Image src="/waves.png" alt="Subtle wave patterns in the background" fill className="object-cover object-bottom z-0 top-20" priority />
                    <div className="absolute inset-0 bg-ui-beige-100/80 dark:bg-ui-navy-950/80 z-10"></div>
                    <div className="relative z-20 container px-4 md:px-6">
                        <div className="grid gap-6 lg:grid-cols-1 items-center">
                            <div className="flex flex-col justify-center space-y-4">
                                <h1 className="text-4xl md:text-6xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-ui-navy-800 to-ui-navy-300">
                                    {PROJECT_NAME}
                                </h1>
                                <TextGenerateEffect
                                    words="Build complex SQL queries with an intuitive drag-and-drop interface. No more syntax errors, just seamless data exploration."
                                    className="max-w-[600px] text-ui-navy-700 dark:text-ui-beige-300 md:text-xl mx-auto"
                                />
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <Link href="/projects">
                                        <Button
                                            size="lg"
                                            className="bg-ui-navy-700 hover:bg-ui-navy-600 text-white dark:bg-ui-navy-500 dark:hover:bg-ui-navy-400"
                                        >
                                            Get Started <ArrowRight className="ml-2" />
                                        </Button>
                                    </Link>
                                    <Link href="/auth/sign-up">
                                        <Button size="lg" variant="outline" className="dark:text-white dark:border-ui-navy-500 dark:hover:bg-ui-navy-800">
                                            Sign Up
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="w-full py-16 md:py-24 flex justify-center">
                    <div className="container px-4 md:px-6">
                        <h2 className="text-3xl font-bold tracking-tighter text-center mb-12 text-ui-navy-900 dark:text-white">Why {PROJECT_NAME}?</h2>
                        <div className="mx-auto grid items-start gap-8 sm:max-w-4xl sm:grid-cols-2 md:gap-12 lg:max-w-5xl lg:grid-cols-3 justify-center">
                            <div className="grid gap-1 text-center p-6 rounded-lg bg-white dark:bg-ui-navy-800 shadow-md">
                                <div className="mx-auto p-3 rounded-full bg-block-pink-500 text-white mb-2">
                                    <Blocks className="h-6 w-6" />
                                </div>
                                <h3 className="text-lg font-bold text-ui-navy-800 dark:text-white">Intuitive Block-Based Builder</h3>
                                <p className="text-sm text-ui-navy-600 dark:text-ui-beige-200">
                                    Visually construct queries by dragging and dropping blocks. Perfect for both beginners and seasoned developers.
                                </p>
                            </div>
                            <div className="grid gap-1 text-center p-6 rounded-lg bg-white dark:bg-ui-navy-800 shadow-md">
                                <div className="mx-auto p-3 rounded-full bg-block-magenta-600 text-white mb-2">
                                    <Database className="h-6 w-6" />
                                </div>
                                <h3 className="text-lg font-bold text-ui-navy-800 dark:text-white">Broad Database Support</h3>
                                <p className="text-sm text-ui-navy-600 dark:text-ui-beige-200">
                                    Connect to your favorite databases including PostgreSQL, MySQL, SQLite, and more.
                                </p>
                            </div>
                            <div className="grid gap-1 text-center p-6 rounded-lg bg-white dark:bg-ui-navy-800 shadow-md">
                                <div className="mx-auto p-3 rounded-full bg-block-purple-700 text-white mb-2">
                                    <Bot className="h-6 w-6" />
                                </div>
                                <h3 className="text-lg font-bold text-ui-navy-800 dark:text-white">AI-Powered Assistance</h3>
                                <p className="text-sm text-ui-navy-600 dark:text-ui-beige-200">
                                    Leverage our intelligent assistant to optimize queries and get suggestions in real-time.
                                </p>
                            </div>
                            <div className="grid gap-1 text-center p-6 rounded-lg bg-white dark:bg-ui-navy-800 shadow-md">
                                <div className="mx-auto p-3 rounded-full bg-block-indigo-700 text-white mb-2">
                                    <Combine className="h-6 w-6" />
                                </div>
                                <h3 className="text-lg font-bold text-ui-navy-800 dark:text-white">Complex Joins Made Easy</h3>
                                <p className="text-sm text-ui-navy-600 dark:text-ui-beige-200">
                                    Effortlessly create and manage complex joins and relationships between tables.
                                </p>
                            </div>
                            <div className="grid gap-1 text-center p-6 rounded-lg bg-white dark:bg-ui-navy-800 shadow-md">
                                <div className="mx-auto p-3 rounded-full bg-block-blue-500 text-white mb-2">
                                    <Waypoints className="h-6 w-6" />
                                </div>
                                <h3 className="text-lg font-bold text-ui-navy-800 dark:text-white">Clear Data Flow Visualization</h3>
                                <p className="text-sm text-ui-navy-600 dark:text-ui-beige-200">
                                    Visualize and understand your data flow with clear, interactive query tools.
                                </p>
                            </div>
                            <div className="grid gap-1 text-center p-6 rounded-lg bg-white dark:bg-ui-navy-800 shadow-md">
                                <div className="mx-auto p-3 rounded-full bg-block-cyan-500 text-white mb-2">
                                    <Blocks className="h-6 w-6" />
                                </div>
                                <h3 className="text-lg font-bold text-ui-navy-800 dark:text-white">Export to Code</h3>
                                <p className="text-sm text-ui-navy-600 dark:text-ui-beige-200">Export your queries to SQL, Python, JavaScript, and more.</p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="w-full border-t border-t-foreground/10 bg-white dark:bg-ui-navy-900">
                <div className="w-full max-w-7xl mx-auto flex items-center justify-between py-6 px-4">
                    <p className="text-sm text-ui-navy-600 dark:text-ui-beige-200">
                        &copy; {new Date().getFullYear()} {PROJECT_NAME}. All rights reserved.
                    </p>
                    <p className="text-sm">
                        Powered by{" "}
                        <a
                            href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
                            target="_blank"
                            className="font-bold hover:underline"
                            rel="noreferrer"
                        >
                            Supabase
                        </a>
                    </p>
                </div>
            </footer>
        </div>
    );
}
