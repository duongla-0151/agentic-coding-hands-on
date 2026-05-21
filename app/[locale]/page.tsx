import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getIsAdmin } from "@/lib/supabase/get-is-admin";
import { SiteHeader } from "@/components/homepage/site-header";
import { HeroSection } from "@/components/homepage/hero-section";
import { AboutSection } from "@/components/homepage/about-section";
import { AwardsSection } from "@/components/homepage/awards-section";
import { KudosSection } from "@/components/homepage/kudos-section";
import { SiteFooter } from "@/components/homepage/site-footer";
import { WidgetButton } from "@/components/homepage/widget-button";

const EVENT_DATETIME =
  process.env.NEXT_PUBLIC_EVENT_DATETIME ?? "2025-12-31T18:30:00+07:00";

export default async function HomePage({
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

  // getIsAdmin is independent of the user object contents — run after guard confirms user exists
  // Cannot parallelize with getUser because we need user to be non-null before proceeding
  const isAdmin = await getIsAdmin(user.id);

  return (
    <div style={{ background: "#00101A", minHeight: "100vh" }}>
      <SiteHeader locale={locale} isAdmin={isAdmin} />

      <main>
        <HeroSection locale={locale} eventDatetime={EVENT_DATETIME} />
        <AboutSection />
        <AwardsSection locale={locale} />
        <KudosSection locale={locale} />
      </main>

      <SiteFooter locale={locale} />
      <WidgetButton />
    </div>
  );
}
