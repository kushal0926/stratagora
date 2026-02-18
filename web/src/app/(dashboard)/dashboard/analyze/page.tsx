"use client";

import { useState } from "react";
import PGNUpload from "@/components/chess/pgn-upload";
import ChesscomImport from "@/components/chess/chesscom-import";
import ChessBoardViewer from "@/components/chess/chessboard-viewer";
import MoveList from "@/components/chess/move-list";
import OpeningDisplay from "@/components/chess/opening-display";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { parsePGN, type PGNMetadata, type GameMove } from "@/lib/chess-utils";
import { ArrowLeft, Save, Loader2, Upload, Globe } from "lucide-react";
import { toast } from "sonner";

export default function AnalyzePage() {
  const [pgn, setPgn] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<PGNMetadata | null>(null);
  const [moves, setMoves] = useState<GameMove[]>([]);
  const [currentMoveIndex, setCurrentMoveIndex] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handlePGNLoaded = (pgnText: string) => {
    const result = parsePGN(pgnText);
    if (result.isValid) {
      setPgn(pgnText);
      setMetadata(result.metadata);
      setMoves(result.moves);
      setCurrentMoveIndex(0);
      setIsSaved(false);
    } else {
      toast.error('Invalid PGN format');
    }
  };

  const handleSaveGame = async () => {
    if (!pgn) return;

    setIsSaving(true);
    try {
      const response = await fetch("/api/games", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pgn }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to save game");
      }

      const data = await response.json();
      setIsSaved(true);
      toast.success("Game saved successfully!", {
        description: `${data.game.white} vs ${data.game.black}`,
      });
    } catch (error) {
      toast.error("Failed to save game", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setPgn(null);
    setMetadata(null);
    setMoves([]);
    setCurrentMoveIndex(0);
    setIsSaved(false);
  };

  // Show analysis view when PGN is loaded
  if (pgn) {
    return (
      <div className="space-y-6">
        {/* Header with Actions */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-cream">Game Analysis</h1>
            <p className="text-gray-400 mt-2">
              {metadata?.white} vs {metadata?.black}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleSaveGame}
              disabled={isSaving || isSaved}
              className="bg-chess border-white/5 hover:bg-cream gap-2"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="font-bold">Saving...</span>
                </>
              ) : isSaved ? (
                <>
                  <Save className="h-4 w-4" />
                  <span className="font-bold">Saved ✓</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span className="font-bold">Save Game</span>
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={handleReset}
              className="bg-chess border border-white/5 hover:bg-cream"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="font-bold">New Game</span>
            </Button>
          </div>
        </div>

        {/* Opening Display */}
        {metadata?.opening && (
          <OpeningDisplay opening={metadata.opening} />
        )}

        {/* Chess Board and Move List */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ChessBoardViewer
              moves={moves}
              position={currentMoveIndex}
              onPositionChange={setCurrentMoveIndex}
              pgn={pgn}
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

  // Show import options
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-cream">Analyze Game</h1>
        <p className="text-gray-400 mt-2">
          Upload a PGN file or import from Chess.com
        </p>
      </div>

      <Tabs defaultValue="pgn">
        <TabsList className="bg-chess border border-white/5">
          <TabsTrigger 
            value="pgn" 
            className="data-[state=active]:bg-cream data-[state=active]:text-ink"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload PGN
          </TabsTrigger>
          <TabsTrigger 
            value="chesscom"
            className="data-[state=active]:bg-cream data-[state=active]:text-ink"
          >
            <Globe className="w-4 h-4 mr-2" />
            Chess.com
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pgn" className="mt-6">
          <PGNUpload onPGNLoaded={handlePGNLoaded} />
        </TabsContent>

        <TabsContent value="chesscom" className="mt-6">
          <ChesscomImport onGameSelected={handlePGNLoaded} />
        </TabsContent>
      </Tabs>
    </div>
  );
}