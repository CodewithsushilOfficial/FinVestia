# Development Plan & Phase Checklist

This document structures the phase-by-phase implementation plan for the FinVestia application.

---

## Phase 0: Requirements & Documentation

### Task P00-T01: Create Initial Specifications
- **Objective**: Review the company assessment and draft PRD, SRS, Tech Stack, Architecture, UI Design, Workflow, Database, and API specs.
- **Files Affected**:
  - `docs/01-PRD.md` to `docs/09-SECURITY.md`
- **Dependencies**: None.
- **Acceptance Criteria**: All specifications are detailed, checked for contradictions, and reviewed.
- **Status**: [x] Completed

### Task P00-T02: Formulate Requirement Traceability Matrix
- **Objective**: Construct a mapping showing which code component and verification validates each requirement.
- **Files Affected**:
  - `docs/10-DEVELOPMENT-PLAN.md` (this file)
- **Dependencies**: P00-T01
- **Acceptance Criteria**: A traceability table is created mapping assessment features to API endpoints and UI screens.
- **Status**: [x] Completed

---

## Phase 1: Project Foundation

### Task P01-T01: Backend Project Setup
- **Objective**: Initialize NestJS framework backend with configurations.
- **Files Affected**:
  - `backend/package.json`
  - `backend/tsconfig.json`
  - `backend/src/main.ts`
- **Dependencies**: Phase 0.
- **Acceptance Criteria**: Clean compilation of standard NestJS workspace. Server boots on port 3001.
- **Status**: [ ] Pending

### Task P01-T02: Frontend Project Setup
- **Objective**: Initialize Next.js frontend with TypeScript and styling layout modules.
- **Files Affected**:
  - `frontend/package.json`
  - `frontend/src/app/layout.tsx`
- **Dependencies**: Phase 0.
- **Acceptance Criteria**: Running Next.js server on port 3000 showing standard starter page.
- **Status**: [ ] Pending

---

## Phase 2: PostgreSQL Database Setup

### Task P02-T01: ORM & Connection Initialisation
- **Objective**: Setup Prisma ORM inside the NestJS application and define schemas.
- **Files Affected**:
  - `backend/prisma/schema.prisma`
  - `backend/.env`
- **Dependencies**: P01-T01.
- **Acceptance Criteria**: Prisma schemas mirror the database requirements document, and client compiles successfully.
- **Status**: [ ] Pending

### Task P02-T02: Run Database Migrations
- **Objective**: Run Prisma migration to generate tables and constraint indexes.
- **Files Affected**:
  - `backend/prisma/migrations/`
- **Dependencies**: P02-T01.
- **Acceptance Criteria**: Verify database tables `users` and `investments` exist in PostgreSQL database.
- **Status**: [ ] Pending

---

## Phase 3: Backend Authentication

### Task P03-T01: Implement Registration Endpoint
- **Objective**: Build `POST /auth/register` with Bcrypt password hashing.
- **Files Affected**:
  - `backend/src/auth/`
  - `backend/src/users/`
- **Dependencies**: Phase 2.
- **Acceptance Criteria**: Sending a valid payload returns the created user (sans password). Sending an existing email returns 409 Conflict.
- **Status**: [ ] Pending

### Task P03-T02: Implement Login & JWT Generation
- **Objective**: Build `POST /auth/login` to authenticate credentials and sign a JWT.
- **Files Affected**:
  - `backend/src/auth/`
- **Dependencies**: P03-T01.
- **Acceptance Criteria**: Returns `accessToken` on valid credentials, 401 Unauthorized on invalid passwords.
- **Status**: [ ] Pending

---

## Phase 4: Backend Investment CRUD

### Task P04-T01: Define Investment Schemas & DTOs
- **Objective**: Create data contracts and class validators for investments creation and updates.
- **Files Affected**:
  - `backend/src/investments/dto/`
- **Dependencies**: Phase 3.
- **Acceptance Criteria**: Inbound payload checking works: rejects negative amounts and non-ISO date formats.
- **Status**: [ ] Pending

### Task P04-T02: Implement Investment API Handlers
- **Objective**: Code controllers and database service layers for CRUD actions.
- **Files Affected**:
  - `backend/src/investments/`
- **Dependencies**: P04-T01.
- **Acceptance Criteria**: Endpoints: `POST /investments`, `GET /investments`, `GET /investments/:id`, `PUT /investments/:id`, `DELETE /investments/:id` work correctly and isolate tenant records using current user context.
- **Status**: [ ] Pending

