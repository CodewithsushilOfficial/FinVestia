# Product Requirements Document (PRD)

## 1. Product Name
**FinVestia – Finance Portfolio Tracker**

## 2. Product Overview
FinVestia is a full-stack web application designed for individual investors to track, manage, and monitor their financial investment holdings. It provides users with a clear, real-time dashboard displaying their portfolio performance metrics, including total invested amount, current portfolio value, and cumulative profits or losses.

## 3. Objective
To deliver a secure, robust, and clean minimum viable product (MVP) for a technical assessment. The application demonstrates competency in:
- Full-stack TypeScript development (NestJS on the backend, Next.js on the frontend).
- Relational database schema design and migrations using PostgreSQL.
- JWT-based authentication and secure, tenant-isolated data operations.
- Professional UI design and front-end state management.

## 4. Problem Statement
Retail investors often spread their investments across multiple platforms (stocks, mutual funds, etc.), making it difficult to understand their overall net worth and portfolio performance at a glance. FinVestia solves this by providing a unified dashboard where users can manually log their holdings and instantly see aggregate performance metrics.

## 5. Project Scope
The scope of this project is strictly defined by the assessment requirements. No speculative features (e.g., live market feeds, automated trading, multiple user roles, watchlists) will be implemented.

### In-Scope Functional Areas
- **User Authentication**: Secure user registration, password hashing, login, and JWT token issuance.
- **Investment Management (CRUD)**: Authenticated users can create, read, update, and delete their own investment records.
- **Portfolio Summary**: Dynamically calculated metrics summarizing the user's total investment, current value, total profit/loss, and net profit percentage.
- **Responsive Web UI**: High-craft, clean web interface matching the provided dashboard layout and visual aesthetics.

## 6. User Types
- **Registered User**: The sole user type. Once authenticated, the user can manage their investments and view their own portfolio summary. Unauthenticated users are redirected to the Login page.

## 7. Functional Requirements

### 7.1 Authentication & Security (AUTH)
- **AUTH-01 (Registration)**: Users must be able to create an account by providing their Name, unique Email, and Password.
- **AUTH-02 (Login)**: Registered users must be able to log in with their email and password to receive a JSON Web Token (JWT).
- **AUTH-03 (Session Persistence)**: The JWT must be securely stored on the client (e.g., HTTP-only cookie or secure localStorage) and sent with all API requests.
- **AUTH-04 (Route Protection)**: Frontend dashboard routes and all `/investments` and `/portfolio` API endpoints must require a valid JWT.

### 7.2 Investment Management (CRUD)
- **CRUD-01 (Add Investment)**: Users can create a new investment record with:
  - Name (e.g., "HDFC Flexi Cap Fund")
  - Type (e.g., "Mutual Fund", "Stock")
  - Invested Amount (Positive decimal number)
  - Current Value (Decimal number)
  - Purchase Date (Date value)
- **CRUD-02 (Read All)**: Users can view a tabular list of all their investments.
- **CRUD-03 (Read By ID)**: Users can view details of a specific investment by its UUID.
- **CRUD-04 (Update)**: Users can modify any field of an existing investment.
- **CRUD-05 (Delete)**: Users can permanently remove an investment record.

### 7.3 Portfolio Summary (PORT)
- **PORT-01 (Summary Calculation)**: The application must compute and display:
  - **Total Invested Amount**: $\sum(\text{invested\_amount})$
  - **Current Portfolio Value**: $\sum(\text{current\_value})$
  - **Profit / Loss (Absolute)**: $\text{Current Value} - \text{Total Invested}$
  - **Profit Percentage**: $(\text{Profit} / \text{Total Invested}) \times 100$. If Total Invested is 0, the percentage must safely display as 0% to avoid division-by-zero errors.

## 8. Database Requirements
- PostgreSQL database to persist user and investment tables.
- Foreign key relationship mapping investments to users (`investments.user_id -> users.id`).
- Strict row-level validation ensuring users can only query/mutate their own data.

## 9. Submission Deliverables
1. GitHub Repository Link containing the complete source code.
2. Root `README.md` containing Setup Instructions, Environment Variables, and API Documentation.
3. Database schema creation files or automated migrations.

## 10. Out-of-Scope Features (STRICT EXCLUSIONS)
- Live market data API integrations (e.g., Alpha Vantage, Yahoo Finance).
- Real transactions, wallets, or payment gateway integrations.
- Watchlists, stock searches, or news feeds.
- Multiple user roles (e.g., Admin portals) or audit logs.
- Automatic email alerts or notifications.

## 11. Mandatory vs. Bonus Requirements

| Mandatory Requirements (High Priority) | Bonus Requirements (Optional / Secondary) |
| :--- | :--- |
| User Registration & Login | Docker setup (`docker-compose` for local dev) |
| JWT Authentication & Route Guards | Deployment configuration |
| CRUD Operations for Investments | API Pagination, Sorting, and Filtering |
| Portfolio Summary Calculations | Comprehensive unit and integration tests |
| Isolated user data ownership | Modular NestJS architectural patterns |
| PostgreSQL database integration | Advanced Next.js optimizations |

## 12. Acceptance Criteria
- **AC-01**: A user cannot view, update, or delete investments belonging to another user.
- **AC-02**: The portfolio summary displays mathematically accurate values, handling edge cases (like zero holdings) gracefully.
- **AC-03**: The user interface matches the approved design spec in dashboard, card structure, and action flows.
- **AC-04**: The APIs return appropriate HTTP status codes (200/201 for success, 400/401/403/404 for errors) with descriptive error messages.
