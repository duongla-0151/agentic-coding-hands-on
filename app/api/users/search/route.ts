import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin-client";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const serverClient = await createClient();
  const { data: { user } } = await serverClient.auth.getUser();
  if (!user) return NextResponse.json([], { status: 401 });

  const q = req.nextUrl.searchParams.get("q")?.toLowerCase().trim() ?? "";
  if (q.length < 1) return NextResponse.json([]);

  const supabase = createAdminClient();
  const { data, error } = await supabase.auth.admin.listUsers({ perPage: 1000 });
  if (error) return NextResponse.json([], { status: 500 });

  const results = data.users
    .filter((u) => {
      const name = (u.user_metadata?.full_name ?? "").toLowerCase();
      const email = (u.email ?? "").toLowerCase();
      return name.includes(q) || email.includes(q);
    })
    .slice(0, 10)
    .map((u) => ({
      id: u.id,
      name: u.user_metadata?.full_name ?? u.email ?? u.id,
      email: u.email ?? "",
      avatar: u.user_metadata?.avatar_url ?? null,
    }));

  return NextResponse.json(results);
}
