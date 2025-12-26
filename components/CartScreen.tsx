
import React from 'react';
import { CartItem } from '../types';
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag } from 'lucide-react';

interface CartProps {
  cart: CartItem[];
  onUpdateQty: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
}

const CartScreen: React.FC<CartProps> = ({ cart, onUpdateQty, onRemove }) => {
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 500 ? 0 : 25;

  return (
    <div className="pb-32 min-h-screen">
      <header className="px-6 pt-12 pb-6 sticky top-0 bg-white/80 dark:bg-black/80 backdrop-blur-md z-10 transition-colors">
        <h1 className="serif text-3xl font-light tracking-tight dark:text-white">Shopping Bag</h1>
      </header>

      {cart.length === 0 ? (
        <div className="flex flex-col items-center justify-center pt-24 px-6 text-center">
          <div className="w-24 h-24 bg-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center mb-6">
            <ShoppingBag size={40} className="text-gray-200 dark:text-white/10" />
          </div>
          <h2 className="text-xl font-medium mb-2 dark:text-white">Your bag is empty</h2>
          <p className="text-gray-400 text-sm max-w-xs mb-8">Items you add to your bag will show up here.</p>
          <button className="bg-black dark:bg-white text-white dark:text-black px-8 py-4 rounded-full font-medium w-full max-w-xs transition-opacity hover:opacity-90">
            Start Exploring
          </button>
        </div>
      ) : (
        <div className="px-6 space-y-6">
          <div className="space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="bg-white dark:bg-[#181818] p-4 rounded-3xl shadow-sm border border-gray-50 dark:border-white/5 flex gap-4 transition-colors">
                <div className="w-24 h-28 bg-[#f9f9f9] dark:bg-white/5 rounded-2xl overflow-hidden flex items-center justify-center p-2">
                  <img src={item.image} className="h-full object-contain mix-blend-multiply dark:mix-blend-normal" />
                </div>
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <div className="flex justify-between items-start">
                      <h3 className="text-sm font-semibold pr-4 dark:text-white">{item.name}</h3>
                      <button onClick={() => onRemove(item.id)} className="text-gray-300 hover:text-red-500 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Size {item.size}</p>
                  </div>
                  
                  <div className="flex justify-between items-end">
                    <span className="text-sm font-light dark:text-gray-300">${item.price}</span>
                    <div className="flex items-center gap-4 bg-gray-50 dark:bg-white/5 rounded-full px-3 py-1.5">
                      <button onClick={() => onUpdateQty(item.id, -1)} className="text-gray-400 hover:text-black dark:hover:text-white">
                        <Minus size={14} />
                      </button>
                      <span className="text-xs font-bold w-4 text-center dark:text-white">{item.quantity}</span>
                      <button onClick={() => onUpdateQty(item.id, 1)} className="text-gray-400 hover:text-black dark:hover:text-white">
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Checkout Card */}
          <div className="bg-black dark:bg-white text-white dark:text-black p-8 rounded-[40px] space-y-6 shadow-xl shadow-black/10 transition-colors">
            <div className="space-y-4">
              <div className="flex justify-between text-sm opacity-60">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm opacity-60">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'Complimentary' : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="h-px bg-white/10 dark:bg-black/10 w-full" />
              <div className="flex justify-between text-xl font-light">
                <span>Total</span>
                <span>${((subtotal + shipping).toFixed(2))}</span>
              </div>
            </div>
            <button className="w-full bg-white dark:bg-black text-black dark:text-white py-4 rounded-full font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all active:scale-95">
              Proceed to Checkout
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartScreen;
