import {
  getProducts,
  getCategories,
  getUserOrders,
  getUser,
} from "../actions/orderActions";
import ClientApp from "@/components/ClientApp";
import { getAuthenticatedUserId } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function HistoryPage() {
  // Get authenticated user ID
  const userId = await getAuthenticatedUserId();

  if (!userId) {
    redirect("/login");
  }

  // Fetch all necessary data
  const [rawProducts, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  // Get user and their orders
  const user = await getUser(userId);

  if (!user) {
    throw new Error("User not found");
  }

  const rawOrders = await getUserOrders(user.userId);

  // Convert Prisma Decimal to number for client components
  const products = rawProducts.map((p) => ({
    ...p,
    price: Number(p.price),
  }));

  const orders = rawOrders.map((order) => ({
    ...order,
    total: Number(order.total),
    orderLists: order.orderLists.map((item) => ({
      ...item,
      subtotal: Number(item.subtotal),
      product: {
        ...item.product,
        price: Number(item.product.price),
      },
    })),
    user: {
      username: user.username,
      email: user.email,
    },
  }));

  return (
    <ClientApp
      products={products}
      categories={categories}
      orders={orders}
      user={user}
      initialView="history"
    />
  );
}
