import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Get daily sales
    const dailySales = await prisma.order.groupBy({
      by: ['createdAt'],
      _sum: {
        totalAmount: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Get sales by fruit
    const fruitSales = await prisma.orderItem.groupBy({
      by: ['fruitId'],
      _sum: {
        quantity: true,
        priceAtPurchase: true
      }
    });

    // Get fruit names for the sales data
    const fruits = await prisma.fruit.findMany();
    const fruitMap = new Map(fruits.map(f => [f.id, f.name]));

    const fruitSalesWithNames = fruitSales.map(sale => ({
      fruitName: fruitMap.get(sale.fruitId),
      fruitId: sale.fruitId,
      totalQuantity: sale._sum.quantity,
      totalSales: sale._sum.priceAtPurchase
    }));

    return NextResponse.json({
      dailySales: dailySales.map(day => ({
        date: day.createdAt,
        total: day._sum.totalAmount
      })),
      fruitSales: fruitSalesWithNames
    });
  } catch (error) {
    console.error('Failed to fetch analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
} 