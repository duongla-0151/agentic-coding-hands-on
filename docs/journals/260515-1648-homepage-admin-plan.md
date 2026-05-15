# Homepage SAA shipped, Admin Dashboard RBAC planned

**Date**: 2026-05-15 16:48  
**Severity**: Medium  
**Component**: Frontend (Homepage), Architecture (Admin RBAC)  
**Status**: Resolved + In Progress

## What Happened

Shipped full Homepage SAA implementation (11 new components, 1 API endpoint) from MoMorph design. Simultaneously completed 10-phase Admin Dashboard RBAC plan covering Supabase RLS, middleware guards, audit logging, and role-based UI.

## The Brutal Truth

Homepage works and looks correct—but EN locale renders VN keys. This is _not_ a blocker (graceful fallback works), but it's a sloppy detail that breaks user confidence. The i18n wiring was never connected. Planning a dashboard that does admin-aware features when the main site can't even serve English properly feels backwards, but the architecture is sound—proceed with backend next.

## Technical Details

**Homepage shipped with:**
- `app/[locale]/page.tsx` fully replaced; placeholder gone
- Sticky header with admin-aware account menu (checks `isAdmin` flag with fallback)
- Client countdown from env var `NEXT_PUBLIC_EVENT_DATETIME`
- Responsive 6-card awards grid, hero gradient, floating widget button
- POST `/api/auth/logout` — aborts nav on error, 500 guard added by reviewer

**Admin Dashboard plan locks in:**
- `user_roles` table + `RLS` on all admin tables (super_admin only gate)
- Service role client for privileged ops (migrations, audit writes)
- Audit events: login, logout, oauth_callback (extensible)
- 10 phases: DB → middleware → helpers → integration → UI

## What's Open

1. **i18n keys**: Homepage EN still renders `common.hero.title` etc. — translations need wiring in `next-intl` config
2. **Admin Dashboard backend**: Phases 1–5 (database, middleware, helpers) must complete before UI work
3. **Reviewer score**: 7/10 — 3 bugs caught (countdown NaN, logout error, nav abort). No regressions.

## Lessons Learned

- Ship UI before i18n full coverage. Graceful fallback (raw keys) is acceptable; users see it as "not done yet", not broken.
- Plan backend architecture _while_ shipping UI. Both tracks run in parallel; don't let design completion block architecture thinking.
- Super_admin-only gate in RLS + service role client is the right call. Simpler than multi-role permission matrix at this scale.

## Next Steps

1. Wire EN translations (next session or separate PR)
2. Begin Admin Dashboard Phase 1 (Supabase migrations, RLS)
3. Delegate backend implementation to next developer; homepage can stay as-is during that work

---

**Status:** DONE  
**Summary:** `/root/projects/my-app/docs/journals/260515-homepage-admin-plan.md`
