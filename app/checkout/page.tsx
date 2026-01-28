'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, CreditCard, Wallet } from 'lucide-react';

interface CartItem {
    productId: string;
    name: string;
    price: number;
    photo: string | null;
    quantity: number;
}

export default function CheckoutPage() {
    const router = useRouter();
    const [cart, setCart] = useState<CartItem[]>([]);
    const [note, setNote] = useState('');
    const [option, setOption] = useState<'Dine-in' | 'Takeaway'>('Dine-in');
    const [paymentMethod, setPaymentMethod] = useState<'CARD' | 'FPX'>('CARD');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // First, try to load pending order (for returning from failed payment)
        const pendingOrder = localStorage.getItem('pendingOrder');
        if (pendingOrder) {
            const orderDetails = JSON.parse(pendingOrder);
            setCart(orderDetails.cart);
            setNote(orderDetails.note || '');
            setOption(orderDetails.option || 'Dine-in');
            setPaymentMethod(orderDetails.paymentMethod || 'CARD');
            console.log('Restored pending order from previous attempt');
            return;
        }

        // Otherwise, load cart from localStorage
        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
            setCart(JSON.parse(storedCart));
        } else {
            // No cart, redirect back
            router.push('/menu');
        }
    }, [router]);

    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const tax = 2.40;
    const total = subtotal + tax;

    const handlePlaceOrder = async () => {
        setLoading(true);

        // Get user info
        const user = localStorage.getItem('user');
        if (!user) {
            alert('Please login first');
            router.push('/login');
            return;
        }

        // Store order details in localStorage and sessionStorage for payment page
        const orderDetails = {
            cart,
            note,
            option,
            paymentMethod,
            total,
            userId: JSON.parse(user).userId // Include userId in order details
        };

        console.log('=== Checkout: Storing order details ===');
        console.log('Order details:', orderDetails);
        console.log('User ID:', orderDetails.userId);

        localStorage.setItem('pendingOrder', JSON.stringify(orderDetails));
        sessionStorage.setItem('pendingOrder', JSON.stringify(orderDetails));
        sessionStorage.setItem('user', user); // Also store user in sessionStorage


        // Redirect to payment page
        router.push('/payment');
    };

    return (
        <div className="min-h-screen bg-[#f9f7f2] dark:bg-[#1a1816] text-[#3e3a36] dark:text-white">
            <div className="max-w-4xl mx-auto p-8">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => router.push('/menu')}
                        className="p-2 hover:bg-white/50 dark:hover:bg-white/5 rounded-full transition-colors"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <h1 className="text-3xl font-black italic">Order Summary</h1>
                </div>

                <div className="grid gap-8 lg:grid-cols-2">
                    {/* Order Items */}
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-[#2d2a27] rounded-2xl p-6 shadow-sm">
                            <h2 className="text-xl font-bold mb-4">Your Items</h2>
                            <div className="space-y-4">
                                {cart.map(item => (
                                    <div key={item.productId} className="flex justify-between items-center">
                                        <div className="flex gap-3 items-center flex-1">
                                            {item.photo && (
                                                <img
                                                    src={item.photo}
                                                    alt={item.name}
                                                    className="w-12 h-12 object-cover rounded-lg"
                                                />
                                            )}
                                            <div>
                                                <p className="font-semibold">{item.name}</p>
                                                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                            </div>
                                        </div>
                                        <p className="font-bold">RM{(item.price * item.quantity).toFixed(2)}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-white/10 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span>Subtotal</span>
                                    <span>RM{subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-500">
                                    <span>Tax</span>
                                    <span>RM{tax.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-xl font-bold pt-2">
                                    <span>Total</span>
                                    <span>RM{total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order Details Form */}
                    <div className="space-y-6">
                        {/* Notes */}
                        <div className="bg-white dark:bg-[#2d2a27] rounded-2xl p-6 shadow-sm">
                            <h2 className="text-xl font-bold mb-4">Special Notes</h2>
                            <textarea
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                placeholder="Any special requests?"
                                className="w-full p-4 border border-gray-200 dark:border-white/10 rounded-xl bg-transparent resize-none focus:outline-none focus:ring-2 focus:ring-[#c8a47e]"
                                rows={3}
                            />
                        </div>

                        {/* Options */}
                        <div className="bg-white dark:bg-[#2d2a27] rounded-2xl p-6 shadow-sm">
                            <h2 className="text-xl font-bold mb-4">Order Option</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => setOption('Dine-in')}
                                    className={`p-4 rounded-xl border-2 font-semibold transition-all ${option === 'Dine-in'
                                        ? 'border-[#c8a47e] bg-[#c8a47e]/10'
                                        : 'border-gray-200 dark:border-white/10 hover:border-[#c8a47e]/50'
                                        }`}
                                >
                                    Dine-in
                                </button>
                                <button
                                    onClick={() => setOption('Takeaway')}
                                    className={`p-4 rounded-xl border-2 font-semibold transition-all ${option === 'Takeaway'
                                        ? 'border-[#c8a47e] bg-[#c8a47e]/10'
                                        : 'border-gray-200 dark:border-white/10 hover:border-[#c8a47e]/50'
                                        }`}
                                >
                                    Takeaway
                                </button>
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className="bg-white dark:bg-[#2d2a27] rounded-2xl p-6 shadow-sm">
                            <h2 className="text-xl font-bold mb-4">Payment Method</h2>
                            <div className="space-y-3">
                                <button
                                    onClick={() => setPaymentMethod('CARD')}
                                    className={`w-full p-4 rounded-xl border-2 font-semibold transition-all flex items-center gap-3 ${paymentMethod === 'CARD'
                                        ? 'border-[#c8a47e] bg-[#c8a47e]/10'
                                        : 'border-gray-200 dark:border-white/10 hover:border-[#c8a47e]/50'
                                        }`}
                                >
                                    <CreditCard size={20} />
                                    <span>Debit/Credit Card</span>
                                </button>
                                <button
                                    onClick={() => setPaymentMethod('FPX')}
                                    className={`w-full p-4 rounded-xl border-2 font-semibold transition-all flex items-center gap-3 ${paymentMethod === 'FPX'
                                        ? 'border-[#c8a47e] bg-[#c8a47e]/10'
                                        : 'border-gray-200 dark:border-white/10 hover:border-[#c8a47e]/50'
                                        }`}
                                >
                                    <Wallet size={20} />
                                    <span>FPX Online Banking</span>
                                </button>
                            </div>
                        </div>

                        {/* Place Order Button */}
                        <button
                            onClick={handlePlaceOrder}
                            disabled={loading || cart.length === 0}
                            className="w-full bg-[#3e3a36] dark:bg-white text-white dark:text-[#3e3a36] py-6 rounded-full font-bold text-lg hover:bg-[#2d2a27] dark:hover:bg-gray-100 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Processing...' : 'Proceed to Payment'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
