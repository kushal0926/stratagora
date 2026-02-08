// frontend/app/api/create-user/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name } = body;

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        name,
      },
    });

    return NextResponse.json({
      status: 'success',
      user,
    });
  } catch (error) {
    console.error('Create user error:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to create user',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}