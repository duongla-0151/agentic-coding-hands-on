# Profile bản thân Page

**Status:** In Progress | **Branch:** main

## MoMorph
- Screen: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/3FoIx6ALVb

## Clarifications
- A.3 icon collection = hero badges (New/Rising/Super/Legend Hero) from kudos_count
- Spam badge = skip (UI only)
- Kudos filter = "Đã gửi" (sender) / "Nhận được" (recipient) toggle
- Route = /[locale]/profile
- Secret Box button = placeholder (toast "Coming soon")

## Phases

| Phase | Description | Status |
|-------|-------------|--------|
| 1 | UI Components (Track A — background agent) | In Progress |
| 2 | Backend API `/api/profile/kudos` | In Progress |
| 3 | Wire up UI with real data | Pending |
| 4 | Review + commit | Pending |

## Key Files
- `app/[locale]/profile/page.tsx` — server page
- `components/profile/profile-page-client.tsx` — client shell
- `components/profile/profile-hero.tsx` — hero + avatar + badges
- `components/profile/profile-stats.tsx` — stats card
- `components/profile/profile-kudos-feed.tsx` — kudos list (C+D)
- `app/api/profile/kudos/route.ts` — filtered kudos for profile

## Data Sources
- User info: `supabase.auth.getUser()` → `user_metadata`
- Stats: `/api/kudos/stats` (reuse)
- Kudos: new `/api/profile/kudos?type=sent|received`
