import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Upload } from 'lucide-react';

export default function GamesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Games</h1>
        <p className="text-gray-600 mt-2">
          View and manage your analyzed chess games
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Game Library</CardTitle>
          <CardDescription>All your uploaded and analyzed games</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-gray-500">
            <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="mb-4">No games yet</p>
            <Link href="/dashboard/analyze">
              <Button>Upload Your First Game</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}