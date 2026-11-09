# Prisma Migrations

This directory contains database migration files managed by Prisma.

## Commands

```bash
# Create a new migration
npx prisma migrate dev --name <migration_name>

# Apply migrations in production
npx prisma migrate deploy

# Reset database (dev only)
npx prisma migrate reset
```
