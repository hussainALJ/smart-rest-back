# Smart Restaurant Backend

A RESTful API backend for a smart restaurant management system with QR-based ordering, real-time kitchen display, and multi-role staff access. Built with Node.js, Express, Prisma, PostgreSQL (Neon), and Socket.IO.

---

## Tech Stack

- **Runtime:** Node.js (ES Modules)
- **Framework:** Express 5
- **Database:** PostgreSQL via [Neon](https://neon.tech) (serverless)
- **ORM:** Prisma 7 with `@prisma/adapter-neon`
- **Auth:** JWT (`jsonwebtoken`) + bcrypt
- **Validation:** Zod 4
- **Realtime:** Socket.IO 4
- **QR Generation:** `qrcode`

---

## Project Structure

```
├── prisma/
│   ├── schema.prisma         # Database schema
│   ├── migrations/           # SQL migration history
│   └── seed.js               # Admin user seeder
├── src/
│   ├── controllers/          # Route handler logic
│   ├── lib/
│   │   ├── prisma.js         # Prisma client singleton
│   │   └── catchAsync.js     # Async error wrapper
│   ├── middlewares/
│   │   ├── authenticate.js   # JWT verification
│   │   ├── isAdmin.js        # Admin-only guard
│   │   ├── isCashier.js      # Cashier/Admin guard
│   │   ├── validate.js       # Zod body validation
│   │   └── errorHandler.js   # Global error handler
│   ├── router/               # Express route definitions
│   ├── socket/
│   │   └── index.js          # Socket.IO event handlers
│   ├── validations/          # Zod schemas
│   └── server.js             # App entry point
├── prisma.config.ts
├── package.json
└── .env
```

---

## Getting Started

### Prerequisites

- Node.js >= 20.19
- A PostgreSQL database (e.g. [Neon](https://neon.tech))

### Installation

```bash
git clone https://github.com/hussainALJ/smart-rest-back.git
cd smart-rest-back
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require
JWT_SECRET=your_jwt_secret_here
ADMIN_USERNAME=admin
ADMIN_PASSWORD=yourpassword
FRONTEND_URL=http://localhost:5173
PORT=3000
```

### Database Setup

Run migrations and seed the initial admin user:

```bash
npx prisma migrate deploy
npx prisma db seed
```

### Development

```bash
npm run dev
```

The server starts at `http://localhost:3000`.

---

## API Reference

All protected routes require a `Bearer <token>` in the `Authorization` header.

### Auth

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/login` | Public | Authenticate and receive JWT |

**Request body:**
```json
{ "username": "admin", "password": "yourpassword" }
```

---

### Menu Items

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/menu` | Public | List all menu items (with category) |
| POST | `/api/menu` | Admin | Create a menu item |
| PUT | `/api/menu/:id` | Admin | Update a menu item (partial) |
| DELETE | `/api/menu/:id` | Admin | Delete a menu item |

---

### Categories

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/categories` | Public | List all categories |
| POST | `/api/categories` | Admin | Create a category |
| DELETE | `/api/categories/:id` | Admin | Delete a category |

---

### Tables

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/tables` | Cashier / Admin | List tables with active session info |
| POST | `/api/tables` | Admin | Add a new table (auto-generates QR code) |
| DELETE | `/api/tables/:id` | Admin | Delete a table |

---

### Sessions

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/sessions/start` | Public | Start or rejoin a session for a table |
| GET | `/api/sessions/:id/bill` | Public | Get session bill with all orders and total |
| PUT | `/api/sessions/:id/checkout` | Cashier / Admin | Close session and free the table |

---

### Orders

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/orders` | Public | Place a new order for an active session |
| GET | `/api/orders` | Authenticated | List all orders |
| PUT | `/api/orders/:id/status` | Authenticated | Update order status (role-restricted) |

**Allowed status transitions by role:**

| Role | Allowed statuses |
|------|-----------------|
| Chef | `Preparing`, `Ready`, `Canceled` |
| Waiter | `Served` |
| Cashier | `Paid` |
| Admin | All statuses |

---

### Stats

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/stats` | Admin | Daily sales, order count, active tables, top items |

---

## Roles

| Role | Permissions |
|------|------------|
| **Admin** | Full access to all endpoints |
| **Chef** | View orders, update to Preparing / Ready / Canceled |
| **Waiter** | Update orders to Served |
| **Cashier** | View tables, manage billing, update orders to Paid |

---

## Real-time Events (Socket.IO)

### Client → Server

| Event | Payload | Description |
|-------|---------|-------------|
| `join` | `{ role?, table_id? }` | Join a role or table room |
| `callWaiter` | `{ table_id, session_id }` | Alert waiter staff |
| `requestBill` | `{ table_id, session_id }` | Alert cashier for bill |

### Server → Client

| Event | Emitted to | Description |
|-------|-----------|-------------|
| `newOrder` | `Chef` room | New order placed |
| `statusUpdate` | `Waiter`, `Cashier`, `table_<id>` rooms | Order status changed |
| `callWaiter` | `Waiter` room | Customer called a waiter |
| `requestBill` | `Cashier` room | Customer requested the bill |

---

## Database Schema

```
Users          → id, username, password, role
Tables         → id, qr_code_url, status
Categories     → id, name
MenuItems      → id, category_id, name, description, price, image_url, is_available
Sessions       → id, table_id, status, created_at, closed_at
Orders         → id, session_id, status, created_at
OrderItems     → id, order_id, menu_item_id, quantity, notes, price_at_time
```

**Order statuses:** `Pending` → `Preparing` → `Ready` → `Served` → `Paid` / `Canceled`

**Session statuses:** `Active` / `Closed`

**Table statuses:** `Available` / `Occupied`

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with nodemon |
| `npx prisma migrate dev` | Create and apply a new migration |
| `npx prisma migrate deploy` | Apply migrations in production |
| `npx prisma db seed` | Seed the admin user |
| `npx prisma studio` | Open Prisma Studio (database UI) |