import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { fetchUserMap } from "@/lib/kudos/fetch-users";
import { enrichKudos, buildLikeMaps, buildRecipientCountMap } from "@/lib/kudos/enrich-kudos";

const PAGE_SIZE = 20;

/** GET /api/users/[userId]/kudos?cursor=ISO — received kudos for any user */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json([], { status: 401 });

  const { userId } = await params;
  const cursor = req.nextUrl.searchParams.get("cursor") ?? null;

  let query = supabase
    .from("kudos")
    .select("*")
    .eq("recipient_id", userId)
    .order("created_at", { ascending: false })
    .limit(PAGE_SIZE);

  if (cursor) query = query.lt("created_at", cursor);

  const { data: rows, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!rows?.length) return NextResponse.json([]);

  const ids = rows.map((r) => r.id);
  const recipientIds = [...new Set(rows.map((r) => r.recipient_id))];
  const senderIds = [...new Set(rows.filter((r) => r.sender_id).map((r) => r.sender_id as string))];

  const [{ data: likes }, { data: recipRows }, { data: senderRows }, userMap] = await Promise.all([
    supabase.from("kudos_likes").select("kudos_id, user_id").in("kudos_id", ids),
    supabase.from("kudos").select("recipient_id").in("recipient_id", recipientIds),
    senderIds.length > 0
      ? supabase.from("kudos").select("recipient_id").in("recipient_id", senderIds)
      : Promise.resolve({ data: [] }),
    fetchUserMap(),
  ]);

  const { likeCountMap, likedByMe } = buildLikeMaps(likes ?? [], user.id);
  const recipientCountMap = buildRecipientCountMap(recipRows ?? []);
  const senderCountMap = buildRecipientCountMap(senderRows ?? []);

  const posts = rows.map((r) =>
    enrichKudos(r, { userMap, likeCountMap, likedByMe, recipientCountMap, senderCountMap })
  );

  return NextResponse.json(posts);
}
