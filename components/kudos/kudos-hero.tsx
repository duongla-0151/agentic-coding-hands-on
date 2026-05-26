"use client";

import Image from "next/image";

const FONT = "var(--font-montserrat), Montserrat, sans-serif";
const BG = "#00101A";
const YELLOW = "#FFEA9E";

interface KudosHeroProps {
  onWriteClick: () => void;
}

export function KudosHero({ onWriteClick }: KudosHeroProps) {
  return (
    <section
      style={{
        background: BG,
        position: "relative",
        overflow: "hidden",
        minHeight: 360,
        display: "flex",
        alignItems: "center",
        padding: "80px 144px 60px",
      }}
    >
      {/* Decorative background image — right side */}
      <div
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          bottom: 0,
          width: "55%",
          pointerEvents: "none",
        }}
      >
        <Image
          src="/images/keyvisual/kudos-section-bg.png"
          alt=""
          fill
          sizes="55vw"
          style={{ objectFit: "cover", objectPosition: "left center", opacity: 0.7 }}
          priority
        />
        {/* Fade overlay from left */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to right, #00101A 0%, transparent 50%)",
          }}
        />
      </div>

      {/* Left content */}
      <div style={{ position: "relative", zIndex: 1, maxWidth: 600 }}>
        <p
          style={{
            fontFamily: FONT,
            fontSize: 20,
            fontWeight: 700,
            color: "rgba(255,255,255,0.85)",
            margin: "0 0 16px 0",
            letterSpacing: "0.5px",
          }}
        >
          Hệ thống ghi nhận và cảm ơn
        </p>

        <div style={{ marginBottom: 32 }}>
          <Image
            src="/images/keyvisual/kudos-logo.svg"
            alt="Sun* KUDOS"
            width={280}
            height={80}
            style={{ objectFit: "contain", objectPosition: "left", width: "auto", height: "auto", maxWidth: 280 }}
          />
        </div>

        {/* Pill input */}
        <button
          type="button"
          onClick={onWriteClick}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            background: "rgba(255,255,255,0.06)",
            border: `1.5px solid #998C5F`,
            borderRadius: 999,
            height: 56,
            padding: "0 24px",
            cursor: "pointer",
            width: "100%",
            maxWidth: 560,
            textAlign: "left",
          }}
          aria-label="Mở form viết Kudos"
        >
          <span
            style={{
              fontSize: 18,
              color: YELLOW,
              flexShrink: 0,
              lineHeight: 1,
            }}
            aria-hidden="true"
          >
            ✏
          </span>
          <span
            style={{
              fontFamily: FONT,
              fontSize: 14,
              color: "rgba(255,255,255,0.45)",
              flex: 1,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            Hôm nay, bạn muốn gửi lời cảm ơn và ghi nhận đến ai?
          </span>
        </button>
      </div>
    </section>
  );
}
