import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { fetchUserMap } from "@/lib/kudos/fetch-users";
import { enrichKudos, buildLikeMaps, buildRecipientCountMap } from "@/lib/kudos/enrich-kudos";

const PAGE_SIZE = 20;

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json([], { status: 401 });

  const params = req.nextUrl.searchParams;
  const hashtag = params.get("hashtag") ?? null;
  const department = params.get("department") ?? null;
  const cursor = params.get("cursor") ?? null; // ISO timestamp of last item

  let query = supabase
    .from("kudos")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(PAGE_SIZE);

  if (hashtag) query = query.contains("hashtags", [hashtag]);
  if (cursor) query = query.lt("created_at", cursor);

  if (department) {
    const { fetchUserMap } = await import("@/lib/kudos/fetch-users");
    const userMap = await fetchUserMap();
    const recipientIds = Array.from(userMap.values())
      .filter((u) => u.department === department)
      .map((u) => u.id);
    if (recipientIds.length === 0) return NextResponse.json([]);
    query = query.in("recipient_id", recipientIds);
  }

  const { data: rows, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!rows?.length) return NextResponse.json([]);

  const ids = rows.map((r) => r.id);
  const recipientIds = [...new Set(rows.map((r) => r.recipient_id))];

  const [{ data: likes }, { data: recipRows }, userMap] = await Promise.all([
    supabase.from("kudos_likes").select("kudos_id, user_id").in("kudos_id", ids),
    supabase.from("kudos").select("recipient_id").in("recipient_id", recipientIds),
    fetchUserMap(),
  ]);

  const { likeCountMap, likedByMe } = buildLikeMaps(likes ?? [], user.id);
  const recipientCountMap = buildRecipientCountMap(recipRows ?? []);

  const posts = rows.map((r) =>
    enrichKudos(r, { userMap, likeCountMap, likedByMe, recipientCountMap })
  );

  return NextResponse.json(posts);
}
