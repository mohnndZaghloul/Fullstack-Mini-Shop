# Mini Shop Backend

Fastify + TypeScript + Supabase backend API for a mini e-commerce shop.

## Setup

1. Clone the repo and install dependencies:
   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env` and fill in your Supabase credentials:
   ```bash
   cp .env.example .env
   ```

3. Run the database migrations in `migrations/001_schema.sql` against your Supabase project's SQL editor.

4. (Optional) Run `seed.sql` to populate sample categories and products.

5. Start the development server:
   ```bash
   npm run dev
   ```

## Scripts

| Command           | Description                     |
| ----------------- | ------------------------------- |
| `npm run dev`     | Start dev server with hot reload |
| `npm run build`   | Compile TypeScript to JS        |
| `npm start`       | Run compiled JS in production   |

## Environment Variables

| Variable              | Description                        |
| --------------------- | ---------------------------------- |
| `SUPABASE_URL`        | Your Supabase project URL          |
| `SUPABASE_SERVICE_KEY`| Service role key (admin)           |
| `SUPABASE_ANON_KEY`   | Anon/public key                    |
| `JWT_SECRET`          | JWT secret for token validation    |
| `PORT`                | Server port (default 3001)         |

## API Routes

### Auth

| Method | Path                    | Auth     | Description            |
| ------ | ----------------------- | -------- | ---------------------- |
| POST   | `/auth/register`        | No       | Register a new user    |
| POST   | `/auth/login`           | No       | Login                  |
| POST   | `/auth/forgot-password` | No       | Send password reset    |
| GET    | `/auth/me`              | Bearer   | Get current user       |

### Products

| Method | Path              | Auth     | Description              |
| ------ | ----------------- | -------- | ------------------------ |
| GET    | `/products`       | No       | List active products     |
| GET    | `/products/:id`   | No       | Get product details      |
| POST   | `/products`       | Admin    | Create a product         |
| PATCH  | `/products/:id`   | Admin    | Update a product         |
| DELETE | `/products/:id`   | Admin    | Soft-delete a product    |

**GET /products** query params: `search` (string), `category` (slug).

### Orders

| Method | Path                    | Auth     | Description              |
| ------ | ----------------------- | -------- | ------------------------ |
| POST   | `/orders`               | Bearer   | Create an order          |
| GET    | `/orders/my`            | Bearer   | Get my orders            |
| GET    | `/orders`               | Admin    | List all orders (paginated) |
| PATCH  | `/orders/:id/status`    | Admin    | Update order status      |

**GET /orders** query params: `page` (default 1), `limit` (default 20).

## Test Credentials

Once you have seeded your database, you can create a test user via `/auth/register`:

```json
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123"
}
```

For admin access, manually update the user's role in the `profiles` table to `'admin'`.
