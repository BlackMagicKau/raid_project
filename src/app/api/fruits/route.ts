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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, price, stock } = body;

    const fruit = await prisma.fruit.create({
      data: {
        name,
        price,
        stock
      }
    });

    return NextResponse.json(fruit);
  } catch (error) {
    console.error('Failed to create fruit:', error);
    return NextResponse.json(
      { error: 'Failed to create fruit' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, stock } = body;

    const fruit = await prisma.fruit.update({
      where: { id },
      data: { stock }
    });

    return NextResponse.json(fruit);
  } catch (error) {
    console.error('Failed to update fruit:', error);
    return NextResponse.json(
      { error: 'Failed to update fruit' },
      { status: 500 }
    );
  }
} 