"use client";

import { useState } from "react";
import PGNUpload from "@/components/chess/pgn-upload";
import ChessBoardViewer from "@/components/chess/chessboard-viewer";
import MoveList from "@/components/chess/move-list";
import { Button } from "@/components/ui/button";
import { parsePGN, type PGNMetadata, type GameMove } from "@/lib/chess-utils";
import { ArrowLeft } from "lucide-react";

export default function AnalyzePage() {
  const [pgn, setPgn] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<PGNMetadata | null>(null);
  const [moves, setMoves] = useState<GameMove[]>([]);
  const [currentMoveIndex, setCurrentMoveIndex] = useState(0);

  const handlePGNLoaded = (pgnText: string) => {
    const result = parsePGN(pgnText);
    if (result.isValid) {
      setPgn(pgnText);
      setMetadata(result.metadata);
      setMoves(result.moves);
      setCurrentMoveIndex(0);
    }
  };

  const handleReset = () => {
    setPgn(null);
    setMetadata(null);
    setMoves([]);
    setCurrentMoveIndex(0);
  };

  if (!pgn) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-cream">Analyze Game</h1>
          <p className="text-gray-400 mt-2">
            Upload a PGN file or paste PGN text to analyze your game
          </p>
        </div>

        <PGNUpload onPGNLoaded={handlePGNLoaded} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Reset */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-cream">Game Analysis</h1>
          <p className="text-gray-600 mt-2">
            {metadata?.white} vs {metadata?.black}
          </p>
        </div>
        <Button
          variant="outline"
          onClick={handleReset}
          className="bg-chess border border-white/5 hover:bg-cream"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="font-bold">Upload New Game</span>
        </Button>
      </div>

      {/* Chess Board and Move List */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ChessBoardViewer
            moves={moves}
            position={currentMoveIndex}
            onPositionChange={setCurrentMoveIndex}
          />
        </div>
        <div className="mt-5">
          <MoveList
            moves={moves}
            currentMoveIndex={currentMoveIndex}
            onMoveClick={setCurrentMoveIndex}
          />
        </div>
      </div>
    </div>
  );
}
