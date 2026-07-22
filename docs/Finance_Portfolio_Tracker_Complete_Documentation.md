# Finance Portfolio Tracker

## Project Documentation

Product Name : FinVestia – Finance Portfolio Tracker

This document contains the PRD, TRD, SRS, Tech Stack, System
Architecture, User Workflow, and UI Design specification for the Finance
Portfolio Tracker assessment.

> Scope rule: This documentation includes only the requirements
> explicitly provided in the assessment. No additional product features
> are added.

------------------------------------------------------------------------

# 1. Product Requirements Document (PRD)

## 1.1 Product Name

Finance Portfolio Tracker

## 1.2 Objective

Build a simple Finance Portfolio Tracker application that allows users
to manage their investments.

The application is intended to demonstrate full-stack development skills
including:

-   Backend API development
-   Database design
-   Frontend development
-   Authentication
-   Code quality

## 1.3 Product Scope

A registered user can:

-   Register
-   Login
-   Add investments
-   View investments
-   View a specific investment
-   Update investments
-   Delete investments
-   View portfolio summary

## 1.4 User

The application has one user type:

-   Registered User

## 1.5 Core Functional Requirements

### Authentication

The user must be able to:

-   Create an account using registration.
-   Login using registered credentials.
-   Receive/use JWT authentication.
-   Access protected investment and portfolio functionality only after
    authentication.

### Investment Management

The user must be able to:

-   Add a new investment.
-   View all investments.
-   View an investment by ID.
-   Update an existing investment.
-   Delete an investment.

### Portfolio Summary

The application must display:

-   Total Invested Amount
-   Current Portfolio Value
-   Profit/Loss
-   Profit Percentage

## 1.6 Investment Data

Each investment contains:

  Field            Type
  ---------------- -----------
  id               UUID
  investmentName   String
  investmentType   String
  investedAmount   Number
  currentValue     Number
  purchaseDate     Date
  createdAt        Timestamp
  updatedAt        Timestamp

Example:

``` json
{
  "investmentName": "HDFC Flexi Cap Fund",
  "investmentType": "Mutual Fund",
  "investedAmount": 10000,
  "currentValue": 12500,
  "purchaseDate": "2026-06-01"
}
```

## 1.7 Portfolio Summary

Example response:

``` json
{
  "totalInvested": 50000,
  "currentValue": 62000,
  "profit": 12000,
  "profitPercentage": 24
}
```

## 1.8 Frontend Screens

The required frontend screens are:

### Login Page

Purpose:

-   User login

### Registration Page

Purpose:

-   User registration

### Investments Page

Functions:

-   List all investments
-   Add investment
-   Edit investment
-   Delete investment

### Portfolio Summary Section

Displays:

-   Total Invested Amount
-   Current Portfolio Value
-   Profit/Loss
-   Profit Percentage

## 1.9 Submission Deliverables

The final submission must include:

1.  GitHub Repository Link
2.  README.md containing:
    -   Setup Instructions
    -   Environment Variables
    -   API Documentation
3.  Database schema/migrations
4.  Sample Postman Collection --- optional

## 1.10 Bonus Items Listed in Assessment

The assessment lists the following as bonus points:

-   Docker setup
-   Deployment
-   Pagination and filtering
-   Unit tests
-   Clean Architecture / Modular Structure
-   NestJS best practices

These are bonus items rather than required core functionality.

------------------------------------------------------------------------

# 2. Software Requirements Specification (SRS)

## 2.1 Purpose

The Finance Portfolio Tracker provides authenticated users with CRUD
operations for investment holdings and a calculated portfolio summary.

## 2.2 Functional Requirements

### FR-01: User Registration

The system shall allow a new user to register.

Endpoint:

``` text
POST /auth/register
```

The user table contains:

-   id
-   name
-   email
-   password

### FR-02: User Login

The system shall allow a registered user to login.

Endpoint:

``` text
POST /auth/login
```

The application shall use JWT authentication.

### FR-03: Protected Routes

Investment and portfolio functionality shall only be accessible by
authenticated users.

### FR-04: Create Investment

The authenticated user shall be able to create an investment.

Endpoint:

``` text
POST /investments
```

Investment input:

-   investmentName
-   investmentType
-   investedAmount
-   currentValue
-   purchaseDate

### FR-05: Get All Investments

The authenticated user shall be able to retrieve investments.

Endpoint:

``` text
GET /investments
```

### FR-06: Get Investment By ID

The authenticated user shall be able to retrieve an investment using its
ID.

Endpoint:

``` text
GET /investments/:id
```

### FR-07: Update Investment

The authenticated user shall be able to update an investment.

Endpoint:

``` text
PUT /investments/:id
```

### FR-08: Delete Investment

The authenticated user shall be able to delete an investment.

Endpoint:

``` text
DELETE /investments/:id
```

