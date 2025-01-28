import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const fruits = await prisma.fruit.findMany();
    return NextResponse.json(fruits);
  } catch (error) {
    console.error('Failed to fetch fruits:', error);
    return NextResponse.json(
      { error: 'Failed to fetch fruits' },
      { status: 500 }
    );
  }
} 