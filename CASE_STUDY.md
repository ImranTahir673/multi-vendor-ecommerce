# Comprehensive Case Study: Multi-Vendor MERN E-Commerce Architecture

**Fellowship Project Submission:** DevWeekends Web Development Fellowship  
**Project:** Flagship Multi-Vendor E-Commerce Platform (Becodemy Series)  
**Author:** Imran Tahir  
**Stack:** React 18, Redux Toolkit, Node.js 24, Express 4.19, MongoDB (Mongoose 8.3), Socket.io, Stripe, Tailwind CSS  
**Repository:** [GitHub Repository](https://github.com/ImranTahir673/multi-vendor-ecommerce)  

---

## Executive Summary

This case study documents the design, architecture, implementation, and engineering modernizations executed for the **Multi-Vendor MERN E-Commerce Platform**. 

The platform supports a decentralized marketplace model consisting of three distinct participant roles:
1. **Buyers / Customers**: Browse catalog, filter by categories, search in real-time, manage wishlists and cart, apply vendor discount vouchers, execute multi-vendor checkout via Stripe or Cash on Delivery, track shipments, submit product ratings & reviews, and chat live with store owners.
2. **Independent Sellers / Vendors**: Register storefronts, manage multi-image product listings and promotional countdown events, generate custom coupon codes, fulfill orders through a step-by-step pipeline ("Processing" → "Transferred to delivery partner" → "Shipping" → "Received" → "On the way" → "Delivered"), handle returns/refunds, inspect net account balances (with automatic 10% platform fee deduction), and request payout withdrawals to connected bank accounts.
3. **Platform Administrators**: Supervise system-wide health, track cumulative platform fee revenue, moderate buyers, inspect and deactivate vendor shops, audit marketplace transactions, and approve or reject payout withdrawals.

---

## 1. Architectural Blueprint

The application follows a distributed decoupled architecture designed for scalability, low-latency client interaction, and modular deployment:

```
                  +----------------------------------------------+
                  |               Client Browser                 |
                  |     (React 18 + Redux Toolkit + Tailwind)    |
                  +----------------------+-----------------------+
                                         |
                   +---------------------+---------------------+
                   | HTTP / REST (CORS)                        | WebSockets (WSS)
                   v                                           v
       +-------------------------+                 +-----------------------+
       |   Backend REST API      |                 |  Socket Microservice  |
       |  (Express 4.19, Port    |                 |   (Socket.io, Port    |
       |         8000)           |                 |         4000)         |
       +------------+------------+                 +-----------+-----------+
                    |                                          |
     +--------------+-------------+                            | Real-time
     |              |             |                            | message
     v              v             v                            | broadcast
+----------+  +-----------+  +----------+                      |
| MongoDB  |  |  Stripe   |  |Cloudinary|                      v
| Database |  | Payments  |  |  Media   |             +-----------------+
+----------+  +-----------+  +----------+             | Connected Peers |
                                                      +-----------------+
```

### Component Breakdown
1. **Frontend Client (`/frontend`)**: Single Page Application built on React 18 and React Router DOM 6. State management is organized into discrete slices using Redux Toolkit (`user`, `seller`, `products`, `events`, `cart`, `wishlist`, `order`). Styled with modular Tailwind CSS utility classes and modern icons from `react-icons`.
2. **RESTful Core Engine (`/backend`)**: Built with Express 4.19 and Node.js. Handles business logic, role-based authorization (JWT cookies for buyers and sellers), multi-vendor order partitioning, transaction auditing, and asset pipeline integration.
3. **Real-Time Communication Service (`/socket`)**: Standalone Socket.io microservice managing persistent duplex connections for real-time buyer-seller messaging, typing statuses, and instant delivery indicators.
4. **Cloud Persistence & Microservices**:
   - **MongoDB Atlas**: Document storage using schema validation with Mongoose 8.3.
   - **Cloudinary**: Cloud media hosting with dynamic optimization for product photos, store logos, and user avatars.
   - **Stripe API**: Level-1 PCI-compliant payment gateway supporting card tokenization and intent authorization.
   - **Nodemailer / SMTP**: Asynchronous transactional notifications and tokenized email activations.

---

## 2. Database Schema & Data Models

The system defines 9 interdependent Mongoose models:

| Model | Primary Purpose | Key Fields |
|---|---|---|
| **User** | Customer identity & authentication | `name`, `email`, `password` (bcrypt hash), `phoneNumber`, `addresses[]`, `role`, `avatar`, `resetPasswordToken` |
| **Shop** | Independent seller storefront | `name`, `email`, `password`, `description`, `address`, `phoneNumber`, `role` ("Seller"), `avatar`, `zipCode`, `withdrawMethod`, `availableBalance`, `transactions[]` |
| **Product** | Marketplace inventory item | `name`, `description`, `category`, `tags`, `originalPrice`, `discountPrice`, `stock`, `images[]`, `reviews[]`, `ratings`, `shopId`, `shop`, `sold_out` |
| **Event** | Time-limited promotional campaign | Same as product plus `start_Date`, `Finish_Date`, `status` ("Running") |
| **CoupounCode** | Shop-specific discount voucher | `name`, `value` (%), `minAmount`, `maxAmount`, `shopId`, `selectedProduct` |
| **Order** | Vendor-specific order record | `cart[]`, `shippingAddress`, `user`, `totalPrice`, `status`, `paymentInfo`, `paidAt`, `deliveredAt` |
| **Conversation** | Chat thread metadata | `groupTitle` (`productId` + `userId`), `members[]` (`userId`, `sellerId`), `lastMessage`, `lastMessageId` |
| **Messages** | Discrete chat communication | `conversationId`, `text`, `sender`, `images` |
| **Withdraw** | Seller balance withdrawal request | `seller`, `amount`, `status` ("Processing" \| "Succeed"), timestamps |

---

## 3. Engineering Highlights & Complex Logic

### 3.1 Multi-Vendor Cart Splitting Engine

In a multi-vendor platform, a buyer can add items from different sellers to a single shopping cart and execute a unified checkout transaction. Processing this at the database level requires order partitioning:

```javascript
// Order creation logic partitioning cart items per vendor
const shopItemsMap = new Map();

for (const item of cart) {
  const shopId = item.shopId;
  if (!shopItemsMap.has(shopId)) {
    shopItemsMap.set(shopId, []);
  }
  shopItemsMap.get(shopId).push(item);
}

// Create discrete order documents per vendor
for (const [shopId, items] of shopItemsMap) {
  const order = await Order.create({
    cart: items,
    shippingAddress,
    user,
    totalPrice: items.reduce((acc, i) => acc + i.discountPrice * i.qty, 0),
    paymentInfo,
  });
}
```

This guarantees that:
- Each vendor only sees, updates, and fulfills the segment of items they own.
- Delivery progress can proceed asynchronously per seller without blocking other sellers.
- Customer ratings and reviews are scoped directly to the vendor's products.

### 3.2 Automated Platform Commission & Seller Settlement

When a vendor marks an order status as **"Delivered"**:
1. The backend verifies that the order is not already marked delivered to prevent double payouts.
2. The product `stock` is decremented in MongoDB by the ordered quantity, and `sold_out` is incremented.
3. The platform deducts a 10% marketplace commission fee:
   $$\text{Seller Payout} = \text{Order Total} \times 0.90$$
4. The remaining 90% is atomically credited to the vendor's `availableBalance` using `$inc`.

### 3.3 Security & Role-Based Dual JWT Authentication

The application uses two separate JWT cookie authentication tokens:
- `token`: Issued to authenticated buyers. Verified by `isAuthenticated` middleware.
- `seller_token`: Issued to authenticated shop owners. Verified by `isSeller` middleware.

This prevents privilege escalation and ensures a user can simultaneously act as a buyer and a seller in the same browser session without session pollution.

Platform administrators are protected by `isAdmin` middleware, which verifies `req.user.role === "Admin"`.

---

## 4. Modern Node.js & Mongoose 8 Compatibility Upgrades

During development, multiple technical debt items from the original tutorial codebase were identified and modernized:

1. **Mongoose 8 Deprecations**:
   - The reference repo relied on `product.remove()` and `event.remove()`, which are completely removed in Mongoose 8. We refactored all delete endpoints across controllers to use `Product.findByIdAndDelete(id)` and `Event.findByIdAndDelete(id)`.
2. **Null Pointer Bugfix in Events Controller**:
   - In `delete-shop-event/:id` in the reference repository, the code mistakenly queried `product` instead of `event`, causing a silent crash when deleting promotional events. This was rectified.
3. **Cloudinary Resilient Fallbacks**:
   - Cloudinary upload triggers in `user` and `shop` registration are wrapped in try-catch fallbacks with default avatar URLs, ensuring registrations never crash even if third-party cloud credentials or SMTP services are unconfigured in development.
4. **React 18 & Modern Hook Compliance**:
   - Built with modern React 18 hooks (`useState`, `useEffect`, `useRef`, `useParams`, `useNavigate`) and Redux Toolkit slices.

---

## 5. Deployment Guide & Production Verification

### Local Execution Commands
```bash
# 1. Run Backend API (Port 8000)
cd backend
npm run dev

# 2. Run Socket Server (Port 4000)
cd socket
npm start

# 3. Run Frontend Storefront (Port 3000)
cd frontend
npm start
```

### Production Build Verification
The frontend compiles into an optimized static bundle ready for CDN or static web serving (e.g. Vercel, Netlify, Render, AWS S3 + CloudFront):
```bash
cd frontend
npm run build
```

---

## 6. Fellowship Deliverables Checklist

- [x] Full multi-vendor marketplace architecture implemented.
- [x] Multi-vendor order splitting per shop ID.
- [x] Product & promotional event management with live countdowns.
- [x] Coupon discount engine with cart threshold validations.
- [x] Real-time duplex buyer-to-seller chat via Socket.io.
- [x] Stripe card tokenization & Cash on Delivery (COD) workflows.
- [x] Multi-role authentication (Buyer, Seller, Admin).
- [x] Production build tested and verified.
- [x] Case study document completed per DevWeekends requirements.
