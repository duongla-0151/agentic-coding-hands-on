"use client";

const FONT = "var(--font-montserrat), Montserrat, sans-serif";

interface Recipient {
  id: string;
  name: string;
  kudos_count: number;
}

interface SpotlightWordCloudProps {
  recipients: Recipient[];
  maxCount: number;
}

function hashFrac(s: string, salt: number): number {
  let h = salt;
  for (let i = 0; i < s.length; i++) {
    h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h % 1000) / 1000;
}

function cloudFontSize(count: number, max: number): number {
  if (max === 0) return 14;
  return Math.round(14 + (count / max) * 22);
}

function cloudColor(index: number): string {
  const COLORS = [
    "#ffffff",
    "rgba(255,234,158,0.9)",
    "rgba(255,255,255,0.6)",
    "rgba(255,234,158,0.6)",
    "rgba(255,255,255,0.45)",
  ];
  return COLORS[index % COLORS.length];
}

export function SpotlightWordCloud({ recipients, maxCount }: SpotlightWordCloudProps) {
  if (recipients.length === 0) {
    return (
      <p
        style={{
          fontFamily: FONT,
          fontSize: 14,
          color: "rgba(255,255,255,0.35)",
          textAlign: "center",
          paddingTop: 60,
        }}
      >
        Chưa có dữ liệu
      </p>
    );
  }

  return (
    <>
      {recipients.map((r, i) => {
        const xFrac = hashFrac(r.name, 7 + i);
        const yFrac = hashFrac(r.name, 13 + i);
        const x = 5 + xFrac * 85;
        const y = 5 + yFrac * 80;
        const fs = cloudFontSize(r.kudos_count, maxCount);

        return (
          <span
            key={r.id}
            title={`${r.name}: ${r.kudos_count} kudos`}
            style={{
              position: "absolute",
              left: `${x}%`,
              top: `${y}%`,
              fontFamily: FONT,
              fontSize: fs,
              fontWeight: r.kudos_count >= maxCount * 0.7 ? 700 : 400,
              color: cloudColor(i),
              whiteSpace: "nowrap",
              userSelect: "none",
              cursor: "default",
              transform: "translate(-50%, -50%)",
            }}
          >
            {r.name}
          </span>
        );
      })}
    </>
  );
}
