"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "./language-switcher";
import { AccountMenu } from "./account-menu";

interface SiteHeaderProps {
  locale: string;
  isAdmin: boolean;
}

export function SiteHeader({ locale, isAdmin }: SiteHeaderProps) {
  const pathname = usePathname();
  const t = useTranslations("Nav");
  const isHome = pathname === `/${locale}` || pathname === `/${locale}/`;

  const NAV_LINKS = [
    { label: t("aboutSaa"), href: "#about", active: isHome },
    { label: t("awardsInfo"), href: `/${locale}/awards`, active: pathname.startsWith(`/${locale}/awards`) },
    { label: t("sunKudos"), href: "#kudos", active: false },
  ];

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between"
      style={{
        height: "80px",
        padding: "12px 144px",
        background: "rgba(16, 20, 23, 0.8)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
    >
      {/* Left: Logo + Nav */}
      <div className="flex items-center shrink-0" style={{ gap: "64px" }}>
        <a href={`/${locale}`} className="shrink-0">
          <Image
            src="/images/keyvisual/saa-logo-header.png"
            alt="Sun* Annual Awards 2025"
            width={52}
            height={48}
            style={{ width: "auto", height: "48px", objectFit: "contain" }}
            priority
          />
        </a>

        <nav className="flex items-center" style={{ gap: "24px" }} aria-label="Main navigation">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="flex items-center whitespace-nowrap transition-colors hover:text-white"
              style={{
                fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                fontSize: "14px",
                fontWeight: 700,
                lineHeight: "20px",
                letterSpacing: "0.1px",
                padding: "16px",
                color: link.active ? "#FFEA9E" : "#ffffff",
                borderBottom: link.active ? "1px solid #FFEA9E" : "1px solid transparent",
                textShadow: link.active ? "0 4px 4px rgba(0,0,0,0.25), 0 0 6px #FAE287" : "none",
              }}
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>

      {/* Right controls: Language → Notification → Profile */}
      <div className="flex items-center shrink-0" style={{ gap: "16px" }}>
        <LanguageSwitcher currentLocale={locale} />

        <button
          className="flex items-center justify-center transition-colors hover:bg-white/10 cursor-pointer"
          style={{ width: 40, height: 40, borderRadius: "4px", padding: "10px", backgroundColor: "transparent" }}
          aria-label="Notifications"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path
              d="M10 2a6 6 0 0 0-6 6v3l-1.5 2.5h15L16 11V8a6 6 0 0 0-6-6Z"
              stroke="white"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <path
              d="M8 15.5a2 2 0 0 0 4 0"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <AccountMenu locale={locale} isAdmin={isAdmin} />
      </div>
    </header>
  );
}
