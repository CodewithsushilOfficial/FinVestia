# API Specification

This document details the REST API endpoints, request schemas, parameters, and responses for the FinVestia application.

---

## 1. Authentication Endpoints

### 1.1 POST /auth/register
Register a new user account.

- **Method**: `POST`
- **Route**: `/auth/register`
- **Authentication**: None (Public)
- **Request Body**:
```json
{
  "name": "Sushil Kumar",
  "email": "sushil@example.com",
  "password": "SecurePassword123"
}
```
- **Validation Rules**:
  - `name`: string, required, 1-100 characters.
  - `email`: string, required, valid email format.
  - `password`: string, required, minimum 6 characters.
- **Success Response (HTTP 201 Created)**:
```json
{
  "id": "e5c709e8-4680-4965-b541-6927a718b560",
  "name": "Sushil Kumar",
  "email": "sushil@example.com"
}
```
- **Error Responses**:
  - **HTTP 400 Bad Request**: Input validation failed (e.g., password too short).
  - **HTTP 409 Conflict**: Email is already registered.

### 1.2 POST /auth/login
Authenticate a user and return a JWT.

- **Method**: `POST`
- **Route**: `/auth/login`
- **Authentication**: None (Public)
- **Request Body**:
```json
{
  "email": "sushil@example.com",
  "password": "SecurePassword123"
}
```
- **Success Response (HTTP 200 OK)**:
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
- **Error Responses**:
  - **HTTP 401 Unauthorized**: Invalid email or password.

---

## 2. Investment Management Endpoints

All investment endpoints require a valid JWT passed in the HTTP Authorization header:
`Authorization: Bearer <token>`

### 2.1 POST /investments
Add a new investment holding.

- **Method**: `POST`
- **Route**: `/investments`
- **Authentication**: Required (JWT Bearer Token)
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
- **Validation Rules**:
  - `investmentName`: string, required, non-empty.
  - `investmentType`: string, required, non-empty.
  - `investedAmount`: number, required, positive (`>= 0.00`).
  - `currentValue`: number, required, positive (`>= 0.00`).
  - `purchaseDate`: ISO-8601 date string (YYYY-MM-DD), required.
- **Success Response (HTTP 201 Created)**:
```json
{
  "id": "8c772ea5-c603-4c91-9e79-bc22fb185672",
  "investmentName": "HDFC Flexi Cap Fund",
  "investmentType": "Mutual Fund",
  "investedAmount": 10000.00,
  "currentValue": 12500.00,
  "purchaseDate": "2026-06-01T00:00:00.000Z",
  "createdAt": "2026-07-22T13:59:02.000Z",
  "updatedAt": "2026-07-22T13:59:02.000Z"
}
```
- **Error Responses**:
  - **HTTP 400 Bad Request**: Validation error on inputs.
  - **HTTP 401 Unauthorized**: Missing or invalid authentication token.

### 2.2 GET /investments
Retrieve all investments belonging to the authenticated user.

- **Method**: `GET`
- **Route**: `/investments`
- **Authentication**: Required (JWT Bearer Token)
- **Success Response (HTTP 200 OK)**:
```json
[
  {
    "id": "8c772ea5-c603-4c91-9e79-bc22fb185672",
    "investmentName": "HDFC Flexi Cap Fund",
    "investmentType": "Mutual Fund",
    "investedAmount": 10000.00,
    "currentValue": 12500.00,
    "purchaseDate": "2026-06-01T00:00:00.000Z",
    "createdAt": "2026-07-22T13:59:02.000Z",
    "updatedAt": "2026-07-22T13:59:02.000Z"
  },
  {
    "id": "3af420e6-b6ef-461d-8547-8acff3e100f9",
    "investmentName": "Reliance Industries",
    "investmentType": "Stock",
    "investedAmount": 20000.00,
    "currentValue": 23500.00,
    "purchaseDate": "2026-04-15T00:00:00.000Z",
    "createdAt": "2026-07-22T13:59:02.000Z",
    "updatedAt": "2026-07-22T13:59:02.000Z"
  }
]
```

### 2.3 GET /investments/:id
Retrieve a specific investment by its UUID.

- **Method**: `GET`
- **Route**: `/investments/:id`
- **Route Parameters**:
  - `id`: UUID, required.
- **Authentication**: Required (JWT Bearer Token)
- **Success Response (HTTP 200 OK)**:
```json
{
  "id": "8c772ea5-c603-4c91-9e79-bc22fb185672",
  "investmentName": "HDFC Flexi Cap Fund",
  "investmentType": "Mutual Fund",
  "investedAmount": 10000.00,
  "currentValue": 12500.00,
  "purchaseDate": "2026-06-01T00:00:00.000Z",
  "createdAt": "2026-07-22T13:59:02.000Z",
  "updatedAt": "2026-07-22T13:59:02.000Z"
}
```
- **Error Responses**:
  - **HTTP 404 Not Found / 403 Forbidden**: Record does not exist, or belongs to another user.

### 2.4 PUT /investments/:id
Modify an existing investment.

- **Method**: `PUT`
- **Route**: `/investments/:id`
- **Route Parameters**:
  - `id`: UUID, required.
- **Authentication**: Required (JWT Bearer Token)
- **Request Body**: (all fields optional, but at least one must be provided)
```json
{
  "investmentName": "HDFC Flexi Cap Fund - Growth Direct",
  "currentValue": 13100.00
}
```
- **Success Response (HTTP 200 OK)**:
```json
{
  "id": "8c772ea5-c603-4c91-9e79-bc22fb185672",
  "investmentName": "HDFC Flexi Cap Fund - Growth Direct",
  "investmentType": "Mutual Fund",
  "investedAmount": 10000.00,
  "currentValue": 13100.00,
  "purchaseDate": "2026-06-01T00:00:00.000Z",
  "createdAt": "2026-07-22T13:59:02.000Z",
  "updatedAt": "2026-07-22T14:15:00.000Z"
}
```
- **Error Responses**:
  - **HTTP 400 Bad Request**: Input validation failed.
  - **HTTP 404 Not Found / 403 Forbidden**: Record does not exist, or belongs to another user.

### 2.5 DELETE /investments/:id
Remove an investment record.

- **Method**: `DELETE`
- **Route**: `/investments/:id`
- **Route Parameters**:
  - `id`: UUID, required.
- **Authentication**: Required (JWT Bearer Token)
- **Success Response (HTTP 200 OK)**:
```json
{
  "message": "Investment successfully removed"
}
```
- **Error Responses**:
  - **HTTP 404 Not Found / 403 Forbidden**: Record does not exist, or belongs to another user.

---

## 3. Portfolio Summary Endpoints

### 3.1 GET /portfolio/summary
Retrieve aggregate stats for the user's portfolio.

- **Method**: `GET`
- **Route**: `/portfolio/summary`
- **Authentication**: Required (JWT Bearer Token)
- **Success Response (HTTP 200 OK)**:
```json
{
  "totalInvested": 50000.00,
  "currentValue": 62000.00,
  "profit": 12000.00,
  "profitPercentage": 24.00
}
```
- **Design Edge Case Behavior**:
  If the user has zero investments registered, the response is:
```json
{
  "totalInvested": 0.00,
  "currentValue": 0.00,
  "profit": 0.00,
  "profitPercentage": 0.00
}
```
