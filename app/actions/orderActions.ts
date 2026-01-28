'use server';

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import { revalidatePath } from 'next/cache';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export async function getProducts() {
    return await prisma.product.findMany({
        where: {
            isAvailable: true
        },
        include: {
            category: true
        },
        orderBy: {
            name: 'asc'
        }
    });
}

export async function getCategories() {
    return await prisma.category.findMany({
        where: {
            isActive: true
        },
        orderBy: {
            name: 'asc'
        }
    });
}

export async function getUserOrders(userId: string) {
    return await prisma.order.findMany({
        where: {
            userId: userId
        },
        include: {
            orderLists: {
                include: {
                    product: {
                        include: {
                            category: true
                        }
                    }
                }
            },
            payments: true
        },
        orderBy: {
            date: 'desc'
        }
    });
}

export async function getUser(userId: string) {
    return await prisma.user.findUnique({
        where: {
            userId: userId
        }
    });
}

interface CartItem {
    productId: string;
    quantity: number;
    price: number;
}

export async function createOrder(userId: string, cartItems: CartItem[], note?: string, option?: string, paymentMethod?: 'CARD' | 'FPX') {
    try {
        // Calculate total
        const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0) + 2.4; // Add tax

        // Generate order ID
        const lastOrder = await prisma.order.findFirst({
            orderBy: {
                orderId: 'desc'
            }
        });

        const newOrderNumber = lastOrder
            ? parseInt(lastOrder.orderId.substring(1)) + 1
            : 1;
        const orderId = `O${newOrderNumber.toString().padStart(4, '0')}`;

        // Generate payment ID
        const lastPayment = await prisma.payment.findFirst({
            orderBy: {
                paymentId: 'desc'
            }
        });

        const newPaymentNumber = lastPayment
            ? parseInt(lastPayment.paymentId.substring(1)) + 1
            : 1;
        const paymentId = `Y${newPaymentNumber.toString().padStart(4, '0')}`;

        // Create order with order lists and payment
        const order = await prisma.order.create({
            data: {
                orderId,
                userId,
                total,
                note,
                option: option || 'Dine-in',
                status: 'PREPARING',
                orderLists: {
                    create: cartItems.map(item => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        subtotal: item.price * item.quantity
                    }))
                },
                payments: {
                    create: {
                        paymentId,
                        method: paymentMethod || 'CARD',
                        paymentDate: new Date()
                    }
                }
            },
            include: {
                orderLists: {
                    include: {
                        product: {
                            include: {
                                category: true
                            }
                        }
                    }
                },
                payments: true
            }
        });

        // Convert Decimal to number for client components
        const serializedOrder = {
            ...order,
            total: Number(order.total),
            orderLists: order.orderLists.map(ol => ({
                ...ol,
                subtotal: Number(ol.subtotal),
                product: {
                    ...ol.product,
                    price: Number(ol.product.price)
                }
            }))
        };

        revalidatePath('/');
        return { success: true, order: serializedOrder };
    } catch (error) {
        console.error('Error creating order:', error);
        return { success: false, error: 'Failed to create order' };
    }
}

export async function getOrderDetails(orderId: string) {
    try {
        const order = await prisma.order.findUnique({
            where: {
                orderId: orderId
            },
            include: {
                orderLists: {
                    include: {
                        product: {
                            include: {
                                category: true
                            }
                        }
                    }
                },
                payments: true,
                user: {
                    select: {
                        username: true,
                        email: true
                    }
                }
            }
        });

        if (!order) {
            return null;
        }

        // Convert Decimal to number for client components
        return {
            ...order,
            total: Number(order.total),
            orderLists: order.orderLists.map(ol => ({
                ...ol,
                subtotal: Number(ol.subtotal),
                product: {
                    ...ol.product,
                    price: Number(ol.product.price)
                }
            }))
        };
    } catch (error) {
        console.error('Error fetching order details:', error);
        return null;
    }
}
