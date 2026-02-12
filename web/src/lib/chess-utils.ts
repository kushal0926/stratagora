import { Chess } from 'chess.js';

export interface PGNMetadata {
  white: string;
  black: string;
  result: string;
  date?: string | null;
  event?: string | null;
  site?: string | null;
  round?: string | null;
  whiteElo?: string | null;
  blackElo?: string | null;
  opening?: string | null;
}

export interface GameMove {
  moveNumber: number;
  white?: string;
  black?: string;
  fen: string;
  comment?: string;
}

// Helper function to extract PGN headers
function extractPGNHeaders(pgn: string): Record<string, string> {
  const headers: Record<string, string> = {};
  const headerRegex = /\[(\w+)\s+"([^"]*)"\]/g;
  let match;

  while ((match = headerRegex.exec(pgn)) !== null) {
    headers[match[1]] = match[2];
  }

  return headers;
}

export function parsePGN(pgn: string): {
  metadata: PGNMetadata;
  moves: GameMove[];
  isValid: boolean;
  error?: string;
} {
  try {
    const chess = new Chess();
    
    // Try to load PGN - this will throw if invalid
    chess.loadPgn(pgn);

    // Extract metadata from PGN headers manually
    const headers = extractPGNHeaders(pgn);
    
    const metadata: PGNMetadata = {
      white: headers.White || 'Unknown',
      black: headers.Black || 'Unknown',
      result: headers.Result || '*',
      date: headers.Date || null,
      event: headers.Event || null,
      site: headers.Site || null,
      round: headers.Round || null,
      whiteElo: headers.WhiteElo || null,
      blackElo: headers.BlackElo || null,
      opening: headers.Opening || null,
    };

    // Get all moves
    chess.reset();
    chess.loadPgn(pgn);
    
    const history = chess.history({ verbose: true });
    const moves: GameMove[] = [];
    
    chess.reset();
    moves.push({
      moveNumber: 0,
      fen: chess.fen(),
    });

    history.forEach((move, index) => {
      chess.move(move.san);
      const moveNumber = Math.floor(index / 2) + 1;
      
      if (index % 2 === 0) {
        // White's move
        moves.push({
          moveNumber,
          white: move.san,
          fen: chess.fen(),
        });
      } else {
        // Black's move - update the last move
        const lastMove = moves[moves.length - 1];
        lastMove.black = move.san;
        lastMove.fen = chess.fen();
      }
    });

    return {
      metadata,
      moves,
      isValid: true,
    };
  } catch (error) {
    return {
      metadata: {} as PGNMetadata,
      moves: [],
      isValid: false,
      error: error instanceof Error ? error.message : 'Invalid PGN format',
    };
  }
}

export function validatePGN(pgn: string): boolean {
  try {
    const chess = new Chess();
    chess.loadPgn(pgn);
    return true;
  } catch {
    return false;
  }
}