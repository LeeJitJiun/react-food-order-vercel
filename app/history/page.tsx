import {
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
    redirect("/auth-required");
  }

  // Get user and their orders only (no need for all products and categories)
  const user = await getUser(userId);

  if (!user) {
    throw new Error("User not found");
  }

  const rawOrders = await getUserOrders(user.userId);

  // Convert Prisma Decimal to number for client components
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
      products={[]}
      categories={[]}
      orders={orders}
      user={user}
      initialView="history"
    />
  );
}
