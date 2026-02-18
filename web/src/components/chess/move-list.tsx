"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { GameMove } from "@/lib/chess-utils";
import { useEffect, useRef } from "react";

interface MoveListProps {
  moves: GameMove[];
  currentMoveIndex: number;
  onMoveClick?: (index: number) => void;
}

export default function MoveList({
  moves,
  currentMoveIndex,
  onMoveClick,
}: MoveListProps) {
  const activeRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to active move
  useEffect(() => {
    if (activeRef.current) {
      activeRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [currentMoveIndex]);

  return (
    <Card className="bg-minimal border border-white/5">
      <CardHeader>
        <CardTitle className="text-cream">Move List</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-100 pr-4">
          <div className="space-y-1">
            {/* Starting position */}
            <div
              ref={currentMoveIndex === 0 ? activeRef : null}
              onClick={() => onMoveClick?.(0)}
              className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-colors ${
                currentMoveIndex === 0
                  ? "bg-cream text-ink"
                  : "hover:bg-chess text-gray-400"
              }`}
            >
              <span className="font-semibold min-w-12.5">Start</span>
              <span className="text-sm">Initial position</span>
            </div>

            {/* Moves */}
            {moves.slice(1).map((move, index) => {
              const actualIndex = index + 1;
              const isActive = actualIndex === currentMoveIndex;

              return (
                <div
                  key={actualIndex}
                  ref={isActive ? activeRef : null}
                  onClick={() => onMoveClick?.(actualIndex)}
                  className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-colors ${
                    isActive
                      ? "bg-cream text-ink font-bold border border-cream"
                      : "hover:bg-chess text-gray-300"
                  }`}
                >
                  <span className="font-semibold min-w-12.5">
                    {move.moveNumber}.
                  </span>
                  <div className="flex gap-3 font-mono text-sm">
                    <span className={isActive ? "text-ink" : "text-cream"}>
                      {move.white}
                    </span>
                    {move.black && (
                      <span className={isActive ? "text-ink" : "text-gray-400"}>
                        {move.black}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
