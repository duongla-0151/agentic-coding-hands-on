"use client";

import { useState } from "react";
import type { UserInfo } from "@/lib/kudos/types";
import { getHeroBadge } from "@/lib/kudos/hero-badge";

const FONT = "var(--font-montserrat), Montserrat, sans-serif";
const YELLOW = "#FFEA9E";

interface KudosCardUserProps {
  user: UserInfo | null;
  anonymousName: string | null;
  kudosCount?: number;
  /** The kudo award title (danh hiệu) shown on second line */
  badgeLabel?: string;
  size?: "sm" | "md";
  light?: boolean;
  /** show hover tooltip with user info — applies to recipient (C.3.3) */
  showHoverCard?: boolean;
  /** When provided, avatar + name become a clickable link to this URL */
  profileHref?: string;
}

export function KudosCardUser({
  user,
  anonymousName,
  kudosCount,
  badgeLabel: _badgeLabel,
  size = "md",
  light = false,
  showHoverCard = false,
  profileHref,
}: KudosCardUserProps) {
  const [hovered, setHovered] = useState(false);
  const avatarSize = size === "sm" ? 32 : 40;
  const name = user?.name ?? anonymousName ?? "Ẩn danh";
  const initial = name.charAt(0).toUpperCase();
  const nameColor = light ? "rgba(0,16,26,0.9)" : "#fff";
  const deptColor = light ? "rgba(0,16,26,0.5)" : "rgba(255,255,255,0.5)";

  const sharedProps = {
    onMouseEnter: () => showHoverCard && setHovered(true),
    onMouseLeave: () => showHoverCard && setHovered(false),
  };

  const baseStyle = {
    display: "flex" as const,
    alignItems: "center" as const,
    gap: 10,
    minWidth: 0,
    position: "relative" as const,
  };

  const inner = (
    <>
      {/* Avatar */}
      <div
        style={{
          width: avatarSize,
          height: avatarSize,
          borderRadius: "50%",
          overflow: "hidden",
          flexShrink: 0,
          background: light ? "rgba(139,105,20,0.15)" : "rgba(255,234,158,0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: avatarSize * 0.4,
          color: light ? "#8B6914" : YELLOW,
          fontFamily: FONT,
          fontWeight: 700,
        }}
      >
        {user?.avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={user.avatar} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          initial
        )}
      </div>

      {/* Name + department + badge */}
      <div style={{ minWidth: 0 }}>
        <span
          style={{
            display: "block",
            fontFamily: FONT,
            fontSize: size === "sm" ? 12 : 14,
            fontWeight: 700,
            color: nameColor,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            maxWidth: 160,
          }}
        >
          {name}
        </span>

        {(user?.department || (kudosCount !== undefined && kudosCount > 0)) && (
          <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 2, minWidth: 0 }}>
            {user?.department && (
              <span
                style={{
                  fontFamily: FONT,
                  fontSize: 11,
                  color: deptColor,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: 100,
                }}
              >
                {user.department}
              </span>
            )}
            {kudosCount !== undefined && kudosCount > 0 && (() => {
              const heroBadge = getHeroBadge(kudosCount);
              return heroBadge ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={`/images/hero-badges/${heroBadge.tier}.png`}
                  alt={heroBadge.label}
                  style={{ height: 18, width: "auto", objectFit: "contain", flexShrink: 0 }}
                />
              ) : null;
            })()}
          </div>
        )}
      </div>

      {/* Hover card tooltip (C.3.3) */}
      {showHoverCard && hovered && user && (
        <div
          style={{
            position: "absolute",
            bottom: "calc(100% + 8px)",
            left: 0,
            zIndex: 50,
            background: "#0D1F2D",
            border: "1px solid rgba(255,234,158,0.2)",
            borderRadius: 16,
            padding: "16px 20px",
            minWidth: 200,
            boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              overflow: "hidden",
              background: "rgba(255,234,158,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 24,
              color: YELLOW,
              fontFamily: FONT,
              fontWeight: 700,
              border: "2px solid rgba(255,234,158,0.3)",
              flexShrink: 0,
            }}
          >
            {user.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.avatar} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              initial
            )}
          </div>
          <div style={{ textAlign: "center" }}>
            <p style={{ fontFamily: FONT, fontSize: 14, fontWeight: 700, color: "#fff", margin: 0 }}>{name}</p>
            {user.department && (
              <p style={{ fontFamily: FONT, fontSize: 12, color: "rgba(255,255,255,0.55)", margin: "3px 0 0" }}>
                {user.department}
              </p>
            )}
            {kudosCount !== undefined && kudosCount > 0 && (
              <p style={{ fontFamily: FONT, fontSize: 11, color: YELLOW, margin: "4px 0 0" }}>
                ★ {kudosCount} kudos nhận được
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );

  if (profileHref) {
    return (
      <a href={profileHref} style={{ ...baseStyle, textDecoration: "none" }} {...sharedProps}>
        {inner}
      </a>
    );
  }

  return (
    <div style={baseStyle} {...sharedProps}>
      {inner}
    </div>
  );
}
