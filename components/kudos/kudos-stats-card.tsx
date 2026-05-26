"use client";

import { useState } from "react";

const FONT = "var(--font-montserrat), Montserrat, sans-serif";
const CARD_BG = "rgba(255,255,255,0.04)";
const CARD_BORDER = "1px solid rgba(255,255,255,0.1)";
const YELLOW = "#FFEA9E";

export interface KudosStats {
  received: number;
  sent: number;
  hearts: number;
  secret_boxes_opened: number;
  secret_boxes_available: number;
}

function StatRow({ label, value, icon }: { label: string; value: number; icon?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
      <span style={{ fontFamily: FONT, fontSize: 13, color: "rgba(255,255,255,0.65)", flex: 1 }}>
        {label}
      </span>
      <span style={{ fontFamily: FONT, fontSize: 16, fontWeight: 700, color: "#fff", display: "flex", alignItems: "center", gap: 4 }}>
        {icon && <span>{icon}</span>}
        {value}
      </span>
    </div>
  );
}

interface KudosStatsCardProps {
  stats: KudosStats | null;
}

export function KudosStatsCard({ stats }: KudosStatsCardProps) {
  const [secretBoxOpen, setSecretBoxOpen] = useState(false);

  return (
    <>
      <div style={{ background: CARD_BG, border: CARD_BORDER, borderRadius: 16, padding: "20px 24px", display: "flex", flexDirection: "column", gap: 12 }}>
        <StatRow label="Số Kudos bạn nhận được:" value={stats?.received ?? 0} />
        <StatRow label="Số Kudos bạn đã gửi:" value={stats?.sent ?? 0} />
        <StatRow label="Số tim bạn nhận được:" value={stats?.hearts ?? 0} icon="🔥" />
        <div style={{ height: 1, background: "rgba(255,255,255,0.1)", margin: "4px 0" }} />
        <StatRow label="Số Secret Box bạn đã mở:" value={stats?.secret_boxes_opened ?? 0} />
        <StatRow label="Số Secret Box chưa mở:" value={stats?.secret_boxes_available ?? 0} />
        <button
          type="button"
          onClick={() => setSecretBoxOpen(true)}
          style={{ marginTop: 4, fontFamily: FONT, fontSize: 14, fontWeight: 700, color: "#00101A", background: YELLOW, border: "none", borderRadius: 8, padding: "12px 0", cursor: "pointer", width: "100%" }}
        >
          Mở Secret Box 🎁
        </button>
      </div>

      {secretBoxOpen && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 60, background: "rgba(0,0,0,0.65)", display: "flex", alignItems: "center", justifyContent: "center" }}
          onClick={(e) => { if (e.target === e.currentTarget) setSecretBoxOpen(false); }}
        >
          <div style={{ background: "#0D1F2D", border: CARD_BORDER, borderRadius: 20, padding: "40px 48px", maxWidth: 400, width: "90vw", textAlign: "center", display: "flex", flexDirection: "column", gap: 16 }}>
            <span style={{ fontSize: 48 }}>🎁</span>
            <h2 style={{ fontFamily: FONT, fontSize: 22, fontWeight: 700, color: YELLOW, margin: 0 }}>
              Secret Box
            </h2>
            <p style={{ fontFamily: FONT, fontSize: 14, color: "rgba(255,255,255,0.65)", margin: 0, lineHeight: 1.6 }}>
              Tính năng Secret Box đang được phát triển. Hãy quay lại sau để nhận những phần quà bí ẩn!
            </p>
            <button
              type="button"
              onClick={() => setSecretBoxOpen(false)}
              style={{ fontFamily: FONT, fontSize: 14, fontWeight: 700, color: "#00101A", background: YELLOW, border: "none", borderRadius: 8, padding: "12px 0", cursor: "pointer", marginTop: 8 }}
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </>
  );
}
