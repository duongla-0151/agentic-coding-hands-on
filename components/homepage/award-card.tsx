interface AwardCardProps {
  title: string;
  description: string;
  slug: string;
  locale: string;
  gradientColors: [string, string];
}

export function AwardCard({ title, description, slug, locale, gradientColors }: AwardCardProps) {
  return (
    <article
      className="flex flex-col rounded-lg overflow-hidden"
      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid #2E3940" }}
    >
      {/* Gradient image placeholder */}
      <div
        className="w-full shrink-0"
        style={{
          height: "180px",
          background: `radial-gradient(ellipse at 60% 40%, ${gradientColors[0]} 0%, ${gradientColors[1]} 100%)`,
        }}
        aria-hidden="true"
      />

      {/* Card body */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        <h3
          className="text-white font-bold"
          style={{
            fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
            fontSize: "16px",
            fontWeight: 700,
          }}
        >
          {title}
        </h3>
        <p
          className="text-white/60 text-sm flex-1"
          style={{
            fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
            fontSize: "13px",
            lineHeight: "1.6",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {description}
        </p>
        <a
          href={`/${locale}/awards#${slug}`}
          className="text-sm font-semibold transition-colors self-start"
          style={{ color: "#FFEA9E", fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
        >
          Chi tiết →
        </a>
      </div>
    </article>
  );
}
