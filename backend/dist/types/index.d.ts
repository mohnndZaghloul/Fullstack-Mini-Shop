export interface Profile {
    id: string;
    name: string;
    role: 'customer' | 'admin';
    created_at: string;
}
export interface Category {
    id: string;
    name: string;
    slug: string;
    created_at: string;
}
export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    image_url: string;
    category_id: string;
    is_active: boolean;
    created_at: string;
    deleted_at: string | null;
}
export interface Order {
    id: string;
    user_id: string;
    status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
    total_amount: number;
    created_at: string;
    items?: OrderItem[];
}
export interface OrderItem {
    id: string;
    order_id: string;
    product_id: string;
    quantity: number;
    unit_price: number;
}
export interface User {
    id: string;
    email: string;
    name: string;
    role: 'customer' | 'admin';
}
export interface JwtPayload {
    id: string;
    email: string;
    role: 'customer' | 'admin';
}
//# sourceMappingURL=index.d.ts.map