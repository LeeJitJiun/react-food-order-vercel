import { redirect } from "next/navigation";

export default async function MainAppPage() {
  // Redirect to root page (which is now the home page)
  redirect("/");
}

  // Convert Prisma Decimal to number for client components
  const products = rawProducts.map((p) => ({
    ...p,
    price: Number(p.price),
  }));

  const orders = rawOrders.map((o) => ({
    ...o,
    total: Number(o.total),
    orderLists: o.orderLists.map((ol) => ({
      ...ol,
      subtotal: Number(ol.subtotal),
      product: {
        ...ol.product,
        price: Number(ol.product.price),
      },
    })),
    user: {
      username: user?.username || "",
      email: user?.email || "",
    },
    payments: o.payments || [],
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
