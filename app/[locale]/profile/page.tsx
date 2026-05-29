import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getIsAdmin } from "@/lib/supabase/get-is-admin";
import { SiteHeader } from "@/components/homepage/site-header";
import { SiteFooter } from "@/components/homepage/site-footer";
import { ProfilePageClient } from "@/components/profile/profile-page-client";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/login`);
  }

  const isAdmin = await getIsAdmin(user.id);
  const meta = user.user_metadata ?? {};

  return (
    <div style={{ background: "#00101A", minHeight: "100vh" }}>
      <SiteHeader locale={locale} isAdmin={isAdmin} />
      <main style={{ paddingTop: 80 }}>
        <ProfilePageClient
          userId={user.id}
          userName={meta.full_name ?? user.email ?? ""}
          userAvatar={meta.avatar_url ?? null}
          userDepartment={meta.phong_ban ?? null}
          locale={locale}
        />
      </main>
      <SiteFooter locale={locale} />
    </div>
  );
}
