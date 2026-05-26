"use client";

import { useState, useMemo } from "react";
import { SpotlightWordCloud } from "./spotlight-word-cloud";

const FONT = "var(--font-montserrat), Montserrat, sans-serif";
const CARD_BG = "rgba(255,255,255,0.04)";
const CARD_BORDER = "1px solid rgba(255,255,255,0.1)";
const YELLOW = "#FFEA9E";

interface Recipient {
  id: string;
  name: string;
  kudos_count: number;
}

interface SpotlightBoardProps {
  total: number;
  recipients: Recipient[];
}

export function SpotlightBoard({ total, recipients }: SpotlightBoardProps) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(
    () =>
      search.trim()
        ? recipients.filter((r) =>
            r.name.toLowerCase().includes(search.trim().toLowerCase())
          )
        : recipients,
    [recipients, search]
  );

  const maxCount = useMemo(
    () => Math.max(1, ...recipients.map((r) => r.kudos_count)),
    [recipients]
  );

  return (
    <div style={{ padding: "0 144px", marginTop: 48 }}>
      {/* Section header */}
      <div style={{ marginBottom: 24 }}>
        <p
          style={{
            fontFamily: FONT,
            fontSize: 13,
            fontWeight: 600,
            color: "rgba(255,255,255,0.5)",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            margin: "0 0 4px 0",
          }}
        >
          Sun* Annual Awards 2025
        </p>
        <h2
          style={{
            fontFamily: FONT,
            fontSize: 28,
            fontWeight: 900,
            color: "#fff",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            margin: 0,
          }}
        >
          SPOTLIGHT BOARD
        </h2>
      </div>

      {/* Card */}
      <div
        style={{
          background: CARD_BG,
          border: CARD_BORDER,
          borderRadius: 16,
          overflow: "hidden",
        }}
      >
        {/* Top bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 24px",
            borderBottom: CARD_BORDER,
            gap: 16,
          }}
        >
          <span
            style={{
              fontFamily: FONT,
              fontSize: 18,
              fontWeight: 900,
              color: YELLOW,
              letterSpacing: "0.05em",
            }}
          >
            {total} KUDOS
          </span>
          <input
            type="text"
            placeholder="Tìm tên..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              fontFamily: FONT,
              fontSize: 13,
              color: "#fff",
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: 999,
              padding: "6px 16px",
              outline: "none",
              width: 180,
            }}
          />
        </div>

        {/* Word cloud */}
        <div
          style={{
            position: "relative",
            minHeight: 320,
            padding: 24,
            overflow: "hidden",
          }}
        >
          <SpotlightWordCloud recipients={filtered} maxCount={maxCount} />
        </div>
      </div>
    </div>
  );
}
