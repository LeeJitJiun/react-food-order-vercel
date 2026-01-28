import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// 1. DELETE a product
export async function DELETE(req: Request) {
  try {
    const { productId } = await req.json();
    await prisma.product.delete({ where: { productId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}

// Helper function to generate a proper 5-char ID (e.g., P0001, P0002)
async function generateProductId(): Promise<string> {
  const lastProduct = await prisma.product.findFirst({
    orderBy: { productId: 'desc' },
    select: { productId: true }
  });
  
  if (lastProduct) {
    const lastNum = parseInt(lastProduct.productId.slice(1), 10);
    return `P${String(lastNum + 1).padStart(4, '0')}`;
  }
  return 'P0001';
}

// 2. CREATE (Add) a product
export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Validate price is non-negative
    const price = Number(body.price);
    if (price < 0) {
      return NextResponse.json(
        { error: 'Price cannot be negative' },
        { status: 400 }
      );
    }

    // Validate categoryId is provided
    if (!body.categoryId) {
      return NextResponse.json(
        { error: 'Category is required' },
        { status: 400 }
      );
    }

    // Generate proper 5-character productId
    const newProductId = await generateProductId();

    const newProduct = await prisma.product.create({
      data: {
        productId: newProductId,
        name: body.name,
        price: price,
        stock: Number(body.stock),
        categoryId: body.categoryId
      }
    });

    return NextResponse.json(newProduct);

  } catch (error) {
    console.error("Create error:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}

// 3. UPDATE (Edit) a product
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    
    // Validate price is non-negative
    const price = Number(body.price);
    if (price < 0) {
      return NextResponse.json(
        { error: 'Price cannot be negative' },
        { status: 400 }
      );
    }

    const updateData: any = {
      name: body.name,
      price: price,
      stock: Number(body.stock),
    };

    // Include categoryId if provided
    if (body.categoryId) {
      updateData.categoryId = body.categoryId;
    }

    const updatedProduct = await prisma.product.update({
      where: { productId: body.productId },
      data: updateData
    });
    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}