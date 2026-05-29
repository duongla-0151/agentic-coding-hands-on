"use client";

const FONT = "var(--font-montserrat), Montserrat, sans-serif";
const YELLOW = "#FFEA9E";
const CARD_BG = "#00070C";
const CARD_BORDER = "1px solid #998C5F";
const SEPARATOR = "1px solid rgba(153,140,95,0.35)";

interface ProfileStats {
  received: number;
  sent: number;
  hearts: number;
  secret_boxes_opened: number;
  secret_boxes_available: number;
}

interface ProfileStatsProps {
  stats: ProfileStats;
  onOpenSecretBox?: () => void;
}

function StatRow({ label, value }: { label: string; value: number }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
      }}
    >
      <span
        style={{
          fontFamily: FONT,
          fontSize: 14,
          fontWeight: 600,
          color: "rgba(255,255,255,0.7)",
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily: FONT,
          fontSize: 18,
          fontWeight: 700,
          color: YELLOW,
          flexShrink: 0,
        }}
      >
        {value}
      </span>
    </div>
  );
}

export function ProfileStats({ stats, onOpenSecretBox }: ProfileStatsProps) {
  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "0 16px 32px" }}>
      <div
        style={{
          background: CARD_BG,
          border: CARD_BORDER,
          borderRadius: 16,
          padding: "24px 28px",
          width: "100%",
          maxWidth: 400,
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        <StatRow label="Số Kudos bạn nhận được:" value={stats.received} />
        <StatRow label="Số Kudos bạn đã gửi:" value={stats.sent} />
        <StatRow label="Số tim bạn nhận được: ❤️" value={stats.hearts} />

        {/* Separator */}
        <div style={{ height: 1, background: SEPARATOR, margin: "2px 0" }} />

        <StatRow label="Secret Box bạn đã mở:" value={stats.secret_boxes_opened} />
        <StatRow label="Secret Box chưa mở:" value={stats.secret_boxes_available} />

        {/* CTA button */}
        <button
          type="button"
          onClick={onOpenSecretBox}
          style={{
            marginTop: 4,
            width: "100%",
            height: 48,
            borderRadius: 999,
            background: YELLOW,
            border: "none",
            fontFamily: FONT,
            fontSize: 15,
            fontWeight: 700,
            color: "#00101A",
            cursor: "pointer",
            letterSpacing: "0.3px",
          }}
        >
          Mở Secret Box 🎁
        </button>
      </div>
    </div>
  );
}
