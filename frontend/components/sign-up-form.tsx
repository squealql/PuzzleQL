"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function SignUpForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        const supabase = createClient();
        setIsLoading(true);
        setError(null);

        if (password !== repeatPassword) {
            setError("Passwords do not match");
            setIsLoading(false);
            return;
        }

        try {
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: `${window.location.origin}/protected`,
                },
            });
            if (error) throw error;
            router.push("/auth/sign-up-success");
        } catch (error: unknown) {
            setError(error instanceof Error ? error.message : "An error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card className="bg-white dark:bg-ui-navy-800 border-ui-navy-200 dark:border-ui-navy-700">
                <CardHeader>
                    <CardTitle className="text-2xl text-ui-navy-900 dark:text-white">Sign up</CardTitle>
                    <CardDescription className="text-ui-navy-500 dark:text-ui-beige-300">Create a new account</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSignUp}>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="email" className="text-ui-navy-800 dark:text-ui-beige-200">
                                    Email
                                </Label>
                                <Input id="email" type="email" placeholder="m@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
                            </div>
                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password" className="text-ui-navy-800 dark:text-ui-beige-200">
                                        Password
                                    </Label>
                                </div>
                                <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                            </div>
                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="repeat-password" className="text-ui-navy-800 dark:text-ui-beige-200">
                                        Repeat Password
                                    </Label>
                                </div>
                                <Input
                                    id="repeat-password"
                                    type="password"
                                    required
                                    value={repeatPassword}
                                    onChange={(e) => setRepeatPassword(e.target.value)}
                                />
                            </div>
                            {error && <p className="text-sm text-ui-terracotta-500">{error}</p>}
                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? "Creating an account..." : "Sign up"}
                            </Button>
                        </div>
                        <div className="mt-4 text-center text-sm text-ui-navy-600 dark:text-ui-beige-300">
                            Already have an account?{" "}
                            <Link href="/auth/login" className="underline underline-offset-4">
                                Login
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
