"use client";

import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Utensils,
  ClipboardList,
  LogOut,
  Loader2,
} from "lucide-react";

// Import your new separated components
import DashboardOverview from "./DashboardOverview";
import OrderManageView from "./OrderManageView";
import ItemManageView from "./ItemManageView";

type Tab = "overview" | "orders" | "menu";

export default function AdminView() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  // Data State
  const [adminName, setAdminName] = useState("Admin");
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({
    revenue: 0,
    totalOrders: 0,
    growth: "0%",
  });
  const [isLoading, setIsLoading] = useState(true);

  // --- REUSABLE FETCH FUNCTION ---
  // We define this OUTSIDE useEffect so we can pass it to children
  const fetchData = async () => {
    // Optional: Only show full page loader on initial load, not on refresh
    // setIsLoading(true);
    try {
      const res = await fetch("/api/admin");
      const data = await res.json();

      if (data.orders) setOrders(data.orders);
      if (data.products) setProducts(data.products);
      if (data.stats) setStats(data.stats);
      if (data.adminName) setAdminName(data.adminName);
    } catch (error) {
      console.error("Failed to load admin data");
    } finally {
      setIsLoading(false);
    }
  };

  // Initial Load
  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#2d2a27] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#c8a47e]" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#2d2a27] text-[#3e3a36] dark:text-gray-100 flex p-4 gap-6 font-sans">
      {/* Sidebar Navigation */}
      <aside
        className={`${isSidebarOpen ? "w-64" : "w-20"} bg-white dark:bg-[#3e3a36] rounded-[2.5rem] flex flex-col shadow-xl transition-all duration-300`}
      >
        <div className="p-8">
          <h1
            className={`text-2xl font-black italic ${!isSidebarOpen && "opacity-0"}`}
          >
            Oasis <span className="text-[#c8a47e]">Admin</span>
          </h1>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <NavBtn
            icon={LayoutDashboard}
            label="Overview"
            active={activeTab === "overview"}
            onClick={() => setActiveTab("overview")}
            collapsed={!isSidebarOpen}
          />
          <NavBtn
            icon={ClipboardList}
            label="Orders"
            active={activeTab === "orders"}
            onClick={() => setActiveTab("orders")}
            collapsed={!isSidebarOpen}
          />
          <NavBtn
            icon={Utensils}
            label="Menu"
            active={activeTab === "menu"}
            onClick={() => setActiveTab("menu")}
            collapsed={!isSidebarOpen}
          />
        </nav>

        <div className="p-4 mt-auto">
          <button
            onClick={() => {
              // Clear cookies and redirect to home
              document.cookie =
                "userId=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
              document.cookie =
                "userRole=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
              window.location.href = "/login";
            }}
            className="flex items-center gap-3 w-full p-4 text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-3xl font-bold transition-colors"
          >
            <LogOut size={20} />
            <span className={!isSidebarOpen ? "hidden" : ""}>Leave</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 bg-white dark:bg-[#3e3a36] rounded-[3rem] p-8 shadow-xl overflow-y-auto">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 h-full">
          {activeTab === "overview" && (
            <DashboardOverview
              stats={stats}
              orders={orders}
              adminName={adminName}
            />
          )}
          {activeTab === "orders" && (
            <OrderManageView initialOrders={orders} onRefresh={fetchData} />
          )}
          {activeTab === "menu" && (
            <ItemManageView
              products={products}
              onRefresh={fetchData} // <--- PASSING THE REFRESH FUNCTION HERE
            />
          )}
        </div>
      </main>
    </div>
  );
}

function NavBtn({ icon: Icon, label, active, onClick, collapsed }: any) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all font-bold
                ${
                  active
                    ? "bg-[#3e3a36] dark:bg-white text-white dark:text-[#3e3a36]"
                    : "text-gray-400 hover:bg-gray-50"
                }`}
    >
      <Icon size={22} />
      <span className={collapsed ? "hidden" : ""}>{label}</span>
    </button>
  );
}
