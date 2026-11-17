# MiniERP — Internal Operations Platform

> A production-grade multi-module internal ERP platform built with NestJS, PostgreSQL, Prisma, React, Vite, and Tailwind CSS. Features role-based access control (RBAC), multi-stage approval workflows for leave and purchases, real-time analytics, and automated scheduled digests.

## Live Demo

- **Frontend Application (Vercel):** [https://mini-erpwebapp.vercel.app](https://mini-erpwebapp.vercel.app)
- **Backend API (Railway):** [https://minierp-production-31188248.up.railway.app](https://minierp-production-31188248.up.railway.app)

---

## Demo Credentials

The database has been seeded with demo accounts for each role. You can also use the one-click demo buttons on the login page:

| Role | Email | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@minierp.com` | `Admin@123` | Full system access, all approvals, user management, analytics |
| **Manager** | `manager@minierp.com` | `Manager@123` | Department approvals (Leave & Stage 1 Purchase), team metrics |
| **Employee** | `employee@minierp.com` | `Employee@123` | Submit leave & purchase requests, track status & balances |

---

## Tech Stack

### Frontend
- **Framework:** React 18 + Vite + TypeScript
- **Styling:** Tailwind CSS + Radix UI / shadcn design principles
- **Icons:** Lucide React
- **Charts:** Recharts
- **Routing:** React Router v6
- **HTTP Client:** Axios with JWT request/response interceptors and error handling

### Backend
- **Framework:** NestJS (Node.js, TypeScript)
- **Database:** PostgreSQL (hosted on Railway)
- **ORM:** Prisma v6
- **Authentication:** JWT (HMAC-SHA256) with custom `RolesGuard`
- **Validation:** Class-validator + Class-transformer with whitelist pipes
- **Jobs & Scheduling:** `@nestjs/schedule` cron tasks for daily manager digests and monthly balance resets
- **Security:** Helmet, CORS origin resolution, bcrypt password hashing, input sanitization

---

## Core Modules & Features

### 1. Authentication & Role-Based Access Control (RBAC)
- Secure JWT authentication with 7-day expiration and automatic session refresh handling.
- Three strictly scoped roles (`ADMIN`, `MANAGER`, `EMPLOYEE`) guarded via NestJS decorators and interceptors.
- Granular client-side route guards and UI state adaptation per role.

### 2. Leave Management
- Categorized leave tracking (Casual, Sick, Paid leave).
- Per-employee leave balances with automatic deduction upon approval.
- Manager & Admin approval/rejection workflows with reviewer audit trail and rejection reasons.
- Automated monthly reset cron job for casual leaves.

### 3. Purchase Request Workflows (2-Stage Approval Chain)
- Multi-stage approval lifecycle:
  `SUBMITTED` &rarr; `PENDING_MANAGER` &rarr; `PENDING_ADMIN` &rarr; `APPROVED` &rarr; `ORDERED` &rarr; `RECEIVED`
- Threshold validation: purchases require initial manager sign-off before advancing to administrative review.
- Status history with reviewer attribution and rejection feedback.

### 4. Interactive Dashboard & Analytics
- Live KPI cards: pending approvals, active leaves, monthly spend, team headcounts.
- Spending trend charts and approval status distribution graphs.
- Quick action drawer and recent activity feed.

### 5. Automated Background Jobs
- **Daily Manager Digest:** Scheduled 9:00 AM cron job aggregating pending approvals per department.
- **Manual Trigger:** Admin endpoint (`GET /admin/trigger-digest`) for on-demand digest execution.

---

## Database Schema Overview

```prisma
model User {
  id            String            @id @default(cuid())
  name          String
  email         String            @unique
  passwordHash  String
  role          Role              @default(EMPLOYEE)
  department    String
  isActive      Boolean           @default(true)
  createdAt     DateTime          @default(now())
  updatedAt     DateTime          @updatedAt
}

model LeaveRequest {
  id            String            @id @default(cuid())
  employeeId    String
  leaveType     LeaveType
  startDate     DateTime
  endDate       DateTime
  daysCount     Int
  reason        String
  status        ApprovalStatus    @default(PENDING)
  reviewedById  String?
  rejectionNote String?
}

model LeaveBalance {
  id            String            @id @default(cuid())
  employeeId    String
  leaveType     LeaveType
  totalDays     Int               @default(12)
  usedDays      Int               @default(0)
  year          Int
}

model PurchaseRequest {
  id            String            @id @default(cuid())
  raisedById    String
  title         String
  description   String
  itemName      String
  quantity      Int
  estimatedCost Float
  vendorName    String?
  status        PurchaseStatus    @default(PENDING_MANAGER)
  managerId     String?
  adminId       String?
  rejectReason  String?
}
```

---

## Local Development

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Git

### Backend Setup
```bash
cd backend
cp .env.example .env
# Configure DATABASE_URL and JWT_SECRET
npm install
npx prisma migrate dev
npx prisma db seed
npm run start:dev
```

### Frontend Setup
```bash
cd frontend
cp .env.example .env.local
# Set VITE_API_URL=http://localhost:3000
npm install
npm run dev
```

---

## Deployment Configuration

- **Railway:** Uses standard Node.js Nixpacks container running `npm run build` and `npm run start:prod` on port 8080.
- **Vercel:** Monorepo deployment with root directory set to `frontend` and static Single Page Application (SPA) rewrites configured in `vercel.json`.
