'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { GameMove } from '@/lib/chess-utils';

interface MoveListProps {
  moves: GameMove[];
  currentMoveIndex: number;
  onMoveClick?: (index: number) => void;
}

export default function MoveList({ moves, currentMoveIndex, onMoveClick }: MoveListProps) {
  return (
    <Card className='bg-minimal border border-white/5 h-full'>
      <CardHeader>
        <CardTitle className='text-cream'>Move List</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-1 max-h-148 overflow-y-auto text-cream no-scrollbar">
          {moves.slice(1).map((move, index) => {
            const actualIndex = index + 1;
            const isActive = actualIndex === currentMoveIndex;
            
            return (
              <div
                key={actualIndex}
                onClick={() => onMoveClick?.(actualIndex)}
                className={`flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-chess ${
                  isActive ? 'bg-chess border border-white/5 text-ink' : ''
                }`}
              >
                <span className="font-semibold text-gray-600 min-w-7.5">
                  {move.moveNumber}.
                </span>
                <span className="font-mono">{move.white}</span>
                {move.black && (
                  <span className="font-mono text-gray-700">{move.black}</span>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}