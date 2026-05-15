import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { LoginPageClient } from "./login-page-client";

export default async function LoginPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect(`/${locale}`);
  }

  const t = await getTranslations("Login");

  return (
    <LoginPageClient
      locale={locale}
      title={t("title")}
      subtitle={t("subtitle")}
      cta={t("cta")}
      loginLabel={t("loginButton")}
      footerText={t("footer")}
    />
  );
}
