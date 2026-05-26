---
name: reviewer-260526-1705-kudos-live-board
description: Production-readiness review of Sun* Kudos live board — security, correctness, performance
metadata:
  type: project
---

# Code Review: Sun* Kudos Live Board

**Date:** 2026-05-26  
**Scope:** DB migration (kudos_likes), lib/kudos/*, 6 API routes, 2 pages, 13 components  
**Reviewer:** Staff Engineer (reviewer agent)

---

## Overall Assessment

The feature is largely correct and well-structured. Auth gates are present on every route. The main concerns are: a stored XSS vector (client-only sanitization + `dangerouslySetInnerHTML`), a PII leak (email in every API response), and two correctness bugs (cursor pagination collision, highlights filter returning < 5 results after a hashtag filter against the `topIds` path).

---

## Critical Issues

### 1. Stored XSS — `dangerouslySetInnerHTML` on unsanitized server-stored content

**File:** `components/kudos/kudos-card.tsx:90`

```tsx
dangerouslySetInnerHTML={{ __html: post.content }}
```

`content` is HTML written in the browser's rich-text editor and sanitized client-side in `write-kudo-modal.tsx:82`. The client-side `sanitizeContent` strips `<script>`, inline handlers, and non-http `href` — but it does **not** strip:
- `<iframe srcdoc="<script>…">` 
- `<img src=x onerror=…>` (the `onerror` is an `on*` attr and would be caught, but `src="javascript:…"` is not checked)
- `<svg><animate onbegin=…>` (SVG event attributes)
- CSS `expression()` or `url('javascript:…')`

More critically: no server-side sanitization exists anywhere. Any attacker who can POST directly to Supabase (bypassing the modal) — which RLS permits once authenticated — can insert arbitrary HTML. That HTML is then rendered to all logged-in users.

**Fix:** Sanitize on read, not on write. Add a server-side pass using a whitelist library (e.g., `sanitize-html` or `isomorphic-dompurify`) in the API route or in `enrichKudos` before returning. Alternatively, use a React rich-text renderer that never calls `dangerouslySetInnerHTML`.

---

### 2. PII leak — `email` field in all API responses

**Files:** `lib/kudos/types.ts:5`, `lib/kudos/fetch-users.ts:22`, all GET routes

`UserInfo.email` is populated from `auth.users` (service-role access) and serialized into every `KudosPost` object returned from `/api/kudos`, `/api/kudos/highlights`, `/api/kudos/spotlight`, and the `[id]` detail page. No component ever reads `.email`, but any browser `fetch('/api/kudos')` call — by any authenticated user — leaks the email addresses of all senders and recipients on the page.

**Fix:** Remove `email` from `UserInfo` or strip it before serialization. Since no UI component uses it, simply delete the field from the type and the `fetchUserMap` mapping.

---

## High Priority

### 3. Highlights route: fetches ALL `kudos_likes` rows with no limit

**File:** `app/api/kudos/highlights/route.ts:15-17`

```ts
const { data: allLikes } = await supabase
  .from("kudos_likes")
  .select("kudos_id, user_id");
```

No `.limit()`. As the table grows this returns unbounded rows to the Node process to sort in-memory. At 100k likes this is already ~6 MB of JSON per request.

**Fix:** Use a Supabase RPC or a `GROUP BY` aggregate query. A minimal fix is to add a DB function that returns `(kudos_id, count)` pairs directly. If an RPC isn't available yet, at minimum add `.limit(10000)` as a guard and document the limitation.

### 4. `fetchUserMap` hard cap at 1000 users

**File:** `lib/kudos/fetch-users.ts:13`

```ts
const { data, error } = await admin.auth.admin.listUsers({ perPage: 1000 });
```

`listUsers` paginates; `perPage: 1000` is not a global fetch — it's page 1 only. If the org exceeds 1000 users, users 1001+ will always fall back to the `UNKNOWN_USER` placeholder ("Ẩn danh") even though they are known.

**Fix:** Loop using `page` parameter until `data.nextPage` is null, or use `aud`-filtered RPC. For now at least document the implicit ceiling.

### 5. Cursor pagination collision — duplicate/skipped posts

**File:** `app/api/kudos/route.ts:24`

```ts
if (cursor) query = query.lt("created_at", cursor);
```

`created_at` is not unique. Two kudos created within the same millisecond (bulk imports, tests) share the same timestamp. The `lt` cursor will skip all items at the same timestamp as the last fetched item, or return duplicates if the page boundary falls mid-timestamp-group.

**Fix:** Use a composite cursor: `(created_at, id)`. Filter with `.lt("created_at", cursor_ts).or("created_at.eq." + cursor_ts + ",id.lt." + cursor_id)`. Alternatively use a keyset on a surrogate sequential column.

### 6. `sender_id` null — anonymous posts can be liked by recipient

**File:** `app/api/kudos/[id]/like/route.ts:16`

```ts
if (kudo.sender_id === user.id) {
  return NextResponse.json({ error: "Cannot like your own kudos" }, { status: 403 });
}
```

When `sender_id IS NULL` (anonymous post), `null === user.id` is always false, so the check passes for everyone including the recipient. This is probably intended (anonymous sender is unknown), but the *recipient* of a kudo should also be blocked from liking it. Currently recipients can inflate their own like counts.

**Fix:** Fetch `recipient_id` alongside `sender_id` and also block `kudo.recipient_id === user.id`.

### 7. Missing DB indexes on `kudos_likes` filter columns

**File:** `supabase/migrations/20260526000003_kudos_likes.sql`

The migration creates the `kudos_likes` table with a `UNIQUE (kudos_id, user_id)` constraint (which implicitly creates an index on `(kudos_id, user_id)`), but `user_id` alone has no index. The stats route queries `.in("kudos_id", kudosIds)` which hits the composite index fine, but a future query on `user_id` alone would seq-scan.

More importantly: the `kudos` table has no explicit index on `recipient_id` or `sender_id`, both of which are used in `WHERE` clauses across multiple routes.

**Fix:**
```sql
create index if not exists idx_kudos_recipient_id on public.kudos(recipient_id);
create index if not exists idx_kudos_sender_id on public.kudos(sender_id);
create index if not exists idx_kudos_created_at on public.kudos(created_at desc);
create index if not exists idx_kudos_likes_user_id on public.kudos_likes(user_id);
```

---

## Medium Priority

### 8. Highlights route: hashtag filter may return 0 results from the `topIds` path

**File:** `app/api/kudos/highlights/route.ts:35-43`

When `topIds.length >= 5`, it fetches those 5 kudos by ID, then applies the hashtag filter client-side (line 43). If none of the top-5 liked posts belong to the selected hashtag, `filtered` is empty and the response is `[]` — even though hashtag-filtered kudos exist. The fallback `query.limit(5)` with hashtag filter (line 33) is only used when `topIds < 5`.

**Fix:** When a hashtag filter is active, always use the fallback path (recent filtered kudos), or pre-filter `topIds` to those matching the hashtag before deciding which path to take.

### 9. `recipientCountMap` from `route.ts` is correct but misleading — actually counts ALL-TIME

The query `supabase.from("kudos").select("recipient_id").in("recipient_id", recipientIds)` returns every kudos row ever received by any recipient in the current page's set. This is intentional (star count should be all-time), but it fetches full rows with no `.select("recipient_id")` projection on the outer query implying `select *`. Actually it does select only `recipient_id` — this is fine. No bug, just a note that this query will grow as kudos accumulate.

### 10. `like` toggle — TOCTOU race is DB-covered but error is swallowed

**File:** `app/api/kudos/[id]/like/route.ts:33`

The `check-then-insert` pattern is a TOCTOU race, but the `UNIQUE (kudos_id, user_id)` constraint handles concurrent inserts. However, when the insert fails due to a unique violation, `error.message` is returned to the client with a 500, which would break the optimistic UI update. The unique constraint error should be caught and treated as a no-op (already liked).

**Fix:**
```ts
if (error) {
  // unique violation: already liked by concurrent request — treat as liked
  if (error.code === '23505') return NextResponse.json({ liked: true });
  return NextResponse.json({ error: error.message }, { status: 500 });
}
```

### 11. Multiple `KudosToast` instances rendered simultaneously

Three components mount their own `KudosToast` fixed-positioned at `bottom: 32, left: 50%`: `AllKudosFeed`, `KudosHighlightSection`, and `KudosCardServer`. If copy-link and a like action fire in quick succession across two sections, both toasts stack on each other at the same coordinates.

**Fix:** Lift toast state to `KudosPageClient` and pass a `showToast` callback down, or use a shared toast context.

### 12. Image `src` rendered via `<img src={src}>` — no URL validation

**File:** `components/kudos/kudos-card.tsx:121`

Images are Supabase Storage public URLs in practice, but the `images` field is a `text[]` column with no URL format constraint. A malicious (or API-direct) insert could include `javascript:` or `data:` URLs. The `<a href={src}>` wrapper also creates an open redirect to arbitrary URLs.

**Fix:** In the component, validate that `src.startsWith("https://")` before rendering. A DB `CHECK` constraint on `images` (each element matches `https://...`) would enforce this at storage level.

### 13. In-process module-level cache is not safe for concurrent serverless boots

**File:** `lib/kudos/fetch-users.ts:5-6`

```ts
let cache: Map<string, UserInfo> | null = null;
let cacheTs = 0;
```

Module-level mutable state works in a single-process Node server but is unreliable across serverless function instances — each cold boot gets an empty cache and hits `listUsers`. This is a performance characteristic, not a correctness bug, but worth noting: the 30s TTL means `listUsers` (a costly admin API call) can be invoked many times per minute under load.

**Fix:** Use Next.js `unstable_cache` or `cache()` from React's server cache API, which respects the request deduplication model properly.

---

## Low Priority

### 14. `formatDate` uses local timezone — inconsistent for global users

**File:** `components/kudos/kudos-card.tsx:20-28`

`new Date(iso)` formatted with `getHours()` / `getMinutes()` uses the browser's local timezone. Two users in different timezones see different times for the same post. Use `toLocaleString` with a fixed timezone (`Asia/Ho_Chi_Minh`) or display relative time.

### 15. `spotlight-word-cloud.tsx` — names are displayed without HTML escaping

**File:** `components/kudos/spotlight-word-cloud.tsx:83`

```tsx
{r.name}
```

React auto-escapes text content, so this is safe. No action needed — confirmed not a XSS vector.

### 16. `kudos-card.tsx` — `key={i}` on image list

**File:** `components/kudos/kudos-card.tsx:119`

```tsx
{post.images.slice(0, 5).map((src, i) => (
  <a key={i} href={src} ...>
```

Index-as-key is a lint warning and causes mis-rendering if the images array changes. Use `key={src}` (URLs are unique per post).

### 17. `SpotlightWordCloud` — word positions can overlap

**File:** `components/kudos/spotlight-word-cloud.tsx:60-63`

The pseudo-random position uses only `name` and `index` as seed — entries with identical names at different indices can still produce spatially close positions. No crash, just cosmetic.

---

## Positive Observations

- Auth check on every API route using `supabase.auth.getUser()` (not just cookie parsing) — correct.
- RLS on both `kudos` and `kudos_likes` with insert policies tied to `auth.uid()` — correct.
- `unique (kudos_id, user_id)` on `kudos_likes` as a DB-level idempotency guard — correct.
- `on delete cascade` on `kudos_likes.kudos_id` — correct cleanup.
- `enrichKudos` and `buildLikeMaps` are pure functions, easy to test.
- Optimistic like UI update (no refetch) — good UX pattern.
- Infinite scroll sentinel observer correctly disconnected on effect cleanup.
- Anonymous sender: `sender_id` nullable with separate `anonymous_name` field — clean design.

---

## Recommended Actions (prioritized)

1. **[CRITICAL]** Add server-side HTML sanitization before `dangerouslySetInnerHTML` — or switch to a safe renderer.
2. **[CRITICAL]** Remove `email` from `UserInfo` and API responses.
3. **[HIGH]** Fix highlights route: replace full `kudos_likes` table scan with an aggregate query.
4. **[HIGH]** Add DB indexes for `kudos(recipient_id)`, `kudos(sender_id)`, `kudos(created_at DESC)`.
5. **[HIGH]** Fix cursor pagination: composite `(created_at, id)` keyset.
6. **[HIGH]** Block recipient from liking their own received kudos.
7. **[HIGH]** Fix `listUsers` pagination — loop or document 1000-user ceiling.
8. **[MEDIUM]** Fix highlights hashtag filter to avoid empty result from `topIds` path.
9. **[MEDIUM]** Handle `23505` unique violation in like insert as a no-op rather than 500.
10. **[MEDIUM]** Lift `KudosToast` to shared context to avoid overlapping toasts.
11. **[MEDIUM]** Validate image URLs before rendering (client + DB constraint).
12. **[LOW]** Replace `key={i}` with `key={src}` in image list.

---

## Unresolved Questions

- Is the recipient-can-like-own restriction a product decision or an oversight? (Item 6)
- Is there a content length limit planned for `kudos.content`? An unbounded `text` column storing rich HTML could grow large.
- Should the spotlight leaderboard show all-time top recipients or only within the current event window? Currently it shows all-time.
