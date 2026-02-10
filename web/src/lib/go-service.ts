const GO_SERVICE_URL = process.env.NEXT_PUBLIC_GO_API_URL || 'http://localhost:8080';

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface HealthData {
  status: string;
  service: string;
  version: string;
  uptime: string;
  golang: string;
}

export interface AnalyzeGameRequest {
  pgn: string;
}

export interface FetchGamesRequest {
  username: string;
}

export interface ChatRequest {
  message: string;
  context?: Record<string, unknown>;
}

class GoServiceClient {
  private baseURL: string;

  constructor(baseURL: string = GO_SERVICE_URL) {
    this.baseURL = baseURL;
  }

  // Health check
  async health(): Promise<ApiResponse<HealthData>> {
    const response = await fetch(`${this.baseURL}/health`);
    if (!response.ok) {
      throw new Error('Health check failed');
    }
    return response.json();
  }

  // Ping
  async ping(): Promise<ApiResponse<{ message: string }>> {
    const response = await fetch(`${this.baseURL}/ping`);
    if (!response.ok) {
      throw new Error('Ping failed');
    }
    return response.json();
  }

  // Chess analysis
  async analyzeGame(pgn: string): Promise<ApiResponse<unknown>> {
    const response = await fetch(`${this.baseURL}/api/chess/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pgn }),
    });
    if (!response.ok) {
      throw new Error('Game analysis failed');
    }
    return response.json();
  }

  // Chess.com integration
  async fetchChesscomGames(username: string): Promise<ApiResponse<unknown>> {
    const response = await fetch(`${this.baseURL}/api/chesscom/games`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username }),
    });
    if (!response.ok) {
      throw new Error('Failed to fetch Chess.com games');
    }
    return response.json();
  }

  // Claude chat
  async chatWithClaude(
    message: string,
    context?: Record<string, unknown>
  ): Promise<ApiResponse<unknown>> {
    const response = await fetch(`${this.baseURL}/api/claude/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, context }),
    });
    if (!response.ok) {
      throw new Error('Chat request failed');
    }
    return response.json();
  }
}

export const goService = new GoServiceClient();