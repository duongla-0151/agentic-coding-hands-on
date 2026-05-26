import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json([], { status: 401 });

  const { data, error } = await supabase.from("kudos").select("hashtags");
  if (error) return NextResponse.json([], { status: 500 });

  const all = (data ?? []).flatMap((r) => r.hashtags ?? []);
  const unique = [...new Set(all)].sort();

  return NextResponse.json(unique);
}
