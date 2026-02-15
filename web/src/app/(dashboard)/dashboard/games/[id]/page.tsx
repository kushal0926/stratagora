'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ChessBoardViewer from '@/components/chess/chessboard-viewer';
import MoveList from '@/components/chess/move-list';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { parsePGN, type PGNMetadata, type GameMove } from '@/lib/chess-utils';
import { ArrowLeft, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
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

export default function GameDetailPage() {
  const params = useParams();
  const router = useRouter();
  const gameId = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [metadata, setMetadata] = useState<PGNMetadata | null>(null);
  const [moves, setMoves] = useState<GameMove[]>([]);
  const [currentMoveIndex, setCurrentMoveIndex] = useState(0);

  useEffect(() => {
    // Move fetchGame inside useEffect
    const fetchGame = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/games/${gameId}`);
        if (!response.ok) throw new Error('Failed to fetch game');

        const data = await response.json();
        const result = parsePGN(data.game.pgn);
        
        if (result.isValid) {
          setMetadata(result.metadata);
          setMoves(result.moves);
        }
      } catch (error) {
        console.error('Error fetching game:', error);
        toast.error('Failed to load game');
        router.push('/dashboard/games');
      } finally {
        setIsLoading(false);
      }
    };

    fetchGame();
  }, [gameId, router]); // Add dependencies

  const handleDeleteGame = async () => {
    try {
      const response = await fetch(`/api/games/${gameId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete game');

      toast.success('Game deleted successfully');
      router.push('/dashboard/games');
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-cream">Game Details</h1>
          <p className="text-gray-400 mt-2">
            {metadata?.white} vs {metadata?.black}
          </p>
        </div>
        <div className="flex gap-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="bg-minimal border-white/5 hover:bg-red-500/10 gap-2">
                <Trash2 className="w-4 h-4 text-red-500" />
                <span className="font-bold text-red-500">Delete</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-minimal border border-white/5">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-cream">Delete Game?</AlertDialogTitle>
                <AlertDialogDescription className="text-gray-400">
                  This will permanently delete this game. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-chess border-white/5 text-cream hover:bg-[#222222]">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteGame}
                  className="bg-red-500 hover:bg-red-600 text-white"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          
          <Link href="/dashboard/games">
            <Button className="bg-chess border-white/5 hover:bg-cream gap-2">
              <ArrowLeft className="w-4 h-4" />
              <span className="font-bold">Back to Games</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Game Info */}
      <Card className="bg-minimal border border-white/5">
        <CardHeader>
          <CardTitle className="text-cream">Game Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-500">White</p>
              <p className="font-medium text-cream">{metadata?.white}</p>
              {metadata?.whiteElo && (
                <p className="text-xs text-gray-500">ELO: {metadata.whiteElo}</p>
              )}
            </div>
            <div>
              <p className="text-sm text-gray-500">Black</p>
              <p className="font-medium text-cream">{metadata?.black}</p>
              {metadata?.blackElo && (
                <p className="text-xs text-gray-500">ELO: {metadata.blackElo}</p>
              )}
            </div>
            <div>
              <p className="text-sm text-gray-500">Result</p>
              <p className="font-medium text-cream">{metadata?.result}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Event</p>
              <p className="font-medium text-cream">{metadata?.event || 'N/A'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

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