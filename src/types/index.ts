export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  id: string;
  products: OrderProduct[];
  status: OrderStatus;
  total: number;
  customerEmail: string;
  customerName: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderProduct {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'completed';

export interface User {
  id: string;
  email: string;
  isAdmin: boolean;
  createdAt: Date;
}

export interface CartItem {
  product: Product;
  quantity: number;
}