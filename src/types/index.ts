export interface User {
  id: string;
  name?: string;
  email: string;
  role: 'USER' | 'ADMIN' | 'SELLER';
  createdAt: string;
}

export interface AuthData {
  token: string;
  user: User;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  data?: AuthData;
  token?: string;
  user?: User;
}

export interface Variant {
  id: string;
  color?: string;
  size?: string;
  sku?: string;
  price?: number;
  stock?: number;
}

export interface ProductImage {
  url: string;
  format?: string;
  size?: number;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  createdAt?: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  categoryId: string;
  category?: { name: string };
  brand?: string;
  price: number;
  stock: number;
  orderCount?: number;
  variants?: Variant[];
  images?: ProductImage[];
  createdAt?: string;
}

export interface CartItem {
  id: string;
  productId: string;
  variantId?: string;
  quantity: number;
  product?: Product;
  variant?: Variant;
}

export interface Cart {
  id: string;
  items: CartItem[];
  total?: number;
}

export interface OrderItem {
  productId: string;
  variantId?: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  userId: string;
  total: number;
  status: 'PENDING' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  items: OrderItem[];
  createdAt: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: Pagination;
}

export interface ProductSearchResponse {
  success: boolean;
  message: string;
  data: {
    grouped: {
      under50: Product[];
      between50And150: Product[];
      over150: Product[];
    };
    total: number;
    all: Product[];
  };
}
