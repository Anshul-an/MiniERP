# API Reference

## Base URL

```
http://localhost:3000  (local)
https://your-app.railway.app  (production)
```

## Authentication

All protected endpoints require:
```
Authorization: Bearer <jwt_token>
```

## Endpoints

### Auth

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /auth/login | Public | Login with email+password |
| POST | /auth/register | Admin | Register new user |
| GET | /auth/me | Any | Get current user |

### Leave

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /leave/apply | Any | Submit leave request |
| GET | /leave/my-requests | Any | My leave history |
| GET | /leave/pending | Manager/Admin | Pending approvals |
| PATCH | /leave/:id/approve | Manager/Admin | Approve request |
| PATCH | /leave/:id/reject | Manager/Admin | Reject with reason |
| GET | /leave/balances/:userId | Any | Leave balances |

### Purchase

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /purchase/create | Any | New request |
| GET | /purchase/my-requests | Any | My requests |
| GET | /purchase/pending-manager | Manager/Admin | Manager queue |
| GET | /purchase/pending-admin | Admin | Admin queue |
| PATCH | /purchase/:id/manager-approve | Manager | Manager approves |
| PATCH | /purchase/:id/admin-approve | Admin | Admin approves |
| PATCH | /purchase/:id/mark-ordered | Admin | Mark as ordered |
| PATCH | /purchase/:id/mark-received | Admin | Mark as received |
| GET | /purchase/all | Admin | All requests |

### Dashboard

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | /dashboard | Any | Role-aware dashboard data |

### Admin

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /admin/trigger-digest | Admin | Manually trigger digest job |

### Health

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | /health | Public | Health + DB status |
| GET | /health/ping | Public | Ping |

<!-- reviewed -->

## Error Codes

| Code | Meaning |
|------|---------|
| 400 | Bad request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not found |
| 500 | Internal server error |

## Authentication Flow

1. POST /auth/login -> get JWT
2. Include JWT as Bearer token in all subsequent requests
3. JWT expires in 7 days