### FR-09: Portfolio Summary

The authenticated user shall be able to retrieve the portfolio summary.

Endpoint:

``` text
GET /portfolio/summary
```

The response shall contain:

-   totalInvested
-   currentValue
-   profit
-   profitPercentage

## 2.3 Data Requirements

### Users Table

  Column
  ----------
  id
  name
  email
  password

### Investments Table

  Column
  -----------------
  id
  user_id
  investment_name
  investment_type
  invested_amount
  current_value
  purchase_date
  created_at
  updated_at

## 2.4 Investment Relationship

Each investment is associated with a user through:

``` text
investments.user_id
```

## 2.5 Portfolio Calculations

### Total Invested

``` text
totalInvested = sum of invested_amount
```

### Current Portfolio Value

``` text
currentValue = sum of current_value
```

### Profit/Loss

``` text
profit = currentValue - totalInvested
```

### Profit Percentage

``` text
profitPercentage = (profit / totalInvested) × 100
```

The expected portfolio summary structure is:

``` json
{
  "totalInvested": 50000,
  "currentValue": 62000,
  "profit": 12000,
  "profitPercentage": 24
}
```

------------------------------------------------------------------------

# 3. Technical Requirements Document (TRD)

## 3.1 Technical Objective

Implement the Finance Portfolio Tracker as a full-stack CRUD application
using the technologies specified in the assessment.

## 3.2 Mandatory Technical Requirements

### Backend

``` text
Node.js
NestJS preferred
```

### Frontend

``` text
React.js / Next.js
```

### Database

``` text
PostgreSQL
```

## 3.3 Good-to-Have Technologies

The assessment explicitly lists:

-   TypeScript
-   Docker
-   JWT Authentication

JWT is also explicitly required by the authentication section of the
assessment.

## 3.4 Backend Responsibilities

The backend handles:

-   User registration
-   User login
-   JWT authentication
-   Protected routes
-   Investment creation
-   Investment retrieval
-   Investment update
-   Investment deletion
-   Portfolio summary calculation
-   PostgreSQL communication

## 3.5 Frontend Responsibilities

The frontend handles:

-   Login UI
-   Registration UI
-   Investment listing
-   Add investment UI
-   Edit investment UI
-   Delete investment action
-   Portfolio summary display
-   Communication with backend APIs

## 3.6 Database Responsibilities

PostgreSQL stores:

-   User information
-   Investment information
-   Relationship between users and investments

## 3.7 Authentication Flow

``` text
User
  |
  v
Register / Login
  |
  v
Authentication API
  |
  v
JWT Authentication
  |
  v
Protected APIs
```

## 3.8 API Specification

### Authentication APIs

``` text
POST /auth/register
POST /auth/login
```

### Investment APIs

``` text
POST   /investments
GET    /investments
GET    /investments/:id
PUT    /investments/:id
DELETE /investments/:id
```

### Portfolio API

``` text
GET /portfolio/summary
```

## 3.9 Database Schema

### users

``` text
users
----------------
id
name
email
password
```

### investments

``` text
investments
----------------
id
user_id
investment_name
investment_type
invested_amount
current_value
purchase_date
created_at
updated_at
```

Relationship:

``` text
users
  |
  | id
  |
  +----------< investments
                user_id
```

------------------------------------------------------------------------

# 4. Tech Stack

## 4.1 Required / Allowed Stack

  Layer               Technology
  ------------------- -----------------------------
  Backend Runtime     Node.js
  Backend Framework   NestJS preferred
  Frontend            React.js or Next.js
  Database            PostgreSQL
  Authentication      JWT
  Language            TypeScript --- good to have
  Containerization    Docker --- good to have

## 4.2 Selected Implementation Stack

To stay within the assessment technologies:

``` text
Frontend:
Next.js
TypeScript

Backend:
Node.js
NestJS
TypeScript

Database:
PostgreSQL

Authentication:
JWT

Containerization:
Docker
```

No additional application technology is required by this specification.

------------------------------------------------------------------------

# 5. System Architecture

## 5.1 High-Level Architecture

``` text
┌──────────────────────────────────────┐
│               USER                   │
└──────────────────┬───────────────────┘
                   │
                   v
┌──────────────────────────────────────┐
│          FRONTEND APPLICATION        │
│                                      │
│             Next.js                  │
│                                      │
│  • Login                             │
│  • Registration                      │
│  • Investments                       │
│  • Portfolio Summary                 │
└──────────────────┬───────────────────┘
                   │
                   │ HTTP / REST
                   │ JWT
                   v
┌──────────────────────────────────────┐
│           BACKEND API                │
│                                      │
│       Node.js + NestJS               │
│                                      │
│  ┌───────────────────────────────┐   │
│  │ Authentication                │   │
│  │ Register / Login / JWT        │   │
│  └───────────────────────────────┘   │
│                                      │
│  ┌───────────────────────────────┐   │
│  │ Investments                   │   │
│  │ Create / Read / Update/Delete │   │
│  └───────────────────────────────┘   │
│                                      │
│  ┌───────────────────────────────┐   │
│  │ Portfolio Summary             │   │
│  └───────────────────────────────┘   │
└──────────────────┬───────────────────┘
                   │
                   v
┌──────────────────────────────────────┐
│             PostgreSQL               │
│                                      │
│  ┌─────────────┐  ┌───────────────┐ │
│  │    users    │  │  investments  │ │
│  └─────────────┘  └───────────────┘ │
└──────────────────────────────────────┘
```

