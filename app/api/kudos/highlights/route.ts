import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { fetchUserMap } from "@/lib/kudos/fetch-users";
import { enrichKudos, buildLikeMaps, buildRecipientCountMap } from "@/lib/kudos/enrich-kudos";

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json([], { status: 401 });

  const hashtag = req.nextUrl.searchParams.get("hashtag") ?? null;
  const department = req.nextUrl.searchParams.get("department") ?? null;

  // Resolve department → recipient IDs
  let departmentRecipientIds: string[] | null = null;
  if (department) {
    const userMap = await fetchUserMap();
    departmentRecipientIds = Array.from(userMap.values())
      .filter((u) => u.department === department)
      .map((u) => u.id);
    if (departmentRecipientIds.length === 0) return NextResponse.json([]);
  }

  // Fetch top-5 kudos by like count using subquery via RPC isn't available,
  // so we fetch like counts first then sort.
  const { data: allLikes } = await supabase
    .from("kudos_likes")
    .select("kudos_id, user_id");

  const likes = allLikes ?? [];

  // Count likes per kudos_id
  const countMap = new Map<string, number>();
  for (const l of likes) countMap.set(l.kudos_id, (countMap.get(l.kudos_id) ?? 0) + 1);

  // Get top 5 kudos_ids by count (descending), fallback to all if fewer
  const topIds = [...countMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([id]) => id);

  // If fewer than 5 liked kudos, pad with recent kudos
  let query = supabase.from("kudos").select("*").order("created_at", { ascending: false });
  if (hashtag) query = query.contains("hashtags", [hashtag]);
  if (departmentRecipientIds) query = query.in("recipient_id", departmentRecipientIds);

  const { data: rows, error } = topIds.length >= 5
    ? await supabase.from("kudos").select("*").in("id", topIds)
    : await query.limit(5);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!rows?.length) return NextResponse.json([]);

  // Apply filters after fetching (for topIds path)
  let filtered = hashtag ? rows.filter((r) => r.hashtags?.includes(hashtag)) : rows;
  if (departmentRecipientIds) {
    filtered = filtered.filter((r) => departmentRecipientIds!.includes(r.recipient_id));
  }
  const ids = filtered.map((r) => r.id);
  const recipientIds = [...new Set(filtered.map((r) => r.recipient_id))];

  const [{ data: pageLikes }, { data: recipRows }, userMap] = await Promise.all([
    supabase.from("kudos_likes").select("kudos_id, user_id").in("kudos_id", ids),
    supabase.from("kudos").select("recipient_id").in("recipient_id", recipientIds),
    fetchUserMap(),
  ]);

  const { likeCountMap, likedByMe } = buildLikeMaps(pageLikes ?? [], user.id);
  const recipientCountMap = buildRecipientCountMap(recipRows ?? []);

  const posts = filtered
    .map((r) => enrichKudos(r, { userMap, likeCountMap, likedByMe, recipientCountMap }))
    .sort((a, b) => b.like_count - a.like_count);

  return NextResponse.json(posts.slice(0, 5));
}
