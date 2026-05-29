import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin-client";
import { getIsAdmin } from "@/lib/supabase/get-is-admin";
import { SiteHeader } from "@/components/homepage/site-header";
import { SiteFooter } from "@/components/homepage/site-footer";
import { OtherProfilePageClient } from "@/components/profile/other-profile-page-client";

export default async function OtherProfilePage({
  params,
}: {
  params: Promise<{ locale: string; userId: string }>;
}) {
  const { locale, userId } = await params;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect(`/${locale}/login`);
  if (user.id === userId) redirect(`/${locale}/profile`);

  const isAdmin = await getIsAdmin(user.id);

  const adminClient = createAdminClient();
  const { data: { user: targetUser }, error } = await adminClient.auth.admin.getUserById(userId);

  if (error || !targetUser) notFound();

  const meta = targetUser.user_metadata ?? {};
  // Do not use targetUser.email as display name — would expose PII to other viewers
  const targetUserName = (meta.full_name as string | undefined) ?? "";

  const { count: receivedCount } = await supabase
    .from("kudos")
    .select("*", { count: "exact", head: true })
    .eq("recipient_id", userId);

  return (
    <div style={{ background: "#00101A", minHeight: "100vh" }}>
      <SiteHeader locale={locale} isAdmin={isAdmin} />
      <main style={{ paddingTop: 80 }}>
        <OtherProfilePageClient
          targetUserId={userId}
          targetUserName={targetUserName}
          targetUserAvatar={(meta.avatar_url as string | undefined) ?? null}
          targetUserDepartment={(meta.phong_ban as string | undefined) ?? null}
          currentUserId={user.id}
          locale={locale}
          receivedCount={receivedCount ?? 0}
        />
      </main>
      <SiteFooter locale={locale} />
    </div>
  );
}
