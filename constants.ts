
import { Product, Order } from './types';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 's1',
    name: 'Essential White Poplin Shirt',
    price: 85,
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=1000&auto=format&fit=crop',
    category: 'Shirt',
    description: 'A crisp, plain white shirt in Italian cotton poplin. Features a reinforced collar and pearl buttons. Designed for a sharp, clean silhouette.',
    colors: ['#FFFFFF']
  },
  {
    id: 't1',
    name: 'Matte Black Half-Sleeve Tee',
    price: 35,
    image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1000&auto=format&fit=crop',
    category: 'T-shirt',
    description: 'Premium heavyweight cotton tee in deep matte black. Features a relaxed yet structured fit with clean finished hems.',
    colors: ['#000000']
  },
  {
    id: 'fs1',
    name: 'Signature Full-Sleeve Tee',
    price: 55,
    image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=1000&auto=format&fit=crop',
    category: 'Full-Sleeve T-shirt',
    description: 'Sleek, slim-fit long sleeve tee crafted from premium pima cotton jersey. A versatile staple for layered or standalone wear.',
    colors: ['#000000']
  },
  {
    id: 'h1',
    name: 'Monolith Studio Hoodie',
    price: 110,
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1000&auto=format&fit=crop',
    category: 'Hoodie',
    description: 'Heavyweight organic cotton hoodie with a clean, hardware-free design. Features a double-layered hood and drop shoulders.',
    colors: ['#000000', '#708090']
  },
  {
    id: 'p1',
    name: 'Tailored Plain Black Pant',
    price: 140,
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=1000&auto=format&fit=crop',
    category: 'Pant',
    description: 'Precision-cut plain black trousers. Crafted from high-twist wool for a sharp drape and enduring minimalist style.',
    colors: ['#000000']
  },
  {
    id: 'j1',
    name: 'Modern Architecture Blazer',
    price: 320,
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1000&auto=format&fit=crop',
    category: 'Jacket',
    description: 'A structured black blazer with sharp lapels and a hidden button placket. The pinnacle of modern luxury tailoring.',
    colors: ['#000000']
  }
];

export const MOCK_ORDERS: Order[] = [
  {
    id: 'ORD-8291',
    date: 'Oct 24, 2023',
    status: 'Delivered',
    items: [{ ...MOCK_PRODUCTS[0], quantity: 1, size: 'M', selectedColor: '#FFFFFF' }],
    total: 85
  }
];

export const OCCASIONS = [
  'Date outfit', 
  'Interview look', 
  'Party wear', 
  'Office wear', 
  'Vacation style', 
  'Wedding guest', 
  'Streetwear Look'
];
