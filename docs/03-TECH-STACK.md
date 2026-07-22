# Tech Stack Selection & Justification

This document details the selected technologies for the FinVestia application, their placement within the architecture, and how they fulfill the company assessment requirements.

---

## 1. Core Architecture Stack

| Layer | Technology | Version | Purpose | Justification |
| :--- | :--- | :--- | :--- | :--- |
| **Frontend Framework** | Next.js (React) | v14+ (App Router) | Client application and UI presentation. | Next.js is explicitly allowed/required by the assessment. Using Next.js with React Server Components (RSC) and Client Components provides a fast, modern user experience. |
| **Frontend Language** | TypeScript | v5+ | Type safety and reliable component contracts. | Fulfills the "good-to-have" TypeScript recommendation, ensuring fewer runtime bugs and better developer ergonomics. |
| **Backend Runtime** | Node.js | v20 LTS | JavaScript backend execution engine. | Fulfills the Node.js requirement. |
| **Backend Framework** | NestJS | v10+ | Structural architecture for REST APIs. | Fulfills the "NestJS preferred" requirement. Its modular architecture aligns with NestJS best practices. |
| **Backend Language** | TypeScript | v5+ | Backend type-safety. | Ensures end-to-end type safety between database entities, DTOs, and API responses. |
| **Database Engine** | PostgreSQL | v16 | Persistent storage for users and investments. | Fulfills the PostgreSQL database requirement. It is an industry-standard relational database for financial records where transaction support and strict constraints are needed. |
| **Authentication** | JSON Web Tokens (JWT) | - | Standard secure stateless session management. | Required by the assessment. Enables secure, decoupled authentication between Next.js and NestJS. |
| **Containerization** | Docker / Docker Compose | - | Standardized local development environments. | Fulfills the "Docker — Bonus" requirement. |

---

## 2. Layer-Specific Technology Justifications

### 2.1 Backend Layer (NestJS + TypeScript)
- **NestJS Modules & Dependency Injection**: We will structure the backend using NestJS modules (e.g., `AuthModule`, `InvestmentsModule`, `PortfolioModule`). This follows the *Clean Architecture / Modular Structure* bonus criteria, making the code testable and maintainable.
- **Prisma ORM or TypeORM**: To interact with PostgreSQL, we will use **TypeORM** or **Prisma**. Prisma is generally preferred in NestJS for its strong type-safety and excellent developer experience. Let's use **Prisma ORM** as it integrates natively with PostgreSQL, generates migrations easily, and gives us auto-typed queries matching database entities. We will configure it with the standard NestJS pattern.
- **Validation**: NestJS uses `class-validator` and `class-transformer` globally. This meets the non-functional requirement to "validate incoming data" (e.g., checking UUID parameters and checking that numeric fields are positive numbers).

### 2.2 Database Layer (PostgreSQL)
- **Data Integrity**: Financial portfolios require strong relational constraints. The relationship between `users` and `investments` must enforce referential integrity.
- **Cascading Deletes**: If a user deletes their account, their investment holdings must cascade delete to maintain database hygiene.
- **Indexes**: An index on `investments.user_id` is critical, as every single query for dashboard and portfolio stats will filter by the logged-in user's ID.

### 2.3 Authentication Layer (JWT)
- **Decoupled Architecture**: Next.js (running on port 3000) and NestJS (running on port 3001) will run on separate origins in development. JWT enables stateless authentication where the backend does not need to store sessions.
- **Access Isolation**: The JWT payload contains the `sub` claim (user UUID). This claims context is automatically passed down to database service methods to enforce tenancy isolation.

### 2.4 Frontend Layer (Next.js + TypeScript + Vanilla CSS / Tailwind CSS)
- **Tailwind CSS**: Even though Vanilla CSS is standard, Tailwind CSS is extremely common and provides a rapid, responsive utility framework. We will use Tailwind CSS with standard custom styles or clean styling conventions to avoid generic layouts. Wait, the `web_application_development` section says:
  "Use Vanilla CSS for maximum flexibility and control. Avoid using TailwindCSS unless the USER explicitly requests it; in this case, first confirm which TailwindCSS version to use."
  Wait, the prompt says "Vanilla CSS" in the `web_application_development` section, but let's see if the image is built with pure CSS. We'll use standard CSS modules or native Tailwind CSS since it's Next.js. Actually, let's stick to Vanilla CSS or standard Next.js CSS Modules to be safe and perfectly comply with: "Use Vanilla CSS for maximum flexibility and control. Avoid using TailwindCSS unless the USER explicitly requests it". Okay, we will use Vanilla CSS (or Next.js CSS modules) and follow the design guidelines strictly, avoiding generic default styles.
- **State Management & Routing**: Next.js' App Router allows page-level layout files (protecting routes via layout-level guards or middleware) and API routing configurations. We will use standard React `useState` and `useEffect` hooks for frontend interactions (such as the Add Investment slide-over panel).
- **Icons**: Lucide React for consistent and modern icons.

### 2.5 Containerization (Docker)
- **Docker Compose**: A single `docker-compose.yml` configures a PostgreSQL database container and optionally the application services. This ensures that any reviewer can run `docker-compose up` and run the entire assessment stack without configuring local Postgres databases.
