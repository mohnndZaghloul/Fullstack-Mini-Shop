export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category_id: string;
  is_active: boolean;
  created_at: string;
  category?: { name: string; slug: string };
}

export interface Order {
  id: string;
  user_id: string;
  status: string;
  total_amount: number;
  created_at: string;
  order_items: OrderItem[];
  profile?: { name: string; email: string };
}

export interface OrderItem {
  id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  product?: Product;
}

export interface DashboardStats {
  ordersToday: number;
  revenueToday: number;
  activeProducts: number;
  ordersPerDay: { date: string; count: number }[];
  recentOrders: Order[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}
