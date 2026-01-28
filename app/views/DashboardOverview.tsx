import React from 'react';
import { DollarSign, Package, TrendingUp } from 'lucide-react';

interface DashboardProps {
  stats: { revenue: number; totalOrders: number; growth: string };
  orders: any[];
  adminName: string;
}

export default function DashboardOverview({ stats, orders, adminName }: DashboardProps) {
    return (
        <div className="space-y-8">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-black text-[#3e3a36] dark:text-white mb-1">
                        Welcome, {adminName}.
                    </h2>
                    <p className="text-gray-400 font-medium">Here's what's happening in the garden today.</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-[#c8a47e] flex items-center justify-center text-white font-bold">
                    {adminName.charAt(0).toUpperCase()}
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Total Revenue" value={`RM ${stats.revenue.toFixed(2)}`} icon={DollarSign} color="bg-[#fcf3cf] text-yellow-700" />
                <StatCard title="Total Orders" value={stats.totalOrders} icon={Package} color="bg-[#e8f3ee] text-emerald-700" />
                <StatCard title="Growth" value={stats.growth} icon={TrendingUp} color="bg-[#fdeded] text-rose-700" />
            </div>

            <div className="bg-gray-50 dark:bg-white/5 p-8 rounded-[2.5rem]">
                <h3 className="font-bold text-lg mb-6 dark:text-white">Recent Harvests</h3>
                <div className="space-y-4">
                    {orders.slice(0, 3).map((order, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-white dark:bg-[#3e3a36] rounded-2xl shadow-sm">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">🍔</div>
                                <div>
                                    <p className="font-bold text-sm dark:text-white">New Order #{order.orderId}</p>
                                    <p className="text-xs text-gray-400">{order.items}</p>
                                </div>
                            </div>
                            <span className="font-bold text-[#c8a47e]">RM {order.total.toFixed(2)}</span>
                        </div>
                    ))}
                    {orders.length === 0 && <p className="text-gray-400 text-sm">No recent orders yet.</p>}
                </div>
            </div>
        </div>
    );
}

// --- Helper Component moved here ---
function StatCard({ title, value, icon: Icon, color }: any) {
    return (
        <div className="bg-white dark:bg-[#2d2a27] p-6 rounded-[2.5rem] flex items-center gap-6 shadow-sm border border-gray-100 dark:border-white/5">
            <div className={`w-14 h-14 rounded-full ${color} flex items-center justify-center`}>
                <Icon size={24} />
            </div>
            <div>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">{title}</p>
                <p className="text-2xl font-black dark:text-white">{value}</p>
            </div>
        </div>
    );
}