
import React, { useState } from 'react';
import { Search, Sparkles } from 'lucide-react';
import { OCCASIONS, MOCK_PRODUCTS } from '../constants';
import { getFashionAdvice } from '../services/geminiService';

const SearchScreen: React.FC = () => {
  const [query, setQuery] = useState('');
  const [aiAdvice, setAiAdvice] = useState<string | null>(null);
  const [loadingAdvice, setLoadingAdvice] = useState(false);

  const handleOccasionClick = async (occasion: string) => {
    setQuery(occasion);
    setLoadingAdvice(true);
    const advice = await getFashionAdvice(occasion);
    setAiAdvice(advice);
    setLoadingAdvice(false);
  };

  return (
    <div className="pb-24">
      <header className="px-6 pt-12 pb-6">
        <h1 className="serif text-3xl font-light tracking-tight text-black dark:text-white">Search</h1>
      </header>

      <div className="px-6 space-y-8">
        {/* Search Bar */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-black dark:group-focus-within:text-white transition-colors">
            <Search size={20} />
          </div>
          <input 
            type="text" 
            placeholder="Search by occasion, style or purpose"
            className="w-full bg-white dark:bg-white/5 border-none py-4 pl-12 pr-4 rounded-2xl shadow-sm focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10 transition-all outline-none text-sm placeholder:text-gray-300 dark:placeholder:text-gray-600 dark:text-white"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {/* Occasions */}
        <div>
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Popular Occasions</h2>
          <div className="flex flex-wrap gap-2">
            {OCCASIONS.map((occ) => (
              <button 
                key={occ}
                onClick={() => handleOccasionClick(occ)}
                className={`px-5 py-2.5 rounded-full text-sm transition-all border ${
                  query === occ 
                    ? 'bg-black text-white border-black shadow-lg shadow-black/10 dark:bg-white dark:text-black dark:border-white' 
                    : 'bg-white text-gray-600 border-gray-100 hover:border-gray-300 dark:bg-white/5 dark:text-gray-400 dark:border-white/5 dark:hover:border-white/20'
                }`}
              >
                {occ}
              </button>
            ))}
          </div>
        </div>

        {/* AI Insight */}
        {loadingAdvice && (
          <div className="bg-white dark:bg-white/5 p-6 rounded-[32px] shadow-sm animate-pulse border border-gray-50 dark:border-white/5 flex items-center justify-center py-12">
            <div className="text-gray-300 dark:text-gray-600 flex items-center gap-2">
              <Sparkles size={18} className="animate-spin" />
              <span className="text-sm italic">Stylist is thinking...</span>
            </div>
          </div>
        )}

        {aiAdvice && !loadingAdvice && (
          <div className="bg-white dark:bg-[#181818] p-8 rounded-[32px] shadow-sm border border-gray-50 dark:border-white/5 animate-in fade-in slide-in-from-bottom-2 duration-700">
            <div className="flex items-center gap-2 text-black dark:text-white mb-4">
              <Sparkles size={16} />
              <span className="text-xs font-bold uppercase tracking-widest">Stylist Note</span>
            </div>
            <p className="serif text-lg leading-relaxed text-gray-800 dark:text-gray-200 italic">
              {aiAdvice}
            </p>
          </div>
        )}

        {/* Search Results Mockup */}
        {query && (
          <div className="pt-4">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Suggested for you</h2>
            <div className="grid grid-cols-2 gap-4">
              {MOCK_PRODUCTS.slice(0, 4).map((product) => (
                <div key={product.id} className="group">
                  <div className="aspect-square bg-white dark:bg-white/5 rounded-2xl p-4 shadow-sm border border-gray-50 dark:border-white/5 overflow-hidden relative">
                    <img src={product.image} className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal group-hover:scale-105 transition-transform" />
                  </div>
                  <div className="mt-2 px-1">
                    <p className="text-[10px] font-bold text-gray-400 uppercase">{product.category}</p>
                    <p className="text-sm font-medium truncate text-black dark:text-white">{product.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchScreen;