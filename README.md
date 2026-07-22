# FinVestia – Finance Portfolio Tracker

FinVestia is a secure, full-stack financial portfolio tracker application built as a company technical assessment. It enables authenticated users to register, log in, catalog their investment holdings, and view dynamic summary statistics of their net portfolio performance.

---

## 🚀 Key Features
- **User Authentication**: Secure user registration and login endpoints utilizing Bcrypt password hashing and JWT access tokens.
- **Holdings Management (CRUD)**: Create, Read, Update, and Delete actions for investments (supports Stocks, Mutual Funds, Crypto, etc.).
- **Strict Tenancy Isolation**: Data queries are strictly scoped to the authenticated session context. A user can never read, modify, or delete investments owned by another tenant.
- **Calculated Portfolio Summary**: Dynamic math aggregates:
  - **Total Invested Amount**: Sum of original capital deployed.
  - **Current Value**: Sum of current valuation.
  - **Net Profit/Loss**: Value difference (colored green/red).
  - **Profit Percentage**: Net return rate (handles zero holding cases safely to prevent division-by-zero).
- **Responsive Dashboard UI**: A high-craft web interface matching approved design layouts (dark left navigation, summary metric cards, slide-over drawers).

---

## 🛠️ Technology Stack
- **Frontend**: Next.js 16 (App Router), TypeScript, Vanilla CSS design tokens.
- **Backend**: Node.js, NestJS, TypeScript, Passport JWT.
- **Database**: PostgreSQL (using Prisma ORM 7).
- **Containerization**: Docker & Docker Compose.

---

## 📁 Repository Structure
```text
FinVestia/
├── backend/                        # NestJS API Backend
│   ├── prisma/
│   │   ├── schema.prisma           # Prisma database schema definition
│   │   └── migrations/             # Generated PostgreSQL migrations
│   ├── src/
│   │   ├── auth/                   # Authentication & Session Module
│   │   │   ├── dto/                # Registration & Login DTO schemas
│   │   │   ├── auth.controller.ts  # Public auth API routes
│   │   │   ├── auth.service.ts     # Password hashing & JWT generation
│   │   │   ├── get-user.decorator.ts
│   │   │   ├── jwt-auth.guard.ts
│   │   │   ├── jwt.strategy.ts
│   │   │   └── auth.module.ts
│   │   ├── investments/            # Investment Holdings CRUD Module
│   │   │   ├── dto/                # Create & Update validations DTOs
│   │   │   ├── investments.controller.ts
│   │   │   ├── investments.service.ts
│   │   │   └── investments.module.ts
│   │   ├── portfolio/              # Summary Aggregates calculations
│   │   │   ├── portfolio.controller.ts
│   │   │   ├── portfolio.service.ts
│   │   │   └── portfolio.module.ts
│   │   ├── prisma/                 # Global Prisma Database client Service
│   │   │   ├── prisma.service.ts
│   │   │   └── prisma.module.ts
│   │   ├── app.module.ts           # Root application module
│   │   └── main.ts                 # App entry (registers CORS & Validation)
│   ├── Dockerfile
│   ├── prisma.config.ts
│   └── .env.example
├── frontend/                       # Next.js Web Client
│   ├── src/
│   │   └── app/                    # Next.js App Router Pages
│   │       ├── dashboard/
│   │       │   └── page.tsx        # Main holdings view & CRUD panel
│   │       ├── login/
│   │       │   └── page.tsx        # Login authentication screen
│   │       ├── register/
│   │       │   └── page.tsx        # Account registration screen
│   │       ├── globals.css         # CSS tokens & layout theme styling
│   │       ├── layout.tsx          # Font load Outfit + Inter & Metadata
│   │       └── page.tsx            # Session status auto-redirect loader
│   │   └── utils/
│   │       └── api.ts              # API client and JWT fetch wrapper
│   └── Dockerfile
├── docs/                           # Technical Specifications Directory
├── docker-compose.yml              # Multi-container Compose runner
└── README.md
```

---

## ⚙️ Environment Variables Config

### Backend Configuration (`backend/.env`)
Create a `.env` file in the `backend/` directory based on the following template:
```env
# Database connection string
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/finvestia?schema=public"

# JWT token signing secret
JWT_SECRET="super-secret-key-12345-portfolio-tracker"

# API Service Port
PORT=3001
```

---

## 🏃 Local Setup Instructions

### Prerequisites
- Node.js (v20+ LTS)
- npm (v10+)
- PostgreSQL database server running locally OR Docker Desktop.

### Option A: Running with Docker Compose (Recommended)
This boots the PostgreSQL DB, backend NestJS API, and frontend Next.js app inside a shared container network:
1. Ensure Docker Desktop is running on your system.
2. In the root directory, run:
   ```bash
   docker-compose up --build
   ```
3. Access the Next.js client at `http://localhost:3000`. The NestJS API compiles and listens at `http://localhost:3001`.

### Option B: Running Bare-Metal / Locally
To run services in local terminal windows:

