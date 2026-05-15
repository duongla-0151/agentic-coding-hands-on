"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { LoginPageView } from "./login-page-view";

interface LoginPageClientProps {
  locale: string;
  title: string;
  subtitle: string;
  cta: string;
  loginLabel: string;
  footerText: string;
}

export function LoginPageClient({
  locale,
  title,
  subtitle,
  cta,
  loginLabel,
  footerText,
}: LoginPageClientProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleLogin() {
    setIsLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    // Only reset loading on error — on success the browser navigates away
    if (error) setIsLoading(false);
  }

  function handleLocaleChange(newLocale: string) {
    router.push(`/${newLocale}/login`);
  }

  return (
    <LoginPageView
      title={title}
      subtitle={subtitle}
      cta={cta}
      loginLabel={loginLabel}
      footerText={footerText}
      onLogin={handleLogin}
      onLocaleChange={handleLocaleChange}
      currentLocale={locale}
      isLoading={isLoading}
    />
  );
}
