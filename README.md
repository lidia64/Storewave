# Ecomus Storefront

A full-featured e-commerce storefront built with **React + Vite + TypeScript + Tailwind CSS v4 + React Router v7 + Zustand + Axios**, powered by the live [Ecomus API](https://e-commas-apis-production-e0f8.up.railway.app).

---

## Tech Stack

| Layer | Library |
|---|---|
| UI | React 19 + TypeScript |
| Styling | Tailwind CSS v4 (via `@tailwindcss/vite`) |
| Routing | React Router v7 |
| State | Zustand v5 (with `persist` middleware) |
| HTTP | Axios (centralized instance with interceptors) |
| Build | Vite 8 |
lu

---

## Features

- **Auth** — Register, login, logout with JWT. Token persisted via Zustand `persist` + `localStorage`. Protected routes redirect unauthenticated users to `/login`.
- **Products** — Browse all products with live search, category filter, and sort (price / name). Fetches from `GET /api/public/products`.
- **Product Detail** — Full product page with image gallery, variant selector, quantity picker, and add-to-cart. Fetches from `GET /api/public/products/:id`.
- **Categories** — Grid of all categories, each linking to a filtered product list. Fetches from `GET /api/categories`.
- **Cart** — View, update quantity, remove items, clear cart, and checkout. All cart operations are server-synced via the `/api/auth/cart` endpoints.
- **Checkout / Orders** — Places an order from the cart via `POST /api/auth/orders`. Order history available at `/orders` via `GET /api/auth/orders`.

---

## Project Structure

```
src/
├── lib/
│   └── axios.ts            # Centralized Axios instance + interceptors
├── types/
│   └── index.ts            # Shared TypeScript interfaces
├── services/
│   ├── auth.service.ts
│   ├── category.service.ts
│   ├── product.service.ts
│   ├── cart.service.ts
│   └── order.service.ts
├── stores/
│   ├── authStore.ts        # Zustand auth store (persisted)
│   └── cartStore.ts        # Zustand cart store
├── components/
│   ├── Navbar.tsx
│   ├── ProductCard.tsx
│   ├── ProtectedRoute.tsx
│   └── ui/
│       ├── Spinner.tsx
│       └── ErrorMessage.tsx
└── pages/
    ├── HomePage.tsx
    ├── LoginPage.tsx
    ├── RegisterPage.tsx
    ├── ProductsPage.tsx
    ├── ProductDetailPage.tsx
    ├── CategoriesPage.tsx
    ├── CartPage.tsx
    └── OrdersPage.tsx
```

---

## API Endpoints Used

All endpoints are from the live API at `https://e-commas-apis-production-e0f8.up.railway.app` (documented at `/api-docs/`).

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/users/register` | No | Register new user |
| `POST` | `/api/auth/users/login` | No | Login, returns JWT |
| `GET` | `/api/auth/users/me` | Yes | Get current user |
| `GET` | `/api/public/products` | No | List all products (grouped + flat) |
| `GET` | `/api/public/products/:id` | No | Single product detail |
| `GET` | `/api/public/products/category/:id` | No | Products by category |
| `GET` | `/api/categories` | No | List all categories |
| `GET` | `/api/auth/cart` | Yes | View cart |
| `POST` | `/api/auth/cart/items` | Yes | Add item to cart |
| `PATCH` | `/api/auth/cart/items/:itemId` | Yes | Update item quantity |
| `DELETE` | `/api/auth/cart/items/:itemId` | Yes | Remove item from cart |
| `DELETE` | `/api/auth/cart` | Yes | Clear entire cart |
| `POST` | `/api/auth/orders` | Yes | Place order from cart |
| `GET` | `/api/auth/orders` | Yes | Get order history |
| `GET` | `/api/auth/orders/:id` | Yes | Get single order |

---

## Getting Started

### 1. Clone & install

```bash
git clone <repo-url>
cd StoreWave
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

`.env`:
```
VITE_API_BASE_URL=https://e-commas-apis-production-e0f8.up.railway.app
```

### 3. Run

```bash
npm run dev
```

### 4. Build

```bash
npm run build
```

---

## Environment Variables

| Variable | Description | Example |
|---|---|---|
| `VITE_API_BASE_URL` | Base URL of the Ecomus API | `https://e-commas-apis-production-e0f8.up.railway.app` |

---

## Notes & Known Limitations

- **Token storage** — JWT is stored in `localStorage` via Zustand `persist`. This is convenient for SPAs but is susceptible to XSS. For production, prefer `httpOnly` cookies.
- **Cart requires a variant** — The API's `POST /api/auth/cart/items` requires a `variantId`. Products without variants will pass an empty string; behaviour depends on the API.
- **Admin endpoints** — Admin-only routes (`/api/admin/products`, `/api/auth/orders/admin/all`) are not exposed in the storefront UI.
- **Buy Now** — `POST /api/auth/orders/buy` (skip-cart purchase) is available via `orderService.buyNow()` but not wired to a UI button yet.
