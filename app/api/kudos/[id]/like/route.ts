import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: kudosId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Fetch the kudos to prevent sender or recipient from self-inflating likes
  const { data: kudo } = await supabase.from("kudos").select("sender_id, recipient_id").eq("id", kudosId).single();
  if (!kudo) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (kudo.sender_id === user.id || kudo.recipient_id === user.id) {
    return NextResponse.json({ error: "Cannot like your own kudos" }, { status: 403 });
  }

  // Check if already liked → toggle off
  const { data: existing } = await supabase
    .from("kudos_likes")
    .select("id")
    .eq("kudos_id", kudosId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing) {
    await supabase.from("kudos_likes").delete().eq("id", existing.id);
    return NextResponse.json({ liked: false });
  }

  const { error } = await supabase.from("kudos_likes").insert({ kudos_id: kudosId, user_id: user.id });
  if (error) {
    // 23505 = unique_violation — race condition, treat as already liked
    if (error.code === "23505") return NextResponse.json({ liked: true });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ liked: true });
}
