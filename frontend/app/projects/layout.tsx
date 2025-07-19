import Link from "next/link";
import { ThemeSwitcher } from "@/components/theme-switcher";

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
    return (
        <main className="min-h-screen flex flex-col items-center">
            <div className="flex-1 w-full flex flex-col gap-20 items-center">
                <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
                    <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
                        <div className="flex gap-5 items-center font-semibold">
                            <Link href="/">SQL Query Builder</Link>
                            <div className="flex items-center gap-2">
                                <Link href="/projects" className="hover:underline">
                                    Projects
                                </Link>
                            </div>
                        </div>
                        <ThemeSwitcher />
                    </div>
                </nav>
                <div className="flex-1 flex flex-col gap-10 w-full max-w-5xl p-5">{children}</div>
                <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
                    <p>SQL Query Builder - Block-based Programming</p>
                </footer>
            </div>
        </main>
    );
}
