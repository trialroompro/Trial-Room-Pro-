
import React, { useState, useEffect } from 'react';
import { Compass, Sparkles, ShoppingCart, User, Package } from 'lucide-react';
import ExploreScreen from './components/ExploreScreen';
import AIScreen from './components/AIScreen';
import OrdersScreen from './components/OrdersScreen';
import CartScreen from './components/CartScreen';
import AccountScreen from './components/AccountScreen';
import { TabType, CartItem, Product } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('Explore');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [userPhoto, setUserPhoto] = useState<string | null>(null);

  // Sync dark mode class with document element for Tailwind 'class' strategy
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleAddToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) {
        return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...product, quantity: 1, size: 'M' }];
    });
    setActiveTab('Cart');
  };

  const handleUpdateQty = (id: string, delta: number) => {
    setCart(prev => prev.map(i => {
      if (i.id === id) {
        const nextQty = Math.max(1, i.quantity + delta);
        return { ...i, quantity: nextQty };
      }
      return i;
    }));
  };

  const handleRemove = (id: string) => {
    setCart(prev => prev.filter(i => i.id !== id));
  };

  const renderScreen = () => {
    switch (activeTab) {
      case 'Explore': return <ExploreScreen onAddToCart={handleAddToCart} userPhoto={userPhoto} />;
      case 'AI': return <AIScreen onAddToCart={handleAddToCart} />;
      case 'Orders': return <OrdersScreen />;
      case 'Cart': return <CartScreen cart={cart} onUpdateQty={handleUpdateQty} onRemove={handleRemove} />;
      case 'Account': return (
        <AccountScreen 
          isDarkMode={isDarkMode} 
          onToggleDarkMode={() => setIsDarkMode(!isDarkMode)} 
          userPhoto={userPhoto}
          onUploadPhoto={setUserPhoto}
        />
      );
      default: return <ExploreScreen onAddToCart={handleAddToCart} userPhoto={userPhoto} />;
    }
  };

  const NavItem = ({ tab, icon: Icon }: { tab: TabType; icon: any }) => {
    const isActive = activeTab === tab;
    return (
      <button 
        onClick={() => setActiveTab(tab)}
        className="flex flex-col items-center justify-center flex-1 relative outline-none focus:outline-none"
      >
        <div className={`p-1.5 rounded-xl transition-all duration-300 ${
          isActive 
            ? (isDarkMode ? 'text-white' : 'text-black') 
            : 'text-gray-400 opacity-60'
        }`}>
          <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
        </div>
        <span className={`text-[10px] mt-1 font-bold uppercase tracking-wider transition-all duration-300 ${
          isActive 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-1'
        } ${isDarkMode ? 'text-white' : 'text-black'}`}>
          {tab === 'AI' ? 'Lumi AI' : tab}
        </span>
        {tab === 'Cart' && cart.length > 0 && (
          <span className={`absolute top-2 right-1/2 translate-x-3 w-4 h-4 text-[8px] font-bold rounded-full border-2 flex items-center justify-center ${
            isDarkMode ? 'bg-white text-black border-black' : 'bg-black text-white border-white'
          }`}>
            {cart.reduce((s, i) => s + i.quantity, 0)}
          </span>
        )}
      </button>
    );
  };

  return (
    <div className="min-h-screen transition-colors duration-500 bg-[#fcfcfc] dark:bg-[#0a0a0a] text-black dark:text-white">
      <div className="max-w-md mx-auto min-h-screen relative overflow-x-hidden shadow-2xl bg-white dark:bg-[#0a0a0a]">
        {/* Content Area */}
        <main className="animate-in fade-in duration-500 min-h-screen pb-24">
          {renderScreen()}
        </main>

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/90 dark:bg-black/90 backdrop-blur-xl border-t border-gray-100 dark:border-white/5 px-6 py-4 flex items-center justify-between shadow-[0_-10px_30px_-10px_rgba(0,0,0,0.05)] z-40 transition-colors duration-500">
          <NavItem tab="Explore" icon={Compass} />
          <NavItem tab="AI" icon={Sparkles} />
          <NavItem tab="Orders" icon={Package} />
          <NavItem tab="Cart" icon={ShoppingCart} />
          <NavItem tab="Account" icon={User} />
        </nav>
      </div>
    </div>
  );
};

export default App;
