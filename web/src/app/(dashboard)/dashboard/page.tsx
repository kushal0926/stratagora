import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {session?.user.name || 'Chess Player'}! 👋
        </h1>
        <p className="text-gray-600 mt-2">
          Ready to analyze your chess games?
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Games Analyzed</CardTitle>
            <CardDescription>Total games uploaded</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">0</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Brilliant Moves</CardTitle>
            <CardDescription>Your best plays</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">0</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Blunders</CardTitle>
            <CardDescription>Mistakes to learn from</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">0</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Name:</span>
            <span className="font-medium">{session?.user.name || 'Not set'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Email:</span>
            <span className="font-medium">{session?.user.email}</span>
          </div>
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
        </CardContent>
      </Card>

      <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">🚀 Coming Soon</h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li>📤 Upload PGN games</li>
          <li>♟️ View games on interactive board</li>
          <li>🧠 Stockfish analysis</li>
          <li>🤖 Chat with AI chess coach</li>
          <li>📊 Track your improvement</li>
        </ul>
      </div>
    </div>
  );
}