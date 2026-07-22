# User Workflow

This document details the navigation, form submissions, and data transitions a user experiences within the FinVestia application.

---

## 1. Authentication Workflows

### 1.1 User Registration Flow
Guest users create an account by submitting credentials. Upon success, they are redirected to the Login screen.

```mermaid
sequenceDiagram
    actor User as Guest User
    participant Page as Next.js Registration Page
    participant API as NestJS /auth/register
    participant DB as PostgreSQL
    
    User->>Page: Fills Name, Email, Password & Clicks "Register"
    Page->>API: POST /auth/register {name, email, password}
    alt Email already registered
        API-->>Page: HTTP 409 Conflict (Error message)
        Page-->>User: Display "Email already exists"
    else Inputs invalid
        API-->>Page: HTTP 400 Bad Request (Validation details)
        Page-->>User: Display specific input field error
    else Success
        API->>DB: INSERT INTO users VALUES (UUID, name, email, hashedPwd)
        DB-->>API: User Record Created
        API-->>Page: HTTP 201 Created {id, name, email}
        Page-->>User: Toast success + Redirect to /login
    end
```

### 1.2 User Login Flow
Registered users enter credentials to receive a JWT session. Upon successful validation, they are logged in and routed to the dashboard.

```mermaid
sequenceDiagram
    actor User as Registered User
    participant Page as Next.js Login Page
    participant API as NestJS /auth/login
    
    User->>Page: Fills Email, Password & Clicks "Login"
    Page->>API: POST /auth/login {email, password}
    alt Credentials Invalid
        API-->>Page: HTTP 401 Unauthorized
        Page-->>User: Display "Invalid email or password"
    else Success
        API-->>Page: HTTP 200 OK {accessToken, user: {name, email}}
        Page->>Page: Save JWT to cookies/storage
        Page-->>User: Redirect to /dashboard (Protected)
    end
```

---

## 2. Investment CRUD Operations Workflow

Authenticated users can manage their holdings using forms that interact with the protected `/investments` endpoints.

```mermaid
stateDiagram-v2
    [*] --> Dashboard: Login Successful
    Dashboard --> ViewInvestmentsList: Load GET /investments
    
    state ViewInvestmentsList {
        [*] --> DisplayTable
        DisplayTable --> AddClicked: Click "+ Add Investment"
        DisplayTable --> EditClicked: Click "Edit" icon
        DisplayTable --> DeleteClicked: Click "Delete" icon
    }
    
    AddClicked --> SubmitAddForm: Fill fields + Click "Add"
    SubmitAddForm --> POST_API: API POST /investments
    POST_API --> DisplayTable: HTTP 201 (Reload List)
    
    EditClicked --> LoadRecord: GET /investments/:id
    LoadRecord --> SubmitEditForm: Modify fields + Click "Save"
    SubmitEditForm --> PUT_API: API PUT /investments/:id
    PUT_API --> DisplayTable: HTTP 200 (Reload List)
    
    DeleteClicked --> ConfirmDelete: Display warning alert
    ConfirmDelete --> DELETE_API: API DELETE /investments/:id
    DELETE_API --> DisplayTable: HTTP 200 (Reload List)
```

---

## 3. Portfolio Summary Refresh Workflow

The dashboard summary statistics are fetched in parallel with the list of investments.

```mermaid
sequenceDiagram
    actor User as Authenticated User
    participant Page as Next.js Dashboard Page
    participant API as NestJS API
    
    User->>Page: Navigates to Dashboard
    activate Page
    Page->>API: GET /portfolio/summary (Header: Bearer Token)
    Page->>API: GET /investments (Header: Bearer Token)
    
    API-->>Page: Returns Portfolio Aggregate Calculations
    API-->>Page: Returns User's Investments Array
    
    Page->>Page: Render Summary Cards
    Page->>Page: Render Investment Rows in Table
    deactivate Page
```
