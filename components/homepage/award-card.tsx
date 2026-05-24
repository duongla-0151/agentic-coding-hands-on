import Image from "next/image";

interface AwardCardProps {
  title: string;
  description: string;
  slug: string;
  locale: string;
  badgeLabel: string;
}

const MONTSERRAT = "var(--font-montserrat), Montserrat, sans-serif";

export function AwardCard({ title, description, slug, locale, badgeLabel }: AwardCardProps) {
  return (
    <article
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 24,
      }}
    >
      {/* Picture area — 100% width, square, borderRadius 24px, golden border + glow */}
      <a
        href={`/${locale}/awards#${slug}`}
        style={{
          position: "relative",
          display: "block",
          width: "100%",
          aspectRatio: "1 / 1",
          borderRadius: 24,
          border: "0.955px solid #FFEA9E",
          overflow: "hidden",
          mixBlendMode: "screen",
          boxShadow: "0 4px 4px 0 rgba(0,0,0,0.25), 0 0 6px 0 #FAE287",
        }}
        aria-label={title}
        tabIndex={-1}
      >
        <Image
          src="/images/awards/card-bg-texture.png"
          alt=""
          fill
          sizes="(max-width: 1440px) 33vw, 480px"
          style={{ objectFit: "cover" }}
          aria-hidden="true"
        />
        {/* Badge image centered */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image
            src={`/images/awards/${slug}.png`}
            alt={badgeLabel}
            width={221}
            height={35}
            style={{ width: "66%", height: "auto", objectFit: "contain" }}
          />
        </div>
      </a>

      {/* Card info — gap 4px, no padding */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        <h3
          style={{
            fontFamily: MONTSERRAT,
            fontSize: 24,
            fontWeight: 400,
            color: "#FFEA9E",
            lineHeight: "32px",
            letterSpacing: 0,
            margin: 0,
          }}
        >
          {title}
        </h3>
        <p
          style={{
            fontFamily: MONTSERRAT,
            fontSize: 16,
            fontWeight: 400,
            color: "#ffffff",
            lineHeight: "24px",
            letterSpacing: "0.5px",
            margin: 0,
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
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            padding: "16px 0",
            fontFamily: MONTSERRAT,
            fontSize: 16,
            fontWeight: 500,
            color: "#ffffff",
            lineHeight: "24px",
            letterSpacing: "0.15px",
            textDecoration: "none",
          }}
          className="hover:opacity-80 transition-opacity"
        >
          Chi tiết <span aria-hidden="true">↗</span>
        </a>
      </div>
    </article>
  );
}
