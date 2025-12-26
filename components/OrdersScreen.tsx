
import React from 'react';
import { MOCK_ORDERS } from '../constants';
import { ChevronRight, Package, Clock, CheckCircle } from 'lucide-react';

const OrdersScreen: React.FC = () => {
  return (
    <div className="pb-24">
      <header className="px-6 pt-12 pb-6">
        <h1 className="serif text-3xl font-light tracking-tight dark:text-white">Your Orders</h1>
      </header>

      <div className="px-6 space-y-4">
        {MOCK_ORDERS.map((order) => (
          <div 
            key={order.id} 
            className="bg-white dark:bg-[#181818] p-5 rounded-3xl shadow-sm border border-gray-50 dark:border-white/5 flex flex-col gap-4 group cursor-pointer hover:shadow-md transition-all"
          >
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{order.id}</span>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{order.date}</p>
              </div>
              <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                order.status === 'Delivered' ? 'bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400' : 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400'
              }`}>
                {order.status === 'Delivered' ? <CheckCircle size={10} /> : <Clock size={10} />}
                {order.status}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-16 h-20 bg-gray-50 dark:bg-white/5 rounded-xl overflow-hidden shadow-inner flex items-center justify-center p-2">
                <img src={order.items[0].image} className="h-full object-contain mix-blend-multiply dark:mix-blend-normal" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold dark:text-white">{order.items[0].name}</h3>
                <p className="text-xs text-gray-400 mt-0.5">Size {order.items[0].size} • {order.items.length} item(s)</p>
                <p className="text-sm font-light mt-2 dark:text-gray-300">${order.total}</p>
              </div>
              <ChevronRight size={18} className="text-gray-300 group-hover:text-black dark:group-hover:text-white transition-colors" />
            </div>
          </div>
        ))}

        {/* Empty State Mock */}
        <div className="py-12 flex flex-col items-center justify-center text-gray-300 dark:text-white/10">
           <Package size={48} className="mb-4 opacity-20" />
           <p className="text-sm font-medium">Looking for something else?</p>
        </div>
      </div>
    </div>
  );
};

export default OrdersScreen;
