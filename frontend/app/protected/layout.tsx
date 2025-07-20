import { DeployButton } from "@/components/deploy-button";
import { EnvVarWarning } from "@/components/env-var-warning";
import { AuthButton } from "@/components/auth-button";
import { SiteHeader } from "@/components/site-header";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/lib/utils";
import { PROJECT_NAME } from "@/lib/config";

import Link from "next/link";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen flex flex-col items-center">
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
        <SiteHeader>
            <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16 bg-white dark:bg-ui-navy-900">
                <div className="w-full max-w-7xl flex justify-between items-center p-3 text-sm">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="font-bold text-lg text-ui-navy-900 dark:text-white">
                            {}
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

                  <div className="p-10 flex-1 flex flex-col p-5">
                    {children}
                  </div>
        <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
            <p>SQL Query Builder - Block-based Programming</p>
        </footer>
    </div>
</main>

  );
}
