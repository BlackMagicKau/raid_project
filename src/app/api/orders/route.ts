import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

interface CreateOrderItem {
  fruitId: number;
  quantity: number;
  price: number;
}

interface CreateOrderRequest {
  customerName: string;
  items: CreateOrderItem[];
  totalAmount: number;
}

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
    console.error('Failed to fetch orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as CreateOrderRequest;
    const { customerName, items, totalAmount } = body;

    const order = await prisma.order.create({
      data: {
        customerName,
        totalAmount,
        items: {
          create: items.map((item) => ({
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
    console.error('Failed to create order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
} 