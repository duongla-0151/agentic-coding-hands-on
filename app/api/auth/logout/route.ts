import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { writeAuditLog } from "@/lib/admin/audit";

export async function POST() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      await writeAuditLog({ userId: user.id, eventType: 'logout' });
    }

    const { error } = await supabase.auth.signOut();
    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
