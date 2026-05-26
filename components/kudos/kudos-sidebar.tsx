"use client";

import { useState, useEffect } from "react";
import { KudosStatsCard, type KudosStats } from "./kudos-stats-card";

const FONT = "var(--font-montserrat), Montserrat, sans-serif";
const CARD_BG = "rgba(255,255,255,0.04)";
const CARD_BORDER = "1px solid rgba(255,255,255,0.1)";
const YELLOW = "#FFEA9E";

interface SpotlightRecipient {
  id: string;
  name: string;
  kudos_count: number;
}

interface KudosSidebarProps {
  userId: string;
}

export function KudosSidebar({ userId: _userId }: KudosSidebarProps) {
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

      {/* Leaderboard */}
      <div
        style={{
          background: CARD_BG,
          border: CARD_BORDER,
          borderRadius: 16,
          padding: "20px 24px",
        }}
      >
        <h3
          style={{
            fontFamily: FONT,
            fontSize: 13,
            fontWeight: 900,
            color: YELLOW,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            margin: "0 0 16px 0",
          }}
        >
          10 SUNNER NHẬN QUÀ MỚI NHẤT
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
              <li
                key={r.id}
                style={{ display: "flex", alignItems: "center", gap: 10 }}
              >
                <span
                  style={{
                    fontFamily: FONT,
                    fontSize: 13,
                    fontWeight: 700,
                    color: i < 3 ? YELLOW : "rgba(255,255,255,0.35)",
                    width: 20,
                    flexShrink: 0,
                    textAlign: "center",
                  }}
                >
                  {i + 1}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
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
              </li>
            ))}
          </ol>
        )}
      </div>
    </aside>
  );
}
