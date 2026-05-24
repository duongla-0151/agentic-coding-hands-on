import Image from "next/image";

const MONTSERRAT = "var(--font-montserrat), Montserrat, sans-serif";

interface SiteFooterProps {
  locale: string;
}

export function SiteFooter({ locale }: SiteFooterProps) {
  const FOOTER_LINKS = [
    { label: "About SAA 2025", href: "#about" },
    { label: "Awards Information", href: `/${locale}/awards` },
    { label: "Sun* Kudos", href: "#kudos" },
    { label: "Tiêu chuẩn chung", href: "#" },
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
      {/* Logo + Nav — gap 80px */}
      <div className="flex items-center" style={{ gap: 80 }}>
        {/* Logo */}
        <div className="shrink-0">
          <Image
            src="/images/keyvisual/saa-logo.png"
            alt="Sun* Annual Awards 2025"
            width={69}
            height={64}
            style={{ objectFit: "contain" }}
          />
        </div>

        {/* Nav links — gap 48px, fontWeight 700, white, 16px */}
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

      {/* Copyright — 16px, fontWeight 700, white */}
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
        Bản quyền thuộc về Sun* © 2025
      </p>
    </footer>
  );
}
