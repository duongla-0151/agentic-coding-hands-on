import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getIsAdmin } from "@/lib/supabase/get-is-admin";
import { SiteHeader } from "@/components/homepage/site-header";
import { SiteFooter } from "@/components/homepage/site-footer";
import { WidgetButton } from "@/components/homepage/widget-button";
import { KudosSection } from "@/components/homepage/kudos-section";
import { AwardPageHero } from "@/components/award-information/award-page-hero";
import { AwardDetailSection } from "@/components/award-information/award-detail-section";

export default async function AwardInformationPage({
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

      <main>
        <AwardPageHero />
        <AwardDetailSection />
        <KudosSection locale={locale} />
      </main>

      <SiteFooter locale={locale} />
      <WidgetButton />
    </div>
  );
}
