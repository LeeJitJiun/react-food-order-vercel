import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Temporary storage for pending orders (in a real app, use Redis or database)
const pendingOrders = new Map<string, any>();

export async function POST(request: NextRequest) {
    try {
        const { orderId, orderData, userData } = await request.json();

        // Store the order data with user data temporarily (expires in 1 hour)
        pendingOrders.set(orderId, {
            orderData,
            userData,
            expiresAt: Date.now() + 3600000 // 1 hour
        });

        console.log('Stored pending order:', orderId);

        // Clean up expired orders
        for (const [key, value] of pendingOrders.entries()) {
            if (value.expiresAt < Date.now()) {
                pendingOrders.delete(key);
                console.log('Deleted expired order:', key);
            }
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Error storing pending order:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    try {
        const orderId = request.nextUrl.searchParams.get('orderId');

        if (!orderId) {
            return NextResponse.json(
                { success: false, error: 'Order ID required' },
                { status: 400 }
            );
        }

        const pending = pendingOrders.get(orderId);

        if (!pending || pending.expiresAt < Date.now()) {
            if (pending) pendingOrders.delete(orderId);
            return NextResponse.json(
                { success: false, error: 'Order data not found or expired' },
                { status: 404 }
            );
        }

        console.log('Retrieved pending order:', orderId);

        // Return data but don't delete yet - will be deleted after successful order creation
        return NextResponse.json({
            success: true,
            orderData: pending.orderData,
            userData: pending.userData
        });
    } catch (error: any) {
        console.error('Error retrieving pending order:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const orderId = request.nextUrl.searchParams.get('orderId');

        if (!orderId) {
            return NextResponse.json(
                { success: false, error: 'Order ID required' },
                { status: 400 }
            );
        }

        pendingOrders.delete(orderId);
        console.log('Deleted pending order:', orderId);

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Error deleting pending order:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
