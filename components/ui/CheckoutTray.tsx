'use client';

import { X, Leaf, ChevronRight } from 'lucide-react';
import { CartItem as CartItemComponent } from './CartItem';

interface CartItemType {
  productId: string;
  name: string;
  price: number;
  photo: string | null;
  quantity: number;
  category: {
    name: string;
  };
}

interface CheckoutTrayProps {
  isOpen: boolean;
  cart: CartItemType[];
  onClose: () => void;
  onUpdateQty: (id: string, delta: number) => void;
  onPlaceOrder: () => void;
}

export function CheckoutTray({
  isOpen,
  cart,
  onClose,
  onUpdateQty,
  onPlaceOrder
}: CheckoutTrayProps) {
  const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const tax = 2.40;

  return (
    <div className={`fixed inset-0 z-50 flex justify-end transition-all duration-700 ${isOpen ? 'visible' : 'invisible'}`}>
      <div
        className={`absolute inset-0 bg-[#3e3a36]/20 dark:bg-black/60 backdrop-blur-sm transition-opacity duration-700 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />

      <div className={`w-full max-w-md bg-white dark:bg-[#1a1816] h-full relative z-10 shadow-[-20px_0_60px_rgba(0,0,0,0.05)] flex flex-col transition-transform duration-700 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-10 flex justify-between items-center">
          <h2 className="text-3xl font-black italic dark:text-white">Your Basket</h2>
          <button onClick={onClose} className="p-3 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors">
            <X size={24} className="dark:text-white" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-10 no-scrollbar">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-300">
              <Leaf size={48} className="mb-4 opacity-20" />
              <p className="font-bold tracking-widest text-sm uppercase">Empty Garden</p>
            </div>
          ) : (
            <div className="space-y-8">
              {cart.map(item => (
                <CartItemComponent
                  key={item.productId}
                  id={item.productId}
                  {...item}
                  onUpdateQty={(delta: number) => onUpdateQty(item.productId, delta)}
                />
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-10 border-t border-gray-100 dark:border-white/5 space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-medium text-gray-400">
                <span>Botanical Tax</span>
                <span>RM{tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-2xl font-black dark:text-white">
                <span>Grand Total</span>
                <span>RM{(total + tax).toFixed(2)}</span>
              </div>
            </div>
            <button
              onClick={onPlaceOrder}
              className="w-full bg-[#3e3a36] dark:bg-white text-white dark:text-[#3e3a36] py-6 rounded-full font-bold text-lg flex items-center justify-center gap-3 hover:bg-[#2d2a27] transition-all hover:gap-6 active:scale-95 group"
            >
              Harvest Order <ChevronRight className="group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

