# Admin Dashboard

Admin dashboard built with React, TypeScript, Vite, Tailwind CSS, and Supabase.

## Setup

1. Copy `.env.example` to `.env` and fill in your Supabase credentials:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

2. Install dependencies:

```bash
npm install
```

3. Start development server:

```bash
npm run dev
```

4. Build for production:

```bash
npm run build
```

## Supabase Schema

The dashboard expects the following tables in Supabase:

- `profiles` (id, name, email, role)
- `products` (id, name, description, price, image_url, category_id, is_active, created_at)
- `categories` (id, name, slug)
- `orders` (id, user_id, status, total_amount, created_at)
- `order_items` (id, order_id, product_id, quantity, unit_price)
