import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getIsAdmin } from "@/lib/supabase/get-is-admin";
import { SiteHeader } from "@/components/homepage/site-header";
import { SiteFooter } from "@/components/homepage/site-footer";
import { WidgetButton } from "@/components/homepage/widget-button";
import { KudosPageClient } from "@/components/kudos/kudos-page-client";

export default async function KudosPage({
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

  return (
    <div style={{ background: "#00101A", minHeight: "100vh" }}>
      <SiteHeader locale={locale} isAdmin={isAdmin} />
      <main style={{ paddingTop: 80 }}>
        <KudosPageClient locale={locale} userId={user.id} />
      </main>
      <SiteFooter locale={locale} />
      <WidgetButton />
    </div>
  );
}
