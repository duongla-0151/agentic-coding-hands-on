"use client";

import { useState } from "react";
import type { UserInfo } from "@/lib/kudos/types";
import { HeroBadgeChip } from "./hero-badge-chip";

const FONT = "var(--font-montserrat), Montserrat, sans-serif";
const YELLOW = "#FFEA9E";

interface KudosCardUserProps {
  user: UserInfo | null;
  anonymousName: string | null;
  kudosCount?: number;
  badge?: string;
  size?: "sm" | "md";
  light?: boolean;
  /** show hover tooltip with user info — applies to recipient (C.3.3) */
  showHoverCard?: boolean;
}

export function KudosCardUser({
  user,
  anonymousName,
  kudosCount,
  badge,
  size = "md",
  light = false,
  showHoverCard = false,
}: KudosCardUserProps) {
  const [hovered, setHovered] = useState(false);
  const avatarSize = size === "sm" ? 32 : 40;
  const name = user?.name ?? anonymousName ?? "Ẩn danh";
  const initial = name.charAt(0).toUpperCase();
  const nameColor = light ? "rgba(0,16,26,0.9)" : "#fff";
  const deptColor = light ? "rgba(0,16,26,0.5)" : "rgba(255,255,255,0.5)";

  return (
    <div
      style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0, position: "relative" }}
      onMouseEnter={() => showHoverCard && setHovered(true)}
      onMouseLeave={() => showHoverCard && setHovered(false)}
    >
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
          <img
            src={user.avatar}
            alt={name}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          initial
        )}
      </div>

      {/* Name + stars + department + badge */}
      <div style={{ minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <span
            style={{
              fontFamily: FONT,
              fontSize: size === "sm" ? 12 : 14,
              fontWeight: 700,
              color: nameColor,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: 140,
            }}
          >
            {name}
          </span>
          {kudosCount !== undefined && kudosCount > 0 && (
            <HeroBadgeChip kudosCount={kudosCount} tooltipPosition="top" />
          )}
        </div>

        {/* Department — C.3.3 "tên và đơn vị" */}
        {user?.department && (
          <span
            style={{
              display: "block",
              fontFamily: FONT,
              fontSize: 11,
              color: deptColor,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: 160,
              marginTop: 1,
            }}
          >
            {user.department}
          </span>
        )}

        {badge && (
          <span
            style={{
              display: "inline-block",
              marginTop: 3,
              fontFamily: FONT,
              fontSize: 11,
              fontWeight: 700,
              color: "#00101A",
              background: YELLOW,
              borderRadius: 999,
              padding: "2px 10px",
              whiteSpace: "nowrap",
              maxWidth: 180,
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {badge}
          </span>
        )}
      </div>

      {/* Hover card tooltip — "Hover Avatar info user" (C.3.3 transition) */}
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
          {/* Large avatar */}
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
            <p
              style={{
                fontFamily: FONT,
                fontSize: 14,
                fontWeight: 700,
                color: "#fff",
                margin: 0,
              }}
            >
              {name}
            </p>
            {user.department && (
              <p
                style={{
                  fontFamily: FONT,
                  fontSize: 12,
                  color: "rgba(255,255,255,0.55)",
                  margin: "3px 0 0",
                }}
              >
                {user.department}
              </p>
            )}
            {kudosCount !== undefined && kudosCount > 0 && (
              <p
                style={{
                  fontFamily: FONT,
                  fontSize: 11,
                  color: YELLOW,
                  margin: "4px 0 0",
                }}
              >
                ★ {kudosCount} kudos nhận được
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
