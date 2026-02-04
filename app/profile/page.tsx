import { getProducts, getCategories, getUser } from "../actions/orderActions";
import { getAuthenticatedUserId } from "@/lib/auth";
import ClientApp from "@/components/ClientApp";

export default async function ProfilePage() {
  // Fetch necessary data
  const [rawProducts, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  // Get authenticated user (optional - can be guest)
  const userId = await getAuthenticatedUserId();
  const user = userId ? await getUser(userId) : null;

  // Convert Prisma Decimal to number for client components
  const products = rawProducts.map((p) => ({
    ...p,
    price: Number(p.price),
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
