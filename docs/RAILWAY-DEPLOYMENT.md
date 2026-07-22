# FinVestia Railway Deployment Documentation

This document describes the production deployment configuration and setup details for the FinVestia NestJS backend and PostgreSQL database on Railway.

---

## 🏛️ Deployment Architecture

```text
                  Internet (Frontend Web Client)
                               │
                               ▼
                    ┌─────────────────────┐
                    │       Railway       │
                    │                     │
                    │   NestJS Backend    │
                    │                     │
                    └──────────┬──────────┘
                               │
                               │ DATABASE_URL (Private link)
                               ▼
                    ┌─────────────────────┐
                    │       Railway       │
                    │                     │
                    │     PostgreSQL      │
                    │   Database Service  │
                    └─────────────────────┘
```

The production deployment consists of two services provisioned in a single Railway project:
1. **NestJS Backend**: Built using Docker via the local `backend/Dockerfile` and exposed via a public HTTPS domain.
2. **Postgres**: Managed database service. It is not publicly exposed; the backend connects internally using a secure private hostname.

---

## ⚙️ Railway Services & Configuration

### 1. PostgreSQL Service (`Postgres`)
* **Status**: Online
* **Image**: `ghcr.io/railwayapp-templates/postgres-ssl:18`
* **Region**: `sfo` (San Francisco, USA)
* **Storage Volume**: `postgres-volume` (Mounted at `/var/lib/postgresql/data`)

### 2. Backend Service (`finvestia-backend`)
* **Build Type**: Docker build (uses `backend/Dockerfile`)
* **Root Directory**: `backend/`
* **Service URL**: `https://finvestia-backend-production.up.railway.app`
* **Healthcheck/Port**: Port `3001`

---

## 🔑 Environment Variables Configured

The following environment variables are set in the `finvestia-backend` service. Sensitive values are linked dynamically using Railway service references:

| Variable Name | Value/Format | Description |
|---|---|---|
| `NODE_ENV` | `production` | Tells the application to run in production mode. |
| `PORT` | `3001` | Port on which the NestJS backend listens. |
| `DATABASE_URL` | `postgresql://${{Postgres.PGUSER}}:${{Postgres.PGPASSWORD}}@${{Postgres.PGHOST}}:${{Postgres.PGPORT}}/${{Postgres.PGDATABASE}}?schema=public` | Dynamically resolved PostgreSQL connection string. |
| `JWT_SECRET` | `f89b5329a28c312788ab8972e2cf17c762e84d72809e53bdf129037e937d5ff7` | Secure production key for JWT validation. |
| `FRONTEND_URL` | `http://localhost:3000` | Comma-separated list of CORS origins. Update when frontend is deployed. |

---

## 🏗️ Build & Start Process

### 1. Docker Build Stage (Builder)
* Executes `npm ci` to install dependencies.
* Runs `npx prisma generate` to build the Prisma Client typescript typings.
* Compiles NestJS typescript code using `npm run build` (outputs compilation to `dist/src/`).

### 2. Docker Runner Stage (Runner)
* Copies required directories: `package*.json`, `node_modules/`, `dist/`, `prisma/`, and `prisma.config.ts`.
* Exposes Port `3001`.
* Executes container entrypoint command:
  ```bash
  npx prisma migrate deploy && npm run start:prod
  ```

---

## 💾 Migration Process

Prisma migrations are fully automated:
* On container start, the CLI runs `npx prisma migrate deploy`.
* It reads the compiled `prisma.config.ts` from the root directory to find the `DATABASE_URL` environment variable.
* It checks the `prisma/migrations` folder and executes any new pending SQL scripts on the PostgreSQL database.
* It does NOT perform destructive schema resets or drop production data.

---

## 🔬 E2E Verification & Security Testing

All API endpoints were verified on the live Railway URL:
* **Registration**: `POST /auth/register` (PASS)
* **Login**: `POST /auth/login` (PASS, returns JWT `accessToken`)
* **Investments CRUD**:
  - `POST /investments` (PASS)
  - `GET /investments` (PASS)
  - `GET /investments/:id` (PASS)
  - `PUT /investments/:id` (PASS)
  - `DELETE /investments/:id` (PASS)
* **Portfolio Calculations**: `GET /portfolio/summary` (PASS)
  - Formula verified: $Profit = CurrentValue - InvestedAmount$
  - Formula verified: $ProfitPercentage = (Profit / InvestedAmount) * 100$
  - Empty portfolio case handled safely (returns zero values, division-by-zero avoided).

### 🔒 Tenancy Isolation
Verified that **User B** gets a `404 Not Found` when trying to fetch, modify, or delete **User A's** investment holdings using their own JWT token.

### 💾 Data Persistence
Verified that backend container restarts or redeployments do not affect PostgreSQL database data. Existing users can log in and retrieve holdings seamlessly after service recycles.

---

## 🛠️ Troubleshooting Notes

During deployment, two major configuration issues were identified and resolved:

### 1. Missing `prisma.config.ts` in Runner Stage
* **Symptom**: `npx prisma migrate deploy` failed during container startup with `Error: The datasource.url property is required in your Prisma config file`.
* **Root Cause**: The runner stage of the Dockerfile was only copying the `prisma/` folder and was missing the root `prisma.config.ts` file. Under Prisma v7, the connection URL config lives in `prisma.config.ts` instead of `schema.prisma`.
* **Resolution**: Added `COPY --from=builder /app/prisma.config.ts ./` to the Dockerfile runner stage.

### 2. Incorrect Compiled Main Path
* **Symptom**: Server crashed with `Error: Cannot find module '/app/dist/main'`.
* **Root Cause**: The typescript compiler parsed both `prisma.config.ts` (in the root) and `src/main.ts`, which caused the compiled output root to retain directory structure. Thus, the compiled entry file was located at `dist/src/main.js` instead of `dist/main.js`.
* **Resolution**: Changed the `start:prod` script in `package.json` to `node dist/src/main`.
