import Link from "next/link";
import { Button } from "./ui/button";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Logo from "./logo";

export default async function Navbar() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    return (
        <nav>
            {/* Header */}
            <header className=" backdrop-blur-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        < Logo/>

                        <nav className="flex items-center gap-4">
                            {session ? (
                                <>
                                    <Link href="/dashboard">
                                        <Button variant="ghost">
                                            Dashboard
                                        </Button>
                                    </Link>
                                    <span className="text-sm text-gray-600">
                                        {session.user.name}
                                    </span>
                                </>
                            ) : (
                                <>
                                    <Link href="/login">
                                        <Button variant="ghost">Login</Button>
                                    </Link>
                                    <Link href="/signup">
                                        <Button>Get Started</Button>
                                    </Link>
                                </>
                            )}
                        </nav>
                    </div>
                </div>
            </header>
        </nav>
    );
}
