import { LanguageSwitcher } from "./language-switcher";
import { AccountMenu } from "./account-menu";

const NAV_LINKS = [
  { label: "About SAA 2025", href: "#about" },
  { label: "Awards Information", href: "#awards" },
  { label: "Sun* Kudos", href: "#kudos" },
];

interface SiteHeaderProps {
  locale: string;
  isAdmin: boolean;
}

export function SiteHeader({ locale, isAdmin }: SiteHeaderProps) {
  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between"
      style={{
        height: "80px",
        padding: "12px 144px",
        background: "rgba(11, 15, 18, 0.8)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
    >
      {/* Logo */}
      <a href={`/${locale}`} className="flex items-center gap-2 shrink-0">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path
            d="M10 2L11.8 7.2H17.6L12.9 10.4L14.7 15.6L10 12.4L5.3 15.6L7.1 10.4L2.4 7.2H8.2L10 2Z"
            fill="#FFEA9E"
          />
        </svg>
        <span
          className="font-bold text-white tracking-wide whitespace-nowrap"
          style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif", fontSize: "15px" }}
        >
          Sun* Annual Awards 2025
        </span>
      </a>

      {/* Nav links */}
      <nav className="flex items-center gap-8" aria-label="Main navigation">
        {NAV_LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="text-sm text-white/80 hover:text-white transition-colors whitespace-nowrap"
            style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
          >
            {link.label}
          </a>
        ))}
      </nav>

      {/* Right controls */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Notification bell stub */}
        <button
          className="flex items-center justify-center rounded-full hover:bg-white/10 transition-colors cursor-pointer"
          style={{ width: 40, height: 40 }}
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

        <LanguageSwitcher currentLocale={locale} />
        <AccountMenu locale={locale} isAdmin={isAdmin} />
      </div>
    </header>
  );
}
