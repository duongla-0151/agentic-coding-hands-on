const FOOTER_LINKS = [
  { label: "About SAA 2025", href: "#about" },
  { label: "Awards Information", href: "#awards" },
  { label: "Sun* Kudos", href: "#kudos" },
];

export function SiteFooter() {
  return (
    <footer
      className="w-full flex items-center justify-between"
      style={{
        background: "#00101A",
        padding: "40px 90px",
        borderTop: "1px solid #2E3940",
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2 shrink-0">
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path
            d="M10 2L11.8 7.2H17.6L12.9 10.4L14.7 15.6L10 12.4L5.3 15.6L7.1 10.4L2.4 7.2H8.2L10 2Z"
            fill="#FFEA9E"
          />
        </svg>
        <span
          className="font-bold text-white tracking-wide"
          style={{
            fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
            fontSize: "13px",
          }}
        >
          Sun* Annual Awards 2025
        </span>
      </div>

      {/* Nav links */}
      <nav className="flex items-center gap-6" aria-label="Footer navigation">
        {FOOTER_LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="text-white/50 hover:text-white/80 transition-colors text-sm whitespace-nowrap"
            style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
          >
            {link.label}
          </a>
        ))}
      </nav>

      {/* Copyright */}
      <p
        className="text-white/40 text-sm shrink-0"
        style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
      >
        Bản quyền thuộc về Sun* © 2025
      </p>
    </footer>
  );
}
