-- ============================================================
-- SEED DATA
-- ============================================================

-- Categories
INSERT INTO categories (id, name, slug) VALUES
  ('a1b2c3d4-0001-4000-8000-000000000001', 'Electronics', 'electronics'),
  ('a1b2c3d4-0001-4000-8000-000000000002', 'Clothing', 'clothing'),
  ('a1b2c3d4-0001-4000-8000-000000000003', 'Home & Kitchen', 'home-kitchen');

-- Electronics
INSERT INTO products (id, name, description, price, image_url, category_id) VALUES
  ('b1c2d3e4-0001-4000-8000-000000000001', 'Wireless Bluetooth Headphones', 'Premium noise-cancelling wireless headphones with 30-hour battery life.', 199.99, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400', 'a1b2c3d4-0001-4000-8000-000000000001'),
  ('b1c2d3e4-0001-4000-8000-000000000002', 'Smart Watch Pro', 'Fitness tracking smartwatch with GPS, heart rate monitor, and AMOLED display.', 249.99, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400', 'a1b2c3d4-0001-4000-8000-000000000001'),
  ('b1c2d3e4-0001-4000-8000-000000000003', 'USB-C Hub 7-in-1', 'Compact multi-port adapter with HDMI, USB 3.0, SD card reader, and PD charging.', 45.99, 'https://images.unsplash.com/photo-1626285861696-9f0bf5a49c6d?w=400', 'a1b2c3d4-0001-4000-8000-000000000001'),
  ('b1c2d3e4-0001-4000-8000-000000000004', 'Portable Bluetooth Speaker', 'Waterproof portable speaker with rich bass and 12-hour playback.', 79.99, 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400', 'a1b2c3d4-0001-4000-8000-000000000001'),
  ('b1c2d3e4-0001-4000-8000-000000000005', 'Mechanical Keyboard RGB', 'Full-size mechanical keyboard with hot-swappable switches and per-key RGB lighting.', 129.99, 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=400', 'a1b2c3d4-0001-4000-8000-000000000001');

-- Clothing
INSERT INTO products (id, name, description, price, image_url, category_id) VALUES
  ('b1c2d3e4-0001-4000-8000-000000000006', 'Classic Denim Jacket', 'Timeless denim jacket made from premium cotton with a comfortable fit.', 89.99, 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=400', 'a1b2c3d4-0001-4000-8000-000000000002'),
  ('b1c2d3e4-0001-4000-8000-000000000007', 'Merino Wool Sweater', 'Lightweight merino wool sweater perfect for layering in cooler weather.', 119.99, 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400', 'a1b2c3d4-0001-4000-8000-000000000002'),
  ('b1c2d3e4-0001-4000-8000-000000000008', 'Running Shoes Ultra', 'Lightweight running shoes with responsive cushioning and breathable mesh upper.', 149.99, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400', 'a1b2c3d4-0001-4000-8000-000000000002'),
  ('b1c2d3e4-0001-4000-8000-000000000009', 'Canvas Tote Bag', 'Eco-friendly canvas tote bag with reinforced stitching and inner pocket.', 34.99, 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=400', 'a1b2c3d4-0001-4000-8000-000000000002');

-- Home & Kitchen
INSERT INTO products (id, name, description, price, image_url, category_id) VALUES
  ('b1c2d3e4-0001-4000-8000-000000000010', 'Stainless Steel French Press', 'Double-walled stainless steel French press that keeps coffee hot for hours.', 44.99, 'https://images.unsplash.com/photo-1562408590-e32931084e23?w=400', 'a1b2c3d4-0001-4000-8000-000000000003'),
  ('b1c2d3e4-0001-4000-8000-000000000011', 'Bamboo Cutting Board Set', 'Set of 3 organic bamboo cutting boards in different sizes with juice grooves.', 39.99, 'https://images.unsplash.com/photo-1594226801341-41427b4e5c6e?w=400', 'a1b2c3d4-0001-4000-8000-000000000003'),
  ('b1c2d3e4-0001-4000-8000-000000000012', 'Ceramic Plant Pot Trio', 'Handcrafted ceramic plant pots with drainage holes — set of 3 colors.', 54.99, 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400', 'a1b2c3d4-0001-4000-8000-000000000003'),
  ('b1c2d3e4-0001-4000-8000-000000000013', 'Cast Iron Skillet 12-inch', 'Pre-seasoned cast iron skillet with even heat distribution for perfect searing.', 69.99, 'https://images.unsplash.com/photo-1625943553852-781c6dd46faa?w=400', 'a1b2c3d4-0001-4000-8000-000000000003'),
  ('b1c2d3e4-0001-4000-8000-000000000014', 'Glass Meal Prep Containers', 'Set of 5 borosilicate glass containers with leak-proof lids, stackable design.', 32.99, 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400', 'a1b2c3d4-0001-4000-8000-000000000003');
