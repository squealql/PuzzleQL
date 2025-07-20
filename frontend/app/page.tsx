import { AuthButton } from "@/components/auth-button";
import { SiteHeader } from "@/components/site-header";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { PROJECT_NAME } from "@/lib/config";
import { hasEnvVars } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { GetStartedButton, SignUpButton } from "@/components/ui/button-wrappers";
import { BackgroundBoxesWrapper } from "@/components/ui/background-boxes-wrapper";
import { FeatureCardsWrapper } from "@/components/ui/feature-cards-wrapper";

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
                                <div className="flex justify-center">
                                    <Image
                                        src="/puzzleql-transparent.png"
                                        alt={PROJECT_NAME}
                                        width={400}
                                        height={100}
                                        style={{ height: "auto" }}
                                        className="w-auto max-w-[80%] md:max-w-[500px]"
                                        priority
                                    />
                                </div>
                                <TextGenerateEffect
                                    words="Build complex SQL queries with an intuitive drag-and-drop interface. No more syntax errors, just seamless data exploration."
                                    className="max-w-[600px] text-ui-navy-700 dark:text-ui-beige-300 md:text-xl mx-auto"
                                />
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <Link href="/projects">
                                        <GetStartedButton />
                                    </Link>
                                    <Link href="/auth/sign-up">
                                        <SignUpButton />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section with Background Boxes */}
                <section id="features" className="w-full py-16 md:py-24 relative overflow-hidden">
                    <BackgroundBoxesWrapper className="absolute inset-0 z-0" containerClassName="opacity-30 scale-125" />
                    <div className="container mx-auto px-4 md:px-6 relative z-10">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold tracking-tighter text-ui-navy-900 dark:text-white">Why {PROJECT_NAME}?</h2>
                        </div>
                        <div className="flex justify-center">
                            <FeatureCardsWrapper className="max-w-[1200px]" />
                        </div>
                    </div>
                </section>
            </main>

            <footer className="w-full border-t border-t-foreground/10 bg-white dark:bg-ui-navy-900 relative overflow-hidden">
                <BackgroundBoxesWrapper className="absolute inset-0 z-0" containerClassName="opacity-10 scale-75" />
                <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between py-8 px-4 relative z-10">
                    <div className="flex flex-col items-center md:items-start mb-4 md:mb-0">
                        <h3 className="text-lg font-bold text-ui-navy-800 dark:text-white mb-2">{PROJECT_NAME}</h3>
                        <p className="text-sm text-ui-navy-600 dark:text-ui-beige-200">&copy; {new Date().getFullYear()} All rights reserved.</p>
                    </div>
                    <div className="flex flex-col items-center md:items-end">
                        <p className="text-sm text-ui-navy-600 dark:text-ui-beige-200 mb-2">Powered by</p>
                        <a
                            href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
                            target="_blank"
                            className="font-bold hover:underline flex items-center gap-1 text-ui-navy-700 dark:text-ui-beige-100"
                            rel="noreferrer"
                        >
                            <span>Supabase</span>
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
