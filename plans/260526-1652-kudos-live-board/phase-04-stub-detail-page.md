# Phase 4: Stub Kudos Detail Page

## File to Create
- `app/[locale]/kudos/[id]/page.tsx`

## Purpose
Landing target for "Xem chi tiết" links. Fetches the single kudos by ID and renders
a simple card with all fields visible. No edit/delete for now.

## Behavior
- Auth guard: redirect to login if unauthenticated
- Fetch kudos by ID from supabase
- 404 redirect if not found
- Show: sender → recipient, badge, content (full), hashtags, images, created_at
- Back link: `← Quay lại` → `/[locale]/kudos`
- Like button (reuses same API)
