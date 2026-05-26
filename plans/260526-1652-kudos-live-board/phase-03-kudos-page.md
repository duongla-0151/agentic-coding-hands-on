# Phase 3: Kudos Page + Components

## MoMorph ref
https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/MaZUn5xHXZ

## Files to Create

### Page
- `app/[locale]/kudos/page.tsx` — server component, auth guard, fetches initial data

### Components (in `components/kudos/`)
| File | Spec ref | Purpose |
|------|----------|---------|
| `kudos-page-client.tsx` | — | Client shell, manages filter/modal state |
| `kudos-hero.tsx` | A, A.1 | Hero banner + pill write-kudos input |
| `filter-bar.tsx` | B.1.1, B.1.2 | Hashtag dropdown + disabled Phòng ban |
| `highlight-carousel.tsx` | B.2–B.5 | Top-5 carousel with prev/next + pagination |
| `kudos-card.tsx` | B.3, C.3 | Reusable card (highlight variant + feed variant) |
| `spotlight-board.tsx` | B.7 | CSS word cloud of recipient names + count |
| `all-kudos-feed.tsx` | C.2 | Infinite scroll feed using IntersectionObserver |
| `kudos-sidebar.tsx` | D | Stats + Mở quà placeholder + leaderboard |
| `kudos-toast.tsx` | — | Toast notification for "Link copied" |
| `secret-box-modal.tsx` | D.1.8 | Placeholder "Coming soon" modal |

## Design System
- Background: `#00101A`
- Accent yellow: `#FFEA9E`
- Text: `#ffffff`, `rgba(255,255,255,0.7)`
- Card background: `rgba(255,255,255,0.04)` or white for light cards
- Font: `var(--font-montserrat), Montserrat, sans-serif`
- Border radius cards: 16px

## Key Behaviors
- Filter (hashtag) → updates both Highlight and All Kudos sections simultaneously
- Heart toggle → optimistic UI update, revert on error
- Copy Link → copies `window.location.origin + /[locale]/kudos/[id]`, shows toast
- Write kudos pill input → opens existing WriteKudoModal
- Spotlight → shows names of all recipients as scattered text
- Infinite scroll → IntersectionObserver on sentinel div, appends next page

## Star Rating Logic (Hoa thị)
- 1★ = received ≥ 10 kudos
- 2★ = received ≥ 20 kudos  
- 3★ = received ≥ 50 kudos
- Computed from kudos count per recipient in the query

## Empty States
- Highlight: "Hiện tại chưa có Kudos nào."
- All Kudos: "Hiện tại chưa có Kudos nào."
- Sidebar leaderboard: "Chưa có dữ liệu"

## File Size Constraint
Keep each component under 200 lines. Split further if needed.
