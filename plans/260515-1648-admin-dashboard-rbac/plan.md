---
name: admin-dashboard-rbac
description: Admin dashboard with RBAC (super_admin), user management, and audit logs using Supabase local
status: planned
blockedBy: []
blocks: []
---

# Admin Dashboard — RBAC, User Management, Audit Logs

## Overview

Build a protected `/admin` section for `super_admin` users. Uses Supabase local with a `user_roles` table + RLS for RBAC. Audit logs capture auth events. No MoMorph design data — implementation follows existing codebase patterns.

**Stack:** Next.js 16.2.6 App Router · Supabase local · next-intl (vi/en) · Tailwind v4 · TypeScript

## Phases

| # | Phase | Status |
|---|-------|--------|
| 1 | [Database Setup](phase-01-database-setup.md) | planned |
| 2 | [Middleware & RBAC Guard](phase-02-middleware-rbac.md) | planned |
| 3 | [Server Helpers & Audit Writer](phase-03-server-helpers.md) | planned |
| 4 | [Auth Flow — Audit Log Integration](phase-04-auth-audit.md) | planned |
| 5 | [Admin Layout & Sidebar](phase-05-admin-layout.md) | planned |
| 6 | [Admin Dashboard Overview](phase-06-dashboard-overview.md) | planned |
| 7 | [Users List Page](phase-07-users-list.md) | planned |
| 8 | [User Detail Page](phase-08-user-detail.md) | planned |
| 9 | [Audit Logs Page](phase-09-audit-logs.md) | planned |
| 10 | [Homepage Account Menu](phase-10-account-menu.md) | completed |

## Key Decisions

- RBAC: `user_roles` table in `public` schema + RLS policies enforced at DB level
- Only `super_admin` role (no moderator)
- Audit events: `login`, `logout`, `oauth_callback` only
- Admin routes: `/{locale}/admin/*` guarded in `proxy.ts` middleware
- Service role client (`SUPABASE_SERVICE_ROLE_KEY`) used for admin-only DB operations
- Data fetching via Server Components + Server Actions for mutations
- i18n: add Admin translations to `messages/vi.json` and `messages/en.json`

## Files Created/Modified Summary

### New
- `supabase/migrations/20260515_admin_rbac.sql`
- `lib/supabase/admin-client.ts`
- `lib/admin/check-admin.ts`
- `lib/admin/audit.ts`
- `app/[locale]/admin/layout.tsx`
- `app/[locale]/admin/page.tsx`
- `app/[locale]/admin/users/page.tsx`
- `app/[locale]/admin/users/[userId]/page.tsx`
- `app/[locale]/admin/audit-logs/page.tsx`
- `components/admin/admin-sidebar.tsx`
- `components/admin/users-table.tsx`
- `components/admin/audit-logs-table.tsx`
- `components/admin/role-badge.tsx`
- `components/admin/stat-card.tsx`
- `app/api/admin/users/[userId]/role/route.ts`
- `app/api/auth/logout/route.ts`

### Modified
- `proxy.ts` — add admin route protection
- `app/auth/callback/route.ts` — log oauth_callback + login event
- `app/[locale]/page.tsx` — add account menu with admin link
- `messages/vi.json` — admin i18n strings
- `messages/en.json` — admin i18n strings
- `.env.local` — add `SUPABASE_SERVICE_ROLE_KEY`
