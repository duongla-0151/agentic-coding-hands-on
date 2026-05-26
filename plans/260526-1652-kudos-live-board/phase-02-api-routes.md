# Phase 2: API Routes

## Files to Create

| Route | File | Purpose |
|-------|------|---------|
| GET /api/kudos | `app/api/kudos/route.ts` | Paginated feed, hashtag filter, like counts |
| GET /api/kudos/highlights | `app/api/kudos/highlights/route.ts` | Top 5 by like count |
| GET /api/kudos/hashtags | `app/api/kudos/hashtags/route.ts` | Distinct hashtags for filter dropdown |
| GET /api/kudos/stats | `app/api/kudos/stats/route.ts` | Auth user's kudos sent/received/hearts |
| POST/DELETE /api/kudos/[id]/like | `app/api/kudos/[id]/like/route.ts` | Toggle like |
| GET /api/kudos/spotlight | `app/api/kudos/spotlight/route.ts` | Recipient names for word cloud |

## Key Logic

### GET /api/kudos
- Query params: `hashtag`, `cursor` (created_at ISO), `limit=20`
- Join kudos_likes count, auth.users metadata (name, avatar)
- Returns: kudos[] with `like_count`, `liked_by_me` (bool), sender/recipient name+avatar

### GET /api/kudos/highlights
- Top 5 kudos ordered by like_count DESC
- Same join as above
- Filtered by hashtag if provided

### POST /api/kudos/[id]/like
- Auth required
- Upsert into kudos_likes; if already exists → delete (toggle)
- Sender cannot like own kudos: check sender_id == auth.uid()

### GET /api/kudos/stats
- Auth required
- sent: count where sender_id = me
- received: count where recipient_id = me
- hearts: sum of likes on kudos where recipient_id = me

## User Data Pattern
All user lookups use `supabase.auth.admin.listUsers` (admin client, cached in-process).
Return shape: `{ id, name, avatar, email }`
