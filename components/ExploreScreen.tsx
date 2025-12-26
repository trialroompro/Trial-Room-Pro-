
import React, { useState, useEffect } from 'react';
import { MOCK_PRODUCTS } from '../constants';
import { Product } from '../types';
import { ShoppingBag, Sparkles, User, X, Check } from 'lucide-react';
import { generateFitCheckImage, getPersonalizedRecommendations } from '../services/geminiService';

interface ExploreProps {
  onAddToCart: (p: Product) => void;
  userPhoto: string | null;
}

type Pose = 'Front' | 'Left' | 'Right' | 'Back';
const CATEGORIES = ['All', 'Shirt', 'T-shirt', 'Full-Sleeve T-shirt', 'Hoodie', 'Pant', 'Shoes'];

const ExploreScreen: React.FC<ExploreProps> = ({ onAddToCart, userPhoto }) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [isFitCheck, setIsFitCheck] = useState(false);
  const [fitCheckResult, setFitCheckResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [activePose, setActivePose] = useState<Pose>('Front');
  
  const [activeCategory, setActiveCategory] = useState('All');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [isAiFiltering, setIsAiFiltering] = useState(false);

  useEffect(() => {
    handleFilter(activeCategory);
  }, [activeCategory]);

  const handleFilter = async (category: string) => {
    if (category === 'All') {
      setFilteredProducts(MOCK_PRODUCTS);
      setIsAiFiltering(false);
      return;
    }

    if (userPhoto) {
      setLoading(true);
      setIsAiFiltering(true);
      try {
        const recommendedIds = await getPersonalizedRecommendations(userPhoto, category);
        const recommended = MOCK_PRODUCTS.filter(p => recommendedIds.includes(p.id));
        // Ensure at least some products are shown
        const finalResults = recommended.length > 0 ? recommended : MOCK_PRODUCTS.filter(p => p.category === category);
        setFilteredProducts(finalResults);
      } catch (e) {
        setFilteredProducts(MOCK_PRODUCTS.filter(p => p.category === category));
      } finally {
        setLoading(false);
      }
    } else {
      setFilteredProducts(MOCK_PRODUCTS.filter(p => p.category === category));
      setIsAiFiltering(false);
    }
  };

  const toBase64 = async (url: string): Promise<string> => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result as string;
          resolve(base64String.split(',')[1]);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (e) {
      return "";
    }
  };

  const handleFitCheck = async (product: Product, pose: Pose = 'Front') => {
    setLoading(true);
    setIsFitCheck(true);
    setActivePose(pose);
    
    const base64 = await toBase64(product.image);
    const resultImage = await generateFitCheckImage(product.name, base64, userPhoto, selectedColor || undefined, pose);
    
    setFitCheckResult(resultImage);
    setLoading(false);
  };

  const closeFitCheck = () => {
    setIsFitCheck(false);
    setFitCheckResult(null);
    setActivePose('Front');
  };

  const openProduct = (product: Product) => {
    setSelectedProduct(product);
    setSelectedColor(product.colors?.[0] || null);
  };

  return (
    <div className="pb-24">
      <header className="px-6 pt-12 pb-4 sticky top-0 bg-white/90 dark:bg-black/90 backdrop-blur-md z-30 transition-colors">
        <h1 className="serif text-3xl font-light tracking-tight text-black dark:text-white">Explore</h1>
        <div className="flex items-center gap-2 mt-1">
          <p className="text-gray-400 text-[9px] uppercase tracking-[0.3em] font-bold">Lumiere Collection</p>
          {userPhoto && (
            <div className="flex items-center gap-1 px-2 py-0.5 bg-indigo-500/10 rounded-full border border-indigo-500/10">
              <Sparkles size={8} className="text-indigo-500" />
              <span className="text-[7px] text-indigo-500 font-bold uppercase tracking-widest">AI Stylist Active</span>
            </div>
          )}
        </div>
      </header>

      {/* Category Buttons */}
      <div className="px-6 mb-8 overflow-x-auto no-scrollbar flex gap-2 py-3 sticky top-[106px] bg-white/90 dark:bg-black/90 backdrop-blur-md z-30 border-b border-gray-50 dark:border-white/5">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-5 py-2 rounded-full text-[9px] font-bold uppercase tracking-[0.2em] transition-all whitespace-nowrap border ${
              activeCategory === cat 
              ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white' 
              : 'bg-white text-gray-400 border-gray-100 dark:bg-transparent dark:border-white/10'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading && isAiFiltering ? (
        <div className="px-6 py-32 flex flex-col items-center justify-center text-center gap-6 animate-in fade-in duration-300">
          <div className="relative">
            <div className="w-12 h-12 border-2 border-gray-100 dark:border-white/5 rounded-full" />
            <div className="absolute top-0 left-0 w-12 h-12 border-2 border-black dark:border-white border-t-transparent rounded-full animate-spin" />
          </div>
          <div className="space-y-1">
            <h3 className="text-[10px] font-bold text-black dark:text-white uppercase tracking-widest">Tailoring Your Gallery</h3>
            <p className="text-[9px] text-gray-400 font-light">Lumi is curating the best {activeCategory} options for you.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 px-4 animate-in fade-in duration-500">
          {filteredProducts.map((product) => (
            <div 
              key={product.id} 
              className="group cursor-pointer"
              onClick={() => openProduct(product)}
            >
              <div className="aspect-[3/4] overflow-hidden rounded-2xl bg-white dark:bg-[#0f0f0f] relative transition-all border border-gray-50 dark:border-white/5 group-hover:border-gray-200 dark:group-hover:border-white/20">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal p-6 group-hover:scale-105 transition-transform duration-1000 ease-out"
                />
              </div>
              <div className="mt-4 px-1 text-center space-y-1">
                <p className="text-[8px] font-bold text-gray-400 uppercase tracking-[0.25em]">{product.category}</p>
                <h3 className="text-[11px] font-medium text-gray-800 dark:text-gray-200 truncate tracking-wide">{product.name}</h3>
                <p className="text-[10px] text-gray-400 font-light">${product.price}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Product Detail Modal */}
      {selectedProduct && !isFitCheck && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[50] flex items-end animate-in fade-in duration-300" onClick={() => setSelectedProduct(null)}>
          <div 
            className="bg-white dark:bg-[#0d0d0d] w-full rounded-t-[40px] p-8 pb-12 shadow-2xl animate-in slide-in-from-bottom duration-500 max-w-lg mx-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1 bg-gray-100 dark:bg-white/10 rounded-full mx-auto mb-8" />
            
            <div className="space-y-8">
              <div className="aspect-[4/5] bg-white dark:bg-white/5 rounded-3xl overflow-hidden flex items-center justify-center border border-gray-50 dark:border-white/5">
                 <img src={selectedProduct.image} className="h-full object-contain mix-blend-multiply dark:mix-blend-normal p-12" alt={selectedProduct.name} />
              </div>
              
              <div className="space-y-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{selectedProduct.category}</p>
                    <h2 className="serif text-2xl font-bold text-black dark:text-white leading-tight">{selectedProduct.name}</h2>
                  </div>
                  <div className="text-xl font-light text-black dark:text-white">${selectedProduct.price}</div>
                </div>

                <p className="text-gray-500 dark:text-gray-400 text-xs leading-relaxed font-light">
                  {selectedProduct.description}
                </p>

                <div className="flex flex-col gap-3 pt-2">
                  <button 
                    onClick={() => onAddToCart({ ...selectedProduct, selectedColor: selectedColor || undefined, quantity: 1, size: 'M' })}
                    className="flex items-center justify-center gap-2 bg-black dark:bg-white text-white dark:text-black py-4 rounded-full text-xs font-bold hover:opacity-90 transition-all active:scale-95"
                  >
                    <ShoppingBag size={14} />
                    Add to Bag
                  </button>
                  <button 
                    onClick={() => handleFitCheck(selectedProduct)}
                    className="flex items-center justify-center gap-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 py-4 rounded-full text-xs font-bold hover:opacity-80 transition-all active:scale-95"
                  >
                    <Sparkles size={14} />
                    Virtual Fit Check
                  </button>
                </div>
              </div>
            </div>

            <button 
              className="mt-8 text-center w-full text-gray-300 text-[8px] uppercase tracking-[0.4em] font-bold"
              onClick={() => setSelectedProduct(null)}
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Fit Check View */}
      {isFitCheck && selectedProduct && (
        <div className="fixed inset-0 bg-black/98 backdrop-blur-3xl z-[100] flex flex-col p-6 animate-in fade-in duration-500">
          <div className="flex items-center justify-between mb-8 pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
                <Sparkles size={16} />
              </div>
              <h2 className="serif text-xl text-white tracking-wide">Fit Check</h2>
            </div>
            <button onClick={closeFitCheck} className="p-2 bg-white/5 rounded-full text-white/40 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="flex gap-2 mb-8 overflow-x-auto no-scrollbar py-1">
            {(['Front', 'Left', 'Right', 'Back'] as Pose[]).map((pose) => (
              <button
                key={pose}
                onClick={() => handleFitCheck(selectedProduct, pose)}
                disabled={loading}
                className={`px-6 py-2.5 rounded-full text-[8px] font-bold uppercase tracking-[0.2em] transition-all ${
                  activePose === pose 
                    ? 'bg-white text-black shadow-lg' 
                    : 'bg-white/5 text-white/30 hover:bg-white/10 hover:text-white'
                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {pose}
              </button>
            ))}
          </div>

          <div className="flex-1 relative rounded-[40px] overflow-hidden bg-white/5 border border-white/5 flex items-center justify-center shadow-2xl">
            {loading ? (
              <div className="flex flex-col items-center gap-6 text-center px-8">
                <div className="w-10 h-10 border border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
                <div className="space-y-2">
                  <h3 className="text-white text-sm font-bold uppercase tracking-[0.2em]">{userPhoto ? 'Personalizing' : 'Styling'}</h3>
                  <p className="text-white/30 text-[9px] font-light max-w-[180px] leading-relaxed uppercase tracking-widest">
                    Generating <span className="text-indigo-400">{activePose}</span> Profile...
                  </p>
                </div>
              </div>
            ) : fitCheckResult ? (
              <img src={fitCheckResult} className="w-full h-full object-cover animate-in fade-in duration-1000" alt="Fit Check Result" />
            ) : (
              <div className="text-center px-8 text-white/20 flex flex-col items-center gap-4">
                <X size={32} strokeWidth={1} />
                <p className="text-[10px] uppercase tracking-widest">Generation Failed</p>
              </div>
            )}
          </div>

          <div className="mt-8 flex flex-col gap-6">
            {!loading && fitCheckResult && (
              <div className="bg-white/5 backdrop-blur-md p-5 rounded-3xl border border-white/5 flex items-center justify-between">
                <div>
                  <p className="text-white/30 text-[8px] uppercase font-bold tracking-[0.2em] mb-1">Recommended Look</p>
                  <p className="text-white text-sm font-medium tracking-wide">{selectedProduct.name}</p>
                </div>
                <button 
                  onClick={() => {
                    onAddToCart(selectedProduct);
                    closeFitCheck();
                  }}
                  className="bg-white text-black px-8 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest active:scale-95 transition-all shadow-lg"
                >
                  Buy Now
                </button>
              </div>
            )}
            <p className="text-center text-white/10 text-[7px] uppercase tracking-[0.6em] font-medium pb-4">Lumiere AI Studio • v2.5</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExploreScreen;
