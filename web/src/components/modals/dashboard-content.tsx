'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, TrendingUp, AlertCircle } from 'lucide-react';

interface DashboardModalContentProps {
  userName: string;
}

export default function DashboardModalContent({ userName }: DashboardModalContentProps) {
  const [gameCount, setGameCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/games');
      if (response.ok) {
        const data = await response.json();
        setGameCount(data.games.length);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Welcome */}
      <div>
        <h3 className="text-2xl font-bold text-cream">
          Welcome back, {userName.split(' ')[0]}! 👋
        </h3>
        <p className="text-gray-400 mt-2">
          Here&aposs your chess improvement dashboard
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="bg-minimal hover:bg-[#222222] border border-white/5">
          <CardHeader className="text-center">
            <CardDescription className="text-cream font-bold text-2xl">
              Total Games
            </CardDescription>
            <CardTitle className="text-3xl text-cream">
              {isLoading ? '...' : gameCount}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card className="bg-minimal hover:bg-[#222222] border border-white/5">
          <CardHeader className="text-center">
            <CardDescription className="text-cream font-bold text-2xl">
              Brilliant Moves
            </CardDescription>
            <CardTitle className="text-3xl text-green-600">0</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-xs text-gray-500">Coming with Stockfish analysis</p>
          </CardContent>
        </Card>

        <Card className="bg-minimal hover:bg-[#222222] border border-white/5">
          <CardHeader className="text-center">
            <CardDescription className="text-cream font-bold text-2xl">
              Blunders
            </CardDescription>
            <CardTitle className="text-3xl text-red-600">0</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-xs text-gray-500">Coming with Stockfish analysis</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-minimal border border-white/5">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Trophy className="w-8 h-8 text-yellow-500" />
              <div>
                <CardTitle className="text-cream text-lg">Achievements</CardTitle>
                <CardDescription className="text-gray-400">
                  Track your milestones
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">Coming soon...</p>
          </CardContent>
        </Card>

        <Card className="bg-minimal border border-white/5">
          <CardHeader>
            <div className="flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-blue-500" />
              <div>
                <CardTitle className="text-cream text-lg">Progress</CardTitle>
                <CardDescription className="text-gray-400">
                  Your improvement over time
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">Coming soon...</p>
          </CardContent>
        </Card>
      </div>

  
    </div>
  );
}