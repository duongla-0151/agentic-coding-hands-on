import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const uid = user.id;

  const [
    { count: received },
    { count: sent },
    { data: myKudosIds },
  ] = await Promise.all([
    supabase.from("kudos").select("*", { count: "exact", head: true }).eq("recipient_id", uid),
    supabase.from("kudos").select("*", { count: "exact", head: true }).eq("sender_id", uid),
    supabase.from("kudos").select("id").eq("recipient_id", uid),
  ]);

  // Count hearts received = likes on kudos where I am the recipient
  const kudosIds = (myKudosIds ?? []).map((k) => k.id);
  const { count: hearts } = kudosIds.length
    ? await supabase
        .from("kudos_likes")
        .select("*", { count: "exact", head: true })
        .in("kudos_id", kudosIds)
    : { count: 0 };

  return NextResponse.json({
    received: received ?? 0,
    sent: sent ?? 0,
    hearts: hearts ?? 0,
    secret_boxes_opened: 0,
    secret_boxes_available: 0,
  });
}
