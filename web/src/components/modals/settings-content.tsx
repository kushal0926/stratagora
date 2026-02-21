'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Palette, Bell, Shield } from 'lucide-react';

interface SettingsModalContentProps {
  user: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
    emailVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
  };
}

export default function SettingsModalContent({ user }: SettingsModalContentProps) {
  const initials = user.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase() || 'U';

  return (
    <div className="p-6 space-y-6">
      {/* Profile */}
      <Card className="bg-minimal border border-white/5">
        <CardHeader>
          <div className="flex items-center gap-3">
            <User className="w-5 h-5 text-cream" />
            <CardTitle className="text-cream">Profile</CardTitle>
          </div>
          <CardDescription className="text-gray-400">
            Your account information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.image || undefined} />
              <AvatarFallback className="bg-blue-600 text-white text-2xl">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-lg text-cream">{user.name}</p>
              <p className="text-sm text-gray-400">{user.email}</p>
            </div>
          </div>

          <div className="space-y-2 pt-4 border-t border-white/5">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Email Verified:</span>
              <span className="font-medium text-cream">
                {user.emailVerified ? '✅ Yes' : '❌ No'}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Member Since:</span>
              <span className="font-medium text-cream">
                {new Date(user.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card className="bg-minimal border border-white/5">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Palette className="w-5 h-5 text-cream" />
            <CardTitle className="text-cream">Appearance</CardTitle>
          </div>
          <CardDescription className="text-gray-400">
            Customize your experience
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">🚧 Coming soon</p>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card className="bg-minimal border border-white/5">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-cream" />
            <CardTitle className="text-cream">Notifications</CardTitle>
          </div>
          <CardDescription className="text-gray-400">
            Manage your notification preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">🚧 Coming soon</p>
        </CardContent>
      </Card>

      {/* Privacy & Security */}
      <Card className="bg-minimal border border-white/5">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-cream" />
            <CardTitle className="text-cream">Privacy & Security</CardTitle>
          </div>
          <CardDescription className="text-gray-400">
            Manage your account security
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">🚧 Coming soon</p>
        </CardContent>
      </Card>
    </div>
  );
}