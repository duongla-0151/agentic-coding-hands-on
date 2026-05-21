# Award System Page Implementation

**Date**: 2026-05-21 16:30
**Severity**: Medium
**Component**: `/[locale]/he-thong-giai` page, Award Card System
**Status**: Resolved

## What Happened

Built the "Hệ thống giải" (Award Information) page as a dedicated route with hero banner, sticky navigation sidebar, and 6 award detail cards. The page implements hardcoded award data following the homepage awards-section pattern, with alternating medal badge layouts (left/right).

## The Brutal Truth

Route naming was the only friction point: test cases specified `/he-thong-giai` (Vietnamese), not the anglicized `/award-information` I initially considered. Caught early, no rework needed. The sticky nav active state limitation stung — spec only required click behavior, not scroll-spy, but shipping a nav that doesn't update on scroll feels unpolished. We built what was asked for, not what feels right.

## Technical Details

**New Files:**
- `app/[locale]/he-thong-giai/page.tsx` — main page with hero + nav layout
- `components/award-page-hero.tsx` — hero banner (reuses existing medal SVG)
- `components/award-detail-section.tsx` — sticky sidebar nav (top: 100px, click-driven active state only)
- `components/award-detail-card.tsx` — medal badge + award details with imageRight toggle

**Fixed:**
- `award-card.tsx` dead link: `/awards` → `/he-thong-giai`

**DRY Refactor:**
- Extracted `lib/supabase/get-is-admin.ts` after reviewer flagged duplication across admin-dashboard and page components

**Data Structure:**
- 6 awards hardcoded with dual prize values (Signature 2025: 5M individual / 8M team VNĐ)
- Layout: alternating imageRight = index % 2 !== 0

## What We Tried

Initially considered IntersectionObserver scroll-spy for nav updates. Checked spec — test cases only required click-driven active state. Implemented per spec, not over-engineered.

## Root Cause Analysis

No root cause — this was clean execution. The "unpolished" feeling on scroll isn't a bug, it's a spec compliance vs. UX polish trade-off that was explicitly made and documented.

## Lessons Learned

1. **Hardcoded data is consistent**: All awards pages now follow the same pattern (homepage awards-section + he-thong-giai). Don't add a real database layer unless spec demands it.
2. **DRY catches reviewer questions before they're asked**: Proactively extract shared utilities when patterns repeat across 3+ files.
3. **Spec compliance != polished UX**: Sticky nav without scroll-spy works but feels incomplete. Document the limitation for future work.

## Next Steps

- Sticky nav scroll-spy could be added in a follow-up (enhancement, not bug fix)
- Award data migration to database should be considered when prize structure becomes dynamic
- Mobile responsive testing needed (design specs only showed desktop)

**Owner**: Closed
