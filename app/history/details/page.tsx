import { getOrderDetails, getUser } from "@/app/actions/orderActions";
import ClientApp from "@/components/ClientApp";
import { redirect } from "next/navigation";
import { getAuthenticatedUserId } from "@/lib/auth";

interface PageProps {
  searchParams: Promise<{
    id?: string;
  }>;
}

export default async function OrderDetailsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const orderId = params.id;

  if (!orderId) {
    redirect("/history");
  }

  // Get authenticated user ID
  const userId = await getAuthenticatedUserId();

  if (!userId) {
    redirect("/auth-required");
  }

  // Get user and order details only (no need for all products and categories)
  const user = await getUser(userId);

  if (!user) {
    throw new Error("User not found");
  }

  // Get order details
  const orderDetails = await getOrderDetails(orderId);

  if (!orderDetails) {
    redirect("/history");
  }

  // Convert Prisma Decimal to number for client components
  const order = {
    ...orderDetails,
    total: Number(orderDetails.total),
    orderLists: orderDetails.orderLists.map((item) => ({
      ...item,
      subtotal: Number(item.subtotal),
      product: {
        ...item.product,
        price: Number(item.product.price),
      },
    })),
  };

  return (
    <ClientApp
      products={[]}
      categories={[]}
      orders={[order]}
      user={user}
      initialView="orderDetails"
      selectedOrderId={orderId}
    />
  );
}
