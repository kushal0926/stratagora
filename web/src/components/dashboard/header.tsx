import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import MobileSidebar from './mobile-sidebar';

export default async function DashboardHeader() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const initials = session?.user.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase() || 'U';

  return (
    <header className="sticky top-0 z-40  bg-[#f9f6f0] text-bold">
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
            <p className="text-sm font-medium text-gray-900">
              {session?.user.name}
            </p>
            <p className="text-xs text-gray-500">{session?.user.email}</p>
          </div>
          <Avatar>
            <AvatarImage src={session?.user.image || undefined} />
            <AvatarFallback className="bg-blue-600 text-white">
              {initials}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}