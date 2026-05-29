import Image from "next/image";
import { getTranslations } from "next-intl/server";

const MONTSERRAT = "var(--font-montserrat), Montserrat, sans-serif";

interface SiteFooterProps {
  locale: string;
}

export async function SiteFooter({ locale }: SiteFooterProps) {
  const tNav = await getTranslations("Nav");
  const tFooter = await getTranslations("Footer");

  const FOOTER_LINKS = [
    { label: tNav("aboutSaa"), href: "#about" },
    { label: tNav("awardsInfo"), href: `/${locale}/awards` },
    { label: tNav("sunKudos"), href: "#kudos" },
    { label: tNav("generalStandard"), href: "#" },
  ];

  return (
    <footer
      className="w-full flex items-center justify-between"
      style={{
        background: "#00101A",
        padding: "40px 90px",
        borderTop: "1px solid #2E3940",
      }}
    >
      {/* Logo + Nav */}
      <div className="flex items-center" style={{ gap: 80 }}>
        <div className="shrink-0">
          <Image
            src="/images/keyvisual/saa-logo.png"
            alt="Sun* Annual Awards 2025"
            width={69}
            height={64}
            style={{ objectFit: "contain" }}
          />
        </div>

        <nav
          className="flex items-center"
          style={{ gap: 48 }}
          aria-label="Footer navigation"
        >
          {FOOTER_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="hover:opacity-70 transition-opacity whitespace-nowrap"
              style={{
                fontFamily: MONTSERRAT,
                fontSize: 16,
                fontWeight: 700,
                color: "#ffffff",
                letterSpacing: "0.15px",
                textDecoration: "none",
                padding: "16px 0",
              }}
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>

      <p
        style={{
          fontFamily: MONTSERRAT,
          fontSize: 16,
          fontWeight: 700,
          color: "#ffffff",
          margin: 0,
          whiteSpace: "nowrap",
        }}
      >
        {tFooter("copyright")}
      </p>
    </footer>
  );
}
