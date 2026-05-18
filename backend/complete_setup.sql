-- ============================================================
-- MINI SHOP — COMPLETE SETUP
-- Run this entire script in Supabase SQL Editor
-- ============================================================

-- 1. Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- TABLES
-- ============================================================

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, role)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', 'User'), 'customer');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  image_url TEXT NOT NULL,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ DEFAULT NULL
);

CREATE INDEX idx_products_active ON products (is_active) WHERE deleted_at IS NULL;
CREATE INDEX idx_products_category ON products (category_id);

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
  total_amount NUMERIC(10, 2) NOT NULL CHECK (total_amount >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_orders_user ON orders (user_id);
CREATE INDEX idx_orders_status ON orders (status);

CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price NUMERIC(10, 2) NOT NULL CHECK (unit_price >= 0)
);

CREATE INDEX idx_order_items_order ON order_items (order_id);

-- ============================================================
-- ADMIN CHECK FUNCTION (SECURITY DEFINER — bypasses RLS)
-- ============================================================
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY profiles_select_own ON profiles
  FOR SELECT USING (id = auth.uid() OR public.is_admin());

CREATE POLICY profiles_update_own ON profiles
  FOR UPDATE USING (id = auth.uid()) WITH CHECK (id = auth.uid());

CREATE POLICY categories_select_all ON categories
  FOR SELECT USING (TRUE);

CREATE POLICY categories_insert_admin ON categories
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY categories_update_admin ON categories
  FOR UPDATE USING (public.is_admin());

CREATE POLICY categories_delete_admin ON categories
  FOR DELETE USING (public.is_admin());

CREATE POLICY products_select_active ON products
  FOR SELECT USING (is_active = true AND deleted_at IS NULL);

CREATE POLICY products_select_admin ON products
  FOR SELECT USING (public.is_admin());

CREATE POLICY products_insert_admin ON products
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY products_update_admin ON products
  FOR UPDATE USING (public.is_admin());

CREATE POLICY products_delete_admin ON products
  FOR DELETE USING (public.is_admin());

CREATE POLICY orders_select_own ON orders
  FOR SELECT USING (user_id = auth.uid() OR public.is_admin());

CREATE POLICY orders_insert_auth ON orders
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY orders_update_admin ON orders
  FOR UPDATE USING (public.is_admin());

CREATE POLICY order_items_select_own ON order_items
  FOR SELECT USING (
    order_id IN (SELECT id FROM orders WHERE user_id = auth.uid())
    OR public.is_admin()
  );

CREATE POLICY order_items_insert_auth ON order_items
  FOR INSERT WITH CHECK (
    order_id IN (SELECT id FROM orders WHERE user_id = auth.uid())
  );

-- ============================================================
-- SEED DATA
-- ============================================================

INSERT INTO categories (id, name, slug) VALUES
  ('a1b2c3d4-0001-4000-8000-000000000001', 'Electronics', 'electronics'),
  ('a1b2c3d4-0001-4000-8000-000000000002', 'Clothing', 'clothing'),
  ('a1b2c3d4-0001-4000-8000-000000000003', 'Home & Kitchen', 'home-kitchen');

