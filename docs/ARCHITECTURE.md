# MiniERP Architecture

## Overview

MiniERP follows a standard 3-tier architecture:

```
Browser (React SPA)
      ?  HTTPS + JWT
NestJS REST API
      ?  Prisma ORM
PostgreSQL Database
```

## Module Structure

### Backend Modules

| Module | Responsibility |
|--------|---------------|
| Auth | JWT login, registration, token validation |
| Users | User CRUD, role management |
| Leave | Leave requests, balance tracking, approval workflow |
| Purchase | Purchase requests, multi-stage approval chain |
| Dashboard | Aggregated stats, charts data |
| Jobs | Scheduled cron tasks (node-cron) |
| Health | Health check endpoint |

### Frontend Pages

| Page | Route | Roles |
|------|-------|-------|
| Login | /login | Public |
| Dashboard | /dashboard | All |
| Leave | /leave | All |
| Purchase | /purchase | All |
| Users | /users | Admin |

## Data Flow

1. User logs in ? receives JWT
2. Frontend stores JWT in localStorage
3. All API calls include `Authorization: Bearer <token>`
4. NestJS validates JWT, extracts user role
5. RolesGuard checks if user has permission
6. Controller delegates to Service
7. Service uses Prisma to query PostgreSQL
8. Response flows back to frontend

## Scheduled Jobs

- `0 9 * * *` — Daily digest: logs pending approvals for each manager
- `0 0 1 * *` — Monthly reset: resets casual leave balances

## Role Permissions Matrix

| Action | EMPLOYEE | MANAGER | ADMIN |
|--------|----------|---------|-------|
| Apply leave | ? | ? | ? |
| Approve leave | ? | ? | ? |
| View all leaves | ? | Dept only | ? |
| Create purchase | ? | ? | ? |
| Manager approve | ? | ? | ? |
| Admin approve | ? | ? | ? |
| Manage users | ? | ? | ? |

<!-- reviewed -->

## Deployment Notes

See README.md for Railway and Vercel deployment.
