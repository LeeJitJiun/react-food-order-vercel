'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CreditCard, CheckCircle, Loader2 } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

function PaymentForm({ orderDetails, onSuccess }: any) {
    const stripe = useStripe();
    const elements = useElements();
    const router = useRouter();
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedBank, setSelectedBank] = useState('');
    const [isDarkMode, setIsDarkMode] = useState(false);

    // Detect dark mode
    useEffect(() => {
        const checkDarkMode = () => {
            setIsDarkMode(document.documentElement.classList.contains('dark'));
        };

        checkDarkMode();

        // Watch for dark mode changes
        const observer = new MutationObserver(checkDarkMode);
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

        return () => observer.disconnect();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setProcessing(true);
        setError(null);

        try {
            // Create payment intent
            const response = await fetch('/api/payment/create-intent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: orderDetails.total,
                    paymentMethod: orderDetails.paymentMethod
                })
            });

            const { clientSecret, error: intentError } = await response.json();

            if (intentError) {
                setError(intentError);
                setProcessing(false);
                return;
            }

            let result;

            if (orderDetails.paymentMethod === 'CARD') {
                const cardElement = elements.getElement(CardElement);
                if (!cardElement) return;

                result = await stripe.confirmCardPayment(clientSecret, {
                    payment_method: {
                        card: cardElement,
                    }
                });

                if (result.error) {
                    setError(result.error.message || 'Payment failed');
                    setProcessing(false);
                } else if (result.paymentIntent?.status === 'succeeded') {
                    // Payment successful for CARD, create order
                    await createOrderAfterPayment();
                } else {
                    // Payment intent exists but not succeeded yet
                    setError(`Payment status: ${result.paymentIntent?.status}. Please try again.`);
                    setProcessing(false);
                }
            } else {
                // FPX payment - will redirect to Stripe and then to success page
                // Generate unique order ID for tracking
                const pendingOrderId = `pending_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

                // Get user data to store with order
                const user = localStorage.getItem('user');
                if (!user) {
                    setError('Please login first');
                    setProcessing(false);
                    return;
                }

                const parsedUser = JSON.parse(user);
                console.log('=== Payment: Storing pending order ===');
                console.log('Pending Order ID:', pendingOrderId);
                console.log('Order details:', orderDetails);
                console.log('User data:', parsedUser);

                // Store order data with user data on server before redirect
                try {
                    const storeResponse = await fetch('/api/payment/pending-order', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            orderId: pendingOrderId,
                            orderData: orderDetails,
                            userData: parsedUser
                        })
                    });

                    if (!storeResponse.ok) {
                        throw new Error('Failed to store order data');
                    }

                    console.log('Pending order stored with ID:', pendingOrderId);
                } catch (err) {
                    console.error('Error storing pending order:', err);
                    setError('Failed to prepare order. Please try again.');
                    setProcessing(false);
                    return;
                }

                // Redirect to Stripe with order ID in return URL
                result = await stripe.confirmFpxPayment(clientSecret, {
                    payment_method: {
                        fpx: {
                            bank: selectedBank || 'maybank2u'
                        }
                    },
                    return_url: `${window.location.origin}/payment/success?orderId=${pendingOrderId}`
                });
                // Note: This code won't execute for FPX because user is redirected
            }
        } catch (err: any) {
            setError(err.message);
            setProcessing(false);
        }
    };

    const createOrderAfterPayment = async () => {
        try {
            const user = localStorage.getItem('user');
            if (!user) {
                alert('Please login first');
                router.push('/login');
                return;
            }

            const userData = JSON.parse(user);

            const cartItems = orderDetails.cart.map((item: any) => ({
                productId: item.productId,
                quantity: item.quantity,
                price: item.price
            }));

            const { createOrder } = await import('@/app/actions/orderActions');
            const result = await createOrder(
                userData.userId,
                cartItems,
                orderDetails.note || undefined,
                orderDetails.option,
                orderDetails.paymentMethod
            );

            if (result.success) {
                // Clear cart and pending order
                localStorage.removeItem('cart');
                localStorage.removeItem('pendingOrder');
                onSuccess();
            } else {
                setError('Failed to create order');
                setProcessing(false);
            }
        } catch (error) {
            console.error('Order creation failed:', error);
            setError('Failed to create order. Please contact support.');
            setProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {orderDetails.paymentMethod === 'CARD' ? (
                <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                        Card Details
                    </label>
                    <div className="p-4 border border-gray-200 dark:border-white/10 rounded-xl bg-white dark:bg-[#1a1816]">
                        <CardElement
                            options={{
                                style: {
                                    base: {
                                        fontSize: '16px',
                                        color: isDarkMode ? '#ffffff' : '#3e3a36',
                                        '::placeholder': {
                                            color: isDarkMode ? '#6b7280' : '#aab7c4',
                                        },
                                    },
                                    invalid: {
                                        color: '#ef4444',
                                    },
                                },
                            }}
                        />
                    </div>
                </div>
            ) : (
                <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                        Select Bank
                    </label>
                    <select
                        value={selectedBank}
                        onChange={(e) => setSelectedBank(e.target.value)}
                        className="w-full p-4 border border-gray-200 dark:border-white/10 rounded-xl bg-white dark:bg-[#1a1816] text-[#3e3a36] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#c8a47e]"
                        required
                    >
                        <option value="" className="bg-white dark:bg-[#1a1816]">Choose a bank</option>
                        <option value="maybank2u" className="bg-white dark:bg-[#1a1816]">Maybank2U</option>
                        <option value="cimb" className="bg-white dark:bg-[#1a1816]">CIMB Clicks</option>
                        <option value="public_bank" className="bg-white dark:bg-[#1a1816]">Public Bank</option>
                        <option value="rhb" className="bg-white dark:bg-[#1a1816]">RHB Bank</option>
                        <option value="hong_leong_bank" className="bg-white dark:bg-[#1a1816]">Hong Leong Bank</option>
                        <option value="ambank" className="bg-white dark:bg-[#1a1816]">AmBank</option>
                        <option value="affin_bank" className="bg-white dark:bg-[#1a1816]">Affin Bank</option>
                        <option value="alliance_bank" className="bg-white dark:bg-[#1a1816]">Alliance Bank</option>
                        <option value="bank_islam" className="bg-white dark:bg-[#1a1816]">Bank Islam</option>
                        <option value="bank_muamalat" className="bg-white dark:bg-[#1a1816]">Bank Muamalat</option>
                        <option value="bank_rakyat" className="bg-white dark:bg-[#1a1816]">Bank Rakyat</option>
                        <option value="bsn" className="bg-white dark:bg-[#1a1816]">BSN</option>
                        <option value="hsbc" className="bg-white dark:bg-[#1a1816]">HSBC Bank</option>
                        <option value="kfh" className="bg-white dark:bg-[#1a1816]">Kuwait Finance House</option>
                        <option value="ocbc" className="bg-white dark:bg-[#1a1816]">OCBC Bank</option>
                        <option value="standard_chartered" className="bg-white dark:bg-[#1a1816]">Standard Chartered</option>
                        <option value="uob" className="bg-white dark:bg-[#1a1816]">UOB</option>
                    </select>
                </div>
            )}

            {error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm">
                    {error}
                </div>
            )}

            <button
                type="submit"
                disabled={!stripe || processing}
                className="w-full bg-[#3e3a36] dark:bg-white text-white dark:text-[#3e3a36] py-6 rounded-full font-bold text-lg hover:bg-[#2d2a27] dark:hover:bg-gray-100 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                {processing ? (
                    <>
                        <Loader2 className="animate-spin" size={20} />
                        Processing Payment...
                    </>
                ) : (
                    `Pay RM${orderDetails.total.toFixed(2)}`
                )}
            </button>
        </form>
    );
}

export default function PaymentPage() {
    const router = useRouter();
    const [orderDetails, setOrderDetails] = useState<any>(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        // Load pending order from localStorage
        const pending = localStorage.getItem('pendingOrder');
        if (pending) {
            setOrderDetails(JSON.parse(pending));
        } else {
            // No pending order, redirect to menu
            router.push('/menu');
        }
    }, [router]);

    const handleSuccess = () => {
        setSuccess(true);
        // Redirect to order history after 2 seconds
        setTimeout(() => {
            router.push('/history');
        }, 2000);
    };

    if (!orderDetails) {
        return null;
    }

    if (success) {
        return (
            <div className="min-h-screen bg-[#f9f7f2] dark:bg-[#1a1816] flex items-center justify-center p-8">
                <div className="bg-white dark:bg-[#2d2a27] rounded-2xl p-12 text-center max-w-md shadow-xl">
                    <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle size={40} className="text-green-600 dark:text-green-400" />
                    </div>
                    <h1 className="text-3xl font-black mb-4 text-[#3e3a36] dark:text-white">Payment Successful!</h1>
                    <p className="text-gray-600 dark:text-gray-300 mb-2">Your order has been placed successfully.</p>
                    <p className="text-sm text-gray-500">Redirecting to order history...</p>
                </div>
            </div>
        );
    }

    return (
        <Elements stripe={stripePromise}>
            <div className="min-h-screen bg-[#f9f7f2] dark:bg-[#1a1816] flex items-center justify-center p-8">
                <div className="bg-white dark:bg-[#2d2a27] rounded-2xl p-8 max-w-md w-full shadow-xl">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-[#c8a47e]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CreditCard size={32} className="text-[#c8a47e]" />
                        </div>
                        <h1 className="text-2xl font-black mb-2 text-[#3e3a36] dark:text-white">Complete Payment</h1>
                        <p className="text-gray-500 dark:text-gray-400">
                            {orderDetails.paymentMethod === 'CARD' ? 'Credit/Debit Card' : 'FPX Online Banking'}
                        </p>
                        <p className="text-lg font-bold mt-2">Total: RM{orderDetails.total.toFixed(2)}</p>
                    </div>

                    <PaymentForm orderDetails={orderDetails} onSuccess={handleSuccess} />

                    <button
                        onClick={() => router.back()}
                        className="w-full mt-4 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </Elements>);
}
