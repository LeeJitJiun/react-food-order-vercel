'use client';

import { History, ChevronRight } from 'lucide-react';

interface OrderItem {
    product: {
        name: string;
    };
    quantity: number;
}

interface Order {
    orderId: string;
    date: Date;
    total: number;
    status: string;
    orderLists: OrderItem[];
}

interface HistoryViewProps {
    orders: Order[];
    onNavigateToShop: () => void;
    onViewOrderDetails: (orderId: string) => void;
}

export function HistoryView({ orders, onNavigateToShop, onViewOrderDetails }: HistoryViewProps) {
    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const getStatusBadge = (status: string) => {
        const badges: Record<string, string> = {
            'PREPARING': 'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400',
            'READY': 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
            'COMPLETED': 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
        };
        return badges[status] || 'bg-gray-50 dark:bg-gray-900/30 text-gray-600 dark:text-gray-400';
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
            <header className="mb-12">
                <h1 className="text-5xl font-black italic mb-2 dark:text-white">Order History</h1>
                <p className="text-gray-400">Your past sensory journeys through our gardens.</p>
            </header>

            {orders.length === 0 ? (
                <div className="bg-white dark:bg-[#2d2a27] rounded-[2.5rem] p-20 flex flex-col items-center text-center">
                    <History size={48} className="text-gray-200 mb-6" />
                    <h3 className="text-xl font-bold mb-2 dark:text-white">No seeds planted yet</h3>
                    <p className="text-gray-400 max-w-xs mb-8">
                        Begin your first harvest by visiting our botanical library.
                    </p>
                    <button
                        onClick={onNavigateToShop}
                        className="bg-[#3e3a36] dark:bg-white dark:text-[#3e3a36] text-white px-8 py-3 rounded-full font-bold"
                    >
                        Visit Menu
                    </button>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map(order => (
                        <div
                            key={order.orderId}
                            className="bg-white dark:bg-[#2d2a27] p-8 rounded-[2.5rem] border border-gray-100 dark:border-white/5 flex flex-wrap items-center justify-between gap-6"
                        >
                            <div className="flex gap-6 items-center">
                                <div className="w-14 h-14 bg-[#f9f7f2] dark:bg-black/20 rounded-2xl flex items-center justify-center text-xl">
                                    📦
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg dark:text-white">{order.orderId}</h4>
                                    <p className="text-sm text-gray-400">
                                        {formatDate(order.date)} • {order.orderLists.length} items
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-12 items-center">
                                <div className="text-right">
                                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">
                                        Total
                                    </p>
                                    <p className="text-xl font-black dark:text-white">
                                        RM{Number(order.total).toFixed(2)}
                                    </p>
                                </div>
                                <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-tighter ${getStatusBadge(order.status)}`}>
                                    {order.status}
                                </span>
                                <button
                                    onClick={() => onViewOrderDetails(order.orderId)}
                                    className="p-3 bg-gray-50 dark:bg-white/5 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                                >
                                    <ChevronRight size={20} className="dark:text-white" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
