# Security Architecture & Constraints

This document details the security controls, validation schemas, and tenancy isolation logic built into FinVestia.

---

## 1. Authentication & Session Security

### 1.1 Stateless Session Management (JWT)
- **Token Mechanism**: Standard JSON Web Tokens (JWT) are signed by the backend using a secure, environment-defined `JWT_SECRET`.
- **Expiration Policies**: Access tokens are configured with a reasonable lifetime (e.g., `1d` or `1h`) to limit the utility of intercepted tokens.
- **Client Storage**: To protect against Cross-Site Scripting (XSS) attacks, the frontend should store the JWT either in an `HTTP-only` cookie or a secure client-side storage module that sanitizes outputs before mounting components.

### 1.2 Password Hashing
- Plaintext passwords **must never** be stored in the database.
- The `AuthService` hashes user passwords during registration using **Bcrypt** with a salt round density of `10`.
- During login, the Bcrypt verification function (`bcrypt.compare()`) is used to validate passwords against the stored hash in a timing-safe manner, defending against timing attacks.

---

## 2. Strict Tenant Data Isolation (Access Control)

The most critical security constraint of FinVestia is:
> **User A must never be able to read, update, or delete User B's investments.**

To enforce this, the following architecture is implemented in the NestJS service layer:

### 2.1 Context Injection (JWT Guard)
The global validation guard (`JwtAuthGuard`) decodes the incoming token and attaches the authenticated user object (`req.user`) to the request context.
- The user ID is retrieved solely from `req.user.id`.
- The controller routes pass `req.user.id` to the underlying service functions as a mandatory parameter.

### 2.2 Query Scope Enforcement
In database service operations, query filters **always** include the authenticated `userId`.

#### Example Read-One Service Logic (Safe):
```typescript
async findOne(id: string, userId: string): Promise<Investment> {
  const investment = await this.prisma.investment.findFirst({
    where: {
      id: id,
      userId: userId, // Scope constraint matches resource to active user
    },
  });
  
  if (!investment) {
    throw new NotFoundException('Investment not found');
  }
  return investment;
}
```

#### Example Update Service Logic (Safe):
```typescript
async update(id: string, updateDto: UpdateInvestmentDto, userId: string): Promise<Investment> {
  // Enforces ownership before performing the update
  const investment = await this.findOne(id, userId); 
  
  return this.prisma.investment.update({
    where: { id: investment.id },
    data: updateDto,
  });
}
```

---

## 3. Data Integrity & Input Validation

### 3.1 Schema Guards (DTOs)
All client payloads are intercepted at the controller boundary using NestJS global `ValidationPipe` (built on `class-validator` and `class-transformer`).
- **Strip non-whitelisted attributes**: Payloads containing injected fields (e.g., trying to write `user_id` directly in request body) are stripped out, preventing SQL mass assignment.
- **Strict Data Types**:
  - `investedAmount` and `currentValue` must be positive numeric decimals.
  - `purchaseDate` must be a valid calendar date format.

### 3.2 SQL Injection Defense
All database interactions occur via an Object Relational Mapper (Prisma or TypeORM) which compiles parameterized queries.
- Plain string concatenation is prohibited in queries.
- Raw SQL queries are avoided.

---

## 4. Environment & Transport Protection

### 4.1 Secrets Protection
- Secrets like `JWT_SECRET`, database credentials, and API ports must be defined in a `.env` file.
- The `.env` file is explicitly ignored in git using `.gitignore`.
- An `.env.example` template is provided with dummy configurations to outline the expected parameters.

### 4.2 Safe Error Handling
- Production builds must hide detailed stack traces from database or system failures.
- Express/NestJS global filters convert database failures (e.g., Prisma unique constraint violation or connection errors) into standard, clean HTTP responses (e.g., `400 Bad Request` or `500 Internal Server Error`) without leaking table structures, table names, or credentials.
