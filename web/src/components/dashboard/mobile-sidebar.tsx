'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { signOut } from '@/lib/auth-client';
import {
  Menu,
  LayoutDashboard,
  ChessKnight,
  Sparkles,
  MessageSquare,
  Settings,
  LogOut,
} from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'My Games', href: '/dashboard/games', icon: ChessKnight },
  { name: 'Analyze', href: '/dashboard/analyze', icon: Sparkles },
  { name: 'AI Chat', href: '/dashboard/chat', icon: MessageSquare },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export default function MobileSidebar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    setOpen(false);
    router.push('/login');
    router.refresh();
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6 text-cream" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0">
        <div className="flex h-full flex-col bg-kala">
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
                  onClick={() => setOpen(false)}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-chess text-ink'
                      : 'text-cream hover:bg-gray-50'
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="border-t p-3">
            <button
              type="button"
              onClick={handleLogout}
              className="bg-chess flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-ink hover:bg-gray-50"
            >
              <LogOut className="h-5 w-5" />
              <span className='font-bold'>Logout</span>
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
