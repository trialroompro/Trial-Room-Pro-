
import React, { useRef } from 'react';
import { User, Settings, Heart, Shield, Bell, HelpCircle, ChevronRight, Edit3, Moon, Sun, Camera } from 'lucide-react';

interface AccountProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  userPhoto: string | null;
  onUploadPhoto: (base64: string) => void;
}

const AccountScreen: React.FC<AccountProps> = ({ isDarkMode, onToggleDarkMode, userPhoto, onUploadPhoto }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        onUploadPhoto(base64String.split(',')[1]);
      };
      reader.readAsDataURL(file);
    }
  };

  const menuItems = [
    { icon: <Heart size={18} />, label: 'Saved Items', value: '12 items' },
    { icon: <Shield size={18} />, label: 'Size & Style Preferences', value: 'US 8 / Minimal' },
    { icon: <Bell size={18} />, label: 'Notifications', value: 'Enabled' },
    { icon: <Settings size={18} />, label: 'Account Settings', value: '' },
    { icon: <HelpCircle size={18} />, label: 'Customer Care', value: '' },
  ];

  return (
    <div className="pb-24">
      <header className="px-6 pt-12 pb-8 flex justify-between items-start">
        <h1 className="serif text-3xl font-light tracking-tight dark:text-white text-black">Profile</h1>
        <button className="p-2 bg-white dark:bg-white/10 rounded-full shadow-sm transition-colors">
          <Settings size={20} className="text-gray-400 dark:text-gray-300" />
        </button>
      </header>

      <div className="px-6">
        {/* Profile Card */}
        <div className="bg-white dark:bg-[#181818] p-8 rounded-[40px] shadow-sm border border-gray-50 dark:border-white/5 flex flex-col items-center text-center relative overflow-hidden mb-8 transition-colors">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-gray-50 via-gray-200 to-gray-50 dark:from-white/5 dark:via-white/10 dark:to-white/5" />
          
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            className="hidden" 
          />
          
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="w-24 h-24 rounded-full bg-gray-100 dark:bg-white/5 mb-6 flex items-center justify-center relative group cursor-pointer overflow-hidden border-2 border-dashed border-gray-200 dark:border-white/10"
          >
            {userPhoto ? (
              <img src={`data:image/jpeg;base64,${userPhoto}`} className="w-full h-full object-cover" alt="User Profile" />
            ) : (
              <User size={40} className="text-gray-300 dark:text-gray-600" />
            )}
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[8px] font-bold uppercase tracking-widest">
              <Camera size={16} className="mb-1" />
              Update Photo
            </div>
          </div>
          
          <h2 className="serif text-2xl font-bold dark:text-white text-black">User</h2>
          <p className="text-sm text-gray-400 font-light mt-1 mb-6">user@mail.com</p>
          
          <div className="flex gap-4 w-full">
            <div className="flex-1 bg-gray-50 dark:bg-white/5 rounded-2xl p-4">
              <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Orders</div>
              <div className="text-lg font-light dark:text-white text-black">24</div>
            </div>
            <div className="flex-1 bg-gray-50 dark:bg-white/5 rounded-2xl p-4">
              <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Status</div>
              <div className="text-lg font-light text-black dark:text-white">Platinum</div>
            </div>
          </div>
        </div>

        {/* AI Model Settings */}
        <div className="mb-6">
          <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] px-2 mb-3">AI Personalization</h3>
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center justify-between p-5 bg-white dark:bg-[#181818] rounded-3xl shadow-sm border border-gray-50 dark:border-white/5 hover:border-black/5 dark:hover:border-white/10 transition-all group cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="text-indigo-500">
                <Camera size={18} />
              </div>
              <div>
                <span className="text-sm font-medium dark:text-white text-black block">My AI Model Photo</span>
                <span className="text-[10px] text-gray-400 font-light">Used for personalized Fit Checks</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${userPhoto ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                {userPhoto ? 'ACTIVE' : 'NOT SET'}
              </span>
              <ChevronRight size={16} className="text-gray-200 dark:text-white/10" />
            </div>
          </div>
        </div>

        {/* Dark Mode Toggle Item */}
        <div 
          onClick={onToggleDarkMode}
          className="flex items-center justify-between p-5 bg-white dark:bg-[#181818] rounded-3xl shadow-sm border border-gray-50 dark:border-white/5 mb-2 hover:border-black/5 dark:hover:border-white/10 transition-all group cursor-pointer"
        >
          <div className="flex items-center gap-4">
            <div className="text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors">
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </div>
            <span className="text-sm font-medium dark:text-white text-black">Dark Mode</span>
          </div>
          <div className={`w-12 h-6 rounded-full relative transition-colors duration-300 flex items-center px-1 ${isDarkMode ? 'bg-white' : 'bg-gray-200'}`}>
            <div className={`w-4 h-4 rounded-full transition-transform duration-300 shadow-sm ${isDarkMode ? 'translate-x-6 bg-black' : 'translate-x-0 bg-white'}`} />
          </div>
        </div>

        {/* Menu Items */}
        <div className="space-y-2">
          {menuItems.map((item, idx) => (
            <div 
              key={idx} 
              className="flex items-center justify-between p-5 bg-white dark:bg-[#181818] rounded-3xl shadow-sm border border-gray-50 dark:border-white/5 hover:border-black/5 dark:hover:border-white/10 transition-all group cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors">{item.icon}</div>
                <span className="text-sm font-medium dark:text-white text-black">{item.label}</span>
              </div>
              <div className="flex items-center gap-2">
                {item.value && <span className="text-xs text-gray-400 font-light">{item.value}</span>}
                <ChevronRight size={16} className="text-gray-200 dark:text-white/10" />
              </div>
            </div>
          ))}
        </div>

        <button className="mt-12 w-full py-4 text-red-500 font-medium text-sm border border-red-50 dark:border-red-500/10 rounded-3xl hover:bg-red-50 dark:hover:bg-red-500/5 transition-colors mb-4">
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default AccountScreen;
