"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { KudosStatsCard, type KudosStats } from "./kudos-stats-card";
import { HeroBadgeChip } from "./hero-badge-chip";

const FONT = "var(--font-montserrat), Montserrat, sans-serif";
const CARD_BG = "#00070C";
const CARD_BORDER = "1px solid #998C5F";
const YELLOW = "#FFEA9E";

interface SpotlightRecipient {
  id: string;
  name: string;
  avatar: string | null;
  kudos_count: number;
}

interface KudosSidebarProps {
  userId: string;
}

export function KudosSidebar({ userId: _userId }: KudosSidebarProps) {
  const pathname = usePathname();
  const locale = pathname.split("/")[1] ?? "vi";
  const [stats, setStats] = useState<KudosStats | null>(null);
  const [leaderboard, setLeaderboard] = useState<SpotlightRecipient[]>([]);

  useEffect(() => {
    fetch("/api/kudos/stats")
      .then((r) => r.json())
      .then((d: KudosStats) => setStats(d))
      .catch(() => {/* silent */});

    fetch("/api/kudos/spotlight")
      .then((r) => r.json())
      .then((d: { total: number; recipients: SpotlightRecipient[] }) => {
        const sorted = [...(d.recipients ?? [])].sort(
          (a, b) => b.kudos_count - a.kudos_count
        );
        setLeaderboard(sorted.slice(0, 10));
      })
      .catch(() => {/* silent */});
  }, []);

  return (
    <aside style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <KudosStatsCard stats={stats} />

      {/* Leaderboard — D.3 */}
      <div
        style={{
          background: CARD_BG,
          border: CARD_BORDER,
          borderRadius: 17,
          padding: "20px 16px 24px 24px",
        }}
      >
        {/* D.4: hashtag "IDOL GIỚI TRẺ" */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
          <span
            style={{
              fontFamily: FONT,
              fontSize: 11,
              fontWeight: 700,
              color: YELLOW,
              background: "rgba(255,234,158,0.08)",
              border: "1px solid rgba(255,234,158,0.35)",
              borderRadius: 999,
              padding: "3px 12px",
              letterSpacing: "0.5px",
              textTransform: "uppercase",
            }}
          >
            #IDOL GIỚI TRẺ
          </span>
        </div>

        <h3
          style={{
            fontFamily: FONT,
            fontSize: 22,
            fontWeight: 700,
            color: YELLOW,
            textAlign: "center",
            margin: "0 0 16px 0",
            lineHeight: "28px",
          }}
        >
          10 SUNNER NHẬN QUÀ<br />MỚI NHẤT
        </h3>

        {leaderboard.length === 0 ? (
          <p
            style={{
              fontFamily: FONT,
              fontSize: 13,
              color: "rgba(255,255,255,0.35)",
              textAlign: "center",
              padding: "16px 0",
            }}
          >
            Chưa có dữ liệu
          </p>
        ) : (
          <ol
            style={{
              margin: 0,
              padding: 0,
              listStyle: "none",
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            {leaderboard.map((r, i) => (
              <li key={r.id}>
              <a
                href={`/${locale}/profile/${r.id}`}
                style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}
              >
                {/* Avatar */}
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    overflow: "hidden",
                    flexShrink: 0,
                    background: "rgba(255,234,158,0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 16,
                    color: YELLOW,
                    fontFamily: FONT,
                    fontWeight: 700,
                    border: i < 3 ? `1.5px solid ${YELLOW}` : "1.5px solid rgba(255,255,255,0.15)",
                  }}
                >
                  {r.avatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={r.avatar} alt={r.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    r.name.charAt(0).toUpperCase()
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                    <p
                      style={{
                        fontFamily: FONT,
                        fontSize: 13,
                        fontWeight: 600,
                        color: "#fff",
                        margin: 0,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {r.name}
                    </p>
                    <HeroBadgeChip kudosCount={r.kudos_count} tooltipPosition="top" />
                  </div>
                  <p
                    style={{
                      fontFamily: FONT,
                      fontSize: 11,
                      color: "rgba(255,255,255,0.4)",
                      margin: 0,
                    }}
                  >
                    Nhận được {r.kudos_count} kudos
                  </p>
                </div>
              </a>
              </li>
            ))}
          </ol>
        )}
      </div>
    </aside>
  );
}
