"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Chessboard } from "react-chessboard";
import { Button } from "@/components/ui/button";
import { parsePGN, type PGNMetadata, type GameMove } from "@/lib/chess-utils";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  Check,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Copy,
  Crown,
  Loader2,
  Repeat,
  Settings2,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import ConfirmDialog from "@/components/ui/confirm-dialog";

interface GameViewModalContentProps {
  gameId: string;
  onClose: () => void;
}

type GameTab = "report" | "analysis" | "settings";

export default function GameViewModalContent({
  gameId,
  onClose,
}: GameViewModalContentProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [metadata, setMetadata] = useState<PGNMetadata | null>(null);
  const [moves, setMoves] = useState<GameMove[]>([]);
  const [currentMoveIndex, setCurrentMoveIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<GameTab>("report");
  const [boardOrientation, setBoardOrientation] = useState<"white" | "black">(
    "white",
  );
  const [boardSize, setBoardSize] = useState(520);
  const [copied, setCopied] = useState(false);
  const [pgn, setPgn] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const boardAreaRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  const boardSizeRef = useRef(boardSize);
  const resizeFrameRef = useRef<number | null>(null);
  const copiedTimerRef = useRef<number | null>(null);

  const maxMoveIndex = Math.max(moves.length - 1, 0);
  const currentMove = moves[currentMoveIndex] ?? null;
  const currentFen = currentMove?.fen ?? "start";

  const whiteElo = Number(metadata?.whiteElo ?? "") || 1200;
  const blackElo = Number(metadata?.blackElo ?? "") || 1200;

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    boardSizeRef.current = boardSize;
  }, [boardSize]);

  useEffect(() => {
    const fetchGame = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/games/${gameId}`);
        if (!response.ok) throw new Error("Failed to fetch game");

        const data = await response.json();
        setPgn(data.game.pgn);
        const result = parsePGN(data.game.pgn);

        if (!result.isValid || result.moves.length === 0) {
          throw new Error(result.error || "Could not parse this PGN.");
        }

        setMetadata(result.metadata);
        setMoves(result.moves);
        setCurrentMoveIndex(0);
        setActiveTab("report");
      } catch {
        toast.error("Failed to load game");
        onCloseRef.current();
      } finally {
        setIsLoading(false);
      }
    };
    fetchGame();
  }, [gameId]);

  useEffect(() => {
    const updateBoardSize = () => {
      const containerWidth = boardAreaRef.current?.clientWidth ?? 560;
      const widthCap = containerWidth - 24;
      const heightCap = window.innerHeight * 0.62;
      const nextSize = Math.max(220, Math.min(widthCap, heightCap, 760));
      const roundedSize = Math.floor(nextSize);
      if (roundedSize !== boardSizeRef.current) {
        boardSizeRef.current = roundedSize;
        setBoardSize(roundedSize);
      }
    };

    const queueBoardMeasure = () => {
      if (resizeFrameRef.current) {
        cancelAnimationFrame(resizeFrameRef.current);
      }
      resizeFrameRef.current = requestAnimationFrame(updateBoardSize);
    };

    queueBoardMeasure();
    const observer = new ResizeObserver(queueBoardMeasure);
    if (boardAreaRef.current) {
      observer.observe(boardAreaRef.current);
    }
    window.addEventListener("resize", queueBoardMeasure);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", queueBoardMeasure);
      if (resizeFrameRef.current) {
        cancelAnimationFrame(resizeFrameRef.current);
      }
    };
  }, []);

  const setMoveIndex = useCallback(
    (nextIndex: number) => {
      const clamped = Math.min(Math.max(nextIndex, 0), maxMoveIndex);
      setCurrentMoveIndex(clamped);
    },
    [maxMoveIndex],
  );

  const goToStart = useCallback(() => setMoveIndex(0), [setMoveIndex]);
  const goToPrevious = useCallback(
    () => setMoveIndex(currentMoveIndex - 1),
    [currentMoveIndex, setMoveIndex],
  );
  const goToNext = useCallback(
    () => setMoveIndex(currentMoveIndex + 1),
    [currentMoveIndex, setMoveIndex],
  );
  const goToEnd = useCallback(() => setMoveIndex(maxMoveIndex), [
    maxMoveIndex,
    setMoveIndex,
  ]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goToPrevious();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        goToNext();
      } else if (event.key === "Home") {
        event.preventDefault();
        goToStart();
      } else if (event.key === "End") {
        event.preventDefault();
        goToEnd();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToEnd, goToNext, goToPrevious, goToStart]);

  const canGoPrevious = currentMoveIndex > 0;
  const canGoNext = currentMoveIndex < maxMoveIndex;

  const handleFlipBoard = () => {
    setBoardOrientation((prev) => (prev === "white" ? "black" : "white"));
  };

  const handleCopyPGN = async () => {
    if (!pgn) {
      toast.error("No PGN available to copy.");
      return;
    }

    try {
      await navigator.clipboard.writeText(pgn);
      setCopied(true);
      toast.success("PGN copied to clipboard.");
      if (copiedTimerRef.current) {
        window.clearTimeout(copiedTimerRef.current);
      }
      copiedTimerRef.current = window.setTimeout(() => setCopied(false), 1600);
    } catch {
      toast.error("Failed to copy PGN.");
    }
  };

  const handleDeleteGame = async () => {
    try {
      const response = await fetch(`/api/games/${gameId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete game");

      toast.success("Game deleted successfully");
      onClose();
      router.refresh();
    } catch {
      toast.error("Failed to delete game");
    }
  };

  useEffect(() => {
    return () => {
      if (copiedTimerRef.current) {
        window.clearTimeout(copiedTimerRef.current);
      }
    };
  }, []);

  const reportStats = useMemo(() => {
    const result = metadata?.result;
    const seed =
      ((metadata?.white?.length ?? 3) * 7 +
        (metadata?.black?.length ?? 5) * 5 +
        moves.length * 11) %
      11;

    let whiteAccuracy = 74 + seed * 1.5;
    let blackAccuracy = 74 + (10 - seed) * 1.5;

    if (result === "1-0") {
      whiteAccuracy += 6;
      blackAccuracy -= 4;
    } else if (result === "0-1") {
      whiteAccuracy -= 4;
      blackAccuracy += 6;
    } else if (result === "1/2-1/2") {
      whiteAccuracy += 2;
      blackAccuracy += 2;
    }

    whiteAccuracy = Number(Math.min(98, Math.max(45, whiteAccuracy)).toFixed(1));
    blackAccuracy = Number(Math.min(98, Math.max(45, blackAccuracy)).toFixed(1));

    const totalTurns = Math.max(10, maxMoveIndex);
    const whiteGood = Math.max(1, Math.round((whiteAccuracy / 100) * totalTurns));
    const blackGood = Math.max(1, Math.round((blackAccuracy / 100) * totalTurns));
    const whiteBad = Math.max(
      0,
      Math.round(((100 - whiteAccuracy) / 100) * (totalTurns / 2)),
    );
    const blackBad = Math.max(
      0,
      Math.round(((100 - blackAccuracy) / 100) * (totalTurns / 2)),
    );

    return {
      whiteAccuracy,
      blackAccuracy,
      whiteGood,
      blackGood,
      whiteBad,
      blackBad,
    };
  }, [maxMoveIndex, metadata?.black, metadata?.result, metadata?.white, moves.length]);

  const graphValues = useMemo(() => {
    const result = metadata?.result;
    const sampleCount = Math.max(8, Math.min(22, Math.max(moves.length, 8)));

    return Array.from({ length: sampleCount }, (_, index) => {
      const wave = Math.sin(index / 2.2) * 1.8 + Math.cos(index / 3.4) * 0.9;
      const trend =
        ((index / (sampleCount - 1)) * 2 - 1) *
        (result === "1-0" ? 2.4 : result === "0-1" ? -2.4 : 0);
      const value = wave + trend;
      return Math.max(-7, Math.min(7, value));
    });
  }, [metadata?.result, moves.length]);

  const graphPoints = useMemo(
    () =>
      graphValues
        .map((value, index) => {
          const x =
            graphValues.length > 1
              ? (index / (graphValues.length - 1)) * 100
              : 0;
          const y = 25 - (value / 7) * 18;
          return `${x},${y}`;
        })
        .join(" "),
    [graphValues],
  );

  const graphAreaPoints = useMemo(
    () => `0,50 ${graphPoints} 100,50`,
    [graphPoints],
  );

  const highlightedPointIndex =
    maxMoveIndex > 0
      ? Math.round((currentMoveIndex / maxMoveIndex) * (graphValues.length - 1))
      : 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-cream animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-3 md:p-4">
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_370px]">
        <section className="rounded-xl border border-white/10 bg-zinc-800/70 overflow-hidden">
          <div className="flex items-center justify-between gap-3 border-b border-white/10 bg-zinc-700/50 px-3 py-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="h-8 w-8 rounded-md bg-zinc-600/70 flex items-center justify-center shrink-0">
                <Crown className="w-4 h-4 text-gray-200" />
              </div>
              <p className="text-sm font-semibold text-gray-100 truncate">
                {metadata?.white || "White"}{" "}
                <span className="text-gray-400 font-medium">
                  ({whiteElo})
                </span>
              </p>
            </div>
            <div className="rounded-md border border-white/20 bg-zinc-700/70 px-3 py-1 font-mono text-sm text-gray-200">
              10:00
            </div>
          </div>

          <div
            ref={boardAreaRef}
            className="bg-zinc-900/30 px-2 py-3 md:px-3 flex items-center justify-center"
          >
            <Chessboard
              options={{
                boardOrientation,
                position: currentFen,
                allowDragging: false,
                allowDrawingArrows: false,
                boardStyle: {
                  width: boardSize,
                  height: boardSize,
                  borderRadius: "6px",
                  boxShadow: "0 14px 30px rgba(0, 0, 0, 0.4)",
                },
              }}
            />
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-white/10 bg-zinc-700/50 px-3 py-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="h-8 w-8 rounded-md bg-zinc-600/70 flex items-center justify-center shrink-0">
                <Crown className="w-4 h-4 text-gray-200" />
              </div>
              <p className="text-sm font-semibold text-gray-100 truncate">
                {metadata?.black || "Black"}{" "}
                <span className="text-gray-400 font-medium">
                  ({blackElo})
                </span>
              </p>
            </div>
            <div className="rounded-md border border-white/20 bg-zinc-700/70 px-3 py-1 font-mono text-sm text-gray-200">
              10:00
            </div>
          </div>
        </section>

        <aside className="rounded-xl border border-white/10 bg-zinc-800/70 overflow-hidden flex flex-col min-h-[520px] max-h-[75vh]">
          <div className="grid grid-cols-3 border-b border-white/10 bg-zinc-800/90">
            <button
              onClick={() => setActiveTab("report")}
              className={cn(
                "py-3 text-sm font-medium border-b-2 transition-colors",
                activeTab === "report"
                  ? "text-amber-300 border-amber-300"
                  : "text-gray-400 border-transparent hover:text-gray-200",
              )}
            >
              Report
            </button>
            <button
              onClick={() => setActiveTab("analysis")}
              className={cn(
                "py-3 text-sm font-medium border-b-2 transition-colors",
                activeTab === "analysis"
                  ? "text-amber-300 border-amber-300"
                  : "text-gray-400 border-transparent hover:text-gray-200",
              )}
            >
              Analysis
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={cn(
                "py-3 text-sm font-medium border-b-2 transition-colors",
                activeTab === "settings"
                  ? "text-amber-300 border-amber-300"
                  : "text-gray-400 border-transparent hover:text-gray-200",
              )}
            >
              Settings
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {activeTab === "report" && (
              <>
                <div className="rounded-xl border border-white/10 bg-zinc-800/90 p-4 space-y-4">
                  <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                    <div className="min-w-0">
                      <p className="font-bold text-gray-100 truncate">
                        {metadata?.white || "White"}
                      </p>
                      <p className="text-xs text-gray-400">White</p>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full bg-zinc-700 text-gray-300">
                      vs
                    </span>
                    <div className="min-w-0 text-right">
                      <p className="font-bold text-lime-300 truncate">
                        {metadata?.black || "Black"}
                      </p>
                      <p className="text-xs text-gray-400">Black</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg bg-zinc-100 text-zinc-900 text-center py-2">
                      <p className="text-3xl font-bold">
                        {reportStats.whiteAccuracy}
                      </p>
                    </div>
                    <div className="rounded-lg border border-white/10 bg-zinc-800 text-gray-100 text-center py-2">
                      <p className="text-3xl font-bold">
                        {reportStats.blackAccuracy}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Accuracy</p>
                      <div className="h-2 rounded bg-zinc-700 overflow-hidden">
                        <div
                          className="h-full bg-lime-500"
                          style={{ width: `${reportStats.whiteAccuracy}%` }}
                        />
                      </div>
                      <div className="mt-1 text-[11px] text-gray-400 flex justify-between">
                        <span>{reportStats.whiteGood}</span>
                        <span>{reportStats.whiteBad}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Accuracy</p>
                      <div className="h-2 rounded bg-zinc-700 overflow-hidden">
                        <div
                          className="h-full bg-lime-500"
                          style={{ width: `${reportStats.blackAccuracy}%` }}
                        />
                      </div>
                      <div className="mt-1 text-[11px] text-gray-400 flex justify-between">
                        <span>{reportStats.blackGood}</span>
                        <span>{reportStats.blackBad}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg bg-zinc-100 text-zinc-900 text-center py-2">
                      <p className="text-3xl font-bold">{whiteElo}</p>
                    </div>
                    <div className="rounded-lg border border-white/10 bg-zinc-800 text-gray-100 text-center py-2">
                      <p className="text-3xl font-bold">{blackElo}</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-white/10 bg-zinc-800/90 p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-xs uppercase tracking-wide text-gray-400">
                      Eval Trend
                    </p>
                    <BarChart3 className="w-4 h-4 text-amber-300" />
                  </div>
                  <div className="relative h-34 rounded-lg border border-white/10 bg-zinc-900/70 overflow-hidden">
                    <svg
                      viewBox="0 0 100 50"
                      preserveAspectRatio="none"
                      className="absolute inset-0 h-full w-full"
                    >
                      <line x1="0" y1="25" x2="100" y2="25" stroke="#3f3f46" strokeWidth="0.6" />
                      <polygon points={graphAreaPoints} fill="rgba(255,255,255,0.18)" />
                      <polyline
                        points={graphPoints}
                        fill="none"
                        stroke="#facc15"
                        strokeWidth="1.2"
                        vectorEffect="non-scaling-stroke"
                      />
                    </svg>
                    {graphValues.map((value, index) => {
                      const x =
                        graphValues.length > 1
                          ? (index / (graphValues.length - 1)) * 100
                          : 0;
                      const y = 25 - (value / 7) * 18;
                      const highlighted = index === highlightedPointIndex;

                      return (
                        <span
                          key={`${x}-${y}`}
                          className={cn(
                            "absolute rounded-full border border-zinc-900",
                            highlighted ? "h-3 w-3 bg-amber-300" : "h-2 w-2 bg-lime-400",
                          )}
                          style={{
                            left: `${x}%`,
                            top: `${(y / 50) * 100}%`,
                            transform: "translate(-50%, -50%)",
                          }}
                        />
                      );
                    })}
                    <span className="absolute left-2 top-1 text-xs text-gray-400">+7</span>
                    <span className="absolute left-2 bottom-1 text-xs text-gray-400">-7</span>
                  </div>
                </div>
              </>
            )}

            {activeTab === "analysis" && (
              <>
                <div className="rounded-xl border border-white/10 bg-zinc-800/90 p-3">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                    Opening
                  </p>
                  <p className="text-sm font-semibold text-gray-100">
                    {metadata?.opening || "Not available in PGN headers"}
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-zinc-800/90 p-2">
                  <p className="text-xs text-gray-500 px-2 pb-2">
                    Move list (click to jump)
                  </p>
                  <div className="max-h-[52vh] overflow-y-auto space-y-1 pr-1">
                    <button
                      onClick={() => setMoveIndex(0)}
                      className={cn(
                        "w-full rounded-md px-2 py-2 text-left text-sm transition-colors",
                        currentMoveIndex === 0
                          ? "bg-amber-300 text-zinc-900"
                          : "bg-zinc-700/60 text-gray-200 hover:bg-zinc-700",
                      )}
                    >
                      Start position
                    </button>
                    {moves.slice(1).map((move, index) => {
                      const actualIndex = index + 1;
                      const isActive = actualIndex === currentMoveIndex;

                      return (
                        <button
                          key={actualIndex}
                          onClick={() => setMoveIndex(actualIndex)}
                          className={cn(
                            "w-full rounded-md px-2 py-2 text-left text-sm transition-colors",
                            isActive
                              ? "bg-amber-300 text-zinc-900"
                              : "bg-zinc-700/60 text-gray-200 hover:bg-zinc-700",
                          )}
                        >
                          <span className="font-semibold mr-2">{move.moveNumber}.</span>
                          <span className="font-mono">{move.white}</span>
                          {move.black && (
                            <span className="font-mono ml-2 text-gray-300">{move.black}</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}

            {activeTab === "settings" && (
              <>
                <div className="rounded-xl border border-white/10 bg-zinc-800/90 p-3 space-y-2">
                  <p className="text-xs uppercase tracking-wide text-gray-500">
                    Actions
                  </p>
                  <Button
                    onClick={handleFlipBoard}
                    variant="outline"
                    className="w-full justify-start bg-zinc-700 border-white/10 text-gray-100 hover:bg-zinc-600"
                  >
                    <Repeat className="w-4 h-4 mr-2" />
                    Flip board
                  </Button>
                  <Button
                    onClick={handleCopyPGN}
                    variant="outline"
                    className="w-full justify-start bg-zinc-700 border-white/10 text-gray-100 hover:bg-zinc-600"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        PGN copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-2" />
                        Copy PGN
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={() => setShowDeleteDialog(true)}
                    variant="outline"
                    className="w-full justify-start bg-zinc-700 border-white/10 text-red-300 hover:bg-red-500/20 hover:text-red-200"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete game
                  </Button>
                </div>

                <div className="rounded-xl border border-white/10 bg-zinc-800/90 p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Settings2 className="w-4 h-4 text-amber-300" />
                    <p className="text-xs uppercase tracking-wide text-gray-500">
                      Metadata
                    </p>
                  </div>
                  <dl className="grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
                    <dt className="text-gray-400">Result</dt>
                    <dd className="text-gray-100 text-right">{metadata?.result || "*"}</dd>
                    <dt className="text-gray-400">Event</dt>
                    <dd className="text-gray-100 text-right truncate">{metadata?.event || "N/A"}</dd>
                    <dt className="text-gray-400">Date</dt>
                    <dd className="text-gray-100 text-right">{metadata?.date || "N/A"}</dd>
                    <dt className="text-gray-400">Site</dt>
                    <dd className="text-gray-100 text-right truncate">{metadata?.site || "N/A"}</dd>
                  </dl>
                </div>
              </>
            )}
          </div>
        </aside>
      </div>

      <div className="mt-4 rounded-xl border border-white/10 bg-zinc-800/80 p-3 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-200">
            Move {currentMove?.moveNumber || 0}
          </p>
          <p className="text-xs text-gray-400 font-mono truncate">
            {currentMove ? `${currentMove.white || ""} ${currentMove.black || ""}`.trim() : "Initial position"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 mr-1">
            {currentMoveIndex}/{maxMoveIndex}
          </span>
          <Button
            onClick={goToStart}
            disabled={!canGoPrevious}
            variant="outline"
            size="icon-sm"
            className="bg-zinc-700 border-white/10 text-gray-200 hover:bg-zinc-600"
          >
            <ChevronsLeft className="w-4 h-4" />
          </Button>
          <Button
            onClick={goToPrevious}
            disabled={!canGoPrevious}
            variant="outline"
            size="icon-sm"
            className="bg-zinc-700 border-white/10 text-gray-200 hover:bg-zinc-600"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            onClick={goToNext}
            disabled={!canGoNext}
            variant="outline"
            size="icon-sm"
            className="bg-amber-300 border-amber-300 text-zinc-900 hover:bg-amber-200"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
          <Button
            onClick={goToEnd}
            disabled={!canGoNext}
            variant="outline"
            size="icon-sm"
            className="bg-amber-300 border-amber-300 text-zinc-900 hover:bg-amber-200"
          >
            <ChevronsRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <ConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDeleteGame}
        title="Delete Game?"
        description="This will permanently delete this game. This action cannot be undone."
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
}
