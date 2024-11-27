// Product Types
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  stock: number;
  ratings: Rating[];
  averageRating: number;
  tags: string[];
  featured: boolean;
  discount?: {
    percentage: number;
    validUntil: Date;
  };
  specifications?: Record<string, string>;
  createdAt: Date;
  updatedAt: Date;
}

export interface Rating {
  userId: string;
  rating: number;
  comment: string;
  createdAt: Date;
  helpful: number;
}

// Order Types
export interface Order {
  id: string;
  userId: string;
  products: OrderProduct[];
  status: OrderStatus;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  shippingAddress: Address;
  billingAddress: Address;
  paymentMethod: PaymentMethod;
  createdAt: Date;
  updatedAt: Date;
  trackingNumber?: string;
  notes?: string;
}

export interface OrderProduct {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
}

export interface PaymentMethod {
  type: 'credit_card' | 'debit_card' | 'paypal';
  lastFourDigits?: string;
}

// User Types
export interface User {
  uid: string;
  email: string;
  role: UserRole;
  isAdmin?: boolean;
  profile?: UserProfile;
  preferences?: UserPreferences;
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  phone?: string;
  defaultAddress?: Address;
  loyaltyPoints: number;
  memberSince: Date;
}

export interface UserPreferences {
  newsletter: boolean;
  marketingEmails: boolean;
  language: string;
  currency: string;
}

export type UserRole = 'customer' | 'admin' | 'manager';

// Analytics Types
export interface ProductAnalytics {
  productId: string;
  views: number;
  purchases: number;
  revenue: number;
  averageRating: number;
  stockLevel: number;
  lastRestocked: Date;
}

export interface SalesAnalytics {
  daily: MetricData[];
  weekly: MetricData[];
  monthly: MetricData[];
  yearly: MetricData[];
}

export interface MetricData {
  date: Date;
  orders: number;
  revenue: number;
  averageOrderValue: number;
}

// Cart Types
export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  savedForLater?: boolean;
}

// Filter Types
export interface ProductFilters {
  category?: string[];
  priceRange?: {
    min: number;
    max: number;
  };
  rating?: number;
  sortBy?: 'price_asc' | 'price_desc' | 'rating' | 'newest';
  search?: string;
  tags?: string[];
  inStock?: boolean;
}

// Newsletter Types
export interface NewsletterSubscription {
  email: string;
  subscribed: boolean;
  subscribedAt: Date;
  preferences: {
    productUpdates: boolean;
    promotions: boolean;
    blog: boolean;
  };
}
