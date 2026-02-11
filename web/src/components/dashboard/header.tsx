import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import MobileSidebar from "./mobile-sidebar";

export default async function DashboardHeader() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const initials =
    session?.user.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "U";

  return (
    <header className="sticky top-0 z-40  bg-kala text-bold border-b border-white/5">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Mobile menu button */}
        <MobileSidebar />

        {/* Page title - hidden on mobile, shown on desktop */}
        <div className="hidden md:block">
          <h2 className="text-lg font-semibold text-gray-900">
            {/* Page title will be dynamic */}
          </h2>
        </div>

        {/* User info */}
        <div className="flex items-center gap-3 ml-auto">
          <div className="text-right hidden sm:block">
            <Avatar>
              <AvatarImage src={session?.user.image || undefined} />
              <AvatarFallback className="bg-chess text-ink font-bold border border-white/5">
                {initials}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  );
}
