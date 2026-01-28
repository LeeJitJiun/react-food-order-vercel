import { getOrderDetails, getProducts, getCategories, getUser } from '@/app/actions/orderActions';
import ClientApp from '@/components/ClientApp';
import { redirect } from 'next/navigation';

interface PageProps {
    searchParams: Promise<{
        id?: string;
    }>;
}

export default async function OrderDetailsPage({ searchParams }: PageProps) {
    const params = await searchParams;
    const orderId = params.id;

    if (!orderId) {
        redirect('/history');
    }

    // Fetch all necessary data
    const [rawProducts, categories] = await Promise.all([
        getProducts(),
        getCategories(),
    ]);

    // Get user
    const user = await getUser('U0001');

    if (!user) {
        throw new Error('User not found');
    }

    // Get order details
    const orderDetails = await getOrderDetails(orderId);

    if (!orderDetails) {
        redirect('/history');
    }

    // Convert Prisma Decimal to number for client components
    const products = rawProducts.map(p => ({
        ...p,
        price: Number(p.price)
    }));

    const order = {
        ...orderDetails,
        total: Number(orderDetails.total),
        orderLists: orderDetails.orderLists.map(item => ({
            ...item,
            subtotal: Number(item.subtotal),
            product: {
                ...item.product,
                price: Number(item.product.price)
            }
        }))
    };

    return (
        <ClientApp
            products={products}
            categories={categories}
            orders={[order]}
            user={user}
            initialView="orderDetails"
            selectedOrderId={orderId}
        />
    );
}
