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

function MedalBadge({ label }: { label: string }) {
  return (
    <div
      style={{
        width: 220,
        height: 220,
        borderRadius: "50%",
        background:
          "radial-gradient(ellipse at 35% 30%, #fff4b0 0%, #e8a820 30%, #a05c00 65%, #4a2800 100%)",
        boxShadow:
          "0 0 48px rgba(232,168,32,0.45), 0 0 12px rgba(232,168,32,0.25), inset 0 2px 6px rgba(255,240,160,0.3)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        position: "relative" as const,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 12,
          borderRadius: "50%",
          border: "1.5px solid rgba(255,235,140,0.5)",
        }}
      />
      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: 148,
          height: 148,
          borderRadius: "50%",
          background: "radial-gradient(ellipse at 40% 35%, #1a0d00 0%, #0a0500 100%)",
          border: "1px solid rgba(255,213,100,0.4)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "12px",
        }}
      >
        <span
          className="text-center uppercase font-black leading-tight"
          style={{
            fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
            fontSize: label.length > 12 ? "9px" : label.length > 8 ? "11px" : "13px",
            fontWeight: 900,
            color: "#FFEA9E",
            letterSpacing: "0.05em",
          }}
        >
          {label}
        </span>
      </div>
    </div>
  );
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
      <MedalBadge label={badgeLabel} />
      {content}
    </div>
  );
}
