# 🛒 Maurya Grocery — Full-Stack Grocery E-Commerce Platform

A full-stack grocery e-commerce web application with a customer storefront, cart & checkout with online payments, order tracking, and a complete admin dashboard for managing products, categories, orders, and users.

**Live App:** [grocery-ecommerce-wine-one.vercel.app](https://grocery-ecommerce-wine-one.vercel.app/)

---

## ✨ Features

### Customer
- Browse products by category, search and view product details
- Cart and checkout flow with address management
- Online payments via Razorpay, with order confirmation
- Order history, live order tracking, and order cancellation
- User authentication (register/login) with JWT, profile and saved addresses

### Admin
- Dashboard with store statistics
- Product management (create, update, delete)
- Category management
- Order management with status updates
- User management (view users, activate/deactivate accounts)
- Store settings management

---

## 🧱 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS |
| Backend | Node.js, Express |
| Database | MongoDB (Mongoose), with an in-memory fallback store for local/offline development |
| Auth | JWT (JSON Web Tokens) |
| Payments | Razorpay |
| Deployment | Vercel (Serverless Functions) |

---

## 📁 Project Structure

```
grocery-ecommerce/
├── api/
│   └── index.ts          # Vercel serverless entry point
├── app.server.ts         # Express app definition (also used for local dev)
├── server/
│   ├── config/            # Database connection
│   ├── controllers/       # Route handlers (auth, products, orders, payments, admin...)
│   ├── data/               # Seed data for categories/products/settings
│   ├── middleware/         # Auth middleware (JWT verification, admin guard)
│   ├── models/             # Mongoose schemas
│   ├── routes/             # Express routers
│   └── services/           # Data access layer (Mongo + in-memory fallback)
├── src/
│   ├── components/         # Shared UI components (Navbar, Footer, ProductCard, etc.)
│   ├── context/             # React context providers (Auth, Cart, Settings, Toast)
│   ├── pages/                # Route-level pages, including src/pages/admin/
│   ├── services/             # Frontend API client (axios)
│   └── types.ts
├── vercel.json             # Vercel rewrites (routes all /api/* to the serverless function)
└── vite.config.ts
```

---

## 🔌 API Overview

All API routes are served under `/api/*`.

| Resource | Endpoints |
|---|---|
| Auth | `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`, `PUT /api/auth/profile`, `PUT /api/auth/change-password`, address management |
| Products | `GET /api/products`, `GET /api/products/:slugOrId`, admin create/update/delete |
| Categories | `GET /api/categories`, admin create/update/delete |
| Orders | `POST /api/orders`, `GET /api/orders/my-orders`, `GET /api/orders/:id`, `POST /api/orders/:id/cancel` |
| Payments | `GET /api/payment/config`, `POST /api/payment/create-order`, `POST /api/payment/verify` |
| Settings | `GET /api/settings`, admin update |
| Admin | dashboard stats, order/user management |

---

## ⚙️ Environment Variables

Create a `.env` file in the project root (used locally; on Vercel set these under **Project Settings → Environment Variables**):

```env
# MongoDB connection string. If omitted, the app runs on an in-memory
# fallback store automatically (useful for local development).
MONGODB_URI=your_mongodb_atlas_connection_string

# Secret used to sign JWT auth tokens
JWT_SECRET=your_jwt_secret

# Razorpay API keys (required for online payments)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

> ⚠️ If you're deploying on Vercel with a MongoDB Atlas cluster, make sure your Atlas cluster's **Network Access** allows connections from `0.0.0.0/0` (Anywhere) — Vercel serverless functions don't use fixed IP addresses.

---

## 🚀 Getting Started (Local Development)

```bash
# 1. Clone the repository
git clone https://github.com/badalmaurya-code/grocery-ecommerce.git
cd grocery-ecommerce

# 2. Install dependencies
npm install

# 3. Set up your .env file (see Environment Variables above)

# 4. Run the dev server (frontend + backend together)
npm run dev
```

The app will be available at `http://localhost:3000` (or the port shown in your terminal).

---

## 📦 Build & Deploy

```bash
npm run build   # Builds the frontend (Vite) and bundles the Express server into dist/server.cjs
npm run start   # Runs the built server locally (production mode)
```

### Deploying to Vercel

This project is configured to deploy on Vercel as a serverless function:
- `api/index.ts` is the serverless entry point and imports the pre-built server bundle (`dist/server.cjs`).
- `vercel.json` rewrites all `/api/*` requests to that single function.
- The **Build Command** in Vercel Project Settings should be `npm run build` (this ensures `dist/server.cjs` is generated before the function is deployed).
- `vite`, `mongoose`, and `bcryptjs` are kept external during the server bundle step to avoid runtime issues with native/optional dependencies — see the `build` script in `package.json`.

---

## 📄 License

This project is for educational/personal portfolio purposes.

---

## 📬 Contact

**Badal Maurya**
- GitHub: [@badalmaurya-code](https://github.com/badalmaurya-code)
- LinkedIn: [badal-maurya](https://www.linkedin.com/in/badal-maurya-14948a256)
- Email: badalmaurya101@gmail.com
