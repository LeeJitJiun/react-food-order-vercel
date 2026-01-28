import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Update order status
export async function PUT(req: Request) {
  try {
    const { orderId, status } = await req.json();

    // Validate status
    const validStatuses = ['PREPARING', 'READY', 'COMPLETED'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be PREPARING, READY, or COMPLETED' },
        { status: 400 }
      );
    }

    const updatedOrder = await prisma.order.update({
      where: { orderId },
      data: { status },
    });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error('Update order error:', error);
    return NextResponse.json(
      { error: 'Failed to update order status' },
      { status: 500 }
    );
  }
}
