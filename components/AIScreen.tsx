
import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, User, Bot, ShoppingBag, Plus, Image as ImageIcon, Search, Camera, Wand2, Globe, Layers } from 'lucide-react';
import { createStylistChat, analyzeFashionImage, getSearchGroundedAdvice, generateStudioImage } from '../services/geminiService';
import { MOCK_PRODUCTS } from '../constants';
import { Product } from '../types';

interface Message {
  role: 'user' | 'model';
  text: string;
  image?: string;
  suggestedProductIds?: string[];
  links?: any[];
}

interface AIProps {
  onAddToCart: (p: Product) => void;
}

type AIMode = 'Chat' | 'Search' | 'Studio' | 'Analyze';

const AIScreen: React.FC<AIProps> = ({ onAddToCart }) => {
  const [activeMode, setActiveMode] = useState<AIMode>('Chat');
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'model', 
      text: "Bonjour. I am Lumi. How shall we elevate your style today? Use the modes below for specialized assistance.",
      suggestedProductIds: []
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageSize, setImageSize] = useState<"1K" | "2K" | "4K">("1K");
  
  const chatRef = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    chatRef.current = createStylistChat();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSend = async () => {
    if (!input.trim() && !selectedImage && !loading) return;

    const userText = input.trim();
    const userImg = selectedImage;
    
    setMessages(prev => [...prev, { role: 'user', text: userText, image: userImg }]);
    setInput('');
    setSelectedImage(null);
    setLoading(true);

    try {
      if (activeMode === 'Analyze' && userImg) {
        const base64 = userImg.split(',')[1];
        const analysis = await analyzeFashionImage(base64);
        setMessages(prev => [...prev, { role: 'model', text: analysis || "Analysis failed." }]);
      } 
      else if (activeMode === 'Search') {
        const result = await getSearchGroundedAdvice(userText);
        setMessages(prev => [...prev, { role: 'model', text: result.text, links: result.links }]);
      }
      else if (activeMode === 'Studio') {
        // Need to check API key for Pro Image model
        if (!(await (window as any).aistudio.hasSelectedApiKey())) {
          await (window as any).aistudio.openSelectKey();
        }
        const generated = await generateStudioImage(userText, imageSize);
        if (generated) {
          setMessages(prev => [...prev, { role: 'model', text: "Here is your high-end studio concept.", image: generated }]);
        } else {
          setMessages(prev => [...prev, { role: 'model', text: "Studio generation failed. Please check your Pro API key." }]);
        }
      }
      else {
        // Default Chat Mode
        const response = await chatRef.current.sendMessage({ message: userText });
        const data = JSON.parse(response.text || '{}');
        setMessages(prev => [...prev, { 
          role: 'model', 
          text: data.text || "I apologize, something went wrong.",
          suggestedProductIds: data.suggestedProductIds || []
        }]);
      }
    } catch (error) {
      console.error("AI Mode Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "Service temporarily unavailable. Our artisans are working on it." }]);
    } finally {
      setLoading(false);
    }
  };

  const getProductsFromIds = (ids: string[]) => MOCK_PRODUCTS.filter(p => ids.includes(p.id));

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] bg-white dark:bg-[#0a0a0a]">
      <header className="px-6 pt-12 pb-4 bg-white/80 dark:bg-black/80 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="serif text-2xl font-light tracking-tight flex items-center gap-2 dark:text-white">
              Lumi <Sparkles size={18} className="text-indigo-500" />
            </h1>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Intelligent Stylist</p>
          </div>
          <div className="flex gap-1 bg-gray-100 dark:bg-white/5 p-1 rounded-xl">
            {(['Chat', 'Search', 'Studio', 'Analyze'] as AIMode[]).map(m => (
              <button
                key={m}
                onClick={() => setActiveMode(m)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${activeMode === m ? 'bg-black text-white dark:bg-white dark:text-black shadow-sm' : 'text-gray-400'}`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-6 space-y-8 no-scrollbar">
        {messages.map((msg, idx) => {
          const products = msg.suggestedProductIds ? getProductsFromIds(msg.suggestedProductIds) : [];
          return (
            <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-2`}>
              <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-black text-white dark:bg-white dark:text-black' : 'bg-gray-100 text-black dark:bg-white/10 dark:text-white'}`}>
                  {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                </div>
                <div className="space-y-2">
                  <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-black text-white dark:bg-white dark:text-black rounded-tr-none' : 'bg-gray-50 text-gray-800 dark:bg-[#181818] dark:text-gray-200 rounded-tl-none border border-gray-100 dark:border-white/5'}`}>
                    {msg.text}
                    {msg.image && <img src={msg.image} className="mt-4 rounded-xl w-full max-h-64 object-cover border border-white/10" />}
                  </div>
                  {msg.links && msg.links.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {msg.links.map((link, i) => (
                        <a key={i} href={link.web?.uri} target="_blank" className="text-[10px] text-indigo-500 bg-indigo-500/5 px-2 py-1 rounded-full border border-indigo-500/20">
                          {link.web?.title || 'View Source'}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              {products.length > 0 && (
                <div className="mt-4 w-full flex gap-3 overflow-x-auto pb-2 px-11 no-scrollbar">
                  {products.map(p => (
                    <div key={p.id} className="min-w-[140px] bg-white dark:bg-[#181818] rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm p-3 group">
                      <img src={p.image} className="h-24 mx-auto object-contain mix-blend-multiply dark:mix-blend-normal group-hover:scale-105 transition-transform" />
                      <h4 className="text-[10px] font-bold mt-2 truncate dark:text-white">{p.name}</h4>
                      <button onClick={() => onAddToCart(p)} className="mt-2 w-full py-1.5 bg-black text-white dark:bg-white dark:text-black rounded-lg text-[9px] font-bold">Add to Bag</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
        {loading && (
          <div className="flex justify-start animate-pulse">
            <div className="flex gap-3 max-w-[85%]">
              <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/10" />
              <div className="p-4 bg-gray-50 dark:bg-[#181818] rounded-2xl w-32 h-12" />
            </div>
          </div>
        )}
      </div>

      <div className="p-6 border-t border-gray-50 dark:border-white/5 space-y-4">
        {selectedImage && (
          <div className="relative inline-block">
            <img src={selectedImage} className="w-16 h-16 rounded-xl object-cover border-2 border-indigo-500" />
            <button onClick={() => setSelectedImage(null)} className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-lg">
              <Plus size={12} className="rotate-45" />
            </button>
          </div>
        )}

        {activeMode === 'Studio' && (
          <div className="flex items-center gap-2 mb-2">
            <Layers size={14} className="text-gray-400" />
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Resolution:</span>
            {(['1K', '2K', '4K'] as const).map(sz => (
              <button key={sz} onClick={() => setImageSize(sz)} className={`px-2 py-1 rounded text-[9px] font-bold ${imageSize === sz ? 'bg-indigo-500 text-white' : 'bg-gray-100 dark:bg-white/5 text-gray-400'}`}>
                {sz}
              </button>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <button onClick={() => fileInputRef.current?.click()} className="p-4 bg-gray-50 dark:bg-white/5 rounded-3xl text-gray-400 hover:text-black dark:hover:text-white transition-colors">
            <ImageIcon size={20} />
          </button>
          <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
          
          <div className="relative flex-1">
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder={
                activeMode === 'Chat' ? "Talk to Lumi..." :
                activeMode === 'Search' ? "Search current trends..." :
                activeMode === 'Studio' ? "Describe a studio concept..." :
                "Upload photo to analyze..."
              }
              className="w-full bg-gray-50 dark:bg-[#181818] border-none py-4 pl-6 pr-14 rounded-3xl focus:ring-2 focus:ring-black/5 outline-none text-sm dark:text-white"
            />
            <button 
              onClick={handleSend}
              disabled={loading}
              className={`absolute right-2 top-1/2 -translate-y-1/2 p-2.5 rounded-full ${input.trim() || selectedImage ? 'bg-black text-white dark:bg-white dark:text-black' : 'bg-gray-200 dark:bg-white/5 text-gray-400'}`}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIScreen;
