import { getProducts, getCategories, getUser } from '../actions/orderActions';
import ClientApp from '@/components/ClientApp';

export default async function ProfilePage() {
    // Fetch necessary data
    const [rawProducts, categories] = await Promise.all([
        getProducts(),
        getCategories(),
    ]);

    // Get user info
    const user = await getUser('U0001');

    if (!user) {
        throw new Error('User not found');
    }

    // Convert Prisma Decimal to number for client components
    const products = rawProducts.map(p => ({
        ...p,
        price: Number(p.price)
    }));

    const orders: any[] = []; // Empty orders for profile-only view

    return (
        <ClientApp
            products={products}
            categories={categories}
            orders={orders}
            user={user}
            initialView="profile"
        />
    );
}
