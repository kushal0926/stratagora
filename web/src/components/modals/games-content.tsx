'use client';

import { useEffect, useMemo, useState } from 'react';
import GameCard from '@/components/chess/game-card';
import GameCardSkeleton from '@/components/chess/game-card-skeleton';
import EmptyState from '@/components/ui/empty-state';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { toast } from 'sonner';

interface Game {
  id: string;
  white: string;
  black: string;
  result: string;
  event?: string | null;
  date?: string | null;
  whiteElo?: string | null;
  blackElo?: string | null;
  createdAt: Date;
}

interface GamesModalContentProps {
  onGameClick: (gameId: string) => void;
}

export default function GamesModalContent({ onGameClick }: GamesModalContentProps) {
  const [games, setGames] = useState<Game[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    const fetchGames = async () => {
      try {
        const response = await fetch('/api/games', { signal: controller.signal });
        if (!response.ok) throw new Error('Failed to fetch games');

        const data = await response.json();
        setGames(data.games);
      } catch {
        if (!controller.signal.aborted) {
          toast.error('Failed to load games');
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    fetchGames();

    return () => controller.abort();
  }, []);

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredGames = useMemo(() => {
    if (!normalizedQuery) return games;

    return games.filter((game) =>
      game.white.toLowerCase().includes(normalizedQuery) ||
      game.black.toLowerCase().includes(normalizedQuery) ||
      game.event?.toLowerCase().includes(normalizedQuery)
    );
  }, [games, normalizedQuery]);

  const handleDeleteGame = async (id: string) => {
    try {
      const response = await fetch(`/api/games/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete game');

      toast.success('Game deleted successfully');
      setGames((previousGames) => previousGames.filter((game) => game.id !== id));
    } catch {
      toast.error('Failed to delete game');
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <GameCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {games.length > 0 && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <Input
            placeholder="Search by player name or event..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-chess border-white/5 text-cream"
          />
        </div>
      )}

      {filteredGames.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredGames.map((game) => (
            <GameCard
              key={game.id}
              game={game}
              onDelete={handleDeleteGame}
              onView={onGameClick}
            />
          ))}
        </div>
      ) : games.length > 0 ? (
        <EmptyState
          icon={<div className="text-4xl">🔍</div>}
          title="No games found"
          description="Try a different search term"
        />
      ) : (
        <EmptyState
          icon={<div className="text-6xl">♟️</div>}
          title="No games yet"
          description="Upload your first game to start analyzing"
        />
      )}
    </div>
  );
}
