# Software Requirements Specification (SRS)

## 1. System Overview
FinVestia provides users with a secure platform to catalog their financial investments and monitor their net portfolio returns. The system consists of a NestJS API backend and a Next.js single-page application frontend communicating over HTTPS.

## 2. Data Requirements

### 2.1 User Entity Schema
Stored in the `users` table.

| Attribute | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | Primary Key, Default: `uuid_generate_v4()` | Unique identifier for the user. |
| `name` | VARCHAR(100) | Not Null | Display name of the user. |
| `email` | VARCHAR(255) | Not Null, Unique | User's email address used for login. |
| `password` | VARCHAR(255) | Not Null | Hashed password string (Bcrypt). |

### 2.2 Investment Entity Schema
Stored in the `investments` table.

| Attribute | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | Primary Key, Default: `uuid_generate_v4()` | Unique identifier for the investment. |
| `user_id` | UUID | Foreign Key -> `users.id`, Cascade Delete | Owner of the investment. |
| `investment_name` | VARCHAR(255) | Not Null | Name of the asset (e.g., "Reliance Industries"). |
| `investment_type` | VARCHAR(100) | Not Null | Category (e.g., "Stock", "Mutual Fund"). |
| `invested_amount` | DECIMAL(15, 2) | Not Null, Checked: `>= 0.00` | The capital originally deployed. |
| `current_value` | DECIMAL(15, 2) | Not Null, Checked: `>= 0.00` | The current market valuation. |
| `purchase_date` | DATE | Not Null | The date of initial purchase. |
| `created_at` | TIMESTAMP | Default: `CURRENT_TIMESTAMP` | System record creation timestamp. |
| `updated_at` | TIMESTAMP | Default: `CURRENT_TIMESTAMP` | System record last update timestamp. |

---

## 3. Functional Requirements

### FR-01: User Registration
- **Description**: The system must allow guest users to register an account.
- **Input**:
  - `name`: string (1-100 characters)
  - `email`: valid email string
  - `password`: string (minimum 6 characters)
- **Processing**:
  - Validate that the email is unique in the database.
  - Hash the password using Bcrypt with a salt round of 10.
  - Insert a new record in the `users` table.
- **Expected Output**: A success message and the created user object (excluding the password hash).
- **Authentication Requirement**: None (Public).
- **Failure Conditions**:
  - Request contains invalid email format -> Returns HTTP 400 Bad Request.
  - Email already exists in database -> Returns HTTP 409 Conflict.
- **Acceptance Criteria**: The database contains the new user with a hashed password, and the API returns HTTP 201 Created.

### FR-02: User Login
- **Description**: The system must allow registered users to authenticate.
- **Input**:
  - `email`: string
  - `password`: string
- **Processing**:
  - Query the user record by the provided `email`.
  - Compare the provided password with the hashed password in the database using Bcrypt.
  - If they match, sign a JWT containing the user `id` and `email`.
- **Expected Output**: An authentication token (JWT) and the authenticated user's profile details.
- **Authentication Requirement**: None (Public).
- **Failure Conditions**:
  - Email not found or password incorrect -> Returns HTTP 401 Unauthorized.
- **Acceptance Criteria**: The client receives a valid JWT token that can be decoded to verify the user identity.

### FR-03: JWT Authentication
- **Description**: The backend must validate the client's JWT on protected routes.
- **Input**:
  - HTTP `Authorization` header containing `Bearer <token>`.
- **Processing**:
  - Extract the token from the header.
  - Verify signature using the secret key.
  - Decode payload to extract user ID.
  - Attach user ID to the request context.
- **Expected Output**: Access allowed to the underlying handler.
- **Authentication Requirement**: Required (Middleware/Guard level).
- **Failure Conditions**:
  - Token missing, expired, or signature invalid -> Returns HTTP 401 Unauthorized.
- **Acceptance Criteria**: Any requests to protected routes without a valid JWT are blocked.

### FR-04: Protected Routes
- **Description**: Frontend routes representing dashboards and forms must be inaccessible to guest users.
- **Input**: User navigating to `/dashboard`, `/investments`, `/investments/add`, or `/investments/edit/[id]`.
- **Processing**:
  - Frontend checks for the presence of a valid, unexpired token.
  - If token is missing, redirect the user to `/login`.
