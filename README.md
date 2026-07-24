# E-Commerce Backend

A RESTful API for an e-commerce platform built with **Express**, **Knex**, and **PostgreSQL**, featuring Elasticsearch-powered search, JWT authentication, and a modular architecture.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Setup](#setup)
3. [Environment Variables](#environment-variables)
4. [Database Migrations](#database-migrations)
5. [Seed Data](#seed-data)
6. [Running the Server](#running-the-server)
7. [Running Tests](#running-tests)
8. [Module Dependency Direction (ADR)](#module-dependency-direction-adr)
9. [API Overview](#api-overview)

---

## Prerequisites

- **Node.js** >= 18.0.0
- **PostgreSQL** >= 14
- **Elasticsearch** >= 8.x
- **Docker** & **Docker Compose** (optional, recommended)

---

## Setup

### 1. Clone and install dependencies

```bash
git clone <repository-url>
cd ecommerce-backend
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env
# Edit .env with your actual values
```

### 3. Start backing services with Docker Compose (optional)

```bash
docker-compose up -d
```

This starts PostgreSQL and Elasticsearch with the settings matching `.env.example` defaults.

---

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `NODE_ENV` | Runtime environment (`development` / `test` / `production`) | `development` |
| `PORT` | HTTP port the server listens on | `3000` |
| `DB_HOST` | PostgreSQL hostname | `localhost` |
| `DB_PORT` | PostgreSQL port | `5432` |
| `DB_NAME` | Database name | `ecommerce_dev` |
| `DB_USER` | Database username | `postgres` |
| `DB_PASSWORD` | Database password | `postgres` |
| `TEST_DB_HOST` | PostgreSQL hostname for test suite | `localhost` |
| `TEST_DB_PORT` | PostgreSQL port for test suite | `5432` |
| `TEST_DB_NAME` | Database name for test suite | `ecommerce_test` |
| `TEST_DB_USER` | Database username for test suite | `postgres` |
| `TEST_DB_PASSWORD` | Database password for test suite | `postgres` |
| `JWT_SECRET` | Secret for signing access tokens | — |
| `JWT_EXPIRES_IN` | Access token TTL (e.g. `15m`) | `15m` |
| `JWT_REFRESH_SECRET` | Secret for signing refresh tokens | — |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token TTL (e.g. `7d`) | `7d` |
| `BCRYPT_ROUNDS` | bcrypt salt rounds | `10` |
| `ELASTICSEARCH_URL` | Elasticsearch node URL | `http://localhost:9200` |
| `ELASTICSEARCH_USERNAME` | Elasticsearch username (optional) | |
| `ELASTICSEARCH_PASSWORD` | Elasticsearch password (optional) | |
| `ELASTICSEARCH_INDEX` | Products index name | `products` |
| `RATE_LIMIT_WINDOW_MS` | Rate-limit window in milliseconds | `900000` |
| `RATE_LIMIT_MAX` | Max requests per window per IP | `100` |
| `CORS_ORIGINS` | Comma-separated allowed origins | `http://localhost:3001` |
| `LOG_LEVEL` | Winston log level | `info` |
| `LOG_DIR` | Directory for log files | `logs` |
| `PAYMENT_ADAPTER` | Payment adapter (`mock`) | `mock` |
| `PAYMENT_GATEWAY_KEY` | API key for payment gateway | |

---

## Database Migrations

Migrations live in `src/db/migrations/` and are managed by Knex.

```bash
# Run all pending migrations
npm run migrate

# Roll back the most recent batch of migrations
npm run migrate:rollback

# Create a new migration file
npm run migrate:make -- <migration_name>
```

### Migration order

| File | Table created |
|---|---|
| 001 | roles |
| 002 | users |
| 003 | user_roles |
| 004 | addresses |
| 005 | serviceable_pin_codes |
| 006 | categories |
| 007 | brands |
| 008 | products |
| 009 | product_images |
| 010 | skus |
| 011 | promo_codes |
| 012 | carts |
| 013 | cart_items |
| 014 | orders |
| 015 | order_items |
| 016 | order_status_history |
| 017 | stock_reservations |
| 018 | payment_attempts |
| 019 | refunds |
| 020 | return_requests |
| 021 | order_tracking |
| 022 | notifications |

---

## Seed Data

```bash
# Run all seed files
npm run seed

# Create a new seed file
npm run seed:make -- <seed_name>
```

Seeds populate: roles, admin user, categories, brands, sample products & SKUs, and promo codes.

---

## Running the Server

```bash
# Production
npm start

# Development (auto-reload with nodemon)
npm run dev
```

---

## Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage report
npm run test:coverage
```

Tests require the `test` database to be reachable (see `TEST_DB_*` environment variables).

---

## Module Dependency Direction (ADR)

### Decision

All modules follow a **strict top-down dependency direction**. No lower-layer module may import from a higher-layer module.

### Dependency layers (top → bottom)

```
routes  (src/modules/*/".routes.js")
  └─▶  controller  (".controller.js")
         └─▶  service  (".service.js")
                └─▶  repository  (src/db/repositories/)
                       └─▶  db client  (src/db/client.js)
```

Cross-cutting concerns (`src/config`, `src/utils`, `src/middleware`) may be imported by any layer **above** `db/client.js` but must not themselves import from any module layer.

### Rationale

- **Testability**: Each layer can be unit-tested by mocking the layer directly below it.
- **Replaceability**: The database or search adapter can be swapped without touching business logic.
- **Cycle prevention**: The `import/no-cycle` ESLint rule and `import/no-restricted-paths` enforce these boundaries automatically at lint time.

### Consequences

- Services own all business logic; controllers are thin HTTP adapters.
- Repositories own all SQL/query logic; services never write raw queries.
- Middleware is stateless and receives dependencies via closure or function argument — never via direct service imports.

---

## API Overview

All endpoints are prefixed relative to the server root. Authentication uses Bearer JWT tokens.

| Method | Path | Description |
|---|---|---|
| POST | /auth/register | Register a new user |
| POST | /auth/login | Login and receive tokens |
| POST | /auth/guest-register | Register as a guest |
| POST | /auth/forgot-password | Request password reset |
| POST | /auth/reset-password | Complete password reset |
| GET | /users/me | Get current user profile |
| PATCH | /users/me | Update current user profile |
| POST | /users/me/change-password | Change password |
| GET | /users/me/addresses | List user addresses |
| POST | /users/me/addresses | Create address |
| GET | /users/me/addresses/:addressId | Get single address |
| PUT | /users/me/addresses/:addressId | Update address |
| DELETE | /users/me/addresses/:addressId | Delete address |
| GET | /categories | List categories |
| POST | /categories | Create category (admin) |
| GET | /categories/:categoryId | Get category |
| PUT | /categories/:categoryId | Update category (admin) |
| DELETE | /categories/:categoryId | Delete category (admin) |
| GET | /categories/:categoryId/products | List products in category |
| GET | /brands | List brands |
| POST | /brands | Create brand (admin) |
| GET | /brands/:brandId | Get brand |
| GET | /products | List products |
| POST | /products | Create product (admin) |
| GET | /products/:productId | Get product |
| PUT | /products/:productId | Update product (admin) |
| DELETE | /products/:productId | Delete product (admin) |
| GET | /products/:productId/skus | List SKUs |
| POST | /products/:productId/skus | Create SKU (admin) |
| PUT | /products/:productId/skus/:skuId | Update SKU (admin) |
| GET | /products/:productId/images | List product images |
| POST | /products/:productId/images | Add product image (admin) |
| GET | /search | Search products |
| GET | /search/suggest | Search suggestions |
| GET | /carts/:cartId | Get cart |
| POST | /carts/:cartId/items | Add item to cart |
| PATCH | /carts/:cartId/items/:itemId | Update cart item |
| DELETE | /carts/:cartId/items/:itemId | Remove cart item |
| POST | /carts/:cartId/promo | Apply promo code |
| GET | /checkout/review | Review checkout |
| POST | /checkout/address | Set checkout address |
| GET | /serviceability | Check pin code serviceability |
| POST | /checkout/place-order | Place order |
| POST | /payments/initiate | Initiate payment |
| GET | /orders | List user orders |
| GET | /orders/:orderId | Get order |
| POST | /orders/:orderId/cancel | Cancel order |
| POST | /orders/:orderId/advance | Advance order status (admin) |
| GET | /orders/:orderId/timeline | Order status timeline |
| GET | /orders/:orderId/tracking | Order tracking |
| GET | /orders/:orderId/refunds | Order refunds |
| POST | /orders/:orderId/return-requests | Create return request |
| GET | /return-requests | List return requests (admin) |
| GET | /return-requests/:returnRequestId | Get return request |
| POST | /return-requests/:returnRequestId/review | Review return request (admin) |
| GET | /notifications | List notifications |
| POST | /notifications/read-all | Mark all notifications read |
| POST | /notifications/:notificationId/read | Mark notification read |
| GET | /promo-codes | List promo codes (admin) |
| GET | /admin/reports | Admin reports |
