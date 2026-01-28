import React, { useState, useEffect } from "react";
import { ChefHat, Clock, CheckCircle2, Loader2 } from "lucide-react";

export default function OrderManageView({
  initialOrders,
  onRefresh,
}: {
  initialOrders: any[];
  onRefresh: () => void;
}) {
  const [orders, setOrders] = useState(initialOrders);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Sync state if props change (e.g., when data loads)
  useEffect(() => {
    setOrders(initialOrders);
  }, [initialOrders]);

  // --- Update order status in database ---
  const moveOrder = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch("/api/order", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status: newStatus }),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(`Error: ${data.error}`);
        return;
      }

      // Update local state on success
      setOrders(
        orders.map((o) =>
          o.orderId === orderId ? { ...o, status: newStatus } : o,
        ),
      );

      // Also refresh parent state so it stays in sync
      onRefresh();
    } catch (error) {
      console.error("Failed to update order:", error);
      alert("Failed to update order status");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <header className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-black text-[#3e3a36] dark:text-white">
          Order Manage
        </h2>
        <div className="flex gap-2">
          <span className="px-4 py-2 bg-[#fcf3cf] text-yellow-800 rounded-full text-xs font-bold">
            Preparing: {orders.filter((o) => o.status === "PREPARING").length}
          </span>
        </div>
      </header>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 overflow-hidden">
        <KanbanColumn
          title="Preparing"
          icon={ChefHat}
          color="bg-yellow-50 dark:bg-yellow-900/10 border-yellow-100"
          textColor="text-yellow-700"
          orders={orders.filter((o) => o.status === "PREPARING")}
          onNext={(id: string) => moveOrder(id, "READY")}
          updatingId={updatingId}
        />
        <KanbanColumn
          title="Ready to Serve"
          icon={Clock}
          color="bg-blue-50 dark:bg-blue-900/10 border-blue-100"
          textColor="text-blue-700"
          orders={orders.filter((o) => o.status === "READY")}
          onNext={(id: string) => moveOrder(id, "COMPLETED")}
          updatingId={updatingId}
        />
        <KanbanColumn
          title="Completed"
          icon={CheckCircle2}
          color="bg-emerald-50 dark:bg-emerald-900/10 border-emerald-100"
          textColor="text-emerald-700"
          orders={orders.filter((o) => o.status === "COMPLETED")}
          updatingId={updatingId}
        />
      </div>
    </div>
  );
}

// --- Helper Component moved here ---
function KanbanColumn({
  title,
  icon: Icon,
  color,
  textColor,
  orders,
  onNext,
  updatingId,
}: any) {
  return (
    <div
      className={`p-4 rounded-[2.5rem] border ${color} flex flex-col h-full`}
    >
      <div className="flex items-center gap-3 px-2 mb-4">
        <Icon className={textColor} size={20} />
        <h3 className="font-bold text-gray-700 dark:text-gray-200">{title}</h3>
        <span className="ml-auto bg-white/50 px-2 py-1 rounded-full text-xs font-bold">
          {orders.length}
        </span>
      </div>

      <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar">
        {orders.map((order: any) => (
          <div
            key={order.orderId}
            className="bg-white dark:bg-[#3e3a36] p-5 rounded-[1.5rem] shadow-sm border border-gray-100 dark:border-white/5 hover:scale-[1.02] transition-transform cursor-pointer"
          >
            <div className="flex justify-between mb-2">
              <span className="font-bold text-xs text-gray-400">
                #{order.orderId}
              </span>
              <span className="font-black text-sm dark:text-white">
                RM{order.total.toFixed(2)}
              </span>
            </div>
            <p className="font-bold text-gray-800 dark:text-gray-200 mb-1">
              {order.user}
            </p>
            <p className="text-xs text-gray-500 mb-4">{order.items}</p>

            {onNext && (
              <button
                onClick={() => onNext(order.orderId)}
                disabled={updatingId === order.orderId}
                className="w-full py-2 rounded-xl bg-gray-50 dark:bg-white/5 text-xs font-bold hover:bg-[#c8a47e] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {updatingId === order.orderId ? (
                  <>
                    <Loader2 className="animate-spin" size={14} />
                    Updating...
                  </>
                ) : (
                  "Move to Next →"
                )}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
