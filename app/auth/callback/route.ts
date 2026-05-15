import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { writeAuditLog } from "@/lib/admin/audit";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    await writeAuditLog({
      userId: data?.user?.id ?? null,
      eventType: error ? 'oauth_callback' : 'login',
      metadata: error ? { error: error.message } : { provider: 'google' },
    });

    if (!error) {
      return NextResponse.redirect(`${origin}/`);
    }
  } else {
    await writeAuditLog({ userId: null, eventType: 'oauth_callback', metadata: { error: 'no_code' } });
  }

  // On failure, redirect to root — proxy will route to the correct locale login
  return NextResponse.redirect(`${origin}/`);
}
