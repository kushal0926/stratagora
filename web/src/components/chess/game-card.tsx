"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Eye } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface GameCardProps {
  game: {
    id: string;
    white: string;
    black: string;
    result: string;
    event?: string | null;
    date?: string | null;
    whiteElo?: string | null;
    blackElo?: string | null;
    createdAt: Date;
  };
  onDelete: (id: string) => void;
  onView: (id: string) => void;
}

export default function GameCard({ game, onDelete, onView }: GameCardProps) {
  const getResultColor = (result: string) => {
    if (result === "1-0") return "text-green-500";
    if (result === "0-1") return "text-red-500";
    return "text-gray-400";
  };

  const getResultText = (result: string) => {
    if (result === "1-0") return "White wins";
    if (result === "0-1") return "Black wins";
    if (result === "1/2-1/2") return "Draw";
    return "Ongoing";
  };

  return (
    <Card className="bg-minimal hover:bg-[#222222] border border-white/5 rounded transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-cream font-semibold">{game.white}</span>
              {game.whiteElo && (
                <span className="text-xs text-gray-500">({game.whiteElo})</span>
              )}
            </div>
            <div className="text-gray-400 text-sm mb-1">vs</div>
            <div className="flex items-center gap-2">
              <span className="text-cream font-semibold">{game.black}</span>
              {game.blackElo && (
                <span className="text-xs text-gray-500">({game.blackElo})</span>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className={`text-lg font-bold ${getResultColor(game.result)}`}>
              {game.result}
            </div>
            <div className="text-xs text-gray-500">
              {getResultText(game.result)}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {game.event && (
          <div className="text-sm">
            <span className="text-gray-500">Event:</span>{" "}
            <span className="text-gray-300">{game.event}</span>
          </div>
        )}
        {game.date && (
          <div className="text-sm">
            <span className="text-gray-500">Date:</span>{" "}
            <span className="text-gray-300">{game.date}</span>
          </div>
        )}
        <div className="text-xs text-gray-500">
          Saved: {new Date(game.createdAt).toLocaleDateString()}
        </div>

        <div className="flex gap-2 pt-2">
          <Button
            onClick={() => onView(game.id)}
            className="flex-1 bg-chess text-ink font-bold hover:bg-cream gap-2"
          >
            <Eye className="w-4 h-4" />
            View Game
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="bg-minimal border-white/5 hover:bg-red-500/10"
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-minimal border border-white/5">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-cream">
                  Delete Game?
                </AlertDialogTitle>
                <AlertDialogDescription className="text-gray-400">
                  This will permanently delete this game. This action cannot be
                  undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-chess border-white/5 text-cream hover:bg-[#222222]">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => onDelete(game.id)}
                  className="bg-red-500 hover:bg-red-600 text-white"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
}