---

## Phase 5: Backend Portfolio Summary

### Task P05-T01: Aggregate API Implementation
- **Objective**: Build `GET /portfolio/summary` endpoint.
- **Files Affected**:
  - `backend/src/portfolio/`
- **Dependencies**: Phase 4.
- **Acceptance Criteria**: Calculates accurate aggregate sums and returns totalInvested, currentValue, profit, and profitPercentage. Handles zero holding cases cleanly.
- **Status**: [ ] Pending

---

## Phase 6: Frontend Authentication UI

### Task P06-T01: Build Registration Page
- **Objective**: Code register page matching design visual system.
- **Files Affected**:
  - `frontend/src/app/register/`
- **Dependencies**: P01-T02.
- **Acceptance Criteria**: Submitting registration parameters hits the API and routes user to `/login` upon success.
- **Status**: [ ] Pending

### Task P06-T02: Build Login Page
- **Objective**: Code login page, store returned JWT in cookies, and redirect to dashboard.
- **Files Affected**:
  - `frontend/src/app/login/`
- **Dependencies**: P06-T01.
- **Acceptance Criteria**: Valid login securely stores JWT and directs client browser to `/dashboard`.
- **Status**: [ ] Pending

---

## Phase 7: Frontend Investments Dashboard

### Task P07-T01: Layout, Sidebar, & Navigation Setup
- **Objective**: Setup layout structure with left sidebar and active links matching approved wireframes.
- **Files Affected**:
  - `frontend/src/components/layout/`
  - `frontend/src/app/dashboard/`
- **Dependencies**: Phase 6.
- **Acceptance Criteria**: Shows left navigation sidebar with user avatar profile card on `/dashboard` routes. Redirects guests to `/login`.
- **Status**: [ ] Pending

### Task P07-T02: Table Listing & Fetching
- **Objective**: Integrate `GET /investments` API and display holdings in a styled table.
- **Files Affected**:
  - `frontend/src/components/investments-table.tsx`
- **Dependencies**: P07-T01.
- **Acceptance Criteria**: Displays columns for Name, Type, Invested, Current Value, Purchase Date. Shows custom empty state if no holdings exist.
- **Status**: [ ] Pending

### Task P07-T03: Add / Edit Side Drawer
- **Objective**: Create the slide-over form panel for investment creations and updates.
- **Files Affected**:
  - `frontend/src/components/investment-drawer.tsx`
- **Dependencies**: P07-T02.
- **Acceptance Criteria**: Clicking "+ Add Investment" opens form. Submitting triggers API call, closes panel, and refreshes database list.
- **Status**: [ ] Pending

---

## Phase 8: Frontend Portfolio Summary UI

### Task P08-T01: Summary Metric Integration
- **Objective**: Render four summary cards (Invested, Value, Profit, Percent) at the top of the dashboard.
- **Files Affected**:
  - `frontend/src/components/portfolio-summary.tsx`
- **Dependencies**: Phase 7.
- **Acceptance Criteria**: Cards reflect live calculations from `GET /portfolio/summary` with color changes based on profitability.
- **Status**: [ ] Pending

---

## Phase 9: Verification & Testing

### Task P09-T01: Access Control Audit
- **Objective**: Validate tenant-isolation manually (or via tests).
- **Files Affected**:
  - Manual verification testing plan.
- **Dependencies**: Phase 8.
- **Acceptance Criteria**: User A cannot read or mutate User B's investments.
- **Status**: [ ] Pending

---

## Phase 10: Docker & Deployment (Bonus)

### Task P10-T01: Create Docker Configurations
- **Objective**: Code `Dockerfile` definitions and a single `docker-compose.yml` orchestrating the services.
- **Files Affected**:
  - `Dockerfile` (frontend/backend)
  - `docker-compose.yml`
- **Dependencies**: Phase 9.
- **Acceptance Criteria**: Running `docker-compose up` builds and runs Next.js, NestJS, and PostgreSQL together.
- **Status**: [ ] Pending

---

## Phase 11: Submission Readiness

### Task P11-T01: Documentation & Final Walkthrough
- **Objective**: Create root README.md containing setup guides and environment configurations. Verify checklist.
- **Files Affected**:
  - `README.md`
- **Dependencies**: Phase 10.
- **Acceptance Criteria**: Clean README outlining all instructions, database setup scripts, and environment options.
- **Status**: [ ] Pending
