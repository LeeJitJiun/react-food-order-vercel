import { getProducts, getCategories, getUserOrders, getUser } from '../actions/orderActions';
import ClientApp from '@/components/ClientApp';

export default async function MainAppPage() {
  // Fetch all necessary data
  const [rawProducts, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  // Default to a demo user for now (will be replaced by actual logged-in user)
  const user = await getUser('U0001');
  
  // Get user's orders if user exists
  const rawOrders = user ? await getUserOrders(user.userId) : [];

  // Convert Prisma Decimal to number for client components
  const products = rawProducts.map(p => ({
    ...p,
    price: Number(p.price)
  }));

  const orders = rawOrders.map(o => ({
    ...o,
    total: Number(o.total),
    orderLists: o.orderLists.map(ol => ({
      ...ol,
      subtotal: Number(ol.subtotal),
      product: {
        ...ol.product,
        price: Number(ol.product.price)
      }
    })),
    user: {
      username: user?.username || '',
      email: user?.email || ''
    },
    payments: o.payments || []
  }));

  return (
    <ClientApp
      products={products}
      categories={categories}
      orders={orders}
      user={user!}
    />
  );
}
