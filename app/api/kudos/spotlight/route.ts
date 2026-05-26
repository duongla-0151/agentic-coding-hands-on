import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { fetchUserMap } from "@/lib/kudos/fetch-users";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json([], { status: 401 });

  const [{ data: rows, error }, { count: total }, userMap] = await Promise.all([
    supabase.from("kudos").select("recipient_id, id"),
    supabase.from("kudos").select("*", { count: "exact", head: true }),
    fetchUserMap(),
  ]);

  if (error) return NextResponse.json([], { status: 500 });

  // Build recipient → kudos count
  const countMap = new Map<string, number>();
  for (const r of rows ?? []) {
    countMap.set(r.recipient_id, (countMap.get(r.recipient_id) ?? 0) + 1);
  }

  const recipients = [...countMap.entries()].map(([id, count]) => ({
    id,
    name: userMap.get(id)?.name ?? "Sunner",
    avatar: userMap.get(id)?.avatar ?? null,
    kudos_count: count,
  }));

  return NextResponse.json({ total: total ?? 0, recipients });
}
