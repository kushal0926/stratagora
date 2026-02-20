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
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Loader2, Search, User, Trophy, Clock, Download } from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ChesscomPlayer {
  username: string;
  rating: number;
  title?: string;
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
  const [filteredGames, setFilteredGames] = useState<ChesscomGame[]>([]);
  const [selectedGames, setSelectedGames] = useState<Set<number>>(new Set());
  const [isLoadingPlayer, setIsLoadingPlayer] = useState(false);
  const [isLoadingGames, setIsLoadingGames] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);

  // Filters
  const [timeClassFilter, setTimeClassFilter] = useState("all");
  const [resultFilter, setResultFilter] = useState("all");

  const handleFetchPlayer = async () => {
    if (!username.trim()) {
      toast.error("Please enter a username");
      return;
    }

    setIsLoadingPlayer(true);
    setPlayer(null);
    setGames([]);
    setFilteredGames([]);
    setSelectedGames(new Set());

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
          limit: 20,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch games");
      }

      const fetchedGames = data.data.games || [];
      setGames(fetchedGames);
      applyFilters(fetchedGames, timeClassFilter, resultFilter);

      if (fetchedGames.length === 0) {
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

  const applyFilters = (
    gamesToFilter: ChesscomGame[],
    timeClass: string,
    result: string,
  ) => {
    let filtered = gamesToFilter;

    if (timeClass !== "all") {
      filtered = filtered.filter((g) => g.time_class === timeClass);
    }

    if (result !== "all") {
      filtered = filtered.filter((g) => {
        const isWhite =
          g.white.username.toLowerCase() === username.toLowerCase();
        const playerResult = isWhite ? g.white.result : g.black.result;

        if (result === "win") return playerResult === "win";
        if (result === "loss")
          return ["checkmated", "resigned", "timeout"].includes(playerResult);
        if (result === "draw")
          return !["win", "checkmated", "resigned", "timeout"].includes(
            playerResult,
          );
        return true;
      });
    }

    setFilteredGames(filtered);
    setSelectedGames(new Set()); // Clear selection when filters change
  };

  const handleTimeClassFilterChange = (value: string) => {
    setTimeClassFilter(value);
    applyFilters(games, value, resultFilter);
  };

  const handleResultFilterChange = (value: string) => {
    setResultFilter(value);
    applyFilters(games, timeClassFilter, value);
  };

  const toggleGameSelection = (index: number) => {
    const newSelected = new Set(selectedGames);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedGames(newSelected);
  };

  const selectAll = () => {
    if (selectedGames.size === filteredGames.length) {
      setSelectedGames(new Set());
    } else {
      setSelectedGames(new Set(filteredGames.map((_, i) => i)));
    }
  };

  const handleBulkImport = async () => {
    if (selectedGames.size === 0) {
      toast.error("Please select games to import");
      return;
    }

    setIsImporting(true);
    setImportProgress(0);

    const gamesToImport = Array.from(selectedGames).map((index) => ({
      pgn: filteredGames[index].pgn,
      chesscomUrl: filteredGames[index].url,
      source: "chesscom",
    }));

    try {
      const response = await fetch("/api/games", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ games: gamesToImport }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Import failed");
      }

      const { results } = data;

      // Show summary
      toast.success("Import Complete!", {
        description: `Imported: ${results.imported} | Duplicates: ${results.duplicates} | Failed: ${results.failed}`,
      });

      setSelectedGames(new Set());
      setImportProgress(100);
    } catch (error) {
      toast.error("Import failed", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setIsImporting(false);
      setTimeout(() => setImportProgress(0), 2000);
    }
  };

  const getResultBadge = (game: ChesscomGame) => {
    const isWhite =
      game.white.username.toLowerCase() === username.toLowerCase();
    const playerResult = isWhite ? game.white.result : game.black.result;

    if (playerResult === "win") {
      return (
        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
          Win
        </Badge>
      );
    }
    if (["checkmated", "resigned", "timeout"].includes(playerResult)) {
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
            Enter a Chess.com username to fetch and import games
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
      {(isLoadingGames || filteredGames.length > 0) && (
        <Card className="bg-minimal border border-white/5">
          <CardHeader>
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-cream">Recent Games</CardTitle>
                  <CardDescription className="text-gray-400">
                    {selectedGames.size > 0
                      ? `${selectedGames.size} game${selectedGames.size > 1 ? "s" : ""} selected`
                      : "Select games to import"}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  {selectedGames.size > 0 && (
                    <Button
                      onClick={handleBulkImport}
                      disabled={isImporting}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {isImporting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          Importing...
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4 mr-2" />
                          Import Selected ({selectedGames.size})
                        </>
                      )}
                    </Button>
                  )}
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
              </div>

              {/* Filters */}
              {filteredGames.length > 0 && (
                <div className="flex gap-2">
                  <Select
                    value={timeClassFilter}
                    onValueChange={handleTimeClassFilterChange}
                  >
                    <SelectTrigger className="w-45 bg-chess border-white/5 text-cream">
                      <SelectValue placeholder="Time control" />
                    </SelectTrigger>
                    <SelectContent className="bg-minimal border-white/5">
                      <SelectItem value="all" className="text-cream">
                        All Types
                      </SelectItem>
                      <SelectItem value="bullet" className="text-cream">
                        ⚡ Bullet
                      </SelectItem>
                      <SelectItem value="blitz" className="text-cream">
                        🔥 Blitz
                      </SelectItem>
                      <SelectItem value="rapid" className="text-cream">
                        ⏱️ Rapid
                      </SelectItem>
                      <SelectItem value="daily" className="text-cream">
                        📅 Daily
                      </SelectItem>
                    </SelectContent>
                  </Select>

                  <Select
                    value={resultFilter}
                    onValueChange={handleResultFilterChange}
                  >
                    <SelectTrigger className="w-45 bg-chess border-white/5 text-cream">
                      <SelectValue placeholder="Result" />
                    </SelectTrigger>
                    <SelectContent className="bg-minimal border-white/5">
                      <SelectItem value="all" className="text-cream">
                        All Results
                      </SelectItem>
                      <SelectItem value="win" className="text-green-400">
                        Wins
                      </SelectItem>
                      <SelectItem value="loss" className="text-red-400">
                        Losses
                      </SelectItem>
                      <SelectItem value="draw" className="text-gray-400">
                        Draws
                      </SelectItem>
                    </SelectContent>
                  </Select>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={selectAll}
                    className="bg-chess border-white/5 hover:bg-cream text-cream"
                  >
                    {selectedGames.size === filteredGames.length
                      ? "Deselect All"
                      : "Select All"}
                  </Button>
                </div>
              )}

              {/* Import Progress */}
              {isImporting && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <span>Importing games...</span>
                    <span>{Math.round(importProgress)}%</span>
                  </div>
                  <Progress value={importProgress} className="h-2" />
                </div>
              )}
            </div>
          </CardHeader>

          <CardContent>
            {isLoadingGames ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-cream animate-spin" />
              </div>
            ) : filteredGames.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                No games match your filters
              </div>
            ) : (
              <div className="space-y-2">
                {filteredGames.map((game, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-lg bg-chess border border-white/5 hover:border-cream/30 transition-colors"
                  >
                    <Checkbox
                      checked={selectedGames.has(index)}
                      onCheckedChange={() => toggleGameSelection(index)}
                      className="border-white/20"
                    />

                    <div
                      onClick={() => {
                        if (game.pgn) {
                          onGameSelected(game.pgn);
                          toast.success("Game loaded for analysis");
                        }
                      }}
                      className="flex-1 cursor-pointer"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-cream font-medium text-sm">
                          {game.white.username}
                        </span>
                        <span className="text-gray-500 text-xs">vs</span>
                        <span className="text-cream font-medium text-sm">
                          {game.black.username}
                        </span>
                        {getResultBadge(game)}
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
