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
    console.log('Received order:', body);

    const { customerName, items, totalAmount } = body;

    // Validate stock levels before creating order
    for (const item of items) {
      const fruit = await prisma.fruit.findUnique({
        where: { id: item.fruitId }
      });
      console.log('Checking fruit:', fruit, 'for order item:', item);

      if (!fruit) {
        console.error(`Fruit not found: ${item.fruitId}`);
        return NextResponse.json(
          { error: `Fruit with id ${item.fruitId} not found` },
          { status: 404 }
        );
      }

      if (item.quantity > fruit.stock) {
        console.error(`Insufficient stock for ${fruit.name}`);
        return NextResponse.json(
          { 
            error: `Not enough stock for ${fruit.name}. Requested: ${item.quantity}, Available: ${fruit.stock}` 
          },
          { status: 400 }
        );
      }
    }

    // Create order
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
    console.log('Created order:', order);

    // Update stock
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
      { error: error instanceof Error ? error.message : 'Failed to create order' },
      { status: 500 }
    );
  }
} 