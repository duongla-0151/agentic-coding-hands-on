"use client";

import Image from "next/image";

const FONT = "var(--font-montserrat), Montserrat, sans-serif";
const YELLOW = "#FFEA9E";

// Figma: Keyvisual 1440×512px — exact crop + overlay
const KV_BG = "url('/images/keyvisual/keyvisual-bg.png') lightgray -0.163px -909.862px / 101.245% 393.038% no-repeat";
const KV_OVERLAY = "linear-gradient(25deg, #00101A 14.74%, rgba(0,19,32,0.00) 47.8%)";

// Figma: MM_MEDIA_Pen (24×24 yellow)
function PenIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill={YELLOW} />
    </svg>
  );
}

// Figma: MM_MEDIA_Search (24×24 yellow)
function SearchIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
      <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" fill={YELLOW} />
    </svg>
  );
}

interface KudosHeroProps {
  onWriteClick: () => void;
}

export function KudosHero({ onWriteClick }: KudosHeroProps) {
  return (
    <section
      style={{
        position: "relative",
        overflow: "hidden",
        height: 512,
        display: "flex",
        flexDirection: "column",
        padding: "0 144px",
        background: `${KV_OVERLAY}, ${KV_BG}`,
      }}
    >
      {/* Text + Logo — Figma: A_KV Kudos at Y=184 */}
      <div style={{ paddingTop: 184 }}>
        {/* Figma: fontSize 36, fontWeight 700, color rgba(255,234,158,1) */}
        <p
          style={{
            fontFamily: FONT,
            fontSize: 36,
            fontWeight: 700,
            color: YELLOW,
            margin: "0 0 10px 0",
            lineHeight: "44px",
            letterSpacing: 0,
          }}
        >
          Hệ thống ghi nhận và cảm ơn
        </p>

        {/* Figma: MM_MEDIA_Kudos logo 593×104px */}
        <Image
          src="/images/keyvisual/kudos-logo.svg"
          alt="Sun* KUDOS"
          width={580}
          height={102}
          style={{ objectFit: "contain", objectPosition: "left", width: "auto", height: "auto", maxWidth: 580 }}
        />
      </div>

      {/* Pills row — Figma: Button chuc nang at Y=408, paddingBottom=32 */}
      <div
        style={{
          display: "flex",
          gap: 32,
          marginTop: "auto",
          paddingBottom: 32,
        }}
      >
        {/* Write kudos pill — Figma: A.1_Button ghi nhận, width 738px → flex:1 */}
        <button
          type="button"
          onClick={onWriteClick}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            background: "rgba(255,234,158,0.10)",
            border: "1px solid #998C5F",
            borderRadius: 999,
            height: 72,
            padding: "0 16px",
            cursor: "pointer",
            flex: 1,
            textAlign: "left",
            minWidth: 0,
          }}
          aria-label="Mở form viết Kudos"
        >
          <PenIcon />
          <span
            style={{
              fontFamily: FONT,
              fontSize: 16,
              fontWeight: 700,
              color: "#fff",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            Hôm nay, bạn muốn gửi lời cảm ơn và ghi nhận đến ai?
          </span>
        </button>

        {/* Search Sunner pill — Figma: Tìm kiếm sunner, width 381px */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            background: "rgba(255,234,158,0.10)",
            border: "1px solid #998C5F",
            borderRadius: 999,
            height: 72,
            padding: "0 16px",
            flex: "0 0 381px",
          }}
        >
          <SearchIcon />
          <span
            style={{
              fontFamily: FONT,
              fontSize: 16,
              fontWeight: 700,
              color: "#fff",
            }}
          >
            Tìm kiếm profile Sunner
          </span>
        </div>
      </div>
    </section>
  );
}
