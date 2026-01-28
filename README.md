# 🌿 Oasis - Botanical Food Ordering System

A beautifully designed food ordering application with a nature-inspired botanical aesthetic, built with Next.js 16, React 19, Prisma 7, and PostgreSQL.

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![React](https://img.shields.io/badge/React-19-blue)
![Prisma](https://img.shields.io/badge/Prisma-7-2D3748)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-4-38B2AC)

## ✨ Features

- 🎨 **Botanical Design System** - Elegant, nature-inspired UI with warm earth tones
- 🌓 **Dark Mode** - Seamless light/dark theme switching
- 🛒 **Shopping Cart** - Full cart management with quantity controls
- 📦 **Order Management** - Place orders and track history
- 👤 **User Profiles** - View account details and statistics
- 🔍 **Search & Filter** - Find products by name or category
- 📱 **Fully Responsive** - Mobile-first design that works everywhere
- ⚡ **Server Components** - Optimized with Next.js App Router
- 🔒 **Type-Safe** - Full TypeScript integration with Prisma

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd react-food-order
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/foodorder"
   ```

4. **Run database migrations**
   ```bash
   npx prisma migrate dev
   ```

5. **Seed the database (optional)**
   ```bash
   npx tsx prisma/seed.ts
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
react-food-order/
├── app/
│   ├── actions/              # Server actions for DB operations
│   ├── generated/prisma/     # Generated Prisma client
│   ├── globals.css          # Global styles & animations
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Home page (server component)
│
├── components/
│   ├── ui/                  # Reusable UI components
│   │   ├── NavButton.tsx
│   │   ├── ProductCard.tsx
│   │   ├── CartItem.tsx
│   │   ├── ProfileCard.tsx
│   │   ├── CheckoutTray.tsx
│   │   └── OrderStatusModal.tsx
│   │
│   ├── views/               # Page view components
│   │   ├── HomeView.tsx
│   │   ├── ShopView.tsx
│   │   ├── HistoryView.tsx
│   │   └── ProfileView.tsx
│   │
│   └── ClientApp.tsx        # Main client wrapper
│
├── prisma/
│   ├── schema.prisma        # Database schema
│   └── seed.ts              # Database seeding
│
└── Documentation/
    ├── SETUP_GUIDE.md       # Complete setup instructions
    ├── ARCHITECTURE.md      # Technical architecture
    ├── TESTING.md           # Testing procedures
    └── COMPONENT_DIAGRAM.md # Visual diagrams
```

## 🎨 Design Highlights

### Color Palette

- **Primary**: `#3e3a36` (Rich charcoal)
- **Accent**: `#c8a47e` (Warm gold)
- **Background Light**: `#f9f7f2` (Warm off-white)
- **Background Dark**: `#1a1816` (Deep brown-black)

### Typography

- **Font**: Fraunces (serif with elegant italics)
- **Style**: Bold italic headings with dramatic sizing

### Element Types (Category Accents)

- **Earth**: Emerald greens
- **Fire**: Warm reds
- **Water**: Cool blues
- **Air**: Soft purples

## 🔧 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **React**: Version 19
- **Database**: Prisma 7 + PostgreSQL
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React
- **Language**: TypeScript 5
- **Fonts**: Google Fonts (Fraunces)

## 📚 Documentation

Comprehensive guides are available:

- **[SETUP_GUIDE.md](SETUP_GUIDE.md)** - Installation and configuration
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - Technical details and patterns
- **[TESTING.md](TESTING.md)** - Testing checklist and procedures
- **[COMPONENT_DIAGRAM.md](COMPONENT_DIAGRAM.md)** - Visual architecture diagrams
- **[TRANSFORMATION_SUMMARY.md](TRANSFORMATION_SUMMARY.md)** - What was changed

## 🎯 Key Features

### 1. Home View
- Immersive hero section with overlay
- Featured products showcase
- Call-to-action navigation

### 2. Shop View
- Complete product catalog
- Search functionality
- Category filtering
- Add to cart with animations

### 3. Shopping Cart
- Sliding checkout panel
- Quantity controls
- Real-time total calculation
- Tax calculation ($2.40)

### 4. Order Management
- Order placement with loading states
- Success confirmation
- Order history tracking
- Status badges (PREPARING, READY, COMPLETED)

### 5. User Profile
- Account information
- Order statistics
- Action cards for settings

### 6. Dark Mode
- One-click theme toggle
- Smooth color transitions
- Proper contrast maintained

## 🗄️ Database Schema

### Models

- **User** - Customer and admin accounts
- **Product** - Menu items with pricing
- **Category** - Product categorization
- **Order** - Customer orders
- **OrderList** - Order line items
- **Payment** - Payment records

### Enums

- **Role**: CUSTOMER, ADMIN
- **OrderStatus**: PREPARING, READY, COMPLETED
- **PaymentMethod**: STRIPE, CASH

## 🛠️ Available Scripts

```bash
# Development
npm run dev          # Start dev server

# Production
npm run build        # Build for production
npm run start        # Start production server

# Database
npx prisma migrate dev    # Run migrations
npx prisma studio         # Open Prisma Studio
npx tsx prisma/seed.ts    # Seed database

# Code Quality
npm run lint         # Run ESLint
npx tsc --noEmit    # Check TypeScript
```

## 🧪 Testing

Run through the testing checklist in [TESTING.md](TESTING.md)

Quick test:
1. Start dev server
2. Browse products
3. Add items to cart
4. Place order
5. Check order history
6. Toggle dark mode

## 🚧 Future Enhancements

- [ ] User authentication (NextAuth)
- [ ] Payment integration (Stripe)
- [ ] Real-time order updates
- [ ] Admin dashboard
- [ ] Product reviews
- [ ] Email notifications
- [ ] Multi-language support
- [ ] Product recommendations

## 🤝 Contributing

This is a personal project, but feel free to fork and customize!

## 📄 License

Private project - All rights reserved

## 💡 Inspiration

Design inspired by botanical aesthetics and mindful dining experiences.

## 📞 Support

For issues and questions:
1. Check [TESTING.md](TESTING.md) for common problems
2. Review [ARCHITECTURE.md](ARCHITECTURE.md) for technical details
3. Consult [SETUP_GUIDE.md](SETUP_GUIDE.md) for configuration

---

**Built with 🌿 and modern web technologies**

Crafted for a serene, mindful food ordering experience.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
