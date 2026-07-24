# Shop Frontend

React + Vite frontend for the Shop e-commerce platform.

---

## Prerequisites

- Node.js >= 18
- npm >= 9
- Backend API server running (see root `README.md` / `docker-compose.yml`)

---

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env and set VITE_API_BASE_URL to your backend URL

# 3. Start development server
npm run dev
```

The dev server starts on `http://localhost:5173` by default and proxies
`/api/*` requests to the backend configured in `vite.config.js`.

---

## Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `VITE_API_BASE_URL` | Yes | `http://localhost:4000/api` | Backend API base URL used by the Axios client and React Query |
| `VITE_APP_NAME` | No | `Shop` | Display name shown in page titles |
| `VITE_ENABLE_GUEST_CHECKOUT` | No | `true` | Feature flag to allow guest checkout flow |

All variables must be prefixed with `VITE_` to be exposed to the browser bundle.

---

## Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Production build output to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Run ESLint and auto-fix issues |
| `npm test` | Run Jest test suite |
| `npm run test:coverage` | Run tests with coverage report |

---

## Design Tokens

Design tokens are defined in `src/config/tailwind.config.js` and
automatically merged into the root `tailwind.config.js`.

### Usage

```jsx
// Use Tailwind utility classes that map to design tokens
<div className="bg-primary-600 text-white rounded-lg px-4 py-2" />
```

### Token categories

- **Colors** — extended palette under `colors.*` (e.g. `primary`, `neutral`, `success`, `warning`, `error`)
- **Typography** — `fontFamily`, `fontSize`, `fontWeight`, `lineHeight`
- **Spacing** — `spacing` scale
- **Border radius** — `borderRadius`
- **Shadows** — `boxShadow`
- **Breakpoints** — `screens`

Refer to `src/config/tailwind.config.js` for the full token definitions.

Utility helpers:

```js
import { cn } from '@/lib/utils'; // clsx + tailwind-merge helper
```

---

## Route Map

| Path | Page Component | Auth Required | Admin Only |
|---|---|---|---|
| `/` | `Home` | No | No |
| `/products` | `ProductListing` | No | No |
| `/products/:productId` | `ProductDetail` | No | No |
| `/categories/:categoryId` | `CategoryProductListing` | No | No |
| `/search` | `SearchResults` | No | No |
| `/cart` | `Cart` | No | No |
| `/checkout/address` | `CheckoutAddress` | No | No |
| `/checkout/review` | `CheckoutReview` | No | No |
| `/checkout/payment` | `CheckoutPayment` | No | No |
| `/checkout/confirmation` | `CheckoutConfirmation` | No | No |
| `/checkout/guest-register` | `GuestPostCheckoutRegister` | No | No |
| `/auth/login` | `Login` | Guest only | No |
| `/auth/register` | `Register` | Guest only | No |
| `/auth/forgot-password` | `ForgotPassword` | Guest only | No |
| `/auth/reset-password` | `ResetPassword` | Guest only | No |
| `/account` | `AccountOverview` | Yes | No |
| `/account/profile` | `AccountProfile` | Yes | No |
| `/account/addresses` | `AccountAddresses` | Yes | No |
| `/account/addresses/new` | `AddressNew` | Yes | No |
| `/account/addresses/:addressId/edit` | `AddressEdit` | Yes | No |
| `/account/orders` | `OrderHistory` | Yes | No |
| `/account/orders/:orderId` | `OrderDetail` | Yes | No |
| `/account/orders/:orderId/return` | `ReturnRequest` | Yes | No |
| `/account/notifications` | `Notifications` | Yes | No |
| `/admin` | `AdminDashboard` | Yes | Yes |
| `/admin/reports` | `AdminReports` | Yes | Yes |
| `/admin/orders` | `AdminOrderList` | Yes | Yes |
| `/admin/orders/:orderId` | `AdminOrderDetail` | Yes | Yes |
| `/admin/catalogue/products` | `AdminProductList` | Yes | Yes |
| `/admin/catalogue/products/new` | `AdminProductNew` | Yes | Yes |
| `/admin/catalogue/products/:productId/edit` | `AdminProductEdit` | Yes | Yes |
| `/admin/catalogue/categories` | `AdminCategoryList` | Yes | Yes |
| `/admin/catalogue/categories/new` | `AdminCategoryNew` | Yes | Yes |
| `/admin/catalogue/categories/:categoryId/edit` | `AdminCategoryEdit` | Yes | Yes |
| `/admin/catalogue/brands` | `AdminBrandList` | Yes | Yes |
| `/admin/catalogue/brands/new` | `AdminBrandNew` | Yes | Yes |
| `/admin/catalogue/brands/:brandId/edit` | `AdminBrandEdit` | Yes | Yes |
| `/admin/promotions` | `AdminPromotionList` | Yes | Yes |
| `/admin/promotions/new` | `AdminPromotionNew` | Yes | Yes |
| `/admin/promotions/:promoId/edit` | `AdminPromotionEdit` | Yes | Yes |
| `/admin/returns` | `AdminReturnList` | Yes | Yes |
| `/admin/returns/:returnRequestId` | `AdminReturnDetail` | Yes | Yes |
| `/admin/users` | `AdminUserList` | Yes | Yes |
| `/admin/users/:userId` | `AdminUserDetail` | Yes | Yes |
| `*` | `NotFound` | No | No |

