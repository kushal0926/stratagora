'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import GameCard from '@/components/chess/game-card';
import { Search, Filter, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

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

export default function GamesPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [filteredGames, setFilteredGames] = useState<Game[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [resultFilter, setResultFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch games
  useEffect(() => {
    fetchGames();
  }, []);

  // Filter games
  useEffect(() => {
    let filtered = games;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(game =>
        game.white.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.black.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.event?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Result filter
    if (resultFilter !== 'all') {
      filtered = filtered.filter(game => {
        if (resultFilter === 'win') return game.result === '1-0';
        if (resultFilter === 'loss') return game.result === '0-1';
        if (resultFilter === 'draw') return game.result === '1/2-1/2';
        return true;
      });
    }

    setFilteredGames(filtered);
  }, [searchQuery, resultFilter, games]);

  const fetchGames = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/games');
      if (!response.ok) throw new Error('Failed to fetch games');
      
      const data = await response.json();
      setGames(data.games);
      setFilteredGames(data.games);
    } catch (error) {
      console.error('Error fetching games:', error);
      toast.error('Failed to load games');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteGame = async (id: string) => {
    try {
      const response = await fetch(`/api/games/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete game');

      toast.success('Game deleted successfully');
      setGames(games.filter(game => game.id !== id));
    } catch (error) {
      console.error('Error deleting game:', error);
      toast.error('Failed to delete game');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <Loader2 className="w-8 h-8 text-cream animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-cream">My Games</h1>
        <p className="text-gray-400 mt-2">
          {games.length} {games.length === 1 ? 'game' : 'games'} in your library
        </p>
      </div>

      {/* Search and Filter */}
      {games.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <Input
              placeholder="Search by player name or event..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-minimal border-white/5 text-cream placeholder:text-gray-500"
            />
          </div>
          
          <Select value={resultFilter} onValueChange={setResultFilter}>
            <SelectTrigger className="w-full sm:w-45 bg-minimal border-white/5 text-cream">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter by result" />
            </SelectTrigger>
            <SelectContent className="bg-minimal border-white/5">
              <SelectItem value="all" className="text-cream">All Games</SelectItem>
              <SelectItem value="win" className="text-green-500">White Wins</SelectItem>
              <SelectItem value="loss" className="text-red-500">Black Wins</SelectItem>
              <SelectItem value="draw" className="text-gray-400">Draws</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Games Grid */}
      {filteredGames.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredGames.map((game) => (
            <GameCard
              key={game.id}
              game={game}
              onDelete={handleDeleteGame}
            />
          ))}
        </div>
      ) : games.length > 0 ? (
        // No results from filter/search
        <div className="text-center py-12">
          <p className="text-gray-400 mb-4">No games match your filters</p>
          <Button
            onClick={() => {
              setSearchQuery('');
              setResultFilter('all');
            }}
            className="bg-chess text-ink font-bold hover:bg-cream"
          >
            Clear Filters
          </Button>
        </div>
      ) : (
        // No games at all
        <div className="text-center py-12">
          <div className="mb-4">
            <div className="text-6xl mb-4">♟️</div>
            <p className="text-gray-400 mb-2">No games in your library yet</p>
            <p className="text-sm text-gray-500">
              Upload your first game to start analyzing
            </p>
          </div>
          <Link href="/dashboard/analyze">
            <Button className="bg-chess text-ink font-bold hover:bg-cream">
              Analyze Your First Game
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}