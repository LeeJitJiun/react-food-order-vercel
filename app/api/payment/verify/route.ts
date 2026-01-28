import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-08-27.basil',
});

export async function GET(request: NextRequest) {
    try {
        const paymentIntentId = request.nextUrl.searchParams.get('payment_intent');

        if (!paymentIntentId) {
            return NextResponse.json(
                { success: false, error: 'Payment intent ID required' },
                { status: 400 }
            );
        }

        // Retrieve the payment intent from Stripe to verify its status
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

        return NextResponse.json({
            success: true,
            status: paymentIntent.status,
            amount: paymentIntent.amount,
            currency: paymentIntent.currency,
            paymentMethod: paymentIntent.payment_method
        });
    } catch (error: any) {
        console.error('Error verifying payment:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
