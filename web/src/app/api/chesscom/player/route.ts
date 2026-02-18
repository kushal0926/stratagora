import { NextResponse } from 'next/server';

const GO_API_URL = process.env.NEXT_PUBLIC_GO_API_URL || 'http://localhost:8080';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const response = await fetch(`${GO_API_URL}/api/chesscom/player`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || 'Failed to fetch player' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching Chess.com player:', error);
    return NextResponse.json(
      { error: 'Failed to connect to Chess.com service' },
      { status: 500 }
    );
  }
}