import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default async function SettingsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const initials = session?.user.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase() || 'U';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">
          Manage your account and preferences
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Your account information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={session?.user.image || undefined} />
              <AvatarFallback className="bg-blue-600 text-white text-2xl">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-lg">{session?.user.name}</p>
              <p className="text-sm text-gray-500">{session?.user.email}</p>
            </div>
          </div>

          <div className="space-y-2 pt-4 border-t">
            <div className="flex justify-between">
              <span className="text-gray-600">Email Verified:</span>
              <span className="font-medium">
                {session?.user.emailVerified ? '✅ Yes' : '❌ No'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Member Since:</span>
              <span className="font-medium">
                {new Date(session?.user.createdAt || '').toLocaleDateString()}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Chess Accounts</CardTitle>
          <CardDescription>Link your Chess.com and Lichess accounts</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">🚧 Coming soon</p>
        </CardContent>
      </Card>
    </div>
  );
}
