# MiniERP — Internal Operations Platform

> End-to-end internal ERP platform with role-based access, multi-stage approval workflows for leave & purchases, spend analytics, and automated daily digests.

## Live URLs
- Frontend: *[deploy to Vercel and add URL here]*
- Backend API: *[deploy to Railway and add URL here]*

## Demo Credentials

| Role     | Email                   | Password     |
|----------|-------------------------|--------------|
| Admin    | admin@minierp.com       | Admin@123    |
| Manager  | manager@minierp.com     | Manager@123  |
| Employee | employee@minierp.com    | Employee@123 |

## Screenshots

*Add screenshots after deployment*

## Tech Stack

| Layer     | Technology                                 |
|-----------|--------------------------------------------|
| Frontend  | React + Vite + Tailwind CSS                |
| Backend   | NestJS (Node.js, TypeScript)               |
| Database  | PostgreSQL                                 |
| ORM       | Prisma                                     |
| Auth      | JWT + RolesGuard                           |
| Charts    | Recharts                                   |
| Jobs      | @nestjs/schedule (cron)                    |
| Deploy    | Railway (backend + DB) + Vercel (frontend) |

## Modules

| Module        | Description                                           |
|---------------|-------------------------------------------------------|
| Auth          | JWT login, role assignment, RBAC guards               |
| Leave         | Apply/approve/reject with balance tracking            |
| Purchase      | 2-stage approval chain (Manager ? Admin)              |
| Dashboard     | Role-aware summary with charts and activity feed      |
| Scheduled Jobs| Daily digest + monthly leave balance reset            |

## Local Setup

### Backend

`ash
cd backend
cp .env.example .env
# Fill DATABASE_URL and JWT_SECRET in .env
npm install
npx prisma migrate dev
npx prisma db seed
npm run start:dev
`

### Frontend

`ash
cd frontend
cp .env.example .env.local
# Set VITE_API_URL=http://localhost:3000
npm install
npm run dev
`

## Database Schema

**Users** — id, name, email, password_hash, role, department, is_active

**LeaveRequests** — id, employee_id, leave_type, start_date, end_date, days_count, reason, status, reviewed_by, reject_reason

**LeaveBalances** — id, employee_id, leave_type, total_days, used_days, year

**PurchaseRequests** — id, raised_by, title, description, item_name, quantity, estimated_cost, vendor_name, status, manager_id, admin_id, rejection_reason

## Approval Flows

**Leave:** Employee applies ? Manager/Admin reviews ? APPROVED/REJECTED ? balance deducted on approval

**Purchase:** Employee raises ? PENDING_MANAGER ? Manager approves ? PENDING_ADMIN ? Admin approves ? APPROVED ? ORDERED ? RECEIVED

## Scheduled Jobs

- **Daily 9am digest** — logs pending approval counts per manager
- **1st of month** — resets casual leave used_days to 0

Trigger manually: GET /admin/trigger-digest (Admin auth required)
# Local Development Notes
