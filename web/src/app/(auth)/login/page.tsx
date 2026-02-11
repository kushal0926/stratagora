"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card";
import { ArrowLeft, Loader2 } from "lucide-react";
import Image from "next/image";
import Logo from "@/components/logo";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit(e: React.ChangeEvent<HTMLFormElement>) {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const result = await signIn.email({
                email,
                password,
            });

            if (result.error) {
                setError(result.error.message || "failed to sign in");
            } else {
                router.push("/dashboard");
                router.refresh();
            }
        } catch (err) {
            setError("an unexpected error occurred");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
            {/* left side */}
            <div className="flex items-center justify-center p-6 bg-kala">
                <div className="w-full max-w-md">
                    {/* Back to home */}
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-sm text-cream hover:text-gray-400 mb-6"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to home
                    </Link>

                    <Card className="border-0 bg-kala text-cream rounded-md">
                        <CardHeader className="space-y-1 text-center">
                            <Logo />
                        </CardHeader>
                        <form onSubmit={handleSubmit}>
                            <CardContent className="space-y-4">
                                {error && (
                                    <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                                        {error}
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="you@example.com"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        required
                                        disabled={isLoading}
                                        className="h-11 bg-transparent text-cream border border-white/5 text-sm"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password">Password</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        required
                                        disabled={isLoading}
                                        className="h-11 bg-transparent text-cream border-white/5 text-sm"
                                    />
                                </div>
                            </CardContent>

                            <CardFooter className="flex flex-col space-y-4">
                                <Button
                                    type="submit"
                                    className="w-full h-11 mt-4 bg-chess text-ink hover:bg-cream font-extrabold"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            <span className="font-bold">Logging in...</span>
                                        </>
                                    ) : (
                                        <span className="font-bold">Login</span>
                                    )}
                                </Button>

                                <p className="text-1xl text-center text-gray-400 ">
                                    Don&apos;t have an account?{" "}
                                    <Link
                                        href="/signup"
                                        className="text-cream hover:underline font-medium"
                                    >
                                        Sign up
                                    </Link>
                                </p>
                            </CardFooter>
                        </form>
                    </Card>
                </div>
            </div>
            {/* right side */}
            <div className="bg-black content p-0 m-0 hidden h-full w-full flex-1 basis-0 flex-col items-center justify-center text-center lg:flex">
                <Image
                    src="/chessboard.png"
                    alt="chessboard"
                    width={300}
                    height={300}
                />
                <span className="text-white text-typography-strong max-w-100 text-2xl font-bold mt-10">
                    Welcome back, its great to see you
                </span>
            </div>
        </div>
    );
}
