# Navbar Update Plan

## Objective
Update the navbar on the `/projects/` route to match the design, layout, and functionality of the landing page navbar exactly. Remove the button that links to the palette route, as it is intended only for development purposes.

## Implementation Steps

### 1. Modify projects/layout.tsx

```tsx
import Link from "next/link";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { SiteHeader } from "@/components/site-header";
import { AuthButton } from "@/components/auth-button";
import { FloatingNav } from "@/components/ui/floating-navbar";
import { PROJECT_NAME } from "@/lib/config";
import { hasEnvVars } from "@/lib/utils";

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
    // Define navItems without the Palette link
    const navItems = [
        { name: "Features", link: "/#features" },
        { name: "Projects", link: "/projects" },
    ];

    return (
        <main className="min-h-screen flex flex-col items-center">
            <div className="flex-1 w-full flex flex-col gap-20 items-center">
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
                
                {/* Add FloatingNav without Palette link */}
                <FloatingNav navItems={navItems} />
                
                <div className="flex-1 flex flex-col gap-10 w-full max-w-5xl p-5">{children}</div>
                <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
                    <p>SQL Query Builder - Block-based Programming</p>
                </footer>
            </div>
        </main>
    );
}
```

### Changes Breakdown

1. **Added imports**:
   - `SiteHeader` from "@/components/site-header"
   - `AuthButton` from "@/components/auth-button"
   - `FloatingNav` from "@/components/ui/floating-navbar"
   - `PROJECT_NAME` from "@/lib/config"
   - `hasEnvVars` from "@/lib/utils"

2. **Created navItems array** without the Palette link:
   ```tsx
   const navItems = [
       { name: "Features", link: "/#features" },
       { name: "Projects", link: "/projects" },
   ];
   ```

3. **Updated navbar structure**:
   - Added `SiteHeader` component wrapper
   - Added background color classes (`bg-white dark:bg-ui-navy-900`)
   - Updated max-width from 5xl to 7xl to match landing page
   - Used `PROJECT_NAME` constant instead of hardcoded text
   - Added the hidden md:flex container for navigation links
   - Added the Features link matching the landing page
   - Added proper hover styling (`hover:text-ui-navy-500 dark:hover:text-white`)
   - Added AuthButton component with hasEnvVars check

4. **Added FloatingNav component**:
   - Used the navItems array that excludes the Palette link

### Verification Checklist

- [ ] Navbar uses SiteHeader component for scroll shadow effects
- [ ] Styling matches landing page (max-width-7xl, colors, etc.)
- [ ] PROJECT_NAME constant is used instead of hardcoded text
- [ ] Palette link is removed from both static navbar and floating navbar
- [ ] AuthButton is included
- [ ] All styling and functionality are consistent with landing page