"use client";

import { useCallback, useEffect, useState } from "react";
import { Chessboard } from "react-chessboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  SkipBack,
  SkipForward,
  Repeat,
  Copy,
  Check,
} from "lucide-react";
import type { GameMove } from "@/lib/chess-utils";
import { toast } from "sonner";

interface ChessBoardViewerProps {
  moves: GameMove[];
  position?: number;
  onPositionChange?: (position: number) => void;
  pgn?: string;
}

export default function ChessBoardViewer({
  moves,
  position,
  onPositionChange,
  pgn,
}: ChessBoardViewerProps) {
  const [internalMoveIndex, setInternalMoveIndex] = useState(position ?? 0);
  const [boardOrientation, setBoardOrientation] = useState<"white" | "black">(
    "white",
  );
  const [copied, setCopied] = useState(false);
  const maxMoveIndex = Math.max(moves.length - 1, 0);
  const currentMoveIndex = Math.min(
    Math.max(position ?? internalMoveIndex, 0),
    maxMoveIndex,
  );

  const currentMove = moves[currentMoveIndex] || null;
  const currentFen = currentMove?.fen || "start";

  const setMoveIndex = useCallback(
    (nextIndex: number) => {
      const clampedIndex = Math.min(Math.max(nextIndex, 0), maxMoveIndex);
      setInternalMoveIndex(clampedIndex);
      onPositionChange?.(clampedIndex);
    },
    [maxMoveIndex, onPositionChange],
  );

  const goToStart = useCallback(() => {
    setMoveIndex(0);
  }, [setMoveIndex]);

  const goToPrevious = useCallback(() => {
    setMoveIndex(currentMoveIndex - 1);
  }, [currentMoveIndex, setMoveIndex]);

  const goToNext = useCallback(() => {
    setMoveIndex(currentMoveIndex + 1);
  }, [currentMoveIndex, setMoveIndex]);

  const goToEnd = useCallback(() => {
    setMoveIndex(maxMoveIndex);
  }, [maxMoveIndex, setMoveIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goToPrevious();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        goToNext();
      } else if (e.key === "Home") {
        e.preventDefault();
        goToStart();
      } else if (e.key === "End") {
        e.preventDefault();
        goToEnd();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToEnd, goToNext, goToPrevious, goToStart]);

  const flipBoard = () => {
    setBoardOrientation((prev) => (prev === "white" ? "black" : "white"));
  };

  const copyPGN = async () => {
    if (!pgn) {
      toast.error("No PGN available to copy");
      return;
    }

    try {
      await navigator.clipboard.writeText(pgn);
      setCopied(true);
      toast.success("PGN copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy PGN");
    }
  };

  const canGoPrevious = currentMoveIndex > 0;
  const canGoNext = currentMoveIndex < maxMoveIndex;

  return (
    <div className="space-y-4">
      {/* Chess Board */}
      <Card className="bg-minimal border border-white/5">
        <CardContent className="p-4">
          <div className="max-w-2xl mx-auto">
            <Chessboard
              options={{
                boardOrientation,
                position: currentFen,
                allowDrawingArrows: false,
                allowDragging: false,
                boardStyle: {
                  width:
                    typeof window !== "undefined" && window.innerWidth < 640
                      ? 320
                      : 500,
                  height:
                    typeof window !== "undefined" && window.innerWidth < 640
                      ? 320
                      : 500,
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                },
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Controls */}
      <Card className="bg-minimal border border-white/5">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-cream flex items-center justify-between">
            <span>
              Move {currentMove?.moveNumber || 0}
              {currentMove && currentMove.moveNumber > 0 && (
                <span className="ml-2 text-gray-400 font-normal">
                  {currentMove.white}
                  {currentMove.black && ` ${currentMove.black}`}
                </span>
              )}
            </span>
            <div className="flex gap-2">
              {pgn && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyPGN}
                  className="bg-chess border-white/5 hover:bg-cream text-xs"
                >
                  {copied ? (
                    <>
                      <Check className="h-3 w-3 mr-1" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3 mr-1" />
                      Copy PGN
                    </>
                  )}
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={flipBoard}
                className="bg-chess border-white/5 hover:bg-cream"
              >
                <Repeat className="h-4 w-4" />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={goToStart}
              disabled={!canGoPrevious}
              className="bg-chess border-white/5 hover:bg-cream"
            >
              <SkipBack className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={goToPrevious}
              disabled={!canGoPrevious}
              className="bg-chess border-white/5 hover:bg-cream"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="px-4 py-2 bg-chess rounded-md min-w-25 text-center border border-white/5">
              <span className="text-sm font-medium text-cream">
                {currentMoveIndex} / {maxMoveIndex}
              </span>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={goToNext}
              disabled={!canGoNext}
              className="bg-chess border-white/5 hover:bg-cream"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={goToEnd}
              disabled={!canGoNext}
              className="bg-chess border-white/5 hover:bg-cream"
            >
              <SkipForward className="h-4 w-4" />
            </Button>
          </div>
          <div className="text-center mt-3 text-xs text-gray-500">
            Use ← → arrow keys to navigate
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
