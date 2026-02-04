import { getUser } from "../actions/orderActions";
import { getAuthenticatedUserId } from "@/lib/auth";
import ClientApp from "@/components/ClientApp";

export default async function ProfilePage() {
  // Get authenticated user (optional - can be guest)
  const userId = await getAuthenticatedUserId();
  const user = userId ? await getUser(userId) : null;

  const orders: any[] = []; // Empty orders for profile-only view

  return (
    <ClientApp
      products={[]}
      categories={[]}
      orders={orders}
      user={user}
      initialView="profile"
    />
  );
}
