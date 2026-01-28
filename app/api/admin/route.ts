import { NextResponse } from 'next/server';
import { cookies } from 'next/headers'; // Safe import
import prisma from '@/lib/prisma';

// Force the page to always fetch fresh data (Fixes "data not updating" issues)
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // --- 1. OPTIONAL: Try to get Admin Name (Won't block if it fails) ---
    let currentUserName = "Admin";
    try {
      const cookieStore = await cookies(); // Supports Next.js 15
      const userIdCookie = cookieStore.get('userId'); 
      
      if (userIdCookie) {
        const user = await prisma.user.findUnique({
          where: { userId: userIdCookie.value },
          select: { username: true }
        });
        if (user) currentUserName = user.username;
      }
    } catch (e) {
      // If cookies fail (e.g. localhost issues), just ignore and use "Admin"
      console.log("Cookie check skipped:", e);
    }
    // ------------------------------------------------------------------

    // --- 2. YOUR ORIGINAL DATA FETCHING LOGIC ---
    const [orders, products, totalRevenue, totalCount] = await Promise.all([
      prisma.order.findMany({
        orderBy: { date: 'desc' },
        include: {
          user: { select: { username: true } },
          orderLists: { include: { product: { select: { name: true } } } }
        }
      }),
      prisma.product.findMany({
        orderBy: { productId: 'desc' },
        include: { category: { select: { name: true } } }
      }),
      prisma.order.aggregate({ _sum: { total: true } }),
      prisma.order.count()
    ]);

    // --- 3. FORMATTING ---
    const formattedOrders = orders.map(o => ({
      orderId: o.orderId,
      user: o.user?.username || "Guest",
      status: o.status,
      total: Number(o.total),
      items: o.orderLists.map(l => `${l.quantity}x ${l.product.name}`).join(', ')
    }));

    const formattedProducts = products.map(p => ({
      productId: p.productId,
      name: p.name,
      price: Number(p.price),
      stock: p.stock,
      category: p.category ? p.category.name : "Uncategorized",
      status: p.isAvailable && p.stock > 0 ? 'Available' : 'Unavailable'
    }));

    const stats = {
      revenue: Number(totalRevenue._sum.total || 0),
      totalOrders: totalCount,
      growth: "+0%" // Placeholder
    };

    // Return everything including the name
    return NextResponse.json({ 
      orders: formattedOrders, 
      products: formattedProducts, 
      stats,
      adminName: currentUserName 
    });

  } catch (error) {
    console.error("Admin API Error:", error);
    return NextResponse.json({ error: "Failed to fetch admin data" }, { status: 500 });
  }
}