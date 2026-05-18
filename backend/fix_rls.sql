-- ============================================================
-- FIX: Remove infinite recursion in RLS policies
-- Run this in Supabase SQL Editor
-- ============================================================

-- 1. Create admin check function (bypasses RLS via SECURITY DEFINER)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- 2. Drop old recursive policies
DROP POLICY IF EXISTS profiles_select_own ON profiles;
DROP POLICY IF EXISTS profiles_select_admin ON profiles;
DROP POLICY IF EXISTS products_select_admin ON products;
DROP POLICY IF EXISTS products_insert_admin ON products;
DROP POLICY IF EXISTS products_update_admin ON products;
DROP POLICY IF EXISTS products_delete_admin ON products;
DROP POLICY IF EXISTS categories_insert_admin ON categories;
DROP POLICY IF EXISTS categories_update_admin ON categories;
DROP POLICY IF EXISTS categories_delete_admin ON categories;
DROP POLICY IF EXISTS orders_select_own ON orders;
DROP POLICY IF EXISTS orders_update_admin ON orders;
DROP POLICY IF EXISTS order_items_select_own ON order_items;

-- 3. Recreate with non-recursive admin check
CREATE POLICY profiles_select_own ON profiles
  FOR SELECT USING (id = auth.uid() OR public.is_admin());

CREATE POLICY categories_insert_admin ON categories
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY categories_update_admin ON categories
  FOR UPDATE USING (public.is_admin());

CREATE POLICY categories_delete_admin ON categories
  FOR DELETE USING (public.is_admin());

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

CREATE POLICY orders_update_admin ON orders
  FOR UPDATE USING (public.is_admin());

CREATE POLICY order_items_select_own ON order_items
  FOR SELECT USING (
    order_id IN (SELECT id FROM orders WHERE user_id = auth.uid())
    OR public.is_admin()
  );

-- 4. Verify it works
SELECT public.is_admin();
