"use client";

import { useState } from "react";
import { Chessboard } from "react-chessboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, SkipBack, SkipForward } from "lucide-react";
import type { GameMove } from "@/lib/chess-utils";


interface ChessBoardViewerProps {
  moves: GameMove[];
  position?: number;
  onPositionChange?: (index: number) => void;
  initialPosition?: number;
}

export default function ChessBoardViewer({
  moves,
  position,
  onPositionChange,
  initialPosition = 0,
}: ChessBoardViewerProps) {
  const maxMoveIndex = Math.max(0, moves.length - 1);
  const clampMoveIndex = (index: number) =>
    Math.min(Math.max(index, 0), maxMoveIndex);

  const [internalMoveIndex, setInternalMoveIndex] = useState(
    clampMoveIndex(initialPosition),
  );

  const currentMoveIndex = clampMoveIndex(
    typeof position === "number" ? position : internalMoveIndex,
  );
  const setCurrentMoveIndex = (
    nextIndex: number | ((prev: number) => number),
  ) => {
    const resolvedIndex =
      typeof nextIndex === "function" ? nextIndex(currentMoveIndex) : nextIndex;
    const clampedIndex = clampMoveIndex(resolvedIndex);

    if (onPositionChange) {
      onPositionChange(clampedIndex);
      return;
    }

    setInternalMoveIndex(clampedIndex);
  };

  const currentMove = moves[currentMoveIndex] || null;
  const currentFen = currentMove?.fen ?? undefined;

  const goToStart = () => setCurrentMoveIndex(0);
  const goToPrevious = () => setCurrentMoveIndex((prev) => Math.max(0, prev - 1));
  const goToNext = () =>
    setCurrentMoveIndex((prev) => Math.min(maxMoveIndex, prev + 1));
  const goToEnd = () => setCurrentMoveIndex(maxMoveIndex);

  const canGoPrevious = currentMoveIndex > 0;
  const canGoNext = currentMoveIndex < maxMoveIndex;

  return (
    <div className="space-y-4">
      {/* Chess Board */}
      <Card className="bg-kala ">
        <CardContent>
          <div className="max-w-2xl mx-auto px-20">
            <Chessboard
              options={{
                position: currentFen,
                boardOrientation: "white",
                allowDragging: false,
                allowDrawingArrows: false,
                animationDurationInMs: 200,
                boardStyle: {
                  width: "100%",
                  maxWidth: "500px",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                },
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Navigation Controls */}
      <Card className="bg-minimal border border-white/5">
        <CardHeader>
          <CardTitle className="text-sm font-bold text-cream">
            Move {currentMove?.moveNumber ?? 0}
            {currentMove && currentMove.moveNumber > 0 && (
              <span className="ml-2 text-gray-400">
                {currentMove.white}
                {currentMove.black && ` ${currentMove.black}`}
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={goToStart}
              disabled={!canGoPrevious}
            >
              <SkipBack className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={goToPrevious}
              disabled={!canGoPrevious}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="px-4 py-2 bg-gray-100 rounded-md min-w-25 text-center">
              <span className="text-sm font-medium">
                {currentMoveIndex} / {maxMoveIndex}
              </span>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={goToNext}
              disabled={!canGoNext}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={goToEnd}
              disabled={!canGoNext}
            >
              <SkipForward className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
