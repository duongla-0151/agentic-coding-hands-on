import Image from "next/image";

interface AwardDetailCardProps {
  id: string;
  title: string;
  badgeLabel: string;
  description: string;
  count: string;
  unit: string;
  value: string;
  valueNote: string;
  value2?: string;
  value2Note?: string;
  imageRight?: boolean;
}

export function AwardDetailCard({
  id,
  title,
  badgeLabel,
  description,
  count,
  unit,
  value,
  valueNote,
  value2,
  value2Note,
  imageRight = false,
}: AwardDetailCardProps) {
  const content = (
    <div className="flex flex-col justify-center gap-4" style={{ flex: 1, minWidth: 0 }}>
      <h3
        className="text-white font-black uppercase"
        style={{
          fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
          fontSize: "22px",
          fontWeight: 900,
        }}
      >
        {title}
      </h3>
      <p
        className="text-white/60"
        style={{
          fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
          fontSize: "13px",
          lineHeight: "1.75",
        }}
      >
        {description}
      </p>
      <div className="flex flex-col gap-3 mt-2">
        <div className="flex items-baseline gap-2">
          <span className="text-white/50" style={{ fontSize: "12px", whiteSpace: "nowrap" }}>
            Số lượng giải thưởng:
          </span>
          <span
            className="font-black"
            style={{ fontFamily: "var(--font-montserrat)", fontSize: "22px", color: "#FFEA9E" }}
          >
            {count}
          </span>
          <span className="text-white/60" style={{ fontSize: "12px" }}>
            {unit}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-white/50" style={{ fontSize: "12px" }}>
            Giá trị giải thưởng:
          </span>
          <div className="flex items-baseline gap-2">
            <span
              className="font-black"
              style={{ fontFamily: "var(--font-montserrat)", fontSize: "22px", color: "#FFEA9E" }}
            >
              {value}
            </span>
            {valueNote && (
              <span className="text-white/50" style={{ fontSize: "11px" }}>
                {valueNote}
              </span>
            )}
          </div>
          {value2 && (
            <div className="flex items-baseline gap-2">
              <span
                className="font-black"
                style={{ fontFamily: "var(--font-montserrat)", fontSize: "22px", color: "#FFEA9E" }}
              >
                {value2}
              </span>
              {value2Note && (
                <span className="text-white/50" style={{ fontSize: "11px" }}>
                  {value2Note}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div
      id={id}
      className="flex items-center gap-10 rounded-2xl"
      style={{
        padding: "40px 48px",
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,213,100,0.12)",
        scrollMarginTop: "100px",
        flexDirection: imageRight ? "row-reverse" : "row",
      }}
    >
      {/* Award badge: podium background + gold label overlay */}
      <div style={{ position: "relative", width: 220, height: 220, flexShrink: 0 }}>
        <Image
          src="/images/awards/card-bg-texture.png"
          alt=""
          fill
          sizes="220px"
          style={{ objectFit: "contain" }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 30px",
          }}
        >
          <Image
            src={`/images/awards/${id}.png`}
            alt={badgeLabel}
            width={165}
            height={80}
            style={{ objectFit: "contain" }}
          />
        </div>
      </div>
      {content}
    </div>
  );
}