INSERT INTO products (id, name, description, price, image_url, category_id) VALUES
  ('b1c2d3e4-0001-4000-8000-000000000001', 'Wireless Bluetooth Headphones', 'Premium noise-cancelling wireless headphones with 30-hour battery life.', 199.99, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400', 'a1b2c3d4-0001-4000-8000-000000000001'),
  ('b1c2d3e4-0001-4000-8000-000000000002', 'Smart Watch Pro', 'Fitness tracking smartwatch with GPS, heart rate monitor, and AMOLED display.', 249.99, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400', 'a1b2c3d4-0001-4000-8000-000000000001'),
  ('b1c2d3e4-0001-4000-8000-000000000003', 'USB-C Hub 7-in-1', 'Compact multi-port adapter with HDMI, USB 3.0, SD card reader, and PD charging.', 45.99, 'https://images.unsplash.com/photo-1626285861696-9f0bf5a49c6d?w=400', 'a1b2c3d4-0001-4000-8000-000000000001'),
  ('b1c2d3e4-0001-4000-8000-000000000004', 'Portable Bluetooth Speaker', 'Waterproof portable speaker with rich bass and 12-hour playback.', 79.99, 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400', 'a1b2c3d4-0001-4000-8000-000000000001'),
  ('b1c2d3e4-0001-4000-8000-000000000005', 'Mechanical Keyboard RGB', 'Full-size mechanical keyboard with hot-swappable switches and per-key RGB lighting.', 129.99, 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=400', 'a1b2c3d4-0001-4000-8000-000000000001'),
  ('b1c2d3e4-0001-4000-8000-000000000006', 'Classic Denim Jacket', 'Timeless denim jacket made from premium cotton with a comfortable fit.', 89.99, 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=400', 'a1b2c3d4-0001-4000-8000-000000000002'),
  ('b1c2d3e4-0001-4000-8000-000000000007', 'Merino Wool Sweater', 'Lightweight merino wool sweater perfect for layering in cooler weather.', 119.99, 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400', 'a1b2c3d4-0001-4000-8000-000000000002'),
  ('b1c2d3e4-0001-4000-8000-000000000008', 'Running Shoes Ultra', 'Lightweight running shoes with responsive cushioning and breathable mesh upper.', 149.99, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400', 'a1b2c3d4-0001-4000-8000-000000000002'),
  ('b1c2d3e4-0001-4000-8000-000000000009', 'Canvas Tote Bag', 'Eco-friendly canvas tote bag with reinforced stitching and inner pocket.', 34.99, 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=400', 'a1b2c3d4-0001-4000-8000-000000000002'),
  ('b1c2d3e4-0001-4000-8000-000000000010', 'Stainless Steel French Press', 'Double-walled stainless steel French press that keeps coffee hot for hours.', 44.99, 'https://images.unsplash.com/photo-1562408590-e32931084e23?w=400', 'a1b2c3d4-0001-4000-8000-000000000003'),
  ('b1c2d3e4-0001-4000-8000-000000000011', 'Bamboo Cutting Board Set', 'Set of 3 organic bamboo cutting boards in different sizes with juice grooves.', 39.99, 'https://images.unsplash.com/photo-1594226801341-41427b4e5c6e?w=400', 'a1b2c3d4-0001-4000-8000-000000000003'),
  ('b1c2d3e4-0001-4000-8000-000000000012', 'Ceramic Plant Pot Trio', 'Handcrafted ceramic plant pots with drainage holes — set of 3 colors.', 54.99, 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400', 'a1b2c3d4-0001-4000-8000-000000000003'),
  ('b1c2d3e4-0001-4000-8000-000000000013', 'Cast Iron Skillet 12-inch', 'Pre-seasoned cast iron skillet with even heat distribution for perfect searing.', 69.99, 'https://images.unsplash.com/photo-1625943553852-781c6dd46faa?w=400', 'a1b2c3d4-0001-4000-8000-000000000003'),
  ('b1c2d3e4-0001-4000-8000-000000000014', 'Glass Meal Prep Containers', 'Set of 5 borosilicate glass containers with leak-proof lids, stackable design.', 32.99, 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400', 'a1b2c3d4-0001-4000-8000-000000000003');

-- ============================================================
-- CREATE PROFILES FOR EXISTING USERS + SET ADMIN ROLE
-- ============================================================

INSERT INTO profiles (id, name, role)
SELECT id, COALESCE(raw_user_meta_data->>'name', 'User'), 'customer'
FROM auth.users
WHERE id NOT IN (SELECT id FROM profiles);

UPDATE profiles SET role = 'admin'
WHERE id IN (SELECT id FROM auth.users WHERE email = 'admin@test.com');