- **Expected Output**: Dashboard access if authenticated; login page redirection if not.
- **Authentication Requirement**: Required.
- **Acceptance Criteria**: Directly entering a protected URL in the browser address bar redirects an unauthenticated visitor to the login page.

### FR-05: Create Investment
- **Description**: Authenticated users must be able to add new investments.
- **Input**:
  - `investmentName`: string
  - `investmentType`: string
  - `investedAmount`: positive number
  - `currentValue`: positive number
  - `purchaseDate`: string (ISO-8601 Date format)
- **Processing**:
  - Validate input payload data types and values.
  - Set the user relationship using the ID from the JWT.
  - Insert record into the `investments` table.
- **Expected Output**: Newly created investment object including its database UUID.
- **Authentication Requirement**: Required.
- **Failure Conditions**:
  - Invalid data input (e.g., negative amount) -> Returns HTTP 400 Bad Request.
  - Invalid JWT -> Returns HTTP 401 Unauthorized.
- **Acceptance Criteria**: The database contains the investment tied to the logged-in user, and the client receives a 201 response.

### FR-06: Get All Investments
- **Description**: Retrieve all investments belonging exclusively to the authenticated user.
- **Input**: None.
- **Processing**:
  - Query `investments` table where `user_id = authenticated_user_id`.
  - Order by `purchase_date` descending (or default created_at).
- **Expected Output**: Array of investment objects.
- **Authentication Requirement**: Required.
- **Acceptance Criteria**: The response contains only records owned by the calling user. The response never leaks other users' records.

### FR-07: Get Investment By ID
- **Description**: Retrieve details of a specific investment by its UUID.
- **Input**: UUID in route parameter (`/investments/:id`).
- **Processing**:
  - Retrieve the investment.
  - Check if `investment.user_id === authenticated_user_id`.
- **Expected Output**: Single investment object.
- **Authentication Requirement**: Required.
- **Failure Conditions**:
  - Record does not exist -> Returns HTTP 404 Not Found.
  - Record belongs to a different user -> Returns HTTP 403 Forbidden (or 404 to avoid data presence leakage).
- **Acceptance Criteria**: A user receives details for their own UUID, but receives a 403/404 when querying a UUID belonging to another user.

### FR-08: Update Investment
- **Description**: Modify an existing investment's parameters.
- **Input**: UUID in route, and partial/full investment details in request body.
- **Processing**:
  - Fetch the investment record.
  - Verify ownership (`investment.user_id === authenticated_user_id`).
  - Apply modifications and update `updated_at`.
- **Expected Output**: Updated investment object.
- **Authentication Requirement**: Required.
- **Failure Conditions**:
  - Record does not exist -> Returns HTTP 404 Not Found.
  - Record owned by another user -> Returns HTTP 403 Forbidden.
  - Invalid update values -> Returns HTTP 400 Bad Request.
- **Acceptance Criteria**: The record is updated in the database, and the user receives HTTP 200 OK with the updated data.

### FR-09: Delete Investment
- **Description**: Delete an investment record.
- **Input**: UUID in route.
- **Processing**:
  - Fetch the investment record.
  - Verify ownership (`investment.user_id === authenticated_user_id`).
  - Delete record from the table.
- **Expected Output**: Success confirmation message.
- **Authentication Requirement**: Required.
- **Failure Conditions**:
  - Record does not exist -> Returns HTTP 404 Not Found.
  - Record owned by another user -> Returns HTTP 403 Forbidden.
- **Acceptance Criteria**: The record is deleted from the database, and the user receives HTTP 200 OK.

### FR-10: Portfolio Summary
- **Description**: Calculate aggregate portfolio performance metrics.
- **Input**: None.
- **Processing**:
  - Query all investments for the authenticated user.
  - Calculate:
    - `totalInvested` = sum of all `investedAmount`.
    - `currentValue` = sum of all `currentValue`.
    - `profit` = `currentValue` - `totalInvested`.
    - `profitPercentage` = `(profit / totalInvested) * 100` (if `totalInvested` is 0, percentage is 0.00).
- **Expected Output**: Summary object containing calculations.
- **Authentication Requirement**: Required.
- **Acceptance Criteria**: Returns correct arithmetic calculations under all states (including when the user has 0 holdings).
