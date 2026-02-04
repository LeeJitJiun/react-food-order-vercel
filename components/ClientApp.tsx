"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ShoppingBasket,
  Leaf,
  Sun,
  Moon,
  Sparkles,
  History,
  User,
  ArrowLeft,
} from "lucide-react";

import { NavButton } from "@/components/ui/NavButton";
import { CheckoutTray } from "@/components/ui/CheckoutTray";
import { OrderStatusModal } from "@/components/ui/OrderStatusModal";
import { HomeView } from "@/app/views/HomeView";
import { ShopView } from "@/app/views/ShopView";
import { HistoryView } from "@/app/views/HistoryView";
import { ProfileView } from "@/app/views/ProfileView";
import { OrderDetailsView } from "@/app/views/OrderDetailsView";
import { EditProfileView } from "@/app/views/EditProfileView";
import LoginView from "@/app/views/LoginView";

interface Product {
  productId: string;
  name: string;
  price: number;
  photo: string | null;
  description: string | null;
  category: {
    categoryId: string;
    name: string;
  };
}

interface Category {
  categoryId: string;
  name: string;
}

interface Order {
  orderId: string;
  date: Date;
  total: number | any;
  status: string;
  note: string | null;
  option: string | null;
  orderLists: {
    product: {
      productId: string;
      name: string;
      price: number | any;
      photo: string | null;
      category: {
        categoryId: string;
        name: string;
      };
    };
    quantity: number;
    subtotal: number | any;
  }[];
  user: {
    username: string;
    email: string;
  };
  payments: {
    method: string;
    paymentDate: Date;
  }[];
}

interface User {
  userId: string;
  username: string;
  email: string;
  role: string;
  avatar?: string | null;
  password?: string;
}

interface ClientAppProps {
  products: Product[];
  categories: Category[];
  orders: Order[];
  user: User | null;
  initialView?:
    | "home"
    | "shop"
    | "history"
    | "profile"
    | "login"
    | "orderDetails";
  selectedOrderId?: string;
}

interface CartItem {
  productId: string;
  name: string;
  price: number;
  photo: string | null;
  description: string | null;
  quantity: number;
  category: {
    categoryId: string;
    name: string;
  };
}

export const handleLogin = async (email: string, password: string) => {
  try {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error("Login failed");
    }

    const data = await response.json();
    console.log("Login successful:", data);
    return data;
  } catch (error) {
    console.error("Error during login:", error);
    throw error;
  }
};

