"use client";

import { useState } from "react";

const FONT = "var(--font-montserrat), Montserrat, sans-serif";

interface FilterBarProps {
  hashtags: string[];
  selected: string | null;
  onSelect: (h: string | null) => void;
}

export function FilterBar({ hashtags, selected, onSelect }: FilterBarProps) {
  const [dropOpen, setDropOpen] = useState(false);

  function toggleHashtag(tag: string) {
    onSelect(selected === tag ? null : tag);
    setDropOpen(false);
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "0 144px",
        marginBottom: 32,
        position: "relative",
      }}
    >
      {/* Hashtag dropdown */}
      <div style={{ position: "relative" }}>
        <button
          type="button"
          onClick={() => setDropOpen((v) => !v)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontFamily: FONT,
            fontSize: 14,
            fontWeight: 600,
            color: selected ? "#00101A" : "#fff",
            background: selected ? "#FFEA9E" : "rgba(255,255,255,0.08)",
            border: "1.5px solid rgba(255,255,255,0.2)",
            borderRadius: 999,
            padding: "8px 18px",
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}
          aria-haspopup="listbox"
          aria-expanded={dropOpen}
        >
          <span>{selected ? `#${selected}` : "Hashtag"}</span>
          <span style={{ fontSize: 11, opacity: 0.7 }}>▾</span>
        </button>

        {dropOpen && (
          <div
            style={{
              position: "absolute",
              top: "calc(100% + 6px)",
              left: 0,
              zIndex: 20,
              background: "#0D1F2D",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: 12,
              overflow: "hidden",
              minWidth: 180,
              maxHeight: 280,
              overflowY: "auto",
              boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
            }}
            role="listbox"
          >
            {/* Clear option */}
            {selected && (
              <div
                role="option"
                aria-selected={false}
                onClick={() => { onSelect(null); setDropOpen(false); }}
                style={{
                  fontFamily: FONT,
                  fontSize: 13,
                  color: "rgba(255,255,255,0.5)",
                  padding: "10px 16px",
                  cursor: "pointer",
                  borderBottom: "1px solid rgba(255,255,255,0.08)",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.06)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = ""; }}
              >
                Xóa bộ lọc
              </div>
            )}
            {hashtags.length === 0 && (
              <div
                style={{
                  fontFamily: FONT,
                  fontSize: 13,
                  color: "rgba(255,255,255,0.4)",
                  padding: "12px 16px",
                }}
              >
                Chưa có hashtag
              </div>
            )}
            {hashtags.map((tag) => (
              <div
                key={tag}
                role="option"
                aria-selected={selected === tag}
                onClick={() => toggleHashtag(tag)}
                style={{
                  fontFamily: FONT,
                  fontSize: 13,
                  color: selected === tag ? "#FFEA9E" : "#fff",
                  background: selected === tag ? "rgba(255,234,158,0.1)" : "transparent",
                  padding: "10px 16px",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  if (selected !== tag) (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.06)";
                }}
                onMouseLeave={(e) => {
                  if (selected !== tag) (e.currentTarget as HTMLDivElement).style.background = "transparent";
                }}
              >
                #{tag}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Phòng ban — disabled */}
      <div style={{ position: "relative" }}>
        <button
          type="button"
          disabled
          title="Sắp ra mắt"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontFamily: FONT,
            fontSize: 14,
            fontWeight: 600,
            color: "rgba(255,255,255,0.3)",
            background: "rgba(255,255,255,0.04)",
            border: "1.5px solid rgba(255,255,255,0.1)",
            borderRadius: 999,
            padding: "8px 18px",
            cursor: "not-allowed",
            whiteSpace: "nowrap",
          }}
          aria-label="Phòng ban — Sắp ra mắt"
        >
          <span>Phòng ban</span>
          <span style={{ fontSize: 11, opacity: 0.5 }}>▾</span>
        </button>
        <span
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            left: "50%",
            transform: "translateX(-50%)",
            fontFamily: FONT,
            fontSize: 11,
            color: "rgba(255,255,255,0.5)",
            whiteSpace: "nowrap",
            pointerEvents: "none",
          }}
        >
          Sắp ra mắt
        </span>
      </div>

      {/* Close dropdown on outside click */}
      {dropOpen && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 10 }}
          onClick={() => setDropOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
