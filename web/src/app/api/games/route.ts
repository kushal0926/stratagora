import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import prisma from '@/lib/prisma';
import { parsePGN } from '@/lib/chess-utils';

// Types
interface BulkGameData {
  pgn: string;
  chesscomUrl?: string;
  source?: string;
}

interface BulkImportResults {
  total: number;
  imported: number;
  duplicates: number;
  failed: number;
  errors: string[];
}

// GET /api/games - Get user's games
export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const games = await prisma.game.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        white: true,
        black: true,
        result: true,
        event: true,
        date: true,
        whiteElo: true,
        blackElo: true,
        createdAt: true,
        source: true,
        chesscomUrl: true,
      },
    });

    return NextResponse.json({ games });
  } catch (error) {
    console.error('Error fetching games:', error);
    return NextResponse.json(
      { error: 'Failed to fetch games' },
      { status: 500 }
    );
  }
}

// POST /api/games - Save a new game (single or bulk)
export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { pgn, games: bulkGames, source, chesscomUrl } = body;

    // Bulk import
    if (bulkGames && Array.isArray(bulkGames)) {
      return await handleBulkImport(session.user.id, bulkGames);
    }

    // Single game import
    if (!pgn) {
      return NextResponse.json(
        { error: 'PGN is required' },
        { status: 400 }
      );
    }

    const parsed = parsePGN(pgn);
    if (!parsed.isValid) {
      return NextResponse.json(
        { error: parsed.error || 'Invalid PGN' },
        { status: 400 }
      );
    }

    // Check for duplicate if Chess.com game
    if (source === 'chesscom' && chesscomUrl) {
      const existing = await prisma.game.findUnique({
        where: { chesscomUrl: chesscomUrl },
      });

      if (existing) {
        return NextResponse.json(
          { error: 'Game already imported', duplicate: true },
          { status: 409 }
        );
      }
    }

    const game = await prisma.game.create({
      data: {
        userId: session.user.id,
        pgn,
        source: source || 'upload',
        chesscomUrl: chesscomUrl || null,
        white: parsed.metadata.white,
        black: parsed.metadata.black,
        result: parsed.metadata.result,
        event: parsed.metadata.event,
        site: parsed.metadata.site,
        date: parsed.metadata.date,
        round: parsed.metadata.round,
        whiteElo: parsed.metadata.whiteElo,
        blackElo: parsed.metadata.blackElo,
        opening: parsed.metadata.opening,
      },
    });

    return NextResponse.json({ 
      message: 'Game saved successfully',
      game: {
        id: game.id,
        white: game.white,
        black: game.black,
        result: game.result,
      }
    }, { status: 201 });
  } catch (error) {
    console.error('Error saving game:', error);
    return NextResponse.json(
      { error: 'Failed to save game' },
      { status: 500 }
    );
  }
}

// Helper function for bulk import
async function handleBulkImport(
  userId: string, 
  games: BulkGameData[]
): Promise<NextResponse> {
  const results: BulkImportResults = {
    total: games.length,
    imported: 0,
    duplicates: 0,
    failed: 0,
    errors: [],
  };

  for (const gameData of games) {
    try {
      // Validate game data
      if (!gameData.pgn) {
        results.failed++;
        results.errors.push('Missing PGN data');
        continue;
      }

      // Check for duplicate
      if (gameData.chesscomUrl) {
        const existing = await prisma.game.findUnique({
          where: { chesscomUrl: gameData.chesscomUrl },
        });

        if (existing) {
          results.duplicates++;
          continue;
        }
      }

      // Parse PGN
      const parsed = parsePGN(gameData.pgn);
      if (!parsed.isValid) {
        results.failed++;
        results.errors.push(`Failed to parse game: ${gameData.chesscomUrl || 'unknown'}`);
        continue;
      }

      // Save game
      await prisma.game.create({
        data: {
          userId,
          pgn: gameData.pgn,
          source: gameData.source || 'chesscom',
          chesscomUrl: gameData.chesscomUrl || null,
          white: parsed.metadata.white,
          black: parsed.metadata.black,
          result: parsed.metadata.result,
          event: parsed.metadata.event,
          site: parsed.metadata.site,
          date: parsed.metadata.date,
          round: parsed.metadata.round,
          whiteElo: parsed.metadata.whiteElo,
          blackElo: parsed.metadata.blackElo,
          opening: parsed.metadata.opening,
        },
      });

      results.imported++;
    } catch (error) {
      results.failed++;
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      results.errors.push(errorMessage);
    }
  }

  return NextResponse.json({
    message: 'Bulk import completed',
    results,
  }, { status: 201 });
}