## 5.2 Request Architecture

``` text
Frontend
   |
   | REST API Request
   | JWT
   v
NestJS Backend
   |
   +---- Authentication
   |
   +---- Investment CRUD
   |
   +---- Portfolio Summary
   |
   v
PostgreSQL
```

## 5.3 Authentication Architecture

``` text
Registration
     |
     v
POST /auth/register
     |
     v
User stored in PostgreSQL


Login
     |
     v
POST /auth/login
     |
     v
JWT
     |
     v
Authenticated Requests
     |
     v
Protected Investment / Portfolio APIs
```

------------------------------------------------------------------------

# 6. User Workflow

## 6.1 Registration Workflow

``` text
Start
  |
  v
Registration Page
  |
  v
Enter Registration Information
  |
  v
POST /auth/register
  |
  v
User Registration
```

## 6.2 Login Workflow

``` text
Login Page
   |
   v
Enter Credentials
   |
   v
POST /auth/login
   |
   v
JWT Authentication
   |
   v
Authenticated Application
```

## 6.3 Investment Workflow

``` text
Authenticated User
       |
       v
Investments Page
       |
       +----------------------+
       |                      |
       v                      v
View Investments        Add Investment
GET /investments        POST /investments
       |
       +----------------------+
       |
       v
Select Investment
       |
       +----------------------+
       |          |           |
       v          v           v
View           Edit         Delete
GET            PUT          DELETE
/:id           /:id         /:id
```

## 6.4 Portfolio Workflow

``` text
Authenticated User
       |
       v
Portfolio Summary Section
       |
       v
GET /portfolio/summary
       |
       v
Display
       |
       +-- Total Invested
       +-- Current Portfolio Value
       +-- Profit/Loss
       +-- Profit Percentage
```

## 6.5 Complete User Journey

``` text
Start
  |
  +------> Register
  |          |
  |          v
  |      Registration
  |
  v
Login
  |
  v
Authentication
  |
  v
Investments / Portfolio
  |
  +---- Add Investment
  |
  +---- View Investments
  |
  +---- View Investment
  |
  +---- Edit Investment
  |
  +---- Delete Investment
  |
  +---- View Portfolio Summary
```

------------------------------------------------------------------------

# 7. UI Design Specification

The UI specification follows the generated Finance Portfolio Tracker
dashboard image while limiting functional requirements to the assessment
scope.

## 7.1 UI Direction

The generated UI uses:

-   Desktop dashboard layout
-   Dark left navigation sidebar
-   Light main content area
-   White cards
-   Blue primary action buttons
-   Summary cards at the top
-   Investment table
-   Add Investment form panel

## 7.2 Login Page

Required functionality:

-   User login

The page should contain the login form required to authenticate the
user.

## 7.3 Registration Page

Required functionality:

-   User registration

The registration form corresponds to the required user data:

-   Name
-   Email
-   Password

## 7.4 Main Dashboard / Investments Layout

The generated design uses a sidebar and main content area.

``` text
┌──────────────────┬──────────────────────────────────────────┐
│                  │                                          │
│ Finance Tracker  │ Dashboard                                │
│                  │                                          │
│ Dashboard        │ Portfolio Summary                        │
│ Investments      │                                          │
│ Add Investment   │ [Invested] [Value] [Profit] [Profit %] │
│                  │                                          │
│ Logout           │ My Investments                           │
│                  │                                          │
│                  │ Investment Table                         │
│                  │                                          │
└──────────────────┴──────────────────────────────────────────┘
```

Only navigation/actions corresponding to required application
functionality are part of the functional scope.

## 7.5 Portfolio Summary Cards

Four summary values are displayed:

### Total Invested

Example:

``` text
₹50,000
```

### Current Value

Example:

``` text
₹62,000
```

### Profit / Loss

Example:

``` text
₹12,000
```

### Profit Percentage

Example:

``` text
24%
```

Layout:

``` text
┌─────────────────┐
│ Total Invested  │
│ ₹50,000         │
└─────────────────┘

┌─────────────────┐
│ Current Value   │
│ ₹62,000         │
└─────────────────┘

┌─────────────────┐
│ Profit / Loss   │
│ ₹12,000         │
└─────────────────┘

┌─────────────────┐
│ Profit %        │
│ 24%             │
└─────────────────┘
```

