import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function PUT(request: NextRequest) {
  try {
    const { userId, username, email, avatar, password } = await request.json();

    // Validate input
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { userId },
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Update user
    const updateData: any = {
      ...(username && { username }),
      ...(email && { email }),
      ...(avatar !== undefined && { photo: avatar }), // Store avatar in photo field
    };

    // Hash password if provided
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    const updatedUser = await prisma.user.update({
      where: { userId },
      data: updateData,
    });

    // Return updated user data (excluding password)
    const { password: _, ...userWithoutPassword } = updatedUser;

    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
    });
  } catch (error: any) {
    console.error('Update user error:', error);
    
    // Handle unique constraint violation (duplicate email)
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'An error occurred while updating user' },
      { status: 500 }
    );
  }
}
