import { PrismaClient, Prisma } from "@prisma/client";
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import bcrypt from 'bcryptjs';
import 'dotenv/config';

// 1. Setup Prisma 7 Adapter
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🔄 Cleaning database...");
  // Order of deletion is critical to avoid Foreign Key errors
  await prisma.orderList.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  console.log("👤 Seeding Users...");
  const hashedPassword1 = await bcrypt.hash("securepassword123", 10);
  const hashedPassword2 = await bcrypt.hash("securepassword456", 10);

  await prisma.user.createMany({
    data: [
      {
        userId: "U0001",
        username: "AliceAdmin",
        email: "alice@prisma.io",
        role: "ADMIN",
        password: hashedPassword1,
      },
      {
        userId: "U0002",
        username: "BobCustomer",
        email: "bob@prisma.io",
        role: "CUSTOMER",
        password: hashedPassword2,
      },
    ],
  });

  console.log("📂 Seeding Categories...");
  await prisma.category.createMany({
    data: [
      { categoryId: "C0001", name: "Main Course", isActive: true },
      { categoryId: "C0002", name: "Beverages", isActive: true },
      { categoryId: "C0003", name: "Desserts", isActive: true },
    ]
  });

  console.log("🍔 Seeding Products...");
  await prisma.product.createMany({
    data: [
      {
        productId: "P0001",
        name: "Wagyu Beef Burger",
        price: new Prisma.Decimal(18.50),
        stock: 100,
        categoryId: "C0001"
      },
      {
        productId: "P0002",
        name: "Iced Americano",
        price: new Prisma.Decimal(4.50),
        stock: 200,
        categoryId: "C0002"
      },
      {
        productId: "P0003",
        name: "Chocolate Lava Cake",
        price: new Prisma.Decimal(8.00),
        stock: 50,
        categoryId: "C0003"
      },
    ]
  });

  console.log("📋 Seeding Test Order for Bob...");
  await prisma.order.create({
    data: {
      orderId: "O0001",
      userId: "U0002", // Linked to BobCustomer
      status: "PREPARING",
      total: 18.50,
      option: "Dine-in",
      orderLists: {
        create: {
          productId: "P0001",
          quantity: 1,
          subtotal: 18.50,
        },
      },
      payments: {
        create: {
          paymentId: "Y0001",
          method: "CARD",
        },
      },
    },
  });

  console.log("✅ Seeding finished successfully.");
}

// 2. Execute main and handle the process lifecycle
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Seed Error:", e);
    await prisma.$disconnect();
    process.exit(1);
  });