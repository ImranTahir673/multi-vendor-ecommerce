# Multi-Vendor MERN E-Commerce Platform (Becodemy Series)

A production-grade, full-stack multi-vendor e-commerce marketplace built on the MERN stack with real-time Socket.io messaging, Stripe payments, multi-vendor cart splitting, and comprehensive management portals for Buyers, Sellers, and Platform Administrators.

---

## Architecture Overview

```
multi-vendor-ecommerce/
├── backend/          # Express 4.19 REST API (Port 8000)
│   ├── config/       # Environment configuration (.env.example, .env)
│   ├── controller/   # 10 business routers (user, shop, product, event, order, payment, etc.)
│   ├── db/           # MongoDB Mongoose 8.3 connection
│   ├── middleware/   # Dual JWT auth (isAuthenticated, isSeller, isAdmin) & Error handlers
│   ├── model/        # 9 Mongoose schemas (User, Shop, Product, Event, Order, etc.)
│   ├── utils/        # Nodemailer, JWT generator, ErrorHandler
│   ├── app.js        # Express application middleware configuration
│   └── server.js     # Server entrypoint
├── frontend/         # React 18 SPA + Redux Toolkit + Tailwind CSS (Port 3000)
│   ├── public/       # HTML template, assets
│   ├── src/
│   │   ├── components/  # Modular UI components (Layout, Products, Profile, Shop, Admin)
│   │   ├── pages/       # Storefront, Seller portal, and Admin dashboard pages
│   │   ├── redux/       # Redux Toolkit store, reducers, and async actions
│   │   ├── routes/      # ProtectedRoute, SellerProtectedRoute, ProtectedAdminRoute
│   │   ├── static/      # Navigation links, categories, branding data
│   │   └── styles/      # Shared Tailwind CSS design tokens
├── socket/           # Socket.io microservice for real-time messaging (Port 4000)
│   ├── index.js      # Socket connection, room, and event handlers
└── CASE_STUDY.md     # Detailed DevWeekends fellowship case study report
```

---

## Key Features

### Buyer Storefront
- **Live Search & Filter**: Real-time product search suggestions and category filtering.
- **Cart & Wishlist**: Slide-over drawer modals with local storage persistence and quantity controls.
- **Coupon Engine**: Validates shop-specific discount coupons and calculates deductions.
- **Secure Checkout**: Stripe card tokenization (Elements) and Cash on Delivery (COD).
- **Shipment Tracking**: Visual status timeline ("Processing" → "Transferred" → "Shipping" → "Received" → "Delivered").
- **Product Reviews & Refunds**: Customers can rate verified purchases and initiate return requests.
- **Real-Time Vendor Chat**: Instant duplex messaging with store owners.

### Seller Portal (Vendor Dashboard)
- **Storefront Management**: Public store profile with reviews, ratings, and active events.
- **Catalog Management**: Multi-image product uploads with price, discount, and stock tracking.
- **Promotional Events**: Flash sales with real-time countdown clocks.
- **Order Pipeline**: Step-by-step order processing with automatic inventory deduction and net seller balance payout (10% platform fee deducted).
- **Payout Withdrawals**: Connect bank accounts and request fund withdrawals.
- **Seller Inbox**: Real-time customer support chat powered by Socket.io.

### Platform Administration
- **Marketplace Overview**: Platform commission metrics, total sellers, and total orders.
- **Moderation**: Manage registered users and verified sellers with one-click revocation.
- **Withdrawal Approvals**: Review and approve seller payout requests.

---

## Quick Start Guide

### Prerequisites
- Node.js (v18+ or v24)
- MongoDB (Local instance or MongoDB Atlas URI)
- Stripe Account (Publishable & Secret keys)

### 1. Setup Backend
```bash
cd backend
cp config/.env.example config/.env
npm install
npm run dev
```

### 2. Setup Socket Service
```bash
cd socket
npm install
npm start
```

### 3. Setup Frontend
```bash
cd frontend
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the marketplace.
