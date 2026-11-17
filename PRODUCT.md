# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Internal employees at a small-to-medium business. Three distinct roles used daily on desktop, occasionally on mobile:
- **Admin** — HR/ops lead who manages users, approves purchases, sees org-wide stats.
- **Manager** — Department head who approves leave and purchase requests for their team.
- **Employee** — Staff member who applies for leave, raises purchase requests, checks their own status.

## Product Purpose

MiniERP is an internal operations platform that replaces ad-hoc email/spreadsheet workflows for leave management and procurement. It enforces structured approval chains (Employee → Manager → Admin) and gives each role a scoped, real-time view of their responsibilities. Success = zero missed approvals, accurate leave balances, and a full audit trail for purchase spend.

## Positioning

A self-hosted, deploy-anywhere ERP that covers the HR + procurement loop without the licence cost or complexity of SAP/Oracle — built to be auditable by an experienced ERP practitioner.

## Operating Context

- Used on desktop (primary) inside a corporate network or via Railway/Vercel URLs.
- Mobile access is secondary; employees check status and submit quick requests.
- Three concurrent user sessions of different roles operate independently.
- Backend on Railway (NestJS + PostgreSQL), frontend on Vercel (React + Vite).

## Capabilities and Constraints

- Auth: JWT, 7-day expiry, role enum ADMIN/MANAGER/EMPLOYEE.
- Leave module: apply, approve, reject; balance auto-deducted; working-days calculation excludes weekends.
- Purchase module: 7-state machine (DRAFT → PENDING_MANAGER → PENDING_ADMIN → APPROVED → ORDERED → RECEIVED / REJECTED).
- Dashboard: role-aware cards + Recharts bar/donut charts.
- Scheduled jobs: daily digest (cron 0 9 * * *), monthly balance reset (cron 0 0 1 * *).
- No real-time WebSocket; polling acceptable.
- No multi-tenancy; single org per deployment.

## Brand Commitments

- Name: **MiniERP**
- Colour identity: blue-600 as primary action colour, gray-900 sidebar.
- Lucide icons throughout — no emoji as functional UI elements.
- Tone: professional, direct, no marketing fluff inside the app.

## Evidence on Hand

- Full codebase at `c:\Users\lenovo\Desktop\anshul\MiniERP`.
- Seed data: 1 admin, 2 managers, 5 employees, varied leave/purchase records.
- No real screenshots yet (not deployed); visual audit is code-based.

## Product Principles

1. **Role clarity first** — every screen shows only what that role acts on; no noise.
2. **Approval chains are sacred** — status transitions are enforced server-side; the UI reflects the chain, never shortcuts it.
3. **Operational density over decoration** — tables, badges, timelines over cards-of-cards or hero metrics.
4. **Error transparency** — every failed action gives a human-readable reason, never a raw API error.
5. **Mobile as a real use case** — employees submit requests and check status from phones; layout must hold at 375 px.

## Accessibility & Inclusion

Target WCAG AA. All interactive elements need keyboard focus indicators, aria-labels, and minimum 44×44 px touch targets.
