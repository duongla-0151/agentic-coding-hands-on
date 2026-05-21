import Image from "next/image";

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
        <div style={{ position: "relative", width: 140, height: 140 }}>
          <Image
            src="/images/awards/card-bg-texture.png"
            alt=""
            fill
            sizes="140px"
            style={{ objectFit: "contain" }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0 18px",
            }}
          >
            <Image
              src={`/images/awards/${slug}.png`}
              alt={badgeLabel}
              width={110}
              height={45}
              style={{ objectFit: "contain" }}
            />
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
          href={`/${locale}/he-thong-giai`}
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
