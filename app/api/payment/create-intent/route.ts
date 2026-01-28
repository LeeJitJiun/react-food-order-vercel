import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-08-27.basil',
});

export async function POST(request: NextRequest) {
    try {
        const { amount, paymentMethod } = await request.json();

        if (paymentMethod === 'CARD') {
            // Create Stripe PaymentIntent for card payment
            const paymentIntent = await stripe.paymentIntents.create({
                amount: Math.round(amount * 100), // Convert to cents
                currency: 'myr',
                automatic_payment_methods: {
                    enabled: true,
                    allow_redirects: 'never'
                },
            });

            return NextResponse.json({
                success: true,
                clientSecret: paymentIntent.client_secret,
            });
        } else if (paymentMethod === 'FPX') {
            // Create Stripe PaymentIntent for FPX
            const paymentIntent = await stripe.paymentIntents.create({
                amount: Math.round(amount * 100), // Convert to cents
                currency: 'myr',
                payment_method_types: ['fpx'],
            });

            return NextResponse.json({
                success: true,
                clientSecret: paymentIntent.client_secret,
            });
        }

        return NextResponse.json(
            { success: false, error: 'Invalid payment method' },
            { status: 400 }
        );
    } catch (error: any) {
        console.error('Stripe error:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
