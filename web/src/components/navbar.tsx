import Link from "next/link";
import { Button } from "./ui/button";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Logo from "./logo";
import { LogIn } from "lucide-react";

export default async function Navbar() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <nav>
      {/* Header */}
      <header className=" backdrop-blur-sm sticky top-0 z-50 p-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Logo />

            <nav className="flex items-center gap-4">
              {session ? (
                <>
                  <Link href="/dashboard">
                    <Button
                      variant="ghost"
                      className="p-5 text-cream hover:bg-kala hover:text-chess cursor-pointer"
                    >
                      <span className="text-3xl logo">Dashboard</span>
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/signup">
                    <button className="auth">
                      <span className="font-bold">Join Stratagora</span>
                    </button>
                  </Link>
                  <Link href="/login">
                    <button className="login-btn">
                      <span className="font-bold ml-2">Login</span>
                      <LogIn className="align-middle h-4 w-4 mx-1" />
                    </button>
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
