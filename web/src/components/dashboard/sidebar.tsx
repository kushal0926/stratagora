"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { signOut } from "@/lib/auth-client";
import {
  LayoutDashboard,
  ChessKnight,
  Sparkles,
  MessageSquare,
  Settings,
  LogOut,
} from "lucide-react";
import Image from "next/image";

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "My Games",
    href: "/dashboard/games",
    icon: ChessKnight,
  },
  {
    name: "Analyze",
    href: "/dashboard/analyze",
    icon: Sparkles,
  },
  {
    name: "AI Chat",
    href: "/dashboard/chat",
    icon: MessageSquare,
  },
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <div className="flex h-full w-64 flex-col bg-kala border-r border-white/5">
      {/* Logo */}
      <div className="flex items-center p-5">
        <Link href="/" className="flex items-center gap-2.5">
          <h1 className="text-3xl logo text-cream hover:text-chess">
            stratagora
          </h1>
          <Image
            src="/chess.png"
            alt="stratagora logo"
            width={62}
            height={32}
          />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-bold transition-colors",
                isActive
                  ? "bg-chess text-ink"
                  : "text-cream hover:bg-chess hover:text-gray-900",
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer - Logout */}
      <div className="border-t border-white/5 p-3">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-1 rounded-lg px-3 py-2 text-sm font-bold text-cream hover:bg-chess hover:text-ink transition-colors"
        >
          <LogOut className="h-5 w-5 align-middle" />
          <span className="font-bold mx-0">Logout</span>
        </button>
      </div>
    </div>
  );
}
