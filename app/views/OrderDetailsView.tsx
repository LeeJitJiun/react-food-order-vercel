'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Package, Clock, MapPin, CreditCard } from 'lucide-react';

interface OrderItem {
    product: {
        productId: string;
        name: string;
        price: number;
        photo: string | null;
        category: {
            name: string;
        };
    };
    quantity: number;
    subtotal: number;
}

interface Order {
    orderId: string;
    date: Date;
    total: number;
    status: string;
    note: string | null;
    option: string | null;
    orderLists: OrderItem[];
    user: {
        username: string;
        email: string;
    };
    payments: {
        method: string;
        paymentDate: Date;
    }[];
}

interface OrderDetailsViewProps {
    order: Order | null;
    onBack?: () => void; // Make optional for backward compatibility
}

export function OrderDetailsView({ order, onBack }: OrderDetailsViewProps) {
    const router = useRouter();

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else {
            router.back();
        }
    };

    if (!order) {
        return (
            <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
                <button
                    onClick={handleBack}
                    className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-[#3e3a36] dark:hover:text-white transition-colors mb-8"
                >
                    <ArrowLeft size={16} /> Back to History
                </button>
                <div className="bg-white dark:bg-[#2d2a27] rounded-[2.5rem] p-20 flex flex-col items-center text-center">
                    <Package size={48} className="text-gray-200 mb-6" />
                    <h3 className="text-xl font-bold mb-2 dark:text-white">Order not found</h3>
                    <p className="text-gray-400">This order could not be located.</p>
                </div>
            </div>
        );
    }

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit'
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

    const subtotal = order.orderLists.reduce((sum, item) => sum + Number(item.subtotal), 0);
    const tax = Number(order.total) - subtotal;

    return (
        <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
            <header className="mb-12">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-5xl font-black italic dark:text-white">{order.orderId}</h1>
                    <span className={`px-6 py-2 rounded-full text-sm font-black uppercase tracking-tighter ${getStatusBadge(order.status)}`}>
                        {order.status}
                    </span>
                </div>
                <p className="text-gray-400">Placed on {formatDate(order.date)}</p>
            </header>

            <div className="grid grid-cols-3 gap-6 mb-8">
                {/* Order Info Cards */}
                <div className="bg-white dark:bg-[#2d2a27] p-6 rounded-[2rem] border border-gray-100 dark:border-white/5">
                    <div className="flex items-center gap-3 mb-2">
                        <Clock size={20} className="text-gray-400" />
                        <h3 className="font-bold text-sm uppercase tracking-widest text-gray-400">Order Type</h3>
                    </div>
                    <p className="text-xl font-bold dark:text-white">{order.option || 'Dine-in'}</p>
                </div>

                <div className="bg-white dark:bg-[#2d2a27] p-6 rounded-[2rem] border border-gray-100 dark:border-white/5">
                    <div className="flex items-center gap-3 mb-2">
                        <Package size={20} className="text-gray-400" />
                        <h3 className="font-bold text-sm uppercase tracking-widest text-gray-400">Items</h3>
                    </div>
                    <p className="text-xl font-bold dark:text-white">{order.orderLists.length} items</p>
                </div>

                {order.payments.length > 0 && (
                    <div className="bg-white dark:bg-[#2d2a27] p-6 rounded-[2rem] border border-gray-100 dark:border-white/5">
                        <div className="flex items-center gap-3 mb-2">
                            <CreditCard size={20} className="text-gray-400" />
                            <h3 className="font-bold text-sm uppercase tracking-widest text-gray-400">Payment</h3>
                        </div>
                        <p className="text-xl font-bold dark:text-white">{order.payments[0].method}</p>
                    </div>
                )}
            </div>

            {order.note && (
                <div className="bg-white dark:bg-[#2d2a27] p-8 rounded-[2.5rem] border border-gray-100 dark:border-white/5 mb-8">
                    <h3 className="font-bold text-sm uppercase tracking-widest text-gray-400 mb-3">Order Note</h3>
                    <p className="text-lg dark:text-white">{order.note}</p>
                </div>
            )}

            {/* Order Items */}
            <div className="bg-white dark:bg-[#2d2a27] p-8 rounded-[2.5rem] border border-gray-100 dark:border-white/5 mb-8">
                <h3 className="font-bold text-sm uppercase tracking-widest text-gray-400 mb-6">Order Items</h3>
                <div className="space-y-6">
                    {order.orderLists.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-6 pb-6 border-b border-gray-100 dark:border-white/5 last:border-0 last:pb-0">
                            <div className="w-20 h-20 bg-gray-50 dark:bg-black/20 rounded-2xl flex items-center justify-center overflow-hidden">
                                {item.product.photo ? (
                                    <img
                                        src={item.product.photo}
                                        alt={item.product.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <span className="text-2xl">🌿</span>
                                )}
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-lg dark:text-white">{item.product.name}</h4>
                                <p className="text-sm text-gray-400">{item.product.category.name}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-400 mb-1">Qty: {item.quantity}</p>
                                <p className="font-black text-lg dark:text-white">RM{Number(item.subtotal).toFixed(2)}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white dark:bg-[#2d2a27] p-8 rounded-[2.5rem] border border-gray-100 dark:border-white/5">
                <h3 className="font-bold text-sm uppercase tracking-widest text-gray-400 mb-6">Order Summary</h3>
                <div className="space-y-4">
                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                        <span>Subtotal</span>
                        <span className="font-bold">RM{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                        <span>Tax & Fees</span>
                        <span className="font-bold">RM{tax.toFixed(2)}</span>
                    </div>
                    <div className="h-px bg-gray-200 dark:bg-white/10" />
                    <div className="flex justify-between text-xl font-black dark:text-white">
                        <span>Total</span>
                        <span>RM{Number(order.total).toFixed(2)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