---

## API Endpoints Reference

The frontend communicates with the following backend endpoints via the Axios client in `src/api/`:

- `GET /search` — Full-text product search
- `GET /search/suggest` — Autocomplete suggestions
- `GET /products` — Product listing
- `GET /products/:productId` — Product detail
- `GET /categories` — All categories
- `GET /categories/:categoryId` — Single category
- `GET /categories/:categoryId/products` — Products by category
- `GET /brands` — All brands
- `GET /brands/:brandId` — Single brand
- `POST /carts/:cartId/items` — Add item to cart
- `GET /carts/:cartId` — Get cart
- `PATCH /carts/:cartId/items/:itemId` — Update cart item
- `DELETE /carts/:cartId/items/:itemId` — Remove cart item
- `POST /carts/:cartId/promo` — Apply promo code
- `GET /checkout/review` — Checkout order review
- `POST /checkout/address` — Save checkout address
- `POST /checkout/place-order` — Place order
- `GET /serviceability` — Check pin-code serviceability
- `POST /payments/initiate` — Initiate payment
- `POST /auth/guest-register` — Guest registration
- `POST /auth/login` — Login
- `POST /auth/register` — Register
- `POST /auth/forgot-password` — Forgot password
- `POST /auth/reset-password` — Reset password
- `GET /users/me` — Current user profile
- `PATCH /users/me` — Update profile
- `POST /users/me/change-password` — Change password
- `GET /users/me/addresses` — List addresses
- `POST /users/me/addresses` — Create address
- `GET /users/me/addresses/:addressId` — Get address
- `PUT /users/me/addresses/:addressId` — Update address
- `DELETE /users/me/addresses/:addressId` — Delete address
- `GET /orders` — Order history
- `GET /orders/:orderId` — Order detail
- `GET /orders/:orderId/timeline` — Order timeline
- `GET /orders/:orderId/tracking` — Order tracking
- `POST /orders/:orderId/cancel` — Cancel order
- `POST /orders/:orderId/advance` — Advance order status (admin)
- `GET /orders/:orderId/refunds` — Order refunds
- `POST /orders/:orderId/return-requests` — Create return request
- `GET /return-requests` — List return requests (admin)
- `GET /return-requests/:returnRequestId` — Return request detail
- `POST /return-requests/:returnRequestId/review` — Review return (admin)
- `GET /notifications` — Notification list
- `POST /notifications/read-all` — Mark all as read
- `POST /notifications/:notificationId/read` — Mark one as read
- `GET /admin/reports` — Admin reports
- `GET /promo-codes` — Promo code list (admin)
- `POST /products` — Create product (admin)
- `PUT /products/:productId` — Update product (admin)
- `DELETE /products/:productId` — Delete product (admin)
- `GET /products/:productId/images` — Product images
- `POST /products/:productId/images` — Upload product images
- `GET /products/:productId/skus` — Product SKUs
- `POST /products/:productId/skus` — Create SKU
- `PUT /products/:productId/skus/:skuId` — Update SKU
- `POST /categories` — Create category (admin)
- `PUT /categories/:categoryId` — Update category (admin)
- `DELETE /categories/:categoryId` — Delete category (admin)
- `POST /brands` — Create brand (admin)

---

## Project Structure

```
src/
  api/          # Axios instances and endpoint functions
  assets/       # Static images and icons
  components/   # Reusable UI components
  config/       # Tailwind design token config
  hooks/        # Custom React hooks
  lib/          # Utility functions (cn, etc.)
  pages/        # Route-level page components
  routes/       # Route guards and router definition
  store/        # Global state (context / zustand)
  styles/       # Global CSS
```
