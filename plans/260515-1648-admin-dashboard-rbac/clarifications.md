---
name: clarifications-admin-dashboard-rbac
description: Resolved design and implementation decisions for admin dashboard RBAC
metadata:
  type: project
---

## Session 2026-05-15

- Q: RBAC roles needed → A: super_admin only
- Q: Audit events to capture → A: Auth events (login, logout, oauth_callback)
- Q: RBAC implementation approach → A: Supabase RLS + user_roles table (custom)
- Q: Admin check in homepage account menu (user_roles table may not exist) → A: Implement Phase 1 DB migration first, then wire homepage properly; graceful fallback (isAdmin=false) in place until then
- Q: Nav links for unbuilt pages (Awards Information, Sun* Kudos) → A: Use # placeholders
- Q: Countdown env var → A: NEXT_PUBLIC_EVENT_DATETIME=2025-12-31T18:30:00+07:00 (ISO-8601)
