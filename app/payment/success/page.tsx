'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, Loader2, XCircle } from 'lucide-react';

export default function PaymentSuccessPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('Verifying your payment...');
    const processingRef = useRef(false);

    useEffect(() => {
        const handlePaymentVerification = async () => {
            const paymentIntentId = searchParams.get('payment_intent');
            const redirectStatus = searchParams.get('redirect_status');
            const pendingOrderId = searchParams.get('orderId');

            // Prevent duplicate processing (React strict mode runs effects twice)
            if (processingRef.current) {
                console.log('Already processing this payment, skipping...');
                return;
            }

            // Check if this payment was already successfully processed
            const alreadyProcessed = sessionStorage.getItem(`payment_processed_${paymentIntentId}`);
            if (alreadyProcessed) {
                console.log('Payment already processed successfully, showing success state...');
                setStatus('success');
                setMessage('Payment successful! Your order has been placed.');
                setTimeout(() => router.push('/history'), 2000);
                return;
            }

            console.log('=== Payment Verification Started ===');
            console.log('Payment Intent:', paymentIntentId);
            console.log('Redirect Status:', redirectStatus);
            console.log('Pending Order ID:', pendingOrderId);

            // Check if payment intent exists
            if (!paymentIntentId) {
                console.error('No payment intent ID found');
                setStatus('error');
                setMessage('Invalid payment session. Please try again.');
                setTimeout(() => router.push('/checkout'), 3000);
                return;
            }

            // Check redirect status immediately (for FPX payments)
            if (redirectStatus === 'failed') {
                console.warn('Payment was not completed - user may have canceled or payment failed at gateway');
                setStatus('error');
                setMessage('Payment was not completed at the payment gateway. Please try again.');
                setTimeout(() => router.push('/checkout'), 5000);
                return;
            }

            try {
                // Mark as processing to prevent duplicate runs
                processingRef.current = true;

                // Step 1: Verify payment status with Stripe
                console.log('Step 1: Verifying payment with Stripe...');
                setMessage('Verifying payment with Stripe...');

                const verifyResponse = await fetch(`/api/payment/verify?payment_intent=${paymentIntentId}`);
                const verifyResult = await verifyResponse.json();

                console.log('Stripe verification result:', verifyResult);

                if (!verifyResult.success) {
                    throw new Error(verifyResult.error || 'Payment verification failed');
                }

                // Check if payment was successful
                if (verifyResult.status !== 'succeeded') {
                    console.error('Payment not successful. Status:', verifyResult.status);
                    setStatus('error');

                    // Provide specific error messages based on payment status
                    let errorMessage = 'Payment failed. Please try again.';
                    if (verifyResult.status === 'requires_payment_method') {
                        errorMessage = 'Payment was not completed. Please return to checkout and try again.';
                    } else if (verifyResult.status === 'canceled') {
                        errorMessage = 'Payment was canceled. Please try again.';
                    } else if (verifyResult.status === 'requires_action') {
                        errorMessage = 'Payment requires additional authentication. Please try again.';
                    } else if (verifyResult.status === 'processing') {
                        errorMessage = 'Payment is still processing. Please wait a moment and refresh the page.';
                    }

                    setMessage(errorMessage);
                    setTimeout(() => router.push('/checkout'), 5000);
                    return;
                }

                console.log('✓ Payment verified as successful');

                // Step 2: Retrieve order data
                console.log('Step 2: Retrieving order data...');
                setMessage('Payment verified! Creating your order...');

                let orderData = null;
                let userData = null;

                // Try to get from server first (for FPX payments)
                if (pendingOrderId) {
                    console.log('Retrieving from server with orderId:', pendingOrderId);
                    const orderResponse = await fetch(`/api/payment/pending-order?orderId=${pendingOrderId}`);
                    const orderResult = await orderResponse.json();

                    if (orderResult.success) {
                        console.log('✓ Order and user data retrieved from server');
                        orderData = orderResult.orderData;
                        userData = orderResult.userData;
                    } else {
                        console.warn('Server retrieval failed:', orderResult.error);
                    }
                }

                // Fallback to storage (for CARD payments or if server retrieval failed)
                if (!orderData || !userData) {
                    console.log('Trying to retrieve from browser storage...');
                    const storedOrder = localStorage.getItem('pendingOrder') || sessionStorage.getItem('pendingOrder');
                    const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user');

                    if (storedOrder) {
                        orderData = JSON.parse(storedOrder);
                        console.log('✓ Order data retrieved from storage');
                    }
                    if (storedUser) {
                        userData = JSON.parse(storedUser);
                        console.log('✓ User data retrieved from storage');
                    }
                }

                // Validate we have all required data
                console.log('=== Data validation ===');
                console.log('Order data exists:', !!orderData);
                console.log('User data exists:', !!userData);

                if (orderData) {
                    console.log('Order data keys:', Object.keys(orderData));
                    console.log('Cart:', orderData.cart);
                    console.log('Payment method:', orderData.paymentMethod);
                    console.log('Option:', orderData.option);
                }

                if (userData) {
                    console.log('User data keys:', Object.keys(userData));
                    console.log('User ID:', userData.userId);
                }

                if (!orderData || !userData) {
                    console.error('Missing required data');
                    throw new Error('Order information not found. Payment was successful but order could not be created. Please contact support with payment intent: ' + paymentIntentId);
                }

                if (!userData.userId) {
                    console.error('User ID is missing from user data');
                    throw new Error('User information is incomplete. Please contact support with payment intent: ' + paymentIntentId);
                }

                if (!orderData.cart || orderData.cart.length === 0) {
                    console.error('Cart is empty or missing');
                    throw new Error('Cart information is missing. Please contact support with payment intent: ' + paymentIntentId);
                }

                // Step 3: Create order in database
                console.log('Step 3: Creating order in database...');
                console.log('User ID:', userData.userId);
                console.log('Cart items:', orderData.cart?.length);

                const cartItems = orderData.cart.map((item: any) => ({
                    productId: item.productId,
                    quantity: item.quantity,
                    price: item.price
                }));

                const { createOrder } = await import('@/app/actions/orderActions');
                const createResult = await createOrder(
                    userData.userId,
                    cartItems,
                    orderData.note || undefined,
                    orderData.option || 'Dine-in',
                    orderData.paymentMethod || 'CARD'
                );

                console.log('Order creation result:', createResult);

                if (createResult.success) {
                    console.log('✓ Order created successfully:', createResult.order?.orderId);

                    // Clear pending order from server
                    if (pendingOrderId) {
                        await fetch(`/api/payment/pending-order?orderId=${pendingOrderId}`, {
                            method: 'DELETE'
                        });
                    }

                    // Clear all temporary data
                    localStorage.removeItem('cart');
                    localStorage.removeItem('pendingOrder');
                    sessionStorage.removeItem('pendingOrder');
                    sessionStorage.removeItem('user');

                    // Mark this payment as successfully processed
                    sessionStorage.setItem(`payment_processed_${paymentIntentId}`, 'true');

                    setStatus('success');
                    setMessage('Payment successful! Your order has been placed.');

                    // Redirect to order history
                    setTimeout(() => {
                        router.push('/history');
                    }, 2000);
                } else {
                    throw new Error(createResult.error || 'Failed to create order');
                }

            } catch (error: any) {
                console.error('=== Error during payment processing ===');
                console.error(error);
                setStatus('error');
                setMessage(error.message || 'An error occurred while processing your order. Please contact support.');
            }
        };

        handlePaymentVerification();
    }, [searchParams, router]);

    return (
        <div className="min-h-screen bg-[#f9f7f2] dark:bg-[#1a1816] flex items-center justify-center p-8">
            <div className="bg-white dark:bg-[#2d2a27] rounded-2xl p-12 text-center max-w-md shadow-xl">
                {status === 'loading' && (
                    <>
                        <div className="w-20 h-20 bg-[#c8a47e]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Loader2 size={40} className="text-[#c8a47e] animate-spin" />
                        </div>
                        <h1 className="text-3xl font-black mb-4 text-[#3e3a36] dark:text-white">Processing Payment</h1>
                        <p className="text-gray-600 dark:text-gray-300">{message}</p>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle size={40} className="text-green-600 dark:text-green-400" />
                        </div>
                        <h1 className="text-3xl font-black mb-4 text-[#3e3a36] dark:text-white">Payment Successful!</h1>
                        <p className="text-gray-600 dark:text-gray-300 mb-2">{message}</p>
                        <p className="text-sm text-gray-500">Redirecting to order history...</p>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                            <XCircle size={40} className="text-red-600 dark:text-red-400" />
                        </div>
                        <h1 className="text-3xl font-black mb-4 text-[#3e3a36] dark:text-white">Payment Failed</h1>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">{message}</p>
                        <button
                            onClick={() => router.push('/checkout')}
                            className="bg-[#3e3a36] dark:bg-white text-white dark:text-[#3e3a36] px-6 py-3 rounded-full font-bold hover:bg-[#2d2a27] dark:hover:bg-gray-100 transition-all"
                        >
                            Try Again
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
