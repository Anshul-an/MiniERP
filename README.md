<p align="center">
  <img src="docs/assets/hero.svg" alt="MiniERP Platform Banner" width="100%" />
</p>

<p align="center">
  <strong>Enterprise-Grade Internal Operations Platform</strong><br>
  Role-Based Access Control &bull; Multi-Stage Approvals &bull; Leave & Procurement Workflows &bull; Real-time Analytics
</p>

<p align="center">
  <a href="https://mini-erpwebapp.vercel.app"><img src="https://img.shields.io/badge/Live_App-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Live App" /></a>
  <a href="https://minierp-production-31188248.up.railway.app"><img src="https://img.shields.io/badge/API_Server-Railway-0B0D0E?style=for-the-badge&logo=railway&logoColor=white" alt="API Server" /></a>
  <a href="https://github.com/Anshul-an/MiniERP"><img src="https://img.shields.io/badge/Commits-530%2B-blue?style=for-the-badge&logo=git&logoColor=white" alt="Commits" /></a>
  <img src="https://img.shields.io/badge/License-MIT-emerald?style=for-the-badge" alt="License" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/React_18-20232A?style=flat-square&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/NestJS-E0234E?style=flat-square&logo=nestjs&logoColor=white" alt="NestJS" />
  <img src="https://img.shields.io/badge/Prisma-2D3748?style=flat-square&logo=prisma&logoColor=white" alt="Prisma" />
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=flat-square&logo=postgresql&logoColor=white" alt="PostgreSQL" />
</p>

---

