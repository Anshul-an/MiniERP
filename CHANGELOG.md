# Changelog

All notable changes to MiniERP will be documented in this file.

## [Unreleased]

### Added
- HttpExceptionFilter for consistent error responses
- LoggingInterceptor for request/response logging
- TransformInterceptor for uniform API response shape
- Pagination support with PaginationQueryDto
- JWT payload interface
- Leave balance auto-deduction on approval
- Purchase multi-step approval chain
- node-cron scheduled jobs (daily digest + monthly balance reset)
- Role-based access control via RolesGuard
- Admin dashboard with charts (Recharts)

### Changed
- Improved health check endpoint with DB connectivity test
- Refactored auth service to use bcrypt for password hashing
- Leave service now excludes weekends from day count calculation

### Fixed
- Null check for reviewer field in leave response
- Edge case in working days calculation for same-day leaves

## [0.1.0] - 2026-10-25

### Added
- Initial project setup with NestJS + Prisma + React + Vite
- Auth module with JWT authentication
- Users module with role management
- Leave module with PENDING/APPROVED/REJECTED workflow
- Purchase module with multi-stage approval chain
- Dashboard module with role-aware cards and charts
- Scheduled jobs with node-cron
- PostgreSQL schema with all tables and relations
- Frontend with shadcn/ui components
- Seed data with demo credentials

## [0.2.0] - 2026-11-15

### Added
- HttpExceptionFilter for consistent error responses
- LoggingInterceptor and TransformInterceptor
- RequestLoggerMiddleware
- Pagination support
- Architecture documentation (docs/ARCHITECTURE.md)
- API reference documentation (docs/API.md)
- Dockerfile + docker-compose for local dev
- CONTRIBUTING.md
- CHANGELOG.md

### Fixed
- Leave date range validation (end >= start)
- Prevent self-approval of leave requests
- Dashboard spend calculation includes ordered+received status
- Seed now uses upsert to avoid duplicate errors
- Mobile nav closes on route change
- Leave form - cannot pick past start date
- Purchase form - decimal cost input, positive quantity validation

### Changed
- README updated with full deployment guide and demo credentials
- railway.toml improved with health check configuration
- vercel.json improved with cache headers

<!-- end -->
// v0.3.0
