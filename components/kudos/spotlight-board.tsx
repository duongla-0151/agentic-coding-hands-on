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
            fontSize: 24,
            fontWeight: 700,
            color: "#fff",
            margin: "0 0 4px 0",
          }}
        >
          Sun* Annual Awards 2025
        </p>
        <div style={{ height: 1, background: "rgba(46,57,64,1)", margin: "4px 0 8px" }} />
        <h2
          style={{
            fontFamily: FONT,
            fontSize: 57,
            fontWeight: 700,
            color: "#FFEA9E",
            letterSpacing: "-0.25px",
            textTransform: "uppercase",
            margin: 0,
            lineHeight: "64px",
          }}
        >
          SPOTLIGHT BOARD
        </h2>
      </div>

      {/* Card */}
      <div
        style={{
          border: "1px solid #998C5F",
          borderRadius: 47,
          height: 548,
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Mirrored KV background image — CSS background on absolute div so height stays fixed */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background: "url('/images/keyvisual/keyvisual-bg.png') center / cover no-repeat",
            transform: "scaleX(-1)",
            opacity: 0.55,
            zIndex: 0,
          }}
        />
        {/* Gradient overlay */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(0deg, rgba(0,0,0,0.70) 0%, rgba(0,0,0,0.70) 100%)",
            zIndex: 1,
          }}
        />
        {/* Top bar: search LEFT | count CENTER | pan-zoom RIGHT */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "16px 24px",
            borderBottom: CARD_BORDER,
            gap: 16,
            position: "relative",
            zIndex: 2,
          }}
        >
          {/* Search — left */}
          <input
            type="text"
            placeholder="Tìm kiếm Sunner..."
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
              flexShrink: 0,
            }}
          />

          {/* Kudos count — center */}
          <span
            style={{
              fontFamily: FONT,
              fontSize: 36,
              fontWeight: 700,
              color: YELLOW,
              letterSpacing: "0.05em",
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              whiteSpace: "nowrap",
            }}
          >
            {total} KUDOS
          </span>

          {/* Pan/Zoom placeholder — right */}
          <button
            type="button"
            title="Pan & Zoom"
            style={{
              marginLeft: "auto",
              width: 30,
              height: 30,
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: 4,
              color: "rgba(255,255,255,0.6)",
              fontSize: 14,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
            aria-label="Pan & Zoom"
          >
            ⛶
          </button>
        </div>

        {/* Word cloud */}
        <div
          style={{
            position: "relative",
            minHeight: 320,
            padding: 24,
            overflow: "hidden",
            zIndex: 2,
          }}
        >
          <SpotlightWordCloud recipients={filtered} maxCount={maxCount} />
        </div>
      </div>
    </div>
  );
}
