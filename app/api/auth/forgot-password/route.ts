import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { otpStore } from '@/lib/otpStore';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    // Validate input
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'No account found with this email' },
        { status: 404 }
      );
    }

    // Generate OTP (for demo, always use 123456)
    const otp = '123456';
    
    // Store OTP with 10 minute expiration
    const expiresAt = Date.now() + 10 * 60 * 1000;
    otpStore.set(email, otp, expiresAt);

    // In production, send email with OTP here
    console.log(`OTP for ${email}: ${otp}`);

    return NextResponse.json({
      success: true,
      message: 'OTP sent successfully',
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'An error occurred while processing your request' },
      { status: 500 }
    );
  }
}
