"use client";

import { useSession } from "@/lib/auth-client";
import {
  LayoutDashboard,
  Trophy,
  Sparkles,
  Settings,
  Lock,
  LogOut,
  BotMessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DockItem {
  id: string;
  label: string;
  icon: React.ElementType;
  requiresAuth: boolean;
}

const dockItems: DockItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    requiresAuth: true,
  },
  {
    id: "games",
    label: "My Games",
    icon: Trophy,
    requiresAuth: true,
  },
  {
    id: "analyze",
    label: "Analyze",
    icon: Sparkles,
    requiresAuth: false,
  },
  {
    id: "chat",
    label: "AI Chat",
    icon: BotMessageSquare,
    requiresAuth: true,
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    requiresAuth: true,
  },
];

interface DockSidebarProps {
  onItemClick: (itemId: string) => void;
  onItemHover?: (itemId: string) => void;
  onLoginRequired: () => void;
  onLogout: () => void;
  activeItem: string | null;
}

export default function DockSidebar({
  onItemClick,
  onItemHover,
  onLoginRequired,
  onLogout,
  activeItem,
}: DockSidebarProps) {
  const { data: session } = useSession();

  const handleItemClick = (item: DockItem) => {
    if (item.requiresAuth && !session) {
      onLoginRequired();
    } else {
      onItemClick(item.id);
    }
  };

  return (
    <div className="fixed left-4 top-1/2 -translate-y-1/2 z-50">
      <div className="bg-minimal backdrop-blur-xl border border-white/5 rounded-xl p-3">
        <div className="flex flex-col gap-2 text-cream">
          {dockItems.map((item) => {
            const Icon = item.icon;
            const isLocked = item.requiresAuth && !session;
            const isActive = activeItem === item.id;

            return (
              <div
                key={item.id}
                className="relative group"
                onMouseEnter={() => onItemHover?.(item.id)}
              >
                <button
                  onClick={() => handleItemClick(item)}
                  onFocus={() => onItemHover?.(item.id)}
                  aria-pressed={isActive}
                  className={cn(
                    "relative w-12 h-12 rounded-xl flex items-center justify-center transform-gpu will-change-transform transition-all duration-200 ease-out active:scale-95",
                    isActive && "bg-cream text-ink",
                    !isActive && "text-cream hover:bg-chess hover:scale-105",
                    isLocked && "opacity-50",
                  )}
                >
                  <Icon
                    className={cn(
                      "w-6 h-6 transition-colors duration-200 ",
                      isActive ? "text-ink" : "text-cream",
                    )}
                  />
                  {isLocked && (
                    <Lock className="w-3 h-3 absolute top-1 right-1 text-red-400" />
                  )}
                </button>

                {/* Tooltip */}
                <div className="pointer-events-none absolute left-full ml-3 top-1/2 -translate-y-1/2 translate-x-1 opacity-0 transition-all duration-150 ease-out group-hover:translate-x-0 group-hover:opacity-100">
                  <div className="m-2 px-3 py-2 bg-minimal border border-white/5 rounded whitespace-nowrap">
                    <p className="text-sm font-bold text-cream flex items-center ">
                      {item.label}
                      {isLocked && (
                        <span className="ml-2 text-xs text-red-400">
                          (Login required)
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Logout button if logged in */}
          {session && (
            <>
              <div className="h-px bg-white/10 my-1" />
              <div className="relative group">
                <button
                  onClick={onLogout}
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-cream hover:bg-red-500/20 transition-all duration-200 ease-out active:scale-95 hover:scale-105"
                >
                  <LogOut className="w-6 h-6" />
                </button>

                <div className="pointer-events-none absolute left-full ml-3 top-1/2 -translate-y-1/2 translate-x-1 opacity-0 transition-all duration-150 ease-out group-hover:translate-x-0 group-hover:opacity-100">
                  <div className="px-3 py-2 bg-minimal border border-white/10 rounded-lg whitespace-nowrap">
                    <p className="text-sm font-medium text-cream">Logout</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
