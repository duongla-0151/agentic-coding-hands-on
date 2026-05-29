import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { KUDOS_HASHTAGS } from "@/lib/kudos/constants";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json([], { status: 401 });

  return NextResponse.json(KUDOS_HASHTAGS);
}