#### 1. Database Setup
Ensure PostgreSQL is active. Run a local container for the DB:
```bash
docker run --name finvestia-postgres -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=finvestia -p 5432:5432 -d postgres:16
```

#### 2. Backend API Setup
1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run Prisma migrations and generate types:
   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```
4. Start the NestJS server:
   ```bash
   npm run start
   # or for watch mode: npm run start:dev
   ```

#### 3. Frontend Web Client Setup
1. Open a separate terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Next.js client dev server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:3000`.

---

## 📑 API Specifications Reference

All protected endpoints require passing a JWT token in the headers:
`Authorization: Bearer <your_jwt_token>`

### 1. Public Authentication Endpoints

#### `POST /auth/register`
Creates a new user profile.
- **Request Body**:
  ```json
  {
    "name": "Sushil Kumar",
    "email": "sushil@example.com",
    "password": "SecurePassword123"
  }
  ```
- **Success Response (201 Created)**:
  ```json
  {
    "id": "e5c709e8-4680-4965-b541-6927a718b560",
    "name": "Sushil Kumar",
    "email": "sushil@example.com"
  }
  ```

#### `POST /auth/login`
Validates user credentials and returns JWT session token.
- **Request Body**:
  ```json
  {
    "email": "sushil@example.com",
    "password": "SecurePassword123"
  }
  ```
- **Success Response (200 OK)**:
  ```json
  {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "e5c709e8-4680-4965-b541-6927a718b560",
      "name": "Sushil Kumar",
      "email": "sushil@example.com"
    }
  }
  ```

---

### 2. Protected Investments Endpoints

#### `POST /investments`
Creates a new holding for the active user.
- **Request Body**:
  ```json
  {
    "investmentName": "HDFC Flexi Cap Fund",
    "investmentType": "Mutual Fund",
    "investedAmount": 10000.00,
    "currentValue": 12500.00,
    "purchaseDate": "2026-06-01"
  }
  ```
- **Success Response (201 Created)**:
  ```json
  {
    "id": "8c772ea5-c603-4c91-9e79-bc22fb185672",
    "investmentName": "HDFC Flexi Cap Fund",
    "investmentType": "Mutual Fund",
    "investedAmount": "10000.00",
    "currentValue": "12500.00",
    "purchaseDate": "2026-06-01T00:00:00.000Z",
    "createdAt": "2026-07-22T13:59:02.000Z",
    "updatedAt": "2026-07-22T13:59:02.000Z"
  }
  ```

#### `GET /investments`
Lists all investments owned by the caller.
- **Success Response (200 OK)**: Array of investment records.

#### `GET /investments/:id`
Retrieves a specific holding detail by its UUID.
- **Success Response (200 OK)**: Single investment object.

#### `PUT /investments/:id`
Updates investment values (all payload fields are optional).
- **Request Body**:
  ```json
  {
    "currentValue": 13000.00
  }
  ```
- **Success Response (200 OK)**: Updated investment object.

#### `DELETE /investments/:id`
Removes the investment record from the database.
- **Success Response (200 OK)**:
  ```json
  {
    "message": "Investment successfully removed"
  }
  ```

---

### 3. Protected Portfolio Endpoints

#### `GET /portfolio/summary`
Retrieves aggregate returns across all user holdings.
- **Success Response (200 OK)**:
  ```json
  {
    "totalInvested": 50000.00,
    "currentValue": 62000.00,
    "profit": 12000.00,
    "profitPercentage": 24.00
  }

---

## 🌐 Railway Deployment

The backend API and PostgreSQL database are deployed to Railway under a production configuration.

* **Backend API Base URL**: `https://finvestia-backend-production.up.railway.app`
* **Database Target**: Railway PostgreSQL Service (`Postgres`)

### Frontend Integration
When deploying a frontend client that communicates with this backend, configure the backend API URL as an environment variable:
```env
# Example for Next.js frontend
NEXT_PUBLIC_API_URL="https://finvestia-backend-production.up.railway.app"
```

### Backend Production Environment Variables
Configure these variables in your Railway backend service settings:
* `NODE_ENV`: `production`
* `PORT`: `3001` (matches container port mapping)
* `DATABASE_URL`: `postgresql://${{Postgres.PGUSER}}:${{Postgres.PGPASSWORD}}@${{Postgres.PGHOST}}:${{Postgres.PGPORT}}/${{Postgres.PGDATABASE}}?schema=public` (automatically links to the Postgres service using reference variables)
* `JWT_SECRET`: A secure randomly generated string for signing JWT tokens.
* `FRONTEND_URL`: Comma-separated list of CORS-approved frontend origins (e.g., `https://your-frontend.vercel.app`).

### Production Scripts & Migration Process
* **Production Build Command**: `npm run build` (compiles NestJS to `dist/src/main.js`)
* **Production Start Command**: `npm run start:prod` (executes `node dist/src/main`)
* **Database Migration Command**: `npx prisma migrate deploy` (automatically run on container start before launching the web server)
  ```
