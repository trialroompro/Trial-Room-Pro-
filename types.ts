
export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
  colors?: string[]; // hex or color names
}

export interface CartItem extends Product {
  quantity: number;
  size: string;
  selectedColor?: string;
}

export interface Order {
  id: string;
  date: string;
  status: 'Processing' | 'Shipped' | 'Delivered';
  items: CartItem[];
  total: number;
}

export type TabType = 'Explore' | 'AI' | 'Orders' | 'Cart' | 'Account';