## 📌 Table of Contents
- [✨ Key Highlights](#-key-highlights)
- [🚀 Live Deployments & Demo Access](#-live-deployments--demo-access)
- [🔄 Core Workflows & Architecture](#-core-workflows--architecture)
- [🛠️ Tech Stack](#️-tech-stack)
- [📂 Module Breakdown](#-module-breakdown)
- [🗄️ Database Schema](#️-database-schema)
- [💻 Local Development Guide](#-local-development-guide)
- [📡 API Reference](#-api-reference)
- [🔒 Security & Reliability](#-security--reliability)

---

## ✨ Key Highlights

| Feature | Description |
| :--- | :--- |
| 🛡️ **Role-Based Access Control (RBAC)** | Strictly partitioned views & capabilities for `ADMIN`, `MANAGER`, and `EMPLOYEE`. |
| 🌴 **Leave Operations** | Real-time balance calculations across Casual, Sick, and Paid leave with audit logs. |
| 🛍️ **Two-Tier Purchase Approvals** | Requisitions mandate dual review: Manager operational verification &rarr; Admin financial clearance. |
| 📊 **Executive Analytics** | Recharts spend breakdown, status metrics, and department cost distributions. |
| ⏰ **Automated Digest Daemon** | `@nestjs/schedule` cron tasks generate daily manager summaries and handle monthly balance resets. |

---

## 🚀 Live Deployments & Demo Access

| Tier | Service | URL | Status |
| :--- | :--- | :--- | :--- |
| **Frontend** | Vercel (Edge SPA) | [**https://mini-erpwebapp.vercel.app**](https://mini-erpwebapp.vercel.app) | ![Active](https://img.shields.io/badge/Status-Operational-brightgreen?style=flat-square) |
| **Backend** | Railway (Container) | [**https://minierp-production-31188248.up.railway.app**](https://minierp-production-31188248.up.railway.app) | ![Active](https://img.shields.io/badge/Status-Operational-brightgreen?style=flat-square) |
| **Database** | PostgreSQL | `postgres.railway.internal:5432` | ![Connected](https://img.shields.io/badge/Status-Connected-blue?style=flat-square) |

### 🔑 Demo Credentials

The database is pre-seeded. You can use the instant **1-Click Demo Buttons** on the login page or enter credentials manually:

```markdown
┌──────────────┬────────────────────────┬──────────────┬────────────────────────────────────────────────────────┐
│ Role         │ Email                  │ Password     │ Privileges                                             │
├──────────────┼────────────────────────┼──────────────┼────────────────────────────────────────────────────────┤
│ 👑 Admin     │ admin@minierp.com      │ Admin@123    │ Full system access, all approvals, users, analytics    │
│ 👔 Manager   │ manager@minierp.com    │ Manager@123  │ Team leave approvals, stage-1 purchase authorization   │
│ 💼 Employee  │ employee@minierp.com   │ Employee@123 │ Requisitions, personal leave management, status track  │
└──────────────┴────────────────────────┴──────────────┴────────────────────────────────────────────────────────┘
```

---

## 🔄 Core Workflows & Architecture

<p align="center">
  <img src="docs/assets/workflow.svg" alt="Procurement Workflow" width="100%" />
</p>

### 🛒 Purchase Requisition State Machine
```mermaid
stateDiagram-v2
    [*] --> SUBMITTED : Employee raises order
    SUBMITTED --> PENDING_MANAGER : Auto-routed
    PENDING_MANAGER --> PENDING_ADMIN : Manager Approves
    PENDING_MANAGER --> REJECTED : Manager Declines
    PENDING_ADMIN --> APPROVED : Admin Signs Off
    PENDING_ADMIN --> REJECTED : Admin Declines
    APPROVED --> ORDERED : Vendor Engaged
    ORDERED --> RECEIVED : Asset Fulfilled
    RECEIVED --> [*]
    REJECTED --> [*]
```

### 🌴 Leave Request Lifecycle
```mermaid
flowchart LR
    A["📝 Employee Submits"] --> B{"Reviewer Gate"}
    B -->|"Manager Sign-off"| C["✅ APPROVED"]
    B -->|"Admin Override"| C
    B -->|"Rejected with Reason"| D["❌ REJECTED"]
    C --> E["⚡ Auto-Deduct Balance"]
    D --> F["↩️ Quota Preserved"]
```

---

## 🛠️ Tech Stack

```
                    ┌────────────────────────┐
                    │      React 18 + Vite   │
                    │   Tailwind + Lucide    │
                    └───────────┬────────────┘
                                │ HTTPS / JWT
                    ┌───────────▼────────────┐
                    │    NestJS REST API     │
                    │ RBAC + Pipes + Cron    │
                    └───────────┬────────────┘
                                │ Prisma ORM
                    ┌───────────▼────────────┐
                    │  PostgreSQL Database   │
                    └────────────────────────┘
```

- **Frontend:** React 18, Vite, TypeScript, Tailwind CSS, Lucide Icons, Recharts, Axios
- **Backend:** NestJS, TypeScript, Prisma ORM, Class-Validator, JWT, Bcrypt, `@nestjs/schedule`
- **Infrastructure:** Railway (Node container + PostgreSQL), Vercel (Frontend CI/CD)

---

## 📂 Module Breakdown

```
MiniERP/
├── backend/
│   ├── src/
│   │   ├── auth/          # JWT strategy, guards, bcrypt hashing
│   │   ├── users/         # User creation, role scoping, directory
│   │   ├── leave/         # Applications, balance deductions, audit logs
│   │   ├── purchase/      # Multi-tier procurement lifecycle
│   │   ├── dashboard/     # Spend distribution, metrics, KPI aggregators
│   │   ├── cron/          # Daily manager email summaries & balance resets
│   │   └── common/        # Global exception filters, pipes, decorators
│   └── prisma/
│       ├── schema.prisma  # Relational models & enums
│       └── seed.ts        # Database seeders with realistic demo records
└── frontend/
    └── src/
        ├── components/    # Modals, timelines, balance cards, navigation
        ├── context/       # Auth state provider & session persistence
        ├── pages/         # Dashboard, Leave, Purchase, Users, Login
        └── lib/           # Clean API client & error transformers
```

---

## 🗄️ Database Schema

```mermaid
erDiagram
    User ||--o{ LeaveRequest : submits
    User ||--o{ LeaveBalance : holds
    User ||--o{ PurchaseRequest : creates

    User {
        string id PK
        string name
        string email UK
        string passwordHash
        enum role "ADMIN | MANAGER | EMPLOYEE"
        string department
        boolean isActive
    }

    LeaveRequest {
        string id PK
        string employeeId FK
        enum leaveType "CASUAL | SICK | PAID"
        datetime startDate
        datetime endDate
        int daysCount
        enum status "PENDING | APPROVED | REJECTED"
        string rejectionNote
    }

    LeaveBalance {
        string id PK
        string employeeId FK
        enum leaveType
        int totalDays
        int usedDays
        int year
    }

    PurchaseRequest {
        string id PK
        string raisedById FK
        string title
        float estimatedCost
        enum status "PENDING_MANAGER | PENDING_ADMIN | APPROVED | ORDERED | RECEIVED | REJECTED"
        string managerId
        string adminId
    }
```

---

## 💻 Local Development Guide

### 1. Clone & Prepare
```bash
git clone https://github.com/Anshul-an/MiniERP.git
cd MiniERP
```

### 2. Backend Setup
```bash
cd backend
cp .env.example .env
# Set DATABASE_URL and JWT_SECRET in .env
npm install
npx prisma migrate dev
npx prisma db seed
npm run start:dev
```
Backend will start on `http://localhost:3000`.

### 3. Frontend Setup
```bash
cd ../frontend
cp .env.example .env.local
npm install
npm run dev
```
Frontend will start on `http://localhost:5173`.

---

## 📡 API Reference

### 🔐 Authentication
- `POST /auth/login` &mdash; Authenticates user and returns JWT token & profile
- `GET /auth/profile` &mdash; Returns authenticated user context

### 🌴 Leave Management
- `GET /leave` &mdash; Lists user/department leave requests
- `POST /leave` &mdash; Submits new leave application
- `PATCH /leave/:id/status` &mdash; Approves or rejects request (Manager / Admin)
- `GET /leave/balances` &mdash; Returns current balance metrics

### 🛍️ Purchase Orders
- `GET /purchase` &mdash; Lists scoped purchase requests
- `POST /purchase` &mdash; Creates new purchase requisition
- `PATCH /purchase/:id/status` &mdash; Advances or declines procurement stage

### 📊 Dashboard & Admin
- `GET /dashboard/metrics` &mdash; Returns aggregate spend, pending counts & team stats
- `GET /admin/trigger-digest` &mdash; Manually executes manager summary notifications

---

## 🔒 Security & Reliability

- **Safe Token Handling:** Standard HTTP Bearer headers with cryptographic validation.
- **Data Protection:** Global NestJS exception filter sanitizes internal database and Prisma errors before sending to clients.
- **Input Sanitization:** Strict class-validator white-listing rejects unexpected request payloads.
- **CORS Protection:** Configured to dynamically authorize trusted Vercel production and preview deployment origins.

---

<p align="center">
  Developed by <a href="https://github.com/Anshul-an"><strong>Anshul</strong></a> &bull; Licensed under the <strong>MIT License</strong>
</p>
