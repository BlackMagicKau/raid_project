import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: {
          include: {
            fruit: true
          }
        }
      }
    });
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customerName, items, totalAmount } = body;

    const order = await prisma.order.create({
      data: {
        customerName,
        totalAmount,
        items: {
          create: items.map((item: any) => ({
            fruitId: item.fruitId,
            quantity: item.quantity,
            priceAtPurchase: item.price
          }))
        }
      }
    });

    // Update fruit stock
    for (const item of items) {
      await prisma.fruit.update({
        where: { id: item.fruitId },
        data: {
          stock: {
            decrement: item.quantity
          }
        }
      });
    }

    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
} 