## 7.6 Investments Table

The investment list displays the required investment information.

Columns:

  Column            Purpose
  ----------------- --------------------------
  Investment Name   Investment name
  Type              Investment type
  Invested Amount   Original invested amount
  Current Value     Current investment value
  Purchase Date     Purchase date
  Actions           Edit/Delete

Example:

``` text
┌──────────────────────────────────────────────────────────────────────────────┐
│ My Investments                                             + Add Investment │
├────────────────────┬─────────────┬──────────┬──────────┬────────────┬────────┤
│ Investment Name    │ Type        │ Invested │ Current  │ Date       │ Action │
├────────────────────┼─────────────┼──────────┼──────────┼────────────┼────────┤
│ HDFC Flexi Cap     │ Mutual Fund │ ₹10,000  │ ₹12,500  │ 01/06/26   │ E / D  │
└────────────────────┴─────────────┴──────────┴──────────┴────────────┴────────┘
```

## 7.7 Add Investment Form

The generated UI shows the Add Investment form as a right-side panel.

Fields correspond directly to the required Investment Entity:

``` text
Add Investment

Investment Name
[________________________]

Investment Type
[________________________]

Invested Amount
[________________________]

Current Value
[________________________]

Purchase Date
[________________________]

[ Cancel ] [ Add Investment ]
```

Fields:

-   Investment Name
-   Investment Type
-   Invested Amount
-   Current Value
-   Purchase Date

## 7.8 Edit Investment UI

Edit uses the investment fields:

-   Investment Name
-   Investment Type
-   Invested Amount
-   Current Value
-   Purchase Date

The action corresponds to:

``` text
PUT /investments/:id
```

## 7.9 Delete Investment UI

Each listed investment provides a delete action.

The action corresponds to:

``` text
DELETE /investments/:id
```

## 7.10 UI-to-API Mapping

  UI Action           API
  ------------------- -------------------------
  Register            POST /auth/register
  Login               POST /auth/login
  Add Investment      POST /investments
  Load Investments    GET /investments
  View Investment     GET /investments/:id
  Edit Investment     PUT /investments/:id
  Delete Investment   DELETE /investments/:id
  Portfolio Summary   GET /portfolio/summary

------------------------------------------------------------------------

# 8. API Requirements Summary

``` text
AUTHENTICATION

POST /auth/register
POST /auth/login


INVESTMENTS

POST /investments
GET /investments
GET /investments/:id
PUT /investments/:id
DELETE /investments/:id


PORTFOLIO

GET /portfolio/summary
```

------------------------------------------------------------------------

# 9. Database Requirements Summary

``` text
users
├── id
├── name
├── email
└── password


investments
├── id
├── user_id
├── investment_name
├── investment_type
├── invested_amount
├── current_value
├── purchase_date
├── created_at
└── updated_at
```

Relationship:

``` text
User 1 -------- Investments
```

Each investment contains a `user_id` linking it to its user.

------------------------------------------------------------------------

# 10. Assessment Requirement Traceability

  Assessment Requirement       Specification
  ---------------------------- -----------------------------------------
  Register                     POST /auth/register
  Login                        POST /auth/login
  JWT Authentication           Authentication layer
  Protected Routes             Authenticated investment/portfolio APIs
  Add Investment               POST /investments
  View Investments             GET /investments
  View Investment By ID        GET /investments/:id
  Update Investment            PUT /investments/:id
  Delete Investment            DELETE /investments/:id
  Portfolio Summary            GET /portfolio/summary
  PostgreSQL                   Database
  users table                  Database schema
  investments table            Database schema
  Login Page                   Frontend
  Registration Page            Frontend
  Investments Page             Frontend
  Portfolio Summary Section    Frontend
  GitHub Repository            Submission
  README                       Submission
  Setup Instructions           README
  Environment Variables        README
  API Documentation            README
  Database migrations/schema   Submission
  Postman Collection           Optional
  Docker                       Bonus
  Deployment                   Bonus
  Pagination/filtering         Bonus
  Unit tests                   Bonus
  Clean Architecture           Bonus
  NestJS best practices        Bonus

------------------------------------------------------------------------

# 11. Final Required Scope

The core Finance Portfolio Tracker consists of:

``` text
Authentication
├── Registration
├── Login
├── JWT
└── Protected Routes

Investment Management
├── Create
├── Read All
├── Read By ID
├── Update
└── Delete

Portfolio
├── Total Invested
├── Current Portfolio Value
├── Profit/Loss
└── Profit Percentage

Frontend
├── Login
├── Registration
├── Investments
└── Portfolio Summary

Database
├── users
└── investments
```

This is the implementation scope defined by the provided Finance
Portfolio Tracker assessment.
