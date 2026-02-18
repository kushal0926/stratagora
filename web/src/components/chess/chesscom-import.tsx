"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search, User, Trophy, Clock } from "lucide-react";
import { toast } from "sonner";

interface ChesscomPlayer {
  username: string;
  rating: number;
  title?: string;
  avatar?: string;
}

interface ChesscomGame {
  url: string;
  pgn: string;
  time_control: string;
  end_time: number;
  rated: boolean;
  time_class: string;
  white: {
    rating: number;
    result: string;
    username: string;
  };
  black: {
    rating: number;
    result: string;
    username: string;
  };
}

interface ChesscomImportProps {
  onGameSelected: (pgn: string) => void;
}

export default function ChesscomImport({
  onGameSelected,
}: ChesscomImportProps) {
  const [username, setUsername] = useState("");
  const [player, setPlayer] = useState<ChesscomPlayer | null>(null);
  const [games, setGames] = useState<ChesscomGame[]>([]);
  const [isLoadingPlayer, setIsLoadingPlayer] = useState(false);
  const [isLoadingGames, setIsLoadingGames] = useState(false);
  const [gameLimit, setGameLimit] = useState(10);
  // console.log(setGameLimit)

  const handleFetchPlayer = async () => {
    if (!username.trim()) {
      toast.error("Please enter a username");
      return;
    }

    setIsLoadingPlayer(true);
    setPlayer(null);
    setGames([]);

    try {
      const response = await fetch("/api/chesscom/player", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Player not found");
      }

      setPlayer(data.data);
      toast.success(`Found player: ${data.data.username}`);

      // Auto fetch games
      await handleFetchGames(username.trim());
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Player not found");
    } finally {
      setIsLoadingPlayer(false);
    }
  };

  const handleFetchGames = async (user: string) => {
    setIsLoadingGames(true);
    try {
      const response = await fetch("/api/chesscom/games", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: user || username.trim(),
          limit: gameLimit,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch games");
      }

      setGames(data.data.games || []);

      if (data.data.games?.length === 0) {
        toast.info("No recent games found");
      } else {
        toast.success(`Found ${data.data.count} recent games`);
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to fetch games",
      );
    } finally {
      setIsLoadingGames(false);
    }
  };

  const getResultBadge = (game: ChesscomGame, targetUsername: string) => {
    const isWhite =
      game.white.username.toLowerCase() === targetUsername.toLowerCase();
    const playerResult = isWhite ? game.white.result : game.black.result;

    if (playerResult === "win")
      return (
        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
          Win
        </Badge>
      );
    if (
      playerResult === "checkmated" ||
      playerResult === "resigned" ||
      playerResult === "timeout"
    ) {
      return (
        <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
          Loss
        </Badge>
      );
    }
    return (
      <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">
        Draw
      </Badge>
    );
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString();
  };

  const formatTimeControl = (timeControl: string) => {
    const seconds = parseInt(timeControl);
    if (isNaN(seconds)) return timeControl;
    const minutes = Math.floor(seconds / 60);
    return `${minutes} min`;
  };

  const getTimeClass = (timeClass: string) => {
    const classes: Record<string, string> = {
      bullet: "⚡ Bullet",
      blitz: "🔥 Blitz",
      rapid: "⏱️ Rapid",
      daily: "📅 Daily",
    };
    return classes[timeClass] || timeClass;
  };

  return (
    <div className="space-y-6">
      {/* Search Player */}
      <Card className="bg-minimal border border-white/5">
        <CardHeader>
          <CardTitle className="text-cream">Import from Chess.com</CardTitle>
          <CardDescription className="text-gray-400">
            Enter a Chess.com username to fetch recent games
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter Chess.com username (e.g. hikaru)"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleFetchPlayer()}
              className="bg-chess border-white/5 text-cream placeholder:text-gray-500"
            />
            <Button
              onClick={handleFetchPlayer}
              disabled={isLoadingPlayer || !username.trim()}
              className="bg-chess border-white/5 hover:bg-cream"
            >
              {isLoadingPlayer ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
            </Button>
          </div>

          {/* Player Info */}
          {player && (
            <div className="flex items-center gap-4 p-4 bg-chess rounded-lg border border-white/5">
              <div className="w-12 h-12 bg-cream/10 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-cream" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-bold text-cream">{player.username}</p>
                  {player.title && (
                    <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                      {player.title}
                    </Badge>
                  )}
                </div>
                {player.rating > 0 && (
                  <div className="flex items-center gap-1 text-gray-400 text-sm">
                    <Trophy className="w-3 h-3" />
                    <span>Rating: {player.rating}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Games List */}
      {(isLoadingGames || games.length > 0) && (
        <Card className="bg-minimal border border-white/5">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-cream">Recent Games</CardTitle>
                <CardDescription className="text-gray-400">
                  Click on a game to analyze it
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleFetchGames(username)}
                disabled={isLoadingGames}
                className="bg-chess border-white/5 hover:bg-cream text-cream"
              >
                {isLoadingGames ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Refresh"
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isLoadingGames ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-cream animate-spin" />
              </div>
            ) : (
              <div className="space-y-2">
                {games.map((game, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      if (game.pgn) {
                        onGameSelected(game.pgn);
                        toast.success("Game loaded for analysis");
                      } else {
                        toast.error("No PGN available for this game");
                      }
                    }}
                    className="flex items-center justify-between p-3 rounded-lg bg-chess border border-white/5 hover:border-cream/30 cursor-pointer transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-cream font-medium text-sm">
                          {game.white.username}
                        </span>
                        <span className="text-gray-500 text-xs">vs</span>
                        <span className="text-cream font-medium text-sm">
                          {game.black.username}
                        </span>
                        {getResultBadge(game, username)}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span>{getTimeClass(game.time_class)}</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatTimeControl(game.time_control)}
                        </span>
                        <span>{formatDate(game.end_time)}</span>
                        {game.rated && (
                          <Badge className="text-xs bg-blue-500/20 text-blue-400 border-blue-500/30">
                            Rated
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>{game.white.rating}</span>
                      <span>-</span>
                      <span>{game.black.rating}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
