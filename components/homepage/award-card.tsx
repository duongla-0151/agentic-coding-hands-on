interface AwardCardProps {
  title: string;
  description: string;
  slug: string;
  locale: string;
  badgeLabel: string;
}

export function AwardCard({ title, description, slug, locale, badgeLabel }: AwardCardProps) {
  return (
    <article
      className="flex flex-col rounded-xl overflow-hidden"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,213,100,0.2)",
      }}
    >
      {/* Badge area */}
      <div
        className="flex items-center justify-center"
        style={{ padding: "36px 24px 24px", background: "rgba(0,0,0,0.2)" }}
      >
        {/* Circular medal badge */}
        <div
          style={{
            position: "relative",
            width: 140,
            height: 140,
            borderRadius: "50%",
            background: "radial-gradient(ellipse at 35% 30%, #fff4b0 0%, #e8a820 30%, #a05c00 65%, #4a2800 100%)",
            boxShadow: "0 0 32px rgba(232,168,32,0.4), 0 0 8px rgba(232,168,32,0.2), inset 0 2px 4px rgba(255,240,160,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Inner ring */}
          <div
            style={{
              position: "absolute",
              inset: 8,
              borderRadius: "50%",
              border: "1.5px solid rgba(255,235,140,0.5)",
            }}
          />
          {/* Center dark oval with label */}
          <div
            style={{
              position: "relative",
              zIndex: 1,
              width: 96,
              height: 96,
              borderRadius: "50%",
              background: "radial-gradient(ellipse at 40% 35%, #1a0d00 0%, #0a0500 100%)",
              border: "1px solid rgba(255,213,100,0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "8px",
            }}
          >
            <span
              className="text-center uppercase font-black leading-tight"
              style={{
                fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                fontSize: badgeLabel.length > 10 ? "8px" : "10px",
                fontWeight: 900,
                color: "#FFEA9E",
                letterSpacing: "0.05em",
              }}
            >
              {badgeLabel}
            </span>
          </div>
        </div>
      </div>

      {/* Card body */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        <h3
          className="text-white font-bold"
          style={{
            fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
            fontSize: "15px",
            fontWeight: 700,
          }}
        >
          {title}
        </h3>
        <p
          className="text-white/55 flex-1"
          style={{
            fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
            fontSize: "12px",
            lineHeight: "1.65",
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {description}
        </p>
        <a
          href={`/${locale}/awards#${slug}`}
          className="text-sm font-semibold transition-opacity hover:opacity-80 self-start flex items-center gap-1"
          style={{
            color: "#FFEA9E",
            fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
            fontSize: "12px",
          }}
        >
          Chi tiết <span aria-hidden="true">↗</span>
        </a>
      </div>
    </article>
  );
}
