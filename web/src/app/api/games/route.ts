import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";
import { parsePGN } from "@/lib/chess-utils";

// GET /api/games - Get user's games
export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const games = await prisma.game.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
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
      },
    });

    return NextResponse.json({ games });
  } catch (error) {
    console.error("Error fetching games:", error);
    return NextResponse.json(
      { error: "Failed to fetch games" },
      { status: 500 },
    );
  }
}

// POST /api/games - Save a new game
export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { pgn } = body;

    if (!pgn) {
      return NextResponse.json({ error: "PGN is required" }, { status: 400 });
    }

    // Parse and validate PGN
    const parsed = parsePGN(pgn);
    if (!parsed.isValid) {
      return NextResponse.json(
        { error: parsed.error || "Invalid PGN" },
        { status: 400 },
      );
    }

    // Save to database
    const game = await prisma.game.create({
      data: {
        userId: session.user.id,
        pgn,
        source: "upload",
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

    return NextResponse.json(
      {
        message: "Game saved successfully",
        game: {
          id: game.id,
          white: game.white,
          black: game.black,
          result: game.result,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error saving game:", error);
    return NextResponse.json({ error: "Failed to save game" }, { status: 500 });
  }
}
