const GO_SERVICE_URL = process.env.GO_SERVICE_URL || 'http://localhost:8080';

export interface StockfishEvaluation {
  fen: string;
  evaluation: number;
  bestMove: string;
  depth: number;
}

export interface GameAnalysis {
  gameId: string;
  moves: {
    moveNumber: number;
    fen: string;
    evaluation: number;
    bestMove: string;
    actualMove: string;
    classification: string;
  }[];
  summary: {
    accuracy: number;
    brilliantMoves: number;
    blunders: number;
    mistakes: number;
  };
}

export interface ClaudeResponse {
  message: string;
  conversationId?: string;
}

class GoServiceClient {
  private baseURL: string;

  constructor(baseURL: string = GO_SERVICE_URL) {
    this.baseURL = baseURL;
  }

  async evaluatePosition(fen: string, depth: number = 20): Promise<StockfishEvaluation> {
    const response = await fetch(`${this.baseURL}/api/stockfish/evaluate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fen, depth }),
    });

    if (!response.ok) {
      throw new Error('Stockfish evaluation failed');
    }

    return response.json();
  }

  async analyzeGame(pgn: string): Promise<GameAnalysis> {
    const response = await fetch(`${this.baseURL}/api/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pgn }),
    });

    if (!response.ok) {
      throw new Error('Game analysis failed');
    }

    return response.json();
  }

  async chatWithClaude(
    message: string,
    context?: { gameId?: string; fen?: string; pgn?: string }
  ): Promise<ClaudeResponse> {
    const response = await fetch(`${this.baseURL}/api/claude/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, context }),
    });

    if (!response.ok) {
      throw new Error('Claude chat failed');
    }

    return response.json();
  }

  async fetchChesscomGames(username: string, year?: number, month?: number) {
    const response = await fetch(`${this.baseURL}/api/chesscom/games`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, year, month }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch Chess.com games');
    }

    return response.json();
  }
}

export const goService = new GoServiceClient();