export interface AdminUser {
  username: string;
  password?: string;
}

export interface Banner {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  promoTagTop: string;
  promoTagDate: string;
  promoTagPrice: string;
  circlePromoPrice: string;
  isBestSeller: boolean;
}

export interface Product {
  id: string;
  name: string;
  categoryId: string;
  price: number;
  stock: number;
  image: string;
  description: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface Sale {
  id: string;
  productId: string;
  qty: number;
  totalPrice: number;
  timestamp: string;
  customerName?: string;
  createdAt?: any;
}

export interface PendingTransaction {
  id: string;
  productId: string;
  qty: number;
  totalPrice: number;
  timestamp: string;
  customerName?: string;
  createdAt?: any;
}