export default function ClientApp({
  products,
  categories,
  orders,
  user,
  initialView,
  selectedOrderId,
}: ClientAppProps) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(!!user);
  const [currentUser, setCurrentUser] = useState<User | null>(user);
  const [view, setView] = useState<
    "home" | "shop" | "history" | "profile" | "login" | "orderDetails"
  >(initialView || "login");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "ordering" | "complete">(
    "idle",
  );
  // Initialize dark mode from localStorage immediately to prevent flash
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("darkMode");
      return saved ? JSON.parse(saved) : false;
    }
    return false;
  });
  const [mounted, setMounted] = useState(false);
  const [clientOrders, setClientOrders] = useState(orders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Initialize selected order from prop
  useEffect(() => {
    if (selectedOrderId && orders.length > 0) {
      const order = orders.find((o) => o.orderId === selectedOrderId);
      if (order) {
        setSelectedOrder(order);
      }
    }
  }, [selectedOrderId, orders]);

  // Check authentication on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      // Map photo field to avatar for consistency
      const userWithAvatar = {
        ...parsedUser,
        avatar: parsedUser.photo || parsedUser.avatar,
      };
      setCurrentUser(userWithAvatar);
      setIsAuthenticated(true);
    }

    // Set initial view - allow guests to see home page
    if (initialView) {
      setView(initialView);
    } else {
      setView("home");
    }
  }, [initialView]);

  // Load dark mode preference on mount
  useEffect(() => {
    setMounted(true);

    // Dark mode is now initialized in useState, no need to load again
    // Just apply the class immediately if needed
    if (darkMode) {
      document.documentElement.classList.add("dark");
    }

    // Load cart from localStorage
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        if (Array.isArray(parsedCart) && parsedCart.length > 0) {
          setCart(parsedCart);
        }
      } catch (error) {
        console.error("Failed to load cart from localStorage:", error);
      }
    }
  }, []);

  // Scroll to top whenever view changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [view]);

  // Handle dark mode class on body and persist preference
  useEffect(() => {
    if (!mounted) return;

    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode, mounted]);

  // Sync cart to localStorage whenever it changes
  useEffect(() => {
    if (mounted) {
      if (cart.length > 0) {
        localStorage.setItem("cart", JSON.stringify(cart));
      } else {
        // Clear cart from localStorage when empty
        localStorage.removeItem("cart");
      }
    }
  }, [cart, mounted]);

  const addToCart = (product: Product) => {
    // Require authentication to add to cart
    if (!currentUser) {
      router.push("/auth-required");
      return;
    }

    setCart((prev) => {
      const exists = prev.find((i) => i.productId === product.productId);
      if (exists) {
        return prev.map((i) =>
          i.productId === product.productId
            ? { ...i, quantity: i.quantity + 1 }
            : i,
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQty = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.productId === id
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item,
        )
        .filter((i) => i.quantity > 0),
    );
  };

  const placeOrder = async () => {
    // Require authentication to place order
    if (!currentUser) {
      router.push("/auth-required");
      return;
    }

    // Save cart to localStorage and redirect to checkout
    localStorage.setItem("cart", JSON.stringify(cart));
    router.push("/checkout");
  };

  const handleViewOrderDetails = (orderId: string) => {
    router.push(`/history/details?id=${orderId}`);
  };

  const handleLogout = async () => {
    // Clear localStorage
    localStorage.removeItem("user");
    localStorage.removeItem("cart");

    // Call logout API to clear cookies
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });
    } catch (error) {
      console.error("Logout error:", error);
    }

    // Redirect to home page (guest mode)
    window.location.href = "/";
  };

  const featuredProducts = products.slice(0, 4);

  // Show login view if not authenticated
  if (!isAuthenticated && view === "login") {
    return <LoginView />;
  }

  return (
    <div className="min-h-screen bg-[#f9f7f2] dark:bg-[#1a1816] text-[#3e3a36] dark:text-white/90 font-serif selection:bg-[#d4c8b8] transition-colors duration-500">
      {/* --- Float Navigation (Desktop) --- */}
      <nav className="hidden md:flex fixed left-4 lg:left-6 top-1/2 -translate-y-1/2 z-40 bg-white/80 dark:bg-[#2d2a27]/80 backdrop-blur-xl border border-white dark:border-white/5 p-2 lg:p-3 rounded-full shadow-2xl flex-col gap-3 lg:gap-4">
        <NavButton
          icon={Leaf}
          active={view === "home" || view === "shop"}
          onClick={() => router.push("/")}
        />
        <NavButton
          icon={History}
          active={view === "history" || view === "orderDetails"}
          onClick={() => router.push("/history")}
        />
        <NavButton
          icon={User}
          active={view === "profile"}
          onClick={() => router.push("/profile")}
        />
        <div className="h-px w-8 bg-gray-200 dark:bg-white/10 mx-auto" />
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="w-12 h-12 rounded-full flex items-center justify-center text-gray-400 hover:text-[#c8a47e] transition-colors"
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <div className="h-px w-8 bg-gray-200 dark:bg-white/10 mx-auto" />
        <button
          onClick={() => setIsCheckoutOpen(true)}
          className="w-12 h-12 rounded-full bg-[#3e3a36] dark:bg-white text-white dark:text-[#3e3a36] flex items-center justify-center relative hover:scale-110 transition-transform"
        >
          <ShoppingBasket size={20} />
          {cart.length > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#c8a47e] rounded-full text-[10px] font-bold flex items-center justify-center border-2 border-white dark:border-[#2d2a27]">
              {cart.reduce((a, b) => a + b.quantity, 0)}
            </span>
          )}
        </button>
      </nav>

      {/* --- Mobile Bottom Navigation --- */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#2d2a27]/95 backdrop-blur-xl border-t border-gray-200 dark:border-white/5 px-4 py-3 shadow-2xl">
        <div className="flex justify-around items-center max-w-lg mx-auto">
          <NavButton
            icon={Leaf}
            active={view === "home" || view === "shop"}
            onClick={() => router.push("/")}
          />
          <NavButton
            icon={History}
            active={view === "history" || view === "orderDetails"}
            onClick={() => router.push("/history")}
          />
          <button
            onClick={() => setIsCheckoutOpen(true)}
            className="w-14 h-14 rounded-full bg-[#3e3a36] dark:bg-white text-white dark:text-[#3e3a36] flex items-center justify-center relative hover:scale-110 transition-transform -mt-8 shadow-xl"
          >
            <ShoppingBasket size={22} />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#c8a47e] rounded-full text-[10px] font-bold flex items-center justify-center border-2 border-white dark:border-[#2d2a27]">
                {cart.reduce((a, b) => a + b.quantity, 0)}
              </span>
            )}
          </button>
          <NavButton
            icon={User}
            active={view === "profile"}
            onClick={() => router.push("/profile")}
          />
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="w-12 h-12 rounded-full flex items-center justify-center text-gray-400 hover:text-[#c8a47e] transition-colors"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </nav>

      {/* --- Main Viewport --- */}
      <main className="min-h-screen md:ml-20 lg:ml-28 px-4 sm:px-6 lg:px-10 py-6 lg:py-10 pb-24 md:pb-10">
        <div className="max-w-7xl mx-auto w-full">
          {/* Persistent Branding */}
          <div className="flex justify-between items-center mb-6 lg:mb-10">
            <button
              onClick={() => router.push("/")}
              className="flex items-center gap-2 lg:gap-3 group"
            >
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-[#3e3a36] dark:bg-white text-white dark:text-[#3e3a36] rounded-xl flex items-center justify-center group-hover:rotate-45 transition-transform">
                <Sparkles size={16} className="lg:w-[18px] lg:h-[18px]" />
              </div>
              <span className="text-lg lg:text-xl font-black italic tracking-tighter dark:text-white">
                Oasis
              </span>
            </button>

            {(view === "shop" ||
              view === "history" ||
              view === "profile" ||
              view === "orderDetails") && (
              <button
                onClick={() =>
                  router.push(view === "orderDetails" ? "/history" : "/")
                }
                className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-[#3e3a36] dark:hover:text-white transition-colors"
              >
                <ArrowLeft size={16} /> Back to{" "}
                {view === "orderDetails" ? "History" : "Sanctuary"}
              </button>
            )}
          </div>

          {view === "home" ? (
            <HomeView
              featuredProducts={featuredProducts}
              onNavigateToShop={() => router.push("/menu")}
              darkMode={darkMode}
              isGuest={!currentUser}
            />
          ) : view === "shop" ? (
            <ShopView
              products={products}
              categories={categories}
              onAddToCart={addToCart}
              darkMode={darkMode}
            />
          ) : view === "history" ? (
            <HistoryView
              orders={clientOrders}
              onNavigateToShop={() => router.push("/menu")}
              onViewOrderDetails={handleViewOrderDetails}
            />
          ) : view === "orderDetails" ? (
            <OrderDetailsView
              order={selectedOrder}
              onBack={() => router.push("/history")}
            />
          ) : view === "profile" ? (
            <ProfileView
              user={currentUser}
              ordersCount={clientOrders.length}
              onLogout={handleLogout}
              onEditProfile={() => setIsEditingProfile(true)}
            />
          ) : (
            <LoginView />
          )}
        </div>
      </main>

      {/* --- Edit Profile Modal --- */}
      {isEditingProfile && currentUser && (
        <EditProfileView
          user={currentUser}
          onClose={() => setIsEditingProfile(false)}
          onSave={async (updatedUser) => {
            if (!currentUser) return;

            try {
              // Call API to update user in database
              const response = await fetch("/api/user/update", {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  userId: currentUser.userId,
                  username: updatedUser.username,
                  email: updatedUser.email,
                  avatar: updatedUser.avatar,
                  ...(updatedUser.password && {
                    password: updatedUser.password,
                  }),
                }),
              });

              if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Failed to update profile");
              }

              const data = await response.json();

              // Merge the updated fields with existing user data
              const updatedUserData = {
                ...currentUser,
                ...updatedUser,
                photo: data.user.photo, // Store from DB
                avatar: data.user.photo, // Use photo from database as avatar
              };

              // Update local state
              setCurrentUser(updatedUserData);

              // Update localStorage
              localStorage.setItem("user", JSON.stringify(updatedUserData));

              // Close the modal
              setIsEditingProfile(false);
            } catch (error: any) {
              console.error("Failed to update profile:", error);
              alert("Failed to update profile: " + error.message);
            }
          }}
        />
      )}

      {/* --- Sliding Tray Checkout --- */}
      <CheckoutTray
        isOpen={isCheckoutOpen}
        cart={cart}
        onClose={() => setIsCheckoutOpen(false)}
        onUpdateQty={updateQty}
        onPlaceOrder={placeOrder}
      />

      {/* --- Overlay States --- */}
      <OrderStatusModal status={status} onClose={() => setStatus("idle")} />
    </div>
  );
}
